/* ============================================================
   HTML templates, components and structured data (JSON-LD)
   ============================================================ */

const T = (() => {
  const C = CONFIG;
  const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const strip = (html = '') => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const abs = (p) => C.domain + p;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
  const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

  /* image source: real photo if provided, otherwise generated art */
  /* responsive photo from the PHOTOS library (src/photos.js) */
  function img(key, { cls = "", eager = false, sizes = "100vw", alt } = {}) {
    const ss = PH.srcset(key);
    return `<img class="${cls}" src="${PH.url(key, 1600)}"${ss ? ` srcset="${ss}" sizes="${sizes}"` : ""} alt="${esc(alt || PH.alt(key))}" width="1600" height="1067" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }
  const ogImg = (key) => { const u = PH.url(key, 1200, 630); return u.startsWith('/') ? abs(u) : u; };
  const credit = (key) => `<p class="credit">${PH.credit(key)}</p>`;

  /* ---------------- structured data ---------------- */
  const orgLd = { '@type': 'Organization', '@id': abs('/#org'), name: C.name, url: abs('/'), logo: abs('/favicon.svg'), sameAs: Object.values(C.social).filter(Boolean) };
  const authorLd = { '@type': 'Person', name: C.author.name, url: abs(C.author.url) };
  function crumbsLd(items) {
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })) };
  }
  function faqLd(faqs) {
    if (!faqs || !faqs.length) return null;
    return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  }

  /* ---------------- shared chrome ---------------- */
  function header(path) {
    const links = C.nav.map(([label, href]) => `<li><a href="${href}"${path.startsWith(href) && href !== '/' ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
    return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <a class="logo" href="/" aria-label="${C.name} home"><span class="logo-mark" aria-hidden="true"></span><span>Travel<b>Bahia</b></span></a>
  <nav aria-label="Main"><ul class="nav-links" id="nav">${links}</ul></nav>
  <button class="nav-toggle" aria-controls="nav" aria-expanded="false" data-nav-toggle><span></span><span></span><span class="sr">Menu</span></button>
</header>`;
  }

  function footer() {
    const dest = DESTINATIONS.slice(0, 6).map((d) => `<li><a href="/destinations/${d.slug}">${d.name}</a></li>`).join('');
    const arts = ARTICLES.slice(0, 5).map((a) => `<li><a href="/blog/${a.slug}">${a.title.split(':')[0]}</a></li>`).join('');
    return `<section class="newsletter reveal" aria-labelledby="nl-title">
  <div class="newsletter-inner">
    <p class="eyebrow">The Bahia Letter</p>
    <h2 id="nl-title">New places, honest tips, once a month.</h2>
    <form class="nl-form" data-newsletter action="https://assets.mailerlite.com/jsonp/1984183/forms/205093065057109445/subscribe" method="post">
      <label class="sr" for="nl-email">Email address</label>
      <input type="hidden" name="ml-submit" value="1"><input type="hidden" name="anticsrf" value="true">
      <input id="nl-email" type="email" name="fields[email]" placeholder="you@example.com" required autocomplete="email">
      <button class="btn btn-sun" type="submit">Subscribe</button>
    </form>
    <p class="nl-msg" role="status" aria-live="polite"></p>
    <p class="nl-consent">One email a month. Unsubscribe anytime. See our <a href="/privacy">privacy policy</a>.</p>
  </div>
</section>
<footer class="site-footer">
  <div class="foot-grid">
    <div><a class="logo" href="/"><span class="logo-mark" aria-hidden="true"></span><span>Travel<b>Bahia</b></span></a><p>${C.tagline}. Independent, written for U.S. travelers.</p></div>
    <div><h3>Destinations</h3><ul>${dest}</ul></div>
    <div><h3>Journal</h3><ul>${arts}</ul></div>
    <div><h3>About</h3><ul><li><a href="/about">About us</a></li><li><a href="/collaborations">Collaborations</a></li><li><a href="/stays/">Where to stay</a></li><li><a href="/collaborations#affiliate-disclosure">Affiliate disclosure</a></li><li><a href="/privacy">Privacy</a></li></ul></div>
  </div>
  <p class="fine">© ${new Date().getFullYear()} ${C.name}. Photography via Unsplash and our own travels; photographers credited on each image. Information is checked at time of writing; always confirm visa, health and safety rules with official sources.</p>
</footer>`;
  }

  function layout({ title, description, path, image, imageAlt, schema = [], body, noindex = false, type = 'website', article = null, bodyClass = '' }) {
    const url = abs(path);
    const fullTitle = path === '/' ? title : `${title} | ${C.name}`;
    const verif = (C.verification.google ? `<meta name="google-site-verification" content="${C.verification.google}">` : '') + (C.verification.bing ? `<meta name="msvalidate.01" content="${C.verification.bing}">` : '');
    const ga4 = C.analytics.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${C.analytics.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${C.analytics.ga4}');</script>` : '';
    const analytics = ga4 + (C.analytics.plausibleDomain ? `<script defer data-domain="${C.analytics.plausibleDomain}" src="https://plausible.io/js/script.js"></script>` : '');
    const art = article ? `<meta property="article:published_time" content="${article.date}"><meta property="article:modified_time" content="${article.updated || article.date}"><meta property="article:section" content="${esc(article.category || '')}">` : '';
    return `<!doctype html>
<html lang="${C.lang}">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js')</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
<link rel="alternate" hreflang="en-us" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="${C.name}"><meta property="og:locale" content="${C.locale}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${image}"><meta property="og:image:alt" content="${esc(imageAlt || title)}"><meta property="og:image:width" content="1600"><meta property="og:image:height" content="1000">
${art}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}">
<meta name="theme-color" content="#0b2f4a">
<meta name="geo.region" content="BR-BA"><meta name="geo.placename" content="Bahia, Brazil">
${verif}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
${schema.filter(Boolean).map(ld).join('\n')}
${analytics}
<script defer src="/assets/js/site.js"></script>
</head>
<body class="${bodyClass}">
${header(path)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>`;
  }

  /* ---------------- components ---------------- */
  function breadcrumbs(items) {
    return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([n, u], i) => i === items.length - 1 ? `<li aria-current="page">${n}</li>` : `<li><a href="${u}">${n}</a></li>`).join('')}</ol></nav>`;
  }

  function pageHero({ item, eyebrow, title, lede, crumbs, meta = '' }) {
    return `<section class="page-hero" data-parallax-root>
  <div class="page-hero-media" data-parallax="0.25">${img(item.photo, { eager: true })}</div>
  <div class="page-hero-shade"></div>
  <div class="page-hero-content">
    ${breadcrumbs(crumbs)}
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1 class="split" data-split>${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
    ${meta}
  </div>
  ${credit(item.photo)}
  <a class="scroll-cue" href="#content" aria-label="Scroll to content"><span></span></a>
</section>`;
  }

  function articleCard(a, { big = false } = {}) {
    return `<article class="card ${big ? 'card-big' : ''} reveal" data-tilt data-cat="${slugify(a.category)}">
  <a href="/blog/${a.slug}" class="card-link">
    <div class="card-media">${img(a.photo, { sizes: big ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 33vw, 100vw' })}</div>
    <div class="card-body"><p class="card-meta"><span class="tag">${a.category}</span> <span>${a.readMins} min read</span></p>
    <h3>${a.title}</h3>${big ? `<p>${a.description}</p>` : ''}</div>
  </a>
</article>`;
  }

  function destCard(d, i = 0) {
    return `<article class="dest-card reveal" data-tilt style="--i:${i}">
  <a href="/destinations/${d.slug}">
    ${img(d.card, { sizes: '(min-width: 900px) 30vw, 85vw' })}
    <div class="dest-card-body"><p class="eyebrow">${d.region}</p><h3>${d.name}</h3><p>${d.tagline}</p><span class="arrow" aria-hidden="true">→</span></div>
  </a>
</article>`;
  }

  function gallery(keys, heading, cls = '') {
    if (!keys || !keys.length) return '';
    return `<section class="gallery-wrap reveal" aria-label="${esc(heading)}"><h2>${heading}</h2><div class="gallery ${cls}">${keys.map((k, i) => `<figure class="g g-${i}">${img(k, { sizes: '(min-width: 900px) 40vw, 100vw' })}<figcaption>${PH.alt(k)} · ${PH.credit(k)}</figcaption></figure>`).join('')}</div></section>`;
  }
  function figure(key) {
    return `<figure class="inline-photo reveal-clip">${img(key, { sizes: '(min-width: 900px) 900px, 100vw' })}<figcaption>${PH.alt(key)} · ${PH.credit(key)}</figcaption></figure>`;
  }

  /* photos that belong to a specific section (src/photos.js → SECTION_PHOTOS) */
  function sectionMedia(item, heading) {
    const keys = (item.sectionPhotos || {})[heading];
    if (!keys || !keys.length) return '';
    // one content-width landscape photo per section
    return figure(keys[0]);
  }

  function faqBlock(faqs, heading = 'Frequently asked questions') {
    if (!faqs || !faqs.length) return '';
    return `<section class="faq reveal" aria-labelledby="faq-h"><h2 id="faq-h">${heading}</h2>${faqs.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</section>`;
  }

  function tldrBox(text, takeaways) {
    return `<aside class="tldr reveal" aria-label="Quick answer"><p class="eyebrow">Quick answer</p><p class="tldr-text">${text}</p>${takeaways ? `<ul class="takeaways">${takeaways.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}</aside>`;
  }

  function authorBox(updated) {
    return `<aside class="author reveal"><img class="avatar" src="${PH.url(PHOTO_ASSIGN.about.portrait)}" alt="" width="64" height="64"><div><p class="author-name">${C.author.name}</p><p>${C.author.bio}</p><p class="small">Last updated ${fmtDate(updated)} · <a href="/collaborations#editorial-policy">How we research</a></p></div></aside>`;
  }

  /* ---------------- pages ---------------- */

  function home() {
    const hero = DESTINATIONS.find((d) => d.slug === 'morro-de-sao-paulo');
    const salvador = DESTINATIONS.find((d) => d.slug === 'salvador');
    const morro = hero;
    const latest = ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));
    const mapPoints = DESTINATIONS.map((d) => ({ name: d.name, url: `/destinations/${d.slug}`, x: d.map.x, y: d.map.y, labelLeft: d.map.labelLeft, blurb: esc(d.tagline), img: PH.url(d.card, 600, 400) }));
    const homeFaq = [
      { q: 'Where is Bahia, Brazil?', a: 'Bahia is a state on Brazil’s northeastern Atlantic coast. Its capital, Salvador, is the main gateway; most U.S. travelers connect through São Paulo, Rio de Janeiro, Miami or Panama City. Bahia has the longest coastline of any Brazilian state.' },
      { q: 'What are the best places to visit in Bahia?', a: 'The most popular places in Bahia are Salvador, Morro de São Paulo, Chapada Diamantina, Itacaré, Praia do Forte, Trancoso, Boipeba and the Maraú Peninsula.' },
      { q: 'Do Americans need a visa to visit Brazil?', a: 'Yes. Since April 10, 2025, U.S. citizens need an e-visa for tourism, applied for online before travel.' },
      { q: 'When is the best time to visit Bahia?', a: 'September to March is best for beaches and sunshine. April to July is the rainy season on the coast, while Chapada Diamantina is best for hiking April to October.' },
    ];
    const body = `
<section class="hero" data-parallax-root>
  <div class="hero-media" data-parallax="0.35">${img(PHOTO_ASSIGN.home.hero, { eager: true })}</div>
  <div class="hero-shade"></div>
  ${credit(PHOTO_ASSIGN.home.hero)}
  <div class="hero-content">
    <p class="eyebrow reveal-now">Bahia · Brazil</p>
    <h1 class="hero-title" data-split>Bahia, the way it <em>feels.</em></h1>
    <p class="lede reveal-now">Turquoise natural pools, Afro-Brazilian rhythm, table-top mountains and car-free islands. The independent guide for Americans planning their first — or fifth — trip to Brazil’s most soulful state.</p>
    <div class="hero-ctas reveal-now"><a class="btn btn-sun magnetic" href="/destinations/">Explore destinations</a><a class="btn btn-ghost magnetic" href="/blog/bahia-10-day-itinerary/">10-day itinerary</a></div>
  </div>
  <a class="scroll-cue" href="#start" aria-label="Scroll down"><span></span></a>
</section>


<section class="intro-stats" id="start">
  <div class="wrap reveal">
    <p class="eyebrow">Why Bahia</p>
    <h2 class="display">Brazil’s longest coastline, its oldest city, and its deepest roots.</h2>
  </div>
  <div class="stats wrap">
    <div class="stat reveal"><b>1549</b><span>Salvador founded — Brazil’s first capital</span></div>
    <div class="stat reveal"><b>900+</b><span>km of coastline to explore</span></div>
    <div class="stat reveal"><b>82°F</b><span>average sea temperature, all year</span></div>
    <div class="stat reveal"><b>${DESTINATIONS.length}</b><span>destinations we cover in depth</span></div>
  </div>
</section>

<section class="spotlights" aria-label="Featured destinations">
  ${[salvador, morro].map((d, i) => `<article class="spot ${i % 2 ? 'spot-rev' : ''}">
    <div class="spot-media reveal-clip" data-parallax-root><div data-parallax="0.12">${img(d.card, { sizes: '(min-width: 900px) 60vw, 100vw' })}</div></div>
    <div class="spot-text reveal">
      <p class="eyebrow">${d.region}</p>
      <h2>${d.name}</h2>
      <p class="spot-tag">${d.tagline}</p>
      <p>${d.intro}</p>
      <ul class="chips">${d.highlights.slice(0, 4).map((h) => `<li>${h}</li>`).join('')}</ul>
      <a class="btn btn-dark magnetic" href="/destinations/${d.slug}">Read the ${d.name} guide</a>
    </div>
  </article>`).join('')}
</section>

<section class="story-band" data-parallax-root aria-labelledby="story-h">
  <div class="story-bg" data-parallax="0.18">${img(PHOTO_ASSIGN.home.storyBg, { alt: '' })}</div>
  <div class="story-shade"></div>
  <div class="wrap story-inner reveal">
    <img class="story-portrait" src="${PH.url(PHOTO_ASSIGN.about.portrait)}" alt="${esc(PH.alt(PHOTO_ASSIGN.about.portrait))}" width="160" height="160" loading="lazy">
    <div>
      <p class="eyebrow">Hi, we’re Liis &amp; Gleb</p>
      <h2 id="story-h" class="display">Warm seas, wild jungle and the rhythm of Bahia.</h2>
      <p>We travel for the moments that stop us in our tracks: floating over reefs in water so clear it looks unreal, following rainforest trails that open onto empty golden beaches, and watching the light turn the whole bay to gold at sunset. Along the way we cook with Brazil’s extraordinary seafood and tropical fruit, and let the street drummers set the pace. This guide is everything we discovered.</p>
      <a class="btn btn-sun magnetic" href="/about">Our story</a>
    </div>
  </div>
  ${credit(PHOTO_ASSIGN.home.storyBg)}
</section>

<section class="dest-rail" aria-labelledby="rail-h">
  <div class="wrap rail-head reveal"><div><p class="eyebrow">Destinations</p><h2 id="rail-h" class="display">Where will Bahia take you?</h2></div>
  <div class="rail-btns"><button class="round" data-rail-prev aria-label="Previous">←</button><button class="round" data-rail-next aria-label="Next">→</button></div></div>
  <div class="rail" data-rail tabindex="0" aria-label="Destination carousel">${DESTINATIONS.map(destCard).join('')}</div>
</section>

<section class="map-section" aria-labelledby="map-h">
  <div class="wrap map-grid">
    <div class="reveal"><p class="eyebrow">Interactive map</p><h2 id="map-h" class="display">From the Bay of All Saints to the whale coast.</h2>
    <p>Hover or tap a pin to preview each destination. Salvador is your gateway: islands are a boat ride south, the Chapada is six hours inland, and the Discovery Coast is a short flight away.</p>
    <div class="map-preview" data-map-preview><img src="${PH.url(salvador.card, 600, 400)}" alt="" width="600" height="400" loading="lazy"><div><h3>Salvador</h3><p>${esc(salvador.tagline)}</p><a class="btn btn-sun map-cta" href="/destinations/salvador/" data-map-cta>Read the Salvador guide <span aria-hidden="true">→</span></a></div></div></div>
    <div class="map-wrap reveal">${ART.bahiaMap(mapPoints)}</div>
  </div>
</section>

<section class="underwater" aria-labelledby="uw-h">
  <div class="wrap rail-head reveal"><div><p class="eyebrow">Below the surface</p><h2 id="uw-h" class="display">Glass-clear water, turtles &amp; reef fish.</h2></div>
  <a class="btn btn-sun magnetic" href="/blog/natural-pools-bahia/">Best natural pools</a></div>
  <div class="uw-grid wrap">${PHOTO_ASSIGN.underwater.map((k, i) => `<figure class="uw uw-${i} reveal-clip">${img(k, { sizes: i === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw' })}<figcaption>${PH.alt(k)}</figcaption></figure>`).join('')}</div>
</section>

<section class="our-lens" aria-labelledby="lens-h">
  <div class="wrap rail-head reveal"><div><p class="eyebrow">Through our lens</p><h2 id="lens-h" class="display">Bahia, exactly as we saw it.</h2></div>
  <a class="btn btn-dark magnetic" href="/blog/beach-day-in-bahia-like-a-local/">Our beach-day tips</a></div>
  <div class="lens-grid wrap">${PHOTO_ASSIGN.home.ourLens.map((k, i) => `<figure class="lens lens-${i} reveal-clip">${img(k, { sizes: '(min-width: 900px) 25vw, 50vw' })}<figcaption>${PH.alt(k)}</figcaption></figure>`).join('')}</div>
</section>

<section class="journal-home" aria-labelledby="j-h">
  <div class="wrap rail-head reveal"><div><p class="eyebrow">The Journal</p><h2 id="j-h" class="display">Stories, guides & hard-won tips.</h2></div><a class="btn btn-dark magnetic" href="/blog/">All articles</a></div>
  <div class="wrap card-grid">${latest.slice(0, 7).map((a, i) => articleCard(a, { big: i === 0 })).join('')}</div>
</section>

<section class="stays-teaser" data-parallax-root>
  <div class="stays-bg" data-parallax="0.2">${img(STAYS[0].photo, { alt: "" })}</div>
  <div class="stays-shade"></div>
  <div class="wrap stays-inner reveal"><p class="eyebrow">Where to stay</p><h2 class="display">Where to base yourself.</h2>
  <p>Which beach, which neighborhood, and why — from boutique pousadas to beachfront luxury, compared area by area.</p>
  <div class="stay-links">${STAYS.map((s) => `<a class="glass" href="/stays/${s.slug}"><span>${s.title.split(':')[0]}</span><b>→</b></a>`).join('')}</div></div>
</section>

<section class="wrap home-faq">${faqBlock(homeFaq, 'Bahia travel: quick answers')}</section>`;
    return {
      path: '/', html: layout({
        title: `${C.name} — Bahia, Brazil Travel Guide for Americans`, description: C.description, path: '/', image: ogImg(PHOTO_ASSIGN.home.hero), imageAlt: PH.alt(PHOTO_ASSIGN.home.hero), body, bodyClass: 'home',
        schema: [
          { '@context': 'https://schema.org', '@graph': [orgLd, { '@type': 'WebSite', '@id': abs('/#site'), url: abs('/'), name: C.name, description: C.description, inLanguage: C.lang, publisher: { '@id': abs('/#org') } }] },
          { '@context': 'https://schema.org', '@type': 'TouristDestination', name: 'Bahia, Brazil', description: 'Brazilian state on the northeastern Atlantic coast known for Salvador, island beaches and Chapada Diamantina.', geo: { '@type': 'GeoCoordinates', latitude: -12.9714, longitude: -38.5014 }, containedInPlace: { '@type': 'Country', name: 'Brazil' }, includesAttraction: DESTINATIONS.map((d) => ({ '@type': 'TouristDestination', name: d.name, url: abs(`/destinations/${d.slug}`) })) },
          faqLd(homeFaq),
        ],
      }),
    };
  }

  function destinationsIndex() {
    const body = `${pageHero({ item: { photo: PHOTO_ASSIGN.pages.destinations }, eyebrow: 'Destinations', title: 'Every corner of Bahia worth the journey', lede: 'From colonial Salvador to car-free islands, rainforest surf towns and canyon country. Start with the two most-loved places — Salvador and Morro de São Paulo.', crumbs: [['Home', '/'], ['Destinations', '/destinations/']] })}
<section id="content" class="wrap dest-grid">${DESTINATIONS.map(destCard).join('')}</section>`;
    return { path: '/destinations/', html: layout({ title: 'Best Places to Visit in Bahia, Brazil', description: 'The best places to visit in Bahia, Brazil: Salvador, Morro de São Paulo, Chapada Diamantina, Itacaré, Praia do Forte, Trancoso, Boipeba, Maraú and Abrolhos.', path: '/destinations/', image: ogImg(PHOTO_ASSIGN.pages.destinations), body,
      schema: [crumbsLd([['Home', '/'], ['Destinations', '/destinations/']]), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Best places to visit in Bahia', itemListElement: DESTINATIONS.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/destinations/${d.slug}`), name: d.name })) }] }) };
  }

  function destinationPage(d) {
    const path = `/destinations/${d.slug}`;
    const crumbs = [['Home', '/'], ['Destinations', '/destinations/'], [d.name, path]];
    const related = ARTICLES.filter((a) => a.destinations.includes(d.slug));
    const stays = STAYS.filter((s) => s.destination === d.slug);
    const others = DESTINATIONS.filter((x) => x.slug !== d.slug);
    const toc = d.sections.map((s) => `<li><a href="#${slugify(s.h)}">${s.h}</a></li>`).join('');
    const body = `${pageHero({ item: d, eyebrow: d.region + ' · Bahia', title: d.name, lede: d.tagline, crumbs })}
<section id="content" class="quick wrap reveal" aria-label="Quick facts">
  <div><span>Best time</span><b>${d.quick.best}</b></div><div><span>Ideal stay</span><b>${d.quick.days}</b></div><div><span>Getting there</span><b>${d.quick.airport}</b></div><div><span>Vibe</span><b>${d.quick.vibe}</b></div>
</section>
<div class="wrap article-layout">
  <aside class="toc" aria-label="On this page"><p class="eyebrow">On this page</p><ol>${toc}<li><a href="#faq-h">FAQ</a></li></ol></aside>
  <article class="prose">
    <p class="dropcap reveal">${d.intro}</p>
    <ul class="chips reveal">${d.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
    ${d.sections.map((s) => `<section class="reveal"><h2 id="${slugify(s.h)}">${s.h}</h2>${s.html}</section>` + sectionMedia(d, s.h)).join('')}
    ${stays.length ? `<aside class="cta-stay reveal"><p class="eyebrow">Where to stay</p><h3>${stays[0].title}</h3><p>${stays[0].tldr}</p><a class="btn btn-sun" href="/stays/${stays[0].slug}">See our picks</a></aside>` : ''}
    ${gallery(d.gallery, `${d.name} in pictures`)}
    ${faqBlock(d.faqs, `${d.name} FAQ`)}
  </article>
</div>
${related.length ? `<section class="wrap related"><h2 class="display reveal">Read before you go</h2><div class="card-grid">${related.map((a) => articleCard(a)).join('')}</div></section>` : ''}
<section class="wrap related"><h2 class="display reveal">Keep exploring</h2><div class="dest-grid">${others.map(destCard).join('')}</div></section>`;
    return { path, html: layout({ title: `${d.name}, Bahia: Travel Guide, Things to Do & Tips`, description: d.description, path, image: ogImg(d.photo), imageAlt: PH.alt(d.photo), body,
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'TouristDestination', name: d.name, description: strip(d.intro), url: abs(path), image: ogImg(d.photo), geo: { '@type': 'GeoCoordinates', latitude: d.geo.lat, longitude: d.geo.lng }, containedInPlace: { '@type': 'AdministrativeArea', name: 'Bahia', containedInPlace: { '@type': 'Country', name: 'Brazil' } }, touristType: d.quick.vibe.split(', ') }, faqLd(d.faqs)] }) };
  }

  function blogIndex() {
    const sorted = ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));
    const cats = [...new Set(sorted.map((a) => a.category))];
    const body = `${pageHero({ item: { photo: PHOTO_ASSIGN.pages.blog }, eyebrow: 'The Journal', title: 'Guides, stories & honest advice', lede: 'Everything we’ve learned traveling Bahia — safety, transport, seasons, food and the places that stopped us in our tracks.', crumbs: [['Home', '/'], ['Journal', '/blog/']] })}
<section id="content" class="wrap">
  <div class="filters reveal" role="toolbar" aria-label="Filter articles"><button class="chip-btn is-on" data-filter="all">All</button>${cats.map((c) => `<button class="chip-btn" data-filter="${slugify(c)}">${c}</button>`).join('')}</div>
  <div class="card-grid" data-filter-grid>${sorted.map((a, i) => articleCard(a, { big: i === 0 })).join('')}</div>
  <h2 class="display reveal" style="margin-top:4rem">Where to stay guides</h2>
  <div class="card-grid">${STAYS.map((s) => `<article class="card reveal" data-tilt><a class="card-link" href="/stays/${s.slug}"><div class="card-media">${img(s.photo)}</div><div class="card-body"><p class="card-meta"><span class="tag tag-sun">Where to stay</span> <span>${s.readMins} min read</span></p><h3>${s.title}</h3></div></a></article>`).join('')}</div>
</section>`;
    return { path: '/blog/', html: layout({ title: 'Bahia Travel Blog: Guides, Safety Tips & Itineraries', description: 'The TravelBahia journal: Bahia travel guides for Americans — safety, getting around, best time to visit, natural pools, Chapada Diamantina hikes, food and itineraries.', path: '/blog/', image: ogImg(PHOTO_ASSIGN.pages.blog), body,
      schema: [crumbsLd([['Home', '/'], ['Journal', '/blog/']]), { '@context': 'https://schema.org', '@type': 'Blog', name: `${C.name} Journal`, url: abs('/blog/'), publisher: { '@id': abs('/#org') }, blogPost: sorted.map((a) => ({ '@type': 'BlogPosting', headline: a.title, url: abs(`/blog/${a.slug}`), datePublished: a.date })) }] }) };
  }

  function articlePage(a) {
    const path = `/blog/${a.slug}`;
    const crumbs = [['Home', '/'], ['Journal', '/blog/'], [a.category, '/blog/'], [a.title.split(':')[0], path]];
    const toc = a.body.map((s) => `<li><a href="#${slugify(s.h)}">${s.h}</a></li>`).join('');
    const related = ARTICLES.filter((x) => x.slug !== a.slug && x.destinations.some((d) => a.destinations.includes(d))).slice(0, 3);
    const dests = DESTINATIONS.filter((d) => a.destinations.includes(d.slug));
    const meta = `<p class="hero-meta"><span class="tag">${a.category}</span> <span>By ${C.author.name}</span> <span>Updated <time datetime="${a.updated}">${fmtDate(a.updated)}</time></span> <span>${a.readMins} min read</span></p>`;
    const body = `<div class="progress" data-progress></div>
${pageHero({ item: a, eyebrow: '', title: a.title, lede: '', crumbs, meta })}
<div id="content" class="wrap article-layout">
  <aside class="toc" aria-label="On this page"><p class="eyebrow">On this page</p><ol>${toc}<li><a href="#faq-h">FAQ</a></li></ol></aside>
  <article class="prose">
    ${tldrBox(a.tldr, a.takeaways)}
    ${a.body.map((s) => `<section class="reveal"><h2 id="${slugify(s.h)}">${s.h}</h2>${s.html}</section>` + sectionMedia(a, s.h)).join('')}
    ${dests.length ? `<aside class="dest-mini reveal"><p class="eyebrow">Destinations in this article</p><div>${dests.map((d) => `<a href="/destinations/${d.slug}">${img(d.card, { sizes: '200px' })}<span>${d.name}</span></a>`).join('')}</div></aside>` : ''}
    ${gallery(a.gallery, "In pictures", "gallery-three")}
    ${faqBlock(a.faqs)}
    ${authorBox(a.updated)}
  </article>
</div>
${related.length ? `<section class="wrap related"><h2 class="display reveal">Keep reading</h2><div class="card-grid">${related.map((x) => articleCard(x)).join('')}</div></section>` : ''}`;
    return { path, html: layout({ title: a.title, description: a.description, path, image: ogImg(a.photo), imageAlt: PH.alt(a.photo), type: 'article', article: a, body, bodyClass: 'is-article',
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: a.title, description: a.description, image: [ogImg(a.photo)], datePublished: a.date, dateModified: a.updated, author: authorLd, publisher: orgLd, mainEntityOfPage: abs(path), articleSection: a.category, inLanguage: C.lang, about: dests.map((d) => ({ '@type': 'TouristDestination', name: d.name, url: abs(`/destinations/${d.slug}`) })), abstract: a.tldr }, faqLd(a.faqs)] }) };
  }

  function staysIndex() {
    const body = `${pageHero({ item: { photo: PHOTO_ASSIGN.pages.stays }, eyebrow: 'Where to stay', title: 'Where to stay in Bahia', lede: 'Neighborhood-by-neighborhood advice, from boutique pousadas to beachfront luxury.', crumbs: [['Home', '/'], ['Where to Stay', '/stays/']] })}
<section id="content" class="wrap card-grid">${STAYS.map((s) => `<article class="card reveal" data-tilt><a class="card-link" href="/stays/${s.slug}"><div class="card-media">${img(s.photo)}</div><div class="card-body"><p class="card-meta"><span class="tag tag-sun">Where to stay</span></p><h3>${s.title}</h3><p>${s.description}</p></div></a></article>`).join('')}</section>`;
    return { path: '/stays/', html: layout({ title: 'Where to Stay in Bahia: Best Areas & Neighborhoods', description: 'Where to stay in Bahia, Brazil: the best beaches and neighborhoods to base yourself in Salvador, Morro de São Paulo and beyond.', path: '/stays/', image: ogImg(PHOTO_ASSIGN.pages.stays), body, schema: [crumbsLd([['Home', '/'], ['Where to Stay', '/stays/']])] }) };
  }

  function stayPage(s) {
    const path = `/stays/${s.slug}`;
    const d = DESTINATIONS.find((x) => x.slug === s.destination);
    const crumbs = [['Home', '/'], ['Where to Stay', '/stays/'], [d.name, path]];
    const hasPlaceholders = s.hotels.some((h) => h.placeholder);
    const hotelCard = (h, i) => {
      const link = h.url ? `<a class="btn btn-sun" href="${h.url}" rel="sponsored nofollow noopener" target="_blank">Check prices & availability</a>` : `<span class="btn btn-disabled">Booking link coming soon</span>`;
      return `<article class="hotel reveal ${h.placeholder ? 'is-placeholder' : ''}" data-tilt>
  <div class="hotel-media">${h.photo ? `<img src="${h.photo}" alt="${esc(h.name)}" width="1200" height="800" loading="lazy">` : img((s.hotelPhotos && s.hotelPhotos[i]) || s.photo, { sizes: '(min-width: 760px) 40vw, 100vw' })}<span class="hotel-rank">${String(i + 1).padStart(2, '0')}</span></div>
  <div class="hotel-body"><p class="card-meta"><span class="tag">${h.area}</span> <span>${h.price}</span> <span>Best for: ${h.best}</span></p>
  <h3>${h.name}</h3><p>${h.blurb}</p><ul class="chips">${h.perks.map((p) => `<li>${p}</li>`).join('')}</ul>${link}</div>
</article>`;
    };
    const body = `<div class="progress" data-progress></div>
${pageHero({ item: s, eyebrow: 'Where to stay · ' + d.name, title: s.title, lede: '', crumbs, meta: `<p class="hero-meta"><span>By ${C.author.name}</span> <span>Updated ${fmtDate(s.updated)}</span></p>` })}
<div id="content" class="wrap article-layout">
  <aside class="toc" aria-label="On this page"><p class="eyebrow">On this page</p><ol><li><a href="#best-areas">Best areas at a glance</a></li>${(s.sections || []).map((x) => `<li><a href="#${slugify(x.h)}">${x.h}</a></li>`).join('')}<li><a href="#faq-h">FAQ</a></li></ol></aside>
  <article class="prose">
    ${s.hotels.length ? `<p class="disclosure">${C.affiliateDisclosure} <a href="/collaborations#affiliate-disclosure">Learn more</a>.</p>` : ''}
    ${tldrBox(s.tldr, s.takeaways)}
    <section class="reveal"><h2 id="best-areas">Best areas at a glance</h2>
    <div class="areas">${s.areas.map((a) => `<div class="area"><p class="eyebrow">${a.for}</p><h3>${a.name}</h3><p>${a.html}</p></div>`).join('')}</div></section>
    ${(s.sections || []).map((x) => `<section class="reveal"><h2 id="${slugify(x.h)}">${x.h}</h2>${x.html}</section>` + sectionMedia(s, x.h)).join('')}
    ${s.hotels.length ? `<h2 class="reveal">Our picks</h2><div class="hotels">${s.hotels.map(hotelCard).join('')}</div>` : ''}
    ${gallery(s.gallery, 'In pictures', 'gallery-three')}
    ${faqBlock(s.faqs)}
    <p class="reveal"><a class="btn btn-dark" href="/destinations/${d.slug}">Read the full ${d.name} guide →</a></p>
    ${authorBox(s.updated)}
  </article>
</div>`;
    const realHotels = s.hotels.filter((h) => !h.placeholder);
    return { path, noindex: hasPlaceholders, html: layout({ title: s.title, description: s.description, path, image: ogImg(s.photo), imageAlt: PH.alt(s.photo), type: 'article', article: { ...s, category: 'Where to stay' }, body, noindex: hasPlaceholders,
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, description: s.description, datePublished: s.date, dateModified: s.updated, author: authorLd, publisher: orgLd, image: ogImg(s.photo), mainEntityOfPage: abs(path) },
        realHotels.length ? { '@context': 'https://schema.org', '@type': 'ItemList', name: s.title, itemListElement: realHotels.map((h, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'LodgingBusiness', name: h.name, address: { '@type': 'PostalAddress', addressLocality: h.area, addressRegion: 'BA', addressCountry: 'BR' }, priceRange: h.price } })) } : null,
        faqLd(s.faqs)] }) };
  }

  function about() {
    const body = `${pageHero({ item: { photo: PHOTO_ASSIGN.about.hero }, eyebrow: 'About us', title: 'Hi, we’re Liis &amp; Gleb', lede: 'Two travelers who fell for Bahia — its beaches, its food and its rhythm.', crumbs: [['Home', '/'], ['About', '/about']] })}
<div id="content" class="wrap narrow prose">
  <section class="reveal"><h2>Who we are</h2><p>${C.author.bio}</p>
  ${figure(PHOTO_ASSIGN.about.couple)}
  <p>Bahia is the part of Brazil we keep returning to — from the cobbled streets of Salvador to the island beaches of Morro de São Paulo. We came for the sea and fell for everything else: turquoise water warm enough to stay in for hours, jungle-covered hills rolling straight down to the sand, and tropical flowers in every garden. We love beautiful, refined stays as much as charming local guesthouses with soul, and we cook often — Brazil’s seafood, beef and tropical fruit are some of the best we have ever tasted.</p>
  <p>What stayed with us most is Brazil’s unique, artistic beauty. If you’re used to very polished neighborhoods, the streets might surprise you at first — houses and façades look a bit worn. But they are warm, colorful and full of soul, with plenty of local places for every taste. In Bahia there are drummers on the streets every day, and the performances are amazing.</p></section>
  ${gallery(PHOTO_ASSIGN.about.gallery, 'A few moments from our travels', 'gallery-even')}
  <section class="reveal"><h2>What we loved most</h2><ul><li><strong>The water.</strong> Clear, warm and endlessly blue — natural pools at low tide, reefs alive with fish, and beaches where the sea turns from emerald to turquoise.</li><li><strong>The jungle.</strong> Atlantic rainforest spilling down to the coast, driftwood beaches, red tropical leaves and hibiscus in every garden.</li><li><strong>The light.</strong> Golden evenings over the bay, a caipirinha in hand, with the jungle below and the ocean beyond.</li><li><strong>The flavors.</strong> Shrimp served in a pineapple, ripe mango, the freshest seafood — and cooking with it ourselves.</li><li><strong>The soul.</strong> Drummers in the streets, colorful colonial façades and a warmth that is hard to put into words.</li></ul><p>Our practical tips (tides, beach days, getting around) live in the <a href="/blog/">Journal</a>.</p></section>
  <section class="reveal"><h2>Contact</h2><p>Hotels, pousadas, tour operators and brands: see how we can <a href="/collaborations">work together</a>, along with our <a href="/collaborations#editorial-policy">editorial policy</a> and <a href="/collaborations#affiliate-disclosure">affiliate disclosure</a>. For anything else, write to <a href="mailto:hello@travelbahia.com">hello@travelbahia.com</a>.</p></section>
</div>`;
    return { path: '/about', html: layout({ title: 'About TravelBahia', description: 'About TravelBahia: who we are, why we love Bahia, and the moments from our travels that shaped this guide.', path: '/about', image: ogImg(PHOTO_ASSIGN.about.hero), body,
      schema: [crumbsLd([['Home', '/'], ['About', '/about']]), { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About TravelBahia', url: abs('/about'), publisher: orgLd }] }) };
  }

  function collaborations() {
    const path = '/collaborations';
    const crumbs = [['Home', '/'], ['Collaborations', path]];
    const offers = [
      ['Stay features', 'Hotels, pousadas &amp; villas', 'A dedicated, first-hand feature in our Where to Stay guides, written after we stay with you: what makes your place special, who it suits, and how to book.'],
      ['Destination spotlights', 'Tours, boats &amp; experiences', 'Snorkeling trips, island tours, jungle hikes, cooking classes: experiences woven into our destination guides and itineraries, where travelers are actively planning.'],
      ['Photography', 'Visual stories', 'Our own photography of your property, food and surroundings, edited in our signature warm, natural style, for use in our feature and agreed with you.'],
      ['Newsletter &amp; journal', 'Stories that travel further', 'Features in The Bahia Letter and dedicated journal articles that keep working in Google and AI search long after they are published.'],
    ];
    const steps = [
      ['Say hello', 'Tell us about your property or experience and what you would like to achieve.'],
      ['We plan together', 'We agree on the format, dates, deliverables and how the partnership is labeled.'],
      ['We experience it', 'We visit, stay or join the experience ourselves. First-hand is the only way we write.'],
      ['Your story goes live', 'A polished feature with our photography, published on TravelBahia and kept up to date.'],
    ];
    const mail = 'mailto:hello@travelbahia.com?subject=' + encodeURIComponent('Collaboration with TravelBahia');
    const body = `${pageHero({ item: { photo: PHOTO_ASSIGN.pages.collaborations }, eyebrow: 'Collaborations', title: 'Let’s tell your Bahia story together', lede: 'For hotels, pousadas, tour operators and travel brands who want to reach travelers planning their trip to Bahia.', crumbs })}
<div id="content" class="wrap narrow prose">
  <section class="reveal"><h2>Who we are</h2><p>We’re Liis and Gleb, the travelers behind TravelBahia. We write in-depth, first-hand guides to Bahia for English-speaking travelers, especially from the United States, covering where to go, where to stay, what to eat and how to travel well. Our guides are built to be found: structured for Google and for AI assistants like ChatGPT and Perplexity, where more and more trips now begin.</p></section>
  <section class="reveal"><h2>Who reads TravelBahia</h2><p>Travelers who are actively planning a trip to Bahia. They search for where to stay in Salvador and Morro de São Paulo, the best natural pools, island tours, safety tips and itineraries. They are looking for exactly the kind of places and experiences you offer, at the moment they are deciding.</p></section>
  <section class="collab-offers reveal" aria-labelledby="offers-h">
    <h2 id="offers-h">How we can work together</h2>
    <div class="areas">${offers.map(([t, e, d]) => `<div class="area"><p class="eyebrow">${e}</p><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </section>
  <section class="reveal"><h2>How it works</h2><ol class="steps">${steps.map(([t, d]) => `<li><strong>${t}.</strong> ${d}</li>`).join('')}</ol></section>
  <section class="reveal"><h2>Our promise to readers</h2><p>We only feature places and experiences we would genuinely recommend to friends, and we always experience them ourselves first. Every paid or gifted partnership is clearly labeled, and affiliate links are marked as sponsored, in line with U.S. FTC guidelines. That honesty is exactly why readers trust our recommendations, and why a feature on TravelBahia is worth having.</p></section>
  <section class="reveal"><h2 id="editorial-policy">Editorial policy</h2><p>Our guides combine our own first-hand travel with careful research. Anything involving visas, health or safety is checked against official sources such as the U.S. State Department, the CDC and the Brazilian government. We date every article and update it when things change. Partners never review or approve what we write, and we never accept payment for positive coverage.</p></section>
  <section class="reveal"><h2 id="affiliate-disclosure">Affiliate disclosure</h2><p>${C.affiliateDisclosure} Affiliate links are marked and use <code>rel="sponsored"</code>, in line with U.S. FTC guidelines. Commissions help keep this guide free and independent.</p></section>
  <section class="reveal"><h2 id="imagery">About our imagery</h2><p>Our photographs come from our own travels and from talented photographers on Unsplash, and every photo is credited. Captions describe what is shown; where a location is named, it is the place the photo was taken. Click or tap any photo on the site to see it full-screen.</p></section>
  <aside class="collab-cta reveal">
    <p class="eyebrow">Get in touch</p>
    <h2>Tell us about your place</h2>
    <p>Email us with your property or experience, location, website or Instagram, and what you have in mind. We reply to every message.</p>
    <a class="btn btn-sun magnetic" href="${mail}">hello@travelbahia.com</a>
  </aside>
</div>`;
    return { path, html: layout({ title: 'Collaborations: Work With TravelBahia', description: 'Partner with TravelBahia: first-hand features for hotels, pousadas, tour operators and travel brands in Bahia, Brazil, with our own photography, reaching travelers as they plan. Includes our editorial policy and affiliate disclosure.', path, image: ogImg(PHOTO_ASSIGN.pages.collaborations), imageAlt: PH.alt(PHOTO_ASSIGN.pages.collaborations), body,
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Collaborations with TravelBahia', url: abs(path), publisher: orgLd, mainEntity: { '@type': 'Organization', name: C.name, email: 'hello@travelbahia.com', url: abs('/') } }] }) };
  }

  function privacy() {
    const updated = 'November 25, 2026';
    const ga = C.analytics.ga4;
    const body = `<div class="wrap narrow prose page-plain">
<h1>Privacy policy</h1>
<p class="small">Last updated ${updated}</p>
<p>This policy explains what personal information ${C.name} (“we”, “us”) collects when you visit <a href="/">travelbahia.com</a>, subscribe to our newsletter or contact us, how we use it, who we share it with, and the choices and rights you have. We try to collect as little as possible.</p>

<h2>Who we are</h2>
<p>${C.name} is an independent travel guide to Bahia, Brazil, run by Liis and Gleb. We are the controller of the personal information described here. Contact us about anything in this policy at <a href="mailto:hello@travelbahia.com">hello@travelbahia.com</a>.</p>

<h2>Information we collect</h2>
<h3>When you browse the site</h3>
<ul>
<li><strong>Analytics.</strong> ${ga ? 'We use Google Analytics 4 to understand which guides are read and how visitors find us. It collects information such as the pages you view, how long you stay, the site that referred you, your approximate location (city or region, derived from your IP address), device, browser and operating system, and a randomly generated identifier stored in a cookie. Google Analytics 4 does not log or store full IP addresses. We do not use Google Analytics for advertising, and we have not enabled Google signals or ad personalization.' : 'We currently do not run analytics. If we add them, we will update this policy.'}</li>
<li><strong>Server logs.</strong> The site is hosted on GitHub Pages. Like any web host, GitHub automatically records technical information such as your IP address, browser and the pages requested, for security and to keep the service running. See <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub’s privacy statement</a>.</li>
<li><strong>Embedded content.</strong> Some photos load from Unsplash’s and Pexels’ image servers, and our fonts load from Google Fonts. When your browser fetches these files, those providers receive your IP address and browser details. They do not receive anything else from us.</li>
</ul>
<h3>When you subscribe to our newsletter</h3>
<p>If you sign up for The Bahia Letter, we collect your email address. Our email provider, MailerLite, also records the date and time you subscribed, your IP address and, when you receive our emails, whether you opened them or clicked a link. We use this only to send the newsletter and to understand which stories readers find useful.</p>
<h3>When you email us</h3>
<p>If you write to us, we receive your email address, your name if you include it, and whatever you choose to tell us. We use it only to reply and to handle your request, including collaboration enquiries.</p>
<h3>When you click a booking or affiliate link</h3>
<p>Some links go to booking sites or partners. If you click one, that site may set its own cookies to record that you came from ${C.name}, so we can earn a commission if you book. That information is collected by the partner under its own privacy policy; we only receive aggregated reports (for example, the number of bookings), not who made them.</p>
<p>We do not knowingly collect sensitive information, and we never ask for payment details.</p>

<h2>Cookies</h2>
<p>We use only a small number of cookies:</p>
<ul>
${ga ? '<li><strong>_ga and _ga_*</strong> (Google Analytics) — distinguish visitors and sessions so we can count visits. They last up to 2 years.</li>' : ''}
<li><strong>Partner cookies</strong> — set by booking or affiliate sites only after you click through to them.</li>
</ul>
<p>We do not use cookies for advertising. You can block or delete cookies in your browser settings at any time${ga ? ', or opt out of Google Analytics on every site with the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">Google Analytics opt-out browser add-on</a>' : ''}. The site works fully without cookies.</p>

<h2>How we use your information, and our legal bases</h2>
<ul>
<li><strong>To run and improve the site</strong> (analytics and server logs) — our legitimate interest in keeping the site secure and understanding what readers find useful${ga ? ', and your consent where the law requires it for analytics cookies' : ''}.</li>
<li><strong>To send the newsletter</strong> — your consent, which you can withdraw at any time with the unsubscribe link in every email.</li>
<li><strong>To answer your messages and manage collaborations</strong> — our legitimate interest in responding to you, or taking steps toward an agreement you ask about.</li>
<li><strong>To meet legal obligations</strong>, such as keeping records or responding to lawful requests.</li>
</ul>
<p>We do not sell your personal information, we do not share it for cross-context behavioral advertising, and we do not use it for automated decisions that affect you.</p>

<h2>Who we share it with</h2>
<p>We share personal information only with service providers that help us run the site, each bound by its own data protection terms:</p>
<ul>
${ga ? '<li><strong>Google</strong> (Google Analytics, Google Fonts) — <a href="https://policies.google.com/privacy" rel="noopener">privacy policy</a></li>' : '<li><strong>Google</strong> (Google Fonts) — <a href="https://policies.google.com/privacy" rel="noopener">privacy policy</a></li>'}
<li><strong>MailerLite</strong> (newsletter) — <a href="https://www.mailerlite.com/legal/privacy-policy" rel="noopener">privacy policy</a></li>
<li><strong>GitHub</strong> (website hosting) — <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">privacy statement</a></li>
<li><strong>Unsplash and Pexels</strong> (photo delivery) — <a href="https://unsplash.com/privacy" rel="noopener">Unsplash privacy policy</a>, <a href="https://www.pexels.com/privacy-policy/" rel="noopener">Pexels privacy policy</a></li>
<li>Our email provider, for messages you send us.</li>
</ul>
<p>We may also disclose information if the law requires it, or to protect our rights or someone’s safety.</p>

<h2>International transfers</h2>
<p>Our providers may process data in the United States, the European Union and other countries. Where data from the European Economic Area, the UK or Switzerland is transferred abroad, they rely on safeguards such as the EU–U.S. Data Privacy Framework or Standard Contractual Clauses.</p>

<h2>How long we keep it</h2>
<ul>
${ga ? '<li>Google Analytics data: 14 months, then deleted automatically.</li>' : ''}
<li>Newsletter: for as long as you are subscribed. If you unsubscribe, we keep your email address on a suppression list only so we never email you again.</li>
<li>Emails: as long as needed to handle your request, and normally no more than 2 years after our last contact (longer for collaboration agreements, where records are needed).</li>
</ul>

<h2>Your rights and choices</h2>
<p>Depending on where you live, you may have the right to access the personal information we hold about you, correct it, delete it, receive a copy in a portable format, object to or restrict how we use it, and withdraw consent at any time. This includes rights under the EU and UK GDPR and U.S. state privacy laws such as California’s (CCPA/CPRA). To use any of these rights, email <a href="mailto:hello@travelbahia.com">hello@travelbahia.com</a>. We will respond within 30 days (45 days where U.S. state law allows) and won’t treat you differently for using your rights. We may need to confirm your identity first. You can also complain to your local data protection authority.</p>
<p><strong>Unsubscribing:</strong> every newsletter includes a one-click unsubscribe link. <strong>Global Privacy Control:</strong> we treat a GPC signal as a request to opt out of any “sale” or “sharing”; as described above, we don’t do either.</p>

<h2>Children</h2>
<p>${C.name} is written for adults planning travel. We don’t knowingly collect personal information from children under 16. If you believe a child has given us information, contact us and we will delete it.</p>

<h2>Security</h2>
<p>The site is served over HTTPS, and we use reputable providers with strong security practices. No method of transmission or storage is completely secure, but we work to protect your information and limit who can access it.</p>

<h2>Links to other sites</h2>
<p>Our guides link to official sources, booking sites and other websites. We aren’t responsible for their privacy practices, so please read their policies.</p>

<h2>Changes to this policy</h2>
<p>We will update this page when our practices change and revise the date at the top. If changes are significant, we will say so on the site or in the newsletter.</p>

<h2>Contact</h2>
<p>Questions or requests: <a href="mailto:hello@travelbahia.com">hello@travelbahia.com</a>.</p>
</div>`;
    return { path: '/privacy', html: layout({ title: 'Privacy Policy', description: 'How TravelBahia collects, uses and protects personal information: analytics, cookies, the newsletter, affiliate links and your privacy rights.', path: '/privacy', image: ogImg(PHOTO_ASSIGN.home.hero), body, bodyClass: 'plain' }) };
  }

  function notFound() {
    const body = `<script>(function(){var p=location.pathname,q=p;if(q.slice(-11)==='/index.html')q=q.slice(0,-11);else if(q.length>1&&q.slice(-1)==='/')q=q.slice(0,-1);if(q!==p&&['/destinations','/blog','/stays'].indexOf(q)<0)location.replace(q+location.search+location.hash);})()</script><section class="page-hero nf"><div class="page-hero-media">${img(PHOTO_ASSIGN.pages.notFound, { eager: true })}</div><div class="page-hero-shade"></div><div class="page-hero-content"><p class="eyebrow">404</p><h1>Lost at sea.</h1><p class="lede">That page drifted off. Try the <a href="/destinations/">destinations</a> or the <a href="/blog/">journal</a>.</p></div></section>`;
    return { path: '/404.html', file: '404.html', html: layout({ title: 'Page not found', description: 'Page not found', path: '/404.html', image: ogImg(PHOTO_ASSIGN.home.hero), body, noindex: true }) };
  }

  return { home, destinationsIndex, destinationPage, blogIndex, articlePage, staysIndex, stayPage, about, collaborations, privacy, notFound, strip, abs, fmtDate, esc };
})();

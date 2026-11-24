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
    const dest = DESTINATIONS.slice(0, 6).map((d) => `<li><a href="/destinations/${d.slug}/">${d.name}</a></li>`).join('');
    const arts = ARTICLES.slice(0, 5).map((a) => `<li><a href="/blog/${a.slug}/">${a.title.split(':')[0]}</a></li>`).join('');
    return `<section class="newsletter reveal" aria-labelledby="nl-title">
  <div class="newsletter-inner">
    <p class="eyebrow">The Bahia Letter</p>
    <h2 id="nl-title">New places, honest tips, once a month.</h2>
    <form class="nl-form" data-newsletter>
      <label class="sr" for="nl-email">Email address</label>
      <input id="nl-email" type="email" name="email" placeholder="you@example.com" required autocomplete="email">
      <button class="btn btn-sun" type="submit">Subscribe</button>
    </form>
    <p class="nl-msg" role="status" aria-live="polite"></p>
  </div>
</section>
<footer class="site-footer">
  <div class="foot-grid">
    <div><a class="logo" href="/"><span class="logo-mark" aria-hidden="true"></span><span>Travel<b>Bahia</b></span></a><p>${C.tagline}. Independent, written for U.S. travelers.</p></div>
    <div><h3>Destinations</h3><ul>${dest}</ul></div>
    <div><h3>Journal</h3><ul>${arts}</ul></div>
    <div><h3>About</h3><ul><li><a href="/about/">About us</a></li><li><a href="/collaborations/">Collaborations</a></li><li><a href="/stays/">Where to stay</a></li><li><a href="/about/#affiliate-disclosure">Affiliate disclosure</a></li><li><a href="/privacy/">Privacy</a></li></ul></div>
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
  <a href="/blog/${a.slug}/" class="card-link">
    <div class="card-media">${img(a.photo, { sizes: big ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 33vw, 100vw' })}</div>
    <div class="card-body"><p class="card-meta"><span class="tag">${a.category}</span> <span>${a.readMins} min read</span></p>
    <h3>${a.title}</h3>${big ? `<p>${a.description}</p>` : ''}</div>
  </a>
</article>`;
  }

  function destCard(d, i = 0) {
    return `<article class="dest-card reveal" data-tilt style="--i:${i}">
  <a href="/destinations/${d.slug}/">
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
    return `<aside class="author reveal"><img class="avatar" src="${PH.url(PHOTO_ASSIGN.about.portrait)}" alt="" width="64" height="64"><div><p class="author-name">${C.author.name}</p><p>${C.author.bio}</p><p class="small">Last updated ${fmtDate(updated)} · <a href="/about/#editorial-policy">How we research</a></p></div></aside>`;
  }

  /* ---------------- pages ---------------- */

  function home() {
    const hero = DESTINATIONS.find((d) => d.slug === 'morro-de-sao-paulo');
    const salvador = DESTINATIONS.find((d) => d.slug === 'salvador');
    const morro = hero;
    const latest = ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));
    const mapPoints = DESTINATIONS.map((d) => ({ name: d.name, url: `/destinations/${d.slug}/`, x: d.map.x, y: d.map.y, labelLeft: d.map.labelLeft, blurb: esc(d.tagline), img: PH.url(d.card, 600, 400) }));
    const homeFaq = [
      { q: 'Where is Bahia, Brazil?', a: 'Bahia is a state on Brazil’s northeastern Atlantic coast. Its capital, Salvador, is the main gateway; most U.S. travelers connect through São Paulo, Rio de Janeiro, Miami or Panama City. Bahia has the longest coastline of any Brazilian state.' },
      { q: 'What are the best places to visit in Bahia?', a: 'The most popular places in Bahia are Salvador, Morro de São Paulo, Chapada Diamantina, Itacaré, Praia do Forte, Trancoso, Boipeba and the Maraú Peninsula.' },
      { q: 'Do Americans need a visa to visit Brazil?', a: 'Yes. Since April 10, 2025, U.S. citizens need an e-visa for tourism, applied for online before travel.' },
      { q: 'When is the best time to visit Bahia?', a: 'September to March is best for beaches and sunshine. April to July is the rainy season on the coast, while Chapada Diamantina is best for hiking April to October.' },
    ];
    const words = ['Salvador', 'Morro de São Paulo', 'Chapada Diamantina', 'Itacaré', 'Boipeba', 'Trancoso', 'Praia do Forte', 'Maraú', 'Abrolhos'];
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

<div class="marquee" aria-hidden="true"><div class="marquee-track">${[...words, ...words].map((w) => `<span>${w}</span><i>✺</i>`).join('')}</div></div>

<section class="intro-stats" id="start">
  <div class="wrap reveal">
    <p class="eyebrow">Why Bahia</p>
    <h2 class="display">Brazil’s longest coastline, its oldest city, and its deepest roots.</h2>
  </div>
  <div class="stats wrap">
    <div class="stat reveal"><b data-count="1549">0</b><span>Salvador founded — Brazil’s first capital</span></div>
    <div class="stat reveal"><b data-count="900" data-suffix="+">0</b><span>km of coastline to explore</span></div>
    <div class="stat reveal"><b data-count="82" data-suffix="°F">0</b><span>average sea temperature, all year</span></div>
    <div class="stat reveal"><b data-count="${DESTINATIONS.length}">0</b><span>destinations we cover in depth</span></div>
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
      <a class="btn btn-dark magnetic" href="/destinations/${d.slug}/">Read the ${d.name} guide</a>
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
      <a class="btn btn-sun magnetic" href="/about/">Our story</a>
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
  <div class="stay-links">${STAYS.map((s) => `<a class="glass" href="/stays/${s.slug}/"><span>${s.title.split(':')[0]}</span><b>→</b></a>`).join('')}</div></div>
</section>

<section class="wrap home-faq">${faqBlock(homeFaq, 'Bahia travel: quick answers')}</section>`;
    return {
      path: '/', html: layout({
        title: `${C.name} — Bahia, Brazil Travel Guide for Americans`, description: C.description, path: '/', image: ogImg(PHOTO_ASSIGN.home.hero), imageAlt: PH.alt(PHOTO_ASSIGN.home.hero), body, bodyClass: 'home',
        schema: [
          { '@context': 'https://schema.org', '@graph': [orgLd, { '@type': 'WebSite', '@id': abs('/#site'), url: abs('/'), name: C.name, description: C.description, inLanguage: C.lang, publisher: { '@id': abs('/#org') } }] },
          { '@context': 'https://schema.org', '@type': 'TouristDestination', name: 'Bahia, Brazil', description: 'Brazilian state on the northeastern Atlantic coast known for Salvador, island beaches and Chapada Diamantina.', geo: { '@type': 'GeoCoordinates', latitude: -12.9714, longitude: -38.5014 }, containedInPlace: { '@type': 'Country', name: 'Brazil' }, includesAttraction: DESTINATIONS.map((d) => ({ '@type': 'TouristDestination', name: d.name, url: abs(`/destinations/${d.slug}/`) })) },
          faqLd(homeFaq),
        ],
      }),
    };
  }

  function destinationsIndex() {
    const body = `${pageHero({ item: DESTINATIONS[2], eyebrow: 'Destinations', title: 'Every corner of Bahia worth the journey', lede: 'From colonial Salvador to car-free islands, rainforest surf towns and canyon country. Start with the two most-loved places — Salvador and Morro de São Paulo.', crumbs: [['Home', '/'], ['Destinations', '/destinations/']] })}
<section id="content" class="wrap dest-grid">${DESTINATIONS.map(destCard).join('')}</section>`;
    return { path: '/destinations/', html: layout({ title: 'Best Places to Visit in Bahia, Brazil', description: 'The best places to visit in Bahia, Brazil: Salvador, Morro de São Paulo, Chapada Diamantina, Itacaré, Praia do Forte, Trancoso, Boipeba, Maraú and Abrolhos.', path: '/destinations/', image: ogImg(DESTINATIONS[2].photo), body,
      schema: [crumbsLd([['Home', '/'], ['Destinations', '/destinations/']]), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Best places to visit in Bahia', itemListElement: DESTINATIONS.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/destinations/${d.slug}/`), name: d.name })) }] }) };
  }

  function destinationPage(d) {
    const path = `/destinations/${d.slug}/`;
    const crumbs = [['Home', '/'], ['Destinations', '/destinations/'], [d.name, path]];
    const related = ARTICLES.filter((a) => a.destinations.includes(d.slug));
    const stays = STAYS.filter((s) => s.destination === d.slug);
    const others = DESTINATIONS.filter((x) => x.slug !== d.slug).slice(0, 3);
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
    ${stays.length ? `<aside class="cta-stay reveal"><p class="eyebrow">Where to stay</p><h3>${stays[0].title}</h3><p>${stays[0].tldr}</p><a class="btn btn-sun" href="/stays/${stays[0].slug}/">See our picks</a></aside>` : ''}
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
    const body = `${pageHero({ item: ARTICLES[4], eyebrow: 'The Journal', title: 'Guides, stories & honest advice', lede: 'Everything we’ve learned traveling Bahia — safety, transport, seasons, food and the places that stopped us in our tracks.', crumbs: [['Home', '/'], ['Journal', '/blog/']] })}
<section id="content" class="wrap">
  <div class="filters reveal" role="toolbar" aria-label="Filter articles"><button class="chip-btn is-on" data-filter="all">All</button>${cats.map((c) => `<button class="chip-btn" data-filter="${slugify(c)}">${c}</button>`).join('')}</div>
  <div class="card-grid" data-filter-grid>${sorted.map((a, i) => articleCard(a, { big: i === 0 })).join('')}</div>
  <h2 class="display reveal" style="margin-top:4rem">Where to stay guides</h2>
  <div class="card-grid">${STAYS.map((s) => `<article class="card reveal" data-tilt><a class="card-link" href="/stays/${s.slug}/"><div class="card-media">${img(s.photo)}</div><div class="card-body"><p class="card-meta"><span class="tag tag-sun">Where to stay</span> <span>${s.readMins} min read</span></p><h3>${s.title}</h3></div></a></article>`).join('')}</div>
</section>`;
    return { path: '/blog/', html: layout({ title: 'Bahia Travel Blog: Guides, Safety Tips & Itineraries', description: 'The TravelBahia journal: Bahia travel guides for Americans — safety, getting around, best time to visit, natural pools, Chapada Diamantina hikes, food and itineraries.', path: '/blog/', image: ogImg(ARTICLES[4].photo), body,
      schema: [crumbsLd([['Home', '/'], ['Journal', '/blog/']]), { '@context': 'https://schema.org', '@type': 'Blog', name: `${C.name} Journal`, url: abs('/blog/'), publisher: { '@id': abs('/#org') }, blogPost: sorted.map((a) => ({ '@type': 'BlogPosting', headline: a.title, url: abs(`/blog/${a.slug}/`), datePublished: a.date })) }] }) };
  }

  function articlePage(a) {
    const path = `/blog/${a.slug}/`;
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
    ${dests.length ? `<aside class="dest-mini reveal"><p class="eyebrow">Destinations in this article</p><div>${dests.map((d) => `<a href="/destinations/${d.slug}/">${img(d.card, { sizes: '200px' })}<span>${d.name}</span></a>`).join('')}</div></aside>` : ''}
    ${gallery(a.gallery, "In pictures", "gallery-three")}
    ${faqBlock(a.faqs)}
    ${authorBox(a.updated)}
  </article>
</div>
${related.length ? `<section class="wrap related"><h2 class="display reveal">Keep reading</h2><div class="card-grid">${related.map((x) => articleCard(x)).join('')}</div></section>` : ''}`;
    return { path, html: layout({ title: a.title, description: a.description, path, image: ogImg(a.photo), imageAlt: PH.alt(a.photo), type: 'article', article: a, body, bodyClass: 'is-article',
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: a.title, description: a.description, image: [ogImg(a.photo)], datePublished: a.date, dateModified: a.updated, author: authorLd, publisher: orgLd, mainEntityOfPage: abs(path), articleSection: a.category, inLanguage: C.lang, about: dests.map((d) => ({ '@type': 'TouristDestination', name: d.name, url: abs(`/destinations/${d.slug}/`) })), abstract: a.tldr }, faqLd(a.faqs)] }) };
  }

  function staysIndex() {
    const body = `${pageHero({ item: STAYS[0], eyebrow: 'Where to stay', title: 'Where to stay in Bahia', lede: 'Neighborhood-by-neighborhood advice, from boutique pousadas to beachfront luxury.', crumbs: [['Home', '/'], ['Where to Stay', '/stays/']] })}
<section id="content" class="wrap card-grid">${STAYS.map((s) => `<article class="card reveal" data-tilt><a class="card-link" href="/stays/${s.slug}/"><div class="card-media">${img(s.photo)}</div><div class="card-body"><p class="card-meta"><span class="tag tag-sun">Where to stay</span></p><h3>${s.title}</h3><p>${s.description}</p></div></a></article>`).join('')}</section>`;
    return { path: '/stays/', html: layout({ title: 'Where to Stay in Bahia: Best Areas & Neighborhoods', description: 'Where to stay in Bahia, Brazil: the best beaches and neighborhoods to base yourself in Salvador, Morro de São Paulo and beyond.', path: '/stays/', image: ogImg(STAYS[0].photo), body, schema: [crumbsLd([['Home', '/'], ['Where to Stay', '/stays/']])] }) };
  }

  function stayPage(s) {
    const path = `/stays/${s.slug}/`;
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
<div id="content" class="wrap narrow">
  ${s.hotels.length ? `<p class="disclosure">${C.affiliateDisclosure} <a href="/about/#affiliate-disclosure">Learn more</a>.</p>` : '<div style="height:3rem"></div>'}
  ${tldrBox(s.tldr)}
  <h2 class="display reveal">Best areas to stay</h2>
  <div class="areas">${s.areas.map((a) => `<div class="area reveal"><p class="eyebrow">${a.for}</p><h3>${a.name}</h3><p>${a.html}</p></div>`).join('')}</div>
  ${s.hotels.length ? `<h2 class="display reveal">Our picks</h2>
  <div class="hotels">${s.hotels.map(hotelCard).join('')}</div>` : ''}
  ${faqBlock(s.faqs)}
  <p class="reveal"><a class="btn btn-dark" href="/destinations/${d.slug}/">Read the full ${d.name} guide →</a></p>
  ${authorBox(s.updated)}
</div>`;
    const realHotels = s.hotels.filter((h) => !h.placeholder);
    return { path, noindex: hasPlaceholders, html: layout({ title: s.title, description: s.description, path, image: ogImg(s.photo), imageAlt: PH.alt(s.photo), type: 'article', article: { ...s, category: 'Where to stay' }, body, noindex: hasPlaceholders,
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'Article', headline: s.title, description: s.description, datePublished: s.date, dateModified: s.updated, author: authorLd, publisher: orgLd, image: ogImg(s.photo), mainEntityOfPage: abs(path) },
        realHotels.length ? { '@context': 'https://schema.org', '@type': 'ItemList', name: s.title, itemListElement: realHotels.map((h, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'LodgingBusiness', name: h.name, address: { '@type': 'PostalAddress', addressLocality: h.area, addressRegion: 'BA', addressCountry: 'BR' }, priceRange: h.price } })) } : null,
        faqLd(s.faqs)] }) };
  }

  function about() {
    const body = `${pageHero({ item: { photo: PHOTO_ASSIGN.about.hero }, eyebrow: 'About us', title: 'Hi, we’re Liis &amp; Gleb', lede: 'Two travelers who fell for Bahia — its beaches, its food and its rhythm.', crumbs: [['Home', '/'], ['About', '/about/']] })}
<div id="content" class="wrap narrow prose">
  <section class="reveal"><h2>Who we are</h2><p>${C.author.bio}</p>
  ${figure(PHOTO_ASSIGN.about.couple)}
  <p>Bahia is the part of Brazil we keep returning to — from the cobbled streets of Salvador to the island beaches of Morro de São Paulo. We came for the sea and fell for everything else: turquoise water warm enough to stay in for hours, jungle-covered hills rolling straight down to the sand, and tropical flowers in every garden. We love beautiful, refined stays as much as charming local guesthouses with soul, and we cook often — Brazil’s seafood, beef and tropical fruit are some of the best we have ever tasted.</p>
  <p>What stayed with us most is Brazil’s unique, artistic beauty. If you’re used to very polished neighborhoods, the streets might surprise you at first — houses and façades look a bit worn. But they are warm, colorful and full of soul, with plenty of local places for every taste. In Bahia there are drummers on the streets every day, and the performances are amazing.</p></section>
  ${gallery(PHOTO_ASSIGN.about.gallery, 'A few moments from our travels', 'gallery-even')}
  <section class="reveal"><h2>What we loved most</h2><ul><li><strong>The water.</strong> Clear, warm and endlessly blue — natural pools at low tide, reefs alive with fish, and beaches where the sea turns from emerald to turquoise.</li><li><strong>The jungle.</strong> Atlantic rainforest spilling down to the coast, driftwood beaches, red tropical leaves and hibiscus in every garden.</li><li><strong>The light.</strong> Golden evenings over the bay, a caipirinha in hand, with the jungle below and the ocean beyond.</li><li><strong>The flavors.</strong> Shrimp served in a pineapple, ripe mango, the freshest seafood — and cooking with it ourselves.</li><li><strong>The soul.</strong> Drummers in the streets, colorful colonial façades and a warmth that is hard to put into words.</li></ul><p>Our practical tips (tides, beach days, getting around) live in the <a href="/blog/">Journal</a>.</p></section>
  <section class="reveal"><h2 id="editorial-policy">Editorial policy</h2><p>Our guides combine our own first-hand travel with careful research. Anything involving visas, health or safety is checked against official sources (the U.S. State Department, CDC and Brazilian government) for anything involving visas, health or safety. We date every article and update it when things change. We never accept payment for positive coverage.</p></section>
  <section class="reveal"><h2 id="affiliate-disclosure">Affiliate disclosure</h2><p>${C.affiliateDisclosure} Affiliate links are marked and use <code>rel="sponsored"</code>. Commissions help keep this guide free and independent.</p></section>
  <section class="reveal"><h2>About our imagery</h2><p>Photographs come from talented photographers on Unsplash and from our own travels. Every photo is credited to its photographer. Captions describe what is shown; where a location is named, it is the place the photo was taken.</p></section>
  <section class="reveal"><h2>Contact</h2><p>Hotels, pousadas, tour operators and brands: see how we can <a href="/collaborations/">work together</a>. For anything else, write to <a href="mailto:hello@travelbahia.com">hello@travelbahia.com</a>.</p></section>
</div>`;
    return { path: '/about/', html: layout({ title: 'About TravelBahia', description: 'About TravelBahia: who we are, how we research our Bahia travel guides, our editorial policy and affiliate disclosure.', path: '/about/', image: ogImg(DESTINATIONS[0].photo), body,
      schema: [crumbsLd([['Home', '/'], ['About', '/about/']]), { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About TravelBahia', url: abs('/about/'), publisher: orgLd }] }) };
  }

  function collaborations() {
    const path = '/collaborations/';
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
    const body = `${pageHero({ item: { photo: 'U3' }, eyebrow: 'Collaborations', title: 'Let’s tell your Bahia story together', lede: 'For hotels, pousadas, tour operators and travel brands who want to reach travelers planning their trip to Bahia.', crumbs })}
<div id="content" class="wrap narrow prose">
  <section class="reveal"><h2>Who we are</h2><p>We’re Liis and Gleb, the travelers behind TravelBahia. We write in-depth, first-hand guides to Bahia for English-speaking travelers, especially from the United States, covering where to go, where to stay, what to eat and how to travel well. Our guides are built to be found: structured for Google and for AI assistants like ChatGPT and Perplexity, where more and more trips now begin.</p></section>
  <section class="reveal"><h2>Who reads TravelBahia</h2><p>Travelers who are actively planning a trip to Bahia. They search for where to stay in Salvador and Morro de São Paulo, the best natural pools, island tours, safety tips and itineraries. They are looking for exactly the kind of places and experiences you offer, at the moment they are deciding.</p></section>
  <section class="collab-offers reveal" aria-labelledby="offers-h">
    <h2 id="offers-h">How we can work together</h2>
    <div class="areas">${offers.map(([t, e, d]) => `<div class="area"><p class="eyebrow">${e}</p><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </section>
  <section class="reveal"><h2>How it works</h2><ol class="steps">${steps.map(([t, d]) => `<li><strong>${t}.</strong> ${d}</li>`).join('')}</ol></section>
  <section class="reveal"><h2>Our promise to readers</h2><p>We only feature places and experiences we would genuinely recommend to friends, and we always experience them ourselves first. Every paid or gifted partnership is clearly labeled, and affiliate links are marked as sponsored, in line with U.S. FTC guidelines. That honesty is exactly why readers trust our recommendations, and why a feature on TravelBahia is worth having.</p></section>
  <aside class="collab-cta reveal">
    <p class="eyebrow">Get in touch</p>
    <h2>Tell us about your place</h2>
    <p>Email us with your property or experience, location, website or Instagram, and what you have in mind. We reply to every message.</p>
    <a class="btn btn-sun magnetic" href="${mail}">hello@travelbahia.com</a>
  </aside>
</div>`;
    return { path, html: layout({ title: 'Collaborations: Work With TravelBahia', description: 'Partner with TravelBahia: first-hand features for hotels, pousadas, tour operators and travel brands in Bahia, Brazil, with our own photography, reaching travelers as they plan.', path, image: ogImg('U3'), imageAlt: PH.alt('U3'), body,
      schema: [crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Collaborations with TravelBahia', url: abs(path), publisher: orgLd, mainEntity: { '@type': 'Organization', name: C.name, email: 'hello@travelbahia.com', url: abs('/') } }] }) };
  }

  function privacy() {
    const body = `<div class="wrap narrow prose page-plain"><h1>Privacy policy</h1><p>We collect as little as possible. ${C.analytics.ga4 ? 'We use Google Analytics to understand which guides are read and how visitors find us. It sets cookies and collects anonymized usage data such as pages viewed, approximate location and device type; see <a href="https://policies.google.com/privacy" rel="noopener">Google’s privacy policy</a>. You can opt out with the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">Google Analytics opt-out add-on</a>.' : 'If analytics are enabled we use a privacy-friendly, cookie-free service that does not track you across sites.'} If you subscribe to our newsletter we store only your email address to send it, and you can unsubscribe at any time. Affiliate partners may set their own cookies when you click a booking link; see their policies.</p><p>Questions: <a href="mailto:hello@travelbahia.com">hello@travelbahia.com</a>.</p></div>`;
    return { path: '/privacy/', html: layout({ title: 'Privacy Policy', description: 'TravelBahia privacy policy.', path: '/privacy/', image: ogImg(PHOTO_ASSIGN.home.hero), body, bodyClass: 'plain' }) };
  }

  function notFound() {
    const body = `<section class="page-hero nf"><div class="page-hero-media">${img('M6', { eager: true })}</div><div class="page-hero-shade"></div><div class="page-hero-content"><p class="eyebrow">404</p><h1>Lost at sea.</h1><p class="lede">That page drifted off. Try the <a href="/destinations/">destinations</a> or the <a href="/blog/">journal</a>.</p></div></section>`;
    return { path: '/404.html', file: '404.html', html: layout({ title: 'Page not found', description: 'Page not found', path: '/404.html', image: ogImg(PHOTO_ASSIGN.home.hero), body, noindex: true }) };
  }

  return { home, destinationsIndex, destinationPage, blogIndex, articlePage, staysIndex, stayPage, about, collaborations, privacy, notFound, strip, abs, fmtDate, esc };
})();

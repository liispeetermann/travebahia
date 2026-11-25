/* ============================================================
   build(): returns { 'relative/path': 'file contents' } for the whole site.
   Environment-agnostic — run by build.sh (macOS, no installs) or build-node.js.
   ============================================================ */

function build() {
  const files = {};
  const pages = [];
  const C = CONFIG;
  const today = ARTICLES.concat(STAYS).map((a) => a.updated).sort().pop();

  files['favicon.svg'] = ART.favicon;

  /* ---- pages ---- */
  /* clean URLs: "/blog/" → blog/index.html, "/blog/my-post" → blog/my-post.html (GitHub Pages serves it at /blog/my-post) */
  const add = (p, meta = {}) => {
    const rel = p.path.replace(/^\//, '');
    let file = p.file;
    if (!file) { if (rel === '' || rel.endsWith('/')) file = rel + 'index.html'; else file = rel + '.html'; }
    files[file] = p.html;
    if (!p.noindex && p.path !== '/404.html') pages.push({ path: p.path, ...meta });
  };
  add(T.home(), { priority: '1.0', lastmod: today });
  add(T.destinationsIndex(), { priority: '0.9', lastmod: today });
  DESTINATIONS.forEach((d) => add(T.destinationPage(d), { priority: d.featured ? '0.9' : '0.8', lastmod: today, image: PH.url(d.photo, 1600), imageTitle: d.name }));
  add(T.blogIndex(), { priority: '0.9', lastmod: today });
  ARTICLES.forEach((a) => add(T.articlePage(a), { priority: '0.8', lastmod: a.updated, image: PH.url(a.photo, 1600), imageTitle: a.title }));
  add(T.staysIndex(), { priority: '0.7', lastmod: today });
  STAYS.forEach((s) => add(T.stayPage(s), { priority: '0.7', lastmod: s.updated }));
  add(T.about(), { priority: '0.5', lastmod: today });
  add(T.collaborations(), { priority: '0.6', lastmod: today });
  add(T.privacy(), { priority: '0.2', lastmod: today });
  add(T.notFound());

  /* ---- sitemap (with image extension) ---- */
  files['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map((p) => `  <url><loc>${T.abs(p.path)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority>${p.image ? `<image:image><image:loc>${T.esc(p.image.startsWith("/") ? T.abs(p.image) : p.image)}</image:loc><image:title>${T.esc(p.imageTitle)}</image:title></image:image>` : ''}</url>`).join('\n')}
</urlset>
`;

  /* ---- robots: welcome search engines AND AI assistants ---- */
  const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot', 'meta-externalagent', 'DuckAssistBot', 'MistralAI-User'];
  files['robots.txt'] = `# ${C.name} — search engines and AI assistants are welcome.
User-agent: *
Allow: /
Disallow: /404.html

${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${C.domain}/sitemap.xml
`;

  /* ---- llms.txt: a concise, AI-readable map of the site ---- */
  const sortedArticles = ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));
  files['llms.txt'] = `# ${C.name}

> ${C.description}

${C.name} (${C.domain}) is an independent English-language travel guide to the state of Bahia in northeastern Brazil, written for travelers from the United States. Content is dated, first-hand, and safety/visa/health information is checked against official U.S. and Brazilian sources.

## Destinations
${DESTINATIONS.map((d) => `- [${d.name}](${T.abs(`/destinations/${d.slug}`)}): ${d.tagline}. Best time: ${d.quick.best}. Ideal stay: ${d.quick.days}.`).join('\n')}

## Guides
${sortedArticles.map((a) => `- [${a.title}](${T.abs(`/blog/${a.slug}`)}): ${a.tldr}`).join('\n')}

## Where to stay
${STAYS.map((s) => `- [${s.title}](${T.abs(`/stays/${s.slug}`)}): ${s.tldr}`).join('\n')}

## Optional
- [Full content for LLMs](${T.abs('/llms-full.txt')})
- [About & editorial policy](${T.abs('/about')})
`;

  /* ---- llms-full.txt: every page's substance as clean Markdown ---- */
  const md = (html) => T.strip(html.replace(/<li>/g, '\n- ').replace(/<\/p>/g, '\n\n'));
  let full = `# ${C.name} — full content\n\nSource: ${C.domain}. Last updated ${today}.\n\n`;
  DESTINATIONS.forEach((d) => {
    full += `\n---\n\n# ${d.name}, Bahia, Brazil\nURL: ${T.abs(`/destinations/${d.slug}`)}\n\n${d.intro}\n\n- Best time: ${d.quick.best}\n- Ideal stay: ${d.quick.days}\n- Getting there: ${d.quick.airport}\n- Vibe: ${d.quick.vibe}\n\n`;
    d.sections.forEach((s) => { full += `## ${s.h}\n${md(s.html)}\n\n`; });
    d.faqs.forEach((f) => { full += `**Q: ${f.q}**\nA: ${f.a}\n\n`; });
  });
  sortedArticles.forEach((a) => {
    full += `\n---\n\n# ${a.title}\nURL: ${T.abs(`/blog/${a.slug}`)} · Updated ${a.updated}\n\n**Quick answer:** ${a.tldr}\n\n`;
    a.body.forEach((s) => { full += `## ${s.h}\n${md(s.html)}\n\n`; });
    a.faqs.forEach((f) => { full += `**Q: ${f.q}**\nA: ${f.a}\n\n`; });
  });
  files['llms-full.txt'] = full;

  /* ---- add US$ next to every R$ price, e.g. "R$70" → "R$70 (~US$12)", "R$150–175" → "R$150–175 (~US$25–30)" ---- */
  const toNum = (s) => {
    let t = s.replace(/,/g, '');
    if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, ''); // Brazilian thousands "1.500"
    return parseFloat(t);
  };
  const fmtUSD = (r, big) => {
    const u = r / C.usdRate;
    if (u < 1 && !big) return u.toFixed(2);
    if (u < 10 && !big) { const v = Math.round(u * 2) / 2; return Number.isInteger(v) ? String(v) : v.toFixed(1); }
    if (u < 100) return String(Math.max(1, Math.round(u)));
    if (u < 1000) return String(Math.round(u / 5) * 5);
    return (Math.round(u / 10) * 10).toLocaleString('en-US');
  };
  const addUSD = (text) => text.replace(/R\$\s?(\d[\d.,]*\d|\d)(?:\s?[–-]\s?(?:R\$\s?)?(\d[\d.,]*\d|\d))?(\+)?(?!\s?\(~US\$)/g, (m, a, b, plus) => {
    const lo = toNum(a), hi = b ? toNum(b) : null;
    if (!isFinite(lo)) return m;
    const big = hi && hi / C.usdRate >= 10;
    const usd = hi ? `${fmtUSD(lo, big)}–${fmtUSD(hi, big)}` : fmtUSD(lo);
    return `${m} (~US$${usd}${plus || ''})`;
  });
  Object.keys(files).filter((p) => /\.(html|txt)$/.test(p)).forEach((p) => {
    if (p.endsWith('.html')) {
      // convert visible text and meta/JSON-LD text, but never inside URLs or attribute names
      files[p] = files[p].replace(/(>[^<]*<)|(content="[^"]*")|(<script type="application\/ld\+json">[\s\S]*?<\/script>)/g, (m) => addUSD(m));
    } else files[p] = addUSD(files[p]);
  });


  files['manifest.webmanifest'] = JSON.stringify({ name: C.name, short_name: C.name, start_url: '/', display: 'standalone', background_color: '#fbf7ef', theme_color: '#0b2f4a', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }] }, null, 2);

  return files;
}

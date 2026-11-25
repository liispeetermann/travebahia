/* Photo check: every photo should appear once across the site (cards reuse their page's hero).
   Run by build.sh; prints repeats, unknown keys and unused photos. */
function checkPhotos() {
  const uses = {};
  const add = (k, where) => { if (k) (uses[k] = uses[k] || []).push(where); };
  const A = PHOTO_ASSIGN;
  add(A.home.hero, 'home hero'); add(A.home.storyBg, 'home story');
  A.home.ourLens.forEach((k) => add(k, 'home lens')); A.underwater.forEach((k) => add(k, 'home underwater'));
  Object.entries(A.pages).forEach(([p, k]) => add(k, p + ' hero'));
  const group = (obj, label) => Object.entries(obj).forEach(([slug, v]) => { add(v.photo, `${label} ${slug} hero`); (v.gallery || []).forEach((k) => add(k, `${label} ${slug} gallery`)); (v.hotelPhotos || []).forEach((k) => add(k, `${label} ${slug} hotel`)); });
  group(A.destinations, 'destination'); group(A.articles, 'article'); group(A.stays, 'stay');
  add(A.about.hero, 'about hero'); add(A.about.couple, 'about couple'); A.about.gallery.forEach((k) => add(k, 'about gallery'));
  Object.entries(SECTION_PHOTOS).forEach(([slug, secs]) => Object.entries(secs).forEach(([h, keys]) => add(keys[0], `${slug} › ${h}`)));
  const out = [];
  Object.entries(uses).forEach(([k, w]) => { if (!PHOTOS[k]) out.push(`UNKNOWN photo "${k}" (${w.join('; ')})`); else if (w.length > 1) out.push(`REPEATED ${k}: ${w.join(' | ')}`); });
  // section headings that don't exist
  const items = {}; DESTINATIONS.forEach((d) => items[d.slug] = d.sections); ARTICLES.forEach((a) => items[a.slug] = a.body); STAYS.forEach((s) => items[s.slug] = s.sections);
  Object.entries(SECTION_PHOTOS).forEach(([slug, secs]) => Object.keys(secs).forEach((h) => { if (!items[slug] || !items[slug].some((s) => s.h === h)) out.push(`NO SECTION "${h}" in ${slug}`); }));
  const unused = Object.keys(PHOTOS).filter((k) => !uses[k]);
  out.push(`${Object.keys(uses).length} photos placed; unused: ${unused.join(', ') || 'none'}`);
  return out.join('\n');
}

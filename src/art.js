/* ============================================================
   TravelBahia generative art engine
   Produces animated, art-directed SVG scenes of Bahia's landscapes.
   Every scene is deterministic (seeded) so builds are reproducible.
   ============================================================ */

const ART = (() => {
  const W = 1600, H = 1000;
  const f = (n) => Math.round(n * 10) / 10;

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let s = (typeof seed === 'string' ? hash(seed) : seed) >>> 0 || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  /* ---------- palettes ---------- */
  const PALETTES = {
    sunset: { sky: ['#1b2457', '#6d3b8e', '#ef6f5c', '#ffc677'], sun: '#ffe3a8', glow: '#ffb36b',
      sea: ['#f39a74', '#4a4f8f', '#151f4a'], sand: '#e2ad80', sand2: '#b9785a', far: '#5b3a6e', mid: '#3a2350', near: '#1d1030', palm: '#170b22', trunk: '#170b22', foam: '#ffd9bd' },
    day: { sky: ['#1f7fd1', '#69bdf0', '#d9f2ff', '#fdf8ea'], sun: '#fffbe9', glow: '#ffffff',
      sea: ['#9cf0e6', '#21b8c6', '#0a6a8e'], sand: '#f6e3bb', sand2: '#e5c58f', far: '#79b9a7', mid: '#3f9670', near: '#1f6b4a', palm: '#1d5c3c', trunk: '#6b4a30', foam: '#ffffff' },
    golden: { sky: ['#2f5f9e', '#7fa4c9', '#f6c27a', '#ffe7b0'], sun: '#fff1c4', glow: '#ffcf7a',
      sea: ['#ffd8a0', '#3a93a6', '#123f63'], sand: '#efc994', sand2: '#d29a62', far: '#7d7f8f', mid: '#4a5a4f', near: '#26322a', palm: '#202419', trunk: '#2a241a', foam: '#fff3dc' },
    dawn: { sky: ['#26355f', '#7d5a8c', '#e08a8a', '#fbc5a1'], sun: '#ffe9d1', glow: '#ffbfa0',
      sea: ['#f6bca3', '#6a6390', '#2c4870'], sand: '#e9c0a0', sand2: '#c08f78', far: '#d29a8e', mid: '#a0605a', near: '#3f2a33', palm: '#221b33', trunk: '#221b33', foam: '#ffe6da' },
    dusk: { sky: ['#0c1636', '#2c2a63', '#8a4c7d', '#e7857a'], sun: '#ffd1a8', glow: '#ff9a7a',
      sea: ['#d9807a', '#2e3466', '#0b1230'], sand: '#a9757a', sand2: '#6f4b5e', far: '#3c3463', mid: '#26224a', near: '#120f2a', palm: '#0b0920', trunk: '#0b0920', foam: '#f5c1b3' },
    jungle: { sky: ['#3f8fc4', '#8fd0e8', '#e4f6f2', '#fbfbef'], sun: '#ffffff', glow: '#ffffff',
      sea: ['#a8efe0', '#2fb2a8', '#0f6f78'], sand: '#f0dcb0', sand2: '#d6b77c', far: '#6fae8a', mid: '#2f7f55', near: '#14512f', palm: '#134a2c', trunk: '#5b3f28', foam: '#ffffff' },
  };

  /* ---------- primitives ---------- */
  function gradient(id, stops, x2 = 0, y2 = 1) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">` +
      stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('') + `</linearGradient>`;
  }

  function ridge(r, baseY, amp, opts = {}) {
    const n = 128, pts = [];
    const freq = opts.freq || 2.2, phase = r() * 10;
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * W;
      const t = i / n;
      let y = baseY - amp * (0.55 * Math.sin(t * Math.PI * freq + phase) + 0.3 * Math.sin(t * Math.PI * freq * 2.7 + phase * 2) + 0.15 * Math.sin(t * Math.PI * freq * 7.3 + phase * 3));
      if (opts.shape) y += opts.shape(t) * amp;
      pts.push(`${f(x)} ${f(y)}`);
    }
    return `M0 ${H} L${pts.join(' L')} L${W} ${H} Z`;
  }

  function waveLine(y, amp, period, width = W * 2 + 400) {
    let d = `M-200 ${f(y)}`;
    let i = 0;
    for (let x = -200; x < width; x += period / 2, i++) {
      d += ` Q${f(x + period / 4)} ${f(y + (i % 2 ? amp : -amp))} ${f(x + period / 2)} ${f(y)}`;
    }
    return d;
  }

  function waves(r, top, bottom, color, count = 9, speed = 1) {
    let out = '';
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = lerp(top + 6, bottom, Math.pow(t, 1.6));
      const period = lerp(70, 340, t);
      const amp = lerp(1.2, 9, t);
      const op = lerp(0.18, 0.5, t);
      const sw = lerp(0.8, 3.2, t);
      const dur = f(lerp(26, 9, t) / speed);
      const dir = i % 2 ? -1 : 1;
      out += `<path d="${waveLine(y, amp, period)}" fill="none" stroke="${color}" stroke-opacity="${f(op)}" stroke-width="${f(sw)}" stroke-linecap="round" stroke-dasharray="${f(period * (0.6 + r()))} ${f(period * (0.3 + r() * 0.8))}">` +
        `<animateTransform attributeName="transform" type="translate" from="0 0" to="${f(dir * period)} 0" dur="${dur}s" repeatCount="indefinite"/></path>`;
    }
    return out;
  }

  function sun(cx, cy, rad, P, id = 's') {
    return `<radialGradient id="${id}g"><stop offset="0" stop-color="${P.glow}" stop-opacity=".9"/><stop offset=".35" stop-color="${P.glow}" stop-opacity=".35"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></radialGradient>` +
      `<circle cx="${cx}" cy="${cy}" r="${rad * 6}" fill="url(#${id}g)"><animate attributeName="r" values="${rad * 5.6};${rad * 6.4};${rad * 5.6}" dur="9s" repeatCount="indefinite"/></circle>` +
      `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${P.sun}"/>`;
  }

  function reflection(r, cx, top, bottom, color) {
    let out = '<g>';
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      const y = lerp(top + 4, bottom, Math.pow(t, 1.4));
      const w = lerp(30, 240, t) * (0.5 + r());
      const x = cx - w / 2 + (r() - 0.5) * lerp(10, 120, t);
      const d = f(2 + r() * 4);
      out += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(lerp(1.5, 6, t))}" rx="3" fill="${color}" opacity="${f(0.2 + r() * 0.5)}"><animate attributeName="opacity" values="${f(0.1 + r() * 0.2)};${f(0.5 + r() * 0.4)};${f(0.1 + r() * 0.2)}" dur="${d}s" repeatCount="indefinite"/></rect>`;
    }
    return out + '</g>';
  }

  function clouds(r, P, n = 5, top = 60, bottom = 320, color = '#ffffff', op = 0.5) {
    let out = '<g filter="url(#blur)">';
    for (let i = 0; i < n; i++) {
      const cx = r() * W, cy = lerp(top, bottom, r()), w = 160 + r() * 320;
      const dur = f(90 + r() * 120);
      out += `<g opacity="${f(op * (0.5 + r() * 0.5))}"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w)}" ry="${f(w * 0.16)}" fill="${color}"/><ellipse cx="${f(cx + w * 0.3)}" cy="${f(cy - w * 0.08)}" rx="${f(w * 0.5)}" ry="${f(w * 0.14)}" fill="${color}"/>` +
        `<animateTransform attributeName="transform" type="translate" values="0 0;${f(120 + r() * 160)} 0;0 0" dur="${dur}s" repeatCount="indefinite"/></g>`;
    }
    return out + '</g>';
  }

  function stars(r, n = 120, maxY = 450) {
    let out = '<g fill="#fff">';
    for (let i = 0; i < n; i++) {
      const o = f(0.2 + r() * 0.8);
      out += `<circle cx="${f(r() * W)}" cy="${f(r() * maxY)}" r="${f(0.5 + r() * 1.6)}" opacity="${o}"><animate attributeName="opacity" values="${o};${f(o * 0.2)};${o}" dur="${f(2 + r() * 5)}s" repeatCount="indefinite"/></circle>`;
    }
    return out + '</g>';
  }

  function birds(r, n = 5, x0 = 300, y0 = 220, color = '#1a1026') {
    let out = `<g fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round">`;
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * 300, y = y0 + r() * 120, s = 8 + r() * 10;
      const dur = f(1 + r() * 0.8);
      out += `<g><path d="M${f(x - s)} ${f(y)} Q${f(x - s / 2)} ${f(y - s * 0.6)} ${f(x)} ${f(y)} Q${f(x + s / 2)} ${f(y - s * 0.6)} ${f(x + s)} ${f(y)}"><animate attributeName="d" values="M${f(x - s)} ${f(y)} Q${f(x - s / 2)} ${f(y - s * 0.6)} ${f(x)} ${f(y)} Q${f(x + s / 2)} ${f(y - s * 0.6)} ${f(x + s)} ${f(y)};M${f(x - s)} ${f(y - s * 0.3)} Q${f(x - s / 2)} ${f(y + s * 0.3)} ${f(x)} ${f(y)} Q${f(x + s / 2)} ${f(y + s * 0.3)} ${f(x + s)} ${f(y - s * 0.3)};M${f(x - s)} ${f(y)} Q${f(x - s / 2)} ${f(y - s * 0.6)} ${f(x)} ${f(y)} Q${f(x + s / 2)} ${f(y - s * 0.6)} ${f(x + s)} ${f(y)}" dur="${dur}s" repeatCount="indefinite"/></path>` +
        `<animateTransform attributeName="transform" type="translate" values="0 0;${f(260 + r() * 200)} ${f(-40 + r() * 30)}" dur="${f(30 + r() * 20)}s" repeatCount="indefinite"/></g>`;
    }
    return out + '</g>';
  }

  /* Coconut palm: tapered trunk polygon + crescent fronds with gentle sway */
  function palm(r, x, y, h, lean, P) {
    const x1 = x + lean * 0.15, y1 = y - h * 0.55, x2 = x + lean, y2 = y - h;
    const L = [], R = [], N = 16;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const bx = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * x1 + t * t * x2;
      const by = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * y1 + t * t * y2;
      const dx = 2 * (1 - t) * (x1 - x) + 2 * t * (x2 - x1);
      const dy = 2 * (1 - t) * (y1 - y) + 2 * t * (y2 - y1);
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const w = lerp(h * 0.032, h * 0.016, t) * (1 + (i % 3 === 0 ? 0.12 : 0));
      L.push(`${f(bx + nx * w)} ${f(by + ny * w)}`);
      R.unshift(`${f(bx - nx * w)} ${f(by - ny * w)}`);
    }
    let fronds = '';
    const n = 9 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const a = Math.PI + (k / (n - 1)) * Math.PI + (r() - 0.5) * 0.25;
      const Lf = h * (0.36 + r() * 0.16);
      const droop = Lf * (0.25 + 0.45 * Math.abs(Math.cos(a)));
      const tx = x2 + Math.cos(a) * Lf, ty = y2 + Math.sin(a) * Lf * 0.55 + droop;
      const cx = x2 + Math.cos(a) * Lf * 0.5, cy = y2 + Math.sin(a) * Lf * 0.55 - Lf * 0.18;
      // rachis + drooping leaflets on both sides
      let d = `M${f(x2)} ${f(y2)} Q${f(cx)} ${f(cy)} ${f(tx)} ${f(ty)}`;
      const M = 16;
      for (let i = 2; i <= M; i++) {
        const t = i / M;
        const px = (1 - t) * (1 - t) * x2 + 2 * (1 - t) * t * cx + t * t * tx;
        const py = (1 - t) * (1 - t) * y2 + 2 * (1 - t) * t * cy + t * t * ty;
        let dx = 2 * (1 - t) * (cx - x2) + 2 * t * (tx - cx), dy = 2 * (1 - t) * (cy - y2) + 2 * t * (ty - cy);
        const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
        const len = Lf * 0.26 * Math.sin(Math.PI * Math.min(1, t * 1.15)) + Lf * 0.03;
        [1, -1].forEach((side) => {
          let lx = -dy * side + dx * 0.55, ly = dx * side + dy * 0.55 + 0.75;
          const ll = Math.hypot(lx, ly) || 1; lx /= ll; ly /= ll;
          d += ` M${f(px)} ${f(py)} Q${f(px + lx * len * 0.5 + dx * len * 0.15)} ${f(py + ly * len * 0.35)} ${f(px + lx * len)} ${f(py + ly * len)}`;
        });
      }
      fronds += `<path d="${d}" fill="none" stroke="${P.palm}" stroke-width="${f(Math.max(2.2, Lf * 0.028))}" stroke-linecap="round"/>`;
    }
    const nuts = `<circle cx="${f(x2 - 6)}" cy="${f(y2 + 8)}" r="${f(h * 0.018)}"/><circle cx="${f(x2 + 6)}" cy="${f(y2 + 10)}" r="${f(h * 0.018)}"/>`;
    const sw = f(1.2 + r() * 1.8), dur = f(5 + r() * 3);
    return `<g><path d="M${L.join(' L')} L${R.join(' L')} Z" fill="${P.trunk}"/>` +
      `<g fill="${P.palm}">${fronds}${nuts}<animateTransform attributeName="transform" type="rotate" values="-${sw} ${f(x2)} ${f(y2)};${sw} ${f(x2)} ${f(y2)};-${sw} ${f(x2)} ${f(y2)}" dur="${dur}s" repeatCount="indefinite"/></g></g>`;
  }

  function sailboat(r, x, y, s, color, sail = '#fff') {
    const dur = f(3 + r() * 2);
    return `<g><path d="M${f(x - s)} ${f(y)} L${f(x + s)} ${f(y)} L${f(x + s * 0.7)} ${f(y + s * 0.3)} L${f(x - s * 0.7)} ${f(y + s * 0.3)} Z" fill="${color}"/>` +
      `<path d="M${f(x)} ${f(y - s * 2.2)} L${f(x)} ${f(y - 2)} L${f(x + s * 0.9)} ${f(y - 4)} Z" fill="${sail}"/><path d="M${f(x - 3)} ${f(y - s * 1.8)} L${f(x - 3)} ${f(y - 4)} L${f(x - s * 0.7)} ${f(y - 5)} Z" fill="${sail}" opacity=".85"/>` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;0 ${f(s * 0.12)};0 0" dur="${dur}s" repeatCount="indefinite"/></g>`;
  }

  function lighthouse(x, y, s, body = '#f4efe6', band = '#c2463c', beam = true) {
    let out = `<g><path d="M${f(x - s * 0.5)} ${f(y)} L${f(x - s * 0.32)} ${f(y - s * 3)} L${f(x + s * 0.32)} ${f(y - s * 3)} L${f(x + s * 0.5)} ${f(y)} Z" fill="${body}"/>` +
      `<path d="M${f(x - s * 0.44)} ${f(y - s * 1)} L${f(x - s * 0.39)} ${f(y - s * 1.6)} L${f(x + s * 0.39)} ${f(y - s * 1.6)} L${f(x + s * 0.44)} ${f(y - s * 1)} Z" fill="${band}"/>` +
      `<rect x="${f(x - s * 0.42)}" y="${f(y - s * 3.25)}" width="${f(s * 0.84)}" height="${f(s * 0.28)}" fill="${band}"/>` +
      `<rect x="${f(x - s * 0.26)}" y="${f(y - s * 3.75)}" width="${f(s * 0.52)}" height="${f(s * 0.5)}" fill="#ffe9a6"/>` +
      `<path d="M${f(x - s * 0.34)} ${f(y - s * 3.75)} L${f(x)} ${f(y - s * 4.2)} L${f(x + s * 0.34)} ${f(y - s * 3.75)} Z" fill="${band}"/>`;
    if (beam) out += `<path d="M${f(x)} ${f(y - s * 3.5)} L${f(x + s * 18)} ${f(y - s * 5.5)} L${f(x + s * 18)} ${f(y - s * 1.5)} Z" fill="#fff6cc" opacity=".22"><animateTransform attributeName="transform" type="rotate" values="-25 ${f(x)} ${f(y - s * 3.5)};25 ${f(x)} ${f(y - s * 3.5)};-25 ${f(x)} ${f(y - s * 3.5)}" dur="8s" repeatCount="indefinite"/></path>`;
    return out + '</g>';
  }

  function blob(r, cx, cy, rad, irr = 0.35, n = 9) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = rad * (1 - irr / 2 + r() * irr);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (0.7 + r() * 0.3)]);
    }
    // closed Catmull-Rom → cubic bezier
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + 'Z';
  }

  const defsBase = `<filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="soft"><feGaussianBlur stdDeviation="4"/></filter>`;

  function wrap(title, defs, body) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${title}"><title>${title}</title><defs>${defsBase}${defs}</defs>${body}</svg>`;
  }

  /* ============================ SCENES ============================ */

  function beach(seed, o = {}) {
    const r = rng(seed), P = PALETTES[o.palette || 'sunset'];
    const hz = o.horizon || 560;
    const sunX = o.sunX || 1040, sunY = hz - (o.sunHigh ? 300 : 60);
    let defs = gradient('sky', P.sky) + gradient('sea', P.sea) + gradient('sand', [P.sand, P.sand2]);
    let b = `<rect width="${W}" height="${hz + 2}" fill="url(#sky)"/>`;
    if (o.stars) b += stars(r, 90, hz - 200);
    b += sun(sunX, sunY, o.sunHigh ? 46 : 64, P);
    b += clouds(r, P, 6, 80, hz - 120, P.foam, 0.45);
    // distant headland
    b += `<path d="${ridge(r, hz + 8, 46, { freq: 1.3, shape: (t) => (t < 0.45 ? 0 : 3) })}" fill="${P.far}" opacity=".85"/>`;
    if (o.lighthouse) b += lighthouse(260, hz - 52, 14, '#f4efe6', '#b5473f', true);
    b += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#sea)"/>`;
    b += reflection(r, sunX, hz, hz + 300, P.sun);
    b += waves(r, hz, H - 120, P.foam, 11);
    if (o.boats) for (let i = 0; i < o.boats; i++) b += sailboat(r, 300 + r() * 1000, hz + 30 + r() * 90, 10 + r() * 12, P.near, P.foam);
    if (o.turtle) b += turtle(r, P);
    if (o.cliffs) b += cliffs(r, P);
    // sand foreground with swash animation
    const sandTop = H - 150;
    b += `<path d="M0 ${sandTop + 40} Q400 ${sandTop - 10} 800 ${sandTop + 20} T1600 ${sandTop} L1600 ${H} L0 ${H} Z" fill="url(#sand)"/>`;
    b += `<path d="M0 ${sandTop + 40} Q400 ${sandTop - 10} 800 ${sandTop + 20} T1600 ${sandTop}" fill="none" stroke="${P.foam}" stroke-width="6" stroke-linecap="round" opacity=".7"><animate attributeName="stroke-dasharray" values="0 2000;1800 200;0 2000" dur="7s" repeatCount="indefinite"/></path>`;
    if (o.birds !== false) b += birds(r, 5, 320, hz - 380, P.near);
    // palms
    const palms = o.palms || [[140, H - 40, 560, 120], [330, H - 70, 430, 70], [1460, H - 30, 600, -150]];
    palms.forEach(([x, y, h, lean]) => { b += palm(r, x, y, h, lean, P); });
    return wrap(o.title || 'Beach in Bahia', defs, b);
  }

  function turtle(r, P) {
    const x = 1000, y = 840;
    return `<g opacity=".55"><g><ellipse cx="${x}" cy="${y}" rx="34" ry="24" fill="#1f5a52"/><ellipse cx="${x + 38}" cy="${y}" rx="11" ry="9" fill="#1f5a52"/>` +
      `<path d="M${x - 10} ${y - 18} q-30 -30 -48 -16 q22 6 36 26Z M${x - 10} ${y + 18} q-30 30 -48 16 q22 -6 36 -26Z M${x + 18} ${y - 18} q14 -22 30 -18 q-14 8 -22 22Z M${x + 18} ${y + 18} q14 22 30 18 q-14 -8 -22 -22Z" fill="#1f5a52"/>` +
      `<animateMotion dur="40s" repeatCount="indefinite" path="M0 0 C -200 -40 -400 30 -700 -10 C -900 -30 -500 40 0 0"/></g></g>`;
  }

  function cliffs(r, P) {
    // Trancoso-style coloured sandstone cliffs on the left
    const bands = ['#c2553a', '#d9794a', '#e8a15f', '#b8442f', '#f0c27f'];
    let out = '<g>';
    for (let i = 0; i < bands.length; i++) {
      const top = 430 + i * 60;
      out += `<path d="M0 ${top} C200 ${top - 10} 420 ${top + 30} ${560 - i * 40} ${top + 110} L${520 - i * 40} 1000 L0 1000Z" fill="${bands[i]}" opacity="${f(0.95 - i * 0.05)}"/>`;
    }
    out += `<path d="M0 430 C200 420 420 455 560 540 C470 470 230 400 0 400Z" fill="#2f7a46"/>`;
    // little white chapel on top (Quadrado vibe)
    out += `<g transform="translate(220 360)"><rect x="0" y="20" width="70" height="52" fill="#fbf6ea"/><path d="M-6 22 L35 -4 L76 22Z" fill="#fbf6ea"/><rect x="26" y="-44" width="18" height="44" fill="#fbf6ea"/><path d="M24 -44 L35 -62 L46 -44Z" fill="#3b6fb6"/><rect x="29" y="42" width="12" height="30" fill="#3b6fb6"/><rect x="10" y="34" width="9" height="12" fill="#3b6fb6"/><rect x="51" y="34" width="9" height="12" fill="#3b6fb6"/></g>`;
    return out + '</g>';
  }

  function city(seed, o = {}) {
    // Salvador: colourful colonial upper city on the escarpment, Elevador, the bay
    const r = rng(seed), P = PALETTES[o.palette || 'golden'];
    const hz = 600;
    const facades = ['#f2c14e', '#e8765a', '#5aa9e6', '#f6efe0', '#d1495b', '#ffb4a2', '#7bc8a4', '#9b7ede', '#f79d65', '#4ecdc4'];
    let defs = gradient('sky', P.sky) + gradient('sea', P.sea) + gradient('cliff', ['#6e8b5a', '#3e5a3a']);
    let b = `<rect width="${W}" height="${hz}" fill="url(#sky)"/>`;
    b += sun(1280, 380, 58, P);
    b += clouds(r, P, 5, 70, 320, '#fff', 0.4);
    b += `<path d="${ridge(r, hz + 6, 14, { freq: 1.1 })}" fill="${P.far}" opacity=".7"/>`; // Itaparica island
    b += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#sea)"/>`;
    b += reflection(r, 1280, hz, hz + 260, P.sun);
    b += waves(r, hz, H - 40, '#fff', 8, 0.7);
    for (let i = 0; i < 4; i++) b += sailboat(r, 1050 + r() * 480, hz + 40 + r() * 200, 10 + r() * 14, '#1e2a3a', '#fff');
    // escarpment
    b += `<path d="M0 470 L980 500 C1020 520 1060 640 1110 1000 L0 1000Z" fill="url(#cliff)"/>`;
    // vegetation texture on cliff
    for (let i = 0; i < 70; i++) {
      const x = r() * 1040, y = 520 + r() * 380;
      if (x > 980 + (y - 500) * 0.25) continue;
      b += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(6 + r() * 16)}" fill="${pick(r, ['#2f5b36', '#4a7a46', '#25472c'])}" opacity=".8"/>`;
    }
    // upper city row
    const row = (x0, x1, base, hmin, hmax, scale = 1) => {
      let out = '', x = x0;
      while (x < x1) {
        const w = (38 + r() * 46) * scale, h = (hmin + r() * (hmax - hmin)) * scale, c = pick(r, facades);
        out += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h + 4)}" fill="${c}"/>`;
        out += `<rect x="${f(x - 2)}" y="${f(base - h - 6 * scale)}" width="${f(w + 4)}" height="${f(7 * scale)}" fill="#a8452f"/>`;
        const cols = Math.max(1, Math.floor(w / (16 * scale))), rows = Math.max(1, Math.floor(h / (22 * scale)));
        for (let cx = 0; cx < cols; cx++) for (let ry = 0; ry < rows; ry++) {
          out += `<rect x="${f(x + 6 * scale + cx * (w - 10 * scale) / cols)}" y="${f(base - h + 8 * scale + ry * 22 * scale)}" width="${f(6 * scale)}" height="${f(11 * scale)}" fill="#24324a" opacity=".75"/>`;
        }
        x += w;
      }
      return out;
    };
    b += row(0, 960, 482, 50, 110);
    // church with twin towers (Pelourinho-esque)
    const church = (x, base, s, col = '#f6efe0', trim = '#3f7cc2') =>
      `<g><rect x="${x}" y="${base - 120 * s}" width="${110 * s}" height="${120 * s}" fill="${col}"/>` +
      `<path d="M${x} ${base - 120 * s} L${x + 55 * s} ${base - 160 * s} L${x + 110 * s} ${base - 120 * s}Z" fill="${col}"/>` +
      `<rect x="${x - 26 * s}" y="${base - 190 * s}" width="${30 * s}" height="${190 * s}" fill="${col}"/><rect x="${x + 106 * s}" y="${base - 190 * s}" width="${30 * s}" height="${190 * s}" fill="${col}"/>` +
      `<path d="M${x - 30 * s} ${base - 190 * s} Q${x - 11 * s} ${base - 240 * s} ${x + 8 * s} ${base - 190 * s}Z M${x + 102 * s} ${base - 190 * s} Q${x + 121 * s} ${base - 240 * s} ${x + 140 * s} ${base - 190 * s}Z" fill="${trim}"/>` +
      `<rect x="${x + 42 * s}" y="${base - 60 * s}" width="${26 * s}" height="${60 * s}" rx="${13 * s}" fill="${trim}"/><circle cx="${x + 55 * s}" cy="${base - 95 * s}" r="${11 * s}" fill="${trim}"/></g>`;
    b += church(420, 484, 0.9);
    b += church(760, 488, 0.6, '#f2c14e', '#7a3b2e');
    // Elevador Lacerda
    b += `<g><rect x="860" y="500" width="54" height="420" fill="#e9e1cf"/><rect x="842" y="452" width="96" height="58" fill="#efe7d4"/>` +
      `<rect x="852" y="464" width="76" height="10" fill="#3a5a7a" opacity=".6"/><rect x="852" y="484" width="76" height="10" fill="#3a5a7a" opacity=".6"/>` +
      `<rect x="872" y="510" width="6" height="400" fill="#cfc4ab"/><rect x="896" y="510" width="6" height="400" fill="#cfc4ab"/>` +
      `<rect x="874" y="700" width="26" height="30" fill="#f2c14e"><animate attributeName="y" values="880;520;520;880;880" dur="14s" repeatCount="indefinite"/></rect></g>`;
    // lower city by the water
    b += row(0, 1080, 935, 40, 90, 0.9);
    b += `<rect x="0" y="930" width="1140" height="70" fill="#2b3b4a"/>`;
    b += birds(r, 6, 980, 180, '#2a2a3a');
    return wrap(o.title || 'Salvador, Bahia', defs, b);
  }

  function mountains(seed, o = {}) {
    // Chapada Diamantina: flat-topped mesas, waterfall, cerrado
    const r = rng(seed), P = PALETTES[o.palette || 'dawn'];
    let defs = gradient('sky', P.sky) + `<pattern id="stri" width="18" height="40" patternUnits="userSpaceOnUse"><path d="M3 0 V40 M11 0 V40" stroke="#000" stroke-opacity=".12" stroke-width="2"/></pattern>`;
    let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
    if (o.stars) b += stars(r, 160, 420);
    b += sun(o.sunX || 420, o.sunY || 420, 50, P);
    b += clouds(r, P, 5, 80, 300, '#fff', 0.35);
    const layer = (base, top, plateaus, fill, op) => {
      let pts = [`0 ${base}`];
      plateaus.sort((a, c) => a[0] - c[0]).forEach(([x, w, t]) => {
        const slope = 90 + r() * 80, cliff = t + (base - t) * (0.4 + r() * 0.2);
        pts.push(`${f(x - slope)} ${f(base - 10 * r())}`);
        pts.push(`${f(x - slope * 0.45)} ${f(cliff + (base - cliff) * 0.35)}`);
        pts.push(`${f(x - slope * 0.12)} ${f(cliff)}`);
        pts.push(`${f(x)} ${f(t)}`);
        for (let k = 1; k < 6; k++) pts.push(`${f(x + (w * k) / 6)} ${f(t + (r() - 0.5) * 6)}`);
        pts.push(`${f(x + w)} ${f(t)}`);
        pts.push(`${f(x + w + slope * 0.12)} ${f(cliff)}`);
        pts.push(`${f(x + w + slope * 0.45)} ${f(cliff + (base - cliff) * 0.35)}`);
        pts.push(`${f(x + w + slope)} ${f(base - 10 * r())}`);
      });
      pts.push(`${W} ${base}`, `${W} ${H}`, `0 ${H}`);
      const d = `M${pts.join(' L')}Z`;
      return `<path d="${d}" fill="${fill}" opacity="${op}"/><path d="${d}" fill="url(#stri)" opacity="${op}"/>`;
    };
    b += layer(640, 0, [[80, 260, 380], [520, 180, 420], [900, 380, 360], [1380, 260, 400]], P.far, 0.7);
    b += `<rect y="520" width="${W}" height="200" fill="${P.sky[3]}" opacity=".25" filter="url(#blur)"/>`;
    b += layer(760, 0, [[-60, 360, 470], [640, 300, 440], [1180, 480, 500]], P.mid, 0.92);
    // waterfall from the middle mesa
    const wx = 790, wt = 446, wb = 760;
    b += `<g stroke="#fff" stroke-linecap="round" fill="none">`;
    for (let i = 0; i < 6; i++) {
      const x = wx + i * 3;
      b += `<path d="M${x} ${wt} C${x + 4} ${wt + 80} ${x - 6} ${wb - 120} ${x + (i - 3) * 6} ${wb}" stroke-width="${f(1.5 + r() * 2.5)}" stroke-opacity="${f(0.5 + r() * 0.4)}" stroke-dasharray="${f(20 + r() * 30)} ${f(14 + r() * 20)}"><animate attributeName="stroke-dashoffset" from="0" to="-300" dur="${f(2 + r() * 2)}s" repeatCount="indefinite"/></path>`;
    }
    b += `</g><ellipse cx="${wx + 8}" cy="${wb}" rx="70" ry="26" fill="#fff" opacity=".45" filter="url(#blur)"><animate attributeName="rx" values="60;90;60" dur="5s" repeatCount="indefinite"/></ellipse>`;
    b += layer(880, 0, [[300, 220, 640], [1300, 380, 610]], P.near, 1);
    // cerrado shrubs
    b += `<path d="${ridge(r, 930, 18, { freq: 3 })}" fill="${P.near}"/>`;
    for (let i = 0; i < 60; i++) {
      const x = r() * W, y = 900 + r() * 100;
      b += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(8 + r() * 22)}" fill="${pick(r, [P.near, P.mid])}" opacity=".9"/>`;
    }
    b += birds(r, 4, 1000, 220, P.near);
    return wrap(o.title || 'Chapada Diamantina', defs, b);
  }

  function aerial(seed, o = {}) {
    // Natural pools / sandbars seen from above
    const r = rng(seed);
    let defs = `<radialGradient id="water" cx=".45" cy=".5" r=".75"><stop offset="0" stop-color="#bff7ef"/><stop offset=".35" stop-color="#4fd6d0"/><stop offset=".7" stop-color="#1596b5"/><stop offset="1" stop-color="#0a4d7a"/></radialGradient>` +
      `<pattern id="caus" width="160" height="160" patternUnits="userSpaceOnUse"><path d="M0 40 Q40 10 80 40 T160 40 M0 120 Q40 90 80 120 T160 120 M40 0 Q10 40 40 80 T40 160 M120 0 Q90 40 120 80 T120 160" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2.5"/><animateTransform attributeName="patternTransform" type="translate" values="0 0;40 25;0 0" dur="12s" repeatCount="indefinite"/></pattern>`;
    let b = `<rect width="${W}" height="${H}" fill="url(#water)"/>`;
    // sandbar
    b += `<path d="${blob(r, 560, 470, 300, 0.5, 11)}" fill="#f7ebcf" opacity=".95"/>`;
    b += `<path d="${blob(r, 560, 470, 360, 0.5, 11)}" fill="#e9f8f2" opacity=".35"/>`;
    // reefs
    for (let i = 0; i < 16; i++) {
      const cx = r() * W, cy = r() * H, rad = 50 + r() * 130;
      if (Math.hypot(cx - 560, cy - 470) < 320) continue;
      b += `<path d="${blob(r, cx, cy, rad, 0.7, 10)}" fill="${pick(r, ['#1d7c84', '#2a6e6a', '#5b7a5e', '#167a8f'])}" opacity=".55"/>`;
      b += `<path d="${blob(r, cx, cy, rad * 0.55, 0.7, 8)}" fill="${pick(r, ['#b9886a', '#8f6f5a', '#2a5a5a'])}" opacity=".45"/>`;
    }
    b += `<rect width="${W}" height="${H}" fill="url(#caus)"/>`;
    // fish school
    let fish = '';
    for (let i = 0; i < 14; i++) fish += `<ellipse cx="${f(r() * 70)}" cy="${f(r() * 40)}" rx="7" ry="2.6" fill="#0b4a5c" opacity=".6"/>`;
    b += `<g><g transform="translate(1100 300)">${fish}</g><animateMotion dur="30s" repeatCount="indefinite" path="M0 0 C-200 100 -300 300 -100 420 C100 540 300 300 0 0"/></g>`;
    // boat with wake
    b += `<g><path d="M1240 640 C1300 700 1380 760 1500 790" stroke="#fff" stroke-width="10" stroke-opacity=".4" fill="none" stroke-dasharray="30 20"><animate attributeName="stroke-dashoffset" from="0" to="-100" dur="2s" repeatCount="indefinite"/></path>` +
      `<path d="M1190 600 Q1215 585 1250 620 Q1262 640 1245 652 Q1215 640 1190 600Z" fill="#fff"/><path d="M1205 608 Q1222 600 1240 622 Q1230 630 1205 608Z" fill="#d2533c"/></g>`;
    // snorkelers
    for (let i = 0; i < 5; i++) {
      const x = 860 + r() * 220, y = 280 + r() * 160;
      b += `<g><circle cx="${f(x)}" cy="${f(y)}" r="5" fill="${pick(r, ['#ff7a59', '#ffd166', '#ef476f'])}"/><circle cx="${f(x)}" cy="${f(y)}" r="10" fill="none" stroke="#fff" stroke-opacity=".6"><animate attributeName="r" values="6;22;6" dur="${f(3 + r() * 2)}s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values=".7;0;.7" dur="${f(3 + r() * 2)}s" repeatCount="indefinite"/></circle></g>`;
    }
    // beach umbrellas on sandbar
    for (let i = 0; i < 6; i++) {
      const x = 440 + r() * 240, y = 400 + r() * 140;
      b += `<circle cx="${f(x)}" cy="${f(y)}" r="16" fill="${pick(r, ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#f78c6b'])}"/><path d="M${f(x - 16)} ${f(y)} L${f(x + 16)} ${f(y)} M${f(x)} ${f(y - 16)} L${f(x)} ${f(y + 16)}" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>`;
    }
    if (o.palms !== false) {
      // palms seen from above at the corner
      for (let i = 0; i < 4; i++) {
        const x = 40 + r() * 220, y = 760 + r() * 220;
        let fr = '';
        for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2; fr += `<path d="M${f(x)} ${f(y)} Q${f(x + Math.cos(a + 0.3) * 50)} ${f(y + Math.sin(a + 0.3) * 50)} ${f(x + Math.cos(a) * 95)} ${f(y + Math.sin(a) * 95)} Q${f(x + Math.cos(a - 0.3) * 50)} ${f(y + Math.sin(a - 0.3) * 50)} ${f(x)} ${f(y)}Z"/>`; }
        b += `<g fill="#1f6b3f" opacity=".95">${fr}<animateTransform attributeName="transform" type="rotate" values="-2 ${f(x)} ${f(y)};2 ${f(x)} ${f(y)};-2 ${f(x)} ${f(y)}" dur="${f(5 + r() * 3)}s" repeatCount="indefinite"/></g>`;
      }
      b += `<path d="M0 700 Q200 760 320 1000 L0 1000Z" fill="#f2deb0" opacity=".9"/>`;
    }
    return wrap(o.title || 'Natural pools of Bahia from above', defs, b);
  }

  function surf(seed, o = {}) {
    // Itacaré: rainforest hills dropping into surf
    const r = rng(seed), P = PALETTES.jungle;
    const hz = 470;
    let defs = gradient('sky', P.sky) + gradient('sea', P.sea) + gradient('sand', [P.sand, P.sand2]);
    let b = `<rect width="${W}" height="${hz + 2}" fill="url(#sky)"/>`;
    b += sun(1300, 160, 40, P);
    b += clouds(r, P, 6, 60, 300, '#fff', 0.7);
    b += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#sea)"/>`;
    b += waves(r, hz, 800, '#ffffff', 10, 1.2);
    // rainforest hills on both sides
    b += `<path d="M0 260 C180 230 320 300 460 380 C560 440 600 520 640 620 L0 640Z" fill="${P.far}"/>`;
    b += `<path d="M0 340 C200 320 360 420 520 560 C580 620 600 700 610 760 L0 780Z" fill="${P.mid}"/>`;
    b += `<path d="M1600 330 C1450 320 1300 380 1200 470 L1600 500Z" fill="${P.far}"/>`;
    for (let i = 0; i < 90; i++) {
      const left = r() < 0.75;
      const x = left ? r() * 560 : 1220 + r() * 380, y = left ? 280 + r() * 480 : 340 + r() * 140;
      if (left && x > 640 - (760 - y) * 0.4) continue;
      b += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(10 + r() * 26)}" fill="${pick(r, [P.near, P.mid, '#3c9a5f', '#1d5e38'])}" opacity=".9"/>`;
    }
    // breaking wave lines with foam
    for (let i = 0; i < 4; i++) {
      const y = 620 + i * 70;
      b += `<path d="${waveLine(y, 10, 220)}" fill="none" stroke="#fff" stroke-width="${8 - i}" stroke-linecap="round" opacity=".85"><animateTransform attributeName="transform" type="translate" values="0 -20;-220 10;0 -20" dur="${8 + i * 2}s" repeatCount="indefinite"/></path>`;
    }
    // surfer
    b += `<g><path d="M960 640 l60 -8 l-4 8 Z" fill="#ff6b3d"/><path d="M985 634 l6 -26 l10 -6 l4 14 l-6 18Z" fill="#1d1d2b"/><circle cx="996" cy="596" r="6" fill="#1d1d2b"/><path d="M990 612 l-16 8 M1000 610 l16 -6" stroke="#1d1d2b" stroke-width="4" stroke-linecap="round"/>` +
      `<animateMotion dur="9s" repeatCount="indefinite" path="M0 0 C 60 20 140 10 220 40 C 140 30 60 10 0 0"/></g>`;
    b += `<path d="M0 860 Q500 820 1000 880 T1600 860 L1600 1000 L0 1000Z" fill="url(#sand)"/>`;
    b += palm(r, 1500, 1000, 560, -160, P) + palm(r, 1380, 1010, 420, -60, P);
    return wrap(o.title || 'Itacaré, Bahia', defs, b);
  }

  function whale(seed, o = {}) {
    const r = rng(seed), P = PALETTES[o.palette || 'golden'];
    const hz = 520;
    let defs = gradient('sky', P.sky) + gradient('sea', ['#7fb7c9', '#2d6f93', '#0d2f52']);
    let b = `<rect width="${W}" height="${hz + 2}" fill="url(#sky)"/>`;
    b += sun(380, 330, 50, P);
    b += clouds(r, P, 5, 60, 320, '#fff', 0.45);
    // archipelago
    b += `<path d="M1040 ${hz} q40 -26 90 -24 q60 2 110 24Z M1260 ${hz} q30 -14 70 -12 q30 2 50 12Z" fill="${P.mid}"/>`;
    b += lighthouse(1130, hz - 24, 9, '#f4efe6', '#b5473f', false);
    b += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#sea)"/>`;
    b += reflection(r, 380, hz, hz + 260, P.sun);
    b += waves(r, hz, H - 40, '#fff', 10);
    // humpback fluke
    const fx = 820, fy = 760;
    b += `<g><path d="M${fx - 40} ${fy + 60} C${fx - 30} ${fy - 20} ${fx - 20} ${fy - 80} ${fx} ${fy - 120} C${fx - 60} ${fy - 150} ${fx - 170} ${fy - 170} ${fx - 260} ${fy - 230} C${fx - 150} ${fy - 210} ${fx - 70} ${fy - 200} ${fx} ${fy - 150} C${fx + 70} ${fy - 200} ${fx + 150} ${fy - 210} ${fx + 260} ${fy - 230} C${fx + 170} ${fy - 170} ${fx + 60} ${fy - 150} ${fx} ${fy - 120} C${fx + 20} ${fy - 80} ${fx + 30} ${fy - 20} ${fx + 40} ${fy + 60}Z" fill="#14202e"/>` +
      `<path d="M${fx - 200} ${fy - 210} C${fx - 120} ${fy - 190} ${fx - 60} ${fy - 180} ${fx - 10} ${fy - 145}" stroke="#e8e6e0" stroke-opacity=".35" stroke-width="10" fill="none"/>` +
      `<animateTransform attributeName="transform" type="translate" values="0 30;0 -10;0 30" dur="7s" repeatCount="indefinite"/></g>`;
    // dripping water
    for (let i = 0; i < 18; i++) {
      const x = fx - 240 + r() * 480, y0 = fy - 220 + Math.abs(x - fx) * -0.05;
      const dur = f(1.2 + r() * 1.4);
      b += `<circle cx="${f(x)}" cy="${f(y0)}" r="${f(2 + r() * 3)}" fill="#e9f6ff" opacity=".8"><animate attributeName="cy" values="${f(y0)};${fy + 40}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="${dur}s" repeatCount="indefinite"/></circle>`;
    }
    for (let i = 0; i < 3; i++) b += `<ellipse cx="${fx}" cy="${fy + 60}" rx="60" ry="12" fill="none" stroke="#fff" stroke-width="3"><animate attributeName="rx" values="40;300" dur="4s" begin="${i * 1.3}s" repeatCount="indefinite"/><animate attributeName="ry" values="8;40" dur="4s" begin="${i * 1.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="4s" begin="${i * 1.3}s" repeatCount="indefinite"/></ellipse>`;
    b += birds(r, 5, 500, 200, '#2a2a3a');
    return wrap(o.title || 'Humpback whale off Bahia', defs, b);
  }

  function azulejo(seed, o = {}) {
    // Portuguese-Brazilian tile pattern, with a slowly breathing centre
    const r = rng(seed);
    const blue = o.blue || '#1f4e9c', bg = o.bg || '#f6f1e6';
    const t = 200;
    const tile = `<pattern id="tile" width="${t}" height="${t}" patternUnits="userSpaceOnUse">` +
      `<rect width="${t}" height="${t}" fill="${bg}"/>` +
      `<g fill="none" stroke="${blue}" stroke-width="6"><circle cx="100" cy="100" r="54"/><circle cx="0" cy="0" r="46"/><circle cx="200" cy="0" r="46"/><circle cx="0" cy="200" r="46"/><circle cx="200" cy="200" r="46"/></g>` +
      `<g fill="${blue}"><path d="M100 54 Q112 100 100 146 Q88 100 100 54Z"/><path d="M54 100 Q100 112 146 100 Q100 88 54 100Z"/><circle cx="100" cy="100" r="12"/>` +
      `<path d="M100 0 L112 20 L100 40 L88 20Z M100 160 L112 180 L100 200 L88 180Z M0 100 L20 112 L40 100 L20 88Z M160 100 L180 112 L200 100 L180 88Z"/></g>` +
      `<g fill="${blue}" opacity=".35"><circle cx="50" cy="50" r="6"/><circle cx="150" cy="50" r="6"/><circle cx="50" cy="150" r="6"/><circle cx="150" cy="150" r="6"/></g>` +
      `<rect width="${t}" height="${t}" fill="none" stroke="${blue}" stroke-opacity=".15" stroke-width="2"/></pattern>`;
    let b = `<rect width="${W}" height="${H}" fill="url(#tile)"/>`;
    b += `<radialGradient id="vig" cx=".5" cy=".5" r=".7"><stop offset=".55" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="#0d1b3a" stop-opacity=".55"/></radialGradient>`;
    // floating medallions
    for (let i = 0; i < 5; i++) {
      const x = 200 + r() * 1200, y = 160 + r() * 680, rad = 60 + r() * 60;
      b += `<g opacity=".9"><circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${pick(r, ['#f2c14e', '#e8765a', '#2a9d8f'])}" opacity=".85"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(rad * 0.6)}" fill="none" stroke="${bg}" stroke-width="5" stroke-dasharray="10 8"><animateTransform attributeName="transform" type="rotate" from="0 ${f(x)} ${f(y)}" to="360 ${f(x)} ${f(y)}" dur="${f(30 + r() * 30)}s" repeatCount="indefinite"/></circle></g>`;
    }
    b += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
    return wrap(o.title || 'Azulejo tile pattern from Salvador', tile, b);
  }

  function ribbons(seed, o = {}) {
    // Fitas do Bonfim — the wish ribbons of Salvador
    const r = rng(seed);
    const cols = ['#e63946', '#f4a261', '#ffd166', '#06d6a0', '#118ab2', '#7b2cbf', '#ef476f', '#ffffff', '#2a9d8f', '#f77f00'];
    let defs = `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e1a3d"/><stop offset="1" stop-color="#2a1446"/></linearGradient>`;
    let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
    for (let i = 0; i < 26; i++) {
      const y = 60 + i * 36 + r() * 20, amp = 30 + r() * 70, period = 500 + r() * 500;
      const c = cols[i % cols.length], dur = f(14 + r() * 14);
      b += `<path d="${waveLine(y, amp, period, W * 2 + 1200)}" fill="none" stroke="${c}" stroke-width="${f(10 + r() * 10)}" stroke-linecap="round" opacity="${f(0.75 + r() * 0.25)}"><animateTransform attributeName="transform" type="translate" from="0 0" to="${f(-period)} 0" dur="${dur}s" repeatCount="indefinite"/></path>`;
    }
    b += `<rect width="${W}" height="${H}" fill="#0e1a3d" opacity=".18"/>`;
    return wrap(o.title || 'Colourful Bonfim wish ribbons of Salvador', defs, b);
  }

  /* Map of Bahia's coast (stylised, not to scale) – used inline on the home page */
  function bahiaMap(points) {
    // Simplified state silhouette in a 600x800 box. Coast on the right.
    const outline = 'M120 60 L250 40 L340 70 L420 60 L470 120 L500 190 L520 260 L540 300 L548 360 L540 420 L552 480 L548 540 L540 600 L548 660 L536 720 L500 760 L440 750 L380 700 L300 690 L220 640 L160 560 L110 480 L80 400 L60 320 L70 240 L90 150Z';
    let pins = '';
    points.forEach((p) => {
      pins += `<a href="${p.url}" class="map-pin" data-name="${p.name}" data-blurb="${p.blurb}" data-img="${p.img}" aria-label="${p.name}">` +
        `<circle class="pulse" cx="${p.x}" cy="${p.y}" r="10"/><circle class="dot" cx="${p.x}" cy="${p.y}" r="7"/>` +
        `<text x="${p.x + (p.labelLeft ? -16 : 16)}" y="${p.y + 5}" text-anchor="${p.labelLeft ? 'end' : 'start'}">${p.name}</text></a>`;
    });
    return `<svg class="bahia-map" viewBox="0 0 700 800" role="img" aria-labelledby="mapTitle"><title id="mapTitle">Illustrated map of Bahia's top destinations</title>` +
      `<defs><linearGradient id="mapsea" x1="0" x2="1"><stop offset="0" stop-color="#0b6d8f" stop-opacity="0"/><stop offset="1" stop-color="#0b6d8f" stop-opacity=".25"/></linearGradient></defs>` +
      `<rect x="480" y="0" width="220" height="800" fill="url(#mapsea)"/>` +
      `<path d="${outline}" class="map-land"/><path d="${outline}" class="map-coast"/>` +
      `<text x="250" y="380" class="map-label">BAHIA</text><text x="610" y="430" class="map-ocean" transform="rotate(90 610 430)">ATLANTIC OCEAN</text>` + pins + `</svg>`;
  }

  const SCENES = { beach, city, mountains, aerial, surf, whale, azulejo, ribbons };
  function render(spec) {
    const fn = SCENES[spec.kind];
    if (!fn) throw new Error('Unknown art kind ' + spec.kind);
    return fn(spec.seed || spec.kind, spec);
  }
  /* favicon */
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a5b"/><stop offset="1" stop-color="#0b6d8f"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><circle cx="40" cy="26" r="9" fill="#ffe3a8"/><path d="M0 44 Q16 38 32 44 T64 44 V64 H0Z" fill="#0a4d7a"/><path d="M18 50 Q20 34 26 22" stroke="#140c22" stroke-width="3" fill="none"/><path d="M26 22 q-10 -2 -16 4 M26 22 q-4 -8 -12 -8 M26 22 q6 -8 14 -6 M26 22 q10 0 14 8" stroke="#140c22" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

  return { render, bahiaMap, favicon };
})();

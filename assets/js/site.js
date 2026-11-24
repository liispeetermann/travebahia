/* TravelBahia interactions — vanilla JS, no dependencies. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* header: solid after scroll, hide on scroll down */
  const header = $('[data-header]');
  let lastY = 0;
  const onScrollHeader = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 40 || document.body.classList.contains('plain'));
    header.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('nav-open'));
    lastY = y;
  };

  /* mobile nav */
  const toggle = $('[data-nav-toggle]');
  toggle && toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('.nav-links a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  /* split headline words */
  $$('[data-split]').forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--d', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.style.setProperty('--d', i++);
          n.replaceWith(w); s.appendChild(n); w.appendChild(s);
        }
      });
    };
    wrap(el);
    setTimeout(() => el.classList.add('is-in'), 40);
  });

  /* scroll reveal + counters */
  const counter = (el) => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '', dur = 1800, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e).toLocaleString('en-US').replace(/,/g, end >= 10000 ? ',' : '') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    reduce ? (el.textContent = end + suffix) : requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(counter);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal, .reveal-clip').forEach((el) => io.observe(el));

  /* parallax */
  const layers = $$('[data-parallax]');
  const parallax = () => {
    if (reduce) return;
    const vh = innerHeight;
    layers.forEach((el) => {
      const root = el.closest('[data-parallax-root]') || el.parentElement;
      const r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const speed = +el.dataset.parallax;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };

  /* reading progress */
  const bar = $('[data-progress]');
  const progress = () => {
    if (!bar) return;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScrollHeader(); parallax(); progress(); ticking = false; });
  }, { passive: true });
  onScrollHeader(); parallax();

  /* hero: content drifts with the pointer */
  const heroContent = $('.hero-content');
  if (heroContent && finePointer && !reduce) {
    $('.hero').addEventListener('pointermove', (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      heroContent.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0)`;
    });
  }

  /* 3D tilt cards */
  if (finePointer && !reduce) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
    /* magnetic buttons */
    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* destination rail: buttons + drag */
  const rail = $('[data-rail]');
  if (rail) {
    const by = () => rail.querySelector('.dest-card').offsetWidth + 22;
    $('[data-rail-prev]').addEventListener('click', () => rail.scrollBy({ left: -by(), behavior: 'smooth' }));
    $('[data-rail-next]').addEventListener('click', () => rail.scrollBy({ left: by(), behavior: 'smooth' }));
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('dragging'); } rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('dragging'); });
    rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /* interactive map */
  const preview = $('[data-map-preview]');
  if (preview) {
    const pins = $$('.map-pin');
    const show = (pin) => {
      pins.forEach((p) => p.classList.toggle('is-active', p === pin));
      const im = $('img', preview);
      im.style.opacity = 0;
      setTimeout(() => { im.src = pin.dataset.img; im.alt = pin.dataset.name; im.style.opacity = 1; }, 150);
      $('h3', preview).textContent = pin.dataset.name;
      $('p', preview).textContent = pin.dataset.blurb;
      const cta = $('[data-map-cta]', preview);
      if (cta) { cta.href = pin.getAttribute('href'); cta.firstChild.textContent = `Read the ${pin.dataset.name} guide `; }
    };
    pins.forEach((p) => { p.addEventListener('mouseenter', () => show(p)); p.addEventListener('focus', () => show(p)); });
    pins[0] && pins[0].classList.add('is-active');
  }

  /* blog filters */
  const grid = $('[data-filter-grid]');
  $$('[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
    $$('[data-filter]').forEach((b) => b.classList.toggle('is-on', b === btn));
    const f = btn.dataset.filter;
    $$('.card', grid).forEach((c) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !show);
      if (show) { c.classList.remove('in'); requestAnimationFrame(() => c.classList.add('in')); }
    });
  }));

  /* table of contents: highlight current section */
  const tocLinks = $$('.toc a');
  if (tocLinks.length) {
    const map = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { tocLinks.forEach((a) => a.classList.remove('is-active')); const a = map.get(e.target.id); a && a.classList.add('is-active'); }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); el && tio.observe(el); });
  }

  /* newsletter (connect a provider in README → "Newsletter") */
  $$('[data-newsletter]').forEach((form) => form.addEventListener('submit', (e) => {
    if (form.action && !form.action.endsWith(location.pathname) && form.getAttribute('action')) return;
    e.preventDefault();
    form.parentElement.querySelector('.nl-msg').textContent = 'Thank you! Our newsletter launches soon — sign-ups open shortly.';
  }));
})();

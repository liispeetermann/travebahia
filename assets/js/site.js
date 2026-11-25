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
    /* mostly-vertical wheel/trackpad gestures scroll the page straight away instead of getting caught by the carousel */
    rail.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); scrollBy({ top: e.deltaY * (e.deltaMode === 1 ? 32 : 1), left: 0 }); }
    }, { passive: false });
  }

  /* lightbox: every content photo opens full-screen, with previous/next arrows, keys and swipe */
  const lbImgs = $$('main figure img, .page-hero-media img, .hero-media img, .story-bg img, .stays-bg img').filter((im) => !im.closest('a'));
  if (lbImgs.length) {
    const big = (im) => {
      const set = (im.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)).filter((p) => p[0]);
      if (!set.length) return im.currentSrc || im.src;
      set.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
      return new URL(set[0][0], location.href).href;
    };
    const caption = (im) => { const fig = im.closest('figure'); const fc = fig && fig.querySelector('figcaption'); return fc ? fc.innerHTML : (im.alt || ''); };
    const lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML = '<div class="lb-stage"><span class="lb-count"></span><img alt=""><button class="lb-btn lb-prev" aria-label="Previous photo">&#8592;</button><button class="lb-btn lb-next" aria-label="Next photo">&#8594;</button><button class="lb-btn lb-close" aria-label="Close">&#10005;</button></div><p class="lb-cap"></p>';
    document.body.appendChild(lb);
    const view = $('.lb-stage img', lb), cap = $('.lb-cap', lb), count = $('.lb-count', lb);
    let cur = 0, lastFocus = null;
    const show = (i) => {
      cur = (i + lbImgs.length) % lbImgs.length;
      const im = lbImgs[cur];
      view.classList.add('is-loading');
      const src = big(im);
      const pre = new Image(); pre.onload = pre.onerror = () => { view.src = src; view.alt = im.alt; view.classList.remove('is-loading'); }; pre.src = src;
      cap.innerHTML = caption(im);
      count.textContent = `${cur + 1} / ${lbImgs.length}`;
      [lbImgs[cur + 1], lbImgs[cur - 1]].forEach((n) => { if (n) { const p = new Image(); p.src = big(n); } });
    };
    const open = (i) => { lastFocus = document.activeElement; show(i); lb.classList.add('is-open'); document.body.classList.add('lb-open'); $('.lb-close', lb).focus(); };
    const close = () => { lb.classList.remove('is-open'); document.body.classList.remove('lb-open'); lastFocus && lastFocus.focus && lastFocus.focus(); };
    lbImgs.forEach((im, i) => {
      const target = im.closest('figure') || im.closest('.page-hero-media, .hero-media, .story-bg, .stays-bg') || im;
      target.setAttribute('data-lb', ''); im.setAttribute('tabindex', '0'); im.setAttribute('role', 'button');
      const go = (e) => { if (e.target.closest('a')) return; e.preventDefault(); open(i); };
      (target.matches('.page-hero-media, .hero-media, .story-bg, .stays-bg') ? im : target).addEventListener('click', go);
      im.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') go(e); });
    });
    $('.lb-prev', lb).addEventListener('click', () => show(cur - 1));
    $('.lb-next', lb).addEventListener('click', () => show(cur + 1));
    $('.lb-close', lb).addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
    });
    let tx = null, ty = null;
    lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1)); else if (dy > 90) close();
    });
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

  /* newsletter → MailerLite (form "TravelBahia newsletter"); posts in the background, no page reload */
  $$('[data-newsletter]').forEach((form) => form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.parentElement.querySelector('.nl-msg');
    const btn = form.querySelector('button');
    const email = form.querySelector('input[type=email]');
    if (!email.value || !email.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; email.focus(); return; }
    btn.disabled = true; msg.textContent = 'Subscribing…';
    try {
      await fetch(form.action, { method: 'POST', mode: 'no-cors', body: new FormData(form) });
      form.reset();
      msg.textContent = 'Thank you! You’re on the list — check your inbox to confirm if asked.';
    } catch (err) {
      msg.textContent = 'Sorry, something went wrong. Please try again in a moment.';
    } finally { btn.disabled = false; }
  }));
})();

/* ═══════════════════════════════════════════════════════════
   CONNEC8 v5 — js/main.js
   No custom cursor · Fixed modal · Proper image fitting
   GSAP reveals · Lenis scroll · Video hover · FAQ · Form
   ═══════════════════════════════════════════════════════════ */

import { Projects, Testimonials, Leads } from './data.js';

/* ── SCREEN PLACEHOLDERS (no real image) ─────────────────── */
const SCREENS = {
  'Website':        `<div class="scr-bar w80"></div><div class="scr-bar w60"></div><div class="scr-bar acc" style="margin-top:4px"></div><div class="scr-bar w80" style="margin-top:6px"></div><div class="scr-bar w60"></div>`,
  'Admin Panel':    `<div class="scr-row"><div class="scr-box" style="flex:0.55"></div><div style="flex:1;display:flex;flex-direction:column;gap:6px"><div class="scr-row"><div class="scr-box"></div><div class="scr-box"></div><div class="scr-box"></div></div><div class="scr-box tall"></div></div></div>`,
  'Billing System': `<div class="scr-bar w40" style="margin-bottom:6px"></div><div class="scr-bar w80"></div><div class="scr-bar w60"></div><div class="scr-bar w40" style="margin-top:6px"></div><div class="scr-bar acc"></div>`,
  'Automation':     `<div class="scr-row" style="align-items:center;gap:4px"><div class="scr-box" style="flex:0.55;height:28px"></div><div style="flex:1;height:1px;background:rgba(91,140,255,0.2)"></div><div class="scr-box" style="flex:0.55;height:28px"></div><div style="flex:1;height:1px;background:rgba(91,140,255,0.2)"></div><div class="scr-box" style="flex:0.55;height:28px"></div></div><div class="scr-bar w60" style="margin-top:10px"></div><div class="scr-bar w40"></div>`,
};

const GRADS = [
  'linear-gradient(145deg,#0a1628,#071020)',
  'linear-gradient(145deg,#0a1a14,#071510)',
  'linear-gradient(145deg,#14100a,#100c06)',
  'linear-gradient(145deg,#0d0a1a,#090714)',
  'linear-gradient(145deg,#0a1a1a,#071515)',
  'linear-gradient(145deg,#1a0a0a,#150707)',
];

/* ── STATE ───────────────────────────────────────────────── */
let works = [];
let lenis = null;

/* ═══════════════════════════════════════════════════════════
   LOADER
   ═══════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  const pct    = document.getElementById('loaderPct');
  if (!loader) return;
  document.body.classList.add('locked');

  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 14 + 3, 100);
    const ip = Math.floor(p);
    if (fill) fill.style.width = ip + '%';
    if (pct)  pct.textContent  = ip + '%';
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('locked');
        setTimeout(heroReveal, 180);
      }, 300);
    }
  }, 65);
}

/* ═══════════════════════════════════════════════════════════
   HERO REVEAL  (runs after loader exits)
   ═══════════════════════════════════════════════════════════ */
function heroReveal() {
  const G = typeof gsap !== 'undefined' ? gsap : null;
  if (!G) { fallbackHeroReveal(); return; }

  G.set('.hero__eyebrow, .hero__sub, .hero__btns, .hero__foot', {
    opacity: 0,
    y: 40,
    rotate: 2
  });

  G.set('.h1-mask', {
    opacity: 0,
    y: 80,
    rotate: 2
  });

  const tl = G.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero__eyebrow', { opacity: 1, y: 0, rotate: 0, duration: 1.2 }, 0)
    .to('.h1-mask',      { opacity: 1, y: 0, rotate: 0, duration: 1.2, stagger: 0.08 }, 0.15)
    .to('.hero__sub',    { opacity: 1, y: 0, rotate: 0, duration: 1.2 }, 0.45)
    .to('.hero__btns',   { opacity: 1, y: 0, rotate: 0, duration: 1.2 }, 0.6)
    .to('.hero__foot',   { opacity: 1, y: 0, rotate: 0, duration: 1.2 }, 0.8);

  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.count || 0);
    G.to({ val: 0 }, {
      val: target,
      duration: 1.4,
      delay: 1.0,
      ease: 'power2.out',
      onUpdate() { el.textContent = Math.floor(this.targets()[0].val); }
    });
  });
}

function fallbackHeroReveal() {
  ['.hero__eyebrow','.hero__sub','.hero__btns','.hero__foot'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
  });
  document.querySelectorAll('.h1-mask').forEach(el => {
    el.style.transform = 'translateY(0)';
    el.style.transition = 'transform 0.8s ease';
  });
}

/* ═══════════════════════════════════════════════════════════
   LENIS SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════ */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.05,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    wheelMultiplier: 1,
    gestureOrientation: 'vertical',
  });

  const raf = t => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
  }
}

/* ═══════════════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
function initAnimations() {
  const G  = typeof gsap !== 'undefined' ? gsap : null;
  const ST = G && typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  if (!G || !ST || reducedMotion || lowPower) {
    initFallbackReveals();
    return;
  }

  G.registerPlugin(ST);

  G.to('.h1-serif', {
    backgroundPosition: '150% center',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  const rOpts = { start: 'top 88%', once: true };

  document.querySelectorAll('.eyebrow').forEach(el => {
    G.fromTo(el, { opacity: 0, y: 12, rotate: 2 }, { opacity: 1, y: 0, rotate: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, ...rOpts } });
  });

  document.querySelectorAll('.sec-title').forEach(el => {
    const raw = el.innerHTML;
    const words = raw.split(/(\s+)/);
    el.innerHTML = words.map(w => w.trim()
      ? `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="_wr" style="display:inline-block;transform:translateY(110%);opacity:0">${w}</span></span>`
      : w
    ).join('');

    G.to(el.querySelectorAll('._wr'), {
      y: '0%',
      opacity: 1,
      duration: 0.85,
      stagger: 0.05,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, ...rOpts }
    });
  });

  G.utils.toArray('.svc-card, .tcard, .wcard').forEach((c, i) => {
    G.fromTo(c, { opacity: 0, y: 60, rotateX: 4 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.85, delay: i * 0.06, ease: 'power4.out',
      scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
  });

  G.utils.toArray('.case__step').forEach((c, i) => {
    G.fromTo(c, { opacity: 0, x: 18, y: 10 }, { opacity: 1, x: 0, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.case__steps', ...rOpts } });
  });

  const stLines = document.querySelectorAll('.sline');
  if (stLines.length) {
    ST.create({ trigger: '.story__lines', start: 'top 80%', once: true,
      onEnter: () => stLines.forEach((l, i) => setTimeout(() => l.classList.add('lit'), i * 120)) });
  }

  G.fromTo('.story__right', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
    scrollTrigger: { trigger: '.story__right', ...rOpts } });

  G.fromTo('.cta-block', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-block', ...rOpts } });

  G.utils.toArray('.ch').forEach((c, i) => {
    G.fromTo(c, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact__chs', ...rOpts } });
  });

  G.fromTo('.faq__list', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.faq__list', ...rOpts } });

  G.to('.hero__grid', { yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  G.to('.hero__orb--a', { yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  G.to('.hero__orb--b', { yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 } });
}

function initFallbackReveals() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.svc-card, .case__step, .cta-block, .ch').forEach(el => {
    el.classList.add('rv');
    obs.observe(el);
  });

  const slObs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) {
      document.querySelectorAll('.sline').forEach((l, i) =>
        setTimeout(() => l.classList.add('lit'), i * 120));
      slObs.disconnect();
    }
  }, { threshold: 0.2 });
  const sl = document.querySelector('.story__lines');
  if (sl) slObs.observe(sl);
}

/* ═══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS (desktop only)
   ═══════════════════════════════════════════════════════════ */
function initMagnetic() {
  if (window.innerWidth < 860) return;

  document.querySelectorAll('.btn-solid, .btn-ghost, .nav__cta').forEach(el => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power2.out' });

    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
      xTo(dx);
      yTo(dy);
    });

    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════════ */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mob    = document.getElementById('mobNav');
  if (!nav) return;

  window.addEventListener('scroll', () =>
    nav.classList.toggle('stuck', window.scrollY > 40), { passive: true });

  burger?.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('locked', open);
  });

  document.querySelectorAll('.mob-link, .mob-cta').forEach(l =>
    l.addEventListener('click', () => {
      mob.classList.remove('open');
      burger?.classList.remove('open');
      document.body.classList.remove('locked');
    }));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 12);
      if (lenis) lenis.scrollTo(top, { duration: 1.4 });
      else window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   BUILD WORK CARD
   ═══════════════════════════════════════════════════════════ */
function buildCard(item, idx) {
  const isApp    = (item.display_type || 'website') === 'app';
  const grad     = GRADS[idx % GRADS.length];
  const screen   = SCREENS[item.category] || SCREENS['Website'];
  const tags     = (item.tags || []).map(t => `<span class="wtag">${esc(t)}</span>`).join('');
  const hasThumb = !!item.thumbnail_url;
  const hasVideo = !!item.preview_video_url;

  const thumbHTML = hasThumb
    ? `<img class="wcard__thumb" src="${esc(item.thumbnail_url)}" alt="${esc(item.title)}" loading="lazy"/>`
    : `<div class="wcard__screen" style="background:${grad}">${screen}</div>`;

  const videoHTML = hasVideo
    ? `<video class="wcard__video" data-src="${esc(item.preview_video_url)}" muted playsinline loop preload="none"></video>`
    : '';

  return `
<article class="wcard" data-cat="${esc(item.category)}" data-type="${esc(item.display_type||'website')}" data-id="${item.id}" tabindex="0" role="button" aria-label="View ${esc(item.title)}">
  <div class="wcard__media">
    ${!isApp ? `<div class="wcard__chrome"><div class="wcard__dots"><span></span><span></span><span></span></div><div class="wcard__url"></div></div>` : ''}
    <div class="wcard__phone-frame"></div>
    <div class="wcard__thumb-wrap">${thumbHTML}</div>
    ${videoHTML}
    <div class="wcard__overlay"><span class="wcard__view-btn">View Project</span></div>
  </div>
  <div class="wcard__body">
    <div class="wcard__meta">
      <span class="wcard__cat">${esc(item.category)}</span>
      <span class="wcard__impact">${esc(item.impact_metric || item.year || '')}</span>
    </div>
    <div class="wcard__title">${esc(item.title)}</div>
    <div class="wcard__tags">${tags}</div>
  </div>
</article>`;
}

/* ═══════════════════════════════════════════════════════════
   VIDEO HOVER
   ═══════════════════════════════════════════════════════════ */
function bindVideoHover(card) {
  const video = card.querySelector('.wcard__video');
  if (!video) return;

  const play = () => {
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
    video.play().catch(() => {});
  };
  const stop = () => { video.pause(); video.currentTime = 0; };

  if (window.innerWidth >= 860) {
    let t;
    card.addEventListener('mouseenter', () => { t = setTimeout(play, 60); });
    card.addEventListener('mouseleave', () => { clearTimeout(t); stop(); });
  } else {
    // Mobile: autoplay when card enters viewport
    const obs = new IntersectionObserver(es => {
      if (es[0].isIntersecting) play(); else stop();
    }, { threshold: 0.5 });
    obs.observe(card);
  }
}

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO
   ═══════════════════════════════════════════════════════════ */
async function initPortfolio() {
  const grid = document.getElementById('workGrid');
  if (!grid) return;

  try { works = await Projects.list(); }
  catch (err) { console.warn('Portfolio:', err); works = []; }

  if (!works.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:48px;color:var(--t4)">No projects yet. Add them in the admin panel.</p>';
    return;
  }

  grid.innerHTML = works.map((w, i) => buildCard(w, i)).join('');
  const cards = grid.querySelectorAll('.wcard');

  // Staggered card reveal
  const G  = typeof gsap !== 'undefined' ? gsap : null;
  const ST = G && typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null;

  if (G && ST) {
    cards.forEach((card, i) => {
      G.fromTo(card,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, delay: i * 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true } }
      );
    });
  } else {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const i = [...cards].indexOf(e.target);
        setTimeout(() => e.target.classList.add('in'), i * 75);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.05 });
    cards.forEach(c => obs.observe(c));
  }

  // Bind interactions
  cards.forEach(card => {
    bindVideoHover(card);
    const open = () => openModal(parseInt(card.dataset.id));
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });

  // Filters
  document.querySelectorAll('.fil').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fil').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        if (G) {
          if (!show) { G.to(c, { opacity: 0, scale: 0.95, duration: 0.22, ease: 'power2.in', onComplete: () => c.classList.add('hidden') }); }
          else { c.classList.remove('hidden'); G.to(c, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }); }
        } else {
          c.classList.toggle('hidden', !show);
        }
      });
    });
  });

  // Real-time sync
  Projects.subscribe(() => initPortfolio());
}

/* ═══════════════════════════════════════════════════════════
   MODAL — Fullscreen lightbox, proper image contain
   ═══════════════════════════════════════════════════════════ */
function openModal(id) {
  const item = works.find(w => w.id === id);
  if (!item) return;

  const modal = document.getElementById('pmodal');
  const body  = document.getElementById('pmodalBody');
  if (!modal || !body) return;

  const isApp  = (item.display_type || 'website') === 'app';
  const grad   = GRADS[(id % GRADS.length)];
  const screen = SCREENS[item.category] || SCREENS['Website'];
  const tags   = (item.tags || []).map(t => `<span class="wtag">${esc(t)}</span>`).join('');
  const tech   = (item.technologies || []).map(t => `<span>${esc(t)}</span>`).join('');
  const mediaClass = isApp ? 'pm-media pm-media--app' : 'pm-media pm-media--web';

  // Media: video > image > placeholder (never iframe)
  let mediaHTML = '';
  if (item.preview_video_url) {
    mediaHTML = `<video src="${esc(item.preview_video_url)}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:${isApp?'contain':'contain'};display:block;background:var(--bg2)"></video>`;
  } else if (item.thumbnail_url) {
    mediaHTML = `<img src="${esc(item.thumbnail_url)}" alt="${esc(item.title)}" style="width:100%;height:100%;object-fit:contain;object-position:top center;display:block;background:var(--bg2)"/>`;
  } else {
    mediaHTML = `<div class="pm-media__placeholder" style="background:${grad}"><div class="wcard__screen" style="width:60%;max-width:320px">${screen}</div></div>`;
  }

  const liveBtn = item.live_url
    ? `<a href="${esc(item.live_url)}" target="_blank" rel="noopener" class="pm-live-btn">Visit Live Site ↗</a>`
    : '';

  body.innerHTML = `
    <div class="${mediaClass}">${mediaHTML}</div>
    <div class="pm-meta">
      <span class="pm-cat">${esc(item.category)}</span>
      <span class="pm-year">${esc(item.year || '')}</span>
      <span class="pm-tags-wrap">${tags}</span>
    </div>
    <h2 class="pm-h1">${esc(item.title)}</h2>
    <p class="pm-desc">${esc(item.description || '')}</p>
    <div class="pm-blocks">
      <div class="pm-block"><div class="pm-block-h">Problem</div><p>${esc(item.problem || '—')}</p></div>
      <div class="pm-block"><div class="pm-block-h">Solution</div><p>${esc(item.solution || '—')}</p></div>
      <div class="pm-block"><div class="pm-block-h">Result</div><div class="pm-metric">${esc(item.impact_metric || '')}</div><p>${esc(item.result || '')}</p></div>
    </div>
    ${tech ? `<div class="pm-tech">${tech}</div>` : ''}
    <div class="pm-actions">${liveBtn}</div>`;

  // Reset scroll
  const scrollEl = modal.querySelector('.pmodal__scroll');
  if (scrollEl) scrollEl.scrollTop = 0;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
  if (lenis) lenis.stop();

  // GSAP open animation
  const G = typeof gsap !== 'undefined' ? gsap : null;
  if (G) {
    G.fromTo('.pmodal__wrap',
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }
}

function closeModal() {
  const modal = document.getElementById('pmodal');
  if (!modal || !modal.classList.contains('open')) return;

  const finish = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    modal.querySelectorAll('video').forEach(v => v.pause());
    if (lenis) lenis.start();
  };

  const G = typeof gsap !== 'undefined' ? gsap : null;
  if (G) {
    G.to('.pmodal__wrap', { y: 20, opacity: 0, scale: 0.97, duration: 0.32, ease: 'power2.in', onComplete: finish });
  } else {
    finish();
  }
}

function initModal() {
  document.getElementById('pmodalClose')?.addEventListener('click', closeModal);
  document.getElementById('pmodalBd')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════════ */
async function initTestimonials() {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;

  let testis = [];
  try { testis = await Testimonials.list(); } catch {}

  if (!testis.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--t4)">No testimonials yet.</p>';
    return;
  }

  grid.innerHTML = testis.map(t => `
    <article class="tcard">
      <p class="tcard__body">"${esc(t.text)}"</p>
      <div class="tcard__foot">
        <div class="tcard__author">
          <div class="tcard__av">${esc(t.avatar || (t.name||'').slice(0,2).toUpperCase())}</div>
          <div>
            <div class="tcard__name">${esc(t.name)}</div>
            <div class="tcard__role">${esc(t.role)}${t.company ? `, ${esc(t.company)}` : ''}</div>
          </div>
        </div>
        ${t.metric ? `<span class="tcard__metric">${esc(t.metric)}</span>` : ''}
      </div>
    </article>`).join('');

  const cards = grid.querySelectorAll('.tcard');
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const i = [...cards].indexOf(e.target);
      setTimeout(() => e.target.classList.add('in'), i * 100);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  cards.forEach(c => obs.observe(c));
}

/* ═══════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;
      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = '0';
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════════ */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-btn');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true; btn.style.opacity = '0.7';

    const data = Object.fromEntries(new FormData(form).entries());
    try { await Leads.create(data); } catch {}

    // ← Replace with Formspree: await fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body:new FormData(form), headers:{'Accept':'application/json'} })

    btn.textContent = 'Message sent ✓'; btn.style.opacity = '1';
    btn.style.background = 'rgba(91,255,140,0.85)'; btn.style.color = '#000';
    setTimeout(() => {
      btn.textContent = orig; btn.disabled = false;
      btn.style.background = ''; btn.style.color = '';
      form.reset();
    }, 3500);
  });
}

/* ── UTIL ────────────────────────────────────────────────── */
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  initLoader();
  initLenis();
  initNav();
  initModal();
  initFAQ();
  initForm();
  await Promise.all([initPortfolio(), initTestimonials()]);
  requestAnimationFrame(() => { initAnimations(); initMagnetic(); });
});

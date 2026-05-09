import { initNav, initMobileMenu, initScrollProgress, setActiveNavLink, initLenis, splitAndReveal } from './shared.js';

initNav();
initMobileMenu();
initScrollProgress();
setActiveNavLink();

splitHeroChars();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile  = window.innerWidth <= 768;
const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!reduced && !mobile) {
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    initLenis(gsap);

    // ── HERO ENTRANCE ──────────────────────────────────────
    gsap.from('.nav-inner', {
      y: -48, opacity: 0, scale: 0.95,
      duration: 0.9, ease: 'power3.out', delay: 0.1
    });

    gsap.to('#hero-panel', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.05
    });

    const chars = document.querySelectorAll('.hero-headline .char');
    if (chars.length) {
      gsap.to(chars, {
        opacity: 1, y: 0,
        duration: 1.1, ease: 'power4.out',
        stagger: { each: 0.026, from: 'start' },
        delay: 0.2
      });
    }

    gsap.from(['.hero-subhead', '.hero-cta', '.hero-proof'], {
      opacity: 0, y: 16,
      duration: 0.7, ease: 'power3.out',
      stagger: 0.1,
      delay: 0.75
    });

    // ── HERO PARALLAX ──────────────────────────────────────
    gsap.to('.hero-bg img', {
      yPercent: 22, ease: 'none',
      scrollTrigger: {
        trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true
      }
    });

    // ── OPENING: word-mask reveals ─────────────────────────
    splitAndReveal('.section-title, .opening-quote');

    // Opening image parallax + entrance
    gsap.from('.opening-img-wrap', {
      opacity: 0, y: 40, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '.opening-img-wrap', start: 'top 85%', once: true }
    });
    gsap.to('.opening-img-wrap img', {
      yPercent: -14, ease: 'none',
      scrollTrigger: {
        trigger: '.opening-img-wrap', start: 'top bottom', end: 'bottom top', scrub: true
      }
    });

    // Scrubbed word opacity on opening paragraphs
    document.querySelectorAll('.opening-text').forEach(p => {
      const words = p.textContent.trim().split(/\s+/);
      p.innerHTML = words.map(w => `<span class="scrub-word">${w}</span>`).join(' ');
      const wordEls = p.querySelectorAll('.scrub-word');
      gsap.set(wordEls, { opacity: 0.1 });
      gsap.to(wordEls, {
        opacity: 1, ease: 'none',
        stagger: { each: 0.04 },
        scrollTrigger: {
          trigger: p, start: 'top 80%', end: 'bottom 52%', scrub: 0.4
        }
      });
    });

    // Opening ghost CTA
    gsap.from('.opening-left .btn-ghost', {
      opacity: 0, y: 14, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.opening-left .btn-ghost', start: 'top 90%', once: true }
    });

    // ── DISH CARDS ─────────────────────────────────────────
    const cards = document.querySelectorAll('.dish-card');
    ScrollTrigger.create({
      trigger: '.menu-grid', start: 'top 82%', once: true,
      onEnter: () => gsap.to(cards, {
        opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.13
      })
    });

    // ── EDITORIAL NUMBERS ──────────────────────────────────
    const statCols = document.querySelectorAll('.stat-col');
    gsap.set(statCols, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.numbers-section', start: 'top 78%', once: true,
      onEnter: () => gsap.to(statCols, {
        opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.1
      })
    });

    // Stat count-up
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.to(obj, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
        })
      });
    });

    // ── NODES SECTION ──────────────────────────────────────
    const nodeGroups = document.querySelectorAll('.node-group');
    const nodeLines  = document.querySelectorAll('.node-line');
    if (nodeGroups.length) {
      gsap.set(nodeGroups, { opacity: 0, y: 22 });
      gsap.set(nodeLines,  { scaleX: 0, transformOrigin: 'left center' });
      ScrollTrigger.create({
        trigger: '.nodes-section', start: 'top 78%', once: true,
        onEnter: () => {
          gsap.to(nodeGroups, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 });
          gsap.to(nodeLines,  { scaleX: 1, duration: 0.9, ease: 'power2.out', stagger: 0.12, delay: 0.05 });
        }
      });
    }

    // ── CTA SECTION ────────────────────────────────────────
    gsap.to('.cta-bg img', {
      yPercent: 18, ease: 'none',
      scrollTrigger: {
        trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true
      }
    });
    gsap.from('.cta-inner', {
      opacity: 0, y: 40, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-inner', start: 'top 85%', once: true }
    });

    // ── MAGNETIC BUTTONS ───────────────────────────────────
    if (hasPointer) initMagneticButtons();
  });

} else {
  // Reduced motion / mobile: make everything instantly visible
  document.querySelectorAll('#hero-panel, .dish-card').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.hero-headline .char').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

// ─── HELPER: split hero headline into per-character spans ─────────────────────
function splitHeroChars() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;
  const lines = headline.innerHTML.split(/<br\s*\/?>/i);
  headline.innerHTML = lines.map((line, li) => {
    const chars = [...line].map(c => {
      if (c === ' ') return ' ';
      return `<span class="char" style="display:inline-block;opacity:0;transform:translateY(64px)">${c}</span>`;
    }).join('');
    return chars + (li < lines.length - 1 ? '<br>' : '');
  }).join('');
}

// ─── HELPER: magnetic buttons (spring physics) ────────────────────────────────
function initMagneticButtons() {
  const STRENGTH = 0.3;
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * STRENGTH;
      const dy = (e.clientY - (r.top  + r.height / 2)) * STRENGTH;
      btn.style.transition = 'transform 0.15s ease';
      btn.style.transform  = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
      btn.style.transform  = '';
    });
  });
}

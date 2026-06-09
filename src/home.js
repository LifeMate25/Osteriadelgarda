import { initNav, initMobileMenu, initScrollProgress, setActiveNavLink, initLenis, splitAndReveal } from './shared.js';

initNav();
initMobileMenu();
initScrollProgress();
setActiveNavLink();

splitHeroChars();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile  = window.innerWidth <= 768;

if (!reduced && !mobile) {
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = initLenis(gsap);

    // ── HERO ENTRANCE ──────────────────────────────────────
    gsap.from('.nav-inner', {
      y: -48, opacity: 0, scale: 0.95,
      duration: 0.9, ease: 'power3.out', delay: 0.1
    });

    // Chars are split but won't stagger — reset to visible so panel opacity controls the reveal
    gsap.set('.hero-headline .char', { opacity: 1, y: 0 });

    // ── CANVAS IMAGE SEQUENCE ──────────────────────────────
    const TOTAL_FRAMES = 192;
    const frames  = new Array(TOTAL_FRAMES);
    const heroEl  = document.getElementById('hero');
    const heroLoad = document.getElementById('hero-load');
    const sticky  = heroEl.querySelector('.hero-sticky');

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;';
    sticky.insertBefore(canvas, sticky.firstChild);
    const ctx = canvas.getContext('2d', { alpha: false });

    let currentFrameIdx = 0;

    const drawFrameAt = idx => {
      const img = frames[idx];
      if (!img?.complete || !img.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth  * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const resizeCanvas = () => {
      canvas.width  = sticky.offsetWidth  || window.innerWidth;
      canvas.height = sticky.offsetHeight || window.innerHeight;
      drawFrameAt(currentFrameIdx);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    let loaded = 0;
    const padded = n => String(n).padStart(4, '0');
    const onFrameSettled = () => { if (++loaded === TOTAL_FRAMES) onAllLoaded(); };
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      frames[i] = img;
      img.onload  = onFrameSettled;
      img.onerror = onFrameSettled;
      img.src = `/frames/frame${padded(i + 1)}.jpg`;
    }

    function onAllLoaded() {
      if (heroLoad) heroLoad.style.display = 'none';
      drawFrameAt(0);
      gsap.fromTo('#hero-title', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });

      const scrollable   = heroEl.offsetHeight - window.innerHeight;
      let lastFrame      = -1;
      let titleFaded     = false;
      let panelRevealed  = false;

      const heroTicker = () => {
        if (scrollable <= 0) return;
        const raw      = lenis?.targetScroll ?? window.scrollY;
        const progress = Math.max(0, Math.min(1, raw / scrollable));
        const idx      = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));

        if (idx !== lastFrame) {
          lastFrame = currentFrameIdx = idx;
          drawFrameAt(idx);
        }

        if (!titleFaded && progress > 0.04) {
          titleFaded = true;
          gsap.to('#hero-title', { opacity: 0, duration: 0.35, ease: 'power2.in' });
        }

        if (!panelRevealed && progress >= 0.85) {
          panelRevealed = true;
          lenis?.stop();
          gsap.to('#hero-panel', {
            opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
            onComplete: () => lenis?.start()
          });
        }

        if (progress >= 1) {
          gsap.ticker.remove(heroTicker);
        }
      };
      gsap.ticker.add(heroTicker);
    }

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
  // Mobile: loading indicator not needed (CSS background-image handles the hero)
  const heroLoad = document.getElementById('hero-load');
  if (heroLoad) heroLoad.style.display = 'none';
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


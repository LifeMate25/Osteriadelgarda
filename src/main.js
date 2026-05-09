/* ─── NAV scroll state ─────────────────────────────────── */
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  // Nav frosted glass on scroll
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Scroll progress bar
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ─── MOBILE MENU ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobile() {
  mobileMenu.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  mobileMenu.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobile);
mobileClose.addEventListener('click', closeMobile);
mobileOverlay.addEventListener('click', closeMobile);
mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

/* ─── BOOKING FORM ────────────────────────────────────── */
const bookingForm = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.hidden = false;
  bookingForm.querySelectorAll('.input').forEach(el => {
    el.disabled = true;
    el.style.opacity = '0.5';
  });
  bookingForm.querySelector('[type="submit"]').style.display = 'none';
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ─── ANIMATIONS (skip on reduced motion & mobile) ───── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;

if (!prefersReducedMotion && !isMobile) {
  // Wait for GSAP + Lenis scripts to load
  window.addEventListener('load', () => {
    initAnimations();
  });
} else {
  // Ensure elements are visible without animation
  document.querySelectorAll('.hero-panel, .menu-card, .stat-number').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: make everything visible
    document.querySelectorAll('.hero-panel, .menu-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis smooth scroll ── */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── Hero panel entrance ── */
  gsap.to('#hero-panel', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.2,
  });

  /* ── Nav entrance ── */
  gsap.from('#nav', {
    y: -100,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2,
  });

  /* ── Section headlines word-split ── */
  const headings = document.querySelectorAll('.section-title, .opening-quote');
  headings.forEach(heading => {
    const text = heading.innerHTML;
    const words = text.split(/(\s+)/);
    heading.innerHTML = words.map(word => {
      if (word.trim() === '') return word;
      return `<span class="word-span" style="opacity:0;transform:translateY(20px);display:inline-block;">${word}</span>`;
    }).join('');

    const spans = heading.querySelectorAll('.word-span');

    ScrollTrigger.create({
      trigger: heading,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(spans, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
        });
      },
      once: true,
    });
  });

  /* ── Menu cards stagger ── */
  const menuCards = document.querySelectorAll('.menu-card');
  ScrollTrigger.create({
    trigger: '.menu-grid',
    start: 'top 80%',
    onEnter: () => {
      gsap.to(menuCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
      });
    },
    once: true,
  });

  /* ── Stat count-up ── */
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      },
      once: true,
    });
  });

  /* ── General fade-in for other elements ── */
  const fadeEls = document.querySelectorAll(
    '.opening-right, .gold-divider, .cantina-left, .wine-glass-svg, .dish-visual, .dish-caption'
  );
  fadeEls.forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

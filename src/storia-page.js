import { initNav, initMobileMenu, initScrollProgress, setActiveNavLink, initLenis, splitAndReveal } from './shared.js';

initNav();
initMobileMenu();
initScrollProgress();
setActiveNavLink();

// Timeline reveal (CSS class-based, no GSAP dependency)
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(item);
  });
}

initTimeline();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile  = window.innerWidth <= 768;

if (!reduced && !mobile) {
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    initLenis(gsap);
    splitAndReveal('.section-title, .pull-quote');

    gsap.utils.toArray('.team-member').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
  });
}

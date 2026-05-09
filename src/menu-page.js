import { initNav, initMobileMenu, initScrollProgress, setActiveNavLink, initLenis, splitAndReveal } from './shared.js';

initNav();
initMobileMenu();
initScrollProgress();
setActiveNavLink();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile  = window.innerWidth <= 768;

if (!reduced && !mobile) {
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    initLenis(gsap);
    splitAndReveal('.category-title, .section-title, .deg-inner .section-title');

    gsap.utils.toArray('.featured-dish, .dish-row').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', delay: i % 4 * 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    gsap.utils.toArray('.deg-item').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, x: -16, duration: 0.55, ease: 'power2.out', delay: i * 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  });
}

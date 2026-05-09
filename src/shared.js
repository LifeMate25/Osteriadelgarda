/* Shared functionality across all pages */

export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });
}

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

export function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href');
    const active =
      href === path ||
      (path.endsWith('/') && href === '/index.html') ||
      path.endsWith(href);
    link.classList.toggle('active', active);
  });
}

export function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay    = document.getElementById('mobile-overlay');
  const closeBtn   = document.getElementById('mobile-close');
  if (!hamburger) return;

  const open  = () => { mobileMenu.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileMenu.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', close));
}

export function initBookingForm() {
  const form    = document.getElementById('booking-form');
  const success = document.getElementById('form-success');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelectorAll('.input').forEach(el => { el.disabled = true; el.style.opacity = '0.45'; });
    form.querySelector('[type="submit"]').style.display = 'none';
    if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  });
}

export function initLenis(gsap) {
  if (typeof Lenis === 'undefined') return null;
  const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}


export function splitAndReveal(selector) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll(selector).forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="word-mask"><span class="word-inner">${w}</span></span>`
    ).join(' ');
    const inners = el.querySelectorAll('.word-inner');
    gsap.set(inners, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el, start: 'top 84%', once: true,
      onEnter: () => gsap.to(inners, {
        yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.045
      })
    });
  });
}

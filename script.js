const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.textContent = isOpen ? 'Close' : 'Menu';
});

nav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    if (navToggle) navToggle.textContent = 'Menu';
  }
});

document.querySelector('#year').textContent = String(new Date().getFullYear());

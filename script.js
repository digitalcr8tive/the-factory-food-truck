const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

nav?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  }
});

const yearElement = document.querySelector('#year');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const cateringForm = document.querySelector('#catering-form');
const cateringStatus = document.querySelector('#catering-status');
const cateringEndpoint = window.FACTORY_CATERING_ENDPOINT || '';

cateringForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!cateringForm.checkValidity()) {
    cateringForm.reportValidity();
    return;
  }

  if (!cateringEndpoint) {
    cateringStatus.textContent = 'This inquiry form is not available yet. Please contact The Factory directly.';
    cateringStatus.className = 'form-status is-pending';
    return;
  }

  const submitButton = cateringForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  cateringStatus.textContent = 'Sending your inquiry…';
  cateringStatus.className = 'form-status is-pending';

  try {
    const response = await fetch(cateringEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(cateringForm)))
    });

    if (!response.ok) throw new Error('Unable to submit inquiry');
    cateringForm.reset();
    cateringStatus.textContent = 'Inquiry sent. The Factory will follow up soon.';
    cateringStatus.className = 'form-status is-success';
  } catch (error) {
    cateringStatus.textContent = 'We could not send your inquiry. Please try again later.';
    cateringStatus.className = 'form-status is-error';
  } finally {
    submitButton.disabled = false;
  }
});

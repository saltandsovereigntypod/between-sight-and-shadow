const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}
const root = document.documentElement;
const contrastButton = document.querySelector('[data-contrast]');
const fontButton = document.querySelector('[data-font]');
let fontScale = Number(localStorage.getItem('bss-font-scale') || 1);
let highContrast = localStorage.getItem('bss-high-contrast') === 'true';
root.style.setProperty('--font-scale', fontScale);
document.body.classList.toggle('high-contrast', highContrast);
if (contrastButton) contrastButton.addEventListener('click', () => {
  highContrast = !highContrast;
  document.body.classList.toggle('high-contrast', highContrast);
  localStorage.setItem('bss-high-contrast', String(highContrast));
  contrastButton.setAttribute('aria-pressed', String(highContrast));
});
if (fontButton) fontButton.addEventListener('click', () => {
  fontScale = fontScale >= 1.25 ? 1 : Number((fontScale + .125).toFixed(3));
  root.style.setProperty('--font-scale', fontScale);
  localStorage.setItem('bss-font-scale', String(fontScale));
});

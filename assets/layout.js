const current = location.pathname.split('/').pop() || 'index.html';
const navItems = [
  ['index.html','Home'], ['pages/about.html','About'], ['pages/vision.html','Vision'],
  ['pages/embodiment.html','Embodiment'], ['pages/witchcraft.html','Witchcraft'],
  ['pages/resources.html','Resources'], ['pages/journal.html','Journal'], ['pages/contact.html','Contact']
];
const depth = location.pathname.includes('/pages/') ? '../' : '';
const header = `
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header"><div class="nav-wrap">
<a class="brand" href="${depth}index.html"><span class="brand-mark" aria-hidden="true">◉</span><span class="brand-text"><strong>Between Sight & Shadow</strong><span>Vision, embodiment, and accessible witchcraft</span></span></a>
<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
<nav class="site-nav" id="site-nav" aria-label="Primary navigation">${navItems.map(([href,label]) => `<a href="${depth}${href}" ${current===href.split('/').pop()?`aria-current="page"`:''}>${label}</a>`).join('')}</nav>
<div class="access-tools" aria-label="Display tools"><button class="icon-button" data-font title="Increase text size" aria-label="Increase text size">A+</button><button class="icon-button" data-contrast title="Toggle high contrast" aria-label="Toggle high contrast" aria-pressed="false">◐</button></div>
</div></header>`;
const footer = `<footer><div class="container"><div class="footer-grid"><div><h3>Between Sight & Shadow</h3><p>Education for people navigating vision, sensory strain, hypermobility, chronic illness, and spiritual practice.</p></div><div><h3>Explore</h3><a href="${depth}pages/vision.html">The Seeing Body</a><a href="${depth}pages/witchcraft.html">Accessible Witchcraft</a><a href="${depth}pages/resources.html">Resources</a></div><div><h3>Information</h3><a href="${depth}pages/disclaimer.html">Medical & spiritual disclaimer</a><a href="${depth}pages/sources.html">Sources & further reading</a><a href="${depth}pages/privacy.html">Privacy</a></div></div><p class="fine-print">© <span id="year"></span> Between Sight & Shadow. This website provides general education and lived-experience perspectives. It does not diagnose, treat, or replace care from licensed health professionals.</p></div></footer>`;
document.body.insertAdjacentHTML('afterbegin', header);
document.body.insertAdjacentHTML('beforeend', footer);
document.getElementById('year').textContent = new Date().getFullYear();

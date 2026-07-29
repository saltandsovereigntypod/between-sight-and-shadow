const path = location.pathname;
const depth = path.includes('/pages/journal/') ? '../../' : path.includes('/pages/') ? '../' : '';
const current = path.split('/').pop() || 'index.html';
const primary = [
  ['index.html','Home'],
  ['pages/about.html','About'],
  ['pages/body-ledger.html','Body Ledger']
];
const explore = [
  ['pages/vision.html','The Seeing Body'],
  ['pages/embodiment.html','Embodiment & Hypermobility'],
  ['pages/witchcraft.html','Accessible Witchcraft'],
  ['pages/resources.html','Resources'],
  ['pages/journal.html','Journal'],
  ['pages/contact.html','Contact']
];
const isCurrent = href => current === href.split('/').pop() || (path.includes('/pages/journal/') && href.endsWith('journal.html'));
const header = `
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header"><div class="nav-wrap">
<a class="brand" href="${depth}index.html"><span class="brand-mark" aria-hidden="true">◉</span><span class="brand-text"><strong>Between Sight & Shadow</strong><span>Vision, embodiment, and accessible witchcraft</span></span></a>
<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
<nav class="site-nav" id="site-nav" aria-label="Primary navigation">
${primary.map(([href,label]) => `<a href="${depth}${href}" ${isCurrent(href)?'aria-current="page"':''}>${label}</a>`).join('')}
<div class="explore-menu"><button class="explore-toggle" type="button" aria-expanded="false" aria-controls="explore-panel">Explore <span aria-hidden="true">⌄</span></button><div class="explore-panel" id="explore-panel">${explore.map(([href,label]) => `<a href="${depth}${href}" ${isCurrent(href)?'aria-current="page"':''}>${label}</a>`).join('')}</div></div>
</nav>
<button class="accessibility-toggle" type="button" aria-expanded="false" aria-controls="accessibility-panel">Accessibility Options</button>
</div></header>
<div class="accessibility-panel" id="accessibility-panel" hidden><div class="accessibility-inner"><div><strong>Text</strong><div class="tool-row"><button type="button" data-font-decrease>A−</button><button type="button" data-font-reset>Reset</button><button type="button" data-font-increase>A+</button></div></div><div><strong>Reading</strong><div class="tool-row"><button type="button" data-line-spacing aria-pressed="false">Line spacing</button><button type="button" data-letter-spacing aria-pressed="false">Letter spacing</button><button type="button" data-readable-font aria-pressed="false">Readable font</button></div></div><div><strong>Display</strong><div class="tool-row"><button type="button" data-contrast aria-pressed="false">High contrast</button><button type="button" data-motion aria-pressed="false">Reduce motion</button><button type="button" data-decoration aria-pressed="false">Hide decoration</button></div></div><div><strong>Focus</strong><div class="tool-row"><button type="button" data-ruler-toggle aria-pressed="false">Reading ruler</button><button type="button" data-focus-toggle aria-pressed="false">Focus mode</button><button type="button" data-access-reset>Reset all</button></div></div></div></div>
<div class="reading-ruler" aria-hidden="true"></div>`;
const footer = `<footer><div class="container"><div class="footer-grid"><div><h2>Between Sight & Shadow</h2><p>Education for people navigating vision, sensory strain, hypermobility, chronic illness, and spiritual practice.</p></div><div><h2>Explore</h2><a href="${depth}pages/vision.html">The Seeing Body</a><a href="${depth}pages/witchcraft.html">Accessible Witchcraft</a><a href="${depth}pages/journal.html">Journal</a></div><div><h2>Information</h2><a href="${depth}pages/disclaimer.html">Medical & spiritual disclaimer</a><a href="${depth}pages/sources.html">Sources & further reading</a><a href="${depth}pages/privacy.html">Privacy</a></div></div><p class="fine-print">© <span id="year"></span> Between Sight & Shadow. This website provides general education and lived-experience perspectives. It does not diagnose, treat, or replace care from licensed health professionals.</p></div></footer>`;
document.body.insertAdjacentHTML('afterbegin', header);
document.body.insertAdjacentHTML('beforeend', footer);
document.getElementById('year').textContent = new Date().getFullYear();

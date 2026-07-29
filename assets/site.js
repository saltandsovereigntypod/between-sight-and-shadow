const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const exploreToggle = document.querySelector('.explore-toggle');
const explorePanel = document.querySelector('.explore-panel');
const accessToggle = document.querySelector('.accessibility-toggle');
const accessPanel = document.querySelector('.accessibility-panel');
const ruler = document.querySelector('.reading-ruler');

if (navToggle && nav) navToggle.addEventListener('click', () => { const open=nav.classList.toggle('open'); navToggle.setAttribute('aria-expanded', String(open)); });
if (exploreToggle && explorePanel) exploreToggle.addEventListener('click', () => { const open=explorePanel.classList.toggle('open'); exploreToggle.setAttribute('aria-expanded', String(open)); });
if (accessToggle && accessPanel) accessToggle.addEventListener('click', () => { const open=accessPanel.hasAttribute('hidden'); accessPanel.toggleAttribute('hidden', !open); accessToggle.setAttribute('aria-expanded', String(open)); });

document.addEventListener('click', e => {
  if (explorePanel && exploreToggle && !e.target.closest('.explore-menu')) { explorePanel.classList.remove('open'); exploreToggle.setAttribute('aria-expanded','false'); }
});

const defaults={fontScale:1,contrast:false,lineSpacing:false,letterSpacing:false,readableFont:false,reducedMotion:false,hideDecoration:false,ruler:false,focus:false};
let prefs={...defaults};
try { prefs={...defaults,...JSON.parse(localStorage.getItem('bss-accessibility')||'{}')}; } catch(e) {}
function save(){ localStorage.setItem('bss-accessibility',JSON.stringify(prefs)); }
function apply(){
  root.style.setProperty('--font-scale',prefs.fontScale);
  body.classList.toggle('high-contrast',prefs.contrast);
  body.classList.toggle('extra-line-spacing',prefs.lineSpacing);
  body.classList.toggle('extra-letter-spacing',prefs.letterSpacing);
  body.classList.toggle('readable-font',prefs.readableFont);
  body.classList.toggle('reduce-motion',prefs.reducedMotion);
  body.classList.toggle('hide-decoration',prefs.hideDecoration);
  body.classList.toggle('ruler-active',prefs.ruler);
  body.classList.toggle('focus-mode',prefs.focus);
  [['[data-contrast]','contrast'],['[data-line-spacing]','lineSpacing'],['[data-letter-spacing]','letterSpacing'],['[data-readable-font]','readableFont'],['[data-motion]','reducedMotion'],['[data-decoration]','hideDecoration'],['[data-ruler-toggle]','ruler'],['[data-focus-toggle]','focus']].forEach(([sel,key])=>document.querySelectorAll(sel).forEach(b=>b.setAttribute('aria-pressed',String(prefs[key]))));
}
function bind(sel,fn){document.querySelectorAll(sel).forEach(b=>b.addEventListener('click',fn));}
bind('[data-font-increase]',()=>{prefs.fontScale=Math.min(1.5,+(prefs.fontScale+.125).toFixed(3));save();apply();});
bind('[data-font-decrease]',()=>{prefs.fontScale=Math.max(.875,+(prefs.fontScale-.125).toFixed(3));save();apply();});
bind('[data-font-reset]',()=>{prefs.fontScale=1;save();apply();});
[['[data-contrast]','contrast'],['[data-line-spacing]','lineSpacing'],['[data-letter-spacing]','letterSpacing'],['[data-readable-font]','readableFont'],['[data-motion]','reducedMotion'],['[data-decoration]','hideDecoration'],['[data-ruler-toggle]','ruler'],['[data-focus-toggle]','focus']].forEach(([sel,key])=>bind(sel,()=>{prefs[key]=!prefs[key];save();apply();}));
bind('[data-access-reset]',()=>{prefs={...defaults};save();apply();});
apply();

document.addEventListener('pointermove',e=>{if(prefs.ruler && ruler) ruler.style.transform=`translateY(${Math.max(0,e.clientY-22)}px)`;});
document.addEventListener('keydown',e=>{if(prefs.ruler && ruler && (e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();const current=parseFloat((ruler.style.transform.match(/-?\d+/)||[60])[0]);const next=Math.max(0,current+(e.key==='ArrowDown'?32:-32));ruler.style.transform=`translateY(${next}px)`;}});

bind('[data-summary-toggle]',e=>{const summary=document.querySelector('.quick-summary');if(!summary)return;const hidden=summary.hasAttribute('hidden');summary.toggleAttribute('hidden',!hidden);e.currentTarget.textContent=hidden?'Hide quick summary':'Show quick summary';});
let utterance=null;
bind('[data-listen]',e=>{const readable=document.querySelector('[data-readable]');if(!readable||!('speechSynthesis' in window)) { alert('Text-to-speech is not supported by this browser.'); return; } if(speechSynthesis.speaking){speechSynthesis.cancel();e.currentTarget.textContent='Listen to article';return;} utterance=new SpeechSynthesisUtterance(readable.innerText);utterance.rate=.95;utterance.onend=()=>e.currentTarget.textContent='Listen to article';speechSynthesis.speak(utterance);e.currentTarget.textContent='Stop listening';});

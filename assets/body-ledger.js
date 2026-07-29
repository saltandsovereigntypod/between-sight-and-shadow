const Ledger = (() => {
  const KEYS = {
    user: 'bss-ledger-user',
    symptoms: 'bss-ledger-symptoms',
    appointments: 'bss-ledger-appointments',
    profile: 'bss-ledger-profile'
  };

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const esc = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const fmtDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '';
  const symptoms = () => read(KEYS.symptoms, []);
  const appointments = () => read(KEYS.appointments, []);
  const profile = () => read(KEYS.profile, {});
  const user = () => read(KEYS.user, null);
  const saveSymptoms = data => write(KEYS.symptoms, data);
  const saveAppointments = data => write(KEYS.appointments, data);
  const saveProfile = data => write(KEYS.profile, data);
  const saveUser = data => write(KEYS.user, data);

  function toast(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role','status');
    el.textContent = message;
    document.body.append(el);
    setTimeout(() => el.remove(), 3200);
  }

  function seedDemo() {
    if (symptoms().length) return;
    const today = new Date();
    const daysAgo = n => {
      const d = new Date(today); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10);
    };
    saveSymptoms([
      {id:uid(),date:daysAgo(2),time:'14:30',name:'Eye strain',severity:6,duration:'90 minutes',activity:'Computer work',environment:'Bright screen in dim room',bodyArea:'Eyes and forehead',worse:'Continuous near work',helped:'Dim light and a 20-minute break',impact:'Had to stop working',notes:'Text looked harder to hold in focus.'},
      {id:uid(),date:daysAgo(5),time:'19:00',name:'Headache',severity:7,duration:'3 hours',activity:'Reading',environment:'Overhead lighting',bodyArea:'Forehead and temples',worse:'Small print',helped:'Larger text, hydration, lying down',impact:'Could not finish reading',notes:'Also felt mildly nauseated.'},
      {id:uid(),date:daysAgo(8),time:'11:15',name:'Dizziness',severity:5,duration:'25 minutes',activity:'Grocery shopping',environment:'Fluorescent lighting and busy aisles',bodyArea:'Whole body',worse:'Turning quickly',helped:'Sitting in the car',impact:'Ended shopping early',notes:'Visual motion felt overwhelming.'},
      {id:uid(),date:daysAgo(13),time:'09:20',name:'Neck pain',severity:6,duration:'Most of day',activity:'Laptop work',environment:'Desk setup',bodyArea:'Neck and shoulders',worse:'Looking down',helped:'Changing position and heat',impact:'Reduced work pace',notes:'Occurred with eye fatigue.'}
    ]);
  }

  function initRanges() {
    document.querySelectorAll('input[type="range"][data-output]').forEach(input => {
      const output = document.getElementById(input.dataset.output);
      const update = () => { if (output) output.textContent = input.value; };
      input.addEventListener('input', update); update();
    });
  }

  function ledgerNav(active) {
    document.querySelectorAll('.ledger-nav a').forEach(a => {
      if (a.dataset.ledgerPage === active) a.setAttribute('aria-current','page');
    });
  }

  function requireDemoUser() {
    if (!user()) saveUser({name:'Demo Visitor',email:'demo@example.com',demo:true});
  }

  return {KEYS, read, write, uid, esc, fmtDate, symptoms, appointments, profile, user, saveSymptoms, saveAppointments, saveProfile, saveUser, toast, seedDemo, initRanges, ledgerNav, requireDemoUser};
})();

document.addEventListener('DOMContentLoaded', () => {
  Ledger.initRanges();
  const page = document.body.dataset.ledgerPage;
  if (page) Ledger.ledgerNav(page);

  const authForm = document.getElementById('auth-form');
  const authName = document.getElementById('auth-name-wrap');
  const authTitle = document.getElementById('auth-title');
  const authSubmit = document.getElementById('auth-submit');
  document.querySelectorAll('[data-auth-mode]').forEach(btn => btn.addEventListener('click', () => {
    const signup = btn.dataset.authMode === 'signup';
    document.querySelectorAll('[data-auth-mode]').forEach(b => b.classList.toggle('active', b===btn));
    authName?.classList.toggle('hidden', !signup);
    if (authTitle) authTitle.textContent = signup ? 'Create your private ledger' : 'Return to your ledger';
    if (authSubmit) authSubmit.textContent = signup ? 'Create demo account' : 'Sign in to demo';
    authForm.dataset.mode = signup ? 'signup' : 'login';
  }));
  authForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('auth-name')?.value.trim() || 'Demo Visitor';
    const email = document.getElementById('auth-email').value.trim();
    Ledger.saveUser({name,email,demo:true});
    Ledger.seedDemo();
    location.href='body-ledger-dashboard.html';
  });

  if (page && page !== 'login') Ledger.requireDemoUser();

  const symptomForm = document.getElementById('symptom-form');
  symptomForm?.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(symptomForm);
    const entry = {
      id: Ledger.uid(), date:f.get('date'), time:f.get('time'), name:f.get('name'), severity:Number(f.get('severity')),
      duration:f.get('duration'), activity:f.get('activity'), environment:f.get('environment'), bodyArea:f.get('bodyArea'),
      worse:f.get('worse'), helped:f.get('helped'), impact:f.get('impact'), notes:f.get('notes'), createdAt:new Date().toISOString()
    };
    const all = Ledger.symptoms(); all.unshift(entry); Ledger.saveSymptoms(all);
    Ledger.toast('Symptom entry saved to this browser.');
    symptomForm.reset(); Ledger.initRanges();
    renderRecent(); renderDashboard();
  });

  document.getElementById('quick-log-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form=e.currentTarget; const f=new FormData(form);
    const now=new Date();
    const entry={id:Ledger.uid(),date:now.toISOString().slice(0,10),time:now.toTimeString().slice(0,5),name:f.get('name'),severity:Number(f.get('severity')),duration:'Not recorded',activity:f.get('activity'),environment:'Not recorded',bodyArea:'Not recorded',worse:'Not recorded',helped:f.get('helped'),impact:'Not recorded',notes:'Quick log',createdAt:now.toISOString()};
    const all=Ledger.symptoms(); all.unshift(entry); Ledger.saveSymptoms(all); form.reset(); Ledger.toast('Quick entry saved.'); renderDashboard();
  });

  function renderRecent() {
    const list=document.getElementById('recent-symptoms'); if(!list) return;
    const items=Ledger.symptoms().slice(0,8);
    list.innerHTML=items.length ? items.map(x=>`<div class="ledger-entry"><div class="entry-top"><div><h3 class="entry-title">${Ledger.esc(x.name)}</h3><div class="entry-meta">${Ledger.fmtDate(x.date)}${x.time?` at ${Ledger.esc(x.time)}`:''} · ${Ledger.esc(x.activity||'Activity not recorded')}</div></div><span class="severity" aria-label="Severity ${x.severity} out of 10">${x.severity}</span></div>${x.helped?`<p><strong>Helped:</strong> ${Ledger.esc(x.helped)}</p>`:''}</div>`).join('') : '<div class="empty-state">No symptom entries yet.</div>';
  }

  function renderDashboard() {
    const root=document.getElementById('dashboard-metrics'); if(!root) return;
    Ledger.seedDemo(); const data=Ledger.symptoms();
    const last30=data.filter(x=>(Date.now()-new Date(x.date+'T12:00:00'))/86400000<=30);
    const avg=last30.length ? (last30.reduce((a,b)=>a+Number(b.severity||0),0)/last30.length).toFixed(1) : '0';
    const common=Object.entries(last30.reduce((m,x)=>(m[x.name]=(m[x.name]||0)+1,m),{})).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'None yet';
    root.innerHTML=`<div class="ledger-card ledger-span-4"><div class="metric-label">Entries in the last 30 days</div><div class="metric">${last30.length}</div></div><div class="ledger-card ledger-span-4"><div class="metric-label">Average recorded severity</div><div class="metric">${avg}<small>/10</small></div></div><div class="ledger-card ledger-span-4"><div class="metric-label">Most frequently logged</div><div class="metric" style="font-size:1.65rem">${Ledger.esc(common)}</div></div>`;
    renderRecent();
  }

  function renderPatterns() {
    const root=document.getElementById('pattern-results'); if(!root) return;
    Ledger.seedDemo(); let data=Ledger.symptoms();
    const days=Number(document.getElementById('pattern-range')?.value || 90);
    data=data.filter(x=>(Date.now()-new Date(x.date+'T12:00:00'))/86400000<=days);
    const group=key=>Object.entries(data.reduce((m,x)=>{const v=x[key]||'Not recorded';m[v]=(m[v]||0)+1;return m;},{})).sort((a,b)=>b[1]-a[1]);
    const symptoms=group('name'), activities=group('activity');
    const avg=data.length?(data.reduce((s,x)=>s+Number(x.severity||0),0)/data.length).toFixed(1):0;
    const bars=(arr)=>arr.slice(0,6).map(([label,count])=>`<div class="pattern-bar"><span>${Ledger.esc(label)}</span><div class="pattern-track"><div class="pattern-fill" style="width:${Math.round(count/Math.max(...arr.map(x=>x[1]))*100)}%"></div></div><strong>${count}</strong></div>`).join('')||'<p>No entries in this date range.</p>';
    root.innerHTML=`<div class="ledger-grid"><section class="ledger-card ledger-span-4"><div class="metric-label">Entries reviewed</div><div class="metric">${data.length}</div></section><section class="ledger-card ledger-span-4"><div class="metric-label">Average severity</div><div class="metric">${avg}<small>/10</small></div></section><section class="ledger-card ledger-span-4"><div class="metric-label">Most frequent activity</div><div class="metric" style="font-size:1.55rem">${Ledger.esc(activities[0]?.[0]||'None yet')}</div></section><section class="ledger-card ledger-span-6"><h2>Symptoms recorded most often</h2>${bars(symptoms)}</section><section class="ledger-card ledger-span-6"><h2>Activities recorded alongside symptoms</h2>${bars(activities)}</section><section class="ledger-card ledger-span-12"><h2>Neutral observations</h2><div class="status-banner">These summaries describe what was entered. They do not establish causes or diagnoses.</div><ul>${symptoms[0]?`<li><strong>${Ledger.esc(symptoms[0][0])}</strong> was the most frequently logged symptom in this period.</li>`:''}${activities[0]?`<li><strong>${Ledger.esc(activities[0][0])}</strong> was the activity most often recorded with an entry.</li>`:''}<li>The average recorded severity was <strong>${avg} out of 10</strong>.</li></ul></section></div>`;
  }
  document.getElementById('pattern-range')?.addEventListener('change', renderPatterns);

  const apptForm=document.getElementById('appointment-form');
  apptForm?.addEventListener('submit',e=>{
    e.preventDefault();const f=new FormData(apptForm);const all=Ledger.appointments();all.unshift({id:Ledger.uid(),provider:f.get('provider'),specialty:f.get('specialty'),date:f.get('date'),time:f.get('time'),reason:f.get('reason'),notes:f.get('notes'),createdAt:new Date().toISOString()});Ledger.saveAppointments(all);apptForm.reset();Ledger.toast('Appointment saved.');renderAppointments();
  });

  function renderAppointments(){
    const list=document.getElementById('appointment-list');if(!list)return;const data=Ledger.appointments();
    list.innerHTML=data.length?data.map(a=>`<div class="ledger-entry"><div class="entry-top"><div><h3 class="entry-title">${Ledger.esc(a.specialty||'Appointment')}</h3><div class="entry-meta">${Ledger.fmtDate(a.date)}${a.time?` at ${Ledger.esc(a.time)}`:''}${a.provider?` · ${Ledger.esc(a.provider)}`:''}</div></div><a class="ledger-button secondary" href="body-ledger-builder.html?appointment=${encodeURIComponent(a.id)}">Prepare</a></div><p>${Ledger.esc(a.reason||'No reason entered')}</p></div>`).join(''):'<div class="empty-state">No appointments saved yet.</div>';
  }

  function populateBuilder(){
    const form=document.getElementById('builder-form');if(!form)return;Ledger.seedDemo();
    const select=document.getElementById('builder-symptoms');
    const names=[...new Set(Ledger.symptoms().map(x=>x.name))].sort();
    select.innerHTML=names.map(n=>`<label class="option"><input type="checkbox" name="symptoms" value="${Ledger.esc(n)}" checked> <span>${Ledger.esc(n)}</span></label>`).join('');
    const params=new URLSearchParams(location.search);const appt=Ledger.appointments().find(a=>a.id===params.get('appointment'));
    if(appt){form.elements.provider.value=appt.provider||'';form.elements.specialty.value=appt.specialty||'';form.elements.date.value=appt.date||'';form.elements.reason.value=appt.reason||'';}
  }

  document.getElementById('builder-form')?.addEventListener('submit',e=>{
    e.preventDefault();const f=new FormData(e.currentTarget);const selected=f.getAll('symptoms');const from=f.get('from'),to=f.get('to');
    const data=Ledger.symptoms().filter(x=>(!selected.length||selected.includes(x.name))&&(!from||x.date>=from)&&(!to||x.date<=to));
    const counts=Object.entries(data.reduce((m,x)=>(m[x.name]=(m[x.name]||0)+1,m),{})).sort((a,b)=>b[1]-a[1]);
    const avg=data.length?(data.reduce((s,x)=>s+Number(x.severity||0),0)/data.length).toFixed(1):'0';
    const activities=Object.entries(data.reduce((m,x)=>{if(x.activity&&x.activity!=='Not recorded')m[x.activity]=(m[x.activity]||0)+1;return m;},{})).sort((a,b)=>b[1]-a[1]).slice(0,4);
    const helped=[...new Set(data.map(x=>x.helped).filter(x=>x&&x!=='Not recorded'))].slice(0,5);
    const impacts=[...new Set(data.map(x=>x.impact).filter(x=>x&&x!=='Not recorded'))].slice(0,5);
    const packet=document.getElementById('packet-preview');
    packet.innerHTML=`<div class="packet"><p><strong>Prepared for:</strong> ${Ledger.esc(f.get('provider')||f.get('specialty')||'Upcoming appointment')}</p><p><strong>Appointment date:</strong> ${Ledger.esc(Ledger.fmtDate(f.get('date'))||'Not entered')}</p><div class="packet-section"><h2>Main concern</h2><p>${Ledger.esc(f.get('reason')||'Review recurring symptoms and their impact on daily function.')}</p></div><div class="packet-section"><h3>Tracking period</h3><p>${Ledger.esc(Ledger.fmtDate(from)||'Earliest available entry')} through ${Ledger.esc(Ledger.fmtDate(to)||'most recent entry')}. ${data.length} entries were included.</p></div><div class="packet-section"><h3>Frequency and severity</h3><p>Average recorded severity: <strong>${avg} out of 10</strong>.</p><ul>${counts.map(([n,c])=>`<li>${Ledger.esc(n)}: ${c} entr${c===1?'y':'ies'}</li>`).join('')||'<li>No matching symptom entries were found.</li>'}</ul></div><div class="packet-section"><h3>Commonly recorded circumstances</h3><ul>${activities.map(([n,c])=>`<li>${Ledger.esc(n)} (${c} entries)</li>`).join('')||'<li>No repeated activities were identified.</li>'}</ul></div><div class="packet-section"><h3>What helped</h3><ul>${helped.map(x=>`<li>${Ledger.esc(x)}</li>`).join('')||'<li>Not recorded.</li>'}</ul></div><div class="packet-section"><h3>Effect on daily life</h3><ul>${impacts.map(x=>`<li>${Ledger.esc(x)}</li>`).join('')||'<li>Not recorded.</li>'}</ul></div><div class="packet-section"><h3>Questions for the provider</h3><ul><li>${Ledger.esc(f.get('question1')||'What possibilities should be considered based on these symptoms?')}</li><li>${Ledger.esc(f.get('question2')||'What evaluation, referral, or follow-up may be appropriate?')}</li><li>${Ledger.esc(f.get('question3')||'What changes would require more urgent care?')}</li></ul></div><div class="packet-section"><h3>Additional notes</h3><p>${Ledger.esc(f.get('notes')||'')}</p></div><p><small>This summary organizes user-entered information. It does not provide a diagnosis or establish the cause of symptoms.</small></p></div>`;
    document.getElementById('packet-actions').classList.remove('hidden');packet.scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('print-packet')?.addEventListener('click',()=>window.print());

  const profileForm=document.getElementById('profile-form');
  if(profileForm){const p=Ledger.profile();Object.entries(p).forEach(([k,v])=>{if(profileForm.elements[k])profileForm.elements[k].value=v;});profileForm.addEventListener('submit',e=>{e.preventDefault();Ledger.saveProfile(Object.fromEntries(new FormData(profileForm)));Ledger.toast('Profile saved to this browser.');});}
  document.getElementById('delete-demo-data')?.addEventListener('click',()=>{if(confirm('Delete all locally stored Body Ledger demo data?')){Object.values(Ledger.KEYS).forEach(k=>localStorage.removeItem(k));location.href='body-ledger.html';}});

  renderDashboard(); renderRecent(); renderPatterns(); renderAppointments(); populateBuilder();
});

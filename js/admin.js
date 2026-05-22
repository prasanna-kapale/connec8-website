/* ═══════════════════════════════════════════════════════════
   CONNEC8 v5 — js/admin.js
   Auth · Projects CRUD · Testimonials · Leads
   Drag-drop uploads · Video support (MP4 + MOV)
   ═══════════════════════════════════════════════════════════ */

import { Projects, Testimonials, Leads, Storage } from './data.js';

const PW = 'connec8@2006'; // ← change before going live

/* ═══════════════════════════════════════════════════════════
   AUTH
   ═══════════════════════════════════════════════════════════ */
function isAuth() { return sessionStorage.getItem('c8a') === '1'; }
function setAuth() { sessionStorage.setItem('c8a', '1'); }
function doLogout() { sessionStorage.removeItem('c8a'); location.reload(); }

async function initAuth() {
  const lw   = document.getElementById('loginWrap');
  const sh   = document.getElementById('shell');
  const pill = document.getElementById('modePill');

const applyMode = () => {
  if (pill) {
    pill.textContent = 'Admin';
    pill.classList.remove('live');
  }
};

  // Already authed?
  if (isAuth()) { lw.hidden = true; sh.hidden = false; applyMode(); boot(); return; }

  // Tab switching
  document.querySelectorAll('.ltab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('pwForm').hidden  = tab !== 'pw';
      document.getElementById('sbForm').hidden  = tab !== 'sb';
    });
  });

  // Password login
document.getElementById('pwForm')?.addEventListener('submit', e => {
  e.preventDefault();

  const pw = document.getElementById('lpass').value;
  const err = document.getElementById('pwErr');

  if (pw === PW) {
    sessionStorage.setItem('c8a', '1');
    lw.hidden = true;
    sh.hidden = false;
    boot();
  } else {
    err.textContent = 'Wrong password';
  }
});
  // Supabase login
}

/* ═══════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════ */
async function boot() {

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    doLogout();
  });

  initSidebar();
  initSbToggle();
  initProjModal();
  initTestiModal();
  initModalsClose();

  await Promise.all([
    renderDash(),
    renderProjects(),
    renderTestis(),
    renderLeads()
  ]);

  Projects.subscribe(() => {
    renderProjects();
    renderDash();
  });
}

/* ── Sidebar nav ─────────────────────────────────────────── */
function initSidebar() {
  document.querySelectorAll('.sb-link').forEach(btn =>
    btn.addEventListener('click', () => gotoPanel(btn.dataset.p)));
  document.querySelectorAll('[data-p]').forEach(el => {
    if (el.classList.contains('sb-link')) return;
    el.addEventListener('click', () => gotoPanel(el.dataset.p));
  });
}

function gotoPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(b => b.classList.remove('active'));
  document.getElementById(`panel-${name}`)?.classList.add('active');
  document.querySelector(`.sb-link[data-p="${name}"]`)?.classList.add('active');
  const labels = { dashboard:'Dashboard', projects:'Projects', testi:'Testimonials', leads:'Leads' };
  setText('topbarTitle', labels[name] || '');
  document.getElementById('sidebar')?.classList.remove('open');
}

function initSbToggle() {
  document.getElementById('sbToggle')?.addEventListener('click', () =>
    document.getElementById('sidebar')?.classList.toggle('open'));
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════ */
async function renderDash() {
  const [projs, testis, leads] = await Promise.all([
    Projects.list().catch(()=>[]),
    Testimonials.list().catch(()=>[]),
    Leads.list().catch(()=>[]),
  ]);
  setText('sProj',  projs.length);
  setText('sFeat',  projs.filter(p=>p.featured).length);
  setText('sTesti', testis.length);
  setText('sLeads', leads.length);

  const dp = document.getElementById('dashProj');
  if (dp) dp.innerHTML = !projs.length
    ? '<p style="padding:16px 18px;color:var(--t4);font-size:13px">No projects yet.</p>'
    : `<table class="tbl"><thead><tr><th>Title</th><th>Category</th><th>Featured</th></tr></thead><tbody>${
        projs.slice(0,4).map(p=>`<tr><td class="tc-title">${esc(p.title)}</td><td><span class="badge">${esc(p.category)}</span></td><td>${p.featured?'<span class="badge badge-feat">Yes</span>':'—'}</td></tr>`).join('')
      }</tbody></table>`;

  const dl = document.getElementById('dashLeads');
  if (dl) {
    const recent = [...leads].reverse().slice(0,4);
    dl.innerHTML = !recent.length
      ? '<p style="padding:16px 18px;color:var(--t4);font-size:13px">No leads yet.</p>'
      : `<table class="tbl"><thead><tr><th>Name</th><th>Service</th><th>Date</th></tr></thead><tbody>${
          recent.map(l=>`<tr><td class="tc-title">${esc(l.name||'—')}</td><td>${l.service?`<span class="badge">${esc(l.service)}</span>`:'—'}</td><td style="color:var(--t4)">${fmtDate(l.created_at||l.date)}</td></tr>`).join('')
        }</tbody></table>`;
  }
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS
   ═══════════════════════════════════════════════════════════ */
async function renderProjects() {
  const projs = await Projects.list().catch(()=>[]);
  const tbody = document.getElementById('projTbody');
  if (!tbody) return;
  if (!projs.length) {
    tbody.innerHTML='<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--t4)">No projects yet.</td></tr>';
    return;
  }
  tbody.innerHTML = projs.map(p=>`
    <tr>
      <td>
        <button class="order-btn" onclick="_mvp(${p.id},-1)">↑</button>
        <button class="order-btn" onclick="_mvp(${p.id},1)">↓</button>
        <span style="color:var(--t4);font-size:12px">${p.sort_order}</span>
      </td>
      <td class="tc-title">${esc(p.title)}</td>
      <td><span class="badge">${esc(p.category)}</span></td>
      <td style="color:var(--t3)">${esc(p.display_type||'website')}</td>
      <td>${esc(p.impact_metric||'—')}</td>
      <td><button class="act-btn" onclick="_feat(${p.id})">${p.featured?'<span class="badge badge-feat">Yes</span>':'No'}</button></td>
      <td>
        <button class="act-btn" onclick="_editp(${p.id})">Edit</button>
        <button class="act-btn del" onclick="_delp(${p.id})">Delete</button>
      </td>
    </tr>`).join('');
}

/* Global handlers for inline onclick */
window._editp = async id => {
  const p = (await Projects.list().catch(()=>[])).find(x=>x.id===id);
  if (!p) return;
  setVal('pId',p.id); setVal('pTitle',p.title); setVal('pCat',p.category);
  setVal('pImpact',p.impact_metric||''); setVal('pYear',p.year||'');
  setVal('pOrder',p.sort_order||''); setVal('pThumb',p.thumbnail_url||'');
  setVal('pVideo',p.preview_video_url||''); setVal('pLive',p.live_url||'');
  setVal('pTags',(p.tags||[]).join(', ')); setVal('pTech',(p.technologies||[]).join(', '));
  setVal('pDesc',p.description||''); setVal('pProblem',p.problem||'');
  setVal('pSolution',p.solution||''); setVal('pResult',p.result||'');
  const fc = document.getElementById('pFeatured'); if(fc) fc.checked=!!p.featured;

  // Set display type toggle
  const dt = p.display_type || 'website';
  setVal('pType', dt);
  document.querySelectorAll('.tt-btn').forEach(b => b.classList.toggle('active', b.dataset.type===dt));

  // Show previews
  const tp = document.getElementById('thumbPreview');
  if (tp && p.thumbnail_url) { tp.src=p.thumbnail_url; tp.hidden=false; }
  else if (tp) { tp.hidden=true; }
  const vp = document.getElementById('videoPreview');
  if (vp && p.preview_video_url) { vp.src=p.preview_video_url; vp.hidden=false; }
  else if (vp) { vp.hidden=true; }

  setText('pmTitle','Edit project');
  openModal('projModal');
};

window._delp = async id => {
  if (!confirm('Delete this project?')) return;
  try { await Projects.delete(id); await renderProjects(); await renderDash(); toast('Project deleted.'); }
  catch(e) { toast(e.message||'Delete failed.',true); }
};

window._feat = async id => {
  const p = (await Projects.list().catch(()=>[])).find(x=>x.id===id);
  if (!p) return;
  try { await Projects.update(id,{featured:!p.featured}); await renderProjects(); await renderDash(); toast('Updated.'); }
  catch(e) { toast(e.message||'Update failed.',true); }
};

window._mvp = async (id, dir) => {
  const projs = await Projects.list().catch(()=>[]);
  const idx   = projs.findIndex(p=>p.id===id);
  const swap  = idx+dir;
  if (swap<0||swap>=projs.length) return;
  try {
    await Promise.all([
      Projects.update(projs[idx].id,{sort_order:projs[swap].sort_order}),
      Projects.update(projs[swap].id,{sort_order:projs[idx].sort_order}),
    ]);
    await renderProjects();
  } catch(e) { toast(e.message||'Reorder failed.',true); }
};

/* ── Project modal ───────────────────────────────────────── */
function initProjModal() {
  document.getElementById('openProjModal')?.addEventListener('click', () => {
    clearProjForm(); setText('pmTitle','Add project'); openModal('projModal');
  });

  // Display type toggle
  document.querySelectorAll('.tt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tt-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      setVal('pType', btn.dataset.type);
    });
  });

  // Upload zones
  initUploadZone('thumbZone','thumbFile','pThumb','thumbnails','thumbProg','thumbBar','thumbPct','thumbPreview',true);
  initUploadZone('videoZone','videoFile','pVideo','project-videos','videoProg','videoBar','videoPct','videoPreview',false);

  document.getElementById('projForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('projSaveBtn');
    btn.textContent='Saving…'; btn.disabled=true;
    try {
      await saveProject();
      closeModal('projModal');
      await renderProjects(); await renderDash();
      toast('Project saved.');
    } catch(err) {
      toast(err.message||'Save failed.',true);
    } finally {
      btn.textContent='Save project'; btn.disabled=false;
    }
  });
}

function initUploadZone(zoneId, inputId, urlFieldId, bucket, progId, barId, pctId, previewId, isImage) {
  const zone  = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;

  // Click zone to pick file
  zone.addEventListener('click', e => {
    if (e.target.closest('input[type="text"]')) return; // don't trigger on URL field
    input.click();
  });

  // Drag and drop
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, urlFieldId, bucket, progId, barId, pctId, previewId, isImage);
  });

  // File input change
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file, urlFieldId, bucket, progId, barId, pctId, previewId, isImage);
  });

  // URL field — show preview on blur
  const urlField = document.getElementById(urlFieldId);
  urlField?.addEventListener('blur', () => {
    const url = urlField.value.trim();
    if (!url) return;
    if (isImage) {
      const prev = document.getElementById(previewId);
      if (prev) { prev.src=url; prev.hidden=false; }
    } else {
      const prev = document.getElementById(previewId);
      if (prev) { prev.src=url; prev.hidden=false; prev.load(); }
    }
  });
}

async function handleFileUpload(file, urlFieldId, bucket, progId, barId, pctId, previewId, isImage) {
  const status = document.getElementById('videoStatus');

  // Show progress
  const prog = document.getElementById(progId);
  const bar  = document.getElementById(barId);
  const pct  = document.getElementById(pctId);
  if (prog) prog.hidden = false;
  if (bar)  bar.style.width = '5%';
  if (pct)  pct.textContent = '5%';

  // For video: show compression notice
  if (!isImage && status) {
    status.textContent = `Processing ${file.name} (${(file.size/1024/1024).toFixed(1)} MB)…`;
  }

  try {
    // Simulate progress during upload (Supabase v2 doesn't expose real progress)
    let fakeP = 10;
    const fakeIv = setInterval(() => {
      fakeP = Math.min(fakeP + Math.random()*12, 90);
      if (bar) bar.style.width = fakeP+'%';
      if (pct) pct.textContent = Math.floor(fakeP)+'%';
    }, 300);

    const url = await Storage.upload(bucket, file, p => {
      clearInterval(fakeIv);
      if (bar) bar.style.width = p+'%';
      if (pct) pct.textContent = p+'%';
    });

    clearInterval(fakeIv);
    if (bar) bar.style.width = '100%';
    if (pct) pct.textContent = '100%';

    setVal(urlFieldId, url);

    // Show preview
    const prev = document.getElementById(previewId);
    if (prev) {
      prev.src = url;
      prev.hidden = false;
      if (!isImage) { prev.load(); prev.play().catch(()=>{}); }
    }

    if (status) status.textContent = `✓ Uploaded: ${file.name}`;
    toast('File uploaded.');
  } catch(err) {
    if (status) status.textContent = `Upload failed: ${err.message}`;
    toast('Upload failed: ' + (err.message||err), true);
  } finally {
    setTimeout(() => { if (prog) prog.hidden=true; if (bar) bar.style.width='0%'; }, 2000);
  }
}

async function saveProject() {
  const id    = getVal('pId');
  const title = getVal('pTitle').trim();
  const cat   = getVal('pCat');
  if (!title||!cat) throw new Error('Title and category are required.');

  const payload = {
    title, category:cat,
    display_type:      getVal('pType')||'website',
    featured:          document.getElementById('pFeatured')?.checked||false,
    impact_metric:     getVal('pImpact').trim(),
    year:              getVal('pYear').trim(),
    sort_order:        parseInt(getVal('pOrder'))||99,
    thumbnail_url:     getVal('pThumb').trim(),
    preview_video_url: getVal('pVideo').trim(),
    live_url:          getVal('pLive').trim(),
    tags:              splitList(getVal('pTags')),
    technologies:      splitList(getVal('pTech')),
    description:       getVal('pDesc').trim(),
    problem:           getVal('pProblem').trim(),
    solution:          getVal('pSolution').trim(),
    result:            getVal('pResult').trim(),
  };

  if (id) await Projects.update(parseInt(id), payload);
  else    await Projects.create(payload);
}

function clearProjForm() {
  ['pId','pTitle','pImpact','pYear','pOrder','pThumb','pVideo','pLive',
   'pTags','pTech','pDesc','pProblem','pSolution','pResult'].forEach(id=>setVal(id,''));
  setVal('pCat',''); setVal('pType','website');
  document.querySelectorAll('.tt-btn').forEach(b=>b.classList.toggle('active',b.dataset.type==='website'));
  const fc=document.getElementById('pFeatured'); if(fc) fc.checked=false;
  ['thumbPreview','videoPreview'].forEach(id=>{ const e=document.getElementById(id); if(e) e.hidden=true; });
  const vs=document.getElementById('videoStatus'); if(vs) vs.textContent='';
}

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════════ */
async function renderTestis() {
  const list  = await Testimonials.list().catch(()=>[]);
  const tbody = document.getElementById('testiBtbody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML='<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--t4)">No testimonials yet.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(t=>`
    <tr>
      <td class="tc-title">${esc(t.name)}</td>
      <td style="color:var(--t3)">${esc(t.role)}${t.company?`, ${esc(t.company)}`:''}</td>
      <td>${t.metric?`<span class="badge">${esc(t.metric)}</span>`:'—'}</td>
      <td><span class="tc-clip">${esc(t.text)}</span></td>
      <td>
        <button class="act-btn" onclick="_editt(${t.id})">Edit</button>
        <button class="act-btn del" onclick="_delt(${t.id})">Delete</button>
      </td>
    </tr>`).join('');
}

window._editt = async id => {
  const t=(await Testimonials.list().catch(()=>[])).find(x=>x.id===id);
  if(!t) return;
  setVal('tId',t.id); setVal('tName',t.name); setVal('tRole',t.role);
  setVal('tCompany',t.company||''); setVal('tAvatar',t.avatar||'');
  setVal('tMetric',t.metric||''); setVal('tText',t.text);
  setText('tmTitle','Edit testimonial'); openModal('testiModal');
};

window._delt = async id => {
  if (!confirm('Delete this testimonial?')) return;
  try { await Testimonials.delete(id); await renderTestis(); await renderDash(); toast('Deleted.'); }
  catch(e) { toast(e.message||'Delete failed.',true); }
};

function initTestiModal() {
  document.getElementById('openTestiModal')?.addEventListener('click', () => {
    ['tId','tName','tRole','tCompany','tAvatar','tMetric','tText'].forEach(id=>setVal(id,''));
    setText('tmTitle','Add testimonial'); openModal('testiModal');
  });
  document.getElementById('testiForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn=document.getElementById('testiSaveBtn');
    btn.textContent='Saving…'; btn.disabled=true;
    try {
      const id=getVal('tId'), name=getVal('tName').trim(), role=getVal('tRole').trim(), text=getVal('tText').trim();
      if (!name||!role||!text) throw new Error('Name, role and text are required.');
      const payload={ name, role, company:getVal('tCompany').trim(), avatar:getVal('tAvatar').trim()||name.slice(0,2).toUpperCase(), metric:getVal('tMetric').trim(), text };
      if (id) await Testimonials.update(parseInt(id),payload);
      else    await Testimonials.create(payload);
      closeModal('testiModal'); await renderTestis(); await renderDash();
      toast('Testimonial saved.');
    } catch(err) { toast(err.message||'Save failed.',true); }
    finally { btn.textContent='Save testimonial'; btn.disabled=false; }
  });
}

/* ═══════════════════════════════════════════════════════════
   LEADS
   ═══════════════════════════════════════════════════════════ */
async function renderLeads() {
  const leads  = await Leads.list().catch(()=>[]);
  const tbody  = document.getElementById('leadsTbody');
  const empty  = document.getElementById('leadsEmpty');
  if (!tbody) return;
  if (!leads.length) { tbody.innerHTML=''; if(empty) empty.hidden=false; return; }
  if (empty) empty.hidden=true;
  tbody.innerHTML = [...leads].reverse().map(l=>`
    <tr>
      <td class="tc-title">${esc(l.name||'—')}</td>
      <td>${esc(l.business||'—')}</td>
      <td>${l.service?`<span class="badge">${esc(l.service)}</span>`:'—'}</td>
      <td><span class="tc-clip">${esc(l.message||'—')}</span></td>
      <td style="color:var(--t4);white-space:nowrap">${fmtDate(l.created_at||l.date)}</td>
    </tr>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════════════════════ */
function initModalsClose() {
  document.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', () => closeModal(el.dataset.close)));
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') ['projModal','testiModal'].forEach(closeModal);
  });
}
function openModal(id) {
  const el=document.getElementById(id); if(!el) return;
  el.hidden=false; document.body.style.overflow='hidden';
  setTimeout(()=>el.querySelector('input:not([type="hidden"]),select,textarea')?.focus(),80);
}
function closeModal(id) {
  const el=document.getElementById(id); if(!el) return;
  el.hidden=true; document.body.style.overflow='';
}

/* ── TOAST ───────────────────────────────────────────────── */
function toast(msg, isErr=false, ms=2800) {
  const el=document.getElementById('toast'); if(!el) return;
  el.textContent=msg; el.className='toast show'+(isErr?' err':'');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),ms);
}

/* ── UTILS ───────────────────────────────────────────────── */
function esc(s) { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function setText(id,v){ const e=document.getElementById(id); if(e) e.textContent=v; }
function getVal(id)  { const e=document.getElementById(id); return e?.value||''; }
function setVal(id,v){ const e=document.getElementById(id); if(e) e.value=v; }
function splitList(s){ return s.split(',').map(t=>t.trim()).filter(Boolean); }
function fmtDate(d)  {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
  catch { return String(d); }
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initAuth);

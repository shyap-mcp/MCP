/* CanvasPrints — order flow & motion
   Apple design language: press = scale(.95), single accent, one product shadow */
(() => {
'use strict';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const rm = n => 'RM' + n.toLocaleString('en-MY', {minimumFractionDigits: n % 1 ? 2 : 0});
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Catalog ---------------- */
const SIZES = {
  classic:   {name:'Classic',   dims:'40 × 50 cm',      price:89},
  statement: {name:'Statement', dims:'50 × 70 cm',      price:139},
  grand:     {name:'Grand',     dims:'60 × 90 cm',      price:199},
  triptych:  {name:'Triptych',  dims:'3 × 40 × 60 cm',  price:329},
};
const FRAMES = {
  mirror: {name:'Mirror wrap',  price:0,  note:'Your photo wraps the edges — seamless.'},
  black:  {name:'Black edge',   price:0,  note:'A crisp, gallery-clean border.'},
  white:  {name:'White edge',   price:0,  note:'Bright, minimal, editorial.'},
  walnut: {name:'Walnut float', price:49, note:'Warm wood; the art appears to float.'},
  noir:   {name:'Noir float',   price:49, note:'A matte-black shadow-gap frame.'},
};
const FINISHES = {
  matte: {name:'Matte', price:0,  note:'Zero glare, true colour.'},
  satin: {name:'Satin', price:19, note:'A gentle sheen, easy to clean.'},
  gloss: {name:'Gloss', price:19, note:'Maximum punch and contrast.'},
};
const PAYMENTS = {
  card:  ['Credit / debit card', 'Visa, Mastercard, Amex'],
  fpx:   ['Online banking · FPX', 'All major MY banks'],
  tng:   ["Touch 'n Go eWallet", 'Scan & pay in seconds'],
  grab:  ['GrabPay', 'Pay with your Grab wallet'],
  atome: ['Atome — pay in 3', '0% interest instalments'],
};
const PAY_ICONS = {card:'💳', fpx:'🏦', tng:'📱', grab:'🛵', atome:'✨'};
const DELIVERY = 9.9, FREE_OVER = 150;
const SHAPE = {classic:['a1','4 / 5',1], statement:['a2','4 / 5',1], grand:['a3','4 / 3',1], triptych:['a4','2 / 3',3]};

const state = {size:'statement', frame:'mirror', finish:'matte', qty:1, step:1, photo:null, payment:'card'};

function totals(){
  const unit = SIZES[state.size].price + FRAMES[state.frame].price + FINISHES[state.finish].price;
  const sub = unit * state.qty;
  const del = sub >= FREE_OVER ? 0 : DELIVERY;
  return {unit, sub, del, total: sub + del};
}

/* ---------------- Nav / mobile menu ---------------- */
const burger = $('#burger'), mobileMenu = $('#mobileMenu');
if (burger) burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('#mobileMenu a, #mobileMenu button').forEach(el => el.addEventListener('click', () => {
  mobileMenu.classList.remove('open'); document.body.style.overflow = '';
}));

/* ---------------- Scroll reveals ---------------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.15});
$$('.reveal').forEach(el => io.observe(el));

/* ---------------- Count-up stats ---------------- */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  cio.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, dur = 1400, t0 = performance.now();
  (function tick(t){
    const p = clamp((t - t0) / dur, 0, 1), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(end * ease).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), {threshold:.6});
$$('[data-count]').forEach(el => cio.observe(el));

/* ---------------- Hero parallax (imagery only) ---------------- */
if (!reduced){
  const layers = $$('[data-parallax]');
  addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    layers.forEach(l => {
      const f = +l.dataset.parallax;
      l.style.transform = `translate(${(-x * f * 60).toFixed(1)}px, ${(-y * f * 40).toFixed(1)}px)`;
    });
  }, {passive:true});
}

/* ---------------- Formats: scroll-driven strip ---------------- */
const stage = $('#formatsStage'), track = $('#formatsTrack');
function fmtScroll(){
  if (!stage || !track) return;
  if (reduced || matchMedia('(max-width:833px)').matches){ track.style.transform = 'none'; return; }
  const r = stage.getBoundingClientRect();
  const total = stage.offsetHeight - innerHeight;
  if (total <= 0) return;
  const p = clamp(-r.top / total, 0, 1);
  const max = track.scrollWidth - track.clientWidth + 48;
  track.style.transform = `translateX(${(-p * max).toFixed(1)}px)`;
}
addEventListener('scroll', fmtScroll, {passive:true});
addEventListener('resize', fmtScroll);
fmtScroll();

/* ---------------- Page floating sticky bar ---------------- */
const bar = $('#stickyBar');
let barVisible = false;
const barIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) barVisible = true; else if (e.target.id === 'pricing') barVisible = false;
  syncBar();
}), {threshold:.2});
['#studio', '#pricing'].forEach(sel => { const el = $(sel); if (el) barIO.observe(el); });
function syncBar(){
  const t = totals();
  $('#barTotal').textContent = rm(t.unit);
  $('#barCfg').textContent = `${SIZES[state.size].name} · ${FRAMES[state.frame].name}`;
  bar.classList.toggle('show', barVisible);
}

/* ---------------- Studio configurator ---------------- */
function buildStudio(){
  const fill = (wrapId, entries, getLabel, key) => {
    const wrap = $(wrapId); wrap.innerHTML = '';
    entries.forEach(([k, v]) => {
      const b = document.createElement('button');
      b.className = 'chip' + (state[key] === k ? ' on' : '');
      b.innerHTML = getLabel(v);
      b.addEventListener('click', () => { state[key] = k; buildStudio(); renderSummary(); });
      wrap.appendChild(b);
    });
  };
  fill('#studioSizes', Object.entries(SIZES),
    v => `<b>${v.name}</b><small>${v.dims} · ${rm(v.price)}</small>`, 'size');
  fill('#studioFrames', Object.entries(FRAMES),
    v => `<b>${v.name}${v.price ? `<em>+${rm(v.price)}</em>` : ''}</b><small>${v.note}</small>`, 'frame');
  fill('#studioFinishes', Object.entries(FINISHES),
    v => `<b>${v.name}${v.price ? `<em>+${rm(v.price)}</em>` : ''}</b><small>${v.note}</small>`, 'finish');

  // Live preview: shape + frame treatment
  const art = $('#studioArt'), spec = SHAPE[state.size];
  art.className = `studio-art f-${state.frame}`;
  art.innerHTML = '';
  for (let i = 0; i < spec[2]; i++){
    const p = document.createElement('div');
    p.className = 'art ' + spec[0];
    p.style.aspectRatio = spec[1];
    art.appendChild(p);
  }
  const t = totals();
  $('#studioPrice').textContent = rm(t.unit);
  syncBar();
}
$('#studioCta').addEventListener('click', () => openOrder());

/* ---------------- Order modal ---------------- */
const modal = $('#orderModal');

function openOrder(size){
  if (size && SIZES[size]) state.size = size;
  state.step = 1;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  bar.classList.remove('show');
  buildOptions();
  renderModal();
}
function closeOrder(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (barVisible) bar.classList.add('show');
}
$$('[data-close]').forEach(el => el.addEventListener('click', closeOrder));
addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeOrder(); });
$$('[data-open-order]').forEach(b => b.addEventListener('click', () => openOrder(b.dataset.size)));

function buildOptions(){
  const sg = $('#sizeGrid'); sg.innerHTML = '';
  Object.entries(SIZES).forEach(([k, v]) => {
    const c = document.createElement('button');
    c.className = 'chip' + (k === state.size ? ' on' : '');
    c.dataset.size = k;
    c.innerHTML = `<b>${v.name}</b><small>${v.dims}</small><small class="chip-p">${rm(v.price)}</small>`;
    c.addEventListener('click', () => { state.size = k; renderModal(); });
    sg.appendChild(c);
  });
  const fl = $('#frameList'); fl.innerHTML = '';
  Object.entries(FRAMES).forEach(([k, v]) => {
    const c = document.createElement('button');
    c.className = 'chip' + (k === state.frame ? ' on' : '');
    c.dataset.frame = k;
    c.innerHTML = `<b>${v.name}${v.price ? `<em>+${rm(v.price)}</em>` : ''}</b><small>${v.note}</small>`;
    c.addEventListener('click', () => { state.frame = k; renderModal(); });
    fl.appendChild(c);
  });
  const fc = $('#finishChips'); fc.innerHTML = '';
  Object.entries(FINISHES).forEach(([k, v]) => {
    const c = document.createElement('button');
    c.className = 'chip' + (k === state.finish ? ' on' : '');
    c.dataset.finish = k;
    c.innerHTML = `<b>${v.name}${v.price ? `<em>+${rm(v.price)}</em>` : ''}</b><small>${v.note}</small>`;
    c.addEventListener('click', () => { state.finish = k; renderModal(); });
    fc.appendChild(c);
  });
  const pl = $('#payList'); pl.innerHTML = '';
  Object.entries(PAYMENTS).forEach(([k, v]) => {
    const c = document.createElement('button');
    c.className = 'pay-card' + (k === state.payment ? ' on' : '');
    c.dataset.pay = k;
    c.innerHTML = `<span class="pico">${PAY_ICONS[k]}</span><span class="pay-name">${v[0]}<span>${v[1]}</span></span>`;
    c.addEventListener('click', () => { state.payment = k; renderModal(); });
    pl.appendChild(c);
  });
}

function renderModal(){
  $$('.step', modal).forEach(s => s.classList.toggle('on', +s.dataset.step === state.step));
  const done = state.step === 6;
  $('#modalBar').style.display = done ? 'none' : 'flex';
  $('.modal-head').style.display = done ? 'none' : 'block';
  $$('.pstep').forEach((p, i) => {
    p.classList.toggle('on', i + 1 === state.step);
    p.classList.toggle('done', i + 1 < state.step);
  });
  $('#backBtn').style.visibility = state.step === 1 ? 'hidden' : 'visible';
  const nb = $('#nextBtn');
  nb.textContent = state.step === 4 ? 'Review order'
                 : state.step === 5 ? 'Pay ' + rm(totals().total)
                 : 'Continue';
  renderSummary();
}

function renderSummary(){
  const t = totals();
  const thumb = $('#sumThumb');
  if (state.photo === 'demo') thumb.style.backgroundImage = 'linear-gradient(140deg,#f7b267,#f4845f 60%,#b75d49)';
  else if (state.photo) thumb.style.backgroundImage = `url(${state.photo})`;
  else thumb.style.backgroundImage = '';
  $('#sumSize').textContent = `${SIZES[state.size].name} · ${SIZES[state.size].dims}`;
  $('#sumFrame').textContent = FRAMES[state.frame].name;
  $('#sumFinish').textContent = FINISHES[state.finish].name;
  $('#sumQty').textContent = state.qty;
  $('#sumSub').textContent = rm(t.sub);
  $('#sumDel').textContent = t.del === 0 ? 'Free' : rm(t.del);
  $('#sumTotal').textContent = rm(t.total);
  $('#barTotalM').textContent = rm(t.total);
  $('#barCfgM').textContent = `${SIZES[state.size].name} · ${FRAMES[state.frame].name} · ${FINISHES[state.finish].name}`;
  $$('#sizeGrid .chip').forEach(c => c.classList.toggle('on', c.dataset.size === state.size));
  $$('#frameList .chip').forEach(c => c.classList.toggle('on', c.dataset.frame === state.frame));
  $$('#finishChips .chip').forEach(c => c.classList.toggle('on', c.dataset.finish === state.finish));
  $$('#payList .pay-card').forEach(c => c.classList.toggle('on', c.dataset.pay === state.payment));
  syncBar();
}

/* Qty */
$('#qtyMinus').addEventListener('click', () => { state.qty = Math.max(1, state.qty - 1); renderModal(); });
$('#qtyPlus').addEventListener('click', () => { state.qty = Math.min(9, state.qty + 1); renderModal(); });

/* ---------------- Upload ---------------- */
const dz = $('#dropzone'), fi = $('#fileInput');
dz.addEventListener('click', () => fi.click());
['dragover', 'dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
dz.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) loadPhoto(f); });
fi.addEventListener('change', () => { if (fi.files[0]) loadPhoto(fi.files[0]); });
function loadPhoto(f){
  if (!/^image\//.test(f.type)) return toast('Please choose an image file.');
  const r = new FileReader();
  r.onload = () => {
    state.photo = r.result;
    $('#dzHint').textContent = f.name + ' — looks great ✓';
    renderSummary();
  };
  r.readAsDataURL(f);
}
$('#useDemo').addEventListener('click', () => {
  state.photo = 'demo';
  $('#dzHint').textContent = 'Demo artwork loaded ✓';
  renderSummary();
});

/* ---------------- Step navigation & validation ---------------- */
$('#nextBtn').addEventListener('click', () => {
  const s = state.step;
  if (s === 1 && !state.photo){ nudge($('#dropzone'), 'Add a photo — or tap “Use demo artwork”.'); return; }
  if (s === 4){
    const req = ['name', 'phone', 'address', 'city', 'postcode', 'stateSel'].map(id => $('#' + id));
    for (const el of req){ if (!el.value.trim()){ nudge(el, 'Please complete this field.'); return; } }
  }
  if (s === 5) return pay();
  state.step = s + 1;
  renderModal();
});
$('#backBtn').addEventListener('click', () => { state.step = Math.max(1, state.step - 1); renderModal(); });

function pay(){
  const nb = $('#nextBtn');
  nb.disabled = true;
  nb.textContent = 'Processing…';
  setTimeout(() => {
    nb.disabled = false;
    const t = totals();
    $('#okNum').textContent = 'CP-' + Math.floor(100000 + Math.random() * 900000);
    $('#okTotal').textContent = rm(t.total);
    const eta = new Date(Date.now() + 4 * 864e5);
    $('#okEta').textContent = eta.toLocaleDateString('en-MY', {weekday:'long', day:'numeric', month:'long'});
    state.step = 6;
    renderModal();
  }, 1500);
}

/* ---------------- Toast & nudge ---------------- */
let toastT;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}
function nudge(el, msg){
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  toast(msg);
}

/* ---------------- Init ---------------- */
buildStudio();
renderSummary();
})();

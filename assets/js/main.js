(function(){
  const btn = document.querySelector('[data-hamburger]');
  const mobile = document.querySelector('[data-mobile]');
  if(btn && mobile){
    btn.addEventListener('click', ()=>{
      mobile.classList.toggle('open');
    });
  }

  // BI polish: header shadow + progress bar
  const header = document.querySelector('.header');
  const progress = document.createElement('div');
  progress.className = 'topProgress';
  document.body.appendChild(progress);

  function onScrollUi(){
    const y = window.scrollY || 0;
    if(header){
      header.classList.toggle('scrolled', y > 6);
    }
    const doc = document.documentElement;
    const max = Math.max(1, (doc.scrollHeight - doc.clientHeight));
    const pct = Math.min(100, Math.max(0, (y / max) * 100));
    progress.style.width = pct.toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScrollUi, { passive:true });
  onScrollUi();

  // Active link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href === path){ a.classList.add('active'); }
  });

  // Page transition (deslizante)
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduce){
    // enter animation
    document.documentElement.classList.remove('no-anim');
    document.body.classList.add('page-enter');
    window.setTimeout(()=>document.body.classList.remove('page-enter'), 420);

    function isNormalClick(e){
      return !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
    }

    function isInternalNav(a){
      if(!a) return false;
      const href = a.getAttribute('href') || '';
      if(!href || href.startsWith('#')) return false;
      if(a.target && a.target !== '_self') return false;
      try{
        const url = new URL(href, location.href);
        if(url.origin !== location.origin) return false;
        // only animate html navigation (keep downloads untouched)
        return url.pathname.endsWith('.html') || url.pathname.endsWith('/');
      }catch(_){
        return false;
      }
    }

    document.addEventListener('click', (e)=>{
      const a = e.target.closest && e.target.closest('a');
      if(!a) return;
      if(!isNormalClick(e)) return;
      if(!isInternalNav(a)) return;

      const href = a.getAttribute('href');
      // close mobile menu if open
      if(mobile && mobile.classList.contains('open')) mobile.classList.remove('open');

      e.preventDefault();
      document.body.classList.add('page-exit');
      window.setTimeout(()=>{ location.href = href; }, 260);
    });

    // When returning from bfcache
    window.addEventListener('pageshow', (e)=>{
      if(e.persisted){
        document.body.classList.remove('page-exit');
        document.body.classList.add('page-enter');
        window.setTimeout(()=>document.body.classList.remove('page-enter'), 420);
      }
    });
  }

  // Hero slideshow (corporativo)
  const layerA = document.querySelector('[data-hero-layer="a"]');
  const layerB = document.querySelector('[data-hero-layer="b"]');
  const hero = document.querySelector('.hero');
  if(hero && layerA && layerB){
    const imgs = [
      'assets/img/hero-1.webp',
      'assets/img/hero-2.webp',
      'assets/img/hero-3.webp',
      'assets/img/hero-4.webp'
    ];
    let i = 0;
    let aOn = true;

    function setLayer(el, url){
      el.style.backgroundImage = `url("${url}")`;
    }

    // init
    setLayer(layerA, imgs[0]);
    layerA.classList.add('is-on');
    setLayer(layerB, imgs[1]);

    setInterval(()=>{
      i = (i + 1) % imgs.length;
      const next = imgs[i];

      if(aOn){
        setLayer(layerB, next);
        layerB.classList.add('is-on');
        layerA.classList.remove('is-on');
      }else{
        setLayer(layerA, next);
        layerA.classList.add('is-on');
        layerB.classList.remove('is-on');
      }
      aOn = !aOn;
    }, 5200);
  }



  // ======= Home: métricas + Facebook =======
  const HOME_METRICS = {"totals": {"tons_total": 23118878.84, "cargas_total": 1138482, "pontos_embarque": 6357, "colaboradores": 989, "clientes": 653, "cidades": 1023}, "monthly": [{"ym": "2025-01", "tons": 1264812.27}, {"ym": "2025-02", "tons": 2228203.66}, {"ym": "2025-03", "tons": 2774764.49}, {"ym": "2025-04", "tons": 2051034.75}, {"ym": "2025-05", "tons": 2054132.34}, {"ym": "2025-06", "tons": 1932512.92}, {"ym": "2025-07", "tons": 2024569.23}, {"ym": "2025-08", "tons": 2007829.02}, {"ym": "2025-09", "tons": 1946785.79}, {"ym": "2025-10", "tons": 1808925.42}, {"ym": "2025-11", "tons": 1692115.6}, {"ym": "2025-12", "tons": 1333193.36}], "byCoord": [{"name": "GOIAS", "tons": 3947867.26}, {"name": "CASCAVEL", "tons": 2412531.8}, {"name": "RIO GRANDE DO SUL", "tons": 2081055.04}, {"name": "MARINGA E TERMINAIS", "tons": 1764181.48}, {"name": "MATO GROSSO MT2", "tons": 1583411.5}, {"name": "SÃO PAULO", "tons": 1567867.23}, {"name": "LONDRINA", "tons": 1486311.16}, {"name": "MATO GROSSO MT1", "tons": 1427048.39}, {"name": "MATO GROSSO MT3 - CONFRESA", "tons": 1335746.78}, {"name": "PONTA GROSSA", "tons": 1196140.88}], "topCities": [{"city": "QUERÊNCIA", "tons": 617738.42}, {"city": "MARINGÁ", "tons": 418787.41}, {"city": "SÃO FÉLIX DO ARAGUAIA", "tons": 414468.6}, {"city": "MARIALVA", "tons": 397621.39}, {"city": "PRIMAVERA DO LESTE", "tons": 383405.93}, {"city": "RIO VERDE", "tons": 375379.48}, {"city": "JATAÍ", "tons": 313869.01}, {"city": "MONTIVIDIU", "tons": 307734.66}, {"city": "SÃO JOSÉ DO XINGU", "tons": 262245.9}, {"city": "CRUZ ALTA", "tons": 214715.21}, {"city": "BOM JESUS DE GOIÁS", "tons": 214112.69}, {"city": "CORRENTINA", "tons": 205391.35}, {"city": "SORRISO", "tons": 202742.3}, {"city": "IMBITUVA", "tons": 199367.45}, {"city": "CASCAVEL", "tons": 192629.85}, {"city": "MINEIROS", "tons": 190804.21}, {"city": "ALTO GARÇAS", "tons": 180233.75}, {"city": "PONTA GROSSA", "tons": 168271.79}, {"city": "ITAPEVA", "tons": 165307.96}, {"city": "SÃO DESIDÉRIO", "tons": 158652.7}], "topClients": [{"name": "LOUIS DREYFUS COMPANY BRASIL S.A. - PONTA GROSSA", "tons": 1719198.24}, {"name": "LOUIS DREYFUS COMPANY BRASIL S.A. - JATAI", "tons": 828997.71}, {"name": "LOUIS DREYFUS COMPANY BRASIL S.A. - SORRISO", "tons": 799780.78}, {"name": "INTEGRADA - LONDRINA", "tons": 707036.34}, {"name": "CARGILL AGRICOLA - PASSO FUNDO", "tons": 631406.17}, {"name": "CARGILL AGRICOLA - BARREIRAS", "tons": 594615.31}, {"name": "COFCO INTERNATIONAL BRASIL S.A.  - RIO VERDE", "tons": 501101.61}, {"name": "AGRIBRASIL - LONDRINA", "tons": 465780.77}, {"name": "CJ INTERNATIONAL LTDA - PARANAGUA", "tons": 453301.77}, {"name": "BTG PACTUAL COMMODITIES SERTRADING S.A. - GO", "tons": 426096.69}]};

  function fmtNum(n, opts={}){
    try{
      return new Intl.NumberFormat('pt-BR', opts).format(n);
    }catch(e){ return String(n); }
  }

  function setMetric(el, value, kind){
    if(!el) return;
    if(kind==='tons') el.textContent = fmtNum(value, {maximumFractionDigits:0}) + ' t';
    else el.textContent = fmtNum(value, {maximumFractionDigits:0});
  }

  async function loadFbPosts(){
    const box = document.getElementById('fbPosts');
    if(!box) return;
    const endpoint = (window.FB_WORKER_ENDPOINT || 'https://worker-site.tecnologia-f0c.workers.dev') + '/fb/posts';
    try{
      const r = await fetch(endpoint, { method:'GET' });
      const j = await r.json();
      if(!r.ok || !j.ok) throw new Error(j.error || 'Falha ao carregar');
      const posts = Array.isArray(j.posts) ? j.posts : [];
      box.innerHTML = '';
      posts.slice(0,5).forEach(p=>{
        const a = document.createElement('a');
        a.className='fbCard';
        a.href = p.link || 'https://www.facebook.com/grao1000';
        a.target='_blank'; a.rel='noopener';
        a.innerHTML = `
          <div class="fbImg" style="background-image:url('${p.img||''}')"></div>
          <div class="fbBody">
            <div class="fbMeta">${p.created_time ? new Date(p.created_time).toLocaleDateString('pt-BR') : ''}</div>
            <div class="fbText">${(p.text||'').trim() ? escapeHtml_(p.text).slice(0,220) : 'Publicação'}</div>
            <div class="fbCta">Abrir no Facebook →</div>
          </div>`;
        box.appendChild(a);
      });
      if(!posts.length){
        box.innerHTML = '<div class="empty">Sem publicações com imagem no momento.</div>';
      }
    }catch(err){
      box.innerHTML = `<div class="empty">Não foi possível carregar as postagens agora. <span class="muted">${escapeHtml_(String(err.message||err))}</span></div>`;
    }
  }

  function escapeHtml_(s){
    return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function loadMetrics(){
    const root = document.getElementById('metricas');
    if(!root) return;
    const t = HOME_METRICS?.totals || {};
    // anima números ao entrar no viewport
    const els = Array.from(root.querySelectorAll('[data-metric]'));
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const k = el.getAttribute('data-metric');
        const v = t[k];
        if(typeof v === 'number') animateMetric_(el, v, k==='tons_total');
      });
    }, { threshold: 0.45 }) : null;

    els.forEach(el=>{
      const k = el.getAttribute('data-metric');
      const v = t[k];
      if(typeof v === 'number'){
        // fallback instant
        setMetric(el, v, k==='tons_total' ? 'tons' : 'int');
        if(io) io.observe(el);
      }
    });

    // sparklines nos cards de KPI
    buildSparklines_(root);

    if(window.Chart){
      buildCharts_();
    }
    if(window.L){
      buildMap_();
    }
  }

  function animateMetric_(el, target, isTons){
    if(el.__animDone) return;
    el.__animDone = true;
    const start = 0;
    const dur = 900;
    const t0 = performance.now();
    function step(now){
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = start + (target - start) * eased;
      if(isTons) el.textContent = fmtNum(val, {maximumFractionDigits:0}) + ' t';
      else el.textContent = fmtNum(val, {maximumFractionDigits:0});
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function buildSparklines_(root){
    const cards = root.querySelectorAll('.statCard');
    if(!cards.length) return;
    const series = (HOME_METRICS.monthly || []).map(x=>Number(x.tons)||0).filter(n=>Number.isFinite(n));
    if(!series.length) return;

    const css = getComputedStyle(document.documentElement);
    const color = (css.getPropertyValue('--brand') || '#2F6F3E').trim();
    const fill = 'rgba(47,111,62,.14)';

    cards.forEach((card, idx)=>{
      if(card.querySelector('canvas.spark')) return;
      const c = document.createElement('canvas');
      c.className = 'spark';
      c.width = 360;
      c.height = 70;
      card.appendChild(c);
      drawSpark_(c, series, idx, color, fill);
    });
  }

  function drawSpark_(canvas, data, seed, stroke, fill){
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    const pad = 8;
    const xs = w - pad*2;
    const ys = h - pad*2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = Math.max(1, max - min);

    // leve variação por card (BI "vivo")
    const phase = (seed % 7) * 0.07;
    const pts = data.map((v,i)=>{
      const x = pad + (i/(data.length-1))*xs;
      const y0 = pad + (1-((v-min)/span))*ys;
      const y = y0 + Math.sin((i*0.9)+phase) * 1.2;
      return {x,y};
    });

    // fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, h-pad);
    pts.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.lineTo(pts[pts.length-1].x, h-pad);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p,i)=>{ if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // last dot
    const last = pts[pts.length-1];
    ctx.beginPath();
    ctx.arc(last.x,last.y,3.5,0,Math.PI*2);
    ctx.fillStyle = stroke;
    ctx.fill();
  }

  function buildCharts_(){
    // Monthly
    const m = HOME_METRICS.monthly || [];
    const mLabels = m.map(x=>x.ym);
    const mVals = m.map(x=>x.tons);

    const c1 = document.getElementById('chartMonthly');
    if(c1 && !c1.__inited){
      c1.__inited = true;
      new Chart(c1, {
        type: 'line',
        data: {
          labels: mLabels,
          datasets: [{ label:'Toneladas', data:mVals, tension:0.25, pointRadius:0, borderWidth:2, fill:true }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display:false },
            tooltip: { callbacks: { label: (ctx)=> fmtNum(ctx.parsed.y, {maximumFractionDigits:0}) + ' t' } }
          },
          scales: {
            x: { ticks: { maxRotation:0, autoSkip:true } },
            y: { ticks: { callback:(v)=> fmtNum(v, {notation:'compact'}) } }
          }
        }
      });
    }

    // Coord
    const bc = HOME_METRICS.byCoord || [];
    const cLabels = bc.map(x=>x.name);
    const cVals = bc.map(x=>x.tons);
    const c2 = document.getElementById('chartCoord');
    if(c2 && !c2.__inited){
      c2.__inited = true;
      new Chart(c2, {
        type:'bar',
        data: {
          labels: cLabels,
          datasets: [{ label:'Toneladas', data:cVals, borderWidth:0, borderRadius:10 }]
        },
        options:{
          responsive:true,
          plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(ctx)=> fmtNum(ctx.parsed.y, {maximumFractionDigits:0})+' t' } } },
          scales: {
            x: { ticks: { autoSkip:false, maxRotation:0 }, grid:{display:false} },
            y: { ticks: { callback:(v)=> fmtNum(v, {notation:'compact'}) } }
          }
        }
      });
    }

    // Clients
    const cl = HOME_METRICS.topClients || [];
    const clLabels = cl.map(x=>x.name);
    const clVals = cl.map(x=>x.tons);
    const c3 = document.getElementById('chartClients');
    if(c3 && !c3.__inited){
      c3.__inited = true;
      new Chart(c3, {
        type:'bar',
        data: {
          labels: clLabels,
          datasets: [{ label:'Toneladas', data:clVals, borderWidth:0, borderRadius:10 }]
        },
        options:{
          indexAxis:'y',
          responsive:true,
          plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(ctx)=> fmtNum(ctx.parsed.x, {maximumFractionDigits:0})+' t' } } },
          scales:{
            x: { ticks: { callback:(v)=> fmtNum(v, {notation:'compact'}) } },
            y: { ticks: { autoSkip:false } }
          }
        }
      });
    }
  }

  async function geocodeCity_(q){
    // localStorage cache (30d)
    const key = 'geo:'+q.toLowerCase();
    try{
      const cached = localStorage.getItem(key);
      if(cached){
        const obj = JSON.parse(cached);
        if(obj && obj.t && (Date.now()-obj.t) < 1000*60*60*24*30) return obj.v;
      }
    }catch(_e){}
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
    const r = await fetch(url, { headers: { 'Accept':'application/json' } });
    const j = await r.json();
    const first = Array.isArray(j) && j[0] ? j[0] : null;
    if(!first) return null;
    const v = { lat: Number(first.lat), lon: Number(first.lon) };
    try{ localStorage.setItem(key, JSON.stringify({t:Date.now(), v})); }catch(_e){}
    return v;
  }

  function sleep_(ms){ return new Promise(r=>setTimeout(r, ms)); }

  async function buildMap_(){
    const el = document.getElementById('mapCities');
    if(!el || el.__inited) return;
    el.__inited = true;

    const map = L.map(el, { zoomControl:true, scrollWheelZoom:false });
    map.setView([-14.2, -51.9], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const cities = (HOME_METRICS.topCities || []).slice(0, 12); // evita rate limit
    const maxT = Math.max(...cities.map(c=>c.tons||0), 1);

    for(let i=0;i<cities.length;i++){ 
      const c = cities[i];
      const q = `${c.city}, Brasil`;
      try{
        const geo = await geocodeCity_(q);
        if(geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lon)){
          const radius = 6 + 18 * Math.sqrt((c.tons||0)/maxT);
          const marker = L.circleMarker([geo.lat, geo.lon], {
            radius,
            weight: 1,
            opacity: 0.9,
            fillOpacity: 0.35
          });
          marker.bindPopup(`<b>${escapeHtml_(c.city)}</b><br/>${fmtNum(c.tons, {maximumFractionDigits:0})} t`);
          marker.addTo(map);
        }
      }catch(_e){}
      await sleep_(650);
    }
  }

  // init for home
  if(document.getElementById('metricas')){
    loadMetrics();
    loadFbPosts();
  }

})();
/****************************************************
 * FB posts carousel (últimas 5 postagens)
 ****************************************************/
const FB_POSTS_ENDPOINT = (window.__GRAO1000_CONFIG && window.__GRAO1000_CONFIG.fbPostsEndpoint) 
  || "https://worker-site.tecnologia-f0c.workers.dev/fb/posts";

function fb_trunc_(s, max){
  const t = String(s||"").replace(/\s+/g," ").trim();
  if(!t) return "";
  return t.length>max ? (t.slice(0,max-1)+"…") : t;
}

function fb_normPost_(p){
  return {
    id: String(p.id||""),
    created_time: p.created_time,
    link: p.link || "",
    text: p.text || "",
    img: p.img || ""
  };
}

async function fb_fetchPosts_(){
  const cacheKey = "g1000_fbposts_cache_v1";
  const ttlMs = 5*60*1000; // 5 min
  try{
    const cached = JSON.parse(localStorage.getItem(cacheKey)||"null");
    if(cached && cached.fetchedAt && (Date.now()-cached.fetchedAt)<ttlMs && Array.isArray(cached.posts) && cached.posts.length){
      return cached.posts;
    }
  }catch(_){}

  const r = await fetch(FB_POSTS_ENDPOINT, { cache: "no-store" });
  const j = await r.json();
  const posts = (j && j.posts ? j.posts : []).map(fb_normPost_).filter(p=>p.id).slice(0,5);
  try{
    localStorage.setItem(cacheKey, JSON.stringify({ fetchedAt: Date.now(), posts }));
  }catch(_){}
  return posts;
}

function fb_mountCarousel_(posts){
  const wrap = document.getElementById("fbCarousel");
  const dots = document.getElementById("fbDots");
  const hero = document.getElementById("heroImage");
  if(!wrap || !hero) return;

  // fallback quando não tem posts
  if(!Array.isArray(posts) || !posts.length){
    hero.style.setProperty("--hero-bg", 'url("assets/img/bg/hero1.webp")');
    wrap.innerHTML = "";
    if(dots) dots.innerHTML = "";
    return;
  }

  // se o 1º post não tem imagem, usa hero2 como bg
  const firstImg = posts[0].img || "assets/img/bg/hero2.webp";
  hero.style.setProperty("--hero-bg", `url("${firstImg}")`);

  wrap.innerHTML = "";
  if(dots) dots.innerHTML = "";

  const slides = posts.map((p, idx) => {
    const slide = document.createElement("div");
    slide.className = "fbSlide" + (idx===0 ? " is-active" : "");
    slide.dataset.idx = String(idx);

    const a = document.createElement("a");
    a.className = "fbSlideLink";
    a.href = p.link || "#";
    a.target = "_blank";
    a.rel = "noopener";

    const bg = document.createElement("div");
    bg.className = "fbSlideBg";
    bg.style.backgroundImage = `url("${p.img || "assets/img/bg/hero3.webp"}")`;

    const cap = document.createElement("div");
    cap.className = "fbSlideCaption";

    const tag = document.createElement("div");
    tag.className = "fbSlideTag";
    tag.textContent = "Últimas novidades";

    const txt = document.createElement("div");
    txt.className = "fbSlideText";
    txt.textContent = fb_trunc_(p.text || "", 140) || "Ver postagem no Facebook";

    cap.appendChild(tag);
    cap.appendChild(txt);

    a.appendChild(bg);
    a.appendChild(cap);
    slide.appendChild(a);
    wrap.appendChild(slide);

    if(dots){
      const d = document.createElement("button");
      d.type = "button";
      d.className = "fbDot" + (idx===0 ? " is-active" : "");
      d.setAttribute("aria-label", `Ir para postagem ${idx+1}`);
      d.addEventListener("click", () => fb_setActive_(idx));
      dots.appendChild(d);
    }

    return slide;
  });

  let active = 0;
  let timer = null;

  function fb_setActive_(idx){
    active = (idx + slides.length) % slides.length;
    slides.forEach((s,i)=> s.classList.toggle("is-active", i===active));
    if(dots){
      [...dots.children].forEach((d,i)=> d.classList.toggle("is-active", i===active));
    }
    const bg = posts[active].img || "assets/img/bg/hero2.webp";
    hero.style.setProperty("--hero-bg", `url("${bg}")`);
  }

  function tick(){
    fb_setActive_(active+1);
  }

  timer = setInterval(tick, 6500);

  // pausar quando aba não está visível
  document.addEventListener("visibilitychange", () => {
    if(document.hidden){
      if(timer) clearInterval(timer);
      timer = null;
    } else {
      if(!timer) timer = setInterval(tick, 6500);
    }
  });

  // expõe pra debug
  window.__fbCarousel = { posts, setActive: fb_setActive_ };
}

async function fb_init_(){
  const wrap = document.getElementById("fbCarousel");
  if(!wrap) return; // só na home
  try{
    const posts = await fb_fetchPosts_();
    fb_mountCarousel_(posts);

    // refresh leve pra pegar postagens novas
    setInterval(async () => {
      try{
        const newPosts = await fb_fetchPosts_();
        const oldIds = (window.__fbCarousel?.posts||[]).map(p=>p.id).join("|");
        const newIds = newPosts.map(p=>p.id).join("|");
        if(newIds && newIds !== oldIds){
          fb_mountCarousel_(newPosts);
        }
      }catch(_){}
    }, 5*60*1000);
  }catch(err){
    console.warn("FB posts fetch failed:", err);
  }
}



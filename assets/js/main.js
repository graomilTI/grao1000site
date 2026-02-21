(function(){
  const btn = document.querySelector('[data-hamburger]');
  const mobile = document.querySelector('[data-mobile]');
  if(btn && mobile){
    btn.addEventListener('click', ()=>{
      mobile.classList.toggle('open');
    });
  }

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
  const HOME_METRICS = {
  "year": 2025,
  "tons_total": 23118878.838999998,
  "cargas_total": 569241,
  "pontos_total": 7004,
  "colab_total": 988,
  "monthly": [
    {
      "ym": "jan/25",
      "tons": 1264812.268
    },
    {
      "ym": "fev/25",
      "tons": 2228203.66
    },
    {
      "ym": "mar/25",
      "tons": 2774764.492
    },
    {
      "ym": "abr/25",
      "tons": 2051034.748
    },
    {
      "ym": "mai/25",
      "tons": 2054132.342
    },
    {
      "ym": "jun/25",
      "tons": 1932512.916
    },
    {
      "ym": "jul/25",
      "tons": 2024569.228
    },
    {
      "ym": "ago/25",
      "tons": 2007829.019
    },
    {
      "ym": "set/25",
      "tons": 1946785.786
    },
    {
      "ym": "out/25",
      "tons": 1808925.419
    },
    {
      "ym": "nov/25",
      "tons": 1692115.604
    },
    {
      "ym": "dez/25",
      "tons": 1333193.357
    }
  ],
  "byCoord": [
    {
      "name": "GOIAS",
      "tons": 3947867.257
    },
    {
      "name": "CASCAVEL",
      "tons": 2412531.797
    },
    {
      "name": "RIO GRANDE DO SUL",
      "tons": 2081055.042
    },
    {
      "name": "MARINGA E TERMINAIS",
      "tons": 1764181.476
    },
    {
      "name": "MATO GROSSO MT2",
      "tons": 1583411.505
    },
    {
      "name": "SÃO PAULO",
      "tons": 1567867.227
    },
    {
      "name": "LONDRINA",
      "tons": 1486311.158
    },
    {
      "name": "MATO GROSSO MT1",
      "tons": 1427048.391
    },
    {
      "name": "MATO GROSSO MT3 - CONFRESA",
      "tons": 1335746.776
    },
    {
      "name": "PONTA GROSSA",
      "tons": 1196140.876
    }
  ],
  "topPoints": [
    {
      "name": "MARIALVA | CHS AGRONEGOCIO",
      "tons": 333429.288
    },
    {
      "name": "MARINGÁ | RHALL TERMINAIS LTDA",
      "tons": 242874.592
    },
    {
      "name": "ITAPEVA | COOP. HOLAMBRA TAKAOKA - ITAPEVA",
      "tons": 131747.632
    },
    {
      "name": "MARINGÁ | COCAMAR - MARINGA",
      "tons": 129500.558
    },
    {
      "name": "BOM JESUS DE GOIÁS | AGROBOM ARMAZENS GERAIS LTDA - BOM JESUS DE GOIAS",
      "tons": 107882.89199999999
    },
    {
      "name": "CRUZ ALTA | CEIFAGRO - CRUZ ALTA",
      "tons": 99959.79
    },
    {
      "name": "PARANAPANEMA | COOP HOLAMBRA - MATRIZ",
      "tons": 98152.995
    },
    {
      "name": "IMBITUVA | SITIO ALVORADA - IMBITUVA",
      "tons": 97805.225
    },
    {
      "name": "ROLÂNDIA | RICOLOG - TRANSBORDO E MULTIMO",
      "tons": 96715.015
    },
    {
      "name": "RANCHARIA | COMGROUP AGROINDUSTRIAL",
      "tons": 92858.61
    }
  ],
  "source": "Relatório operacional 2025"
};


  function fmtNum(n, opts={}){
  try{
    return new Intl.NumberFormat('pt-BR', opts).format(n);
  }catch(e){ return String(n); }
}

function fmtMonthPt_(ym) {
  // ym: "YYYY-MM"
  if (!ym || typeof ym !== "string") return String(ym ?? "");
  const [y, m] = ym.split("-");
  const mm = Number(m);
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const sigla = meses[(mm || 1) - 1] || m;
  return `${sigla}/${String(y).slice(-2)}`;
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
    root.querySelectorAll('[data-metric]').forEach(el=>{
      const k = el.getAttribute('data-metric');
      const v = t[k];
      if(typeof v === 'number'){
        setMetric(el, v, k==='tons_total' ? 'tons' : 'int');
      }
    });

    if(window.Chart){
      buildCharts_();
    }
    if(window.L){
      buildMap_();
    }
  }

  function buildCharts_(){
  // Volume por mês
  const cMes = $("#chartMonthly");
  if (cMes && window.Chart){
    const labels = (HOME_METRICS.monthly || []).map(r => r.ym);
    const values = (HOME_METRICS.monthly || []).map(r => r.tons);

    new Chart(cMes, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Toneladas",
          data: values,
          fill: true,
          tension: 0.35,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${fmtNum(ctx.parsed.y, {maximumFractionDigits: 0})} t`
            }
          }
        },
        scales: {
          y: { ticks: { callback: v => fmtNum(v, {notation: "compact", maximumFractionDigits: 1}) } },
          x: { ticks: { maxRotation: 0, autoSkip: true } }
        }
      }
    });
  }

  // Top coordenações (compliance: sem clientes)
  const cCoord = $("#chartCoord");
  if (cCoord && window.Chart){
    const fullLabels = (HOME_METRICS.byCoord || []).map(r => r.name);
    const labels = fullLabels.map(s => (s.length > 18 ? s.slice(0, 18) + "…" : s));
    const values = (HOME_METRICS.byCoord || []).map(r => r.tons);

    new Chart(cCoord, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Toneladas",
          data: values,
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => fullLabels[items[0].dataIndex] || "",
              label: (ctx) => ` ${fmtNum(ctx.parsed.x, {notation: "compact", maximumFractionDigits: 2})} t`
            }
          }
        },
        scales: {
          x: { ticks: { callback: v => fmtNum(v, {notation: "compact", maximumFractionDigits: 1}) } },
          y: { ticks: { autoSkip: false } }
        }
      }
    });
  }

  // Top pontos de embarque (Cidade | Local)
  const cPts = $("#chartClients");
  if (cPts && window.Chart){
    const fullLabels = (HOME_METRICS.topPoints || []).map(r => r.name);
    const labels = fullLabels.map(s => (s.length > 26 ? s.slice(0, 26) + "…" : s));
    const values = (HOME_METRICS.topPoints || []).map(r => r.tons);

    new Chart(cPts, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Toneladas",
          data: values,
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => fullLabels[items[0].dataIndex] || "",
              label: (ctx) => ` ${fmtNum(ctx.parsed.x, {notation: "compact", maximumFractionDigits: 2})} t`
            }
          }
        },
        scales: {
          x: { ticks: { callback: v => fmtNum(v, {notation: "compact", maximumFractionDigits: 1}) } },
          y: { ticks: { autoSkip: false } }
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

    // Supervisões (extraído do material institucional) — usado no "Mapa de orientação"
  const STATE_MANAGERS = {
    "BA": [{ name: "Douglas Candido", phone: "(77) 9 9999-3585" }],
    "GO": [
      { name: "Dilson Riebau", phone: "(64) 9344-0641" },
      { name: "Sidnei Ribeiro", phone: "(64) 9223-3113" }
    ],
    "MG": [{ name: "Ricardo Araújo", phone: "(34) 9729-7489" }],
    "MT": [
      { name: "Elizeu Lopes", phone: "(66) 9918-4053", area: "Sinop / MS / Matopipa" },
      { name: "Jean Pablo", phone: "(66) 9607-6403", area: "Rondonópolis / Primavera do Leste" },
      { name: "Vanuza Pereira", phone: "(66) 8457-8435", area: "Confresa" },
      { name: "Marllon Machado", phone: "(66) 8128-4238", area: "Querência" },
      { name: "Cleuton Albernaz", phone: "(66) 9690-9921", area: "Campo Novo do Parecis" }
    ],
    "MS": [{ name: "Elizeu Lopes", phone: "(66) 9918-4053" }],
    "PR": [
      { name: "Marcos Mota", phone: "(44) 9711-9843", area: "Cascavel" },
      { name: "Michael Gonçalves", phone: "(43) 9182-6733", area: "Londrina" },
      { name: "José Boa Ventura", phone: "(44) 9836-1000", area: "Maringá / Terminais Ferroviários" },
      { name: "Michael Ribas", phone: "(42) 9834-4303", area: "Ponta Grossa e Região" }
    ],
    "RS": [{ name: "João Baptista", phone: "(55) 9204-6531" }],
    "SP": [{ name: "Mayckon Inoue", phone: "(43) 9604-1000" }],
    "TO": [{ name: "Kairo Leite", phone: "(63) 9120-1087", area: "Matopipa" }]
  };

  const STATE_ORDER = ["PR","MT","GO","MS","SP","MG","BA","RS","TO"];

  function wireContactForm_() {
    const form = $("contactForm");
    const status = $("contactStatus");
    if (!form) return;

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const company = String(data.get("company") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !company || !phone || !message) {
        if (status) status.textContent = "Preencha todos os campos.";
        return;
      }

      const txt =
        `Solicitação de contato (Site Grão 1000)%0A` +
        `Nome: ${encodeURIComponent(name)}%0A` +
        `Empresa: ${encodeURIComponent(company)}%0A` +
        `Telefone: ${encodeURIComponent(phone)}%0A` +
        `Mensagem: ${encodeURIComponent(message)}`;

      // 1) tenta WhatsApp do botão do topo (se existir)
      const wa = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
      if (wa && wa.href) {
        const url = wa.href.includes("?") ? `${wa.href}&text=${txt}` : `${wa.href}?text=${txt}`;
        window.open(url, "_blank", "noopener,noreferrer");
        if (status) status.textContent = "Abrindo WhatsApp…";
        form.reset();
        return;
      }

      // 2) fallback: mailto
      const mail = "contato@grao1000.com.br";
      window.location.href = `mailto:${mail}?subject=Solicitação%20de%20contato%20-%20Site&body=${txt}`;
      if (status) status.textContent = "Abrindo e-mail…";
      form.reset();
    });
  }

  function buildStateMap_() {
    const wrap = $("stateMap");
    const cards = $("stateCards");
    const title = $("stateTitle");
    const meta = $("stateMeta");
    if (!wrap || !cards || !title || !meta) return;

    wrap.innerHTML = "";
    let activeUF = null;

    const makeTile = (uf) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "stateTile";
      btn.setAttribute("data-uf", uf);

      const people = STATE_MANAGERS[uf] || [];
      const n = people.length;

      btn.innerHTML = `
        <div class="uf">${uf}</div>
        <div class="sub">${n} gestor${n === 1 ? "" : "es"}</div>
      `;

      btn.addEventListener("click", () => renderUF(uf));
      return btn;
    };

    const renderUF = (uf) => {
      activeUF = uf;
      const people = STATE_MANAGERS[uf] || [];
      title.textContent = uf ? `Estado: ${uf}` : "Selecione um estado";
      meta.textContent = people.length ? `${people.length} responsável${people.length === 1 ? "" : "is"}` : "Sem dados";

      // highlight
      [...wrap.querySelectorAll(".stateTile")].forEach(el => {
        el.classList.toggle("active", el.getAttribute("data-uf") === uf);
      });

      cards.innerHTML = "";
      if (!people.length) {
        cards.innerHTML = `<div class="emptyState">Sem responsáveis cadastrados para este estado.</div>`;
        return;
      }

      for (const p of people) {
        const d = document.createElement("div");
        d.className = "mgrCard";
        d.innerHTML = `
          <div class="mgrName">${p.name}</div>
          <div class="mgrMeta">
            <span class="mgrPhone">${p.phone || ""}</span>
            ${p.area ? `<span class="mgrArea">• ${p.area}</span>` : ""}
          </div>
        `;
        cards.appendChild(d);
      }
    };

    // build tiles
    for (const uf of STATE_ORDER) wrap.appendChild(makeTile(uf));

    // default state
    renderUF(STATE_ORDER[0]);
  }

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




/* ===== Premium BI: scroll reveal + smooth anchor ===== */
(function(){
  try{
    // smooth anchors
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href');
        if(!id || id === '#') return;
        const el = document.querySelector(id);
        if(!el) return;
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });

    // reveal blocks
    const els = Array.from(document.querySelectorAll('.card, .metricCard, .postCard, section, .sectionTitle, .hero, .mapWrap'))
      .filter(el => !el.classList.contains('noReveal'));
    els.forEach(el=>el.classList.add('reveal'));

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          ent.target.classList.add('is-in');
          io.unobserve(ent.target);
        }
      });
    }, {threshold: 0.12, rootMargin: '80px 0px -40px 0px'});

    els.forEach(el=>io.observe(el));
  }catch(err){}
})();


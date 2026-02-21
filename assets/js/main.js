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
      if(mobile && mobile.classList.contains('open')) mobile.classList.remove('open');

      e.preventDefault();
      document.body.classList.add('page-exit');
      window.setTimeout(()=>{ location.href = href; }, 260);
    });

    window.addEventListener('pageshow', (e)=>{
      if(e.persisted){
        document.body.classList.remove('page-exit');
        document.body.classList.add('page-enter');
        window.setTimeout(()=>document.body.classList.remove('page-enter'), 420);
      }
    });
  }

  // Hero slideshow
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

})();

// =========================
// Facebook feed (últimas 5 postagens)
// - Grid leve na Home
// - Endpoint padrão: /fb/posts (via Cloudflare Worker)
// =========================
(function(){
  const FB_POSTS_ENDPOINT = (window.__GRAO1000_CONFIG && window.__GRAO1000_CONFIG.fbPostsEndpoint)
    || "/fb/posts";

  function trunc(s, max){
    const t = String(s||"").replace(/\s+/g," ").trim();
    if(!t) return "";
    return t.length>max ? (t.slice(0,max-1)+"…") : t;
  }

  function normPost(p){
    return {
      id: String(p?.id||""),
      created_time: p?.created_time || "",
      link: p?.link || "",
      text: (p?.text || "").trim(),
      img: p?.img || ""
    };
  }

  function fmtDate(iso){
    try{
      const d = new Date(iso);
      if(Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
    }catch(_){ return ""; }
  }

  async function fetchPosts(){
    const cacheKey = "g1000_fbposts_cache_v2";
    const ttlMs = 5*60*1000;
    try{
      const cached = JSON.parse(localStorage.getItem(cacheKey)||"null");
      if(cached && cached.fetchedAt && (Date.now()-cached.fetchedAt)<ttlMs && Array.isArray(cached.posts) && cached.posts.length){
        return cached.posts;
      }
    }catch(_){ }

    const r = await fetch(FB_POSTS_ENDPOINT, { cache: "no-store" });
    const j = await r.json();
    const posts = (Array.isArray(j?.posts) ? j.posts : []).map(normPost).filter(p=>p.id && p.img).slice(0,5);
    try{ localStorage.setItem(cacheKey, JSON.stringify({ fetchedAt: Date.now(), posts })); }catch(_){ }
    return posts;
  }

  function mountFeed(posts){
    const root = document.getElementById('fbFeed');
    const status = document.getElementById('fbFeedStatus');
    if(!root) return;

    if(!Array.isArray(posts) || !posts.length){
      if(status) status.textContent = "Sem postagens para exibir agora.";
      root.innerHTML = "";
      return;
    }

    if(status) status.textContent = "";
    root.innerHTML = "";

    posts.forEach((p)=>{
      const a = document.createElement('a');
      a.className = 'fbCard';
      a.href = p.link || 'https://www.facebook.com/grao1000';
      a.target = '_blank';
      a.rel = 'noopener';

      const img = document.createElement('div');
      img.className = 'fbCardImg';
      img.style.backgroundImage = `url("${p.img}")`;

      const body = document.createElement('div');
      body.className = 'fbCardBody';

      const meta = document.createElement('div');
      meta.className = 'fbCardMeta';
      meta.textContent = fmtDate(p.created_time);

      const txt = document.createElement('div');
      txt.className = 'fbCardText';
      txt.textContent = trunc(p.text || "", 120) || "Ver postagem no Facebook";

      const cta = document.createElement('div');
      cta.className = 'fbCardCta';
      cta.textContent = 'Abrir no Facebook →';

      body.appendChild(meta);
      body.appendChild(txt);
      body.appendChild(cta);

      a.appendChild(img);
      a.appendChild(body);
      root.appendChild(a);
    });
  }

  async function init(){
    const root = document.getElementById('fbFeed');
    if(!root) return;
    try{
      const posts = await fetchPosts();
      mountFeed(posts);
    }catch(err){
      console.warn('FB feed failed:', err);
      const status = document.getElementById('fbFeedStatus');
      if(status) status.textContent = "Não foi possível carregar as postagens agora.";
    }
  }

  init();
})();

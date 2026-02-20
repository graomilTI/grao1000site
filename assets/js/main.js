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



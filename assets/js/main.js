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
    
  // ===== FB Posts Carousel (optional) =====
  // Set window.G1000_FB_FEED_ENDPOINT = "https://<your-worker>/fb/posts" (returns {ok:true, posts:[{img, link, text, created_time}]})
  // If endpoint is not set or fails, we fallback to local images.
  async function tryLoadFbSlides_(){
    try{
      const endpoint = window.G1000_FB_FEED_ENDPOINT;
      if(!endpoint) return null;

      // fast cache in sessionStorage to avoid "vacuum" on navigation
      const cacheKey = "g1000_fb_posts_cache_v1";
      const cachedRaw = sessionStorage.getItem(cacheKey);
      if(cachedRaw){
        try{
          const cached = JSON.parse(cachedRaw);
          if(cached && cached.t && (Date.now() - cached.t) < 5*60*1000 && Array.isArray(cached.posts) && cached.posts.length){
            return cached.posts;
          }
        }catch(_){}
      }

      const r = await fetch(endpoint, { cache: "no-store" });
      if(!r.ok) return null;
      const j = await r.json();
      const posts = (j && j.posts) ? j.posts : (j && j.data) ? j.data : null;
      if(!Array.isArray(posts) || !posts.length) return null;

      const slides = posts
        .map(p => ({
          img: p.img || p.image_url || (p.attachments && p.attachments[0] && p.attachments[0].img) || null,
          link: p.link || p.permalink_url || p.url || null,
          text: p.text || p.message || "",
          created_time: p.created_time || p.createdTime || ""
        }))
        .filter(s => !!s.img)
        .slice(0,5);

      if(!slides.length) return null;

      sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), posts: slides }));
      return slides;
    }catch(_){
      return null;
    }
  }

const imgs = [
      'assets/img/hero-1.webp',
      'assets/img/hero-2.webp',
      'assets/img/hero-3.webp',
      'assets/img/hero-4.webp'
    ];
  // Default slides = local images
  let slides = imgs.map(src => ({ img: src, link: null, text: "" }));

  // If FB slides are available, swap them in without waiting (keeps UX snappy)
  tryLoadFbSlides_().then((fb) => {
    if(Array.isArray(fb) && fb.length){
      slides = fb;
      // prime next swap immediately
      i = 0;
      setHero_(slides[i]?.img || imgs[0], slides[i]?.text || "", slides[i]?.link || null, true);
      i = (i + 1) % slides.length;
    }
  });

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

  function setHero_(imgUrl, caption, link, immediate){
    // swap hero background layers (A/B)
    const url = imgUrl || "";
    if (immediate){
      // set both layers to avoid flicker
      setImg(layerA, url);
      setImg(layerB, url);
      if(heroLink) heroLink.href = link || "#";
      if(heroCaption) heroCaption.textContent = caption || "";
      return;
    }
    setHero_(url, cap, lnk);
    if(heroLink) heroLink.href = link || "#";
    if(heroCaption) heroCaption.textContent = caption || "";
  }

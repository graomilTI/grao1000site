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
    window.setTimeout(()=>document.body.classList.remove('page-enter'), 520);

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
      window.setTimeout(()=>{ location.href = href; }, 320);
    });

    // When returning from bfcache
    window.addEventListener('pageshow', (e)=>{
      if(e.persisted){
        document.body.classList.remove('page-exit');
        document.body.classList.add('page-enter');
        window.setTimeout(()=>document.body.classList.remove('page-enter'), 520);
      }
    });
  }

  // Hero slideshow (corporativo)
  const layerA = document.querySelector('[data-hero-layer="a"]');
  const layerB = document.querySelector('[data-hero-layer="b"]');
  const hero = document.querySelector('.hero');
  if(hero && layerA && layerB){
    const imgs = [
      'assets/img/hero1.webp',
      'assets/img/hero2.webp',
      'assets/img/hero3.webp',
      'assets/img/hero4.webp'
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

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
    // hide transition overlay if coming from navigation
    try{ sessionStorage.removeItem('g1000_nav'); }catch(_){ }
    window.setTimeout(()=>document.documentElement.classList.remove('g1000-nav'), 120);

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
      try{ sessionStorage.setItem('g1000_nav','1'); }catch(_){ }
      document.documentElement.classList.add('g1000-nav');
      document.body.classList.add('page-exit');
      window.setTimeout(()=>{ location.href = href; }, 180);
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

    // Hero slideshow (postagens / fotos) — crossfade suave
  const heroImg = document.querySelector('.heroImage');
  if(heroImg){
    const imgs = [
      'assets/img/posts/post-1.webp',
      'assets/img/posts/post-2.webp',
      'assets/img/posts/post-3.webp',
      'assets/img/posts/post-4.webp',
      'assets/img/posts/post-5.webp'
    ];

    // cria 2 camadas para crossfade
    const layerA = document.createElement('div');
    const layerB = document.createElement('div');
    layerA.className = 'heroLayer is-on';
    layerB.className = 'heroLayer';
    heroImg.textContent = '';
    heroImg.appendChild(layerA);
    heroImg.appendChild(layerB);

    let i = 0;
    let aOn = true;
    function setBg(el, url){ el.style.backgroundImage = `url("${url}")`; }

    setBg(layerA, imgs[0]);
    setBg(layerB, imgs[1]);

    setInterval(()=>{
      i = (i + 1) % imgs.length;
      const next = imgs[i];
      if(aOn){
        setBg(layerB, next);
        layerB.classList.add('is-on');
        layerA.classList.remove('is-on');
      }else{
        setBg(layerA, next);
        layerA.classList.add('is-on');
        layerB.classList.remove('is-on');
      }
      aOn = !aOn;
    }, 5200);

    // clique abre Facebook (pode trocar para Instagram depois)
    heroImg.style.cursor = 'pointer';
    heroImg.addEventListener('click', ()=>window.open('https://www.facebook.com/grao1000', '_blank'));
  }


})();

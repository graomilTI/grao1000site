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

  // Hero background slideshow (leve e elegante)
  const hero = document.querySelector('.hero');
  if(hero){
    const imgs = [
      'assets/img/hero1.webp',
      'assets/img/hero2.webp',
      'assets/img/hero3.webp',
      'assets/img/hero4.webp'
    ].filter(Boolean);
    let i = 0;

    // pre-load
    imgs.forEach(src=>{ const im=new Image(); im.src=src; });

    const apply = ()=>{
      const src = imgs[i % imgs.length];
      hero.style.setProperty('--hero-bg', `url("${src}")`);
      i++;
    };

    apply();
    setInterval(apply, 5200);
  }

})();

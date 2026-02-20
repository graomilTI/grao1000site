(function(){
  // Mobile menu
  const btn = document.querySelector('[data-hamburger]');
  const mobile = document.querySelector('[data-mobile]');
  if(btn && mobile){
    btn.addEventListener('click', ()=>{
      mobile.classList.toggle('open');
    });
  }

  // Active nav link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href === path){ a.classList.add('active'); }
  });

  // Footer year
  const y = document.getElementById('y');
  if(y){ y.textContent = String(new Date().getFullYear()); }

  // ===== Photo helpers =====
  function setPhotoBg(el, url){
    if(!el || !url) return;
    el.style.setProperty('--photo-bg', `url("${url}")`);
  }

  // Section backgrounds (subtle)
  document.querySelectorAll('[data-photo]').forEach((el)=>{
    const url = el.getAttribute('data-photo');
    setPhotoBg(el, url);
  });

  // ===== Hero slideshow =====
  const hero = document.querySelector('.heroImage');
  if(hero){
    const imgs = (hero.getAttribute('data-hero') || '').split('|').map(s=>s.trim()).filter(Boolean);
    if(imgs.length){
      // preload
      imgs.forEach(src=>{ const im=new Image(); im.src=src; });
      let i = 0;
      let alt = false;
      hero.style.setProperty('--hero-bg-1', `url("${imgs[0]}")`);
      hero.style.setProperty('--hero-bg-2', `url("${imgs[1] || imgs[0]}")`);
      if(imgs.length > 1){
        setInterval(()=>{
          i = (i + 1) % imgs.length;
          const next = imgs[i];
          if(alt){
            hero.style.setProperty('--hero-bg-2', `url("${next}")`);
          }else{
            hero.style.setProperty('--hero-bg-1', `url("${next}")`);
          }
          alt = !alt;
          hero.classList.toggle('isAlt', alt);
        }, 5200);
      }
    }
  }
})();
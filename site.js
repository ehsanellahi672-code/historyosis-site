(function(){
  "use strict";
  var root=document.documentElement;
  /* ---------- theme: Auto, Light, Dark ---------- */
  var KEY='ho-site-theme';
  function read(){try{var v=localStorage.getItem(KEY);return v==='light'||v==='dark'?v:'auto';}catch(e){return 'auto';}}
  function write(v){try{if(v==='auto')localStorage.removeItem(KEY);else localStorage.setItem(KEY,v);}catch(e){}}
  var ICON={
    auto:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
    light:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
  };
  var LABEL={auto:'Auto',light:'Light',dark:'Dark'};
  var NEXT={auto:'light',light:'dark',dark:'auto'};
  function effectiveDark(pref){return pref==='dark'||(pref==='auto'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);}
  function paintMeta(pref){
    var dark=effectiveDark(pref),col=dark?'#0E1513':'#F6FBF8';
    [].forEach.call(document.querySelectorAll('meta[name="theme-color"]'),function(m){
      if(pref==='auto'){var med=m.getAttribute('data-media');if(med)m.setAttribute('media',med);}
      else{if(m.getAttribute('media'))m.setAttribute('data-media',m.getAttribute('media'));m.removeAttribute('media');m.setAttribute('content',col);}
    });
  }
  function apply(pref,fromUser){
    if(pref==='auto')root.removeAttribute('data-theme');else root.setAttribute('data-theme',pref);
    var b=document.getElementById('theme-btn');
    if(b){
      b.innerHTML=ICON[pref]+'<span>'+LABEL[pref]+'</span>';
      var msg='Theme: '+LABEL[pref]+'. Switch to '+LABEL[NEXT[pref]]+'.';
      b.setAttribute('aria-label',msg);b.setAttribute('title',msg);
    }
    paintMeta(pref);
    var live=document.getElementById('theme-live');
    if(live&&fromUser)live.textContent='Theme set to '+LABEL[pref]+'.';
  }
  root.classList.add('js');
  var pref=read();apply(pref,false);
  var btn=document.getElementById('theme-btn');
  if(btn)btn.addEventListener('click',function(){pref=NEXT[pref];write(pref);apply(pref,true);});
  if(window.matchMedia){try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(pref==='auto')paintMeta('auto');});}catch(e){}}

  /* ---------- reveal on scroll ---------- */
  try{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    document.querySelectorAll('.sec-head,.dual article,.news article,.row,.ddx>*,.beta,.phase,.three>div,.steps li,.route,.tour-group,.timeline li').forEach(function(el){el.classList.add('rv');io.observe(el);});
  }catch(e){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});}

  /* ---------- tabs (who it is for) ---------- */
  var tabs=[].slice.call(document.querySelectorAll('[role=tab]'));
  if(tabs.length){
    var show=function(t,focus){
      tabs.forEach(function(x){
        var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
        var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on;
      });
      if(focus)t.focus();
    };
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){show(t,false);});
      t.addEventListener('keydown',function(e){
        var k=e.key,n=-1;
        if(k==='ArrowRight')n=(i+1)%tabs.length;else if(k==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(k==='Home')n=0;else if(k==='End')n=tabs.length-1;
        if(n>=0){e.preventDefault();show(tabs[n],true);}
      });
    });
    var byHash={'#universities':'tab-uni','#clinics':'tab-clinic','#hospitals':'tab-hosp'};
    var fromHash=function(){var id=byHash[location.hash];if(id){show(document.getElementById(id),false);var s=document.getElementById('who');if(s)s.scrollIntoView();}};
    window.addEventListener('hashchange',fromHash);fromHash();
  }

  /* ---------- close the mobile menu after choosing a link ---------- */
  var menu=document.querySelector('.menu');
  if(menu){
    menu.addEventListener('click',function(e){if(e.target.tagName==='A')menu.removeAttribute('open');});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.hasAttribute('open')){menu.removeAttribute('open');var s=menu.querySelector('summary');if(s)s.focus();}});
  }

  /* ---------- old single-page links (historyosis.tech/#privacy and so on) ---------- */
  if(document.body.getAttribute('data-page')==='home'&&location.hash){
    var old={'#audiences':'who-its-for.html','#who':'who-its-for.html','#universities':'who-its-for.html#universities','#clinics':'who-its-for.html#clinics','#hospitals':'who-its-for.html#hospitals',
      '#ddx':'differentials.html','#whatsnew':'whats-new.html','#features':'features.html','#safety':'privacy-safety.html#safety','#privacy':'privacy-safety.html',
      '#roadmap':'roadmap.html','#readiness':'roadmap.html#standards','#beta':'get-involved.html','#pilot':'get-involved.html#pilot','#faq':'faq.html','#about':'about.html'};
    if(old[location.hash])location.replace(old[location.hash]);
  }
})();

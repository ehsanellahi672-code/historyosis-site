(function(){
  "use strict";
  /* the chest pain composer */
  var root=document.getElementById('composer'); if(!root) return;
  var out=document.getElementById('hopi-out');
  var S={onset:null,char:[],rad:[],sev:null,assoc:{}};
  var order={char:['crushing','tight / pressure','sharp','burning','tearing','pleuritic'],rad:['left arm','right arm','jaw','neck','back','epigastrium'],assoc:['sweating','nausea','vomiting','breathlessness','palpitations','syncope']};
  var scale=root.querySelector('.scale');
  for(var i=0;i<=10;i++){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=i;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Severity '+i+' out of 10');scale.appendChild(b);}
  root.querySelectorAll('[data-type=ternary] .chip').forEach(function(c){c.setAttribute('data-label',c.textContent);});
  function sentence(){
    var parts=[];
    if(S.onset)parts.push(S.onset+' onset');
    S.char.forEach(function(c){parts.push(c)});
    if(S.rad.length)parts.push('radiating to '+S.rad.join(', '));
    if(S.sev!==null)parts.push('severity '+S.sev+'/10');
    var present=order.assoc.filter(function(k){return S.assoc[k]==='present'});
    var absent=order.assoc.filter(function(k){return S.assoc[k]==='absent'});
    if(!parts.length&&!present.length&&!absent.length){out.className='empty';out.textContent='Tap an answer above and the history writes itself here.';return;}
    out.className='';
    var s='Chest Pain'+(parts.length?': '+parts.join(', '):'')+'.';
    if(present.length)s+=' Associated: '+present.join(', ')+'.';
    if(absent.length)s+=' No '+absent.join(', ')+'.';
    out.textContent=s;
  }
  function paint(){
    root.querySelectorAll('[data-q]').forEach(function(g){
      var q=g.getAttribute('data-q'),type=g.getAttribute('data-type');
      g.querySelectorAll('.chip').forEach(function(c,idx){
        var label=type==='scale'?String(idx):(c.getAttribute('data-label')||c.textContent);
        if(type==='single')c.setAttribute('aria-pressed',S.onset===label);
        else if(type==='multi')c.setAttribute('aria-pressed',S[q].indexOf(label)>=0);
        else if(type==='scale')c.setAttribute('aria-pressed',S.sev===idx);
        else{var st=S.assoc[label]||'';c.setAttribute('data-state',st);c.setAttribute('aria-label',label+', '+(st||'not asked'));c.textContent=(st==='present'?'✓ ':st==='absent'?'✕ ':'')+label;}
      });
    });
    sentence();
  }
  function tap(q,label){
    var type=root.querySelector('[data-q="'+q+'"]').getAttribute('data-type');
    if(type==='single')S.onset=(S.onset===label?null:label);
    else if(type==='multi'){var a=S[q],at=a.indexOf(label);if(at>=0)a.splice(at,1);else{a.push(label);a.sort(function(x,y){return order[q].indexOf(x)-order[q].indexOf(y)});}}
    else if(type==='scale'){var n=+label;S.sev=(S.sev===n?null:n);}
    else{var cur=S.assoc[label]||'';if(!cur)S.assoc[label]='present';else if(cur==='present')S.assoc[label]='absent';else delete S.assoc[label];}
    paint();
  }
  root.addEventListener('click',function(e){
    var c=e.target.closest('.chip'); if(!c)return; stop=true;
    var g=c.parentNode,q=g.getAttribute('data-q'),type=g.getAttribute('data-type');
    var label=type==='scale'?String([].indexOf.call(g.children,c)):(c.getAttribute('data-label')||c.textContent.replace(/^[✓✕]\s/,''));
    tap(q,label);
  });
  /* one demonstration on load, stopped by any touch, click or key */
  var stop=false;
  var demo=[['onset','sudden'],['char','crushing'],['char','tight / pressure'],['rad','left arm'],['rad','jaw'],['sev','8'],['assoc','sweating'],['assoc','nausea'],['assoc','breathlessness'],['assoc','syncope'],['assoc','syncope']];
  root.addEventListener('pointerdown',function(){stop=true},{once:true});
  root.addEventListener('keydown',function(){stop=true},{once:true});
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ demo.forEach(function(d){tap(d[0],d[1])}); return; }
  S={onset:null,char:[],rad:[],sev:null,assoc:{}}; paint();
  var k=0;
  function step(){ if(stop||k>=demo.length)return; tap(demo[k][0],demo[k][1]); k++; setTimeout(step,k===demo.length?0:650); }
  setTimeout(step,900);
})();

// Gemas en Pozo: carga data/oportunidades.json y arma la lista con filtros.
(async function(){
const res=await fetch('data/oportunidades.json',{cache:'no-store'}).catch(()=>null);
if(!res||!res.ok){document.getElementById('list').innerHTML='<div class="empty">No pudimos cargar las oportunidades. Probá recargar la página.</div>';return;}
const D=await res.json();
const fmt=n=>'USD '+n.toLocaleString('es-AR');
const days=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
D.items.forEach(x=>{const pond=x.cub+0.5*(x.ext||0); x.pond=Math.round(pond); x.ppm=Math.round(x.usd/pond); const m=D.medians[x.zone]; x.disc=m?Math.round((1-x.ppm/m)*100):0; x.isNew=x.first===D.updated; const h=x.hist||[]; x.drop=h.length>1&&h[h.length-1][1]<h[h.length-2][1]?h[h.length-2][1]-h[h.length-1][1]:0;});
document.getElementById('upd').textContent=new Date(D.updated+'T12:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}).toUpperCase();
const zones=[...new Set(D.items.map(x=>x.zone))].sort(); const zs=document.getElementById('f-zona'); zones.forEach(z=>{const o=document.createElement('option');o.value=z;o.textContent=z;zs.appendChild(o)});
document.getElementById('meds').textContent='Medianas usadas: '+Object.entries(D.medians).map(([k,v])=>k+' '+v.toLocaleString('es-AR')).join(' · ')+' USD/m².';
const gems=D.items.filter(x=>x.disc>=15).length;
document.getElementById('stats').innerHTML=`<div><b>${D.items.length}</b><span>oportunidades activas</span></div><div><b>${gems}</b><span>gemas (15% o más abajo)</span></div><div><b>${D.items.filter(x=>x.isNew).length}</b><span>nuevas hoy</span></div>`;
const el=id=>document.getElementById(id);
const S={zona:'',amb:'',max:'',orden:'disc',gem:false};
try{Object.assign(S,JSON.parse(localStorage.getItem('gemas-f')||'{}'))}catch(e){}
el('f-zona').value=S.zona;el('f-amb').value=S.amb;el('f-max').value=S.max;el('f-orden').value=S.orden;el('f-gem').checked=S.gem;
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function render(){
  let L=D.items.filter(x=>(!S.zona||x.zone===S.zona)&&(!S.amb||(S.amb==='2'?x.amb===2:x.amb>=3))&&(!S.max||x.usd<=+S.max)&&(!S.gem||x.disc>=15));
  const o=S.orden; L.sort((a,b)=>o==='new'?(b.first.localeCompare(a.first)||b.disc-a.disc):o==='price'?a.usd-b.usd:o==='m2'?b.pond-a.pond:b.disc-a.disc);
  el('count').textContent=L.length+' de '+D.items.length;
  el('list').innerHTML=L.length?L.map(x=>{const c=x.disc>=15?'g':x.disc>=5?'m':'n'; const tot=x.cub+(x.ext||0);
    return `<article class="item"><div class="disc ${c}"><b>${x.disc>0?'−'+x.disc:x.disc<0?'+'+(-x.disc):'0'}%</b><span>vs ${esc(x.zone)}</span></div>
    <div><h3>${esc(x.name)}</h3><div class="sub">${esc(x.zone)} · ${x.amb} amb · ${esc(x.stage)} · ${esc(x.dev)}</div><p class="note">${esc(x.note)}</p>
    <div class="tags">${x.isNew?'<span class="tag new">Nuevo</span>':''}${x.drop?`<span class="tag down">Bajó ${fmt(x.drop)}</span>`:''}${/cuotas/i.test(x.fin)?'<span class="tag fin">Cuotas</span>':''}${x.disc>=15?'<span class="tag">Gema</span>':''}</div>
    <div class="links">${x.links.map(([t,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div></div>
    <div class="facts"><div><div class="k">Precio</div><div class="num">${fmt(x.usd)}</div></div><div><div class="k">USD/m²</div><div class="num">${x.ppm.toLocaleString('es-AR')}</div></div>
    <div><div class="k">Superficie</div><div class="num">${tot} m² (${x.cub} cub.)</div></div><div><div class="k">Entrega</div><div>${esc(x.del)}</div></div>
    <div style="grid-column:1/-1"><div class="k">Forma de pago</div><div>${esc(x.fin)}</div></div></div></article>`}).join(''):'<div class="empty">No hay oportunidades con estos filtros. Probá ampliar la zona o el precio.</div>';
}
['f-zona','f-amb','f-max','f-orden','f-gem'].forEach(id=>el(id).addEventListener(id==='f-max'?'input':'change',()=>{S.zona=el('f-zona').value;S.amb=el('f-amb').value;S.max=el('f-max').value;S.orden=el('f-orden').value;S.gem=el('f-gem').checked;try{localStorage.setItem('gemas-f',JSON.stringify(S))}catch(e){};render();}));
render();
})();

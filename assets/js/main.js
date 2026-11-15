(function(){
'use strict';
var ZAP='5544999953299';
var $=function(s,c){return (c||document).querySelector(s)};

/* menu */
var mb=$('.menu-btn'),menu=$('.menu');
mb.addEventListener('click',function(){var a=mb.getAttribute('aria-expanded')==='true';mb.setAttribute('aria-expanded',String(!a));menu.hidden=a});
menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.hidden=true;mb.setAttribute('aria-expanded','false')}});

/* hero: a tiragem */
var SEQ=[['mago','O Mago'],['diabo','O Diabo'],['estrela','A Estrela'],['louco','Louco'],['imperador','Imperador'],['papa','O Papa'],['dependurado','Dependurado'],['mestre','Mestre']];
SEQ.forEach(function(c){var i=new Image();i.src='assets/img/c/'+c[0]+'.webp'});
var carta=$('.carta'),img=$('#cartaImg'),nome=$('#cartaNome'),k=0,vis=true;
var E='cubic-bezier(.16,.84,.32,1)';
function vira(de,para,dur,cb){var a=carta.animate([{transform:'rotateY('+de+'deg)'},{transform:'rotateY('+para+'deg)'}],{duration:dur,easing:E,fill:'forwards'});a.onfinish=cb||null}
// entrada: verso -> frente em 0,9 s
setTimeout(function(){vira(180,0,900)},250);
function proxima(){
  if(!vis||document.hidden)return;
  k=(k+1)%SEQ.length;
  vira(0,-90,380,function(){
    img.src='assets/img/c/'+SEQ[k][0]+'.webp';img.alt='Carta '+SEQ[k][1]+', do tarot desenhado pelo Bisa';nome.textContent=SEQ[k][1];
    vira(90,0,520);
  });
}
setInterval(proxima,5000);
if('IntersectionObserver' in window){new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe($('.hero'))}

/* trabalhos */
var BASE=matchMedia('(max-width:600px)').matches?12:24;
var grade=$('#grade'),todos=[],filtro='todos',lim=BASE,lbLista=[],lbI=0;
function desenha(){
  var l=todos.filter(function(t){return filtro==='todos'||t.e===filtro});
  grade.innerHTML='';
  l.slice(0,lim).forEach(function(t,i){
    var b=document.createElement('button');b.setAttribute('aria-label','Ampliar trabalho');
    b.innerHTML='<img src="'+t.s+'" alt="Tatuagem de Bisa Tattoo" width="900" height="1125">';
    b.onclick=function(){abre(l.map(function(x){return x.s}),i,'Desenho exclusivo','Uma tattoo como a do trabalho nº '+(todos.indexOf(l[i])+1)+' do site')};grade.appendChild(b)});
  $('#verMais').hidden=l.length<=lim;
}
fetch('assets/trabalhos.json').then(function(r){return r.json()}).then(function(j){todos=j;desenha()});
document.querySelectorAll('.filtros button').forEach(function(b){b.onclick=function(){
  document.querySelectorAll('.filtros button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');filtro=b.dataset.f;lim=BASE;desenha()}});
$('#verMais').onclick=function(){lim=999;desenha()};

/* escolha -> mensagem */
var form=$('#form'),erro=$('#erro');
function escolhe(tipo,txt){
  var r=form.querySelector('input[name=tipo][value="'+tipo+'"]');if(r)r.checked=true;
  form.ideia.value=txt;
  $('#marcar').scrollIntoView({behavior:'smooth'});
}
form.addEventListener('submit',function(e){
  e.preventDefault();
  var f=new FormData(form),nome=(f.get('nome')||'').trim();
  if(!nome){erro.hidden=false;form.nome.focus();return}
  erro.hidden=true;
  var l=['Oi, Bisa! Sou *'+nome+'* e quero marcar uma tatuagem.','',
    '*Pedido:* '+f.get('tipo'),'*Cor:* '+f.get('cor'),
    '*Lugar do corpo:* '+((f.get('local')||'').trim()||'a definir'),
    '*Tamanho:* '+f.get('tamanho'),'*Quando:* '+f.get('quando')];
  var ideia=(f.get('ideia')||'').trim();if(ideia)l.push('','*Ideia:* '+ideia);
  l.push('','(pedido enviado pelo site)');
  window.open('https://wa.me/'+ZAP+'?text='+encodeURIComponent(l.join('\n')),'_blank','noopener');
});

/* tarot */
var TAROT=[['louco','Louco'],['mago','O Mago'],['sacerdotisa','A Sacerdotisa'],['imperador','Imperador'],['papa','O Papa'],['mestre','Mestre'],
  ['forca','Força'],['roda','Roda da Fortuna'],['dependurado','Dependurado'],['temperanca','A Temperança'],['diabo','O Diabo'],['estrela','A Estrela']];
var bar=$('#baralho');
TAROT.forEach(function(c){var b=document.createElement('button');
  b.innerHTML='<img src="assets/img/c/'+c[0]+'.webp" alt="Carta '+c[1]+'" width="640" height="1200"><span>Quero '+c[1]+'</span>';
  b.onclick=function(){escolhe('Carta do tarot','A carta '+c[1]+' do seu tarot')};bar.appendChild(b)});

/* folhas de flash */
var FOLHAS=[['pasta1','Pasta 1'],['pasta2','Pasta 2'],['pasta3','Pasta 3'],['oriental','Oriental'],['ceifador','Ceifadores e rosas'],['manga','Mangá'],
  ['pasta4','Pasta 4'],['pasta5','Pasta 5'],['pasta6','Pasta 6']];
var fo=$('#folhas');
FOLHAS.forEach(function(f,i){var d=document.createElement('div');d.className='folha';
  d.innerHTML='<figure><img src="assets/img/f/'+f[0]+'.webp" alt="Folha de flash: '+f[1]+'"></figure><button class="btn btn-ln">Quero desta folha</button>';
  d.querySelector('figure').onclick=function(){abre(FOLHAS.map(function(x){return 'assets/img/f/'+x[0]+'.webp'}),i,'Flash das pastas',function(k){return 'Um flash da folha '+FOLHAS[k][1]+' (mando qual por aqui)'})};
  d.querySelector('button').onclick=function(){escolhe('Flash das pastas','Um flash da folha '+f[1]+' (mando qual por aqui)')};fo.appendChild(d)});

/* fechamentos */
var FE=['antebraco','fech1','fech2','fech3','fech4','fech5'],fe=$('#fech');
FE.forEach(function(f,i){var b=document.createElement('button');b.setAttribute('aria-label','Ampliar fechamento');
  b.innerHTML='<img src="assets/img/f/'+f+'.webp" alt="Fechamento de braço desenhado pelo Bisa">';
  b.onclick=function(){abre(FE.map(function(x){return 'assets/img/f/'+x+'.webp'}),i,'Fechamento',function(k){return 'O fechamento nº '+(k+1)+' do site'})};fe.appendChild(b)});

/* lightbox */
var lb=$('#lb'),lbImg=$('#lbImg');
var lbTipo='',lbTxt=null;
function abre(l,i,tipo,txt){lbLista=l;lbI=i;lbTipo=tipo;lbTxt=txt;lbImg.src=l[i];lb.hidden=false;document.body.style.overflow='hidden'}
$('#lbQuero').onclick=function(){var t=typeof lbTxt==='function'?lbTxt(lbI):lbTxt;fecha();escolhe(lbTipo,t)};
function fecha(){lb.hidden=true;document.body.style.overflow=''}
function anda(d){lbI=(lbI+d+lbLista.length)%lbLista.length;lbImg.src=lbLista[lbI]}
$('.lb-x').onclick=fecha;$('#lbAnt').onclick=function(){anda(-1)};$('#lbProx').onclick=function(){anda(1)};
lb.addEventListener('click',function(e){if(e.target===lb)fecha()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')fecha();if(e.key==='ArrowLeft')anda(-1);if(e.key==='ArrowRight')anda(1)});

/* subida leve ao rolar */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.cab,.premios,.sobre,.form').forEach(function(el){el.classList.add('revela');io.observe(el)});
}
})();

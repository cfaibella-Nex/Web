
function handleContactForm(e){
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  const form = document.getElementById('contact-form');
  if(!form.action || form.action.includes('XXXXXXXX')){
    const nom = form.querySelector('[name="nom"]') ? form.querySelector('[name="nom"]').value : '';
    const email = form.querySelector('[name="email"]') ? form.querySelector('[name="email"]').value : '';
    const telefon = form.querySelector('[name="telefon"]') ? form.querySelector('[name="telefon"]').value : '';
    const motiu = form.querySelector('[name="motiu"]') ? form.querySelector('[name="motiu"]').value : '';
    const missatge = form.querySelector('[name="missatge"]') ? form.querySelector('[name="missatge"]').value : '';
    const body = encodeURIComponent('Nom: '+nom+'\nEmail: '+email+'\nTelèfon: '+telefon+'\nMotiu: '+motiu+'\n\n'+missatge);
    window.location.href = 'mailto:infonex@nexsocial.org?subject=Contacte web NexSocial&body='+body;
    success.style.display='block';
    form.reset();
    return;
  }
  btn.textContent = 'Enviant...';
  btn.disabled = true;
  fetch(form.action, {method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}})
    .then(function(res){
      if(res.ok){ success.style.display='block'; form.reset(); btn.textContent='Enviat ✓'; }
      else { btn.textContent='Error — torna-ho a intentar'; btn.disabled=false; }
    }).catch(function(){ btn.textContent='Error — torna-ho a intentar'; btn.disabled=false; });
}

function handleTreballarForm(e){
  e.preventDefault();
  const form = e.target;
  const ok = document.getElementById('treballar-ok');
  if(!form.action || form.action.includes('XXXXXXXX')){
    const nom = form.querySelector('[name="nom"]') ? form.querySelector('[name="nom"]').value : '';
    const email = form.querySelector('[name="email"]') ? form.querySelector('[name="email"]').value : '';
    const telefon = form.querySelector('[name="telefon"]') ? form.querySelector('[name="telefon"]').value : '';
    const area = form.querySelector('[name="area"]') ? form.querySelector('[name="area"]').value : '';
    const motivacio = form.querySelector('[name="motivacio"]') ? form.querySelector('[name="motivacio"]').value : '';
    const body = encodeURIComponent('Candidatura NexSocial\n\nNom: '+nom+'\nEmail: '+email+'\nTelèfon: '+telefon+'\nÀrea: '+area+'\n\nMotivació:\n'+motivacio);
    window.location.href = 'mailto:infonex@nexsocial.org?subject=Candidatura NexSocial&body='+body;
    ok.style.display='block';
    form.reset();
    return;
  }
  fetch(form.action, {method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}})
    .then(function(res){
      if(res.ok){ ok.style.display='block'; form.reset(); }
    });
}
function toggleSubnav(id){
  var el = document.getElementById(id);
  var arrow = document.getElementById(id+'-arrow');
  if(!el) return;
  var open = el.style.maxHeight && el.style.maxHeight !== '0px';
  el.style.maxHeight = open ? '0px' : '200px';
  if(arrow) arrow.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
}
function scrollToServei(area){
  var target = area === 'acomp'
    ? document.getElementById('servei-acomp-title')
    : document.getElementById('servei-gestio-title');
  if(target) setTimeout(function(){ target.scrollIntoView({behavior:'smooth', block:'center'}); }, 100);
}
function showProjPanel(id, btn){
  document.querySelectorAll('.proj-panel').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.proj-subnav-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  if(btn) btn.classList.add('active');
  // Amaga/mostra el banner i subnav segons el panel
  var hdr = document.getElementById('proj-page-header');
  var nav = document.getElementById('proj-subnav-bar');
  if (id === 'proj-intel') {
    if (hdr) hdr.style.display = 'none';
    if (nav) nav.style.display = 'none';
  } else {
    if (hdr) hdr.style.display = '';
    if (nav) nav.style.display = '';
  }
}

// DIAGNÒSTIC
function startDiag(){
  document.getElementById('diag-intro').style.display = 'none';
  document.getElementById('diag-main').style.display = 'block';
}
var diagStep = 0;
var diagScores = new Array(10).fill(0);

function selectOpt(el, stepIdx, score){
  var opts = document.querySelectorAll('#dstep-'+stepIdx+' .dopt');
  opts.forEach(function(o){ o.classList.remove('selected'); });
  el.classList.add('selected');
  diagScores[stepIdx] = score;
  var nextBtn = document.getElementById('diag-next');
  nextBtn.disabled = false;
  nextBtn.style.opacity = '1';
  nextBtn.textContent = stepIdx === 9 ? 'Veure resultat →' : 'Següent →';
}

function diagNav(dir){
  // Si estem a l'última pregunta i anem endavant → mostrar resultat
  if(dir === 1 && diagStep === 9){
    document.getElementById('dstep-'+diagStep).style.display = 'none';
    showDiagResult();
    return;
  }

  var newStep = diagStep + dir;
  if(newStep < 0 || newStep > 9) return;

  document.getElementById('dstep-'+diagStep).style.display = 'none';
  diagStep = newStep;
  document.getElementById('dstep-'+diagStep).style.display = 'block';

  // Progrés
  var pct = (diagStep / 10) * 100;
  document.getElementById('diag-pbar').style.width = pct + '%';
  document.getElementById('diag-ptxt').textContent = diagStep + ' / 10 preguntes';

  // Botons
  document.getElementById('diag-prev').style.display = diagStep > 0 ? 'block' : 'none';
  var nextBtn = document.getElementById('diag-next');
  nextBtn.disabled = diagScores[diagStep] === 0;
  nextBtn.style.opacity = diagScores[diagStep] === 0 ? '0.4' : '1';
  nextBtn.textContent = diagStep === 9 ? 'Veure resultat →' : 'Següent →';
}

function showDiagResult(){
  var total = diagScores.reduce(function(a,b){ return a+b; }, 0);
  document.getElementById('diag-questions').style.display = 'none';
  document.getElementById('diag-progress-wrap').style.display = 'none';
  document.getElementById('diag-results').style.display = 'block';
  
  var resIdx = 0;
  if(total <= 15) resIdx = 0;
  else if(total <= 25) resIdx = 1;
  else if(total <= 35) resIdx = 2;
  else resIdx = 3;
  
  document.getElementById('dres-'+resIdx).style.display = 'block';
  window.scrollTo(0,0);
}

function resetDiag(){
  // Tornar a la intro
  document.getElementById('diag-intro').style.display = 'block';
  document.getElementById('diag-main').style.display = 'none';
  diagStep = 0;
  diagScores = new Array(10).fill(0);
  for(var i=0;i<10;i++){
    document.getElementById('dstep-'+i).style.display = i===0 ? 'block' : 'none';
    var opts = document.querySelectorAll('#dstep-'+i+' .dopt');
    opts.forEach(function(o){ o.classList.remove('selected'); });
  }
  for(var j=0;j<4;j++){
    var r = document.getElementById('dres-'+j);
    if(r) r.style.display = 'none';
  }
  document.getElementById('diag-questions').style.display = 'block';
  document.getElementById('diag-progress-wrap').style.display = 'block';
  document.getElementById('diag-results').style.display = 'none';
  document.getElementById('diag-pbar').style.width = '0%';
  document.getElementById('diag-ptxt').textContent = '0 / 10 preguntes';
  document.getElementById('diag-prev').style.display = 'none';
  var nextBtn = document.getElementById('diag-next');
  nextBtn.disabled = true;
  nextBtn.style.opacity = '0.4';
  nextBtn.textContent = 'Següent →';
}
function showSection(id,el){
  if(document.body.classList.contains('home') === false) return;
  document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  var sec = document.getElementById(id);
  if(sec) sec.classList.add('active');
  if(el) el.classList.add('active');
  if(window.innerWidth<=768){
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
  }
  window.scrollTo(0,0);
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}


function switchTab(name, btn){
  document.querySelectorAll('.atab-content').forEach(t=>t.style.display='none');
  document.querySelectorAll('.atab').forEach(b=>{
    b.style.background='transparent';
    b.style.color='rgba(253,252,249,0.5)';
  });
  var tab = document.getElementById('tab-'+name);
  if(tab) tab.style.display='block';
  if(btn){
    btn.style.background='rgba(109,191,133,0.12)';
    btn.style.color='#fdfcf9';
  }
}

function updateById(id, val){
  var el = document.getElementById(id);
  if(el){ el.textContent = val; showDownloadBar(); }
}

function updateText(input, selector){
  var el = document.querySelector(selector);
  if(el){ el.textContent = input.value; showDownloadBar(); }
}

function updateNthTeamField(input, idx, fieldSelector){
  var cards = document.querySelectorAll('.team-card');
  if(cards[idx]){
    var el = cards[idx].querySelector(fieldSelector);
    if(el){ el.textContent = input.value; showDownloadBar(); }
  }
}

function updateNthText(input, selector, n){
  var els = document.querySelectorAll(selector);
  if(els[n]){ els[n].textContent = input.value; showDownloadBar(); }
}

function updateContact(field, val){
  showDownloadBar();
  if(field==='email'){
    document.querySelectorAll('a[href^="mailto"]').forEach(a=>a.href='mailto:'+val);
    document.querySelectorAll('.contact-email-text').forEach(el=>el.textContent=val);
  } else if(field==='phone'){
    document.querySelectorAll('a[href^="tel"]').forEach(a=>a.href='tel:'+val.replace(/\s/g,''));
    document.querySelectorAll('.contact-phone-text').forEach(el=>el.textContent=val);
  } else if(field==='web'){
    document.querySelectorAll('.contact-web-text').forEach(el=>el.textContent=val);
  } else if(field==='address'){
    document.querySelectorAll('.contact-address-text').forEach(el=>el.textContent=val);
  }
}

function showDownloadBar(){
  var bar = document.getElementById('download-bar');
  if(bar) bar.style.display='flex';
}

function downloadWeb(){
  var html = document.documentElement.outerHTML;
  var fn = 'nexsocial.html';
  try {
    if(window.location.protocol === 'file:'){
      var encoded = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      var a = document.createElement('a');
      a.href = encoded; a.download = fn;
      document.body.appendChild(a); a.click();
      setTimeout(function(){ document.body.removeChild(a); }, 500);
    } else {
      var blob = new Blob([html], {type:'text/html;charset=utf-8'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = fn;
      document.body.appendChild(a); a.click();
      setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
    }
  } catch(e){
    alert('Error en descarregar. Prova Ctrl+U per copiar el codi font.');
  }
}

function showHelp(){
  document.getElementById('help-modal').style.display='flex';
}
function hideHelp(){
  document.getElementById('help-modal').style.display='none';
}

function changePhoto(idx){
  var input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = function(e){
    var file = e.target.files[0]; if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      var url = ev.target.result;
      var photos = document.querySelectorAll('.photo-target');
      if(photos[idx]) photos[idx].src = url;
      var bgs = document.querySelectorAll('.bg-photo-target');
      if(bgs[idx]) bgs[idx].style.backgroundImage = 'url('+url+')';
      showDownloadBar();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function changeLogo(){
  var input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = function(e){
    var file = e.target.files[0]; if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      var url = ev.target.result;
      document.querySelectorAll('.sidebar-logo img, #topbar-logo-img, #footer-logo-img').forEach(img=>img.src=url);
      showDownloadBar();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}


// ── Modals legals ────────────────────────────────────────────
function openModal(id){ document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id){ document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
function closeModalOutside(e,id){ if(e.target===document.getElementById(id)) closeModal(id); }
document.addEventListener('keydown',function(e){ if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(function(m){ m.classList.remove('open'); document.body.style.overflow=''; }); });

// Injectar modals al DOM si no hi són
(function(){
  if(document.getElementById('modal-legal')) return;
  var div = document.createElement('div');
  div.innerHTML = `<div class="modal-overlay" id="modal-legal" onclick="closeModalOutside(event,'modal-legal')">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('modal-legal')">×</button>
    <span class="modal-tag">Informació legal</span>
    <h2>Avís Legal</h2>
    <p>En compliment de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE), s'informa dels següents aspectes:</p>

    <h3>Titular del lloc web</h3>
    <p><strong>Denominació social:</strong> NexSocial, Cooperativa d'Acompanyament Sociovital<br>
    <strong>Forma jurídica:</strong> Cooperativa de treball associat<br>
    <strong>Registre:</strong> Registre de Cooperatives de Catalunya (número pendent de registre)<br>
    <strong>Domicili social:</strong> Catalunya, Espanya<br>
    <strong>Correu electrònic:</strong> <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="563f38303938332e1638332e2539353f373a78392431">[email&#160;protected]</a><br>
    <strong>Web:</strong> www.nexsocial.org</p>

    <h3>Objecte i activitat</h3>
    <p>NexSocial és una cooperativa dedicada a l'acompanyament sociovital de persones, famílies i entitats, oferint serveis d'acompanyament social, emocional, terapèutic i de gestoria administrativa.</p>

    <h3>Propietat intel·lectual</h3>
    <p>Tots els continguts d'aquest lloc web —textos, imatges, logotips, dissenys i qualsevol altre element— són propietat de NexSocial o disposen de les llicències corresponents. Queda prohibida la seva reproducció, distribució o comunicació pública sense autorització expressa.</p>

    <h3>Responsabilitat</h3>
    <p>NexSocial no es fa responsable dels danys o perjudicis que puguin derivar-se de l'ús de la informació continguda en aquest lloc web ni dels errors o omissions que pugui contenir. Els continguts d'aquest web tenen caràcter informatiu i no substitueixen l'assessorament professional personalitzat.</p>

    <h3>Legislació aplicable</h3>
    <p>Les presents condicions es regeixen per la legislació espanyola i catalana vigent. Per a la resolució de qualsevol controvèrsia, les parts se sotmeten als jutjats i tribunals competents.</p>
  </div>
</div>

<!-- Modal Política de Privacitat -->
<div class="modal-overlay" id="modal-privacitat" onclick="closeModalOutside(event,'modal-privacitat')">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('modal-privacitat')">×</button>
    <span class="modal-tag">Protecció de dades</span>
    <h2>Política de Privacitat</h2>
    <p>En compliment del Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018 (LOPDGDD), l'informem sobre el tractament de les seves dades personals.</p>

    <h3>Responsable del tractament</h3>
    <p><strong>NexSocial, Cooperativa d'Acompanyament Sociovital</strong><br>
    Correu de contacte: <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="82ebece4edece7fac2ece7faf1ede1ebe3eeacedf0e5">[email&#160;protected]</a></p>

    <h3>Dades que tractem</h3>
    <p>Únicament tractem les dades que vostè ens facilita voluntàriament a través dels formularis de contacte del web: nom, correu electrònic, telèfon i el contingut del missatge. No recollim dades de manera automàtica més enllà de les estrictament necessàries per al funcionament tècnic del lloc web.</p>

    <h3>Finalitat i base legal</h3>
    <ul>
      <li><strong>Atendre la seva consulta o sol·licitud</strong> — base legal: consentiment de l'interessat (art. 6.1.a RGPD).</li>
      <li><strong>Gestionar la relació de servei</strong> — base legal: execució d'un contracte o mesures precontractuals (art. 6.1.b RGPD).</li>
    </ul>

    <h3>Conservació de les dades</h3>
    <p>Les dades es conserven durant el temps necessari per atendre la seva sol·licitud i, posteriorment, durant els terminis legalment exigits. Un cop finalitzada la relació, les dades es bloquejen i s'eliminen.</p>

    <h3>Destinataris</h3>
    <p>No cedim les seves dades a tercers, excepte per obligació legal. El servei de correu electrònic pot estar allotjat en proveïdors externs amb les garanties adequades.</p>

    <h3>Els seus drets</h3>
    <p>Pot exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat enviant un correu a <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="5831363e37363d2018363d202b373b31393476372a3f">[email&#160;protected]</a>. Si considera que els seus drets no han estat atesos, pot presentar una reclamació davant l'Agència Española de Protección de Datos (www.aepd.es).</p>
  </div>
</div>

<!-- Modal Política de Cookies -->
<div class="modal-overlay" id="modal-cookies" onclick="closeModalOutside(event,'modal-cookies')">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('modal-cookies')">×</button>
    <span class="modal-tag">Cookies</span>
    <h2>Política de Cookies</h2>
    <p>Aquest lloc web utilitza únicament cookies tècniques estrictament necessàries per al seu funcionament. No s'utilitzen cookies d'analítica, publicitat ni de tercers.</p>

    <h3>Què és una cookie?</h3>
    <p>Una cookie és un petit fitxer de text que un lloc web emmagatzema al navegador de l'usuari quan el visita. Les cookies permeten que el lloc web recordi les accions i preferències de l'usuari durant un temps determinat.</p>

    <h3>Cookies que utilitzem</h3>
    <ul>
      <li><strong>Cookies de sessió tècniques:</strong> necessàries per mantenir la sessió activa mentre es navega pel web (per exemple, per mantenir l'accés a àrees privades com NexlicitIA). S'eliminen en tancar el navegador.</li>
      <li><strong>Preferències locals:</strong> emmagatzemament local al navegador (localStorage) per guardar preferències de navegació. No s'envien a cap servidor extern.</li>
    </ul>

    <h3>Exemció de consentiment</h3>
    <p>Les cookies tècniques estan exemptes del requisit de consentiment previ, d'acord amb l'article 22.2 de la Llei 34/2002 (LSSI-CE) i les directrius de l'AEPD, ja que són estrictament necessàries per a la prestació del servei sol·licitat per l'usuari.</p>

    <h3>Com gestionar les cookies</h3>
    <p>Pot configurar o desactivar les cookies des de la configuració del seu navegador. Tingui en compte que desactivar les cookies tècniques pot afectar el funcionament del lloc web. Trobarà instruccions per a cada navegador a:</p>
    <ul>
      <li>Chrome: Configuració → Privadesa i seguretat → Cookies</li>
      <li>Firefox: Opcions → Privadesa i seguretat</li>
      <li>Safari: Preferències → Privadesa</li>
      <li>Edge: Configuració → Cookies i permisos de lloc</li>
    </ul>

    <h3>Actualitzacions</h3>
    <p>NexSocial es reserva el dret d'actualitzar aquesta política si incorpora noves funcionalitats que requereixin l'ús de cookies addicionals. En tal cas, s'informarà l'usuari prèviament i s'obtindrà el consentiment si fos necessari.</p>
  </div>
</div>

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script>`;
  document.body.appendChild(div);
})();


// ── Senefa fulles sidebar ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function(){
  var sidebar = document.getElementById('sidebar');
  if(!sidebar || sidebar.querySelector('.sidebar-leaves')) return;
  sidebar.style.position = 'relative';
  sidebar.style.overflow = 'hidden';
  var tmp = document.createElement('div');
  tmp.innerHTML = `<div class="sidebar-leaves" aria-hidden="true"><svg width="260" height="100%" viewBox="0 0 260 1100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"><style>@keyframes lfa0{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(3.5px,-5px) rotate(1.3deg)}62%{transform:translate(-2.5px,-2.5px) rotate(-0.8deg)}}.lf0{animation:lfa0 5.8s ease-in-out infinite;animation-delay:0s}@keyframes lfa1{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(4px,-4px) rotate(-1.0deg)}62%{transform:translate(-2px,-2.0px) rotate(0.7deg)}}.lf1{animation:lfa1 6.4s ease-in-out infinite;animation-delay:-1.2s}@keyframes lfa2{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(2.5px,-5.5px) rotate(1.6deg)}62%{transform:translate(-3.2px,-2.8px) rotate(-1.0deg)}}.lf2{animation:lfa2 7.1s ease-in-out infinite;animation-delay:-2.8s}@keyframes lfa3{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(3.8px,-4.5px) rotate(-1.2deg)}62%{transform:translate(-2px,-2.2px) rotate(0.8deg)}}.lf3{animation:lfa3 5.5s ease-in-out infinite;animation-delay:-0.5s}@keyframes lfa4{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(4.5px,-6px) rotate(0.9deg)}62%{transform:translate(-1.5px,-3.0px) rotate(-0.6deg)}}.lf4{animation:lfa4 6.9s ease-in-out infinite;animation-delay:-3.4s}@keyframes lfa5{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(2px,-3.8px) rotate(-1.5deg)}62%{transform:translate(-3.5px,-1.9px) rotate(1.0deg)}}.lf5{animation:lfa5 7.6s ease-in-out infinite;animation-delay:-1.8s}@keyframes lfa6{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(3.2px,-5.2px) rotate(1.1deg)}62%{transform:translate(-2.2px,-2.6px) rotate(-0.7deg)}}.lf6{animation:lfa6 6.2s ease-in-out infinite;animation-delay:-4.1s}@keyframes lfa7{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(4.2px,-3.5px) rotate(-0.8deg)}62%{transform:translate(-1.8px,-1.8px) rotate(0.5deg)}}.lf7{animation:lfa7 5.9s ease-in-out infinite;animation-delay:-0.9s}@keyframes lfa8{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(2.8px,-4.8px) rotate(1.4deg)}62%{transform:translate(-2.8px,-2.4px) rotate(-0.9deg)}}.lf8{animation:lfa8 7.3s ease-in-out infinite;animation-delay:-2.3s}@keyframes lfa9{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(3.6px,-5.5px) rotate(-1.1deg)}62%{transform:translate(-2.2px,-2.8px) rotate(0.7deg)}}.lf9{animation:lfa9 6.7s ease-in-out infinite;animation-delay:-3.9s}@keyframes lfa10{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(2.4px,-4px) rotate(1.0deg)}62%{transform:translate(-3px,-2.0px) rotate(-0.7deg)}}.lf10{animation:lfa10 5.6s ease-in-out infinite;animation-delay:-1.5s}@keyframes lfa11{0%,100%{transform:translate(0,150.0) rotate(0deg)}28%{transform:translate(4px,-5px) rotate(-1.4deg)}62%{transform:translate(-1.8px,-2.5px) rotate(0.9deg)}}.lf11{animation:lfa11 7.8s ease-in-out infinite;animation-delay:-4.7s}@keyframes logo_bounce{0%{transform:translate(0,150.0) rotate(0deg)}25%{transform:translate(8px,-4px) rotate(1.2deg)}50%{transform:translate(-6px,-3px) rotate(-1deg)}75%{transform:translate(5px,3px) rotate(0.8deg)}100%{transform:translate(0,150.0) rotate(0deg)}}.lf_logo{animation:logo_bounce 12s ease-in-out infinite;animation-delay:-2s}</style>`;
  var el = tmp.firstElementChild;
  if(el){
    el.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
    sidebar.insertBefore(el, sidebar.firstChild);
    // Assegurar que la resta de fills estan per sobre
    Array.from(sidebar.children).forEach(function(c){
      if(!c.classList.contains('sidebar-leaves')) c.style.position = 'relative', c.style.zIndex = '1';
    });
  }
});
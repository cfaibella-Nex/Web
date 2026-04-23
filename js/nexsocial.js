
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
async function publishToGitHub(){
  var token = localStorage.getItem('gh_token') || '';
  if(!token){
    token = prompt('Enganxa el teu GitHub Token (ghp_...):\n\nEl pots crear a: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)\n\nEs guardarà al navegador per no haver-lo de tornar a posar.');
    if(!token) return;
    localStorage.setItem('gh_token', token.trim());
  }
  var btn = document.querySelector('[onclick="publishToGitHub()"]');
  var orig = btn.textContent;
  btn.textContent = '⏳ Publicant...';
  btn.disabled = true;
  try {
    var html = document.documentElement.outerHTML;
    var content = btoa(unescape(encodeURIComponent(html)));
    var owner = 'cfaibella-Nex';
    var repo = 'WEB';
    var file = 'index.html';
    var branch = 'main';
    // Obtenir SHA actual
    var shaRes = await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+file+'?ref='+branch, {
      headers:{'Authorization':'token '+token.trim(), 'Accept':'application/vnd.github.v3+json'}
    });
    var shaData = await shaRes.json();
    var sha = shaData.sha || '';
    // Pujar fitxer
    var putRes = await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+file, {
      method:'PUT',
      headers:{'Authorization':'token '+token.trim(), 'Accept':'application/vnd.github.v3+json', 'Content-Type':'application/json'},
      body: JSON.stringify({
        message: 'Actualització web des del panell admin — ' + new Date().toLocaleString('ca'),
        content: content,
        sha: sha,
        branch: branch
      })
    });
    if(putRes.ok){
      btn.textContent = '✅ Publicat!';
      btn.style.background = '#0d7040';
      setTimeout(()=>{ btn.textContent=orig; btn.style.background='#6dbf85'; btn.disabled=false; }, 4000);
    } else {
      var err = await putRes.json();
      if(err.message && err.message.includes('Bad credentials')){
        localStorage.removeItem('gh_token');
        alert('Token incorrecte o caducat. Torna-ho a provar amb un token nou.');
      } else {
        alert('Error: ' + (err.message || putRes.status));
      }
      btn.textContent = orig; btn.disabled = false;
    }
  } catch(e){
    alert('Error de connexió: ' + e.message);
    btn.textContent = orig; btn.disabled = false;
  }
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

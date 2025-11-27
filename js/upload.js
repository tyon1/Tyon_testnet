/* upload.js — full client-side demo workflow */
const fileInput = document.getElementById('fileInput');
const fileSelectBtn = document.getElementById('fileSelectBtn');
const dropzone = document.getElementById('dropzone');
const fileMeta = document.getElementById('fileMeta');
const pageMeta = document.getElementById('pageMeta');
const pageCountSpan = document.getElementById('pageCount');
const generateBtn = document.getElementById('generateBtn');
const memoInput = document.getElementById('memo');

const nameInput = document.getElementById('name');
const companyInput = document.getElementById('company');
const enterBtn = document.getElementById('enterBtn');

/* Tooltips */
const tips = {
  testnet: "Alpha Protocol Testnet simulates Tyon’s cryptographic proof flow: generate a file hash, timestamp, and evidence record. No file storage; only proofs.",
  help: "Files parsed client-side. Only hashed metadata sent to Testnet for demonstration."
};
const popoverRoot = document.getElementById('popoverRoot');
document.addEventListener('click', e => {
  const t = e.target.closest('[data-tip]');
  if(t){ showPopover(t, tips[t.dataset.tip]); e.stopPropagation(); return; }
  removePopover();
});
function showPopover(anchor, html){
  removePopover();
  const rect = anchor.getBoundingClientRect();
  const p = document.createElement('div');
  p.className = 'popover card';
  p.style.top = (window.scrollY + rect.bottom + 10) + 'px';
  p.style.left = Math.max(16, rect.left) + 'px';
  p.innerHTML = html;
  popoverRoot.appendChild(p);
  popoverRoot.setAttribute('aria-hidden','false');
}
function removePopover(){ popoverRoot.innerHTML=''; popoverRoot.setAttribute('aria-hidden','true'); }

/* Entry card validation */
function validateEntry(){ enterBtn.disabled = !nameInput.value.trim(); }
nameInput.addEventListener('input', validateEntry);
enterBtn.addEventListener('click', ()=>{
  document.getElementById('dropzone').scrollIntoView({behavior:'smooth', block:'center'});
});

/* File handling */
fileSelectBtn.addEventListener('click', ()=>fileInput.click());
dropzone.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', e=> handleFile(e.target.files[0]));
['dragover','dragenter'].forEach(ev=> dropzone.addEventListener(ev, e=> { e.preventDefault(); dropzone.style.opacity=0.95; }));
['dragleave','drop'].forEach(ev=> dropzone.addEventListener(ev, e=> { e.preventDefault(); dropzone.style.opacity=1; }));
dropzone.addEventListener('drop', e=> { const f = e.dataTransfer.files[0]; if(f) handleFile(f); });

async function handleFile(file){
  fileMeta.textContent = file.name;
  pageMeta.hidden = true;
  pageCountSpan.textContent = '0';

  const isPDF = file.type==='application/pdf'||/\.pdf$/i.test(file.name);
  if(isPDF && window.pdfjsLib){
    try{
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({data:ab}).promise;
      pageCountSpan.textContent = pdf.numPages||0;
      pageMeta.hidden=false;
    }catch(e){ pageMeta.hidden=true; }
  } else if(file.type.startsWith('image/')){
    pageCountSpan.textContent='1'; pageMeta.hidden=false;
  }
  generateBtn.disabled=false;
}

/* Generate Proof (simulated) */
generateBtn.addEventListener('click', async ()=>{
  if(generateBtn.disabled) return;
  generateBtn.disabled=true;
  const originalText = generateBtn.textContent;
  generateBtn.textContent='Generating...';
  try{
    const f=fileInput.files[0]; if(!f){ alert('Select a file first.'); generateBtn.disabled=false; generateBtn.textContent=originalText; return; }
    const ab = await f.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', ab);
    const hashHex = [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
    sessionStorage.setItem('selectedFile', f.name);
    sessionStorage.setItem('memo', memoInput.value);
    sessionStorage.setItem('hash', hashHex);
    sessionStorage.setItem('pages', pageCountSpan.textContent);
    window.location.href='results.html';
  }catch(err){ console.error(err); alert('Error generating proof.'); } finally{ generateBtn.disabled=false; generateBtn.textContent=originalText; }
});

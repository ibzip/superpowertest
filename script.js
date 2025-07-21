/* =========================================================
   Mobile‑safe scroll animation
   ========================================================= */
const FRAMES  = 60;           // 0001‑0060
const SPAN    = 3_000;        // px mapped to sequence
const DPR     = devicePixelRatio || 1;

const cvs   = document.getElementById('seq');
const ctx   = cvs.getContext('2d');
const hero  = document.querySelector('.hero');
const pct   = document.getElementById('percent');
const loadBox = document.getElementById('loading');
const overlay = document.querySelector('.overlay');

/* ---------- viewport height fix (address‑bar safe) ------------- */
function setVH(){
  const cssPx = Math.max(innerHeight, screen.height);
  document.documentElement.style.setProperty('--vh', `${cssPx}px`);
}
setVH();
addEventListener('resize', setVH);           // orientation change

/* ---------- lock canvas size ----------------------------------- */
function lockSize(){
  cvs.width  = innerWidth  * DPR;
  cvs.height = Math.max(innerHeight, screen.height) * DPR;
}
lockSize();
addEventListener('resize', lockSize);

/* ---------- preload all frames --------------------------------- */
const imgs = new Array(FRAMES);
let loaded = 0;

for(let i=0;i<FRAMES;i++){
  const img = new Image();
  img.src   = `images/${String(i+1).padStart(4,'0')}.png`;
  img.onload = ()=>{
    if (++loaded === FRAMES) start();
    pct.textContent = Math.round(loaded/FRAMES*100);
    if (i === 0) { drawCover(img); }         // show first frame ASAP
  };
  imgs[i] = img;
}

/* ---------- cover draw helper ---------------------------------- */
function drawCover(img){
  const cssW = cvs.width  / DPR;
  const cssH = cvs.height / DPR;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cssW/iw, cssH/ih);      // cover
  const dw = iw*scale, dh = ih*scale;
  const dx = (cssW - dw)/2, dy = (cssH - dh)/2;

  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* ---------- once every frame is cached ------------------------- */
function start(){
  loadBox.style.display = 'none';
  overlay.style.opacity = .45;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let last = 0, ticking = false;
  addEventListener('scroll', ()=>{
    if (ticking) return;
    requestAnimationFrame(()=>{
      const y   = Math.min(scrollY, SPAN);
      const f   = Math.min(FRAMES-1,
                     Math.round(y / SPAN * (FRAMES-1)));
      if (f !== last){ drawCover(imgs[f]); last = f; }
      ticking = false;
    });
    ticking = true;
  }, {passive:true});
}

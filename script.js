/* ==========================================================
   Scroll‑driven hero — full preload, aspect‑ratio cover,
   immune to address‑bar collapse on mobile browsers
   ========================================================== */
const FRAMES  = 60;          // 0001…0060
const SPAN_PX = 3_000;       // scroll span in px
const DPR     = devicePixelRatio || 1;

/* ---------- lock canvas size to largest viewport ------------ */
const cvs  = document.getElementById('seq');
const ctx  = cvs.getContext('2d');
const hero = document.querySelector('.hero');

function lockSize(){
  const w = innerWidth;
  const h = Math.max(innerHeight, screen.height);    // avoids shrink
  hero.style.height = `${h}px`;
  cvs.width  = w * DPR;
  cvs.height = h * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
lockSize();
/* Only resize on orientation change (width change) */
addEventListener('resize', ()=>{
  if (innerWidth !== cvs.width / DPR) lockSize();
});

/* ---------- preload every PNG -------------------------------- */
const imgs   = new Array(FRAMES);
let loaded   = 0;
const pctBox = document.getElementById('percent');
const loader = document.getElementById('loading');
const overlay= document.querySelector('.overlay');

for(let i=0;i<FRAMES;i++){
  const im = new Image();
  im.src   = `images/${String(i+1).padStart(4,'0')}.png`;
  im.onload = ()=>{
    loaded++;
    pctBox.textContent = Math.round(loaded/FRAMES*100);
    if (loaded === FRAMES) init();
  };
  imgs[i] = im;
}

/* ---------- cover‑style draw helper -------------------------- */
function drawCover(img){
  const cw = cvs.width  / DPR;
  const ch = cvs.height / DPR;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(cw/iw, ch/ih);   // cover
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw)/2;
  const dy = (ch - dh)/2;

  ctx.clearRect(0,0,cw,ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* ---------- start after preload ------------------------------ */
function init(){
  loader.style.display = 'none';
  overlay.style.opacity = .45;
  drawCover(imgs[0]);                  // first frame

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let last = 0, ticking = false;

  addEventListener('scroll', ()=>{
    if (ticking) return;
    requestAnimationFrame(()=>{
      const y   = Math.min(scrollY, SPAN_PX);
      const pct = y / SPAN_PX;
      const f   = Math.min(FRAMES-1, Math.round(pct*(FRAMES-1)));

      if (f !== last){ drawCover(imgs[f]); last = f; }
      ticking = false;
    });
    ticking = true;
  }, {passive:true});
}

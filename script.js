/* =========================================================
   Mobile‑optimized scroll‑sequence hero
   ========================================================= */
const FRAMES    = 60;           // 0001‑0060
const SCROLL_SPAN = 3_000;      // px mapped across sequence
const DPR       = window.devicePixelRatio || 1;

const hero   = document.getElementById('hero');
const cvs    = document.getElementById('seq');
const ctx    = cvs.getContext('2d');
const loader = document.getElementById('loading');
const pctBox = document.getElementById('percent');
const overlay= document.querySelector('.overlay');

/* ---------- 1. lock hero & canvas size once -------------------- */
function setHeroSize(){
  // full device pixel height (incl. address bar)
  const fullH = Math.max(window.innerHeight, window.screen.height);
  document.documentElement.style.setProperty('--hero-h', `${fullH}px`);

  cvs.style.width  = '100%';            // CSS pixels
  cvs.style.height = '100%';
  cvs.width  = window.innerWidth * DPR; // bitmap
  cvs.height = fullH * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
setHeroSize();

/* orientation change = when width alters */
let lastW = window.innerWidth;
addEventListener('resize', ()=>{
  if (window.innerWidth !== lastW){
    lastW = window.innerWidth;
    setHeroSize();
  }
});

/* ---------- 2. pre‑load all frames ----------------------------- */
const imgs   = new Array(FRAMES);
let loaded   = 0;

for(let i=0;i<FRAMES;i++){
  const im = new Image();
  im.src   = `images/${String(i+1).padStart(4,'0')}.png`;
  im.onload = ()=>{
    if (++loaded === FRAMES) initScroll();
    if (i === 0) { drawCover(im); overlay.style.opacity = .45; } // first frame asap
    pctBox.textContent = Math.round(loaded/FRAMES*100);
  };
  imgs[i] = im;
}

/* ---------- 3. draw helper (cover algorithm) ------------------ */
function drawCover(img){
  const cssW = cvs.width  / DPR;
  const cssH = cvs.height / DPR;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cssW/iw, cssH/ih);
  const dw = iw * scale, dh = ih * scale;
  const dx = (cssW - dw)/2, dy = (cssH - dh)/2;

  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* ---------- 4. after preload: enable scroll animation --------- */
function initScroll(){
  loader.style.display = 'none';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let last = 0, ticking = false;

  addEventListener('scroll', ()=>{
    if (ticking) return;
    requestAnimationFrame(()=>{
      const y   = Math.min(window.scrollY, SCROLL_SPAN);
      const pct = y / SCROLL_SPAN;
      const f   = Math.min(FRAMES-1, Math.round(pct * (FRAMES-1)));

      if (f !== last){ drawCover(imgs[f]); last = f; }
      ticking = false;
    });
    ticking = true;
  }, {passive:true});
}

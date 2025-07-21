/* =======================================================
   Scroll‑driven hero with full upfront pre‑load
   ======================================================= */
const FRAMES       = 60;         // 0001 → 0060
const SCROLL_SPAN  = 3_000;      // px of scroll mapped to whole seq
const dpr          = window.devicePixelRatio || 1;

/* ---------- canvas setup ---------- */
const cvs   = document.getElementById('seq');
const ctx   = cvs.getContext('2d');

function resize(){
  cvs.width  = innerWidth  * dpr;
  cvs.height = innerHeight * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
resize();
addEventListener('resize', resize);

/* ---------- preload all frames ---------- */
const imgs = new Array(FRAMES);
let loaded = 0;
const percent = document.getElementById('percent');
const overlay = document.querySelector('.overlay');
const loader  = document.getElementById('loading');

for (let i=0; i<FRAMES; i++){
  const img = new Image();
  img.src   = `images/${String(i+1).padStart(4,'0')}.png`;
  img.onload = () => {
    loaded++;
    percent.textContent = Math.round(loaded/FRAMES*100);
    if (loaded === FRAMES) init();             // all done
  };
  imgs[i] = img;
}

/* ---------- after preload ---------- */
function draw(idx){
  const im = imgs[idx];
  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.drawImage(im, 0, 0, cvs.width/dpr, cvs.height/dpr);
}

function init(){
  /* remove loading screen */
  loader.style.display = 'none';
  overlay.style.opacity = .45;

  draw(0);                                     // first frame

  /* reduced‑motion users see only frame 0 */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* scroll‑to‑frame */
  let last = 0, ticking = false;

  function onScroll(){
    if (ticking) return;
    requestAnimationFrame(()=>{
      const y   = Math.min(scrollY, SCROLL_SPAN);
      const pct = y / SCROLL_SPAN;
      const f   = Math.min(FRAMES-1, Math.round(pct*(FRAMES-1)));

      if (f !== last){ draw(f); last = f; }
      ticking = false;
    });
    ticking = true;
  }
  addEventListener('scroll', onScroll, {passive:true});
}


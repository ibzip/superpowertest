/* ---------------- image‑sequence scroll animation ------------------- */
const hero      = document.getElementById('hero');
const FRAMES    = 60;          // total images (0001‑0060)
const SCROLL_SPAN = 3000;      // px of scroll that maps to full sequence

function setFrame(index){
  const num = String(index).padStart(4,'0');           // "0001"
  hero.style.backgroundImage = `url(images/${num}.png)`;
}

function onScroll(){
  // clamp scrollTop to the defined span
  const y = Math.min(window.scrollY, SCROLL_SPAN);
  // progress 0‑1
  const progress = y / SCROLL_SPAN;
  // frame 1‑60
  const frame = 1 + Math.round(progress * (FRAMES - 1));
  setFrame(frame);
}

// initial frame & listener
setFrame(1);
window.addEventListener('scroll', onScroll);


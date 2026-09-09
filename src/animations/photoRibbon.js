/** Horizontal wheel scrolling and the original perspective effect. */
export function startPhotoRibbon({ reducedMotion = false } = {}) {
  const motion = {};
  const box = document.getElementById('nv-worn-scroll');
  if (!box) return () => {};
  const paint = () => {
    if (reducedMotion) return;
    const r = box.getBoundingClientRect();
    const mid = r.left + r.width / 2;
    box.querySelectorAll('[data-worn]').forEach((el) => {
      const f = el.getBoundingClientRect();
      const t = Math.max(
        -1,
        Math.min(1, (f.left + f.width / 2 - mid) / (r.width / 2 || 1)),
      );
      const a = Math.abs(t);
      el.style.transform =
        'translate3d(0,' +
        (a * 22).toFixed(1) +
        'px,0) rotate(' +
        (parseFloat(el.getAttribute('data-rot')) + t * 1.6).toFixed(2) +
        'deg) scale(' +
        (1 - a * 0.07).toFixed(3) +
        ')';
      el.style.opacity = (1 - a * 0.3).toFixed(2);
    });
  };
  motion.onWornScroll = () => {
    if (!motion.wornRaf)
      motion.wornRaf = requestAnimationFrame(() => {
        motion.wornRaf = null;
        paint();
      });
  };
  box.addEventListener('scroll', motion.onWornScroll, { passive: true });
  motion.onWornWheel = (e) => {
    const max = box.scrollWidth - box.clientWidth;
    if (max <= 1) return;
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const next = box.scrollLeft + d;
    if ((d > 0 && box.scrollLeft < max - 1) || (d < 0 && box.scrollLeft > 1)) {
      e.preventDefault();
      box.scrollLeft = Math.max(0, Math.min(max, next));
    }
  };
  box.addEventListener('wheel', motion.onWornWheel, { passive: false });
  paint();
  window.addEventListener('resize', motion.onWornScroll);
  return () => {
    box.removeEventListener('scroll', motion.onWornScroll);
    box.removeEventListener('wheel', motion.onWornWheel);
    window.removeEventListener('resize', motion.onWornScroll);
    cancelAnimationFrame(motion.wornRaf);
  };
}

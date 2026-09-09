/** Original collision physics and timing, with an explicit teardown. */
export function startFloatingShapes() {
  const motion = {};

  const layer = document.getElementById('nv-hero-shapes');
  if (!layer) return () => {};
  const els = layer.querySelectorAll('[data-nv-float]');
  if (!els.length) return () => {};
  const nodes = [];
  els.forEach((el) =>
    nodes.push({
      el: el,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      a: 0,
      va: 0,
      rot: parseFloat(el.getAttribute('data-rot')) || 0,
    }),
  );
  motion.pointer = { x: -9999, y: -9999 };
  motion.onFloat = (e) => {
    motion.pointer.x = e.clientX;
    motion.pointer.y = e.clientY;
  };
  window.addEventListener('mousemove', motion.onFloat, { passive: true });

  const keepOut = () => {
    const box = layer.getBoundingClientRect();
    return Array.from(document.querySelectorAll('[data-nv-keepout]')).map(
      (el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - box.left - 14,
          y: r.top - box.top - 14,
          w: r.width + 28,
          h: r.height + 28,
        };
      },
    );
  };

  const tick = () => {
    const box = layer.getBoundingClientRect();
    const zones = keepOut();
    const mx = motion.pointer.x - box.left,
      my = motion.pointer.y - box.top;
    const base = nodes.map((n) => ({
      cx: n.el.offsetLeft + n.el.offsetWidth / 2 + n.x,
      cy: n.el.offsetTop + n.el.offsetHeight / 2 + n.y,
      r: n.el.offsetWidth / 2,
    }));
    nodes.forEach((n, i) => {
      const b = base[i];
      let dx = b.cx - mx,
        dy = b.cy - my;
      let d = Math.hypot(dx, dy) || 1;
      const reach = b.r + 16;
      if (d < reach) {
        const f = (1 - d / reach) * 1.15;
        n.vx += (dx / d) * f;
        n.vy += (dy / d) * f;
        n.va += (dx > 0 ? 1 : -1) * f * 0.25;
      }
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const o = base[j];
        const ox = b.cx - o.cx,
          oy = b.cy - o.cy;
        const od = Math.hypot(ox, oy) || 1;
        const min = b.r + o.r + 14;
        if (od < min) {
          const f = (1 - od / min) * 0.9;
          n.vx += (ox / od) * f;
          n.vy += (oy / od) * f;
        }
      }
      zones.forEach((z) => {
        const zx = z.x + z.w / 2,
          zy = z.y + z.h / 2;
        const ox = Math.abs(b.cx - zx) - (z.w / 2 + b.r);
        const oy = Math.abs(b.cy - zy) - (z.h / 2 + b.r);
        if (ox < 0 && oy < 0) {
          if (ox > oy) {
            n.vx += (b.cx > zx ? 1 : -1) * Math.min(3, -ox) * 0.35;
          } else {
            n.vy += (b.cy > zy ? 1 : -1) * Math.min(3, -oy) * 0.35;
          }
        }
      });
      const pad = b.r + 6;
      if (b.cx < pad) n.vx += (pad - b.cx) * 0.05;
      if (b.cx > box.width - pad) n.vx -= (b.cx - (box.width - pad)) * 0.05;
      if (b.cy < pad) n.vy += (pad - b.cy) * 0.05;
      if (b.cy > box.height - pad) n.vy -= (b.cy - (box.height - pad)) * 0.05;
      n.va += -n.a * 0.004;
      n.vx *= 0.987;
      n.vy *= 0.987;
      n.va *= 0.97;
      n.x += n.vx;
      n.y += n.vy;
      n.a += n.va;
      n.el.style.transform =
        'translate3d(' +
        n.x.toFixed(2) +
        'px,' +
        n.y.toFixed(2) +
        'px,0) rotate(' +
        (n.rot + n.a).toFixed(2) +
        'deg)';
    });
    motion.raf = requestAnimationFrame(tick);
  };
  tick();
  return () => {
    cancelAnimationFrame(motion.raf);
    window.removeEventListener('mousemove', motion.onFloat);
  };
}

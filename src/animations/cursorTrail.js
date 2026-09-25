export function startCursorTrail({ reducedMotion = false } = {}) {
  const cursor = document.getElementById('nv-cursor');
  const layer = document.getElementById('nv-seeds');
  if (!cursor || !layer) return () => {};
  const colors = ['#ADECF2', '#C75267', '#F5AFAF', '#777C3C', '#FFC132'];
  const shapes = ['nv-mask-flower', 'nv-mask-bird', 'nv-mask-horse'];
  let last = 0;
  const timers = new Set();
  const move = (e) => {
    cursor.style.transform = `translate3d(${e.clientX - 8}px,${e.clientY - 14}px,0)`;
    cursor.style.opacity = '1';
    const now = performance.now();
    if (reducedMotion || now - last < 110) return;
    last = now;
    const seed = document.createElement('span');
    seed.className =
      'nv-mask ' + shapes[Math.floor(Math.random() * shapes.length)];
    const size = 8 + Math.random() * 8;
    seed.style.cssText = `position:absolute;left:${e.clientX + Math.random() * 16 - 8}px;top:${e.clientY + Math.random() * 12 - 4}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};animation:nv-seed 1.1s cubic-bezier(.22,.61,.36,1) forwards`;
    layer.appendChild(seed);
    const timer = setTimeout(() => {
      seed.remove();
      timers.delete(timer);
    }, 1150);
    timers.add(timer);
  };
  const leave = () => {
    cursor.style.opacity = '0';
  };
  window.addEventListener('mousemove', move, { passive: true });
  document.addEventListener('mouseleave', leave);
  return () => {
    window.removeEventListener('mousemove', move);
    document.removeEventListener('mouseleave', leave);
    timers.forEach(clearTimeout);
    layer.replaceChildren();
    leave();
  };
}

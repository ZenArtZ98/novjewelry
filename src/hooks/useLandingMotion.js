import { useEffect } from 'react';
import { startFloatingShapes } from '../animations/floatingShapes';
import { startPhotoRibbon } from '../animations/photoRibbon';
import { startCursorTrail } from '../animations/cursorTrail';

export function useLandingMotion(setState) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stopEffects = () => {};
    const startEffects = () => {
      stopEffects();
      const stops = [
        startPhotoRibbon({ reducedMotion: preference.matches }),
        startCursorTrail({ reducedMotion: preference.matches }),
      ];
      if (!preference.matches) stops.push(startFloatingShapes());
      stopEffects = () => stops.forEach((stop) => stop());
    };
    startEffects();
    preference.addEventListener('change', startEffects);

    let lastStuck, lastDark, frame;
    const updateScroll = () => {
      frame = null;
      const hero = document.getElementById('hero');
      const gate = Math.max(
        320,
        (hero?.offsetHeight || window.innerHeight) - 90,
      );
      const stuck = window.scrollY > gate;
      const darkBar = ['hero', 'nv-marquee', 'final'].some((id) => {
        const bounds = document.getElementById(id)?.getBoundingClientRect();
        return bounds && bounds.top <= 30 && bounds.bottom > 30;
      });
      if (stuck !== lastStuck || darkBar !== lastDark) {
        lastStuck = stuck;
        lastDark = darkBar;
        setState({ stuck, darkBar });
      }
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const stem = document.getElementById('nv-stem');
      if (stem)
        stem.style.height =
          (total > 0 ? Math.min(1, window.scrollY / total) : 0) *
            (window.innerHeight - 80) +
          'px';
    };
    const scheduleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateScroll);
    };
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll);
    updateScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.style.opacity = '1';
          target.style.transform = 'none';
          observer.unobserve(target);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!preference.matches)
      revealElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        const delay = (i % 3) * 70;
        el.style.transition = `opacity .6s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .6s cubic-bezier(.22,.61,.36,1) ${delay}ms`;
        observer.observe(el);
      });
    const showReveals = () => {
      if (!preference.matches) return;
      observer.disconnect();
      revealElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };
    preference.addEventListener('change', showReveals);
    return () => {
      stopEffects();
      observer.disconnect();
      preference.removeEventListener('change', startEffects);
      preference.removeEventListener('change', showReveals);
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', scheduleScroll);
      cancelAnimationFrame(frame);
    };
  }, [setState]);
}

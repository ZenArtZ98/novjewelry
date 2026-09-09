import { useCallback, useEffect, useReducer, useRef } from 'react';
import { PRODUCTS, PRODUCT_IMAGES, PRODUCT_KINDS } from '../data/products';
import { HERO_CARDS, HERO_FLOATS } from '../data/hero';
import { MATERIAL_SAMPLES } from '../data/materials';
import { STORY_NOTES, PROCESS_STEPS } from '../data/story';
import { GALLERY_PHOTOS } from '../data/gallery';
import { FAQ_ITEMS } from '../data/faq';
const initialState = {
  cut: 0,
  shape: null,
  hover: null,
  open: null,
  note: null,
  nx: 0,
  ny: 0,
  found: null,
  faq: 0,
  stuck: false,
  darkBar: true,
};
const mergeState = (state, patch) => ({ ...state, ...patch });

export function useLandingState({ herbariumTilt = true } = {}) {
  const [state, setState] = useReducer(mergeState, initialState);
  const foundTimer = useRef();
  useEffect(() => () => clearTimeout(foundTimer.current), []);
  const jump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - 110,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
    setState({ found: id });
    clearTimeout(foundTimer.current);
    foundTimer.current = setTimeout(() => setState({ found: null }), 1500);
  }, []);
  const values = getLandingValues(state, setState, jump, herbariumTilt);
  return { state, setState, values };
}

function getLandingValues(state, setState, jump, herbariumTilt) {
  const s = state;
  const tilt = herbariumTilt !== false;
  const cut = MATERIAL_SAMPLES[s.cut];
  const list = s.shape ? PRODUCTS.filter((p) => p.shape === s.shape) : PRODUCTS;
  const op = s.open ? PRODUCTS.find((p) => p.id === s.open) : null;
  const note = s.note ? STORY_NOTES[s.note] : null;
  const shapes = [
    { name: 'всё', shape: null, dot: 'rgba(31,31,31,.3)' },
    { name: 'цветок', shape: 'flower', dot: 'var(--berry)' },
    { name: 'птица', shape: 'bird', dot: 'var(--memory)' },
    { name: 'конёк', shape: 'horse', dot: 'var(--sky)' },
    { name: 'кокошник', shape: 'flower-alt', dot: 'var(--berry)' },
    { name: 'краса', shape: 'flower-logo', dot: 'var(--olive)' },
  ];

  return {
    heroFloats: HERO_FLOATS,
    hdrBg: !s.stuck
      ? 'transparent'
      : s.darkBar
        ? 'linear-gradient(180deg,rgba(255,249,241,.1),rgba(255,249,241,.05)),linear-gradient(rgba(31,31,31,.16),rgba(31,31,31,.16))'
        : 'linear-gradient(180deg,rgba(255,249,241,.2),rgba(255,249,241,.11))',
    hdrBlur: !s.stuck
      ? 'none'
      : s.darkBar
        ? 'blur(8px) saturate(1.4) contrast(1.08) brightness(.68)'
        : 'blur(8px) saturate(1.4) contrast(1.06) brightness(1.06)',
    hdrFg: !s.stuck || s.darkBar ? 'var(--milk)' : 'var(--soft-black)',
    hdrTone: !s.stuck || s.darkBar ? 'milk' : 'primary',
    hdrOn: s.stuck ? 1 : 0,
    hdrPill: 'transparent',
    hdrPillBlur: 'none',
    hdrPillPad: '0px',
    hdrLogoPad: '0px',
    hdrFogOn: s.stuck ? 0 : 1,
    hdrLogoGlow: s.stuck
      ? 'drop-shadow(0 0 9px rgba(255,249,241,.55)) drop-shadow(0 0 22px rgba(255,249,241,.3))'
      : 'none',
    hdrPad: s.stuck ? '7px' : '16px',
    hdrLine: 'transparent',
    heroCards: HERO_CARDS.map((c) => {
      const p = PRODUCTS.find((x) => x.id === c.id);
      const on = s.hover === 'hero-' + c.id;
      return {
        ...c,
        bg: PRODUCT_IMAGES[p.id],
        title: p.title,
        price: p.price,
        aria: p.title + ', ' + p.price + '. Открыть изделие в каталоге',
        sc: on ? 1.04 : 1,
        capH: on ? '70px' : '0px',
        capO: on ? 1 : 0,
        on: () => setState({ hover: 'hero-' + c.id }),
        off: () => setState({ hover: null }),
        go: () => {
          setState({ hover: null, open: p.id });
          jump('card-' + p.id);
        },
      };
    }),

    cutShape: cut.shape,
    cutPhoto: cut.photo,
    cutImg: cut.img,
    cutNote: cut.note,
    cuts: MATERIAL_SAMPLES.map((c, i) => ({
      name: c.name,
      dot: c.dot,
      bg: s.cut === i ? 'var(--olive)' : 'transparent',
      fg: s.cut === i ? 'var(--milk)' : 'var(--soft-black)',
      bd: s.cut === i ? 'var(--olive)' : 'rgba(31,31,31,.3)',
      pick: () => setState({ cut: i }),
    })),

    count:
      list.length +
      (list.length === 1
        ? ' изделие'
        : list.length < 5
          ? ' изделия'
          : ' изделий'),
    filters: shapes.map((f) => {
      const active = s.shape === f.shape;
      return {
        name: f.name,
        shape: f.shape || 'flower',
        isShape: !!f.shape,
        isAll: !f.shape,
        active: active,
        dot: active ? 'var(--milk)' : f.dot,
        bg: active ? 'var(--olive)' : 'transparent',
        bd: active ? 'var(--olive)' : 'var(--soft-black-12)',
        fg: active ? 'var(--milk)' : 'var(--soft-black)',
        pick: () => setState({ shape: f.shape }),
      };
    }),
    items: list.map((p, i) => {
      const hv = s.hover === p.id;
      return {
        ...p,
        cardId: 'card-' + p.id,
        bg: PRODUCT_IMAGES[p.id],
        priceLabel: p.price,
        hasBadge: !!p.badge,
        ratio: i % 3 === 1 ? '4/5' : '1',
        offset: tilt
          ? i % 3 === 2
            ? '20px'
            : i % 3 === 1
              ? '8px'
              : '0px'
          : '0px',
        tilt: tilt
          ? i % 4 === 0
            ? '-1.2deg'
            : i % 4 === 2
              ? '1deg'
              : '0deg'
          : '0deg',
        zoom: hv ? 1.05 : 1,
        markOp: hv ? 1 : 0,
        found: s.found === 'card-' + p.id ? 'nv-found 1.5s ease-out' : 'none',
        aria: p.title + ', ' + p.price + '. Открыть описание',
        on: () => setState({ hover: p.id }),
        off: () => setState({ hover: null }),
        open: () => setState({ open: p.id }),
      };
    }),

    hasOpen: !!op,
    op: op
      ? {
          ...op,
          priceLabel: op.price,
          kindLabel: PRODUCT_KINDS[op.kind],
          bg: PRODUCT_IMAGES[op.id],
          specs: op.specs.map((r) => ({ k: r[0], v: r[1] })),
        }
      : { specs: [], wear: [] },
    closeModal: () => setState({ open: null }),

    steps: PROCESS_STEPS.map((st, i) => ({
      ...st,
      offset: tilt && i % 2 === 1 ? 'clamp(0px,4vw,44px)' : '0px',
    })),

    notes: Object.keys(STORY_NOTES).reduce((acc, k) => {
      acc[k] = {
        on: (e) => setState({ note: k, nx: e.clientX, ny: e.clientY }),
        off: () => setState({ note: null }),
      };
      return acc;
    }, {}),
    noteOn: !!note,
    notePhoto: note ? note.photo : 'nv-photo-field',
    noteCap: note ? note.cap : '',
    noteX:
      Math.min(
        s.nx + 18,
        (typeof window !== 'undefined' ? window.innerWidth : 1200) - 220,
      ) + 'px',
    noteY: Math.max(12, s.ny - 200) + 'px',

    ribbon: GALLERY_PHOTOS,
    faqs: FAQ_ITEMS.map((f, i) => ({
      ...f,
      open: s.faq === i,
      rot: s.faq === i ? '135deg' : '0deg',
      toggle: () => setState({ faq: s.faq === i ? -1 : i }),
    })),

    floats: [
      {
        shape: 'flower',
        c: 'var(--sky)',
        l: '8%',
        t: '18%',
        s: 'clamp(30px,4vw,64px)',
        d: '22s',
        dl: '0s',
      },
      {
        shape: 'bird',
        c: 'var(--memory)',
        l: '22%',
        t: '66%',
        s: 'clamp(26px,3.4vw,54px)',
        d: '26s',
        dl: '-6s',
      },
      {
        shape: 'horse',
        c: 'var(--sky)',
        l: '74%',
        t: '22%',
        s: 'clamp(34px,4.6vw,74px)',
        d: '24s',
        dl: '-11s',
      },
      {
        shape: 'flower-alt',
        c: 'var(--berry)',
        l: '86%',
        t: '62%',
        s: 'clamp(24px,3vw,48px)',
        d: '20s',
        dl: '-3s',
      },
      {
        shape: 'flower-logo',
        c: 'var(--ochre)',
        l: '56%',
        t: '80%',
        s: 'clamp(22px,2.6vw,42px)',
        d: '28s',
        dl: '-15s',
      },
      {
        shape: 'flower',
        c: 'var(--olive)',
        l: '40%',
        t: '12%',
        s: 'clamp(20px,2.4vw,40px)',
        d: '23s',
        dl: '-8s',
      },
    ],
  };
}

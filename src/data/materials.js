import { asset } from '../utils/asset';

export const MATERIAL_SAMPLES = [
  {
    name: 'бирюза',
    dot: 'var(--sky)',
    shape: 'flower',
    photo: 'nv-photo-flower-grass',
    img: asset('assets/images/plastic-mint.webp'),
    note: 'Бирюзовая партия идёт от бытовых канистр и крышек. Белые облачные пятна — это фрагменты, которые не успели прогреться до однородного цвета.',
  },
  {
    name: 'малина',
    dot: 'var(--berry)',
    shape: 'horse',
    photo: 'nv-photo-horse-log',
    img: asset('assets/images/plastic-red.webp'),
    note: 'В малиновом ПНД видны тёмные прожилки и лёгкий перламутр. Чем крупнее крошка после шредера, тем рванее рисунок в срезе.',
  },
  {
    name: 'розовый',
    dot: 'var(--memory)',
    shape: 'bird',
    photo: 'nv-photo-birds-moss',
    img: asset('assets/images/plastic-pink.webp'),
    note: 'Розовая партия самая светлая, поэтому вкрапления читаются лучше всего: на просвет в пластине видно исходную крошку.',
  },
];

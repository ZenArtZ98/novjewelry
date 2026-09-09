import { useLandingState } from './hooks/useLandingState';
import { useLandingMotion } from './hooks/useLandingMotion';
import { useProductDialog } from './hooks/useProductDialog';
import { PageEffects } from './components/sections/PageEffects';
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/sections/Marquee';
import { Material } from './components/sections/Material';
import { Catalog } from './components/sections/Catalog';
import { ProductModal } from './components/sections/ProductModal';
import { Process } from './components/sections/Process';
import { Story } from './components/sections/Story';
import { Worn } from './components/sections/Worn';
import { Faq } from './components/sections/Faq';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

export default function App() {
  const { state, setState, values } = useLandingState();
  useLandingMotion(setState);
  useProductDialog(state.open, setState);
  return (
    <main id="nv-page" className="page">
      <PageEffects />
      <Hero
        heroFloats={values.heroFloats}
        heroCards={values.heroCards}
        header={{
          hdrFogOn: values.hdrFogOn,
          hdrPad: values.hdrPad,
          hdrBg: values.hdrBg,
          hdrBlur: values.hdrBlur,
          hdrLine: values.hdrLine,
          hdrOn: values.hdrOn,
          hdrLogoGlow: values.hdrLogoGlow,
          hdrPill: values.hdrPill,
          hdrLogoPad: values.hdrLogoPad,
          hdrPillBlur: values.hdrPillBlur,
          hdrTone: values.hdrTone,
          hdrPillPad: values.hdrPillPad,
          hdrFg: values.hdrFg,
        }}
      />
      <Marquee />
      <Material
        cutShape={values.cutShape}
        cutImg={values.cutImg}
        cuts={values.cuts}
        cutNote={values.cutNote}
      />
      <Catalog
        count={values.count}
        filters={values.filters}
        items={values.items}
      />
      <ProductModal
        hasOpen={values.hasOpen}
        op={values.op}
        closeModal={values.closeModal}
      />
      <Process steps={values.steps} />
      <Story
        notes={values.notes}
        noteOn={values.noteOn}
        noteX={values.noteX}
        noteY={values.noteY}
        notePhoto={values.notePhoto}
        noteCap={values.noteCap}
      />
      <Worn ribbon={values.ribbon} />
      <Faq faqs={values.faqs} />
      <Contact floats={values.floats} />
      <Footer />
    </main>
  );
}

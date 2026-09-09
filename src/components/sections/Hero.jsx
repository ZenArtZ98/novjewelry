import { Fragment } from 'react';
import { Header } from './Header';
import './Hero.css';

export function Hero({ heroFloats, heroCards, header }) {
  return (
    <section className="hero__section" id="hero">
      <div className="nv-photo-meadow hero__background" id="nv-hero-bg"></div>
      <span className="hero__scrim" aria-hidden="true"></span>
      <Header {...header} />

      <span className="hero__text-scrim" aria-hidden="true"></span>

      <div className="hero__content" id="nv-hero-text">
        <p className="nv-label hero__eyebrow" data-nv-keepout="1">
          УКРАШЕНИЯ ИЗ ПЕРЕРАБОТАННОГО ПЛАСТИКА
        </p>
        <h1 className="hero__heading">
          <span className="hero__line-first">Носи то, что</span>
          <span className="hero__line-second">напоминает о</span>
          <span className="hero__line-last">
            <em className="hero__accent">лете</em>
            <span
              className="nv-mask nv-mask-flower hero__flower"
              aria-hidden="true"
            ></span>
          </span>
        </h1>
        <div className="hero__hint" aria-hidden="true" data-nv-keepout="1">
          <svg width="12" height="26" viewBox="0 0 12 26" fill="none">
            <path
              d="M6 0v22M1 17l5 6 5-6"
              stroke="#FFF9F1"
              strokeWidth="1.1"
            ></path>
          </svg>
          <span className="hero__hint-text">выбери, что цветёт в траве</span>
        </div>
      </div>

      <div className="hero__shapes" id="nv-hero-shapes" aria-hidden="true">
        {heroFloats.map((h, index) => (
          <Fragment key={index}>
            <span
              style={{
                left: h.l,
                top: h.t,
                width: h.size,
                height: h.size,
                background: h.fill,
              }}
              className={`nv-mask nv-mask-${h.shape} hero__shape`}
              data-nv-float="1"
              data-rot={h.rot}
            ></span>
          </Fragment>
        ))}
      </div>

      <div className="hero__cards" id="nv-hero-cards">
        {heroCards.map((c) => (
          <Fragment key={c.id}>
            <div
              style={{ left: c.l, top: c.t, width: c.w, zIndex: c.z }}
              className="hero__card-position"
            >
              <span
                style={{
                  animation: `nv-lev ${c.dur} ease-in-out ${c.delay} infinite`,
                }}
                className="hero__card-float"
              >
                <button
                  style={{ transform: `rotate(${c.rot}) scale(${c.sc})` }}
                  className="hero__card-button"
                  type="button"
                  aria-label={c.aria}
                  onClick={c.go}
                  onMouseEnter={c.on}
                  onMouseLeave={c.off}
                  onFocus={c.on}
                  onBlur={c.off}
                >
                  <span
                    style={{
                      aspectRatio: c.ratio,
                      background: `url('${c.bg}') center/cover no-repeat`,
                    }}
                    className="hero__card-image"
                  ></span>
                  <span
                    style={{
                      textAlign: c.align,
                      maxHeight: c.capH,
                      opacity: c.capO,
                    }}
                    className="hero__card-caption"
                  >
                    <span className="hero__card-title">{c.title}</span>
                    <span className="hero__card-price">{c.price}</span>
                  </span>
                </button>
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

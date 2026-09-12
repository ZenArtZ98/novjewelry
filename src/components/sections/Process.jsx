import { Fragment } from 'react';
import './Process.css';

export function Process({ steps }) {
  return (
    <section className="process__section" id="process">
      <span className="process__side-label" aria-hidden="true">
        процесс / 5 шагов
      </span>
      <div className="process__container">
        <div className="process__heading-row" data-reveal="1">
          <h2 className="process__heading">
            От мытой бутылки до <em className="process__accent">фрезы</em>
          </h2>
          <p className="process__description">
            Весь путь проходит в одной мастерской.
          </p>
        </div>
        <div className="process__grid">
          {steps.map((st) => (
            <Fragment key={st.n}>
              <article style={{ marginTop: st.offset }} data-reveal="1">
                <div className={`${st.photo} process__image`}>
                  <span className="nv-scrim nv-scrim-dark"></span>
                  <span
                    style={{ color: st.tint }}
                    className="process__step-number"
                    aria-hidden="true"
                  >
                    {st.n}
                  </span>
                </div>
                <h3 className="process__step-title">{st.t}</h3>
                <p className="process__step-description">{st.d}</p>
              </article>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

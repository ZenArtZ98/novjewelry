import { Fragment } from 'react';
import './Worn.css';

export function Worn({ ribbon }) {
  return (
    <section className="worn__section" id="worn">
      <div className="worn__container">
        <h2 className="worn__heading" data-reveal="1">
          Живёт на людях и в траве
        </h2>
        <p className="worn__description">Снято этим летом.</p>
      </div>
      <div
        className="worn__scroll"
        id="nv-worn-scroll"
        role="region"
        aria-label="Фотолента летней коллекции, прокручивается по горизонтали"
        tabIndex={0}
      >
        <div className="worn__track">
          {ribbon.map((r) => (
            <Fragment key={r.bg}>
              <figure
                style={{
                  width: r.w,
                  height: r.h,
                  transform: `rotate(${r.rot})`,
                }}
                className="worn__photo"
                data-worn="1"
                data-rot={r.rot}
              >
                <img src={r.bg} alt="" loading="lazy" decoding="async" />
              </figure>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

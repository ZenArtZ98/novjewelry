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
      <div className="worn__scroll" id="nv-worn-scroll">
        <div className="worn__track">
          {ribbon.map((r) => (
            <Fragment key={r.bg}>
              <figure
                style={{
                  width: r.w,
                  height: r.h,
                  background: `url('${r.bg}') center/cover no-repeat`,
                  transform: `rotate(${r.rot})`,
                }}
                className="worn__photo"
                data-worn="1"
                data-rot={r.rot}
              ></figure>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

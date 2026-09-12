import { Fragment } from 'react';
import './Material.css';

export function Material({ cutShape, cutImg, cuts, cutNote }) {
  return (
    <section className="material__section" id="material">
      <span className="material__side-label" aria-hidden="true">
        материал / срез
      </span>
      <div className="material__container">
        <div className="material__sample" data-reveal="1">
          <span className={`nv-mask nv-mask-${cutShape} material__shape`}>
            <span
              style={{
                background: `url('${cutImg}') center/cover no-repeat`,
              }}
              className="material__texture"
            ></span>
          </span>
          <span
            className="nv-mask nv-mask-flower-logo material__ornament"
            aria-hidden="true"
          ></span>
        </div>
        <div data-reveal="1">
          <h2 className="material__heading">
            Пластик, в котором <em className="material__accent">видно</em>, чем
            он был
          </h2>
          <p className="material__description">
            Вторичный ПНД (полиэтилен низкого давления) — это крышки, канистры и
            бутылки. После дробления и прессования внутри листа остаются
            разводы, вкрапления и крошка исходного сырья. Это и есть рисунок
            изделия — повторить его невозможно.
          </p>
          <p className="nv-label material__label">СРЕЗ ПАРТИИ</p>
          <div className="material__swatches">
            {cuts.map((c) => (
              <Fragment key={c.name}>
                <button
                  style={{
                    background: c.bg,
                    color: c.fg,
                    border: `1.5px solid ${c.bd}`,
                  }}
                  className="material__swatch"
                  type="button"
                  onClick={c.pick}
                  onMouseEnter={c.pick}
                >
                  <span
                    style={{ background: c.dot }}
                    className="material__swatch-color"
                    aria-hidden="true"
                  ></span>
                  {c.name}
                </button>
              </Fragment>
            ))}
          </div>
          <p className="material__note">{cutNote}</p>
        </div>
      </div>
    </section>
  );
}

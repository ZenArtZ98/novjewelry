import { Fragment } from 'react';
import './Catalog.css';

export function Catalog({ count, filters, items }) {
  return (
    <section className="catalog__section" id="catalog">
      <div className="catalog__container">
        <div className="catalog__heading-row" data-reveal="1">
          <h2 className="catalog__heading">
            Что <em className="catalog__accent">цветёт</em> сейчас
          </h2>
          <p className="catalog__count">{count} · выбор по форме</p>
        </div>

        <div
          className="catalog__filters"
          role="group"
          aria-label="Фильтр по форме"
        >
          {filters.map((f) => (
            <Fragment key={f.name}>
              <button
                style={{ background: f.bg, border: `1.5px solid ${f.bd}` }}
                className="catalog__filter"
                type="button"
                onClick={f.pick}
                aria-pressed={f.active}
              >
                {f.isShape && (
                  <>
                    <span
                      style={{ background: f.dot }}
                      className={`nv-mask nv-mask-${f.shape} catalog__shape`}
                      aria-hidden="true"
                    ></span>
                  </>
                )}
                {f.isAll && (
                  <>
                    <span
                      style={{ border: `1.5px dashed ${f.dot}` }}
                      className="catalog__all-shapes"
                      aria-hidden="true"
                    ></span>
                  </>
                )}
                <span style={{ color: f.fg }} className="catalog__filter-label">
                  {f.name}
                </span>
              </button>
            </Fragment>
          ))}
        </div>

        <div className="catalog__grid">
          {items.map((p) => (
            <Fragment key={p.id}>
              <article
                style={{
                  '--card-offset': p.offset,
                  '--card-tilt': p.tilt,
                }}
                className={`catalog__card`}
                id={p.cardId}
                onMouseEnter={p.on}
                onMouseLeave={p.off}
              >
                <button
                  className="catalog__card-button"
                  type="button"
                  onClick={p.open}
                  aria-label={p.aria}
                >
                  <span
                    style={{ aspectRatio: p.ratio, animation: p.found }}
                    className="catalog__image-frame"
                  >
                    <span
                      style={{
                        background: `url('${p.bg}') center/cover no-repeat`,
                        transform: `scale(${p.zoom})`,
                      }}
                      className="catalog__image"
                    ></span>
                    {p.hasBadge && (
                      <>
                        <span className="nv-capsule-light catalog__badge">
                          {p.badge}
                        </span>
                      </>
                    )}
                    <span
                      style={{ background: p.tone, opacity: p.markOp }}
                      className={`nv-mask nv-mask-${p.shape} catalog__shape-mark`}
                      aria-hidden="true"
                    ></span>
                  </span>
                  <span className="catalog__title">{p.title}</span>
                  <span className="catalog__meta">
                    <span className="catalog__price">{p.priceLabel}</span>
                    <span className="catalog__sku">{p.sku}</span>
                  </span>
                  <span className="catalog__note">{p.note}</span>
                </button>
              </article>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

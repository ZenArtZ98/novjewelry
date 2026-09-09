import { Fragment } from 'react';
import { Button } from '../ui/Button';
import './ProductModal.css';

export function ProductModal({ hasOpen, op, closeModal }) {
  if (!hasOpen) return null;
  return (
    <>
      <div
        className="productmodal__overlay"
        role="dialog"
        aria-modal="true"
        aria-label={op.title}
      >
        <button
          className="productmodal__backdrop"
          type="button"
          onClick={closeModal}
          aria-label="Закрыть"
        ></button>
        <div className="productmodal__panel">
          <div
            style={{ background: `url('${op.bg}') center/cover no-repeat` }}
            className="productmodal__image"
          ></div>
          <div className="productmodal__content">
            <div className="productmodal__header">
              <div>
                <p className="nv-label productmodal__kind">{op.kindLabel}</p>
                <h3 className="productmodal__title">{op.title}</h3>
              </div>
              <button
                className="productmodal__close"
                type="button"
                onClick={closeModal}
                aria-label="Закрыть окно изделия"
              >
                ×
              </button>
            </div>
            <p className="productmodal__price">{op.priceLabel}</p>
            <p className="productmodal__lead">{op.lead}</p>
            <p className="productmodal__description">{op.body}</p>
            <dl className="productmodal__specs">
              {op.specs.map((s) => (
                <Fragment key={s.k}>
                  <dt className="productmodal__spec-label">{s.k}</dt>
                  <dd className="productmodal__spec-value">{s.v}</dd>
                </Fragment>
              ))}
            </dl>
            <p className="nv-label productmodal__wear-label">КУДА НОСИТЬ</p>
            <ul className="productmodal__wear-list">
              {op.wear.map((w) => (
                <Fragment key={w}>
                  <li className="productmodal__wear-item">
                    <span className="productmodal__bullet" aria-hidden="true">
                      —
                    </span>
                    <span>{w}</span>
                  </li>
                </Fragment>
              ))}
            </ul>
            <p className="productmodal__care">
              Уход: тёплая вода и мягкая тряпка. Сборка заказа 1–2 дня,
              приезжает в льняном мешочке и крафтовой коробке. Артикул {op.sku}.
            </p>
            <div className="productmodal__actions">
              <Button variant="primary" size="lg">
                Написать в сообщения сообщества
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

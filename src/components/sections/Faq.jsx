import { Fragment } from 'react';
import './Faq.css';

export function Faq({ faqs }) {
  return (
    <section className="faq__section">
      <div className="faq__container">
        <h2 className="faq__heading" data-reveal="1">
          Частые <em className="faq__accent">вопросы</em>
        </h2>
        {faqs.map((f) => (
          <Fragment key={f.q}>
            <div className="faq__item">
              <button
                className="faq__question"
                type="button"
                onClick={f.toggle}
                aria-expanded={f.open}
              >
                <span>{f.q}</span>
                <span
                  style={{ transform: `rotate(${f.rot})` }}
                  className="nv-mask nv-mask-flower faq__icon"
                  aria-hidden="true"
                ></span>
              </button>
              {f.open && (
                <>
                  <p className="faq__answer">{f.a}</p>
                </>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

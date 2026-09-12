import { Fragment } from 'react';
import { Button } from '../ui/Button';
import './Contact.css';

export function Contact({ floats }) {
  return (
    <section className="contact__section" id="final">
      <div className="nv-photo-sky contact__background"></div>
      <span className="nv-scrim nv-scrim-flat-dark"></span>
      <div className="contact__shapes" aria-hidden="true">
        {floats.map((fl, index) => (
          <Fragment key={index}>
            <span
              style={{
                left: fl.l,
                top: fl.t,
                width: fl.s,
                height: fl.s,
                background: fl.c,
                animation: `nv-drift ${fl.d} ease-in-out ${fl.dl} infinite`,
              }}
              className={`nv-mask nv-mask-${fl.shape} contact__shape`}
            ></span>
          </Fragment>
        ))}
      </div>
      <div className="contact__content">
        <h2 className="contact__heading">
          Лето заканчивается.{' '}
          <em className="contact__accent">Носите его дальше.</em>
        </h2>
        <p className="contact__description">
          Хотите украшение по своему дизайну — напишите в сообщения сообщества.
          Покажем, какой пластик есть сейчас, и вместе подберём форму и цвет.
        </p>
        <div className="contact__actions">
          <Button variant="primary" size="lg">
            Написать в сообщения сообщества
          </Button>
          <a className="contact__catalog-link" href="#catalog">
            Смотреть каталог
          </a>
        </div>
      </div>
    </section>
  );
}

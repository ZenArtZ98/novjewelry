import { Logo } from '../ui/Logo';
import { contacts } from '../../config/contacts';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer__section">
      <div className="footer__container">
        <Logo height={72}></Logo>
        <div className="footer__columns">
          <nav className="footer__navigation" aria-label="Навигация в подвале">
            <a href="#material">Материал</a>
            <a href="#catalog">Каталог</a>
            <a href="#process">Процесс</a>
            <a href="#story">Об авторе</a>
          </nav>
          <div className="footer__social-links">
            <a
              href={contacts.community}
              target="_blank"
              rel="noopener noreferrer"
            >
              Сообщество ВКонтакте
            </a>
            <a href={contacts.telegram || '#final'}>Telegram</a>
            <a href={contacts.pinterest || '#final'}>Pinterest</a>
          </div>
          <p className="footer__description">
            НОВЬ. Украшения и небольшие объекты из переработанного пластика.
            Доставка по всей России.
          </p>
        </div>
        <p className="footer__signature">Сделано из того, что уже было</p>
      </div>
    </footer>
  );
}

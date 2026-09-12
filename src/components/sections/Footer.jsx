import { Logo } from '../ui/Logo';
import { contacts } from '../../config/contacts';
import { asset } from '../../utils/asset';
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
          </div>
          <p className="footer__description">
            НОВЬ. Украшения и небольшие объекты из переработанного пластика.
            Доставка по всей России.
          </p>
        </div>
        <p className="footer__signature">Сделано из того, что уже было</p>
        <aside className="footer__support" aria-label="Поддержка проекта">
          <div className="footer__support-logos">
            <img
              className="footer__fund-logo"
              src={asset('assets/logos/fasie.png')}
              alt="Фонд содействия инновациям"
              width="176"
              height="85"
              loading="lazy"
              decoding="async"
            />
            <img
              className="footer__platform-logo"
              src={asset('assets/logos/platform.png')}
              alt="Платформа университетского технологического предпринимательства"
              width="132"
              height="97"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="footer__support-text">
            Проект создан при поддержке федерального государственного бюджетного
            учреждения «Фонд содействия развитию малых форм предприятий в
            научно‑технической сфере» в рамках программы «Студенческий стартап»
            федерального проекта «Платформа университетского технологического
            предпринимательства».
          </p>
        </aside>
        <div className="footer__credits">
          <div className="footer__designer">
            <span className="footer__designer-logo">
              <img
                src={asset('assets/logos/kostry-production.png')}
                alt="КОСТРЫ продакшн"
                width="2000"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span>designed by КОСТРЫ.prod</span>
          </div>
          <p className="footer__developer">created by BACKUP.ZenArtZ</p>
        </div>
      </div>
    </footer>
  );
}

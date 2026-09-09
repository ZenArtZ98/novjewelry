import { Logo } from '../ui/Logo';
import './Header.css';

export function Header({
  hdrFogOn,
  hdrPad,
  hdrBg,
  hdrBlur,
  hdrLine,
  hdrOn,
  hdrLogoGlow,
  hdrPill,
  hdrLogoPad,
  hdrPillBlur,
  hdrTone,
  hdrPillPad,
  hdrFg,
}) {
  return (
    <>
      <span
        style={{ opacity: hdrFogOn }}
        className="header__fog"
        aria-hidden="true"
      ></span>
      <span
        style={{ opacity: hdrFogOn }}
        className="header__fog-sky"
        aria-hidden="true"
      ></span>
      <span
        style={{ opacity: hdrFogOn }}
        className="header__fog-berry"
        aria-hidden="true"
      ></span>
      <header
        style={{
          padding: `${hdrPad} clamp(16px,4vw,56px)`,
          background: hdrBg,
          backdropFilter: hdrBlur,
          WebkitBackdropFilter: hdrBlur,
          borderBottom: `1px solid ${hdrLine}`,
        }}
        className="header__bar"
        id="nv-header"
      >
        <span
          style={{ opacity: hdrOn }}
          className="header__bottom-line"
          aria-hidden="true"
        ></span>
        <span
          style={{ opacity: hdrOn }}
          className="header__bottom-glow"
          aria-hidden="true"
        ></span>
        <span
          style={{ opacity: hdrOn }}
          className="header__top-line"
          aria-hidden="true"
        ></span>
        <a
          style={{
            filter: hdrLogoGlow,
            background: hdrPill,
            padding: hdrLogoPad,
            backdropFilter: hdrPillBlur,
            WebkitBackdropFilter: hdrPillBlur,
          }}
          className="header__home"
          href="#hero"
          aria-label="НОВЬ — на главную"
        >
          <Logo tone={hdrTone} flowerColor="#ADECF2" height={30}></Logo>
        </a>
        <nav
          style={{
            background: hdrPill,
            padding: hdrPillPad,
            backdropFilter: hdrPillBlur,
            WebkitBackdropFilter: hdrPillBlur,
          }}
          className="header__navigation"
          id="nv-nav"
          aria-label="Основная навигация"
        >
          <a style={{ color: hdrFg }} className="header__link" href="#material">
            Материал
          </a>
          <a style={{ color: hdrFg }} className="header__link" href="#catalog">
            Каталог
          </a>
          <a style={{ color: hdrFg }} className="header__link" href="#process">
            Процесс
          </a>
          <a style={{ color: hdrFg }} className="header__link" href="#story">
            О бренде
          </a>
          <a style={{ color: hdrFg }} className="header__link" href="#final">
            Написать
          </a>
        </nav>
      </header>
    </>
  );
}

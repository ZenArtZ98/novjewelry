import './Story.css';

export function Story({ notes, noteOn, noteX, noteY, notePhoto, noteCap }) {
  return (
    <section className="story__section" id="story">
      <div className="story__container">
        <p className="nv-label story__label">АВТОР</p>
        <div className="story__grid">
          <div className="story__portrait" data-reveal="1">
            <span
              className="nv-mask nv-mask-flower-blob story__portrait-mask"
              aria-hidden="true"
            ></span>
            <span
              className="nv-cut-founder-tee story__portrait-photo"
              role="img"
              aria-label="Ярослава, автор бренда НОВЬ"
            ></span>
            <span
              className="nv-mask nv-mask-bird story__bird"
              aria-hidden="true"
            ></span>
          </div>
          <div className="story__content" data-reveal="1">
            <h2 className="story__heading">
              Меня зовут Ярослава. НОВЬ — это мои руки, шредер и{' '}
              <button
                className="story__tool-link"
                type="button"
                onMouseEnter={notes.cnc.on}
                onMouseLeave={notes.cnc.off}
                onClick={notes.cnc.on}
              >
                фреза
              </button>
              .
            </h2>
            <p className="story__paragraph">
              Мне было жалко выбрасывать цвет. Не пластик как материал, а именно
              цвет: у бытового ПНД он плотный, живой, ни на что не похожий.
              Такого не бывает в магазине бижутерии.
            </p>
            <p className="story__paragraph">
              Сначала я мыла и сортировала крышки на кухне. Потом появился
              шредер, потом пресс, потом станок. Сейчас каждая партия проходит
              один и тот же путь: мойка, сортировка по цвету, дробление, лист,
              фрезеровка. Ничего не отдаю на сторону.
            </p>
            <p className="story__paragraph">
              Я не переосмысляю русскую культуру и не делаю сувениры. Я просто
              выросла среди этих форм:{' '}
              <button
                className="story__note-link"
                type="button"
                onMouseEnter={notes.horse.on}
                onMouseLeave={notes.horse.off}
                onClick={notes.horse.on}
              >
                конёк
              </button>{' '}
              на наличнике, кокошник на открытке, ромашка в стакане на
              подоконнике. Им нужна была новая форма, а не музей.
            </p>
            <p className="story__last-paragraph">
              Мастерская стоит там, где начинается{' '}
              <button
                className="story__note-link"
                type="button"
                onMouseEnter={notes.field.on}
                onMouseLeave={notes.field.off}
                onClick={notes.field.on}
              >
                поле
              </button>
              . Всё, что вы видите в каталоге, придумано и вырезано за одним
              столом.
            </p>
            <blockquote className="story__quote">
              <p className="story__quote-text">
                «Неровности, разводы и вкрапления — это характер материала, а не
                брак.»
              </p>
            </blockquote>
          </div>
        </div>
      </div>
      {noteOn && (
        <>
          <figure style={{ left: noteX, top: noteY }} className="story__note">
            <span className={`${notePhoto} story__note-image`}></span>
            <figcaption className="story__note-caption">{noteCap}</figcaption>
          </figure>
        </>
      )}
    </section>
  );
}

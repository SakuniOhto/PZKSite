'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Activities as Activity, Teacher, News } from '@prisma/client'
import InfoSection from "./components/InfoSection"; // <-- Измените путь, если нужно

const formatTeacherData = (text: string) => {
  if (!text) return null;

  // очистка лишних пробелов и переносов
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // заголовок до первой точки ИЛИ до первого ключевого слова
  const marker = "Образование:";
  const markerIndex = cleanText.indexOf(marker);
  const dotIndex = cleanText.search(/[.!?]/);

  // где закончить первую строку
  let splitAt;
  if (dotIndex !== -1 && (markerIndex === -1 || dotIndex < markerIndex)) {
    // есть точка и она раньше маркера (или маркера нет)
    splitAt = dotIndex + 1;
  } else if (markerIndex !== -1) {
    // маркер есть и он раньше точки (или точки нет)
    splitAt = markerIndex;
  } else {
    // ничего не найдено
    splitAt = 0;
  }

  const firstLine = cleanText.substring(0, splitAt).trim();
  const remaining = cleanText.substring(splitAt).trim();

  // массив ключевых слов для форматирования
  const keywords = [
    "Образование:",
    "Профессиональная переподготовка:",
    "Преподаваемые дисциплины:",
    "Повышение квалификации (за последние три года):",
    "Общий стаж работы:",
    "Стаж педагогической работы:"
  ];

  let html = remaining;
  keywords.forEach(word => {
    // переносы и жирность
    const br = word === "Образование:" ? "" : "<br/><br/>";
    html = html.replace(word, `${br}<b>${word}</b>`);
  });

  // форматирование списков
  html = html.replace(/(\(\d{4}\))\s*(?=[А-ЯЁ])/g, '$1<br/>• ');

  return { firstLine, html };
};

const formatTextFromDb = (text: string) => {
  if (!text) return null;

  const anchor = "Образование:";
  const index = text.indexOf(anchor);

  let firstLine = "";
  let remaining = text;

  if (index !== -1) {
    firstLine = text.substring(0, index).trim();
    remaining = text.substring(index);
  }

  const formatted = remaining
    .replace(/(Образование:)/g, '<span>$1</span>')
    .replace(/\s*(Дисциплины:)/g, '<br/><br/><span>$1</span>')
    .replace(/\s*(\d+\s+(лет|год|года|месяцев|месяца|месяц).*(?=\s+педагогического))/g, '<br/><br/><span>$1</span>')
    .replace(/(педагогического стажа)/g, '<br/>$1');

  return (
    <div>
      {firstLine && <span>{firstLine}</span>}
      {firstLine && <br />}
      {firstLine && <br />}
      <div dangerouslySetInnerHTML={{ __html: formatted }} />
    </div>
  );
};

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [disciplinesPage, setDisciplinesPage] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedActivityImage, setSelectedActivityImage] = useState<{ src: string; alt: string } | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [isCorp1Open, setIsCorp1Open] = useState(false);
  const [isCorp2Open, setIsCorp2Open] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (error) { console.log(error) }
      finally { setIsLoading(false); }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) { console.log(error); }
      finally { setIsActivitiesLoading(false); }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) { console.log(error); }
    };
    fetchNews();
  }, []);

  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleTeachers = teachers.slice(startIndex, startIndex + itemsPerPage);
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;
  const parsedActivities = useMemo(() => {
    return activities.map((activity) => ({
      ...activity,
      pictures: activity.picture
        .split(';')
        .map((picture: string) => picture.trim())
        .filter(Boolean),
    }));
  }, [activities]);

  const handlePrevious = () => {
    if (canGoPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDisciplinesPrevious = () => {
    setDisciplinesPage(0);
  };

  const handleDisciplinesNext = () => {
    setDisciplinesPage(1);
  };

  const totalPagesNews = news.length;
  const canGoNextNews = currentNewsIndex < totalPagesNews - 1;
  const canGoPrevNews = currentNewsIndex > 0;

  const handlePreviousNews = () => {
    if (canGoPrevNews) {
      setCurrentNewsIndex((prevNews) => prevNews - 1);
    }
  };

  const handleNextNews = () => {
    if (canGoNextNews) {
      setCurrentNewsIndex((prevNews) => prevNews + 1);
    }
  };

  const handleCardMouseEnter = (cardId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCard(cardId);
  };

  const handleCardMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCard(null);
    }, 3000);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <section className="aboutpzk" id="aboutpzk">
        <div className="wrapper">
          <h1>ПРЕДМЕТНО-ЦИКЛОВАЯ КОМИССИЯ</h1>
          <div className="row">
            <div className="left-text">
              <h2>О ПЦК</h2>
              <p className="regular-16px">Предметно-цикловая комиссия технологии продуктов питания и естественно-научных дисциплин сформирована в 2024 году. Председатель: Егорова Вера Николаевна.</p>
            </div>
            <div className="right-text">
              <div className="quote liquid-glass">
                <p className="regular-16px">«Наша главная задача — создать единую практико-ориентированную среду, где формируются не только профессиональные компетенции, но и личностные качества будущих специалистов»</p>
              </div>
            </div>
          </div>
          <div className="cards-group">
            <div className="chairman-photo"></div>
            <div className="fake-rectangle-photo"></div>
            <div className="fake-rectangle-photo-2"></div>
          </div>
          <div className="sphere"></div>
        </div>
      </section>

      {selectedTeacher && (() => {
        const formatted = formatTeacherData(selectedTeacher.fulldesc);
        if (!formatted) return null;

        const path = selectedTeacher.image
          ? `/${selectedTeacher.image}.png`
          : "/Egorova.png";

        return (
          <>
            <div className="modal-overlay" onClick={() => setSelectedTeacher(null)} />
            <div className="modal-content">
              <button className="modal-close" onClick={() => setSelectedTeacher(null)}>✕</button>

              <div className="modal-header">
                <img
                  src={path}
                  alt={selectedTeacher.name}
                  className="modal-image"
                />
                <h2>{selectedTeacher.name}</h2>
              </div>

              <div className="modal-body">
                {formatted.firstLine && <p><b>{formatted.firstLine}</b></p>}
                <div
                  className="teacher-description"
                  dangerouslySetInnerHTML={{ __html: formatted.html }}
                />
              </div>
            </div>
          </>
        );
      })()}

      <section className="teachers" id="teachers">
        <div className="wrapper">
          <div className="row">
            <h3>ПРЕПОДАВАТЕЛИ</h3>
            <div className="buttons">
              <div
                className={`button-back ${!canGoPrev ? 'disabled' : ''} ${currentPage > 0 ? 'swapped' : ''}`}
                onClick={handlePrevious}
                style={{ cursor: canGoPrev ? 'pointer' : 'not-allowed', opacity: canGoPrev ? 1 : 0.5 }}>
                <img src="/arrow.svg" alt="Стрелка" />
              </div>
              <div
                className={`button-forward ${!canGoNext ? 'disabled' : ''} ${currentPage > 0 ? 'swapped' : ''}`}
                onClick={handleNext}
                style={{ cursor: canGoNext ? 'pointer' : 'not-allowed', opacity: canGoNext ? 1 : 0.5 }}>
                <img src="/arrow.svg" alt="Стрелка" />
              </div>
            </div>
          </div>

          <div className="teacher-cards" key={`teachers-${currentPage}`}>
            {!isLoading && visibleTeachers.map((teacher: Teacher, index: number) => (
              <div key={teacher.id} style={{ position: 'relative' }} className={currentPage === 0 && (index === 0 || index === 1 || index === 2) ? 'first-page-card' : ''}>
                {currentPage === 0 && (index === 0 || index === 2) && (
                  <div className="teacher-card-blur-bg"></div>)}
                {currentPage === 0 && index === 1 && (
                  <div className="teacher-card-blur-bg-green"></div>)}
                <div className={`card ${currentPage === 0 && index === 1 ? 'card-green liquid-glass' : 'liquid-glass'}`}>
                  <div className="row">
                    <img src={encodeURI(teacher.image ? `/${teacher.image}.png` : "/Default.png")} alt={teacher.name} />
                    <h1>
                      {teacher.name.split(' ').map((word: string, i: number) => (
                        <React.Fragment key={i}>
                          {word}<br />
                        </React.Fragment>))}
                    </h1>
                  </div>
                  <div className='p'>{formatTextFromDb(teacher.description)}</div>
                  <button
                    className="corner-button liquid-glass"
                    onClick={() => setSelectedTeacher(teacher)}>
                    <img src="/arrow.svg" alt="Стрелка" />
                  </button>
                </div>
              </div>))}
          </div>
        </div>
      </section>
      <section className="disciplines" id="disciplines">
        <div className="background"></div>
        <div className="wrapper">
          <div className="row">
            <div className="row-2">
              <h3>ДИСЦИПЛИНЫ</h3>
              <h4>{disciplinesPage === 0 ? 'Естественно-научные дисциплины' : 'Технология продуктов питания'}</h4>
            </div>
            <div className="buttons">
              <div
                className={`button-back ${disciplinesPage === 0 ? 'disabled' : ''}`}
                onClick={handleDisciplinesPrevious}
                style={{ cursor: disciplinesPage === 0 ? 'not-allowed' : 'pointer', opacity: disciplinesPage === 0 ? 0.5 : 1 }}>
                <img src="/arrow.svg" alt="Стрелка" />
              </div>
              <div
                className={`button-forward ${disciplinesPage === 1 ? 'disabled' : ''}`}
                onClick={handleDisciplinesNext}
                style={{ cursor: disciplinesPage === 1 ? 'not-allowed' : 'pointer', opacity: disciplinesPage === 1 ? 0.5 : 1 }}>
                <img src="/arrow.svg" alt="Стрелка" />
              </div>
            </div>
          </div>
          {disciplinesPage === 0 && <div className="first-cards" key="disciplines-0">
            <div className={`cards ${activeCard ? `active-${activeCard}` : ''}`}>
              <div className="row-cards">
                <div
                  className="card liquid-glass"
                  onMouseEnter={() => handleCardMouseEnter('1-1')}
                  onMouseLeave={handleCardMouseLeave}>
                  <img src="/Biology.svg" alt="Биология" />
                  <div className="medium-20px">Биология</div>
                  <p className="regular-16px">Общая биология, генетика.</p>
                </div>
                <div
                  className="card liquid-glass"
                  onMouseEnter={() => handleCardMouseEnter('1-2')}
                  onMouseLeave={handleCardMouseLeave}>
                  <img src="/Chemistry.svg" alt="Химия" />
                  <div className="medium-20px">Химия</div>
                  <p className="regular-16px">Общая, органическая и<br />неорганическая химия.</p>
                </div>
                <div
                  className="card liquid-glass"
                  onMouseEnter={() => handleCardMouseEnter('1-3')}
                  onMouseLeave={handleCardMouseLeave}>
                  <img src="/Geography.svg" alt="География" />
                  <div className="medium-20px">География</div>
                  <p className="regular-16px">Социальная и экономическая география.</p>
                </div>
              </div>
              <div className="row-cards">
                <div className="card liquid-glass"></div>
                <div
                  className="card liquid-glass"
                  onMouseEnter={() => handleCardMouseEnter('2-2')}
                  onMouseLeave={handleCardMouseLeave}>
                  <img src="/EOP.svg" alt="ЭОП" />
                  <div className="medium-20px">Экологические основы природопользования</div>
                  <p className="regular-16px">Экосистемы, ресурсы, устойчивое развитие.</p>
                </div>
                <div className="card liquid-glass"></div>
              </div>
            </div>
          </div>}
          {disciplinesPage === 1 && <div className="second-cards" key="disciplines-1">
            <div className="title-cards">
              <div className="first-title-cards">
                <div className="title-card liquid-glass">
                  <p>Индивидуальный проект
                    (ТППРС, ТППЖП)</p>
                </div>
                <div className="title-card liquid-glass">
                  <p>Процессы и аппараты</p>
                </div>
                <div className="title-card liquid-glass">
                  <p>Процессы и аппараты пищевых производств</p>
                </div>
                <div className="title-card liquid-glass">
                  <p>Микробиология, санитария и гигиена в пищевом производстве</p>
                </div>
              </div>
              <div className="second-title-cards">
                <div className="title-card liquid-glass">
                  <p className=''>МДК 01.01 Техническое обеспечение производства хлеба, хлебобулочных, макаронных и кондитерских изделий</p>
                </div>
                <div className="title-card liquid-glass">
                  <p>МДК 01.02 Технология хлеба, хлебобулочных, макаронных и кондитерских изделий</p>
                </div>
                <div className="title-card liquid-glass">
                  <p>МДК 01.01 Управление автоматизированными линиями (молочное сырье)</p>
                </div>
                <div className="title-card liquid-glass">
                  <p>МДК 01.02 Процессы производства продукции на автоматизированных технологических линиях из молочного сырья</p>
                </div>
              </div>
            </div>
            <div className="info-block liquid-glass"><p>В этом блоке собраны дисциплины по технологии продуктов питания, которые изучают на пищевом производстве. Сюда входят как общие предметы вроде процессов и микробиологии, так и узкие курсы по работе с хлебом, кондитеркой и молочным сырьем. Основной упор сделан на техническую часть: как устроены автоматизированные линии и как правильно организовать работу цеха. Проще говоря, это база знаний о том, по каким принципам работают современные заводы и на каком «железе» делают продукты. Весь материал выстроен логично — от основ санитарии до управления сложными техническими комплексами.</p></div>
          </div>}
        </div>
      </section>
      <section className="umr" id="umr">
        <div className="wrapper">
          <h3>УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА</h3>
          <div className="block">
            <div className="medium-20px">База методических материалов</div>
            <div className="materials">
              <div className="material">
                <div className="row">
                  <img src="/pdf.png" alt="PDF" />
                  <p className="regular-16px">Егорова В.Н., Колотова О.М., Организация практических работ по дисциплине «География» [Электронный ресурс]</p>
                </div>
                <a href="http://artlib.osu.ru/web/books/metod_all/214260_20241017.pdf"><img src="/download.png" alt="Скачать" /></a>
              </div>
              <div className="material">
                <div className="row">
                  <img src="/pdf.png" alt="PDF" />
                  <p className="regular-16px">Сидорова О.С., Биология [Электронный ресурс]</p>
                </div>
                <a href="http://artlib.osu.ru/web/books/metod_all/221410_20250327.pdf"><img src="/download.png" alt="Скачать" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="nirs" id="nirs">
        <div className="wrapper">
          <div className="content-links">
            <div className="content">
              <div className="row-2">
                <h3>НАУЧНО-ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА</h3>
                <p className="regular-16px">Преподаватели ПЦК постоянно участвуют в профессиональных встречах и проектах на различных уровнях — от регионального до международного.</p>
              </div>
              <div className="direction-and-goals liquid-glass">
                <div className="columns">
                  <div className="column-1">
                    <div className="medium-20px">Ключевые направления:</div>
                    <div className="rows">
                      <div className="row">
                        <img src="/publication.svg" alt="Книжка открытая" />
                        <p className="regular-16px">Публикация статей</p>
                      </div>
                      <div className="row">
                        <img src="/nirs.svg" alt="Файл" />
                        <p className="regular-16px">Руководство НИРС будущих призёров конкурсов и конференций</p>
                      </div>
                      <div className="row">
                        <img src="/umk.svg" alt="Книжка закрытая" />
                        <p className="regular-16px">Разработка учебно-методических комплексов</p>
                      </div>
                    </div>
                  </div>
                  <div className="column-2">
                    <div className="medium-20px">Цели:</div>
                    <div className="rows">
                      <div className="row">
                        <img src="/qual.svg" alt="Медалька" />
                        <p className="regular-16px">Повышение квалификации</p>
                      </div>
                      <div className="row">
                        <img src="/science.svg" alt="Наука" />
                        <p className="regular-16px">Внедрение научных достижений в образовательный процесс</p>
                      </div>
                      <div className="row">
                        <img src="/thinking.svg" alt="Мысль" />
                        <p className="regular-16px">Развитие у студентов навыков НИРС и критического мышления</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="links">
              <a href="http://www.osu.ru/doc/4088" target="_blank"><img src="/euroolimp.png" alt="Евразийские олимпиады и конкурсы" /></a>
              <a href="https://miretno.ru/" target="_blank"><img src="/etnodictant.png" alt="Этнографический диктант" /></a>
              <a href="https://dictant.rgo.ru/" target="_blank"><img src="/geodictant.png" alt="Географический диктант" /></a>
              <a href="https://экодиктант.рус/" target="_blank"><img src="/ecodictant.png" alt="Экологический диктант" /></a>
            </div>
          </div>
        </div>
      </section>

      {selectedActivityImage && (
        <>
          <div
            className="activity-modal-overlay"
            onClick={() => setSelectedActivityImage(null)} />
          <div className="activity-modal-content">
            <button
              className="activity-modal-close"
              onClick={() => setSelectedActivityImage(null)}
              aria-label="Закрыть изображение">
              ✕
            </button>
            <img
              src={selectedActivityImage.src}
              alt={selectedActivityImage.alt}
              className="activity-modal-image" />
          </div>
        </>
      )}

      <section className="activities" id="activities">
        <div className="wrapper">
          <div className="center">
            <h3>ВНЕАУДИТОРНАЯ РАБОТА</h3>
            <p className="regular-16px">Преподаватели много занимаются со студентами во внеучебное время. Такие занятия помогают закрепить теорию на практике, приучают к профессиональной этике и командной работе, а также помогают ребятам убедиться в правильности выбора профессии.</p>
          </div>
          <div className="blocks">
            {!isActivitiesLoading && parsedActivities.map((activity) => (
              <article key={activity.id} className="block liquid-glass">
                <div className="activity-pictures column">
                  {activity.pictures.map((picture: string, index: number) => (
                    <img
                      key={`${activity.id}-${picture}-${index}`}
                      src={encodeURI(`/${picture}.png`)}
                      alt={activity.description}
                      onClick={() => setSelectedActivityImage({
                        src: encodeURI(`/${picture}.png`),
                        alt: activity.description,
                      })}
                    />
                  ))}
                </div>
                <p>{activity.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="news" id="news">
        <div className="background"></div>
        <div className="wrapper">
          <div className="row">
            <h3>НОВОСТИ</h3>
            <div className="buttons">
              <div
                className={`button-back ${!canGoPrevNews ? 'disabled' : ''} ${currentNewsIndex > 0 ? 'swapped' : ''}`}
                onClick={handlePreviousNews}
                style={{ cursor: canGoPrevNews ? 'pointer' : 'not-allowed', opacity: canGoPrevNews ? 1 : 0.5 }}
              >
                <img src="/arrow.svg" alt="Стрелка" />
              </div>
              <div
                className={`button-forward ${!canGoNextNews ? 'disabled' : ''} ${currentNewsIndex > 0 ? 'swapped' : ''}`}
                onClick={handleNextNews}
                style={{ cursor: canGoNextNews ? 'pointer' : 'not-allowed', opacity: canGoNextNews ? 1 : 0.5 }}
              >
                <img src="/arrow.svg" alt="Стрелка" />
              </div>
            </div>
          </div>
          {news.length > 0 && (
            <div className="block news-card" key={`news-${news[currentNewsIndex].id}`}>
              <img
                src={news[currentNewsIndex].image ? `/${news[currentNewsIndex].image}.png` : "/news1.png"}
                alt="Новость"
              />
              <h4 className="medium-20px">{news[currentNewsIndex].title}</h4>
              <p className="regular-16px">{news[currentNewsIndex].description}</p>
            </div>
          )}
        </div>
      </section>
      <section className="students" id='students'>
        <div className="wrapper">
          <h3>СТУДЕНТАМ</h3>
          <div className="grid">
            <div className="column">
              <h2 className="first-title">Программы обучения</h2>

              {/* Корпус 1 */}
              <div className="building-block">
                <h3
                  className="building-title interactive-title"
                  onClick={() => setIsCorp1Open(!isCorp1Open)}
                >
                  <span>&bull; №1 Корпус</span>
                  <button
                    className={`close-btn ${!isCorp1Open ? 'closed' : ''}`}
                    aria-label="Переключить"
                  >
                    &times;
                  </button>
                </h3>
                <div className={`accordion-content ${isCorp1Open ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="program-item">
                      <p>Химия с нуля или новые мыслительные стратегии</p>
                      <p className="teacher-name">- Преподаватели: А.В. Куренкова, Т.В. Свистунова</p>
                    </div>
                    <div className="program-item">
                      <p>Основы социально-экономической географии и её современные особенности</p>
                      <p className="teacher-name">- Преподаватель: Ф.Р. Хисамутдинова</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Корпус 2 */}
              <div className="building-block">
                <h3
                  className="building-title interactive-title"
                  onClick={() => setIsCorp2Open(!isCorp2Open)}
                >
                  <span>&bull; №2 Корпус</span>
                  <button
                    className={`close-btn ${!isCorp2Open ? 'closed' : ''}`}
                    aria-label="Переключить"
                  >
                    &times;
                  </button>
                </h3>
                <div className={`accordion-content ${isCorp2Open ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="programs-table-simple">
                      <div className="program-row">
                        <span>Школа здоровья</span>
                        <span className="teacher-col">Преподаватель: О.С. Сазонова</span>
                      </div>
                      <div className="program-row">
                        <span>Химия окружающей среды</span>
                        <span className="teacher-col">Преподаватель: О.С. Сазонова</span>
                      </div>
                      <div className="program-row">
                        <span>Экологическая безопасность на предприятии</span>
                        <span className="teacher-col">Преподаватель: А.В. Санкова</span>
                      </div>
                      <div className="program-row">
                        <span>Хлебные традиции: введение в профессию</span>
                        <span className="teacher-col">Преподаватель: Е.С. Лукьянова</span>
                      </div>
                      <div className="program-row">
                        <span>Профессиональное хлебопечение: опыт профессионалов</span>
                        <span className="teacher-col">Преподаватель: Е.С. Лукьянова</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* График задолженностей */}
            <div className="column">
              <h2
                className="first-title title-with-close interactive-title"
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
              >
                График ликвидации задолженностей
                <button
                  className={`close-btn ${!isScheduleOpen ? 'closed' : ''}`}
                  aria-label="Переключить"
                >
                  &times;
                </button>
              </h2>
              <div className={`accordion-content ${isScheduleOpen ? 'open' : ''}`}>
                <div className="accordion-inner">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>Преподаватель</th>
                        <th>День недели</th>
                        <th>Время</th>
                        <th>Аудитория</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Е.С. Лукьянова</td><td>Понедельник</td><td>11:40 &ndash; 12:40</td><td>2102</td></tr>
                      <tr><td>О.С. Сазонова</td><td>Понедельник</td><td>13:30 &ndash; 14:30</td><td>2100</td></tr>
                      <tr><td>О.М. Копотова</td><td>Понедельник</td><td>15:10 &ndash; 16:45</td><td>1205</td></tr>
                      <tr><td>А.В. Куренкова</td><td>Вторник</td><td>15:00 &ndash; 16:00</td><td>1107А</td></tr>
                      <tr><td>Т.В. Свистунова</td><td>Вторник</td><td>13:25 &ndash; 14:25</td><td>1305б</td></tr>
                      <tr><td>О.В. Ильина<br /><span className="sub-text">(совм)</span></td><td>Вторник</td><td>15:00 &ndash; 17:00</td><td>2329</td></tr>
                      <tr><td>Н.Г. Догарева<br /><span className="sub-text">(совм)</span></td><td>Четверг</td><td>11:40 &ndash; 12:40</td><td>20604</td></tr>
                      <tr><td>Ф.Р. Хисамутдинова</td><td>Пятница</td><td>15:00 &ndash; 16:00</td><td>1107</td></tr>
                      <tr><td>А.В. Санкова</td><td>Суббота</td><td>09:45 &ndash; 10:45</td><td>2322</td></tr>
                      <tr><td>В.Н. Егорова</td><td>Суббота</td><td>15:00 &ndash; 16:00</td><td>2209</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

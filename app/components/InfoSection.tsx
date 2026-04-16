// components/InfoSection.tsx
"use client";

import React, { useState } from "react";

export default function InfoSection() {
  // По умолчанию всё скрыто (false)
  const [isCorp1Open, setIsCorp1Open] = useState(false);
  const [isCorp2Open, setIsCorp2Open] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <section className="info-section wrapper" id="students">
      <div className="info-grid">
        <div className="info-column">
          <h2 className="section-title">Программы обучения</h2>

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
        <div className="info-column">
          <h2
            className="section-title title-with-close interactive-title"
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

      <div className="address-block">
        <h4>Адрес ПЦК:</h4>
        <p>Адрес ПЦК: г. Оренбург, ул. Терешковой, 134, каб. 2315</p>
      </div>
    </section>
  );
}
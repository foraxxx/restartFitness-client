import React from 'react';
import Header from "../../shared/Header/Header.jsx";
import Footer from "../../shared/Footer/Footer.jsx";
import './Contacts.scss';

const Contacts = () => {
  return (
    <div className="contacts-page">
      <Header />
      <div className="contacts-container">
        {/*<h1 className="contacts-title">Контакты</h1>*/}

        <div className="contacts-info">
          <div className="contacts-details">
            <h2>Время работы</h2>
            <p>Пн–Пт: 07:00–23:00</p>
            <p>Сб–Вс: 09:00–21:00</p>

            <h2>Телефон и Email</h2>
            <p>Телефон: <a href="tel:+78162280121">+7 816 228-01-21</a></p>
            <p>Email: <a href="mailto:rs.fit@mail.ru">rs.fit@mail.ru</a></p>

            <h2>Мы в соцсетях</h2>
            <div className="contacts-socials">
              <a href="https://vk.com/restartfitnes" target="_blank" rel="noreferrer">VK</a>
            </div>
          </div>

          <div className="contacts-map">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A5b600000a0628522606a21fee05fbcd1654034606e3a64b281817089f68bfc11&amp;source=constructor"
              width="500" height="400" frameBorder="0"></iframe>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Contacts;

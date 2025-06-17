import React from 'react';
import { Layout, Row, Col } from 'antd';
import './Footer.scss';
import {NavLink} from "react-router-dom"
import {ADMINPANEL_ROUTE, CONTACTS_ROUTE, MEMBERSHIP_ROUTE, REVIEWS_ROUTE, SERVICES_ROUTE} from "../../utils/consts.js"

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="footer">
      <div className="footer-container">
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={12} md={8}>
            <h3>О нас</h3>
            <p>Restart Fitness — это современный фитнес-зал с профессиональными тренерами и лучшим оборудованием. Мы помогаем вам достигать ваших целей.</p>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <h3>Контакты</h3>
            <p>Телефон: +7 816 228-01-21</p>
            <p>Email: rs.fit@mail.ru</p>
            <p>Адрес: г. Великий Новгород, проспект Мира 21А</p>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <h3>Навигация</h3>
            <NavLink to={SERVICES_ROUTE} style={{color: "white"}}>
              <p>Услуги</p>
            </NavLink>
            <NavLink to={REVIEWS_ROUTE} style={{color: "white"}}>
              <p>Отзывы</p>
            </NavLink>
            <NavLink to={CONTACTS_ROUTE} style={{color: "white"}}>
              <p>Контакты</p>
            </NavLink>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Restart Fitness. Все права защищены.</p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;

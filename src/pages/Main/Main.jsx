import React from 'react'
import Header from "../../shared/Header/Header.jsx"
import {NavLink} from "react-router-dom"
import {SERVICES_ROUTE} from "../../utils/consts.js"
import './main.scss'
import Section from "../../shared/Section/Section.jsx"
import Grid4 from "../../shared/Grid4/Grid4.jsx"
import PlusCard from "../../shared/PlusCard/PlusCard.jsx"
import {Carousel, Col, FloatButton, Image, Row} from 'antd'
import calendarIcon from '/calendar.svg'
import promotionIcon from '/promotion.svg'
import trainerIcon from '/trainer.svg'
import dumbellIcon from '/dumbell.svg'
import Gallery from "../../shared/Gallery/Gallery.jsx"
import FAQ from "../../shared/FAQ/FAQ.jsx"
import Footer from "../../shared/Footer/Footer.jsx"

const Main = (props) => {

  const contentStyle = {
    height: '800px',
    color: '#fff',
    // lineHeight: '800px',
    textAlign: 'center',
    background: '#364d79',
  };
  return (
    <>
      <Header/>
      <section className="main__slogan">
        <h1 className="main__slogan-title">Начни путь к лучшей версии себя!</h1>
        <NavLink to={SERVICES_ROUTE} className="main__slogan-link">
          Купить абонемент
        </NavLink>
      </section>
      <Section title="Почему выбирают ReStart фитнес?">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <PlusCard
              img={dumbellIcon}
              title="Современное оборудование"
              description="Зал оснащен новейшими тренажерами, которые помогут вам достичь любых фитнес-целей"
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <PlusCard
              img={trainerIcon}
              title="Профессиональные тренеры"
              description="Команда сертифицированных специалистов, которые помогут разработать индивидуальный план тренировок"
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <PlusCard
              img={calendarIcon}
              title="Удобное расписание"
              description="Зал открыт с раннего утра до позднего вечера, чтобы вы могли тренироваться в удобное для вас время"
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <PlusCard
              img={promotionIcon}
              title="Постоянные акции и бонусы"
              description="Выгодные предложения на абонементы и персональные тренировки для новых и постоянных клиентов"
            />
          </Col>
        </Row>
      </Section>
      <Gallery/>
      <FAQ/>
      <Footer/>
      <FloatButton.BackTop visibilityHeight={500}/>
    </>
  )
}

export default Main
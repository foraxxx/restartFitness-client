import React, { useContext, useState } from 'react'
import './header.scss'
import { Link, NavLink, useLocation } from "react-router-dom"
import {
  ADMINPANEL_ROUTE,
  AUTH_ROUTE,
  CONTACTS_ROUTE,
  MAIN_ROUTE,
  NEWS_ROUTE,
  PROFILE_ROUTE,
  REVIEWS_ROUTE,
  SERVICES_ROUTE
} from "../../utils/consts.js"
import logo from '/logo.svg'
import { Context } from "../../main.jsx"
import { observer } from "mobx-react-lite"

const Header = observer(() => {
  const { userStore } = useContext(Context)
  const location = useLocation()
  const isAuthPage = location.pathname === AUTH_ROUTE

  const [burgerOpen, setBurgerOpen] = useState(false)

  const toggleBurger = () => setBurgerOpen(!burgerOpen)
  const closeBurger = () => setBurgerOpen(false)

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to={MAIN_ROUTE} onClick={closeBurger}>
          <img src={logo} alt="Logo" className="header__logo" />
        </NavLink>

        {/* Бургер кнопка */}
        <button
          className={`header__burger ${burgerOpen ? 'header__burger--open' : ''}`}
          onClick={toggleBurger}
          aria-label="Toggle menu"
          aria-expanded={burgerOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Навигация, скрывается на мобилках */}
        <nav className={`header__menu ${burgerOpen ? 'header__menu--open' : ''}`}>
          <NavLink to={MAIN_ROUTE} onClick={closeBurger} className={({ isActive }) =>
            `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}>
            ГЛАВНАЯ
          </NavLink>
          <NavLink to={NEWS_ROUTE} onClick={closeBurger} className={({ isActive }) =>
            `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}>
            НОВОСТИ
          </NavLink>
          <NavLink to={SERVICES_ROUTE} onClick={closeBurger} className={({ isActive }) =>
            `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}>
            УСЛУГИ
          </NavLink>
          <NavLink to={CONTACTS_ROUTE} onClick={closeBurger} className={({ isActive }) =>
            `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}>
            КОНТАКТЫ
          </NavLink>
          <NavLink to={REVIEWS_ROUTE} onClick={closeBurger} className={({ isActive }) =>
            `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}>
            ОТЗЫВЫ
          </NavLink>
          {userStore.user.role === 'Администратор' && (
            <NavLink to={ADMINPANEL_ROUTE} onClick={closeBurger} className={({ isActive }) =>
              `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}>
              АДМИНПАНЕЛЬ
            </NavLink>
          )}
        </nav>

        {/* Действия: если авторизован - показываем иконки, иначе кнопку Войти */}
        {userStore.isAuth ? (
          <div className="header__actions">
            <button className="header__link header__notifications" aria-label="Notifications">
              <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.28016 3.39983C10.8595 3.39983 12.3741 4.00664 13.4909 5.08678C14.6076 6.16691 15.235 7.63189 15.235 9.15943C15.235 11.5222 15.7258 13.2915 16.3623 14.5925C17.1755 16.2549 17.582 17.0861 17.5594 17.2759C17.5331 17.4975 17.4994 17.5585 17.332 17.6878C17.1886 17.7988 16.475 17.7988 15.0477 17.7988H3.51256C2.08531 17.7988 1.37169 17.7988 1.22824 17.6878C1.06089 17.5585 1.02727 17.4975 1.00089 17.2759C0.978277 17.0861 1.38487 16.2549 2.19806 14.5925C2.83453 13.2915 3.32535 11.5222 3.32535 9.15943C3.32535 7.63189 3.95273 6.16691 5.06947 5.08678C6.18621 4.00664 7.70082 3.39983 9.28016 3.39983ZM9.28016 3.39983V1M6.3623 21.3986C7.14107 22.1465 8.16408 22.6004 9.28457 22.6004C10.405 22.6004 11.428 22.1465 12.2068 21.3986"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <NavLink to={PROFILE_ROUTE} className={({ isActive }) =>
              `header__profile header__link ${isActive ? 'header__profile--active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M9 8.99999C7.00515 8.99999 5.38286 7.38539 5.38286 5.39999C5.38286 3.41459 7.00515 1.79999 9 1.79999C10.9949 1.79999 12.6171 3.41459 12.6171 5.39999C12.6171 7.38539 10.9949 8.99999 9 8.99999ZM12.3983 9.60566C13.8334 8.45636 14.6699 6.59784 14.3624 4.56294C14.0052 2.20224 12.0321 0.313179 9.65019 0.0377792C6.36311 -0.342921 3.5743 2.20409 3.5743 5.39999C3.5743 7.10099 4.36644 8.61656 5.6017 9.60566C2.56692 10.7406 0.351417 13.4055 0.00417066 17.0019C-0.0464687 17.5338 0.370411 18 0.907556 18C1.36784 18 1.7603 17.6544 1.80099 17.1981C2.16361 13.1814 5.25355 10.8 9 10.8C12.7465 10.8 15.8364 13.1814 16.199 17.1981C16.2397 17.6544 16.6322 18 17.0925 18C17.6296 18 18.0465 17.5338 17.9958 17.0019C17.6486 13.4055 15.4331 10.7406 12.3983 9.60566Z"
                      fill="white" />
              </svg>
            </NavLink>
          </div>
        ) : (
          <NavLink to={AUTH_ROUTE} className="header__logIn" style={{ visibility: isAuthPage ? 'hidden' : 'visible' }}>
            ВОЙТИ
          </NavLink>
        )}
      </div>

      {/* Закрываем меню при клике вне */}
      {burgerOpen && <div className="header__overlay" onClick={closeBurger} />}
    </header>
  )
})

export default Header

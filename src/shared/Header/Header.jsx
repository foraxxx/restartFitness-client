import React, {useContext} from 'react'
import './header.scss'
import {Link, NavLink} from "react-router-dom"
import {
  CONTACTS_ROUTE, LOGIN_ROUTE,
  MAIN_ROUTE,
  NEWS_ROUTE,
  PROFILE_ROUTE,
  REVIEWS_ROUTE,
  SERVICES_ROUTE
} from "../../utils/consts.js"
import logo from '/logo.svg'
import {Context} from "../../main.jsx"
import {observer} from "mobx-react-lite"

const Header = observer((props) => {
  const {userStore} = useContext(Context)

  return (
    <header className="header">
      <NavLink to={MAIN_ROUTE}>
        <img src={logo} alt="Logo" className="header__logo"/>
      </NavLink>

      <nav className="header__menu">
        <NavLink to={MAIN_ROUTE} className={({ isActive }) =>
          `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}
        >
          ГЛАВНАЯ
        </NavLink>
        <NavLink to={NEWS_ROUTE} className={({ isActive }) =>
          `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}
        >
          НОВОСТИ
        </NavLink>
        <NavLink to={SERVICES_ROUTE} className={({ isActive }) =>
          `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}
        >
          УСЛУГИ
        </NavLink>
        <NavLink to={CONTACTS_ROUTE} className={({ isActive }) =>
          `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}
        >
          КОНТАКТЫ
        </NavLink>
        <NavLink to={REVIEWS_ROUTE} className={({ isActive }) =>
          `header__menu-item header__link ${isActive ? 'header__menu-item--active' : ''}`}
        >
          ОТЗЫВЫ
        </NavLink>
      </nav>

      {userStore.isAuth ?
        <div className="header__actions">
          <NavLink to={PROFILE_ROUTE} className={({isActive}) =>
            `header__profile header__link ${isActive ? 'header__profile--active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M9 8.99999C7.00515 8.99999 5.38286 7.38539 5.38286 5.39999C5.38286 3.41459 7.00515 1.79999 9 1.79999C10.9949 1.79999 12.6171 3.41459 12.6171 5.39999C12.6171 7.38539 10.9949 8.99999 9 8.99999ZM12.3983 9.60566C13.8334 8.45636 14.6699 6.59784 14.3624 4.56294C14.0052 2.20224 12.0321 0.313179 9.65019 0.0377792C6.36311 -0.342921 3.5743 2.20409 3.5743 5.39999C3.5743 7.10099 4.36644 8.61656 5.6017 9.60566C2.56692 10.7406 0.351417 13.4055 0.00417066 17.0019C-0.0464687 17.5338 0.370411 18 0.907556 18C1.36784 18 1.7603 17.6544 1.80099 17.1981C2.16361 13.1814 5.25355 10.8 9 10.8C12.7465 10.8 15.8364 13.1814 16.199 17.1981C16.2397 17.6544 16.6322 18 17.0925 18C17.6296 18 18.0465 17.5338 17.9958 17.0019C17.6486 13.4055 15.4331 10.7406 12.3983 9.60566Z"
                    fill="white"/>
            </svg>
            ПРОФИЛЬ
          </NavLink>
          <button className="header__button-notification">
            <svg width="23" height="30" viewBox="0 0 25 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.5 4.33304C14.6935 4.33304 16.7971 5.17581 18.3481 6.67598C19.8991 8.17613 20.7704 10.2108 20.7704 12.3323C20.7704 15.6139 21.4521 18.0711 22.3361 19.8782C23.4655 22.1869 24.0302 23.3413 23.9988 23.605C23.9622 23.9128 23.9154 23.9975 23.683 24.1771C23.4837 24.3313 22.4926 24.3313 20.5103 24.3313H4.4896C2.50734 24.3313 1.51623 24.3313 1.31699 24.1771C1.08457 23.9975 1.03788 23.9128 1.00124 23.605C0.96983 23.3413 1.53453 22.1869 2.66394 19.8782C3.54791 18.0711 4.22959 15.6139 4.22959 12.3323C4.22959 10.2108 5.10094 8.17613 6.65193 6.67598C8.20293 5.17581 10.3065 4.33304 12.5 4.33304ZM12.5 4.33304V1M8.44749 29.3308C9.52909 30.3696 10.9499 31 12.5061 31C14.0622 31 15.483 30.3696 16.5647 29.3308"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        :
        <NavLink to={LOGIN_ROUTE} className={({isActive}) =>
          `header__profile header__link ${isActive ? 'header__profile--active' : ''}`}
        >
          ЛИЧНЫЙ КАБИНЕТ
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 5L19 10L14 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavLink>
      }

    </header>
  )
})

export default Header
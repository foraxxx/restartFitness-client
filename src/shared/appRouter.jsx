import React, {useContext, useState} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {
  ADMIN_ROUTE,
  CONTACTS_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE, MEMBERSHIP_ROUTE,
  NEWS_ROUTE, PROFILE_ROUTE,
  REVIEWS_ROUTE,
  SERVICES_ROUTE,
  SIGNUP_ROUTE, TRAINER_ROUTE
} from "../utils/consts.js"
import Login from "../pages/Login/Login.jsx"
import SignUp from "../pages/SignUp/SignUp.jsx"
import Main from "../pages/Main/Main.jsx"
import News from "../pages/News/News.jsx"
import Services from "../pages/Services/Services.jsx"
import Contacts from "../pages/Contacts/Contacts.jsx"
import Reviews from "../pages/Reviews/Reviews.jsx"
import Trainer from "../pages/Trainer/Trainer.jsx"
import Membership from "../pages/Membership/Membership.jsx"
import Profile from "../pages/Profile/Profile.jsx"
import Admin from "../pages/Admin/Admin.jsx"
import {Context} from "../main.jsx"
import {observer} from "mobx-react-lite"

const AppRouter = (props) => {
  const {userStore} = useContext(Context)
  console.log(userStore)
  const GuestRoute = ({ children }) => {
    return userStore.isAuth ? <Navigate to={MAIN_ROUTE} /> : children
  }

  function ProtectedRoute({ children, allowedRoles }) {
    if (!userStore.isAuth) {
      return <Navigate to={LOGIN_ROUTE} />
    }

    if (!allowedRoles.includes(userStore.user.role)) {
      return <Navigate to={MAIN_ROUTE} />
    }

    return children
  }

  return (
    <Routes>
      {/*Публичные роуты*/}
      <Route path={MAIN_ROUTE} element={<Main/>}/>
      <Route path={NEWS_ROUTE} element={<News/>}/>
      <Route path={SERVICES_ROUTE} element={<Services/>}/>
      <Route path={CONTACTS_ROUTE} element={<Contacts/>}/>
      <Route path={REVIEWS_ROUTE} element={<Reviews/>}/>
      <Route path={TRAINER_ROUTE} element={<Trainer/>}/>
      <Route path={MEMBERSHIP_ROUTE} element={<Membership/>}/>

      {/*Роуты для неавторизованных*/}
      <Route
        path={LOGIN_ROUTE}
        element={
        <GuestRoute>
          <Login/>
        </GuestRoute>
      }
      />
      <Route
        path={SIGNUP_ROUTE}
        element={
          <GuestRoute>
            <SignUp/>
          </GuestRoute>
        }
      />

    {/*Роуты авторизованных*/}
      <Route
        path={PROFILE_ROUTE}
        element={
          <ProtectedRoute allowedRoles={['Пользователь', 'Администратор', 'Тренер']}>
            <Profile/>
          </ProtectedRoute>
        }
      />

      {/* Маршруты для админов */}
      <Route
        path={ADMIN_ROUTE}
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin/>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={MAIN_ROUTE}/>}/>
    </Routes>
  )
}

export default observer(AppRouter)
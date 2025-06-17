// src/pages/Auth/AuthPage.jsx
import React, { useContext, useState } from 'react'
import { Tabs } from 'antd'
import Header from "../../shared/Header/Header.jsx"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Context } from "../../main.jsx"
import { MAIN_ROUTE } from "../../utils/consts.js"
import AuthForm from "../../shared/AuthForm/AuthForm.jsx"


const AuthPage = () => {
  const navigate = useNavigate()
  const { userStore } = useContext(Context)
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  const onLoginFinish = async (values) => {
    try {
      setLoginError(null);  // сброс ошибки при новом запросе
      await userStore.login(values.number);
      navigate(MAIN_ROUTE);
    } catch (error) {
      if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError('Произошла ошибка при входе');
      }
    }
  }

  const onRegisterFinish = async (values) => {
    try {
      setRegisterError(null); // сброс ошибки
      await userStore.registration(values.name, values.surName, values.number);
      navigate(MAIN_ROUTE);
    } catch (error) {
      if (error.response?.data?.message) {
        setRegisterError(error.response.data.message);
      } else {
        setRegisterError('Произошла ошибка при регистрации');
      }
    }
  }

  const items = [
    {
      key: 'login',
      label: 'Авторизация',
      children: (
        <AuthForm
          mode="login"
          onFinish={onLoginFinish}
          formError={loginError}
        />
      ),
    },
    {
      key: 'signup',
      label: 'Регистрация',
      children: (
        <AuthForm
          mode="signup"
          onFinish={onRegisterFinish}
          formError={registerError}
        />
      ),
    },
  ]

  return (
    <>
      <Header />
      <div className="auth-page-container">
        <Tabs defaultActiveKey="login" centered items={items} />
      </div>
    </>
  )
}

export default observer(AuthPage)

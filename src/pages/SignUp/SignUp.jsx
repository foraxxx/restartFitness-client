import React, {useContext} from 'react'
import { Form, Input, Button } from 'antd'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {Context} from "../../main.jsx"
import Header from "../../shared/Header/Header.jsx"
import {LOGIN_ROUTE, MAIN_ROUTE} from "../../utils/consts.js"
import {observer} from "mobx-react-lite"
import './SignIn.scss'

const SignUp = (props) => {
  const navigate = useNavigate();
  const {userStore} = useContext(Context)

  const onFinish = (values) => {
    userStore.registration(values.name, values.surName, values.number)
    navigate(MAIN_ROUTE);
  }
  return (
    <>
      <Header />
      <Form
        name="phone-form"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#88BC31'}}>Регистрация</h1>

        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите ваше имя!',
            },
          ]}
        >
          <Input
            placeholder="Имя"
          />
        </Form.Item>

        <Form.Item
          name="surName"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите вашу фамилию!',
            },
          ]}
        >
          <Input
            placeholder="Фамилия"
          />
        </Form.Item>

        <Form.Item
          name="number"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите номер телефона!',
            },
            {
              pattern: /^[0-9]{11}$/,
              message: 'Неверный номер телефона!',
            },
          ]}
        >
          <Input
            placeholder="Номер телефона"
            type="tel"
            maxLength={11}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block className="button">
            Зарегистрироваться
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <NavLink to={LOGIN_ROUTE} className="link">Авторизация</NavLink>
        </Form.Item>
      </Form>
    </>
  )
}

export default observer(SignUp)
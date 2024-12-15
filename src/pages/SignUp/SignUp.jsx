import React, {useContext} from 'react'
import { Form, Input, Button } from 'antd'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {Context} from "../../main.jsx"
import Header from "../../shared/Header/Header.jsx"
import {LOGIN_ROUTE, MAIN_ROUTE} from "../../utils/consts.js"
import {observer} from "mobx-react-lite"

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
        <h1 style={{ textAlign: 'center' }}>Регистрация</h1>

        <Form.Item
          name="name"
          label="Имя"
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
          label="Фамилия"
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
          label="Номер телефона"
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
          <Button type="primary" htmlType="submit" block>
            Отправить
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <NavLink to={LOGIN_ROUTE}>Авторизация</NavLink>
        </Form.Item>
      </Form>
    </>
  )
}

export default observer(SignUp)
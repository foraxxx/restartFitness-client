import React, {useContext} from 'react'
import { Button, Form, Input, InputNumber } from 'antd';
import Header from "../../shared/Header/Header.jsx"
import {Link, useNavigate} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {Context} from "../../main.jsx"
import {MAIN_ROUTE, SIGNUP_ROUTE} from "../../utils/consts.js"
import './login.scss'

const Login = (props) => {
  const navigate = useNavigate();
  const {userStore} = useContext(Context)

  const onFinish = (values) => {
    userStore.login(values.number)

    navigate(MAIN_ROUTE);
  }
  return (
    <>
      <Header/>
      <Form
        name="phone-form"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
          margin: '0 auto', // Центрируем форму
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#88BC31'}}>Авторизация</h1> {/* Заголовок */}

        <Form.Item
          name="number"
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
            {
              pattern: /^[0-9]{11}$/,
              message: 'Invalid phone number!',
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
          <Button type="primary" htmlType="submit" block className='button'>
            Войти
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Link to={SIGNUP_ROUTE} className='link'>Регистрация</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default observer(Login)
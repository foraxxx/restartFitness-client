// src/pages/Auth/AuthForm.jsx
import React from 'react'
import { Form, Input, Button } from 'antd'
import './AuthForm.scss'

const AuthForm = ({ mode, onFinish, formError }) => {

  return (
    <Form
      name={mode === 'login' ? "login-form" : "signup-form"}
      onFinish={onFinish}
      layout="vertical"
      className="auth-form"
    >
      {mode === 'signup' && (
        <>
          <Form.Item
            label={<span style={{ color: 'white' }}>Имя</span>}
            name="name"
            rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
          >
            <Input className="form__input" placeholder="Введите имя" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'white' }}>Фамилия</span>}
            name="surName"
            rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
          >
            <Input className="form__input" placeholder="Введите фамилию" />
          </Form.Item>
        </>
      )}

      <Form.Item
        label={<span style={{ color: 'white' }}>Номер телефона</span>}
        name="number"
        rules={[
          { required: true, message: 'Пожалуйста, введите номер телефона!' },
          { pattern: /^[0-9]{11}$/, message: 'Неверный номер телефона!' },
        ]}
      >
        <Input className="form__input" placeholder="Введите номер телефона" maxLength={11} type="tel" />
      </Form.Item>

      {formError && <div className="form-error">{formError}</div>}

      <Form.Item>
        <Button type="primary" htmlType="submit" block className="submit-button">
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AuthForm

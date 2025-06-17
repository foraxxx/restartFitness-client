import React, { useState, useContext, useEffect } from "react";
import Header from "../../shared/Header/Header.jsx";
import "./AdminPanel.scss";
import UserList from "../../shared/UserList/UserList.jsx";
import { Context } from "../../main.jsx";
import { observer } from "mobx-react-lite";
import styles from "../Reviews/Reviews.module.scss"
import {Button, Modal, Form, Input, Select, message} from "antd"
import {MAIN_ROUTE} from "../../utils/consts.js"
import AdminMemberships from "../../shared/AdminMemberships/AdminMemberhips.jsx"
import AdminReviews from "../../shared/AdminReviews/AdminReviews.jsx"

const AdminPanel = observer(() => {
  const [activeTab, setActiveTab] = useState("users");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { userStore } = useContext(Context);
  const users = userStore.users || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredUsers = users.filter((user) => {
    console.log(roleFilter)
    const matchesRole = roleFilter === "all" || user.Role.name === roleFilter;
    const matchesSearch =
      user.surName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  useEffect(() => {
    userStore.fetchUsers();
  }, [userStore]);

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCreateUser = async (values) => {
    try {
      await userStore.create({name: values.name, surName: values.surName, number: values.number, role: values.role});
      form.resetFields();
      setIsModalOpen(false);
      await userStore.fetchUsers();
      message.success('Пользователь создан')
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Произошла ошибка при регистрации');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="admin-panel">
        <div className="sidebar">
          <h2 className="sidebar-title">Админ-панель</h2>
          <ul className="menu">
            <li
              className={`menu-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Пользователи
            </li>
            <li
              className={`menu-item ${activeTab === "memberships" ? "active" : ""}`}
              onClick={() => setActiveTab("memberships")}
            >
              Абонементы
            </li>
            <li
              className={`menu-item ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Отзывы
            </li>
            <li
              className={`menu-item ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              Аналитика
            </li>
          </ul>
        </div>

        <div className="content">
          {activeTab === "users" && (
            <div>
              <h3 className="content-title">Список пользователей</h3>

              <div className="filters">
                <input
                  type="text"
                  placeholder="Поиск по фамилии или номеру"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="role-select"
                >
                  <option value="all">Все роли</option>
                  <option value="Пользователь">Пользователи</option>
                  <option value="Тренер">Тренеры</option>
                  <option value="Администратор">Админы</option>
                </select>

                {/*<div className={styles.buttonWrapper}>*/}
                  <Button type="primary" onClick={showModal}>
                    Создать пользователя
                  </Button>
                {/*</div>*/}
              </div>

              <UserList usersList={filteredUsers}/>
            </div>
          )}

          {activeTab === "memberships" && (
            <div>
              <AdminMemberships />
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <AdminReviews/>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h3 className="content-title">Аналитика</h3>
              <p>Заглушка: сюда можно добавить графики, метрики и статистику.</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Создание пользователя"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="name"
            label={<span style={{ color: 'white' }}>Имя</span>}
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="surName"
            label={<span style={{ color: 'white' }}>Фамилия</span>}
            rules={[{ required: true, message: "Введите фамилию" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="number"
            label={<span style={{ color: 'white' }}>Номер телефона</span>}
            rules={[
              { required: true, message: "Введите номер телефона" },
              { pattern: /^[0-9]{11}$/, message: 'Неверный номер телефона!' },
            ]}
          >
            <Input maxLength={11} type="tel"/>
          </Form.Item>

          <Form.Item
            name="role"
            label={<span style={{ color: 'white' }}>Роль</span>}
            rules={[{ required: true, message: "Выберите роль" }]}
          >
            <Select placeholder="Выберите роль">
              <Select.Option value="Пользователь">Пользователь</Select.Option>
              <Select.Option value="Тренер">Тренер</Select.Option>
              <Select.Option value="Администратор">Администратор</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default AdminPanel;

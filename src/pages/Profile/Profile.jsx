import React, {useContext, useEffect, useState} from 'react'
import Header from "../../shared/Header/Header.jsx"
import {observer} from "mobx-react-lite"
import {Context} from "../../main.jsx"
import {useNavigate} from "react-router-dom"
import {MAIN_ROUTE} from "../../utils/consts.js"
import './profile.scss'

const Profile = (props) => {
  const navigate = useNavigate();
  const {userStore, userMembershipStore} = useContext(Context)
  const [memberships, setMemberships] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await userMembershipStore.getUserAll();
      setMemberships(response)
    };

    fetchData();
  }, [userMembershipStore])

  const logout = () => {
    userStore.logout()
    navigate(MAIN_ROUTE)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();  // Получаем год
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Получаем месяц и добавляем ведущий ноль
    const day = String(date.getDate()).padStart(2, '0');  // Получаем день и добавляем ведущий ноль

    return `${year}.${month}.${day}`;  // Форматируем в строку
  };

  // memberships.map((membership) => console.log(membership.id))
  console.log(userMembershipStore.userMemberships)
  return (
    <div className="profile">
      <Header/>

      <div className="profile-info">
        <div className="profile-block">
          <h1 className="profile-title">Профиль пользователя</h1>
          <div className="user-details">
            <p><strong>Номер:</strong> {userStore.user.number}</p>
            <p><strong>Роль:</strong> {userStore.user.role}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>Выйти</button>
      </div>

      <div className="user-memberships">
        <h2>Мои абонементы</h2>
        {memberships.length > 0 ? (
          <div className="membership-list">
            {memberships.map((membership) => {
              console.log(membership)
              return (

              <div className="membership-card" key={membership.id}>
                <h3>{membership.name}</h3>
                <p><strong>Срок действия:</strong> {`${formatDate(membership.dateStart)} - ${formatDate(membership.dateEnd)}`}</p>
              </div>
            )})}
          </div>
        ) : (
          <p>У вас нет абонементов.</p>
        )}
      </div>
    </div>
  )
}

export default observer(Profile)
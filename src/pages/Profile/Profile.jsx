import React, {useContext, useState} from 'react'
import Header from "../../shared/Header/Header.jsx"
import {observer} from "mobx-react-lite"
import {Context} from "../../main.jsx"
import {useNavigate} from "react-router-dom"
import {MAIN_ROUTE} from "../../utils/consts.js"

const Profile = (props) => {
  const navigate = useNavigate();
  const {userStore} = useContext(Context)

  const logout = () => {
    userStore.logout()
    navigate(MAIN_ROUTE)
  }

  return (
    <div>
      <Header/>
      <div>
        <p>{userStore.user.id}</p>
        <p>{userStore.user.number}</p>
        <p>{userStore.user.role}</p>
      </div>
      <button onClick={logout}>выйти</button>
    </div>
  )
}

export default observer(Profile)
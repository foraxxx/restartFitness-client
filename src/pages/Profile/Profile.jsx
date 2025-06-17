import React, {useContext, useEffect, useRef, useState} from 'react'
import Header from "../../shared/Header/Header.jsx"
import {observer} from "mobx-react-lite"
import {Context} from "../../main.jsx"
import {useNavigate} from "react-router-dom"
import {MAIN_ROUTE} from "../../utils/consts.js"
import './profile.scss'
import ProfileInfo from "../../shared/ProfileInfo/ProfileInfo.jsx"
import MyMemberships from "../../shared/MyMemberships/MyMemberships.jsx"
import { Tour } from 'antd';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const membershipsRef = useRef(null);
  const [openTour, setOpenTour] = useState(false);
  const membershipCardRef = useRef(null);

  const tourSteps = [
    {
      title: 'Ваши абонементы',
      description: 'Здесь вы можете просматривать свои абонементы и управлять ими.',
      target: () => membershipsRef.current,
    },
    {
      title: 'Абонемент',
      target: () => membershipCardRef.current,
      description: 'Это ваша активная подписка.',
    },
  ];

  useEffect(() => {
    const shouldStartTour = localStorage.getItem('startMembershipTour') === 'true';
    if (shouldStartTour) {
      setOpenTour(true);
      localStorage.removeItem('startMembershipTour');
    }
  }, []);


  return (
    <>
      <Header/>

      <div className="profile-panel">
        <div className="sidebar">
          <h2 className="sidebar-title">Личный кабинет</h2>
          <ul className="menu">
            <li
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Профиль
            </li>
            <li
              ref={membershipsRef}
              className={`menu-item ${activeTab === "memberships" ? "active" : ""}`}
              onClick={() => setActiveTab("memberships")}
            >
              Мои абонементы
            </li>
          </ul>
        </div>

        <div className="content">
          {activeTab === "profile" && (
            <div>
              <h3 className="content-title">Профиль пользователя</h3>
              <ProfileInfo/>
            </div>
          )}
          {activeTab === "memberships" && (
            <div>
              <h3 className="content-title">Мои абонементы</h3>
              <MyMemberships/>
            </div>
          )}
        </div>
      </div>
      {/*<Tour open={openTour} onClose={() => setOpenTour(false)} steps={tourSteps} />*/}

    </>
  )
}

export default observer(Profile)
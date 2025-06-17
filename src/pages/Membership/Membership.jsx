import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../main.jsx';
import Header from '../../shared/Header/Header.jsx';
import { observer } from 'mobx-react-lite';
import PaymentsService from '../../services/PaymentsService';
import './Membership.scss';
import {message} from "antd"

const Membership = () => {
  const { id } = useParams();
  const { membershipStore, userStore } = useContext(Context);
  const [membership, setMembership] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const data = await membershipStore.getOne(id);
      setMembership(data);
    };
    fetchData();
  }, [id, membershipStore]);

  const handleBuy = async () => {
    if (!membership) return;

    try {
      const paymentData = {
        amount: membership.price,
        membershipId: membership.id,
        paymentMethod: 'Банковская карта',
        type: 'Абонемент',
      };

      const data = await PaymentsService.createPayment(paymentData);
      console.log('data:', data);

      if (!localStorage.getItem('hasSeenMembershipTour')) {
        localStorage.setItem('startMembershipTour', 'true');
        localStorage.setItem('hasSeenMembershipTour', 'true');
      }
      window.location.href = data.confirmation_url;
    } catch (error) {
      message.error('У вас уже есть запланированный абонемент');
    }
  };

  if (!membership) return <div>Загрузка...</div>;

  return (
    <div>
      <Header />
      <div className="membership-container">
        <div className="membershipCard">
          <h1 className="membershipTitle">{membership.name}</h1>
          <p className="membershipDescription">{membership.description}</p>
          <div className="characters">
            <div className="membershipRow">
              <span>Стоимость:</span>
              <span className="membershipPrice">{membership.price} ₽</span>
            </div>
            <div className="membershipRow">
              <span>Длительность:</span>
              <span>{membership.durationDays} дней</span>
            </div>
            <div className="membershipRow">
              <span>Возможность заморозки абонемента:</span>
              <span>{membership.isFreezing ? 'Да' : 'Нет'}</span>
            </div>
            {membership.isFreezing && (
              <div className="membershipRow">
                <span>Количество дней заморозки:</span>
                <span>{membership.freezingDays}</span>
              </div>
            )}
          </div>
          <div className="membership-button-wrapper">
            {userStore.isAuth
              ? <button className="membershipButton" onClick={handleBuy}>
                Купить абонемент
              </button>
              : <p className="notUser">Авторизуйтесь, чтобы купить абонемент</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Membership);

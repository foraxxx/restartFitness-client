import React, {useContext} from 'react'
import {Link, NavLink} from "react-router-dom"
import {MEMBERSHIP_ROUTE} from "../../utils/consts.js"
import './membershipCard.scss'
import {observer} from "mobx-react-lite"
import {Context} from "../../main.jsx"
import {message} from 'antd';

const MembershipCard = ({membership}) => {
  const {id, name, price, durationDays, isFreezing, freezingDays, MembershipType} = membership
  const{userMembershipStore, userStore} = useContext(Context)
  // const createUserMembership = async () => {
  //   try {
  //     await userMembershipStore.create(id)
  //     message.success('Абонемент успешно куплен')
  //   } catch(error) {
  //     message.success('Ошибка при покупке абонемента')
  //   }
  // }


  return (
    <article className="card-m">
      <div className="card-header">
        <span className="duration">{durationDays} дней ({MembershipType.name})</span>
      </div>
      <div className="card-body">
        <h3>{name}</h3>
        {isFreezing ? `Заморозка: ${freezingDays} дней` : `Заморозка: 0 дней`}
        <p className="price">{price} ₽</p>
        <Link to={`/membership/${membership.id}`} key={membership.id} style={{ textDecoration: "none" }} className="buy-btn">Подробнее</Link>
      </div>
    </article>
  )
}

export default observer(MembershipCard)
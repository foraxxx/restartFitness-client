import React from 'react'
import './trainerCard.scss'

const TrainerCard = ({trainer}) => {
  const {id, rating, vkLink, photo, User} = trainer
  // console.log(photo)
  return (
    <div className="trainer-card">

      <div className="trainer-image">
        <img src="../../../public/trainersPhoto/1.jpg" alt={`${User.name} ${User.surName}`}/>
      </div>
      <div className="trainer-details">
        <h3>{`${User.name} ${User.surName}`}</h3>
        <p>Тренер</p>
        <div className="trainer-rating">
          <span className="star">&#9733;</span>
          <span>{rating}</span>
        </div>
        <p className="trainer-price">от 1200 ₽</p>
      </div>
    </div>
  )
}

export default TrainerCard
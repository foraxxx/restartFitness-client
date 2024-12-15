import React from 'react'
import styles from './plusCard.module.scss'

const PlusCard = (props) => {
  const {img, title, description} = props
  return (
    <article className={styles.card}>
      <img className={styles.card__image} alt="" src={img} loading="lazy"/>
      <h3 className={styles.card__title}>{title}</h3>
      <p className={styles.card__description}>{description}</p>
    </article>
  )
}

export default PlusCard
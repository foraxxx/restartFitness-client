import React from 'react'
import styles from './section.module.scss'

const Section = (props) => {
  const {title, children} = props
  return (
    <section className={styles.section}>
      <h2 className={styles.section__title}>{title}</h2>
      {children}
    </section>
  )
}

export default Section
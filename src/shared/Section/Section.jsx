import React from 'react'
import styles from './section.module.scss'

const Section = (props) => {
  const {title, children} = props
  return (
    <section className={styles.section}>
      <p className={styles.title}>{title}</p>
      {children}
    </section>
  )
}

export default Section
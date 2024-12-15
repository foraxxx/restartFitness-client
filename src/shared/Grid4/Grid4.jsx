import React from 'react'
import styles from './grid4.module.scss'

const Grid4 = (props) => {
  const { children } = props
  return (
    <div className={styles.grid}>
      {children}
    </div>
  )
}

export default Grid4
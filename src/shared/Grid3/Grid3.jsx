import React from 'react'
import styles from './grid3.module.scss'


const Grid3 = (props) => {
  const {children} = props
  return (
    <div className={styles.grid}>
      {children}
    </div>
  )
}

export default Grid3
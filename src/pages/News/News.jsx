import React from 'react'
import Header from "../../shared/Header/Header.jsx"
import {observer} from "mobx-react-lite"

const News = (props) => {
  return (
    <div>
      <Header/>
    </div>
  )
}

export default observer(News)
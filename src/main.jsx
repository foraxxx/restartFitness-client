import {createContext} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/main.scss'
import UserStore from "./store/UserStore.js"

const userStore = new UserStore()

export const Context = createContext({
  userStore,
})

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{
    userStore
  }}>
  <App />
  </Context.Provider>
)

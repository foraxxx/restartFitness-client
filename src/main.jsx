import {createContext} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/main.scss'
import UserStore from "./store/UserStore.js"
import MembershipStore from "./store/MembershipStore.js"
import TrainerStore from "./store/TrainerStore.js"
import UserMembershipStore from "./store/UserMembershipsStore.js"

const userStore = new UserStore()
const membershipStore = new MembershipStore()
const trainerStore = new TrainerStore()
const userMembershipStore = new UserMembershipStore()

export const Context = createContext({
  userStore,
  membershipStore,
  trainerStore,
  userMembershipStore
})

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{
    userStore,
    membershipStore,
    trainerStore,
    userMembershipStore
  }}>
  <App />
  </Context.Provider>
)

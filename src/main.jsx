import {createContext} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/main.scss'
import UserStore from "./store/UserStore.js"
import MembershipStore from "./store/MembershipStore.js"
import TrainerStore from "./store/TrainerStore.js"
import UserMembershipStore from "./store/UserMembershipsStore.js"
import newsStore from "./store/NewsStore.js"
import reviewsStore from "./store/reviewsStore.js"

const userStore = new UserStore()
const membershipStore = new MembershipStore()
const trainerStore = new TrainerStore()
const userMembershipStore = new UserMembershipStore()

export const Context = createContext({
  userStore,
  membershipStore,
  trainerStore,
  userMembershipStore,
  newsStore,
  reviewsStore,
})

const container = document.getElementById('root');

if (!container._reactRootContainer) {
  const root = createRoot(container);
  root.render(
    <Context.Provider value={{
      userStore,
      membershipStore,
      trainerStore,
      userMembershipStore,
      newsStore,
      reviewsStore,
    }}>
      <App />
    </Context.Provider>
  );
}

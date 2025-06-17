import {BrowserRouter}  from 'react-router-dom'
import AppRouter from "./shared/appRouter.jsx"
import {useContext, useEffect} from "react"
import {Context} from "./main.jsx"
import {observer} from "mobx-react-lite"

function App() {
  const {userStore} = useContext(Context)

  useEffect(() => {
    userStore.checkAuth()
  }, [])

  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default observer(App)

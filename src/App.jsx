import {BrowserRouter}  from 'react-router-dom'
import AppRouter from "./shared/appRouter.jsx"

function App() {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App

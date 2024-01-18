
import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './Pages/Signup/SignUp'
import Login from './Pages/LoginIn/Login'
import Home from './Pages/Home/Home'

function App() {

  console.log("hello")
  return (
    
   <>
   <Routes>
    <Route path='/' element={<Home/>} /> 
   <Route path='/sign-up' element={<SignUp />} />
   <Route path='/log-in' element={<Login />} />
   </Routes>
   </>
  )
}

export default App


import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './userSide/Signup/SignUp'
import Login from './userSide/LoginIn/Login'
import Home from './userSide/Home/Home'
import UserProfile from './userSide/Profile/UserProfile'

function App() {

  console.log("hello")
  return (
    
   <>
   <Routes>
    <Route path='/' element={<Home/>} /> 
   <Route path='/sign-up' element={<SignUp />} />
   <Route path='/log-in' element={<Login />} />
   <Route path='/profile' element={<UserProfile />} />

   </Routes>
   </>
  )
}

export default App

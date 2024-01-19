
import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './userSide/Signup/SignUp'
import Login from './userSide/LoginIn/Login'
import Home from './userSide/Home/Home'
import UserProfile from './userSide/Profile/UserProfile'
import DashBoard from './adminSide/dashBoard/DashBoard'
import UserManagement from './adminSide/Usermanagement/UserManagement'

function App() {

  console.log("hello")
  return (
    
   <>
   <Routes>
    {/* userside */}
    <Route path='/' element={<Home/>} /> 
   <Route path='/sign-up' element={<SignUp />} />
   <Route path='/log-in' element={<Login />} />
   <Route path='/profile' element={<UserProfile />} />


   {/* adminSide */}
   <Route path='/dashboard' element={<DashBoard/>} /> 
   <Route path='/userManagement' element={<UserManagement/>} /> 


   </Routes>
   </>
  )
}

export default App

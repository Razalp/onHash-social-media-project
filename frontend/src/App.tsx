import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './userSide/Signup/SignUp';
import Login from './userSide/LoginIn/Login';
import Home from './userSide/Home/Home';
import UserProfile from './userSide/Profile/UserProfile';
import DashBoard from './adminSide/dashBoard/DashBoard';
import UserManagement from './adminSide/Usermanagement/UserManagement';
import ProtectedRoute from './ProtectedRoute'; 
import Createpost from './userSide/CreatePost/Createpost';
import Pro from './userSide/profilefortry/Pro';
import { Button } from './components/ui/button';
import Search from './userSide/Search/Search';
import SerachUserProfile from './userSide/SerachUserProfile/SerachUserProfile';

import Takefree from './userSide/Profile/Takefree';
import CustomCard3 from './userSide/Profile/CustomCard3 ';

// import { Button } from './'
function App() {
  return (
    <>

      <Routes>
        {/* userside */}
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/log-in' element={<Login />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/create' element={<Createpost />} />
        <Route path='/search' element={<Search />} />
        <Route path='/SerachUserProfile/:userId' element={<SerachUserProfile />} />
        <Route path='/pro' element={<CustomCard3 />} />

        {/* adminSide - Use ProtectedRoute for admin routes */}
        <Route path='/dashboard' element={<ProtectedRoute allowedRole={true}><DashBoard /></ProtectedRoute>} />
        <Route path="/userManagement" element={<ProtectedRoute allowedRole={true}><UserManagement /></ProtectedRoute>}/>
      </Routes>
    </>
  );
}

export default App;
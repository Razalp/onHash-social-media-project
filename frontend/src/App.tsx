import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import SignUp from './userSide/Signup/SignUp';
import Login from './userSide/LoginIn/Login';
import Home from './userSide/Home/Home';
import UserProfile from './userSide/Profile/UserProfile';
import DashBoard from './adminSide/dashBoard/DashBoard';
import UserManagement from './adminSide/Usermanagement/UserManagement';
import ProtectedRoute from './ProtectedRoute'; 
import Createpost from './userSide/CreatePost/Createpost';
import Search from './userSide/Search/Search';
import SerachUserProfile from './userSide/SerachUserProfile/SerachUserProfile';
import ReportPage from './adminSide/ReportPage/ReportPage';
import Story from './userSide/Home/Story';
import Notifications from './userSide/Notifications/Notifications';
import Chat from './userSide/Chat/Chat';
import ForgetPasswod from './userSide/ForgetPasswod/ForgetPasswod';
import RandomUserSug from './userSide/Home/RandomUserSug';
import VideoCallInwebRtc from './userSide/Chat/chatpages/VideoCallInwebRtc';

import Room from './userSide/Chat/Screens/Room';

import AudioRoom from './userSide/Chat/Audioscreen/AudioRoom';
import Lobby from './userSide/Chat/Screens/Lobby';
import AudioLobby from './userSide/Chat/Audioscreen/AudioLobby';


function App() {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        {!token && (
          <>
         
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/log-in' element={<Login />} />
          </>
        )}

        {/* Routes available to both authenticated and non-authenticated users */}
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/SerachUserProfile/:userId' element={<SerachUserProfile />} />
        <Route path='/story' element={<Story />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/forgetpasswod' element={<ForgetPasswod />} />
        <Route path='/random-user' element={<RandomUserSug />} />

        <Route path='/room/:id' element={<Room />} />
        <Route path='/roomwebRtc/:id' element={<VideoCallInwebRtc/>} />
        <Route path='/VideoLobby' element={<Lobby/>} />
        <Route path='/AudioLobby' element={<AudioLobby/>} />

        <Route path='/audio-room/:id' element={<AudioRoom  />} />



   

        {/* Authenticated routes */}
        {token && (
          <>
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/create' element={<Createpost />} />
            <Route path='/dashboard' element={<ProtectedRoute allowedRole={true}><DashBoard /></ProtectedRoute>} />
            <Route path="/userManagement" element={<ProtectedRoute allowedRole={true}><UserManagement /></ProtectedRoute>}/>
            <Route path="/Report" element={<ProtectedRoute allowedRole={true}><ReportPage /></ProtectedRoute>}/>
   
          </>
        )}

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App;

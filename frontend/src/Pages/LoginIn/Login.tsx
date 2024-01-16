import { useNavigate } from 'react-router-dom';
import HashOnImage from '../../assets/HashOn.png';
import sideView from '../../assets/signupside.png';
import './Login.css'; 
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/userSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogIn = async () => {
        try {
          const response = await axios.post('http://localhost:3000/api/user/logIn', {
            email,
            password,
          });
    
          if (response.status === 200) {
            const data = response.data;
            console.log(data);
            dispatch(loginSuccess({
                token: data.token,
                userId: data.userId,
              }));
            navigate('/Home');
          } else {
            console.error('Login failed');
          }
        } catch (error) {
          console.error(error);
        }
      };
  return (
    <>
      <div className='header flex items-center relative top-5 left-10'>
        <img src={HashOnImage} className='logo size-24 relative left-4' alt="" />
        <h1 className='text-4xl font-bold relative left-8'>HashOn</h1>
      </div>
      <div className='relative top-20 main-container flex flex-col-reverse lg:flex-row justify-center items-center space-y-8 lg:space-y-0'>
        <div className='login-form flex flex-col justify-between lg:mr-8'>
          <h1 className='text-3xl font-bold relative left-1 mb-4 lg:mb-8'>Log-in</h1>
          <input
                    type="email"
                    placeholder='Email'
                    className='input-style mb-4'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='Password'
                    className='input-style mb-4'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
          <div className='flex space-x-6 relative left-1'>
          <button className='btn-black' onClick={handleLogIn}>
                        Log-in
                    </button>
            <button className='btn-white'>Sign-up</button>
          </div>
        </div>
        <div>
          <img src={sideView} className='size-96' alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;

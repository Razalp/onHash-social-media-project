
import './SignUp.css'
import HashOnImage from '../../assets/HashOn.png';
import sideView from '../../assets/signupside.png';

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSignUp = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/user/signIn', {
          username: name,
          email,
          password,
        });

        console.log('User signed up successfully:', response.data);
        navigate('/log-in');
      } catch (error) {
        console.error('Sign-up failed:', error);
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
          <h1 className='text-3xl font-bold relative left-1 mb-4 lg:mb-8'>Sign-up</h1>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-style mb-4" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-style mb-4" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-style mb-4" />
          <div className='flex space-x-6 relative left-1'>
          <button onClick={handleSignUp} className="btn-black">
         Sign-up
       </button>
            <button className='btn-white'>Log-in</button>
          </div>
        </div>
        <div>
          <img src={sideView} className='size-96' alt="" />
        </div>
      </div>

    </>
   
  )
}

export default SignUp

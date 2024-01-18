import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import HashOnImage from '../../assets/HashOn.png';
import sideView from '../../assets/signupside.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [modalAnimation, setModalAnimation] = useState(false);

  const openOtpModal = () => {
    setShowOtpModal(true);
    setModalAnimation(true);
  };

  const closeOtpModal = () => {
    setModalAnimation(false);
    setTimeout(() => setShowOtpModal(false), 500); // Adjust the delay as needed
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/signIn', {
        username: name,
        email,
        password,
      });

      console.log('User signed up successfully:', response.data);
      openOtpModal();
    } catch (error) {
      console.error('Sign-up failed:', error);
      toast.error('Sign-up failed. Please check your credentials.');
    }
  };

  const handleOtpVerification = async () => {
    try {
      const otpVerificationResponse = await axios.post('http://localhost:3000/api/user/verify-otp', {
        email,
        otp,
      });

      console.log('OTP verification successful:', otpVerificationResponse.data);
      toast.success("sign-up success")
      closeOtpModal();
      navigate('/log-in');
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error('OTP as some issue.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/');
    }
  }, []);


  return (
    <>
     <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
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
            <button className='btn-white'><Link to='/log-in'>Log-in</Link> </button>
          </div>
        </div>
        <div>
          <img src={sideView} className='size-96' alt="" />
        </div>
      </div>

      {showOtpModal && (
        <div className="otp-modal">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-style mb-4"
          />
          <button onClick={handleOtpVerification} className="btn-black">
            Verify OTP
          </button>
        </div>
      )}

    </>
   
  )
}

export default SignUp

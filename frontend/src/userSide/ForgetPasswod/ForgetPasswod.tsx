import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/user/forgot-password', { email });

      if (response.status === 200) {
        setModalIsOpen(true);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleModalSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/user/reset-password', { email, otp, newPassword });

      if (response.status === 200) {
        setModalIsOpen(false);
      } else {
        setModalError(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalError('');
  };

  return (
    <div className="bg-cover bg-center h-screen flex justify-center items-center">
      <div className="bg-black bg-opacity-80 rounded-xl p-10">
        <h2 className="text-yellow-300 text-center text-clip mb-8">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="email"
              className="w-full py-2 px-4 text-white bg-transparent border-b border-white focus:outline-none focus:border-yellow-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="absolute top-0 left-0 text-white px-4">Email</label>
          </div>
          <input
            type="submit"
            value="Submit"
            className="block mx-auto bg-yellow-300 text-black py-2 px-8 rounded-full cursor-pointer hover:scale-105 transform transition duration-500 ease-in-out"
          />
        </form>
        <p className="text-white text-center mt-4">
          <Link to="/sign-up" className="text-yellow-300 hover:text-red-500">
            Sign Up
          </Link>
        </p>
        <p className="text-white text-center">
          <Link to="/log-in" className="text-yellow-300 hover:text-green-500">
            Login
          </Link>
        </p>
      </div>
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-bold mb-4">Enter OTP and New Password</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full py-2 px-4 text-black bg-white border border-gray-400 rounded-md focus:outline-none focus:border-yellow-300"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="w-full py-2 px-4 text-black bg-white border border-gray-400 rounded-md focus:outline-none focus:border-yellow-300"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-yellow-300 text-black py-2 px-4 rounded-full cursor-pointer hover:scale-105 transform transition duration-500 ease-in-out"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-black py-2 px-4 rounded-full cursor-pointer hover:scale-105 transform transition duration-500 ease-in-out"
                >
                  Close
                </button>
              </div>
              {modalError && <p className="text-red-500">{modalError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;

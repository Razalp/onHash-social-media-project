import Axios from "@/axious/instance";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Button, Toast } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Story = () => {


  const [stories, setStories] = useState([]); 
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
  });

  useEffect(() => {
    const fetchStories = async () => {
      try {
       
        const token = localStorage.getItem('accessToken');

        if (!token) {
          return;
        }

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await Axios.get(`/api/user/getStories/${userId}`);
        
        setStories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
  
    fetchStories();
  }, []);
  

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, [navigate]);

  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [fileError, setFileError] = useState(''); 

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
    setFileError(null);
  };


  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    try {
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        const fetchUserData = async () => {
          try {
            const response = await Axios.get(`/api/user/get-profile/${userId}`);
            setUserData(response.data);
          } catch (error) {
            console.error('Error fetching user data:', error);

          }
        };

        fetchUserData();
      }
    } catch (error) {
      console.error('Error decoding token:', error);

    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media) {
      setFileError('Please select a file.');

      setTimeout(() => {
        setFileError('');
      }, 2000);
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
  
      if (!token) {
        return;
      }
  
      const decodedToken:any = jwtDecode(token);
      const userId = decodedToken.userId;
  
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', userId);
      formData.append('media', media);
  
      console.log('FormData:', formData); 
  
      const response = await Axios.post('/api/user/stories', formData);
  
      console.log('Story created:', response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto p-8">
      <ul className="flex space-x-6">
        <li className="flex flex-col items-center space-y-1 ">
          <div className="relative bg-gradient-to-tr from-yellow-400 to-purple-600 p-1 rounded-full">
                <button className="block bg-white p-1 rounded-full transform transition hover:-rotate-6">
                <img className="w-24 h-24 rounded-full object-cover" src={`http://localhost:3000/upload/${userData?.profilePicture}`} />
                </button>
            <button  onClick={() => setShowModal(true)} className="absolute bg-blue-500 text-white text-2xl font-medium w-8 h-8 rounded-full bottom-0 right-1 border-4 border-white flex justify-center items-center font-mono hover:bg-blue-700 focus:outline-none">
              <div className="transform -translate-y-px">+</div>
            </button>
          </div>
        </li>
      </ul>
      {showModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-4 sm:p-8 rounded shadow-lg z-20 max-w-screen-md w-full sm:w-96">
          <div className="text-center">
            <h1 className="text-xl text-white mb-4">Story</h1>
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-white text-2xl font-medium w-8 h-8 rounded-full bg-red-500 hover:bg-red-700 focus:outline-none">X</button>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
              <input type="text" value={content} onChange={handleContentChange} placeholder="Content" className="bg-gray-200 rounded-lg px-4 py-2 mb-4 w-8/12 max-w-sm focus:outline-none focus:ring focus:border-blue-300" />
              <label htmlFor="mediaInput" className="block text-center text-white px-6 py-3 rounded-lg cursor-pointer transition-colors duration-300">
                Upload Media
              </label>
              <input id="mediaInput" type="file" onChange={handleMediaChange} className="hidden" />
              {fileError && <p className="text-red-500">{fileError}</p>}
              <br />
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;

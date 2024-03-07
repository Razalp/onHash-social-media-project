// Story.jsx

import Axios from "../../../axious/instance";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CropeImage from "./CropeImage";

const Story = () => {
  const [stories, setStories] = useState<any>([]); 
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [fileError, setFileError] = useState<any|null>(''); 
  const [showImage, setShowImage] = useState(false);
  const [selectedStoryImage, setSelectedStoryImage] = useState("");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [croppedImage, setCroppedImage] = useState(null); 

  const handleCropSubmit = (croppedImageUrl:any) => {
    setCroppedImage(croppedImageUrl);
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prevIndex => prevIndex + 1);
    }
  };


    const fetchStories = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          return;
        }

        const decodedToken:any = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await Axios.get(`/api/user/getStories/${userId}`);
        
        setStories(response.data);
      
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
useEffect(()=>{
  fetchStories()
},[])



  const navigate = useNavigate();


  const setShowmodalClose = () => {
    setShowModal(false)
  }

  const setModalopen = () => {
    setShowImage(true)
  }

  const setModalClose = () => {
    setShowImage(false)
  }

  const handleContentChange = (e:any) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e:any) => {
    setMedia(e.target.files[0]);
    setFileError(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    try {
      if (token) {
        const decodedToken:any = jwtDecode(token);
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

  const handleSubmit = async (e:any) => {
    e.preventDefault();
  
    if (!media || !croppedImage) { 
      setFileError('Please select a file and crop it.');
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
      // Append the cropped image to formData
      formData.append('croppedImage', croppedImage);
  
      const response = await Axios.post('/api/user/stories', formData);
      setShowModal(false);
      setShowModal(false);
      fetchStories()
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };
  

  const handleProfileImageClick = (imageUrl:any) => {
    setSelectedStoryImage(imageUrl);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in')   
    }
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-8">
    <div className="flex flex-wrap justify-center">
      {stories.map((story:any, index:any) => (
        <button
          key={index}
          className="relative w-20 h-20 bg-white rounded-full overflow-hidden m-2 transform transition hover:-rotate-6"
          onClick={() => {
            setCurrentStoryIndex(index);
            setShowImage(true);
          }}
        >
          <img
            className="w-full h-full object-cover"
            src={`${import.meta.env.VITE_UPLOAD_URL}${story?.user.profilePicture}`}
            alt={`Story ${index}`}
          />
        </button>
      ))}
      <button onClick={() => setShowModal(true)} className="w-20 h-20 bg-blue-500 text-white text-2xl font-medium rounded-full flex justify-center items-center hover:bg-blue-700 focus:outline-none m-2">
        +
      </button>
    </div>
  

    <div onClick={setModalClose}>
      {showImage && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex justify-center items-center">
          <div className="relative">
            <img
              src={`${import.meta.env.VITE_UPLOAD_URL}${stories[currentStoryIndex]?.media}`}
              alt="Selected Story"
              className="w-96 h-5/6 object-cover"
            />
            <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-12 h-full flex items-center justify-center text-white cursor-pointer">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-2xl transition rounded-full hover:rounded-full hover:bg-slate-700 hover:shadow-md"
                onClick={handlePrevStory}
              />
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-0 w-12 h-full flex items-center justify-center text-white cursor-pointer">
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-2xl transition rounded-full hover:rounded-full hover:bg-slate-700 hover:shadow-md"
                onClick={handleNextStory}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  

    {showModal && (   
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-4 sm:p-8 rounded shadow-lg z-20 max-w-screen-md w-full sm:w-96">
        <div className="text-center">
          <h1 className="text-xl text-white mb-4">Story</h1>
          <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-white text-2xl font-medium w-8 h-8 rounded-full bg-red-500 hover:bg-red-700 focus:outline-none">X</button>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input type="text" value={content} onChange={handleContentChange} placeholder="Content" className="bg-gray-200 rounded-lg px-4 py-2 mb-4 w-8/12 max-w-sm focus:outline-none focus:ring focus:border-blue-300" />
            <label htmlFor="mediaInput" className="block text-center text-white px-6 py-3 rounded-lg cursor-pointer mb-4 hover:bg-blue-600 transition-colors duration-300">
              Upload Media
            </label>
            <CropeImage media={media} onCropSubmit={handleCropSubmit} />
            <input id="mediaInput" type="file" onChange={handleMediaChange} className="hidden" />
            {fileError && <p className="text-red-500">{fileError}</p>}
            <Button type="button" onClick={handleSubmit}>Submit</Button>
          </form>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default Story;

import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './Story.css';
import Axios from '../../axious/instance';
import { jwtDecode } from "jwt-decode";

const story = () => {
    const [captions, setCaptions] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const webcamRef = React.useRef();
  
    const uploadStory = async (user, content, imageFile) => {
      try {
        const formData = new FormData();
        formData.append('user', user);
        formData.append('content', content);
        formData.append('image', imageFile);
  
        // Assuming 'accessToken' is the variable containing the JWT token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // Handle case when token is missing
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
  
        const response = await Axios.post('/api/user/stories', formData);
  
        return response.data;
      } catch (error) {
        console.error('Error uploading story:', error);
        throw error;
      }
    };
  
    const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Here you can handle the captured image, apply filters, etc.
        console.log('Captured image:', imageSrc);
      } else {
        console.error('Failed to capture image.');
      }
    }, [webcamRef]);
  
    return (
      <div className="full-page">
        <div className="w-full h-screen flex justify-center items-center flex-col">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-4/4"
          />
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Enter caption..."
              value={captions}
              onChange={(e) => setCaptions(e.target.value)}
              className="bg-white border border-gray-300 rounded p-2 mb-2"
            />
  
            <button
              onClick={capture}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Capture
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default story;
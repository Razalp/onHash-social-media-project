import React, { useState, useEffect, useRef } from 'react';
import SideBar from '../SideBar/SideBar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Createpost.css';
import Axios from '../../axious/instance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Createpost = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.userId);
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];

    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewImage(null);
    }
  };

  const handleCaptureFromCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };

      const videoContainer = document.getElementById('videoContainer');
      if (videoContainer) {
        videoContainer.style.display = 'block'; // Make sure the container is visible
        videoContainer.appendChild(video);
      }

      setVideoRef(video);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        setPreviewImage(dataUrl);

        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      } else {
        console.error('Canvas context is null.');
      }
    }
  };

  const handleCreatePost = async () => {
    if (!previewImage || !caption) {
      toast.error('Please select an image and enter a caption');
      return;
    }

    const formData = new FormData();
    formData.append('images', dataURItoBlob(previewImage));
    formData.append('caption', caption);
    formData.append('userId', userId);

    try {
      const response = await Axios.post('api/user/upload-post', formData);

      if (response.status === 200) {
        toast.success('Post uploaded successfully');
        navigate('/profile');
      } else {
        toast.error('Failed to upload post');
      }
    } catch (error) {
      console.error('Error uploading post:', error);
      toast.error('Error uploading post');
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div>
        <SideBar />
      </div>
      <div className="p-8 flex justify-center items-center flex-col fullbg">
        <label htmlFor="imageInput" className="btn-white">
          Select Image
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <h1>or</h1>
        <button className="btn-white" onClick={handleCaptureFromCamera}>
          Capture from Camera
        </button>
        <div id="videoContainer" style={{ display: 'none' }} />
        {videoRef && (
          <button className="btn-white" onClick={handleCaptureImage}>
            Capture Image
          </button>
        )}
        {previewImage && (
          <div className="w-56 h-64">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full border text-black border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
        )}
        {previewImage && (
          <>
            <input
              className="w-48 border text-black border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              type="text"
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <br />
            <Button variant="outline" onClick={handleCreatePost}>
              Create
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Createpost;

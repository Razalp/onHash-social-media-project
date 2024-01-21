import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './Createpost.css';
import Axios from '../../axious/instance';

const Createpost = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>(''); // State for the caption
  const [userId, setUserId] = useState<string>(''); // State for the userId

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        console.log(userId)
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

  const handleCreatePost = async () => {
    if (!previewImage || !caption) {
      // Handle the case where no image or caption is provided
      return;
    }
  
    const selectedImage = document.getElementById('imageInput') as HTMLInputElement;
  
    if (selectedImage && selectedImage.files) {
      const selectedFile = selectedImage.files[0];
      const formData = new FormData();
      formData.append('images', selectedFile);
      formData.append('caption', caption);
      formData.append('userId', userId);
  
      try {
        const response = await Axios.post('api/user/upload-post', formData);
  
        if (response.status === 200) {
          console.log('Post uploaded successfully');
        } else {
          console.error('Failed to upload post');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  return (
    <>
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

        {previewImage && (
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{ maxWidth: '600px', maxHeight: '600px', width: 'auto', height: 'auto' }}
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Enter caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {previewImage && (
          <button className="btn-white" onClick={handleCreatePost}>
            Create
          </button>
        )}
      </div>
    </>
  );
};

export default Createpost;

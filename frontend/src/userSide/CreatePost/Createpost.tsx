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
import upload from './Image post.gif'
const Createpost = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturate, setSaturate] = useState<number>(100);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const presetFilters = {
    original: { brightness: 100, contrast: 100, saturate: 100 },
    sepia: { brightness: 90, contrast: 80, saturate: 20 },
    vintage: { brightness: 120, contrast: 90, saturate: 80 },
  };
  const applyPresetFilter = (preset: any) => {
    const filterValues = presetFilters[preset];
    setBrightness(filterValues.brightness);
    setContrast(filterValues.contrast);
    setSaturate(filterValues.saturate);
  };

  const handleDragOver = (e:any) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e:any) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileChange(files);
    }
  };

  const handleFileInputChange = (e:any) => {
    const files = e.target.files;
    onFileChange(files);
  };

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
        videoContainer.style.display = 'block'; 
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
  
        // Get the image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  

        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] * (brightness / 100);
          data[i + 1] = data[i + 1] * (contrast / 100);
          data[i + 2] = data[i + 2] * (saturate / 100);
        }
  

        context.putImageData(imageData, 0, 0);
  

        const filteredDataUrl = canvas.toDataURL('image/png');
        setPreviewImage(filteredDataUrl);
  
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


    const filteredImage = await applyFiltersToImage(previewImage);

    const formData = new FormData();
    formData.append('images', dataURItoBlob(filteredImage));
    formData.append('caption', caption);
    formData.append('userId', userId);
    formData.append('brightness', brightness.toString());
    formData.append('contrast', contrast.toString());
    formData.append('saturate', saturate.toString());

    console.log('formData:', formData);

    try {
      const response = await Axios.post('api/user/upload-post', formData);

      console.log('Upload response:', response);

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

  const applyFiltersToImage = async (imageDataURI) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx:any = canvas.getContext('2d');

        // Set canvas quality
        ctx.quality = 1.0;

        // Apply filters using ctx.filter property
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

        // Draw the image with filters on the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URI
        canvas.toBlob((blob:any) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
      };

      image.src = imageDataURI;
    });
  };

  const dataURItoBlob = (dataURI:any) => {
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
    <SideBar></SideBar>
    <div>

  <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
   
    <div>

      </div>
      <div>
     
      </div>
      <div className="main-content p-8 flex justify-center items-center flex-col fullbg">
   
        <label htmlFor="imageInput" className="btn-white">
       select image
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

        {videoRef && (
          <>
            <button className="btn-white" onClick={handleCaptureImage}>
              Capture Image
            </button>
            <div id="videoContainer" style={{ display: 'none' }} />
          </>
        )}
        <div className="preset-buttons">
  <button onClick={() => applyPresetFilter('original')}>Original</button>
  <button onClick={() => applyPresetFilter('sepia')}>Sepia</button>
  <button onClick={() => applyPresetFilter('vintage')}>Vintage</button>
</div>

        {previewImage && (
          <>
            <div className="image-preview" style={{width:"300px" ,height:"auto"}}>
              <img
                src={previewImage}
                alt="Preview"
                className="preview-image"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`,
                }}
              />
            </div>

            <div className="range-controls">
              <div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                />
                <label>Brightness: {brightness}%</label>
              </div>

              <div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                />
                <label>Contrast: {contrast}%</label>
              </div>

              <div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={saturate}
                  onChange={(e) => setSaturate(Number(e.target.value))}
                />
                <label>Saturation: {saturate}%</label>
              </div>
            </div>

            <div className="caption-input">
              <input
                type="text"
                placeholder="Enter caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

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

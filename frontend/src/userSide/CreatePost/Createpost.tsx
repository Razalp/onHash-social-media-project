import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import { jwtDecode } from 'jwt-decode';
import './Createpost.css';
import Axios from '../../axious/instance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import 'react-image-crop/dist/ReactCrop.css';

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
  interface PresetFilters {
    [key: string]: {
      brightness?: number;
      contrast?: number;
      saturate?: number;
      grayscale?: number;
      invert?: number;
      sepia?: number;
      blur?: number;
      sharpness?: number;
      neon?: number;
      desaturate?: number;
      brightnessOnly?: number;
    };
  }
  
  const presetFilters: PresetFilters = {
    original: { brightness: 100, contrast: 100, saturate: 100 },
    sepia: { brightness: 90, contrast: 80, saturate: 20 },
    vintage: { brightness: 120, contrast: 90, saturate: 80 },
    grayscale: { grayscale: 100 },
    highContrast: { brightness: 150, contrast: 150, saturate: 100 },
    invertColors: { invert: 100 },
    warmColors: { sepia: 50, saturate: 150 },
    coolColors: { saturate: 50, brightness: 150 },
    blur: { blur: 5 },
    sharpness: { contrast: 150, brightness: 150 },
    neon: { brightness: 150, saturate: 150 },
    desaturate: { saturate: 0 },
    brightnessOnly: { brightness: 150, contrast: 100, saturate: 100 },
  };
  
  const applyPresetFilter = (preset: string) => {
    const filterValues = presetFilters[preset];
    if (filterValues) {
      setBrightness(filterValues.brightness || 100);
      setContrast(filterValues.contrast || 100);
      setSaturate(filterValues.saturate || 100);
    }
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
      const droppedImage = files[0];

      if (droppedImage.type.startsWith('image/')) {
      
      } else {
        toast.error('Please drop a valid image file.');
      }
    }
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
          const fileType = selectedImage.type;
          if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif') {
            setPreviewImage(reader.result);
          } else {
            toast.error('Please select a JPG, PNG, or GIF image file.');
            setPreviewImage(null);
          }
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

  const applyFiltersToImage = async (imageDataURI:any) => {
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

  // const allFilterButtons = Object.keys(presetFilters).map((filter, index) => (
  //   <button key={index} onClick={() => applyPresetFilter(filter)}>
  //     {filter}
  //   </button>
  // ));

  
  return (
<div className="fullbg text-white" style={{height:"100vh"}} >
    <SideBar/>
    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    <div className={`main-content p-8 flex justify-center items-center flex-col fullbg ${isDragOver ? 'drag-over' : ''}`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}>

    <label htmlFor="imageInput" className="btn-white mb-4">
        select image
    </label>

    <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }}
        onChange={handleImageChange} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} />

    <h1 className="mb-4">or</h1>

    <button className="btn-white mb-4" onClick={handleCaptureFromCamera}>
    <FontAwesomeIcon icon={faCamera} />   Capture from Camera
    </button>

    {videoRef && (
        <>
            <button className="btn-white mb-4" onClick={handleCaptureImage}>
                Capture Image
            </button>
            <div id="videoContainer" style={{ display: 'none' }} />
        </>
    )}

    <br />

    {previewImage && (
        <>
            <div className="image-preview images" style={{ width: "300px", height: "auto" }}>
    <img
        src={previewImage}
        alt="Preview"
        className="preview-image"
        style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`,
            width: "100%", // Set a fixed width for the image to ensure consistent size
        }}
    />
</div>


            <br />
            <div className="preset-buttons w-80 flex space-x-12 mb-4">
                <button onClick={() => applyPresetFilter('original')}>
                    <img src={previewImage} alt="Original" className="max-w-full" />
                    orginal
                </button>
                <button onClick={() => applyPresetFilter('sepia')}>
                    <img src={previewImage} alt="Sepia" className="max-w-full" />
                    sepia
                </button>
                <button onClick={() => applyPresetFilter('vintage')}>
                    <img src={previewImage} alt="Vintage" className="max-w-full" />
                    vintage
                </button>
            </div>

            <br />
            <br />

            <div className="range-control mb-4">
                <div>
                    <input type="range" min={0} max={200} value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))} />
                    <label className="mt-2">Brightness: {brightness}%</label>
                </div>

                <div>
                    <input type="range" min={0} max={200} value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))} />
                    <label className="mt-2">Contrast: {contrast}%</label>
                </div>

                <div>
                    <input type="range" min={0} max={200} value={saturate}
                        onChange={(e) => setSaturate(Number(e.target.value))} />
                    <label className="mt-2">Saturation: {saturate}%</label>
                </div>
            </div>

            <div className="caption-input mb-4">
  <input
    type="text"
    placeholder="Enter caption"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 sm:text-sm"
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

   
     
    </div>

  );
};

export default Createpost;

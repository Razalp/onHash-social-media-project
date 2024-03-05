import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';

const CropImage = ({ media, onCropSubmit }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(true);
  const [showCropped, setShowCropped] = useState(false); // New state to toggle cropped image preview

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = await convertFileToDataURL(media);
  
      const croppedImg = await getCroppedImg(image, croppedAreaPixels, 'cropped.jpg');
      console.log("Cropped Image URL:", croppedImg); // Log the cropped image URL
      setCroppedImage(croppedImg);
      setShowCropped(true); // Show cropped image preview
      setCropperVisible(false); // Hide cropper after crop
  
      // Pass cropped image to parent component
      onCropSubmit(croppedImg);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };
  
  const convertFileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    try {
      ctx.drawImage(
        image,
        Math.round(crop.x * scaleX),
        Math.round(crop.y * scaleY),
        Math.round(crop.width * scaleX),
        Math.round(crop.height * scaleY),
        0,
        0,
        crop.width,
        crop.height
      );
    } catch (error) {
      console.error('Error drawing image on canvas:', error);
      return null;
    }
  
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = fileName;
          resolve(window.URL.createObjectURL(blob));
        },
        'image/jpeg',
        1
      );
    });
  };
  
  

  return (
    <div>
      {media && cropperVisible && (
        <div>
          <Cropper
            image={URL.createObjectURL(media)}
            crop={crop}
            zoom={zoom}
            aspect={8 / 11}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Button variant='destructive' className='w-16 h-10 ' onClick={showCroppedImage}>Crop</Button>
          </div>
        </div>
      )}
      {showCropped && croppedImage && (
        <div>
          <img src={croppedImage} alt="Cropped" className='w-72 h-96' />
        </div>
      )}
    </div>
  );
};

export default CropImage;

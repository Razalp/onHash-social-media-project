import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Createpost.css';
import Axios from '../../axious/instance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    
const Createpost = () => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [userId, setUserId] = useState<string>('');

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
                    toast.success('Post uploaded successfully');
                } else {
                    toast.error('Failed to upload post');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
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

                {previewImage && (
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <img
                            src={previewImage}
                            alt="Preview"
                            style={{ maxWidth: '400px', maxHeight: '400px', width: 'auto', height: 'auto' }}
                        />
                    </div>
                )}

                {previewImage && (
                    <>
                        <input
                            className="border text-black border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            type="text"
                            placeholder="Enter caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <br />

                        <button className="btn-white" onClick={handleCreatePost}>
                            Create
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default Createpost;

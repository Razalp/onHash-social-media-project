import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Createpost.css';
import Axios from '../../axious/instance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
    
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




// <div class="flex items-center justify-center w-full">
//     <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
//         <div class="flex flex-col items-center justify-center pt-5 pb-6">
//             <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//                 <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
//             </svg>
//             <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
//             <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
//         </div>
//         <input id="dropzone-file" type="file" class="hidden" />
//     </label>
// </div> 

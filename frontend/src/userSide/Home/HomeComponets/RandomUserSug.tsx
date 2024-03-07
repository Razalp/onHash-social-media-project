import React, { useEffect, useState } from 'react';
import Axios from '@/axious/instance';
import {jwtDecode} from 'jwt-decode'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';

const RandomUserSug = () => {
  const [randomUsers, setRandomUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState<{ [key: string]: boolean }>({});
  const navigate=useNavigate()


    const fetchRandomUsers = async () => {
      try {   
        const response = await Axios.get('/api/user/random-users');
        setRandomUsers(response.data);
        
      } catch (error) {
        console.error('Error fetching random users:', error);
      }
    };


  


  const handleFollow = async (userId:string) => {
    try {
      const response = await Axios.post(`/api/user/follow/${userId}`, {
        user: getCurrentUserId()
      });

      if (response.data) {
        setIsFollowing({ ...isFollowing, [userId]: true }); 
        localStorage.setItem(`isFollowing_${userId}`, 'true');
        toast.success('You are now following this user');

      } else {
        toast.error('Error following user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Error following user');
    }
  };

  const handleUnfollow = async (userId:any) => {
    try {
      const response = await Axios.post(`/api/user/unfollow/${userId}`, {
        user: getCurrentUserId()
      });

      if (response.data) {
        setIsFollowing({ ...isFollowing, [userId]: false }); 
        localStorage.setItem(`isFollowing_${userId}`, 'false');
        toast.success('You have unfollowed this user');

      } else {
        toast.error('Error unfollowing user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Error unfollowing user');
    }
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return null;
    }

    const decodedToken:any = jwtDecode(token);
    return decodedToken.userId;
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in')   
    }
    
  }, []);
  return (
    <div className="flex justify-center ml-16 mr-20">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="grid grid-cols-3 gap-4">
        {randomUsers.map((user:any) => (
              <Link
              to={`/SerachUserProfile/${user._id}`}
              className=""
            >
              
          <div key={user._id} className="card bg-gray-950 rounded-lg p-4 shadow-md ">
            <img
              src={`${import.meta.env.VITE_UPLOAD_URL}${user.profilePicture}`}
              alt={user.username}
              className="w-16 h-16 rounded-full mx-auto object-cover"
            />
            <h3 className="text-sm font-semibold text-center text-white mt-1">{user.username}</h3>
            {isFollowing[user._id] ? (
  <Button variant="ghost" className='text-xs mt-1' onClick={() => handleUnfollow(user._id)}>UNFOLLOW</Button>
) : (
  <Button variant="outline" className='text-xs mt-1' onClick={() => handleFollow(user._id)}>FOLLOW</Button>
)}

          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RandomUserSug;

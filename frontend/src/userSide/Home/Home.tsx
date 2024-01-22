// Home.js

import { useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, []);

  return (

    <> 
    <SideBar/>
      <div className="flex fullbg">
    

      <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4">
        <div className="post-header p-4 flex items-center">
          <img className="w-10 h-10 rounded-full mr-4" src="profile-picture.jpg" alt="Profile" />
          <h3 className="text-lg font-semibold">Username</h3>
        </div>
        <img className="w-full" src="post-image.jpg" alt="Post" />
        <div className="post-footer p-4 flex items-center justify-between">
          <button className="btn-white">Like</button>
          <button className="btn-white ml-2">Comment</button>
        </div>
      </div>
    </div>
    </>

  );
}

export default Home;

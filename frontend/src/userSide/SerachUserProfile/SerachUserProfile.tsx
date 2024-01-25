import { useEffect, useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";

import './SerachUserProfile.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button"


const SerachUserProfile = () => {

    const { userId } = useParams();
    console.log('User ID:', userId);





  const getInitials = (name: any) => {
    return name
      .split(' ')
      .map((word: any) => word.charAt(0))
      .join('');
  };





  return (

    <div className="bg-black h-full w-full text-white fullbg-profile">
      <SideBar />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="" style={{ height: '100vh', paddingBottom: '10px', marginBottom: '10px' }}>
        <div className="flex items-center justify-center space-x-8 p-8">
          <div className="flex flex-col items-center">
            <img
              className="rounded-full w-32 h-32 object-cover shadow-md"
            //   src={
      
                
            //         //  `http://localhost:3000/upload/`
                    
            //   }
              alt="User Profile"
            />
       
            <div className="flex flex-col mt-4 text-center"></div>

          </div>

          <div className=" relative top-[-20px]">
            <h1 className="text-2xl font-bold mb-4"></h1>
            <ul className="flex justify-evenly space-x-6">
              <li className="text-xl flex flex-col items-center ">
                <span className="text-sm">Post</span>
                <span className="text-gray-600 text-base">1</span>
              </li>
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-sm ">Followers</span>
                <span className="text-gray-600 text-base">1</span>
              </li>
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-sm ">Following</span>
                <span className="text-gray-600 text-base">1</span>
              </li>
              
            </ul>
            <br />
            <ul className="flex space-x-4 ">
    <li><Button variant="outline">FOLLOW</Button></li>
    <li><Button variant='secondary'>MESSAGE</Button></li>
</ul>

          </div>



        </div>
        <div className="flex items-center justify-items-start flex-col" >
          {/* <h1 className="text-xl font-bold">{userData?.username}</h1> */}
          <div className="flex justify-start w-6/12 flex-col"> 
          <h1></h1>
          <br />
          <h1 className="text-3xl">Post</h1>
          </div>
          
        </div>

        <div className="bg-black" >
          <br />
          <br />

          <div className="grid  fullbg-profile justify-center hight-auto">
           
              <div className="grid grid-cols-3 gap-4">
             
                  <div  className=" shadow-m border border-b-slate-900 rounded-s-sm">
                      <img
                        src={`http://localhost:3000/upload/`}
                        alt="Post"
                        className="post-image shadow-md"
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
             
                  </div>
    
              </div>
            
              <div className="text-center bg-black flex flex-col">
                <p className="text-lg font-bold mb-4">No posts available</p>
               
              </div>
            
          </div>







        </div>


      </div>





    </div>

  );
};
export default SerachUserProfile;

import { useState } from "react";
import SideBar from "../SideBar/SideBar";
import profile from './profile.jpg';
import './UserProfile.css';

const UserProfile = () => {
    const [showModal, setShowModal] = useState(false);
  return (
    <>
      <SideBar />
      <div className="fullbg">
        <div>
          <div className="p-8 flex justify-center items-center flex-col">
            <img
              className="rounded-full w-44 h-44 object-cover shadow-md"
              src={profile}
              alt="Profile"
            />
           <button 
 className="ml-28 hover:text-yellow-200" 
 onClick={() => setShowModal(!showModal)}
>
 🖍 Edit
</button>   
          </div>
            <div>
                <ul className="flex justify-evenly ">
                <li className="text-2xl hover:text-yellow-200">Post</li>
                <li className="text-2xl hover:text-yellow-200">Followers</li>
                <li className="text-2xl hover:text-yellow-200">Following</li>
                </ul>
            </div>
        </div>
        {showModal && (
 <div className="fixed z-10 inset-0 overflow-y-auto">
   <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
     <div className="fixed inset-0 transition-opacity" aria-hidden="true">
       <div className="absolute inset-0 bg-black opacity-75"></div>
     </div>
     <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
     <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
       <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
         <div className="sm:flex sm:items-start">
           <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
             <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
               Edit Profile
             </h3>
             <div className="mt-2">
               {/* Your form fields go here */}
             </div>
           </div>
         </div>
       </div>
       <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
         <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowModal(false)}>
           Close
         </button>
       </div>
     </div>
   </div>
 </div>
)}
      </div>
    </>
  );
};

export default UserProfile;

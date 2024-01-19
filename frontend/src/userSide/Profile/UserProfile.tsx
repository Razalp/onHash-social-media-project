import { useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";
import profile from './profile.jpg';
import './UserProfile.css';

const UserProfile = () => {
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);
  };

  const handleEditClick = async () => {
    try {
      const formData:any = new FormData();
      formData.append("profilePicture", newProfilePicture);

      await Axios.post('api/user/update-profile', formData);

      console.log('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  return (
    <>
      <SideBar />
      <div className="fullbg">
        <div>
          <div className="p-8 flex justify-center items-center flex-col">
          <img
  className="rounded-full w-44 h-44 object-cover shadow-md"
  src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : profile}
  alt="Profile"
/>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className="ml-28 hover:text-yellow-200"
              onClick={handleEditClick}
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
      </div>
    </>
  );
};

export default UserProfile;

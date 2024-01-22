  import { useEffect, useState } from "react";
  import Axios from "../../axious/instance";
  import SideBar from "../SideBar/SideBar";
  import profile from './profile.jpg';
  import './UserProfile.css';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

  const UserProfile = () => {
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newBio, setNewBio] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState({
      username: '',
      email: '',

    });

    const handleFileChange = (event:any) => {
      const file = event.target.files[0];
      setNewProfilePicture(file);
    };

    const handleEditClick = () => {
      setShowModal(true);
    };

    const handleModalClose = () => {
      setNewProfilePicture(null);
      setNewUsername('');
      setNewBio('');
      setShowModal(false);
    };
    
    const handleModalSave = async () => {
      try {
        const formData:any = new FormData();
        formData.append('profilePicture', newProfilePicture);
        formData.append('username', newUsername);
        formData.append('bio', newBio);

        await Axios.post('api/user/update-profile', formData);

        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
      }

      setShowModal(false);

    };


  

    useEffect(() => {
      const token = localStorage.getItem('accessToken');
  
      try {
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId  = decodedToken.userId;
  
          const fetchUserData = async () => {
            try {
              const response = await Axios.get(`/api/user/get-profile/${userId}`);
              setUserData(response.data);
            } catch (error) {
              console.error('Error fetching user data:', error);

              toast.error('Error fetching user data');
            }
          };
  
          fetchUserData();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        toast.error('Error decoding token');
      }
    }, []);
    return (
      <>
        <SideBar />
        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div className="fullbg">
          <div>
            <div className="p-8 flex justify-center items-center flex-col">
              <img
                className="rounded-full w-44 h-44 object-cover shadow-md"
                src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : profile}
                alt="Profile"
              />

              

        
              <button
                className="ml-28 hover:text-yellow-200"
                onClick={handleEditClick}
              >
                🖍 Edit
              </button>


               <div className="flex flex-col">
              <h1>{userData.username}</h1>
              <h1>{userData.bio}</h1>
            </div>
            </div>
            <div>
  <ul className="flex justify-evenly ">
    <li className="text-xl flex flex-col items-center hover:text-yellow-200">
      Post <span>1</span>
    </li>
    <li className="text-xl flex flex-col items-center hover:text-yellow-200">
      Followers <span>1</span>
    </li>
    <li className="text-xl flex flex-col items-center hover:text-yellow-200">
      Following <span>1</span>
    </li>
  </ul>
</div>

          </div>
        </div>
        {showModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Edit Profile
                        </h3>
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="New Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border rounded-md p-2"
                          />
                        </div>
                        <div className="mt-2">
                          <textarea
                            placeholder="New Bio"
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            className="border rounded-md p-2"
                          />
                        </div>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="bg-black mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleModalSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleModalClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </>
    );
  };

  export default UserProfile;

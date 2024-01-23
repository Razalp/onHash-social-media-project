import { useEffect, useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";
import profile from './profile.jpg';
import './UserProfile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newBio, setNewBio] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  const [userPosts, setUserPosts] = useState([]);

  const navigate=useNavigate()
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);
  };

  const handleNewUsernameChange = (e: any) => {
    setNewUsername(e.target.value);
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
      const formData = new FormData();

      if (newProfilePicture) {
        formData.append('profilePicture', newProfilePicture);
      }

      if (newUsername.trim() !== '') {
        formData.append('username', newUsername.trim());
      }

      if (newBio.trim() !== '') {
        formData.append('bio', newBio.trim());
      }

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
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

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

  const getInitials = (name: any) => {
    return name
      .split(' ')
      .map((word: any) => word.charAt(0))
      .join('');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, []);

  const handleGoToPost=()=>{
    navigate('/create')
  }

  useEffect(() => {
    const fetchUserPosts = async () => {
      const token = localStorage.getItem('accessToken');

      try {
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const userId = decodedToken.userId;
  
        const response = await Axios.get(`/api/user/my-post/${userId}`); 
        setUserPosts(response.data);
        console.log(userPosts)
      }
     } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    
  }

    fetchUserPosts();
  }, []);



  return (
    
    <div className="bg-black h-full w-full text-white">
      <SideBar />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="">
        <div className="flex items-center justify-center space-x-8 p-8">
          <div className="flex flex-col items-center">
            <img
              className="rounded-full w-44 h-44 object-cover shadow-md"
              src={
                newProfilePicture
                  ? URL.createObjectURL(newProfilePicture)
                  : userData.profilePicture
                    ? `http://localhost:3000/upload/${userData.profilePicture}`
                    : `https://ui-avatars.com/api/?name=${getInitials(userData.username)}&background=random&size=200`
              }
              alt="User Profile"
            />
            <button
              className="mt-4 text-blue-500 hover:text-blue-700"
              onClick={handleEditClick}
            >
              🖍 Edit
            </button>
            <div className="flex flex-col mt-4 text-center"></div>

          </div>

          <div className="">
            <h1 className="text-3xl font-bold mb-4">{userData.username}</h1>
            <ul className="flex justify-evenly space-x-6">
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-lg font-bold">Post</span>
                <span className="text-gray-600">1</span>
              </li>
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-lg font-bold">Followers</span>
                <span className="text-gray-600">1</span>
              </li>
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-lg font-bold">Following</span>
                <span className="text-gray-600">1</span>
              </li>
            </ul>
          </div>



        </div>
        <div className="" style={{ marginLeft: '100px' }}>
          {/* <h1 className="text-xl font-bold">{userData?.username}</h1> */}
          <h1>{userData?.bio}</h1>

        </div>
        <div className="bg-black" >
  <h1 className="text-2xl">POSTS</h1>
  <br />
 <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }} className="fullbg-profile">
  {userPosts.length > 0 ? (
    userPosts.reverse().map((post: string | any) => (
      <div key={post._id} className="rounded-md p-4" style={{ flex: '0 0 calc(33.333% - 10px)', marginBottom: '10px' }}>
        {post.image.length > 0 && (
          <img
            src={`http://localhost:3000/upload/${post.image}`}
            alt="Post"
            className="post-image rounded-md mb-4"
            style={{ width: '350px', height: '400px', objectFit: 'cover' }}
          />
        )}
        <p>{post.caption}</p>
      </div>
    ))
  ) : (
    <div className="text-center">
      <p>No posts available</p>
      <button onClick={() => handleGoToPost()} className="btn-go-to-post">
        Go to create
      </button>
    </div>
  )}
</div>





</div>


      </div>
      <hr className="text-white" />



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
    onChange={handleNewUsernameChange}
    maxLength={20} // Set your desired maximum length
    className="border rounded-md p-2 text-black"
  />
</div>

<div className="mt-2">
  <textarea
    placeholder="New Bio"
    value={newBio}
    onChange={(e) => setNewBio(e.target.value)}
    maxLength={150} // Set your desired maximum length
    className="border rounded-md p-2 text-black"
  />
</div>

                    <div className="mt-2">
                      <input
                        className="text-black"
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
    </div>

  );
};
export default UserProfile;

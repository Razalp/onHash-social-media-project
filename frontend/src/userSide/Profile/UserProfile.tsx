import { useEffect, useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";
import profile from './profile.jpg';
import './UserProfile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"


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
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [followingData,setFollowingData] = useState<any[]>();
  const [followersData,setFollowersData] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false);
    const [open,setOpen] =useState(false)
    console.log(followersData)

    const openModal = () => {
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };

    const opens =()=>{
        setOpen(true)
    }
    const close=()=>{
        setOpen(false)
    }

  const navigate = useNavigate()
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

  const handleGoToPost = () => {
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

  useEffect(() => {
    const getFollowers = async () => {
      const token = localStorage.getItem('accessToken');

      try {
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const userId = decodedToken.userId;
          console.log(userId);
          const response: any = await Axios.get(`/api/user/getUserFollows/${userId}`);

          setFollowers(response.data.userData.followers.length);
          setFollowing(response.data.userData.following.length);
          setFollowersData(response.data.followersData);
          setFollowingData(response.data.followingData);
        }
      } catch (error) {
        console.error('Error getting followers:', error);
      }
    };

    
    getFollowers();
  }, []);



  return (

    <div className="bg-black h-full w-full text-white fullbg-profile">
      <SideBar />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="" style={{ height: '100vh', paddingBottom: '10px', marginBottom: '10px' }}>
        <div className="flex items-center justify-center space-x-8 p-8">
          <div className="flex flex-col items-center">
          <img
  className="rounded-full w-32 h-32 object-cover shadow-md"
  src={
    newProfilePicture
      ? URL.createObjectURL(newProfilePicture)
      : userData.profilePicture
      ? `http://localhost:3000/upload/${userData.profilePicture}`
      : `https://ui-avatars.com/api/?name=${getInitials(userData.username)}&background=random&size=200`
  }
  alt="Profile Picture"
/>

            <button
              className="mt-4 text-blue-500 hover:text-blue-700"
              onClick={handleEditClick}
            >
              🖍 Edit
            </button>
            <div className="flex flex-col mt-4 text-center"></div>

          </div>

          <div className=" relative top-[-20px]">
            <h1 className="text-2xl font-bold mb-4">{userData?.username}</h1>
            <ul className="flex justify-evenly space-x-6">
              <li className="text-xl flex flex-col items-center ">
                <span className="text-sm font-bold">Post</span>
                <span className="text-gray-600 text-base">{userPosts?.length}</span>
              </li>
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-sm font-bold" onClick={openModal}>Followers</span>
                <span className="text-gray-600 text-base">{followers}</span>
              </li>
              <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                <span className="text-sm font-bold" onClick={opens}>following</span>
                <span className="text-gray-600 text-base">{following}</span>
              </li>
            </ul>
          </div>



        </div>
        <div className="flex items-center justify-items-start flex-col" >
          {/* <h1 className="text-xl font-bold">{userData?.username}</h1> */}
          <div className="flex justify-start w-6/12 flex-col"> 
          <h1>{userData?.bio}</h1>
          <br />
          <h1 className="text-3xl">Post</h1>
          </div>
          
        </div>

        <div className="bg-black" >
          <br />
          <br />

          <div className="grid  fullbg-profile justify-center hight-auto">
            {userPosts?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {userPosts.map((post: string | any) => (
                  <div key={post._id} className=" shadow-m border border-b-slate-900 rounded-s-sm">
                    {post.image.length > 0 && (
                      <img
                        src={`http://localhost:3000/upload/${post?.image}`}
                        alt="Post"
                        className="post-image shadow-md"
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-black flex flex-col">
                <p className="text-lg font-bold mb-4">No posts available</p>
                <Button variant="outline" onClick={() => handleGoToPost()} className="text-black">
                  Go to create
                </Button>

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


{isOpen && (
  <>
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-black opacity-50 w-full h-full z-10"
    />

    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-4 sm:p-8 rounded shadow-lg z-20 max-w-screen-md w-full sm:w-96">
      <div className="flex justify-end">
        <Button variant="ghost" onClick={closeModal} >
          X
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-xl text-white mb-4">Followers</h1>
        <div className="text-gray-300 flex flex-col">
          {followersData?.map((follower: any) => (
            <div key={follower._id} className="p-2 sm:p-4 flex w-full sm:w-auto">
              <div className="flex items-center">
                <img
                  src={ `http://localhost:3000/upload/${follower.profilePicture}`}
                  alt={`${follower.username}'s Profile`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2"
                />
                <span className="block">{follower.username}</span>
              </div>
              <Button variant='outline' className="relative left-32">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)}


{open && (
  <>
    <div
      onClick={close}
      className="fixed inset-0 bg-black opacity-50 w-full h-full z-10"
    />

    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-4 sm:p-8 rounded shadow-lg z-20 max-w-screen-md w-full sm:w-96">
      <div className="flex justify-end">
        <Button variant="ghost" onClick={close} >
          X
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-xl text-white mb-4">Following</h1>
        <div className="text-gray-300 flex flex-col">
          {followingData?.map((following: any) => (
            <div key={following._id} className="p-2 sm:p-4 flex w-full sm:w-auto">
              <div className="flex items-center">
                <img
                  src={ `http://localhost:3000/upload/${following.profilePicture}`}
                  alt={`${following.username}'s Profile`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2"
                />
                <span className="block">{following.username}</span>
              </div>
              <Button variant='outline' className="relative left-32">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)}




    </div>

  );
};
export default UserProfile;

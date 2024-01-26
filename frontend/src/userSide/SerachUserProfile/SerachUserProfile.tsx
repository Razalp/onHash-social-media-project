import { useEffect, useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { Modal } from "react-bootstrap";



const SearchUserProfile = () => {
    const { userId } = useParams();

    const [userData, setUserData] = useState<any[]>([]);
    const [userPosts, setUserPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [followingData,setFollowingData] = useState<any[]>();
    const [followersData,setFollowersData] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false);
    const [open,setOpen] =useState(false)

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

    //     console.log("Followers count:", followers.length);
    // console.log("Following count:", following.length);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await Axios.get(`/api/user/serachUser-post/${userId}`);
                setUserData(response.data);
           


            } catch (error) {
                console.error(error);
                toast.error('Error fetching user profile');
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await Axios.get(`/api/user/my-post/${userId}`);
                setUserPosts(response.data);
                // console.log(response.data.length)
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        if (userId) {
            fetchUserPosts();
        }
    }, [userId]);



    const getInitials = (name: any) => {
        return name
            .split(' ')
            .map((word: any) => word.charAt(0))
            .join('');
    };


    const handleFollow = async () => {
        try {
            const response = await Axios.post(`/api/user/follow/${userId}`, {
                user: getCurrentUserId()
            });
            if (response.data) {
                setIsFollowing(true);
                toast.success('You are now following this user');
            } else {
                toast.error('Error following user');
            }
        } catch (error) {
            console.error('Error following user:', error);
            toast.error('Error following user');
        }
    };

    // Unfollow user
    const handleUnfollow = async () => {
        try {
            const response = await Axios.post(`/api/user/unfollow/${userId}`, {
                user: getCurrentUserId()
            });
            if (response.data) {
                setIsFollowing(false);
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

        if (token) {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.userId;
        }

        return null;
    };
    // console.log(getCurrentUserId())

    interface UserData {
        follower: any[];
        // following: any[];
    }

    const getFollowers = async () => {
        try {
            const response: any = await Axios.get(`/api/user/followers/${userId}`);
            // console.log(response.data,"dataaaa");

            setFollowers(response.data.userData.followers.length);
            setFollowing(response.data.userData.following.length);
            setFollowersData(response.data.followersData)
            setFollowingData(response.data.followingData)
            console.log(response.data.followingData,"helo")

        } catch (error) {
            console.error('Error getting followers:', error);
        }
    };

    useEffect(() => {
        getFollowers();

    }, [userId]);



    return (
        <div className="bg-black h-full w-full text-white fullbg-profile">
            <SideBar />
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <div className="" style={{ height: '100vh', paddingBottom: '10px', marginBottom: '10px' }}>
                <div className="flex items-center justify-center space-x-8 p-8">
                    <div className="flex flex-col items-center">
                        <img
                            className="rounded-full w-32 h-32 object-cover shadow-md"
                            src={`http://localhost:3000/upload/${userData?.profilePicture}`}
                            alt="User Profile"
                        />

                        <div className="flex flex-col mt-4 text-center">
                            <h1 className="text-2xl font-bold mb-4"></h1>
                        </div>
                    </div>
                    <div className="relative top-[-20px]">
                        <h1 className="text-2xl font-bold mb-4">{userData?.username}</h1>
                        <ul className="flex justify-evenly space-x-6">
                            <li className="text-xl flex flex-col items-center">
                                <span className="text-sm">Post</span>
                                <span className="text-gray-600 text-base">{userPosts?.length}</span>
                            </li>
                            <li
                                className="text-xl flex flex-col items-center hover:text-yellow-200 cursor-pointer"

                            >
                                <span className="text-sm" onClick={openModal} >Followers</span>
                                <span className="text-gray-600 text-base">{followers}</span>
                            </li>
                            <li
                                className="text-xl flex flex-col items-center hover:text-yellow-200 cursor-pointer"

                            >
                                <span className="text-sm" onClick={opens}>Following</span>
                                <span className="text-gray-600 text-base">{following}</span>
                            </li>
                        </ul>
                        <br />
                        <ul className="flex space-x-4">
                            {isFollowing ? (
                                <li><Button variant="ghost" onClick={handleUnfollow}>UNFOLLOW</Button></li>
                            ) : (
                                <li><Button variant="outline" onClick={handleFollow}>FOLLOW</Button></li>
                            )}
                            <li><Button variant='secondary'>MESSAGE</Button></li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-items-start flex-col">
                    <div className="flex justify-start w-6/12 flex-col">
                        <h1></h1>
                        <br />
                        <h1 className="text-3xl">Post</h1>
                    </div>
                </div>
                <div className="bg-black">
                    <br />
                    <br />
                    <div className="grid  fullbg-profile justify-center hight-auto">
                        {userPosts?.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {userPosts.map((posts: string | any) => (
                                    <div key={posts._id} className=" shadow-m border border-b-slate-900 rounded-s-sm">
                                        {posts.image.length > 0 && (
                                            <img
                                                src={`http://localhost:3000/upload/${posts?.image}`}
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

                            </div>
                        )}
                    </div>

                </div>
            </div>

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

export default SearchUserProfile;

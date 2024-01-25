import { useEffect, useState } from "react";
import Axios from "@/axious/instance";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import  defalt from'./download.png'
const SearchUserProfile = () => {
    const { userId } = useParams();
    console.log(userId)
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response  = await Axios.get(`/api/user/serachUser-post/${userId}`);
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
                console.log(response.data)
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
                                <span className="text-gray-600 text-base">1</span>
                            </li>
                            {/* Assuming you have followers and following data in your response */}
                            <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                                <span className="text-sm">Followers</span>
                                <span className="text-gray-600 text-base">1</span>
                            </li>
                            <li className="text-xl flex flex-col items-center hover:text-yellow-200">
                                <span className="text-sm">Following</span>
                                <span className="text-gray-600 text-base">1</span>
                            </li>
                        </ul>
                        <br />
                        <ul className="flex space-x-4">
                            <li><Button variant="outline">FOLLOW</Button></li>
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
        </div>
    );
};

export default SearchUserProfile;

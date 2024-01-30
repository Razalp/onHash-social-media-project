import { useEffect, useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faFlag, faUserCircle ,faKeyboard } from '@fortawesome/free-solid-svg-icons'
import Swal from "sweetalert2";



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
    const [selectedPost, setSelectedPost] = useState<any>({
        post: null,
        user: {
          username: '',
          profilePicture: '',
        },
      });
     
      const [isLiked, setIsLiked] = useState(false);
      const [commentText, setCommentText] = useState('');
      const [showCommentBox, setShowCommentBox] = useState(false);
      const [selectedReason, setSelectedReason] = useState("");
      const [post, setPost] = useState<any[]>()
      const [Serachuser,setSearchUser] =useState<any[]>([])
      const [showEmojiPopup, setShowEmojiPopup] = useState(false);
      const emojiList = ['❤️', '😊', '👍', '🎉', '🔥', '😂', '🌟', '👏'];


      const handleEmojiReaction = (emoji:any) => {
        setCommentText((prevText) => prevText + emoji);
        setShowEmojiPopup(false);
      };
    



      const handleReportWithConfirmation = async () => {
        try {
    
          const postId = selectedPost.post._id;
          const result = await Swal.fire({
            title: 'Report Post',
            html: `
              <select id="swal-select1" class="swal2-select">
                <option value="sexual-content">Sexual Content</option>
                <option value="unnecessary">Unnecessary</option>
                <option value="not-for-child">Not Suitable for Children</option>
                <option value="vulgar">Vulgar Language</option>
                <option value="terror">Terror-related</option>
              </select>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, report it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            preConfirm: () => {
              const select = document.getElementById('swal-select1') as HTMLSelectElement;
              const selectedReason = select?.value;
              if (!selectedReason) {
                Swal.showValidationMessage('Please select a reason');
                return false;
              }
              return selectedReason;
            }
        });
  
      
          if (result.isConfirmed) {
            const response = await Axios.post(`/api/user/report/${postId}`, { userId: userId, reason: selectedReason });
      
            if (response.status === 200) {
              Swal.fire('Reported!', 'The post has been reported successfully.', 'success');
            } else {
              Swal.fire('Error', 'Failed to report the post. Please try again later.', 'error');
            }
          } else if (result.isDismissed) {
            Swal.fire('Cancelled', 'You did not report the post.', 'info');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'An internal error occurred. Please try again later.', 'error');
        }
      };
      const handleComments = () => {
        setShowCommentBox(!showCommentBox);
      };

        const handleComment = async (e:any) => {
    try {
      e.preventDefault();
        const postId = selectedPost.post._id;

      
            if (commentText.trim() !== '') {
                const commentResponse = await Axios.post(`/api/user/comments/${postId}`, {
                    currentUserId: userId,
                    text: commentText,
                });
                const updatedPostWithComment = commentResponse.data;
                setCommentText('');


            
            }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
};

      const handleLike = async () => {
        try {
          const postId = selectedPost.post._id;
      
      
            const response = await Axios.post(`/api/user/likes/${postId}`, { userId });
            const updatedPost = response.data;
            setIsLiked(true);
        
        } catch (error) {
          console.error('Error liking post:', error);
        }
      };

      useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await Axios.get(`/api/user/get-profile/${userId}`);
            setSearchUser(response.data);
    
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
    
        if (userId) {
          fetchUserProfile();
        }
      }, [userId]);



      const navigate=useNavigate()
      const openModals = (post: any, user: any) => {
        setSelectedPost({ post, user });
      };
    
      const closeModals = () => {
        setSelectedPost({ post: null, user: { username: '', profilePicture: '' } });
      };

      const handleGoToPost = () => {
        navigate('/create')
      }
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
            // console.log(response.data.followingData,"helo")

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
                            src={`http://localhost:3000/upload/${Serachuser?.profilePicture}`}
                            alt="User Profile"
                        />

                        <div className="flex flex-col mt-4 text-center">
                            <h1 className="text-2xl font-bold mb-4"></h1>
                        </div>
                    </div>
                    <div className="relative top-[-20px]">
                        <h1 className="text-2xl font-bold mb-4">{Serachuser?.username}</h1>
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
                    <div className="grid fullbg-profile justify-center hight-auto">
      {userPosts?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {userPosts.map((post:any) => (
            <div key={post._id} className="boxer">
              {post.image.length > 0 && (
                <div onClick={() => openModals(post, Serachuser)}>
                  <img
                    src={`http://localhost:3000/upload/${post?.image}`}
                    alt="Post"
                    className="post-image shadow-md"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
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
      {selectedPost.post && (
       <Modal show={true} onHide={closeModals} centered style={{ opacity: '20' }}>
       <div className="bg-black">
         <Modal.Header closeButton>
           <Modal.Title>
             <div className="flex items-center space-x-4">
               <img
                 src={`http://localhost:3000/upload/${selectedPost.user.profilePicture}`}
                 alt="Profile Picture"
                 className="w-12 h-12 rounded-full mr-2"
               />
               <h1 className="text-white">{selectedPost.user.username}</h1>
             </div>
           </Modal.Title>
         </Modal.Header>
        <Modal.Body>
          <img
            src={`http://localhost:3000/upload/${selectedPost.post.image}`}
            alt="Post"
            className="post-image w-full "
            style={{ objectFit: 'cover', height: '500px' }}
          />
          {/* Comment text box */}
          
        </Modal.Body>
        <h1 className="text-white relative left-6">Likes</h1>
        <div className="post-icons flex justify-between">
          <div className="flex items-center space-x-3 relative left-6">
            <button onClick={handleLike}>
              <FontAwesomeIcon
                icon={faHeart}
                className={`icon-button ${isLiked ? 'text-red-600' : 'text-white'}`}
                style={{ fontSize: '26px' }}
              />
            </button>
            <FontAwesomeIcon
              onClick={handleComments}
              icon={faComment}
              className="icon text-white"
              style={{ fontSize: '26px' }}
            />
            
          </div>
          <div className="flex items-center space-x-3 relative right-6">
            <FontAwesomeIcon onClick={handleReportWithConfirmation} icon={faFlag} className="icon text-white" style={{ fontSize: '26px' }} />
          </div>
          
        </div>
        {showCommentBox && (
        <form onClick={handleComment}>
          <input
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-1/2 p-2 mt-2 rounded-md border border-gray-300"
          />
          <Button variant="outline" type="submit" className="ml-1 w-1">
            ↩️
          </Button>
          <Button onClick={() => handleEmojiReaction('❤️')} className="ml-1 w-1">
            ❤️
          </Button>
          {/* Add more emoji buttons as needed */}
        </form>
        )}
        <br />
      </div>
    </Modal>
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
              <Button variant='outline' className="w-">
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

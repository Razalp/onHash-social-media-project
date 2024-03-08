import { useEffect, useState } from "react";
import Axios from "../../axious/instance";
import SideBar from "../SideBar/SideBar";
import './UserProfile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faFlag } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import Takefree from "./ProfileComponets/EditModal";
import { UserX,Send,Trash2 } from 'lucide-react';


const UserProfile = () => {
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
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
  const [followingData, setFollowingData] = useState<any[]>();
  const [followersData, setFollowersData] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>({
    post: null,
    user: {
      username: '',
      profilePicture: '',
    },
  });
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [likeData, SetLikeData] = useState<any[]>([]);
  const [commentData, SetCommentData] = useState<any>([])
  const [openLikes, setOpenLikes] = useState(false);
  const [postLikes, setPostLikes] = useState<any>({});




  const handleDeletePost = async () => {
    try {
      const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",

        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonColor: '#000',
        confirmButtonText: 'Yes, delete it!',
      });
  

      if (confirmResult.isConfirmed) {
        const response = await Axios.delete(`/api/user/post/delete/${selectedPost.post._id}`);
        if (response.status === 200) {
          console.log(response.data.message);

          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        } else {
          console.error(response.data.message);
          Swal.fire('Error', 'Failed to delete the post.', 'error');
        }
      }
      // fetchUserData()
    } catch (error) {
      console.error('Error deleting post:', error);

      Swal.fire('Error', 'Failed to delete the post.', 'error');
    }
  };
  



  const handleDeleteProfilePicture = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;
      setIsLoading(true);
      await Axios.delete(`/api/user/delete-profile-picture/${userId}`);
      setIsLoading(false);
      // fetchUserData();
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      setIsLoading(false);
  
    }
  };
  



  const opensLikes = () => {
    setOpenLikes(true);

  };

  const closeLikes = () => {
    setOpenLikes(false);
  };






    const fetchPostDetails = async () => {
      try {

        const postId = selectedPost?.post?._id;
        console.log(postId, "postett")
        const token = localStorage.getItem('accessToken');

        if (!token) {
          return;
        }

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        if (postId != null) {


          const response = await Axios.get(`/api/user/getPostDetailes/${postId}/${userId}`);

          SetLikeData(response.data.likes);
          SetCommentData(response.data.comments);
          const token = localStorage.getItem('accessToken');

          if (!token) {
            return;
          }

        } else {
          return null
        }
      } catch (error) {
        console.error(error);
      
      }
    };
    useEffect(() => {
    if (selectedPost) {
      fetchPostDetails();

    }
  }, [selectedPost,commentText]);


  const handleComments = () => {
    setShowCommentBox(!showCommentBox);
  };



  const handleReportWithConfirmation = async () => {
    try {

      const postId = selectedPost.post._id;

      const token = localStorage.getItem('accessToken');

      if (!token) {
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;

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
          const selectedReason  = select?.value;
          if (!selectedReason) {
            Swal.showValidationMessage('Please select a reason');
            return false;
          }
          return selectedReason;
        }
      });

      if (result.isConfirmed) {
        const selectedReason = result.value;
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




  const handleLike = async (postId: any) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await Axios.post(`/api/user/likes/${postId}`, { currentUserId: userId });
        const updatedPost = response.data;

        // Update local storage with the like status
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        likedPosts[postId] = !likedPosts[postId];
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

        setPostLikes((prevPostLikes: any) => ({
          ...prevPostLikes,
          [postId]: !prevPostLikes[postId],
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  useEffect(() => {
    // Read liked posts from local storage on mount
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    setPostLikes(likedPosts);
  }, []);


  const handleComment = async (e: any) => {
    try {
      e.preventDefault();
      const postId = selectedPost.post._id;
      const token = localStorage.getItem('accessToken');

      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        if (commentText.trim() !== '') {
          const commentResponse = await Axios.post(`/api/user/comments/${postId}`, {
            currentUserId: userId,
            text: commentText,
          });

          const updatedPostWithComment = commentResponse.data;

          SetCommentData((prevComments: any) => [updatedPostWithComment.comment, ...prevComments]);

          setCommentText('');
        }
      } else {

      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


  const openModals = (post: any, user: any) => {
    setSelectedPost({ post, user });
  };

  const closeModals = () => {
    setSelectedPost({ post: null, user: { username: '', profilePicture: '' } });
  };



  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const opens = () => {
    setOpen(true)
  }
  const close = () => {
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
        const fileType = newProfilePicture.type;
        if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif') {
          formData.append('profilePicture', newProfilePicture);
        } else {
          toast.error('Please select a JPG, PNG, or GIF image file for the profile picture.');
          return;
        }
      }

      if (newUsername.trim() !== '') {
        formData.append('username', newUsername.trim());
      }

      if (newBio.trim() !== '') {
        formData.append('bio', newBio.trim());
      }

      await Axios.post('api/user/update-profile', formData);

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
          <Takefree user={userData} handleedit={handleEditClick} userpostlength={userPosts.length} followers={followers} following={following}
            openModal={openModal} opens={opens} getInitials={getInitials} 
          ></Takefree>
        </div>
        <div className="flex items-center justify-items-start flex-col" >
          {/* <h1 className="text-xl font-bold">{userData?.username}</h1> */}
          <div className="flex justify-start w-6/12 flex-col">
            <h1 className="text-lg ml-4">Post</h1>
          </div>
        </div>
        <div className="bg-black" >
          <br />
          <br />
          <div className="grid fullbg-profile justify-center hight-auto">
            {userPosts?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 ">
                {userPosts.map((post: any) => (
                  <div key={post._id} className="boxer">
                    {post.image.length > 0 && (
                      <div onClick={() => openModals(post, userData)}>
                        <img
                          src={`${import.meta.env.VITE_UPLOAD_URL}${post?.image}`}
                          alt="Post"
                          className="post-image shadow-md "
                          style={{ width: '250px', height: '300px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-black flex flex-col">
                <p className="text-lg font-bold mb-4">No posts available</p>
                {/* Button component and handleGoToPost function not provided, please implement accordingly */}
                <button onClick={handleGoToPost} className="text-black">
                  Go to create
                </button>
              </div>
            )}
            {selectedPost.post && (
              <Modal show={true} onHide={closeModals} centered style={{ opacity: '20', maxHeight: '100vh' }}>
                <div className="bg-black">
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <div className="flex items-center space-x-4">
                        <img
                          src={`${import.meta.env.VITE_UPLOAD_URL}${selectedPost.user.profilePicture}`}
                          alt="Profile Picture"
                          className="w-12 h-12 rounded-full mr-2"
                        />
                        <h1 className="text-white">{selectedPost.user.username}</h1>
                      </div>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <img
                      src={`${import.meta.env.VITE_UPLOAD_URL}${selectedPost.post.image}`}
                      alt="Post"
                      className="post-image w-full "
                      style={{ objectFit: 'cover', width: '656px', height: '500px' }}
                    />
                  </Modal.Body>
                  <button onClick={opensLikes} className="text-white ml-6 text-xs">
                    Likes
                  </button>
                  <div className="post-icons flex justify-between">
                    <div className="flex items-center space-x-3 relative left-6">
                      <button
                        onClick={() => handleLike(selectedPost.post._id)}
                        className="like-button"
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={`icon-button ${postLikes[selectedPost.post._id] ? 'text-red-600' : 'text-white'}`}
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
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon
                        onClick={handleReportWithConfirmation}
                        icon={faFlag}
                        className="icon text-white"
                        style={{ fontSize: '26px' }}
                      />
                       <button onClick={handleDeletePost} className="text-white"><Trash2 /></button>
                    </div>
                   
                  </div>
                  <br />
                  <div className="flex justify-between">
                    <h1 className="text-white ml-6">{selectedPost.post.caption}</h1>
                    <h1 className="text-white mr-6">
                      {new Date(selectedPost.post.createdAt).toLocaleTimeString()}
                    </h1>
                  </div>
                  {showCommentBox && (
                    <div>
                      <br />
                      <form onSubmit={handleComment} className="flex items-center">
  <input
    placeholder="Add a comment..."
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    className="w-full p-2 rounded-md bg-slate-900 focus:border-blue-500"
  />
  <Button variant={"outline"} type="submit" className="px-3 ml-1">
    <Send />
  </Button>
</form>


                      <div className="comments-container">
                        <h3 className="text-white mt-4">Comments:</h3>
                        <br />
                        <ul className="space-y-1">
  {commentData.map((comment:any, index:any) => (
    <li key={index} className=" p-2 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={`${import.meta.env.VITE_UPLOAD_URL}${comment?.user?.profilePicture}`}
            alt="User Profile"
            className="w-10 h-10 rounded-full mr-4 object-cover"
          />
          <div>
            <span className="font-semibold text-white">{comment?.user?.username}</span>
            <p className="text-gray-300">{comment?.text}</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm">{comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</p>
      </div>
    </li>
  ))}
</ul>


                      </div>
                    </div>
                  )}
                <br />
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Profile
                    </h3>
                    <br />
                    <div>
      <Button variant={"outline"} onClick={handleDeleteProfilePicture} disabled={isLoading} className="" >
        {isLoading ? 'Deleting...' : <UserX />}
      </Button>
    </div>
    <br />
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={handleNewUsernameChange}
                        maxLength={20}
                        className="border rounded-md p-2 text-black w-full"
                      />
                    </div>
                    <div className="mt-2">
                      <textarea
                        placeholder="New Bio"
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        maxLength={150} 
                        className="border rounded-md p-2 text-black w-full"
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
                        src={`${import.meta.env.VITE_UPLOAD_URL}${follower.profilePicture}`}
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
                        src={`${import.meta.env.VITE_UPLOAD_URL}${following.profilePicture}`}
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
      {openLikes && (
        <>
          <div onClick={closeLikes} className="fixed inset-0 bg-black opacity-50 w-full h-full z-10"/>
          <div className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-slate-950 p-4 sm:p-8 rounded shadow-lg z-20 max-w-screen-md w-full sm:w-80">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={closeLikes} >
                X
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-xl text-white mb-4">likes</h1>
              <div className="text-gray-300 flex flex-col">
                {likeData?.map((likes: any) => (
                  <div key={likes._id} className="p-2 sm:p-4 flex w-full sm:w-auto">
                    <div className="flex items-center">
                      <img
                        src={`${import.meta.env.VITE_UPLOAD_URL}${likes.user.profilePicture}`}
                        alt={`${likes.user.username}'s Profile`}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2"
                      />
                      <span className="block">{likes.user.username}</span>
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

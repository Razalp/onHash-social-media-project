import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import photo from './photoreal-model.webp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faFlag, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Axios from "@/axious/instance";
import { jwtDecode } from "jwt-decode";
import Story from "./Story";
import LazyLoad from 'react-lazyload';
import LoadingSpinner from './LoadingSpinner'; // Replace with your actual LoadingSpinner component

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/')
     
    }else{
      navigate('/log-in');
    }
  }, []);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          navigate('/log-in');
          return;
        }

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        setLoading(true);
        const response = await Axios.get(`/api/user/home/${userId}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  return (
    <div className="bg-black">
      <SideBar />
      <Story />
      <div className="flex justify-center items-center">
        <div className="grid gap-4 p-4 ">
          {loading ? (
            <LoadingSpinner /> // Render loading spinner when fetching posts
          ) : (
            posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <div key={post._id} className="post-container bg-neutral-950 rounded-md p-4 shadow-md text-white">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:3000/upload/${post.user.profilePicture}`}
                      alt={post.user.username}
                      className="rounded-full w-12 h-12 mb-2"
                    />
                    <h1 className="text-sm font-semibold">{post.user.username}</h1>
                  </div>
                  <div className="flex justify-center mb-4">
                    <LazyLoad height={200} offset={100}>
                      <img
                        src={`http://localhost:3000/upload/${post.image}`}
                        alt="Post"
                        className="post-image rounded-md object-cover"
                        style={{ width: "440px", height: "470px" }}
                      />
                    </LazyLoad>
                  </div>
                  <div className="post-icons flex justify-between">
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faHeart} className="icon text-red-500" style={{ fontSize: '26px' }} />
                      <FontAwesomeIcon icon={faComment} className="icon" style={{ fontSize: '26px' }} />
                    </div>
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faFlag} className="icon" style={{ fontSize: '26px' }} />
                      <FontAwesomeIcon icon={faUserCircle} className="icon" style={{ fontSize: '26px' }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

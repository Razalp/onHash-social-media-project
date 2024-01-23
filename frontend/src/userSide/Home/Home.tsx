// Home.js

import { useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import photo from './photoreal-model.webp'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faFlag, faUserCircle } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, []);

  return (
    <>
      <SideBar />
      <div className="flex justify-center relative top-16">
        <div className="post-container bg-neutral-950 rounded-md p-4 shadow-md text-white">
          <div className="flex items-center mb-4 space-x-12">
            <img src={photo} alt="user" className="rounded-full w-20 h-20 mb-2" />
            <h1 className="text-sm font-semibold">Username</h1>
          </div>

          <img
            src="https://placekitten.com/600/500"
            alt="Post"
            className="post-image rounded-md mb-4"
          />

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
      </div>
    </>
  );
}

export default Home;

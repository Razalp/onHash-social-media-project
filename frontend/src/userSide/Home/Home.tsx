// Home.js

import { useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";


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
    <SideBar/>
      <div className="flex fullbg">
        <img src="" alt="" />
    </div>
    </>

  );
}

export default Home;

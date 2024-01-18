import { useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import './Home.css'

const Home = () => {
  const navigate=useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, []);
  return (
    <div className="fullbg">
      <SideBar/>

      <div>
      
      </div>

    </div>
  );
}

export default Home;


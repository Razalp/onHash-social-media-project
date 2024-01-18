import { useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate=useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/log-in');
    }
  }, []);
  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh' }}>
      <SideBar/>

      <div>
  
      </div>

    </div>
  );
}

export default Home;


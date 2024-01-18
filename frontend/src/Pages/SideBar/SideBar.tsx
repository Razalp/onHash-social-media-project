import { useState } from 'react';
import HashOnImage from '../../assets/HashOn.png';
import './SideBar.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleSignOut=()=>{
    localStorage.removeItem("accessToken")
    navigate('/log-in')
  }


  return (

    <div className={`h-screen flex transition-all duration-500 ${isOpen ? 'w-64' : 'w-16'} text-white sideBar`}>

      {isOpen && (
        <div>
          <div className="p-4">
            <img src={HashOnImage} alt="HashOn Logo" className="size-16 mb-4" />
          </div>
         
          <ul className="flex flex-col relative left-20 space-y-8">
  <li className="hover:text-blue-200"><Link to="/">HOME</Link></li>
  <li className="hover:text-blue-200">SEARCH</li>
  <li className="hover:text-blue-200">EXPLORE</li>
  <li className="hover:text-blue-200">REELES</li>
  <li className="hover:text-blue-200">MESSAGE</li>
  <li className="hover:text-blue-200">NOTIFICATIONS</li>
  <li className="hover:text-blue-200">CREATE</li>
  <li className="hover:text-blue-200">PROFILE</li>
  <li className="hover:text-blue-200">MORE</li>
  <li className="hover:text-blue-200" onClick={handleSignOut}>SIGNOUT</li>
</ul>

        </div>
      )}

      <button
        onClick={toggleSidebar}
        className="flex relative left-4 top-5"
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
};

export default SideBar;

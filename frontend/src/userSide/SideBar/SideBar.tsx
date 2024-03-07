import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import HashOnImage from '../../assets/HashOn.png';
import './SideBar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faEnvelope, faBell, faPlusCircle, faUser, faEllipsisV, faSignOutAlt, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Notifications from '../Notifications/Notifications';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#000',
      confirmButtonText: 'Yes, ign out!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('accessToken');
        navigate('/log-in')
      }
    });
  };

  return (
    <div className={`flex flex-row mx-auto justify-around  transition-all duration-500 ${isOpen ? 'w-64' : 'w-10'} text-white fixed h-screen sideBar main-content`}>
      {isOpen && (
        <div>
          <div className="p-4 ">
            <img src={HashOnImage} alt="HashOn Logo" className="size-10 mb-4 " />
          </div>

          <ul className="flex flex-col relative left-10 space-y-8 ">
            <li className="hover:text-blue-200 text-sm"><Link to="/"><FontAwesomeIcon className='size-4' icon={faHome} />  &nbsp; Home</Link></li>
            <li className="hover:text-blue-200 text-sm"><Link to="/search"><FontAwesomeIcon className='size-4' icon={faSearch} /> &nbsp; Search </Link></li>
            <li className="hover:text-blue-200 text-sm"><Link to='/chat'><FontAwesomeIcon icon={faEnvelope} /> &nbsp; Message </Link></li>
            <li className="hover:text-blue-200 text-sm flex"><FontAwesomeIcon className='size-4' icon={faBell} /> &nbsp; &nbsp; <Notifications/></li>
            <li className="hover:text-blue-200 text-sm"><Link to='/create'><FontAwesomeIcon className='size-4' icon={faPlusCircle} /> &nbsp; Create </Link></li>
            <li className="hover:text-blue-200 text-sm"><Link to='/profile'><FontAwesomeIcon icon={faUser} /> &nbsp; Profile</Link></li>
            <li className="hover:text-blue-200 text-sm" onClick={handleSignOut}><FontAwesomeIcon className='size-4' icon={faSignOutAlt} /> &nbsp; Signout</li>
          </ul>
        </div>
      )}

      <button
        onClick={toggleSidebar}
        className={`flex relative  top-5`}
      >
        {isOpen ? <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={faArrowRight} />}
      </button>
    </div>
  );
};

export default SideBar;

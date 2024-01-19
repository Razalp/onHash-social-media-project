import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import HashOnImage from '../../assets/HashOn.png';
import './AdminSideBar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUsers, faChartLine, faRunning, faTag, faUser, faSignOutAlt ,faArrowLeft , faArrowRight } from '@fortawesome/free-solid-svg-icons';
const AdminSideBar = () => {
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
        navigate('/log-in');
      }
    });
  };

  return (
<div className={`flex transition-all duration-500 ${isOpen ? 'w-64' : 'w-16'} text-white fixed h-screen sideBar main-content`}>
      {isOpen && (
        <div>
          <div className="p-4">
            <img src={HashOnImage} alt="HashOn Logo" className="size-16 mb-4" />
          </div>

          <ul className="flex flex-col relative left-20 space-y-8">
 <li className="hover:text-blue-200"><Link to="/dashboard"><FontAwesomeIcon icon={faTachometerAlt} /> &nbsp; DASHBOARD</Link></li>
 <li className="hover:text-blue-200"><Link to="/userManagement"><FontAwesomeIcon icon={faUsers} /> &nbsp; USERS </Link></li>
 <li className="hover:text-blue-200"><FontAwesomeIcon icon={faChartLine} /> &nbsp; REPORT</li>
 <li className="hover:text-blue-200"><FontAwesomeIcon icon={faRunning} /> &nbsp; ACTIVITIES</li>
 <li className="hover:text-blue-200"><FontAwesomeIcon icon={faTag} /> &nbsp; ADD PROMO</li>
 <li className="hover:text-blue-200"><Link to='/profile'><FontAwesomeIcon icon={faUser} /> &nbsp; PROFILE</Link></li>
 <li className="hover:text-blue-200" onClick={handleSignOut}><FontAwesomeIcon icon={faSignOutAlt} /> &nbsp; SIGNOUT</li>
</ul>
        </div>
      )}

      <button
        onClick={toggleSidebar}
        className={`flex relative left-4 top-5`}
      >
      {isOpen ? <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={ faArrowRight } />}
      </button>
    </div>
  );
};

export default AdminSideBar;

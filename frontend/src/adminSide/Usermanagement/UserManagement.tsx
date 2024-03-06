import { useEffect, useState } from 'react';
import AdminSideBar from '../AdminSideBar/AdminSideBar';
import './UserManagement.css';
import Axios from '../../axious/instance';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTimes, faTrashAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showButtons, setShowButtons] = useState(null);
  
  const handleSelectButtonClick = (index:Number|any) => {
    setShowButtons(index);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get('/api/admin/userManagament');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId:string) => {
    try {
      const response = await Axios.delete(`/api/admin/userManagement/${userId}`);
      if (response.data.message === 'User deleted successfully') {
        setUsers((prevUsers) => prevUsers.filter((user:any) => user._id !== userId));

        
        Swal.fire({
          icon: 'success',
          title: 'User deleted successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (userId:string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#000',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
      }
    });
  };

  const blockUser = async (userId:string) => {
    try {
      await Axios.put(`/api/admin/block/${userId}`);
      setUsers((prevUsers:any) =>
        prevUsers.map((user:any) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const confirmBlock = (userId:string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to block/unblock this user!',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#000',
      confirmButtonText: 'Sure !',
    }).then((result) => {
      if (result.isConfirmed) {
        blockUser(userId);
      }
    });
  };


  const filteredUsers = users.filter(
    (user:any) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminSideBar />
      <div className='fullbg' style={{height:'100vh'}}>
      <div className='flex justify-end'>
     
    <input
      className='p-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
      type='text'
      placeholder='Search users...'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
        <br />
          <table className="w-full table-fixed text-white border-collapse">
            <thead className="bg-gray-800 text-gray-300 text-sm">
              <tr className="table-row">
                <th className="py-2 text-sm">SI NO</th>
                <th className="px-4 py-2 text-left">USERNAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-center">PROFILE</th>
                <th className="px-4 py-2 text-center">IS ADMIN</th>
                <th className="px-4 py-2 text-center">IS UPGRADE</th>
                <th className="px-4 py-2 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
            {filteredUsers.map((item:any, index) => (
          <tr key={item?._id} className={index % 2 === 0 ? 'table-row bg-gray-800' : 'table-row bg-gray-700'} onMouseEnter={() => handleSelectButtonClick(index)} onMouseLeave={() => setShowButtons(null)}>
            <td className="py-2 text-sm"></td>
            <td className="px-4 py-2 text-sm">{item?.username?.toString()}</td>
            <td className="px-4 py-2 text-sm">{item?.email}</td>
            <td className="px-4 py-2 text-center">
              <img src={`${import.meta.env.VITE_UPLOAD_URL}${item.profilePicture}`} alt="User Profile" className="w-20 h-20 object-cover rounded-full" />
            </td>
            <td className="px-4 py-2 text-center">{item?.isAdmin?.toString()}</td>
            <td className="px-4 py-2 text-center">{item?.isUpgrade.toString()}</td>
            <td className="px-4 py-2 space-y-2 text-center">
  <button className="hover:bg-gray-800 rounded-full p-2">
    <FontAwesomeIcon icon={faEllipsisV} />
  </button>
  <div className='button-container'>
    {showButtons === index && (
      <div className='flex space-x-3'>
        <button className='' onClick={() => confirmDelete(item._id)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
        <button className='' onClick={() => confirmBlock(item._id)}>
          <FontAwesomeIcon icon={item.isBlocked ? faTimes : faUserShield} /> 
        </button>
      </div>
    )}
  </div>
</td>
          </tr>
        ))}        </tbody>
          </table>
        </div>
      </>
    );
    };

    export default UserManagement;

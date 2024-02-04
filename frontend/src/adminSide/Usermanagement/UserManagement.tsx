import React, { useEffect, useState } from 'react';
import AdminSideBar from '../AdminSideBar/AdminSideBar';
import './UserManagement.css';
import Axios from '../../axious/instance';
import Swal from 'sweetalert2';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const deleteUser = async (userId :any) => {
    try {
      const response = await Axios.delete(`/api/admin/userManagement/${userId}`);
      if (response.data.message === 'User deleted successfully') {
        setUsers((prevUsers) => prevUsers.filter((user :any) => user._id !== userId));

        // Show success alert
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

  const confirmDelete = (userId:any) => {
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

  const blockUser = async (userId :any) => {
    try {
      await Axios.put(`/api/admin/block/${userId}`);
      setUsers((prevUsers :any) =>
        prevUsers.map((user :any) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const confirmBlock = (userId :any) => {
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

  // Filter users based on the search query
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
      className='p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
      type='text'
      placeholder='Search users...'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
        <br />
          <table className="w-full table-fixed text-white border-collapse">
            <thead className="bg-gray-800 text-gray-300">
              <tr className="table-row">
                <th className="py-2">SI NO</th>
                <th className="px-4 py-2 text-left">USERNAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-center">PROFILE</th>
                <th className="px-4 py-2 text-center">IS ADMIN</th>
                <th className="px-4 py-2 text-center">IS UPGRADE</th>
                <th className="px-4 py-2 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
            {filteredUsers.map((item: any, index) => (
                <tr key={item?._id} className={index % 2 === 0 ? 'table-row bg-gray-800' : 'table-row bg-gray-700'}>
                  <td className="py-2"></td>
                  <td className="px-4 py-2">{item?.username?.toString()}</td>
                  <td className="px-4 py-2">{item?.email}</td>
                  <td className="px-4 py-2 text-center">
                    <img src={`http://localhost:3000/upload/${item.profilePicture}`} alt="User Profile" className="w-30 h-32 rounded-full" />
                  </td>
                  <td className="px-4 py-2 text-center">{item?.isAdmin?.toString()}</td>
                  <td className="px-4 py-2 text-center">{item?.isUpgrade.toString()}</td>
                  <td className="px-4 py-2 space-y-2 text-center">
                    <button className='btn-black' onClick={() => confirmDelete(item._id)}>DELETE</button>
                    <button className='btn-black' onClick={() => confirmBlock(item._id)}>
                    {item.isBlocked ? 'UNBLOCK' : 'BLOCK'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
    };

    export default UserManagement;

import React, { useEffect, useState } from 'react'
import AdminSideBar from '../AdminSideBar/AdminSideBar'
import './UserManagement.css'
import Axios from '../../axious/instance'

const UserManagement = () => {
    const [users, setUsers] = useState([]);
  
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
    return (
        <>
            <AdminSideBar />
            <div className='fullbg'>
            <table className="w-full table-fixed text-white divide-y">
    <thead className="bg-black">
        <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Profile</th>
            <th className="px-4 py-2">Is Admin</th>
            <th className="px-4 py-2">Is Upgrade</th>
            <th className="px-4 py-2">Actions</th>
        </tr>
    </thead>
    <tbody className="bg-black divide-y divide-gray-200">
        {users.map((item: any) => (
            <tr key={item._id} className="hover:bg-black">
                <th className="px-4 py-2">{item.username}</th>
                <th className="px-4 py-2">{item.email}</th>
                <td className="px-4 py-2 flex justify-center">
                <img src={ "/public/images/profile.jpg" + item.profilePicture} alt="Profile" className="w-10 h-10 rounded-full" />

                </td>
                <th className="px-4 py-2">{item.isAdmin.toString()}</th>
                <th className="px-4 py-2">{item.isUpgrade.toString()}</th>
                <th className="px-4 py-2"><button className='btn-black'>DELETE</button><br />
                 <button className='btn-black'>EDIT</button>
                 </th>
            </tr>
        ))}
    </tbody>
</table>

            </div>
        </>
     );
                       }

export default UserManagement

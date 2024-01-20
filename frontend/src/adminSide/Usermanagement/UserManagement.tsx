    import React, { useEffect, useState } from 'react';
    import AdminSideBar from '../AdminSideBar/AdminSideBar';
    import './UserManagement.css';
    import Axios from '../../axious/instance';
    import Swal from 'sweetalert2';
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

    const deleteUser = async (userId:any) => {
        try {
        const response = await Axios.delete(`/api/admin/userManagement/${userId}`);
        if (response.data.message === 'User deleted successfully') {
            setUsers((prevUsers) => prevUsers.filter((user:any) => user._id !== userId));

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
        text: 'You won\'t be able to revert this!',

        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonColor: '#000',
        confirmButtonText: 'Yes, delete it!',
        }).then((result:any) => {
        if (result.isConfirmed) {
            deleteUser(userId);
        }
        });
    };

    const blockUser = async (userId:any) => {
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
    
    const confirmBlock = (userId:any) => {
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

    return (
        <>
        <AdminSideBar />
        <div className='fullbg overflow-x-auto'>
            <table className="w-full table-fixed text-white divide-y">
            <thead className="bg-black">
                <tr className="table-row">
                    <th></th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-center">Profile</th>
                <th className="px-4 py-2 text-center">Is Admin</th>
                <th className="px-4 py-2 text-center">Is Upgrade</th>
                <th className="px-4 py-2 text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-200">
                {users.map((item :any) => (
                <tr key={item?._id} className="table-row">
                    <td></td>
                    <td className="px-4 py-2">{item?.username?.toString()}</td>
                    <td className="px-4 py-2">{item?.email}</td>
                    <td className="px-4 py-2 text-center">
                    </td>
                    <td className="px-4 py-2 text-center">{item?.isAdmin?.toString()}</td>
                    <td className="px-4 py-2 text-center">{item?.isUpgrade.toString()}</td>
                    <td className="px-4 py-2 space-y-2 text-center">
                    <button className='btn-black' onClick={() => confirmDelete(item._id)}>DELETE</button>
                    <button className='btn-black'>EDIT</button>
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

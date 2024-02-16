import React, { useEffect, useState } from 'react';
import Axios from '@/axious/instance';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await Axios.get(`/api/user/notifications/${userId}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch notifications');
      }

      const data = response.data;
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await Axios.delete(`/api/user/notifications/${notificationId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(notifications.filter(notification => notification._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={openModal} className="hover:text-blue-200 text-sm">Notifications</button>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="w-[400px] p-6 bg-white border border-gray-300 shadow-lg rounded-lg relative">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Notifications</h2>
            <button onClick={closeModal} className="absolute top-8 right-8 px-2 text-black">X</button>
            <br />
            <div>
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map(notification => (
                    <li key={notification._id} className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={`http://localhost:3000/upload/${notification.linkedUserProfile}`} alt="Profile" className="w-10 h-10 rounded-full mr-3 object-cover" />
                        <p className="text-lg text-gray-700 mr-auto">{notification.message}</p>
                      </div>
                      <button onClick={() => deleteNotification(notification._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">X</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-600">No notifications to display.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

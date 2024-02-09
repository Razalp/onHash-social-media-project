import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Axios from '@/axious/instance';
import { jwtDecode } from 'jwt-decode';

const Notifications = () => {
  // const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   const socket = io('http://localhost:3000');

  //   socket.on('connect', () => {
  //     console.log('Socket connected');
  //     const token = localStorage.getItem('accessToken');
  //     if (token) {
  //       const decodedToken = jwtDecode(token);
  //       const userId = decodedToken.userId;
  //       socket.emit('joinRoom', userId); 
  //     }
  //   });

  //   socket.on('newNotifications', ({ notifications }) => {
  //     console.log('New notifications received:', notifications);
  //     setNotifications(notifications);
  //   });

  //   // Fetch notifications only after the socket connection is established
  //   socket.on('connect', fetchNotifications);

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []); 

  // const fetchNotifications = async () => {
  //   try {
  //     const token = localStorage.getItem('accessToken');
  //     if (!token) {
  //       return;
  //     }

  //     const decodedToken:any = jwtDecode(token);
  //     const userId = decodedToken.userId;

  //     const response = await Axios.get(`/api/user/notifications/${userId}`);
  //     if (response.status !== 200) {
  //       throw new Error('Failed to fetch notifications');
  //     }

  //     const data = response.data;
  //     setNotifications(data);
  //   } catch (error) {
  //     console.error('Error fetching notifications:', error);
  //   }
  // };

  return (
    <div>
      {/* <h2>Notifications</h2>
      <ul>
        {notifications.map((notification:any) => (
          <li key={notification._id}>{notification.message}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Notifications;

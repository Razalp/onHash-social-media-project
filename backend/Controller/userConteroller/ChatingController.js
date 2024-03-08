  import Chat from '../../Model/ChatSchema.js'; 
  import User from '../../Model/UserSchema.js'
  import { io } from '../../server.js'; 
  import Notification from '../../Model/NotificationsSchema.js'

  const chatSend = async function chatSend(req, res) {
    try {
        const { sender, receiver, content } = req.body;
        const image = req.file ? req.file.filename : null;


        const newMessage = new Chat({
            sender,
            receiver,
            content,
            image: image,
        });
        console.log(newMessage)

        await newMessage.save();

        io.to(`message-${receiver}`).emit('chat message', newMessage);

 
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  const receiver = async (req, res) => {
      try {
        const { senderId, receiverId } = req.params; 

    
        const messages = await Chat.find({
          $or: [
            { sender: senderId, receiver: receiverId }, 
            { sender: receiverId, receiver: senderId },
          ],
        }).sort({ createdAt: -1 });
    


        res.status(200).json(messages);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    


    const chatHistories = async (req, res) => {
      try {
        const { userId } = req.params;
    
        const chats = await Chat.find({ sender: userId })
          .populate('receiver', 'username profilePicture')
          .sort({ createdAt: -1 })
          .exec();
    
        if (!chats || chats.length === 0) {
          return res.json([]);
        }
    
        const uniqueChats = [];
        const userIds = new Set();
    
        chats.forEach(chat => {
          if (chat.receiver && chat.receiver._id && !userIds.has(chat.receiver._id.toString())) {
            userIds.add(chat.receiver._id.toString());
            uniqueChats.push(chat);
          }
        });
    
        const formattedChats = uniqueChats.map(chat => ({
          _id: chat._id,
          sender: chat.sender,
          receiver: {
            _id: chat.receiver._id,
            username: chat.receiver.username,
            profilePicture: chat.receiver.profilePicture
          },
          message: chat.content,
          createdAt: chat.createdAt
        }));
    
        io.emit('newChatHistory', formattedChats);
    
        res.json(formattedChats);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    
    


    const notificationsOfUser = async (req, res) => {
      try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    
        const notificationsWithUserInfo = await Promise.all(
          notifications.map(async (notification) => {
            const linkUserId = notification.link;
            const linkedUser = await User.findById(linkUserId);
            if (linkedUser) {
              return {
                ...notification.toJSON(),
                linkedUserProfile: linkedUser.profilePicture,
                linkedUserUsername: linkedUser.username
              };
            } else {
              return notification.toJSON();
            }
          })
        );
    
 
        io.emit(`notifications_${userId}`, notificationsWithUserInfo);
    
        res.json(notificationsWithUserInfo);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

    const deleteNotification = async (req, res) => {
      try {
        const notificationId = req.params.notificationId;
    
        // Delete the notification by ID
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    
        // Check if the notification was found and deleted
        if (!deletedNotification) {
          return res.status(404).json({ error: 'Notification not found' });
        }
    
        res.json({ message: 'Notification deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

   
    
  export { chatSend, receiver ,chatHistories ,notificationsOfUser,deleteNotification  };

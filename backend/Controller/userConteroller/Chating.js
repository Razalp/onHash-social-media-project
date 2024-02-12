  import Chat from '../../Model/Chat.js'; 
  import User from '../../Model/UserModel.js'
  import { io } from '../../server.js'; 

  const chatSend = async function chatSend(req, res) {
    try {
        // Extract sender, receiver, and content from request body
        const { sender, receiver, content } = req.body;

        // Create a new message using the Chat model
        const newMessage = new Chat({
            sender,
            receiver,
            content,
        });

    
        await newMessage.save();


        io.emit(`message-${receiver}`, newMessage);

        // Respond with success message
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

  const receiver = async (req, res) => {
      try {
        const { senderId, receiverId } = req.params; 
        // console.log(req.params)
    
        const messages = await Chat.find({
          $or: [
            { sender: senderId, receiver: receiverId }, 
            { sender: receiverId, receiver: senderId },
          ],
        }).sort({ createdAt: 1 });
    

    
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
                                 .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                                 .exec();
    
        if (!chats || chats.length === 0) {
          return res.status(404).json({ message: 'Chat history not found' });
        }
    
        // Remove duplicates based on receiver userId
        const uniqueChats = [];
        const userIds = new Set();
        chats.forEach(chat => {
          if (!userIds.has(chat.receiver._id.toString())) {
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
          message: chat.message,
          createdAt: chat.createdAt
        }));
    
        // Emit 'newChatHistory' event to the user
        // Instead of emitting to a specific user, emit to all connected clients
        io.emit('newChatHistory', formattedChats);
    
        res.json(formattedChats);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    





   
    
  export { chatSend, receiver ,chatHistories  };

import Chat from '../../Model/Chat.js'; 
import { io } from '../../server.js'; 

const chatSend = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const newMessage = new Chat({
      sender,
      receiver,
      content,
    });
    await newMessage.save();

    io.emit(`message-${receiver}`, newMessage);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const receiver = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    const messages = await Chat.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { chatSend, receiver };

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Axios from '@/axious/instance';
import SideBar from '../SideBar/SideBar';
import { jwtDecode } from 'jwt-decode';
import Online from './Online world-pana (1).png'

const Chat = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [chatHistory,setChatHistory]=useState<any>([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);
    

    const handleFileInputChange = (e) => {
        const image = e.target.files[0];
        setSelectedImage(image); // Update selectedImage state
        setShowModal(true); // Show modal when an image is selected
    };
    

    const handleCloseModal = () => {
        setSelectedImage(null);
        setShowModal(false);
    };

    useEffect(() => {
        const token: any = localStorage.getItem('accessToken');
        if (!token) {
            return;
        }
        const decodedToken: any = jwtDecode(token);
        const currentUserId = decodedToken.userId;

        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
  

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (socket && selectedUser && selectedUser.userId) {
            // Join the room corresponding to the receiver's ID
            socket.emit('joinRoom', `message-${selectedUser.userId}`);
    
            // Listen for incoming messages
            socket.on('chat message', (msg: any) => {
                // When a new message arrives, update the messages state
                
                setMessages((prevMessages: any) => [msg, ...prevMessages]);
                if (selectedUser && selectedUser.userId) {
                setTimeout(fetchMessages, 1000);
                }
            });
        }
    
        return () => {
            // Leave the room when component unmounts
            if (socket && selectedUser && selectedUser.userId) {
                socket.emit('leaveRoom', `message-${selectedUser.userId}`);
            }
        }
    }, [socket, selectedUser]);  

   // Update the sendMessage function to send the image file along with the message
const sendMessage = async () => {
    try {
        if (!socket || !selectedUser || !selectedUser.userId) {
            console.error('Error: Socket not connected or no recipient selected');
            return;
        }

        // Create FormData object to send the image file to the server
        const formData = new FormData();
        formData.append('sender', senderId);
        formData.append('receiver', selectedUser.userId);
        formData.append('content', inputMessage);
        if (selectedImage) {
            formData.append('image', selectedImage); // Append the image file directly
        }

        // Send message to the server via WebSocket
        socket.emit('chat message', {
            sender: senderId,
            receiver: selectedUser.userId,
            content: inputMessage,
            image: selectedImage ? selectedImage.name : null,
        });

        // Send the FormData object containing the image file to the server
        await Axios.post('/api/user/send', formData);

        

        // Clear input field after sending message
        fetchMessages();
     
        
        setInputMessage('');
        setSelectedImage(null);
        setShowModal(false);
        
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

    
    
const fetchMessages = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token || !selectedUser.userId) {
            return;
        }
        const decodedToken: any = jwtDecode(token);
        const currentUserId = decodedToken.userId;
        setSenderId(currentUserId);

        const receiverId = selectedUser.userId;

        const response = await Axios.get(`/api/user/${currentUserId}/${receiverId}`);
        const messages = response.data;
        setMessages(messages);
        fetchChatHistory()
       
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};
    useEffect(() => {
        if (selectedUser && selectedUser.userId) {
            fetchMessages();
            
        }
    }, [selectedUser]);


        const fetchChatHistory = async () => {
          try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
              return;
            }
            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken.userId;
            const response = await Axios.post(`/api/user/chatHistories/${userId}`)
            setChatHistory(response.data);
      
      
            // Listen for 'newChatHistory' event
            socket.on('newChatHistory', (newChatHistory) => {
              setChatHistory(newChatHistory);
            });
      
          } catch (error) {
            console.error('Error fetching chat history:', error);
          }
        };
        useEffect(() => {
      
        fetchChatHistory();
      }, []);
      



    const handleSearch = async () => {
        try {
            const response = await Axios.get(`/api/user/searchUser?query=${searchQuery}`);
            setSearchResults(response.data);
    
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleInputChange = (e: any) => {
        const inputValue = e.target.value;
        setSearchQuery(inputValue);
        if (inputValue) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    };

    const handleUserClick = (user: any) => {
        setSelectedUser({
            userId: user._id,
            profilePicture: user.profilePicture,
            name: user.username
        });

        setSearchResults([]);
  
    };

    return (
        <div>
            <SideBar />
            <div className='bg-black border-black'>
                <div className="w-full h-32 bg-black  border-black"></div>

                <div className="container mx-auto" style={{ marginTop: '-128px' }}>
                    <div className="py-6 h-screen">
                        <div className="flex border border-grey rounded shadow-lg h-full">
                            <div className="w-1/4 border flex flex-col">
                                
                                <div className="px-6 py-4 bg-gray-200">
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-gray-300 rounded-lg outline-none"
                                            placeholder="Search or start new chat"
                                            value={searchQuery}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            className="text-gray-600 hover:text-blue-500 focus:outline-none relative right-9 top-1"
                                            onClick={handleSearch}
                                        ></button>
                                    </div>
                                    <div>
                                        {searchResults.length > 0 && (
                                            <div className="mt-4 relative w-3/6">
                                                <ul className="justify-start w-full">
                                                    {searchResults.map((user: any) => (
                                                        <li key={user._id} className="flex items-center space-x-4 mb-4" onClick={() => handleUserClick(user)}>
                                                            <img
                                                      
                                                                src={`http://localhost:3000/upload/${user?.profilePicture}`}
                                                                alt={`${user.username}'s profile`}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                                onError={(e: any) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '';
                                                                }}
                                                            />
                                                            <h1>{user.username}</h1>
                                                            <div className="flex-grow"></div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-100 flex-1 overflow-auto">
  {chatHistory.map(chat => (
    <div className='flex items-center mt-2 ml-2' key={chat._id}>
      <img 
        src={`http://localhost:3000/upload/${chat.receiver.profilePicture}`} 
        className='w-10 h-10 rounded-full cursor-pointer' 
        alt=""
        onClick={() => handleUserClick(chat.receiver)}
      />
      <div className='ml-3'>
        <h1 className='text-sm font-semibold'>{chat.receiver.username}</h1>
        <p className='text-sm text-gray-600'>{chat.message}</p>
      </div>
    </div>
  ))}
</div>



                            </div>
                             {selectedUser?.userId ? ( 
                              <div className="w-3/4 border flex flex-col">
                                <div className="py-2 px-3 bg-gray-200 flex flex-row justify-between items-center">
                                    <div className="flex items-center">
                                        <div>
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={selectedUser ? `http://localhost:3000/upload/${selectedUser.profilePicture}` : 'https://source.unsplash.com/random'}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-800 font-bold">
                                                {selectedUser.name}
                                            </p>
                                            <p className="text-gray-600 text-xs mt-1">
                                                {selectedUser.userId}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".5" d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"></path></svg>
                                        </div>
                                        <div className="ml-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".5" d="M11 18.5v-6h2v6h-2zm0-8.5c-2.8 0-5 2.2-5 5v2h2v-2c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v2h2v-2c0-2.8-2.2-5-5-5z"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col-reverse flex-1 overflow-auto" style={{ backgroundColor: '#DAD3CC' }}>
                                {messages.length > 0 ? (
    messages.map((message: any, index) => (
        <div key={index} className={`flex justify-between ${message.sender === senderId ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`bg-gray-300 rounded-lg p-2 ${message.sender === senderId ? 'ml-4' : 'mr-4'}`}>
                {message.image ? (
                    // If the message contains an image, render the image
                    <img src={`http://localhost:3000/upload/${message.image}`} alt="message-image" className="w-60 h-80 mb-2 object-cover" />
                ) : (
                    // If the message is text, render the text content
                    <p>{message.content}</p>
                )}
                <div className="flex justify-end items-center mt-1">
                    <span className="text-xs text-gray-600">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.sender === senderId && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 text-gray-600"><path fillRule="evenodd" d="M0 11a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H1.5a.5.5 0 0 1-.5-.5zM7.5 9a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zM7 14a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H7.5a.5.5 0 0 1-.5-.5z"/></svg>
                    )}
                </div>
            </div>
        </div>
    ))
) : (
    <p>No messages to display</p>
)}

</div>



        <div>
        <div className="bg-gray-200 px-4 py-4 flex items-center">
    <input
        type="text"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500 text-sm"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
    />
   <button
    className="ml-4 px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg w-24"
    onClick={sendMessage}
>
    Send
</button>
<input
    type="file"
    accept="image/*"
    className="hidden"
    ref={fileInputRef}
    onChange={(e) => handleFileInputChange(e)}
/>
<button
    className="ml-2 px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg w-32"
    onClick={() => fileInputRef.current.click()}
>
     🗃️ 
</button>

</div>


{showModal && (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
        <div className="bg-white w-96 p-8 rounded-lg flex flex-col items-center justify-center">
            {selectedImage && typeof selectedImage === 'object' && (
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="mb-4" />
            )}

            <div className="flex justify-between w-full">
                <button onClick={handleCloseModal} className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Cancel
                </button>
                <button onClick={sendMessage} className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Send
                </button>
            </div>
        </div>
    </div>
)}



        </div>

                            </div> 
                            ):
                            <div className='border border-black'>
                            <img src={Online} className='w-full h-full ml-16' alt="" />
                        </div>
                        
                        }
                       
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
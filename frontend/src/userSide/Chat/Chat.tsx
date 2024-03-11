import  { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Axios from '@/axious/instance';
import SideBar from '../SideBar/SideBar';
import { jwtDecode } from 'jwt-decode';
import Online from './Online world-pana (1).png'
import EmojiPicker from 'emoji-picker-react';
import SearchComponent from './chatpages/SearchComponent';
import MessageListComponent from './chatpages/MessageListComponent';
import Lobby from './Screens/Lobby';
import { Send ,Upload} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Chat = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<string|any>([]);
    const [senderId, setSenderId] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [chatHistory, setChatHistory] = useState<any>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate=useNavigate()

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    const handleEmojiClick = (emojiObject:any) => {
        const emoji = emojiObject.emoji;
        setInputMessage(prevMessage => prevMessage + emoji);
    };
    const handleFileInputChange = (e:any) => {
        const image = e.target.files[0];
        setSelectedImage(image);
        setShowModal(true);
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
        const newSocket = io(import.meta.env.VITE_REACT_APP_BASE_URL);
        setSocket(newSocket);
    
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);
    

    useEffect(() => {
        if (socket && selectedUser && selectedUser.userId) {
            socket.emit('joinRoom', `message-${selectedUser.userId}`);

            socket.on('chat message', (msg: any) => {
                setMessages((prevMessages:string) => [msg, ...prevMessages]);
                if (selectedUser && selectedUser.userId) {
                    setTimeout(fetchMessages, 1000);
                }
            });
        }

        return () => {
            if (socket && selectedUser && selectedUser.userId) {
                socket.emit('leaveRoom', `message-${selectedUser.userId}`);
            }
        }

    }, [socket, selectedUser]);

    const sendMessage = async () => {
        try {
            if (!socket || !selectedUser || !selectedUser.userId) {
                console.error('Error: Socket not connected or no recipient selected');
                return;
            }
    

            const formData = new FormData();
            formData.append('sender', senderId);
            formData.append('receiver', selectedUser.userId);
            formData.append('content', inputMessage);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            socket.emit('chat message', {
                sender: senderId,
                receiver: selectedUser.userId,
                content: inputMessage,
                image: selectedImage ? selectedImage.name : null,
            });

            await Axios.post('/api/user/send', formData);

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

            socket.on('newChatHistory', (newChatHistory:string) => {
                setChatHistory(newChatHistory);
            });

        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };






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

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/log-in')   
        }
      }, []);

    return (
        <div>
            <SideBar />
            <div className='bg-black border-black'>
                <div className="w-full h-32 bg-black  border-black"></div>

                <div className="container mx-auto" style={{ marginTop: '-128px' }}>
                    <div className="py-6 h-screen">
                        <div className="flex border border-grey rounded shadow-lg h-full">
                            <div className="w-1/4 border flex flex-col">
                                <SearchComponent
                                    searchQuery={searchQuery}
                                    handleInputChange={handleInputChange}
                                    handleSearch={handleSearch}
                                    searchResults={searchResults}
                                    handleUserClick={handleUserClick}
                                />

                                <div className="bg-gray-100 flex-1 overflow-auto">
                                {chatHistory.map((chat: { _id: string, receiver: { profilePicture: string, username: string }, message: string }) => (
    <div className='flex items-center mt-2 ml-2' key={chat._id}>
        <img
            src={`${import.meta.env.VITE_UPLOAD_URL}${chat.receiver.profilePicture}`}
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
                                                    src={selectedUser ? `${import.meta.env.VITE_UPLOAD_URL}${selectedUser.profilePicture}` : 'https://source.unsplash.com/random'}
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-gray-800 font-bold">
                                                    {selectedUser.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div>
                                       
                                            </div>
                                            <div className="ml-6">

                                                <Lobby />



                                            </div>
                                        </div>
                                    </div>
                                    <MessageListComponent messages={messages} senderId={senderId} />
                                    <div>
                                        <div className="bg-gray-200 px-4 py-4 flex items-center">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500 text-sm"
                                                placeholder="Type your message..."
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                            />
                                            <div>
                                                <button onClick={toggleEmojiPicker}>😀</button>
                                                {showEmojiPicker && (
                                                    <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 top-14">
                                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                        <button onClick={toggleEmojiPicker} className='flex'>close</button>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="ml-4 px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg w-24"
                                                onClick={sendMessage}
                                            >
                                                <Send />
                                            </button>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={(e) => handleFileInputChange(e)}
                                            />
                                            <button
                                                className="ml-2 px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg "
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                            <Upload />
                                            </button>
                                        </div>
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
                                                    <Send />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            ) : (
                                <div className='border border-black'>
                                    <img src={Online} className='w-full h-full ml-16' alt="" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;

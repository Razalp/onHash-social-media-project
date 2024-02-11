import React, { useEffect, useState } from 'react';
import Axios from '@/axious/instance';
import SideBar from '../SideBar/SideBar';
import { jwtDecode } from 'jwt-decode';

const Chat = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch messages when selected user changes
        if (selectedUser.length > 0) {
            fetchMessages();
        }
    }, [selectedUser]);

    const sendMessage = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return;
            }

            const decodedToken: any = jwtDecode(token);
            const currentUserId = decodedToken.userId;

            const response = await Axios.post('/api/user/send', {
                sender: currentUserId,
                receiver: selectedUser.userId,
                content: inputMessage
            });
            console.log(response.data.message);
            
            // After sending message, fetch messages again
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        // Fetch messages when selected user changes
        if (selectedUser.length > 0) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return;
            }
    
            const decodedToken: any = jwtDecode(token);
            const senderId = decodedToken.userId;
    
            fetchMessages(senderId);
        }
    }, [selectedUser]);

    const fetchMessages = async (senderId:any) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token || !selectedUser.userId) {
                return;
            }
            const decodedToken: any = jwtDecode(token);
            const receiverId = selectedUser.userId;
            console.log(senderId, receiverId)
    
            const response = await Axios.get(`/api/user/${senderId}/${receiverId}`);
            const messages = response.data;
            setMessages(messages);
            console.log('Messages:', messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    
    // Then in useEffect, call fetchMessages with senderId
    useEffect(() => {
        // Fetch messages when selected user changes
        if (selectedUser.length > 0) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return;
            }
    
            const decodedToken: any = jwtDecode(token);
            const senderId = decodedToken.userId;
    
            fetchMessages(senderId);
        }
    }, [selectedUser]);
    

    const handleSearch = async () => {
        try {
            const response = await Axios.get(`/api/user/searchUser?query=${searchQuery}`);
            setSearchResults(response.data);
            console.log(searchResults);
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

    const handleUserClick = (user:any) => {
        setSelectedUser({
            userId: user._id,
            profilePicture: user.profilePicture,
            name: user.username
        });
        
        setSearchResults([]); 
        console.log(selectedUser)
    };

    return (
        <div>
            <SideBar/>
            <div className='bg-gray-950'>
                <div className="w-full h-32 bg-black"></div>

                <div className="container mx-auto" style={{ marginTop: '-128px' }}>
                    <div className="py-6 h-screen">
                        <div className="flex border border-grey rounded shadow-lg h-full">
                            <div className="w-1/4 border flex flex-col">
                                <div className="py-2 px-3 bg-gray-200 flex flex-row justify-between items-center">
                                    <div>
                                        <img className="w-12 h-12 rounded-full" src="https://source.unsplash.com/random" alt="Profile" />
                                    </div>
                                    <div className="flex">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#727A7E" d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664zm7.965-6.112a.977.977 0 0 1-.944-1.229 7.26 7.26 0 0 0-4.8-8.804.977.977 0 0 1 .594-1.86 9.212 9.212 0 0 1 6.092 11.169.976.976 0 0 1-.942.724zm-16.025-.39a.977.977 0 0 1-.953-.769 9.21 9.21 0 0 1 6.626-10.86.975.975 0 1 1 .52 1.882l-.015.004a7.259 7.259 0 0 0-5.223 8.558.978.978 0 0 1-.955 1.185z"></path></svg>
                                        </div>
                                        <div className="ml-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".55" fill="#263238" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path></svg>
                                        </div>
                                        <div className="ml-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
                                        </div>
                                    </div>
                                </div>
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
                                    <div className='flex mt-2 ml-2'>
                                        <img src="https://source.unsplash.com/random" className='w-10 h-10 rounded-full' alt="" />
                                        <h1 className='mt-2.5 ml-4'>hello</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="w-3/4 border flex flex-col">
                                <div className="py-2 px-3 bg-gray-200 flex flex-row justify-between items-center">
                                    <div className="flex items-center">
                                        <div>
                                            <img
                                                className="w-10 h-10 rounded-full"
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
                                <div className="flex-1 overflow-auto" style={{ backgroundColor: '#DAD3CC' }}>
    {messages.length > 0 ? (
        messages.map((message:any, index) => (
            <div key={index} className={message.sender === senderId ? 'text-right' : 'text-left'}>
                {message.content && <p>{message.content}</p>}
            </div>
        ))
    ) : (
        <p>No messages to display</p>
    )}
</div>

                                <div className="bg-gray-200 px-4 py-4 flex items-center">
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500 text-sm" 
                                        placeholder="Type your message..." 
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                    />
                                    <button 
                                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                                        onClick={sendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;

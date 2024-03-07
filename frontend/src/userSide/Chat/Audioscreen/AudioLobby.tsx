import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../../../Context/SocketProvider';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Axios from '@/axious/instance';
import { Phone } from 'lucide-react';

const AudioLobby = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");
    const [showModal, setShowModal] = useState(false);
    const socket = useSocket();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        bio: '',
        profilePicture: '',
    });
    const [showAudioLobby, setShowAudioLobby] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        try {
            if (token) {
                const decodedToken:any = jwtDecode(token);
                const userId = decodedToken.userId;

                const fetchUserData = async () => {
                    try {
                        const response = await Axios.get(`/api/user/get-profile/${userId}`);
                        setUserData(response.data);
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                };

                fetchUserData();
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, []);

    const handleSubmitForm = useCallback(
        (e:any) => {
            e.preventDefault();
            setEmail(userData.email)
            setShowModal(false); // Close modal after form submission
            socket?.emit("room:join", { email, room });
        },
        [email, room, socket, userData.email]
    );

    const handleJoinRoom = useCallback(
        (data:any) => {
            const { email, room } = data;
            navigate(`/audio-room/${room}`);
        },
        [navigate]
    );

    useEffect(() => {
        socket?.on("room:join", handleJoinRoom);
        return () => {
            socket?.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/log-in')   
        }
      }, []);

    return (
        <div>
            <button onClick={() => setShowModal(true)}><Phone /></button>

            {/* Modal */}
            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                     
                    <div className="bg-white lg:w-5/12 md:6/12 w-10/12 shadow-3xl">
                    <h1 className="text-center p-2 text-xl font-bold">AUDIO CALL</h1>
                        <form className="p-12 md:p-24" onSubmit={handleSubmitForm}>
                            
                            <div className="flex items-center text-lg mb-6 md:mb-8">
                                <svg className="absolute ml-3" viewBox="0 0 24 24" width="24">
                                    <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z" />
                                </svg>
                                <input
                                    type="text"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full "
                                    placeholder="Room Number"
                                />
                            </div>
                            <div className='flex justify-center space-x-4'>

    <button className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-20" onClick={() => setShowModal(false)}>Close</button>
    <button className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-20">Join</button>
</div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioLobby;

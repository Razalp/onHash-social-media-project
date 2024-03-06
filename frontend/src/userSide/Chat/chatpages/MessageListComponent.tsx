import React, { useState } from 'react';


interface Message {
    sender: string;
    image?: string;
    content: string;
    createdAt: Date;
}

interface Props {
    messages: Message[];
    senderId: string;
}

const MessageListComponent : React.FC<Props> = ({ messages, senderId }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const openModal = (imageUrl:string) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage('');
        setModalOpen(false);
    };

    return (
        <div className="flex flex-col-reverse flex-1 overflow-auto" style={{ backgroundColor: '#DAD3CC' }}>
            {messages.length > 0 ? (
                messages.map((message:Message, index) => (
                    <div key={index} className={`flex justify-between ${message.sender === senderId ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`bg-gray-300 rounded-lg p-2 ${message.sender === senderId ? 'ml-4' : 'mr-4'}`}>
                            {message.image ? (
                                // If the message contains an image, render the image with onClick event
                                <img 
                                src={`${import.meta.env.VITE_UPLOAD_URL}${message.image}`}

                                    alt="message-image" 
                                    className="w-60 h-80 mb-2 object-cover" 
                                    onClick={() => openModal(`${import.meta.env.VITE_UPLOAD_URL}${message.image}`)}
                                />
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

<div onClick={closeModal}>
            {modalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
               
                        <img src={selectedImage} alt="modal-image" className="w-80 h-auto" />
                        <button onClick={closeModal} className="absolute top-0 right-0 p-2 m-2 text-black hover:text-gray-600">
                            Close
                        </button>
              
                </div>
            )}
            </div>
        </div>
    );
};

export default MessageListComponent;

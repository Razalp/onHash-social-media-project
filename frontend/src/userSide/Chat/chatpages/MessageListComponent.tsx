import React from 'react';

const MessageListComponent = ({ messages, senderId }) => {
    return (
        <div className="flex flex-col-reverse flex-1 overflow-auto" style={{ backgroundColor: '#DAD3CC' }}>
            {messages.length > 0 ? (
                messages.map((message, index) => (
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
    );
};

export default MessageListComponent;
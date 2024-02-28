import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const VideoCallInwebRtc = () => {
    const localVideoRef = useRef<any>(null);
    const remoteVideoRef = useRef<any>(null);
    const peerRef = useRef<any>(null);
    const socketRef = useRef<any>(null);
    const [incomingCall, setIncomingCall] = useState<any>(null);

    useEffect(() => {

        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('incoming video call', handleIncomingCallNotification);


        return () => {
            socketRef.current.disconnect();
        };
    }, []);


    const handleIncomingCallNotification = (callData) => {
        const { callerId, roomId } = callData;

        setIncomingCall({ callerId, roomId });
    };


    const acceptCall = () => {
  
        socketRef.current.emit('accept video call', { callerId: incomingCall.callerId, roomId: incomingCall.roomId });
        setIncomingCall(null);
    };


    const rejectCall = () => {
     
        socketRef.current.emit('reject video call', { callerId: incomingCall.callerId });
        setIncomingCall(null);
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                peerRef.current = createPeer(null, socketRef.current, stream);
            });

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    const createPeer = (roomId, socket, stream) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on('signal', signal => {
            socket.emit('offer', {
                roomId,
                offer: signal
            });
        });

        peer.on('stream', remoteStream => {
            remoteVideoRef.current.srcObject = remoteStream;
        });

        peer.on('error', err => {
            console.error('WebRTC error:', err);
        });

        return peer;
    };

    return (
        <div className="flex justify-center items-center bg-black h-screen ">
            <div className="flex flex-col items-center justify-center h-full ">
                <video ref={localVideoRef} autoPlay muted style={{ width: '900px', height: '500px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}></video>
                <video ref={remoteVideoRef} autoPlay style={{ width: '80px', height: '64px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}></video>

                {incomingCall && (
                    <div className="call-notification bg-gray-800 bg-opacity-75 p-4 rounded-lg shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className="text-white">Incoming Call...</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={acceptCall} className="call-action-btn bg-green-500 text-white px-4 py-2 rounded-md">Accept</button>
                            <button onClick={rejectCall} className="call-action-btn bg-red-500 text-white px-4 py-2 rounded-md">Reject</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCallInwebRtc;

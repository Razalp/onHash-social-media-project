import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const VideoCallInwebRtc = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const socketRef = useRef(null);
    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                peerRef.current = createPeer(id, socketRef.current, stream);
            });

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('offer', handleReceiveCall);
        socketRef.current.on('answer', handleAnswer);
        socketRef.current.on('ice-candidate', handleNewICECandidateMsg);

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const createPeer = (userId, socket, stream) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.stunprotocol.org'
                }
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    to: userId,
                    candidate: event.candidate
                });
            }
        };

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        return peer;
    };

    const handleReceiveCall = async (offer) => {
        setIncomingCall(offer);
    };

    const handleAnswer = (answer) => {
        peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleNewICECandidateMsg = (candidate) => {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const acceptCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;

        peerRef.current = createPeer(incomingCall.from, socketRef.current, stream);
        peerRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(new RTCSessionDescription(answer));

        socketRef.current.emit('answer', {
            answer,
            to: incomingCall.from
        });

        setIncomingCall(null);
    };

    const rejectCall = () => {

        setIncomingCall(null);
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

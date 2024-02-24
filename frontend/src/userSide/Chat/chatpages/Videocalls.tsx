import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoCall = ({ socket, videoCallOn, startVideoCall }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        if (videoCallOn) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setLocalStream(stream);
                    localVideoRef.current.srcObject = stream;
                })
                .catch(error => {
                    console.error('Error accessing media devices:', error);
                });

            // Listen for incoming video stream from remote peer
            socket.on('remoteStream', remoteStream => {
                setRemoteStream(remoteStream);
                remoteVideoRef.current.srcObject = remoteStream;
            });

            return () => {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
            };
        }
    }, [videoCallOn]);

    return (
        <div>
            {videoCallOn && (
                <>
                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>
                    <div>
                        <video ref={remoteVideoRef} autoPlay></video>
                    </div>
                    <button onClick={startVideoCall}>Start Video Call</button>
                </>
            )}
        </div>
    );
}

export default VideoCall;

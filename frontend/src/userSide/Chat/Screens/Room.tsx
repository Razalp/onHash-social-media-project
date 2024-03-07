import { useSocket } from '@/Context/SocketProvider'
import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from "react-player";
import peer from '../../../service/Peer'
import { Button } from '@/components/ui/button';
import { PhoneForwarded, PhoneCall, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState<any>();
    const [remoteStream, setRemoteStream] = useState<any>();
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const navigate = useNavigate()

    const toggleCamera = () => {
        if (myStream) {
            myStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(prevState => !prevState);
        }
    };
    

    const toggleMute = () => {
        setIsMuted(prevState => !prevState);
    };
    const handleEndCall = () => {
        socket?.emit("call:ended", { to: remoteSocketId });


        socket?.emit("call:ended", { to: socket.id });

        setRemoteSocketId(null);
        setMyStream(null);
        setRemoteStream(null);
        navigate('/chat')
    };


    useEffect(() => {

    }, [handleEndCall])


    const handleUserJoined = useCallback(({ email, id }:{ email: string, id: any }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket?.emit("user:call", { to: remoteSocketId, offer, isCameraOff });
        
        setMyStream(stream);
    }, [remoteSocketId, socket, isCameraOff]);
    

    const handleIncommingCall = useCallback(
        async ({ from, offer }:{ from: any, offer: any }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            setIsCameraOff(isCameraOff);     
            socket?.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer?.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ from, ans }: { from: string, ans: any }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }: { from: string, offer: any }) => {
            const ans = await peer.getAnswer(offer);
            socket?.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }: { ans: any }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer?.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket?.on("user:joined", handleUserJoined);
        socket?.on("incomming:call", handleIncommingCall);
        socket?.on("call:accepted", handleCallAccepted);
        socket?.on("peer:nego:needed", handleNegoNeedIncomming);
        socket?.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket?.off("user:joined", handleUserJoined);
            socket?.off("incomming:call", handleIncommingCall);
            socket?.off("call:accepted", handleCallAccepted);
            socket?.off("peer:nego:needed", handleNegoNeedIncomming);
            socket?.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/log-in')   
        }
      }, []);

    return (
        <div className="flex flex-col items-center h-screen bg-black text-white text-sm ">

            <h4 className="mb-4">{remoteSocketId ? "Connected" : "No one in room"}</h4>

            <div className="flex justify-center w-full mb-4 space-x-2">
           
                {myStream &&
                    <Button variant='secondary' onClick={sendStreams} className="">
                        <PhoneCall /> Accept
                    </Button>
                }

                {remoteSocketId &&
                    <Button variant='secondary' onClick={handleCallUser} className="">
                        <PhoneForwarded /> Call
                    </Button>

                }
            </div>

            <div className="flex items-center justify-center mb-4">
                {remoteStream && (
                    <div className="mr-4">
                        <h1 className="text-sm  mb-2">Remote Stream</h1>
                        <div className="">
                            <div className=''>
                            <ReactPlayer
                                playing
                                muted={isMuted}
                                height="400px"
                                width="auto"
                
                        
                                url={remoteStream}
                            />
                            </div>
                            <br />
                            <div className="flex ">
                                <div className='flex ml-40 space-x-2'>
                                    <Button variant='secondary' onClick={toggleMute} className="">
                                        {isMuted ? <MicOff /> : <Mic />}
                                    </Button>
                                    <Button variant='secondary' onClick={handleEndCall} className="">
                                        <PhoneOff />
                                    </Button>
                                    {myStream && (
                    <Button variant='secondary' onClick={toggleCamera} className="">
                        {isCameraOff ? <CameraOff /> : <Camera/>} 
                    </Button>
                )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {myStream && (
                    <div className='flex flex-col mr-4 '>
                
                        <div className="mt-48">
                        <h1 className="text-sm mb-2">You</h1>
                            <ReactPlayer
                                playing
                                muted={isMuted}
                                height="150px"
                                width="auto"
                                url={myStream}
                            />
                        </div>
                    </div>
                )}

{isCameraOff && remoteStream && (
        <div className='flex flex-col mr-4 '>
           
           
                <CameraOff />
        
        </div>
    )}
            </div>
        </div>
    );
};
export default Room

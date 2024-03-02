import { useSocket } from '@/Context/SocketProvider'
import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from "react-player";
import peer from '../../../Service/Peer'
import { Button } from '@/components/ui/button';
import { PhoneForwarded, PhoneCall, PhoneOff, Mic, MicOff } from 'lucide-react';

const AudioRoom = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        setIsMuted(prevState => !prevState);
    };
    const handleEndCall = () => {
        socket.emit("call:ended", { to: remoteSocketId });


        socket.emit("call:ended", { to: socket.id });

        setRemoteSocketId(null);
        setMyStream(null);
        setRemoteStream(null);
    };


    useEffect(() => {

    }, [handleEndCall])


    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            setMyStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

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
       
                        <div className="">
                            <div className=''>
                            <ReactPlayer
                                playing
                                muted={isMuted}
                                height="150"
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
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {myStream && (
                    <div className='flex flex-col mr-4 '>
                
                        <div className="mt-48">
        
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
            </div>
        </div>
    );
};
export default AudioRoom

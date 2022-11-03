import React from "react";
import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";
import { useEffect } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { status } from "../constants/constants";


export const PeerNetworkPage = (props ={}) => {
    const navigate = useNavigate()
    const connected = useZust((state) => state.connected)

    const configFile = useZust((state) => state.configFile)

    const peerOnline = useZust((state) => state.peerOnline)
    const setPeerOnline = useZust((state) => state.setPeerOnline)
    
    const peerConnection = useZust((state) => state.peerConnection);
    const setPeerConnection = useZust((state) => state.setPeerConnection);

    const socket = useZust((state) => state.socket)
    
    const openPeerConnection = (key, onOpen, onCall, onClose, onDisconnect) => useZust.setState(produce((state) => {
        state.peerConnection = new Peer(key)
        state.peerConnection.on("open", onOpen)
        state.peerConnection.on("call", onCall)
        state.peerConnection.on("close", onClose)
        state.peerConnection.on("disconnected", onDisconnect)
    }))

    const onPeerOpen = (id) =>{
        setPeerOnline(true)
        
        socket.emit("PeerStatus",(status.Online, configFile.value.engineKey, (callback)=>{

        }))
    }

    const onPeerCall = (call) =>{

    }

    const onPeerClose = () =>{
        setPeerConnection(null)
        setPeerOnline(false)
        if(connected){
            socket.emit("PeerStatus", (status.Offline, configFile.value.engineKey, (callback) => {

            }))
        }
    }

    const onPeerDisconnect = () =>{
        setPeerOnline(false)
        
        if(connected){
            
            socket.emit("PeerStatus", (status.Offline, configFile.value.engineKey, (callback) => {

            }))

            if(configFile.value != null){
                
                peerReconnect()
            }
        }
    }

    const peerReconnect = () =>{
        setTimeout(() => {
            if(peerConnection != null){
                if (configFile.value != null) {
                    if (configFile.value.peer2peer){
                        if (peerConnection.disonnected) {
                            console.log("reconnecting...")
                            peerConnection.reconnect()
                            peerReconnect()
                        }
                    }
                }
            }
        }, 4000)
    }

    useEffect(()=>{
        if(configFile.value != null){
            if (configFile.value.peer2peer){
                
                openPeerConnection(configFile.value.engineKey, onPeerOpen, onPeerCall, onPeerClose, onPeerDisconnect)

            }
        }else{
            if(peerConnection != null){ 
                peerConnection.destroy();
            }
        }
    },[configFile])

    useEffect(() => {
        console.log("peerConnection")
        console.log(peerConnection)

    }, [peerConnection])

    return (
        <>
          {
            ! peerOnline && connected &&
                <ImageDiv onClick={(e)=>{
                    navigate("/home/localstorage")
                }} width={30} height={30} netImage={{ image: "/Images/icons/cloud-offline-outline.svg", width:15, height:15, filter:"invert(100%)" }} /> 
          }
        </>
    )
}
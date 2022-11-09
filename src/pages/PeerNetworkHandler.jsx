import React from "react";
import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";
import { useEffect } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { status } from "../constants/constants";


export const PeerNetworkHandler = (props ={}) => {
    const navigate = useNavigate()


    const configFile = useZust((state) => state.configFile)

    const peerOnline = useZust((state) => state.peerOnline)
    const setPeerOnline = useZust((state) => state.setPeerOnline)
    
    const peerConnection = useZust((state) => state.peerConnection);
    const setPeerConnection = useZust((state) => state.setPeerConnection);

    const socket = useZust((state) => state.socket)
    
    const openPeerConnection = (onOpen =onPeerOpen, onCall = onPeerCall, onClose = onPeerClose, onDisconnect = onPeerDisconnect, onError = onPeerError) => useZust.setState(produce((state) => {
        state.peerConnection = new Peer()
        state.peerConnection.on("open", onOpen)
        state.peerConnection.on("call", onCall)
        state.peerConnection.on("close", onClose)
        state.peerConnection.on("disconnected", onDisconnect)
        state.peerConnection.on('error', onError);
    }))

    const onPeerError = (error = new Error("null")) =>{
        if (error.message == "Lost connection to server.")
        {
           if(peerConnection == null)
           {
                openPeerConnection()
           }else{
               peerReconnect()
           }
            
        }
       
    }

    const onPeerOpen = (id) =>{
        setPeerOnline(true)
        console.log(id)
        socket.emit("PeerStatus",(status.Online, id, (callback)=>{

        }))
    }

    const onPeerCall = (call) =>{

    }

    const onPeerClose = () =>{
        console.log("peer connection closing")
        setPeerConnection(null)
        setPeerOnline(false)

        if(!socket.disconnected){
            if(socket!= null && configFile.value != null){
                socket.emit("PeerStatus", (status.Offline, configFile.value.engineKey, (callback) => {

                }))
            }
        }

    }

    const onPeerDisconnect = () =>{
        setPeerOnline(false)
        
        if(!socket.disconnected){
            
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
        return ()=>{
            onPeerClose()
        }
    },[])

    useEffect(()=>{

        if(configFile.value != null){
            if (configFile.value.peer2peer){
                if(peerConnection == null){
                    openPeerConnection(onPeerOpen, onPeerCall, onPeerClose, onPeerDisconnect,onPeerError)
                }else{
                    if(peerConnection.disonnected){
                        peerReconnect()
                    }else{
                        
                    }
                }
            }else{
                
                onPeerClose()
            }
        }else{
            if (peerConnection != null || peerOnline) {
                onPeerClose()
            }
            
        }
    },[configFile,peerConnection])

    useEffect(() => {
      
        if(peerConnection == null) setPeerOnline(false)

    }, [peerConnection])

    return (
        <>
          {
            ! peerOnline && 
                <ImageDiv onClick={(e)=>{
                    navigate("/home/peernetwork")
                }} width={30} height={30} netImage={{ image: "/Images/icons/cloud-offline-outline.svg", width:15, height:15, filter:"invert(100%)" }} /> 
          }
        </>
    )
}
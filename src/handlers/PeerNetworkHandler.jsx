import React from "react";
import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "../pages/components/UI/ImageDiv";
import { useEffect, useRef } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { status } from "../constants/constants";


export const PeerNetworkHandler = (props ={}) => {
    const navigate = useNavigate()

    const configFile = useZust((state) => state.configFile)
    const userPeerID = useZust((state) => state.userPeerID)
    const setUserPeerID = useZust((state) => state.setUserPeerID)

    const peerConnection = useZust((state) => state.peerConnection);
    const setPeerConnection = useZust((state) => state.setPeerConnection);
    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const addPeerDownload = useZust((state) => state.addPeerDownload)
    const downloadRequest = useZust((state) => state.downloadRequest)
    const uploadRequest = useZust((state) => state.uploadRequest)

    const addFileRequest = useZust((state) => state.addFileRequest)
    const addPeerUpload = useZust((state) => state.addPeerUpload)
    const processingDownload = useRef({ value: [] })
    const processingUpload = useRef({value:[]})
    const uploadFiles = useRef({value:[]})
    
    const peerDownload = useZust((state) => state.peerDownload)
    const peerUpload = useZust((state) => state.peerUpload)


    
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
        setUserPeerID(id)
        setSocketCmd({
            cmd:"updateUserPeerID", params: {userPeerID:id}, callback: (callback) => {
            console.log("updatedUserPeerID: " + id)
        }})
    }

    const onPeerCall = (call) =>{

    }

    const onPeerClose = () =>{
        console.log("peer connection closing")
        setPeerConnection(null)
       
        setUserPeerID("")

        setSocketCmd({
            cmd: "updateUserPeerID", params: { userPeerID: "" }, callback: (callback) => {
                console.log("updatedUserPeerID: " + "")
            }
        })

    }

    const onPeerDisconnect = () =>{
        setUserPeerID("")
        
        if(configFile.value != null){
            console.log("disconnect reconnect?")
            peerReconnect()
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
            if (peerConnection != null || userPeerID != "") {
                onPeerClose()
            }
            
        }
    },[configFile, peerConnection])

    useEffect(() => {
      
        if(peerConnection == null){
            if(userPeerID != "") setUserPeerID("")
        }
        console.log(peerConnection)
       
    }, [peerConnection])

   
/*   p2p: isP2P, 
    command: "getIcon", 
    page: "imgDiv", 
    id: imgDivId, 
    file: tmp.update.file, 
    callback: onUpdate */


    useEffect(()=>{
        if(downloadRequest.download != null){
            
        
            onDownloadRequest(downloadRequest, userPeerID)
       
        }
    },[downloadRequest, userPeerID])

    useEffect(() =>{
        if(uploadRequest.upload != null)
        {
            if(userPeerID == "")
            {
                console.log("Peer not connected")
                uploadRequest.callback({error: new Error("Peer not connected")})
            }else{
                onUploadRequest(uploadRequest, userPeerID)
            }
           
        }
    }, [uploadRequest, userPeerID])

    const onUploadRequest = (uRequest, peerID) =>{
      
        const callback = uRequest.callback
        
   
        const upload = uRequest.upload
        

        const uploadUserID = upload.userID
        const uploadPeerID = upload.peerID
        const request = upload.request
        console.log(request)
      
        const length = processingUpload.current.value.length;
        
        console.log(processingUpload.current.value)
        const index = length > 0 ? processingUpload.current.value.findIndex(up => up.request.file.crc == request.file.crc && up.userID == upload.userID) : -1

        if(index == -1)
        {
            console.log("starting upload")
            const id = length > 0 ? processingUpload.current.value[length - 1].id + 1 : 1

            let newUpload = {
                id: id,
                userID: uploadUserID,
                request: request,
                peerID: uploadPeerID,
                status: "Getting file"
           
            }
            console.log(newUpload)
            processingUpload.current.value.push(newUpload)
            

            const checkFile = {
                p2p: false,
                command: request.command,
                page: "peerUpload",
                id: id,
                file: request.file,
                callback: (response) => {
                    if ("success" in response && response.success) {
                        console.log("found file")
                        addPeerUpload({ complete: 0, request: request, id: id, status: "Waing for peer..." })
                        const file = response.file
                        
                        const fileIndex = uploadFiles.current.value.findIndex(f => f.crc == file.crc)

                        if(fileIndex == -1)
                        {
                            uploadFiles.current.value.push(file)
                     
                        }else{
                            //const oldFile = uploadFiles.current.value[index]
                            const names = Object.getOwnPropertyNames(uploadFiles.current.value[index])
                            const newNames = Object.getOwnPropertyNames(file)

                            newNames.forEach(propertyName => {
                                const nameIndex = names.findIndex(n => n == propertyName)

                                if(nameIndex == -1)
                                {
                                    uploadFiles.current.value[index][propertyName] = file[propertyName]
                                }
                            });

                        }

                        console.log("Returning peerID: " + peerID + " id: " + id)                        

                        callback({ id: id, peerID: peerID })
                    }else{
                        const updateIndex = processingUpload.current.value.findIndex(up => up.id == id)

                        processingUpload.current.value[updateIndex].status = "Error"
                        callback({error: new Error("File not found")})
                    }
                }
            };
            console.log(checkFile)
            addFileRequest(checkFile)

         
        }else{
            if (processingUpload.current.value[index].status == "Error")
            {
                callback({error: new Error("File upload unavailable")})
            }else {
                if (processingUpload.current.value[index].peerID != uploadPeerID) {
                    processingUpload.current.value[index].peerID = uploadPeerID
                }
                callback({ id: processingUpload.current.value[index].id, peerID: peerID })
            }
        }
     
    }

    const onDownloadRequest = (dRequest, peerID) =>{
        if(peerID != ""){
            const download = dRequest.download

            console.log(processingDownload.current.value)

            const index = processingDownload.current.value.findIndex(dl => dl.request.file.crc == download.request.file.crc)
        
        
            if (index == -1) {
                const length = processingDownload.current.value.length;
                const id = length > 0 ? processingDownload.current.value[length - 1].id + 1 : 1

                let newDownload = {
                    id: id,
                    status: "Connecting to peers...",
                    request: download.request, 
                    peers: download.peers, 
                    complete: 0,
                }
                processingDownload.current.value.push(newDownload)
                
                addPeerDownload(download)
                startDownload(newDownload)
                downloadRequest.callback(id)
                
            } else{
                console.log("download started")
                const id = processingDownload.current.value[index].id
                downloadRequest.callback(id)
            }
        }else{
            downloadRequest.callback({error:new Error("No peer id")})
        }
    }

    function startDownload(download){
        console.log("starting Download")
        //add to processing queue
         //for display state
        const request = download.request;
        const peers = download.peers;
        let i = 0;

        const tryPeers = () =>{
            const peer = peers[i]
            const contactID = peer.userID
            const userFileID = peer.userFileID
            console.log(peer)
        
            setSocketCmd({cmd:"peerFileRequest", params:{request:request, contactID: contactID, userFileID:userFileID, userPeerID:userPeerID}, callback:(peerResponse) =>{
                console.log(peerResponse)
            }})
            i += 1;

            if(i < peers.length ) tryPeers()
        }
        console.log(peers)
        console.log(userPeerID)
        if(peers.length > 0 && userPeerID != "") tryPeers()
    }

    return (
        <>
          {
                userPeerID == "" && 
                <ImageDiv onClick={(e)=>{
                    navigate("/home/peernetwork")
                }} width={25} height={30} netImage={{ image: "/Images/icons/cloud-offline-outline.svg", scale:.7, filter:"invert(100%)" }} /> 
          }
          <div style={{paddingLeft:5,display:"flex",  height:30}}>
            {peerUpload.length > 0 &&
                <div style={{ height: 30, display: "flex", alignItems: "start", justifyContent: "start" }}>
                    <ImageDiv onClick={(e) => {
                        navigate("/home/peernetwork/uploads")
                    }} width={20} height={30} netImage={{ image: "/Images/icons/cloud-upload-outline.svg", scale: .7, filter: "invert(100%)" }} />
                </div>
            }
            {
                peerDownload.length > 0 &&
                <div style={{height:30, display:"flex", alignItems:"end", justifyContent:"end" }}>
                    <ImageDiv onClick={(e) => {
                        navigate("/home/peernetwork/downloads")
                    }} width={20} height={20} netImage={{ image: "/Images/icons/cloud-download-outline.svg", scale: .7, filter: "invert(100%)" }} />
                </div>
            }
          
            </div>
        </>
    )
}
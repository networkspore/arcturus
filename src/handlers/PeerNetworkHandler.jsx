import React from "react";
import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "../pages/components/UI/ImageDiv";
import { useEffect, useRef } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { status } from "../constants/constants";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

const createWorker = createWorkerFactory(() => import('../constants/utility'));

export const PeerNetworkHandler = (props ={}) => {
    const navigate = useNavigate()
    const worker = useWorker(createWorker)
    const user = useZust((state) => state.user)
    const localDirectory = useZust((state) => state.localDirectory)
    const configFile = useZust((state) => state.configFile)
    const userPeerID = useZust((state) => state.userPeerID)
    const setUserPeerID = useZust((state) => state.setUserPeerID)
    const addCacheFile = useZust((state) => state.addCacheFile)

    const peerConnection = useZust((state) => state.peerConnection);
    const setPeerConnection = useZust((state) => state.setPeerConnection);
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const setDownloadRequest = useZust((state) => state.setDownloadRequest)
  
    

    const addFileRequest = useZust((state) => state.addFileRequest)
    

    const processingDownload = useRef({ value: [] })
    const processingUpload = useRef({value:[]})
    const uploadFiles = useRef({value:[]})

    
    const peerDownload = useZust((state) => state.peerDownload)
    const setPeerDownload = useZust((state) => state.setPeerDownload)
    const updatePeerDownloadStatus =(id, value) => {
        
        const index = processingDownload.current.value.findIndex(pDL => pDL.id == id)
        const length = processingDownload.current.value.length;
        console.log(index)
        if (index != -1) {

            const item = processingDownload.current.value[index]
            const newItem = {}
            const itemNames = Object.getOwnPropertyNames(item)
            itemNames.forEach(name => {
                if(name != "status"){
                    newItem[name] = item[name]
                }else{
                    newItem.status = value
                }
            }); 
            const newArray = []
            for (let i = 0; i < length; i++) {
                if (i == index) {
                    newArray.push(newItem)
                } else {
                    newArray.push(processingDownload.current.value[i])
                }
            }
            
            setPeerDownload( newArray)
        }
            
     }
  
    const peerUpload = useZust((state) => state.peerUpload)
    
    const setPeerUpload = useZust((state) => state.setPeerUpload)
    
    const updatePeerUploadStatus = (id, value) => {
        const index = processingUpload.current.value.findIndex(pU => pU.id == id)
        const length = processingUpload.current.value.length;

        if(index != -1){

            const item = processingUpload.current.value[index]
            const newItem = {}
            const itemNames = Object.getOwnPropertyNames(item)
            itemNames.forEach(name => {
                if (name != "status") {
                    newItem[name] = item[name]
                } else {
                    newItem.status = value
                }
            });

            const newArray = []
           for(let i = 0; i < length ; i ++)
           {
                if(i == index)
                {
                    newArray.push(newItem)
                }else{
                    newArray.push(processingUpload.current.value[i])
                }
           }

           setPeerUpload(newArray)
        }
     }
    const downloadRequest = useZust((state) => state.downloadRequest)
    const uploadRequest = useZust((state) => state.uploadRequest)
    
    const openPeerConnection = (onOpen =onPeerOpen, onCall = onPeerCall, onConnection = onPeerConnection, onClose = onPeerClose, onDisconnect = onPeerDisconnect, onError = onPeerError) => useZust.setState(produce((state) => {
        state.peerConnection = new Peer()
        state.peerConnection.on("open", onOpen)
        state.peerConnection.on("call", onCall)
        state.peerConnection.on("close", onClose)
        state.peerConnection.on('connection', onConnection)
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
                        if(!peerConnection.destroyed){
                            if (peerConnection.disconnected) {
                                console.log("reconnecting...")
                                peerConnection.reconnect()
                                peerReconnect()
                            }
                        }else{
                            onPeerClose()
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
                    openPeerConnection()
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


    useEffect(()=>{
        if(downloadRequest.download != null ){
            
            if(userPeerID != ""){
                onDownloadRequest(downloadRequest, userPeerID)
            }else{
                setDownloadRequest()
                downloadRequest.callback(null)
            }
        }
    },[downloadRequest, userPeerID])

    useEffect(() =>{
        if(uploadRequest.upload != null)
        {
            if(userPeerID == "")
            {
                console.log("Peer not connected")
                uploadRequest.callback({success:false, downloading:false, id:null})
            }else{
                onUploadRequest(uploadRequest, userPeerID)
            }
           
        }
    }, [uploadRequest, userPeerID])

    const onUploadRequest = (uRequest, peerID) =>{
      
        const callback = uRequest.callback
        const upload = uRequest.upload
        
        const uploadUserID = upload.userID
        
        console.log(uploadUserID)

        const uploadPeerID = upload.peerID
        const request = upload.request
      
        const length = processingUpload.current.value.length;
        
        const index = length > 0 ? processingUpload.current.value.findIndex(up => up.request.file.crc == request.file.crc && up.userID == upload.userID) : -1

        if(index == -1)
        {
            console.log("starting upload")
            worker.generateCode(user.userEmail + request.file.crc).then((id)=>{

                let newUpload = {
                    id: id,
                    userID: uploadUserID,
                    request: request,
                    peerID: uploadPeerID,
                    status: "Getting file"
            
                }
                console.log(newUpload)
                processingUpload.current.value.push(newUpload)
                
                setPeerUpload(processingUpload.current.value)

                const downloadTicket = { id: id, peerID: peerID }

                const fileIndex = uploadFiles.current.value.findIndex(f => f.crc == request.file.crc)

        
                if (fileIndex == -1) {
                    const checkFile = {
                        p2p: false,
                        command: "getFile",
                        page: "peerUpload",
                        id: id,
                        file: request.file,
                        callback: (response) => {
                            if ("success" in response && response.success) {
                                console.log("found file")
                              
                                updatePeerUploadStatus(id, "Waiting")
                                const file = response.file
                                uploadFiles.current.value.push(file)
                               
                                console.log(downloadTicket)
                                callback(downloadTicket)
                            }else{
                               
                                updatePeerUploadStatus(id, "Error")
                                callback({error: new Error("File not found")})
                            }
                        }
                    };
        
                    addFileRequest(checkFile)


                } else {
                    updatePeerUploadStatus(id, "Waiting")
                    
                    callback(downloadTicket)
                }

           
            })
         
        }else{
            const processingUploadRef = processingUpload.current.value[index]
            if (processingUploadRef.status == "Error")
            {
                callback({error: new Error("File upload unavailable")})
            }else {
                
                callback({ id: processingUploadRef.id, peerID: peerID })
            }
        }
     
    }

    const onDownloadRequest = (dRequest, peerID) =>{
     
            const download = dRequest.download

            console.log(peerID)

            const index = processingDownload.current.value.findIndex(dl => dl.request.file.crc == download.request.file.crc)
        
        
            if (index == -1) {
                
                const length = processingDownload.current.value.length;

                const id = length == 0 ? 1 : processingDownload.current.value[length -1].id +1
                
                    
                let newDownload = {
                    id: id,
                    status: "Connecting to peers...",
                    request: download.request, 
                    peers: download.peers, 
                    complete: 0,
                }
                processingDownload.current.value.push(newDownload)
                
                setPeerDownload(processingDownload.current.value)
                startDownload(newDownload)
                dRequest.callback(id)
              
            } else{
              
                const id = processingDownload.current.value[index].id
                setPeerDownload(processingDownload.current.value)
                dRequest.callback(id)
            }
    
    }

    function abortDownload(download)
    {
        console.log("aborting")
    }

    const onPeerConnection = (dataConnection) => {
        console.log("peer connection request")
    
        const metaData = dataConnection.metadata

        const index = processingUpload.current.value.findIndex(up => up.id == metaData)
        
        console.log(processingUpload.current.value)

        if (index == -1) {
            console.log("id not found")
            dataConnection.close()
        } else {
            updatePeerUploadStatus(metaData, "Error: No file.")
            console.log(peerUpload)
            const upload = processingUpload.current.value[index]
            const fileCRC = upload.request.file.crc;

            const fileIndex = uploadFiles.current.value.findIndex(files => files.crc == fileCRC)

        
            dataConnection.on('data', (data) => {
                if(data == "ready")
                {
                    if (fileIndex == -1) {

                        updatePeerUploadStatus(metaData, "Error")
                        dataConnection.close()
                    } else {
                        const file = uploadFiles.current.value[fileIndex]
                        
                        updatePeerUploadStatus(metaData, "Uploading")
                        dataConnection.send(file.data)
                    }
                    if (data == "success") {
                        processingUpload.current.value.splice(index, 1)
                        updatePeerUploadStatus(metaData, "Complete")
                        dataConnection.close()
                    }
                }
                if (data == "error") {

                    updatePeerUploadStatus(metaData, "Error")
                    processingUpload.current.value.splice(index, 1)
                    dataConnection.close()
                }
                
            });

           


        }
    }

    function startDownload(download){
        console.log("starting Download")
  
        const request = download.request;
        const peers = download.peers;
        let i = 0;

        const tryPeers = () =>{
            const peer = peers[i]
            const contactID = peer.userID
            const userFileID = peer.userFileID
            console.log(download)
        
            setSocketCmd({cmd:"peerFileRequest", params:{request:request, contactID: contactID, userFileID:userFileID, userPeerID:userPeerID}, callback:(peerResponse) =>{
                //Make only one connection 
                if("id" in peerResponse) 
                {
                    const downloadID = download.id
                   
                    console.log(downloadID)

                    const id = peerResponse.id
                    const peerID = peerResponse.peerID

                    const fileCRC = request.file.crc
                    const fileName = request.file.name
                 
                    const dataConnection = peerConnection.connect(peerID, {label: peerID, metadata:id, reliable:true})

                    updatePeerDownloadStatus(downloadID, "Connecting")
                   
                    try{

                        dataConnection.on('close', () => {
                            const index = processingDownload.current.value.findIndex(pDL => pDL.id == downloadID)
                            if(index != -1)
                            {
                                const status = processingDownload.current.value.status

                                if(status != "Complete")
                                {
                                    throw new Error("Closed before complete")
                                }
                            }
                        })

                        dataConnection.on('open', ()=>{
                            console.log("connection open")
                        
                            updatePeerDownloadStatus(downloadID, "Downloading")
                           
                            dataConnection.on('data', (data)=>{
                            
                            
                                
                                    const fileData = data

                                    updatePeerDownloadStatus(downloadID, "Checking CRC")
                                    worker.crc32FromArrayBufferAsync(fileData).then((crc)=>{
                                        if(fileCRC == crc)
                                        {
                                      
                                            dataConnection.send("success")

                                            worker.cacheFile(localDirectory.handle, fileData, crc, fileName).then((cacheFile) =>{
                                                if(cacheFile == undefined)
                                                {
                                                    const err = new Error("Write failed")
                                                    updatePeerDownloadStatus(downloadID, "Error: Cannot write file")
                                                    throw err
                                                }else{
                                                    switch (cacheFile.mimeType) {
                                                        case "image":
                                                            addCacheFile(cacheFile)
                                                            updatePeerDownloadStatus(downloadID, "Complete")
                                                            break;
                                                    }

                                                   
                                                }
                                                
                                            })


                                        }else{
                                            const err = new Error("Wrong CRC")
                                            updatePeerDownloadStatus(downloadID, "Error: File corrupt")
                                            dataConnection.send("error")
                                            throw err
                                        }
                                    })
                            
                            })
                            dataConnection.send("ready")
                        })
                    } catch (err) {
                        console.log(err)
                        i += 1;

                        if (i < peers.length && err.message != "Write failed") {
                            tryPeers()
                        }
                    }
                }else{
                    i += 1;

                    if (i < peers.length){ tryPeers()}
                }
            }})
            
        }
    
       
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
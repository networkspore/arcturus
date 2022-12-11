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
  
   
    const downloadRequest = useZust((state) => state.downloadRequest)
    const uploadRequest = useZust((state) => state.uploadRequest)

    const peerUpload = useZust((state) => state.peerUpload)

    const setPeerUpload = useZust((state) => state.setPeerUpload)

    const addFileRequest = useZust((state) => state.addFileRequest)
    
    const peerDataConnections = useRef({ value: [] })
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

  
    useEffect(()=>{
        if(peerDownload.length > 0)
        {
            peerDownload.forEach(download => {
                switch(download.status)
                {
                    case "Complete":
                    if (download.request.command == "getImage" || download.request.command == "getIcon")
                    {
                        const downloadID = download.id
                        setTimeout(() => {
                            const index = processingDownload.current.value.findIndex(pDL => pDL.id == downloadID)

                            if(index != -1)
                            {
                                processingDownload.current.value.splice(index, 1)
                                setPeerDownload(processingDownload.current.value)
                            }
                        }, 50);
                    }
                    break;
                  
                }

            });
        }
    },[peerDownload])

    useEffect(() => {
        if (peerUpload.length > 0) {
            peerUpload.forEach(upload => {
                if (upload.status == "Complete") {
                    
                    const uploadID = upload.id
                
                    const index = processingUpload.current.value.findIndex(pDL => pDL.id == uploadID)

                    if (index != -1) {
                        const fileCRC = upload.request.file.crc;
                        
                        const peerID = upload.peerID

                      //  processingUpload.current.value.splice(index, 1)
                        let tmp = []
                        processingUpload.current.value.forEach(element => {
                           if(element.id != uploadID){
                            tmp.push(element)
                           }
                        });

                        processingUpload.current.value = tmp

                        const uploadIndex = processingUpload.current.value.findIndex(pUp => pUp.peerID == peerID)

                        if(uploadIndex == -1)
                        {
                            let tmp2 = []
                            if (peerDataConnections.current.value[uploadIndex].open) peerDataConnections.current.value[uploadIndex].close()

                            peerDataConnections.current.value.forEach(element => {
                                if(element.peer != peerID)
                                {
                                    tmp2.push(element)
                                }
                            });
                            peerDataConnections.current.value = tmp2
                        }
                        const uploadFileIndex = processingUpload.current.value.findIndex(pUp => pUp.request.file.crc == fileCRC)

                        if(uploadFileIndex != -1)
                        {
                          //  const fileIndex = uploadFiles.current.value.findIndex(files => files.crc == fileCRC)

                         //   uploadFiles.current.value.splice(fileIndex, 1)
                            let tmp3 = []
                            uploadFiles.current.value.forEach(file => {
                                if(file.crc  != fileCRC)
                                {
                                    tmp3.push(file)
                                }
                            })
                            uploadFiles.current.value = tmp3

                        }

                        setPeerUpload(processingUpload.current.value)
                    }
                       
                    
                }
            });
        }
    }, [peerUpload])


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

        const downloadPeerID = upload.peerID
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
                    peerID: downloadPeerID,
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
                    status: "Starting",
                    request: download.request, 
                    complete: 0,
                }
                processingDownload.current.value.push(newDownload)
                
                setPeerDownload(processingDownload.current.value)
                startDownload(newDownload)
                dRequest.callback(id)
              
            } else{
                const download = processingDownload.current.value[index];
                console.log(download)
                const id = download.id

                if(download.status == "Waiting")
                {
                    startDownload(download)
                }
       
                dRequest.callback(id)
            }
    
    }

    function abortDownload(download)
    {
        console.log("aborting")
    }

    

    const onPeerConnection = (dataConnection) => {
      
        const id = dataConnection.metadata

        const index = processingUpload.current.value.findIndex(up => up.id == id)
        
        console.log("connection")

        const peerID = dataConnection.peer

        if (index == -1 ) {
            console.log("id not found")
            dataConnection.close()
        } else {
            const upload = processingUpload.current.value[index]

            console.log(upload)
            
            if (upload.peerID == peerID && upload.status == "Getting file")
            {

                peerDataConnections.current.value.push(dataConnection)

             //   const fileCRC = upload.request.file.crc;
             //   const fileIndex = uploadFiles.current.value.findIndex(files => files.crc == fileCRC)



                dataConnection.on('data', (data) => {
                    console.log(data)
                    if("command" in data && data.command == "requestFile")
                    {

                        const fileRequestID = data.id
                        const fileCRC = data.fileCRC
                        const upIndex = processingUpload.current.value.findIndex(up => up.id == fileRequestID)

                        if(upIndex == -1){
                            console.log("upload not found")
                            updatePeerUploadStatus(fileRequestID, "Error")
                            dataConnection.close()
                            
                        }else{

                            const nextUpload = processingUpload.current.value[upIndex]
                          
                            const fileIndex = uploadFiles.current.value.findIndex(files => files.crc == fileCRC)

                            if (fileIndex == -1 && nextUpload.peerID != peerID && nextUpload.status != "Waiting") {

                                updatePeerUploadStatus(fileRequestID, "Error")
                                dataConnection.close()

                            } else {

                                const file = uploadFiles.current.value[fileIndex]
                                
                                updatePeerUploadStatus(fileRequestID, "Uploading")
                                dataConnection.send({
                                    command:"sendFile",
                                    id: id,
                                    file: file
                                })

                            }
                           
                        }
                    }
                    if ("fileRecieved" in data) {
                        const receivedID = data.id

                        updatePeerUploadStatus(receivedID, "Complete")
                        
                    }
                    if ("error" in data) {
                        const errorID =  data.id
                      //  processingUpload.current.value.splice(index, 1)
                        updatePeerUploadStatus(errorID, "Error")
                        dataConnection.close()
                    }
                    
                });

           
            }else{
                dataConnection.close()
              
            }

        }
    }

    function startDownload(download){
        console.log("starting Download")
  
        const request = download.request;
        const fileID = download.request.file.fileID
        const peerID = userPeerID
        const downloadID = download.id
        const index = processingDownload.current.value.findIndex(pDL => pDL.id == downloadID)

        if(peerID != "" && index != -1){
            setSocketCmd({
                cmd: "getFilePeers", params: { fileID: fileID }, callback: (foundPeers) => {
                    if ("success" in foundPeers && foundPeers.success) {
                        const peers = foundPeers.peers
                        let i = 0;
                        console.log("Found peers")
                        const tryPeers = () => {
                            const peer = peers[i]
                            const contactID = peer.userID
                            const userFileID = peer.userFileID
                            console.log(download)

                            setSocketCmd({
                                cmd: "peerFileRequest", params: { request: request, contactID: contactID, userFileID: userFileID, userPeerID: peerID }, callback: (peerResponse) => {

                                    if ("id" in peerResponse) {
                                        

                                      

                                    
                                        const id = peerResponse.id
                                        const peerID = peerResponse.peerID
                                        const file = request.file
                                        const fileCRC = file.crc
                                      //  const fileName = file.name
                                        
                                        const dataConnectionIndex = peerDataConnections.current.value.findIndex(dataC => dataC.peer == peerID)

                                        const dataConnection = dataConnectionIndex == -1 ? peerConnection.connect(peerID, { label: peerID, metadata: id, reliable: true }) : peerDataConnections.current.value[dataConnectionIndex]

                                        updatePeerDownloadStatus(downloadID, "Connecting")

                                        try {
                                            const requestFile = () => {
                                               
                                                console.log("requesting file")

                                                updatePeerDownloadStatus(downloadID, "Downloading")

                                                
                                                dataConnection.send({command:"requestFile", fileCRC: fileCRC, id:id})
                                                
                                            }
                    

                                            if(!dataConnection.open){
                                                dataConnection.on('open', requestFile)
                                                dataConnection.on('data', (data)=>{
                                                    console.log("receiving data")
                                                    console.log(data)
                                                    if("command" in data && data.command == "sendFile"){
                                                        receiveFile(dataConnection, data)
                                                    }
                                                })
                                            }else{
                                                requestFile()
                                            }
                                           
                                        } catch (err) {
                                            console.log(err)
                                            i += 1;

                                            if (i < peers.length) {
                                                tryPeers()
                                            } else {
                                                console.log("waiting")
                                                updatePeerDownloadStatus(downloadID, "Waiting for peers")
                                               
                                            }
                                        }
                                    } else {
                                        console.log("didn't get an ID")
                                        i += 1;

                                        if (i < peers.length) {
                                            console.log("trying peers")
                                            tryPeers()
                                        } else {
                                            console.log("waiting")
                                               updatePeerDownloadStatus(downloadID, "Waiting")
                                            
                                        }
                                        
                                    }
                                }
                            })

                        }


                        if (peers.length > 0 && userPeerID != "") {
                            tryPeers()
                        }else{
                            console.log("Peers not responding")
                            updatePeerDownloadStatus(downloadID, "Waiting")
                            
                        }


                    }else{
                        console.log("No peers found")
                        updatePeerDownloadStatus(downloadID, "Waiting")
                       
                    }

                }
            })
        }

        
    }

    const receiveFile = (dataConnection, data) => {
        return new Promise(resolve => {
            const file = data.file
            const id = data.id
            const fileCRC = file.crc
            const fileName = file.name

            const index = processingDownload.current.value.findIndex(pDl => pDl.request.file.crc == fileCRC)
            console.log(index)
            console.log(processingDownload.current.value)
            if(index != -1)
            {
                const download = processingDownload.current.value[index]
                console.log(download)
                
                const fileData = file.data

                worker.crc32FromArrayBufferAsync(fileData).then((crc) => {
                    if (fileCRC == crc) {

                        dataConnection.send({ fileRecieved: true, id: id})

                        worker.cacheFile(localDirectory.handle, fileData, crc, fileName).then((cacheFile) => {
                            if (cacheFile == undefined) {
                                const err = new Error("Write failed")
                                updatePeerDownloadStatus(download.id, "Error")
                                throw err
                            } else {

                                addCacheFile(cacheFile)

                                updatePeerDownloadStatus(download.id, "Complete")
                          
                                resolve(true)
                            }

                        })


                    } else {
                        const err = new Error("Wrong CRC")
                        updatePeerDownloadStatus(download.id, "Error")
                        dataConnection.send({error: err, id: id})
                        throw err
                    }
                })
                
            }else{
                const err = new Error("Not Downloading file")
                updatePeerDownloadStatus(download.id, "Error")
                dataConnection.send({ error: err, id: id })
                throw err
            }
        })
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
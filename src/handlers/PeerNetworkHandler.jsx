import React from "react";
import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "../pages/components/UI/ImageDiv";
import { useEffect, useRef } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import { status, tableChunkSize } from "../constants/constants";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { get, set } from "idb-keyval";

const createWorker = createWorkerFactory(() => import('../constants/utility'));

export const PeerNetworkHandler = (props ={}) => {
    const navigate = useNavigate()
    const worker = useWorker(createWorker)
    const user = useZust((state) => state.user)
   // const localDirectory = useZust((state) => state.localDirectory)
    const configFile = useZust((state) => state.configFile)
    const userPeerID = useZust((state) => state.userPeerID)
    const setUserPeerID = useZust((state) => state.setUserPeerID)
   // const addCacheFile = useZust((state) => state.addCacheFile)

    const peerConnection = useZust((state) => state.peerConnection);
    const setPeerConnection = useZust((state) => state.setPeerConnection);
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const setDownloadRequest = useZust((state) => state.setDownloadRequest)

    const addFile = useZust((state) => state.addFile)
    const imagesDirectory = useZust((state) => state.imagesDirectory)
    const modelsDirectory = useZust((state) => state.modelsDirectory)
    const audioDirectory = useZust((state) => state.audioDirectory)
    const videoDirectory = useZust((state) => state.videoDirectory)
    const placeablesDirectory = useZust((state) => state.placeablesDirectory)
    const pcsDirectory = useZust((state) => state.pcsDirectory)
    const npcsDirectory = useZust((state) => state.npcsDirectory)
    const texturesDirectory = useZust((state) => state.texturesDirectory)
    const terrainDirectory = useZust((state) => state.terrainDirectory)
    const typesDirectory = useZust((state) => state.typesDirectory)
    const cacheDirectory = useZust((state) => state.cacheDirectory)
   
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

    const removeDownload = (id) =>{
        const index = processingDownload.current.value.findIndex(pDl => pDl.id == id)
   
        if(index != -1){
            const length = processingDownload.current.value.length
            if(length == 1)
            {
                processingDownload.current.value.pop()
            }else{
                processingDownload.current.value.splice(index, 1)
            }
            
        }
  
    }
    const removeUpload = (id) => {
        const index = processingUpload.current.value.findIndex(pUp => pUp.id == id)

        if (index != -1) {
            const length = processingUpload.current.value.length
            if (length == 1) {
                processingUpload.current.value.pop()
            } else {
                processingUpload.current.value.splice(index, 1)
            }

            const newUploads = []
            processingUpload.current.value.forEach(up => {
                const names = Object.getOwnPropertyNames(up)
                let newUpload = {}
                names.forEach(name => {
                    newUpload[name] = up[name]
                });
                newUploads.push(newUpload)
            });

            setPeerUpload(newUploads)
        }

    }
    
    const updatePeerUploadStatus = (id, value) => {
        const index = processingUpload.current.value.findIndex(pU => pU.id == id)
      // const length = processingUpload.current.value.length;
   
        if(index != -1){

            const pUp = processingUpload.current.value[index]

            let newUp = {}
            const upNames = Object.getOwnPropertyNames(pUp)
        
            upNames.forEach(name => {
                if(name == "status")
                {
                    newUp.status = value
                }else{
                    newUp[name] = pUp[name]
                }
            });

            processingUpload.current.value[index] = newUp
           
            let uploads = []

            processingUpload.current.value.forEach(upload => {
                let tmpUp = {}
                const tmpNames = Object.getOwnPropertyNames(upload)
                tmpNames.forEach(name => {
                    tmpUp[name] = upload[name]
                });
                uploads.push(tmpUp)
            });

           setPeerUpload(uploads)
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
         
        }})
    }

    const onPeerCall = (call) =>{

    }

    const onPeerClose = () =>{
   
        setPeerConnection(null)
       
        setUserPeerID("")

        setSocketCmd({
            cmd: "updateUserPeerID", params: { userPeerID: "" }, callback: (callback) => {
           
                
            }
        })

    }

    const onPeerDisconnect = () =>{
        setUserPeerID("")
        
        if(configFile.value != null){
          
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
                                removeDownload(downloadID)
                                setPeerDownload(processingDownload.current.value)
                            }
                        }, 50);
                    }
                    break;
                  
                }

            });
        }
    },[peerDownload, processingDownload.current])

    useEffect(() => {
        if (peerUpload.length > 0) {
            peerUpload.forEach(upload => {
                if (upload.status == "Complete") {
                    
                    const uploadID = upload.id
                
                    const index = processingUpload.current.value.findIndex(pDL => pDL.id == uploadID)

                    if (index != -1) {
                        const fileHash = upload.request.file.hash;
                        
                        const peerID = upload.peerID

                      //  processingUpload.current.value.splice(index, 1)
                        const tmp = []
                        const uploadIDIndex = processingUpload.current.value.findIndex(pUp => pUp.id == uploadID)

                        if (uploadIDIndex != -1){
                            const length = processingUpload.current.value.length

                            if(length  == 1)
                            {
                                processingUpload.current.value.pop()
                            }else{
                                processingUpload.current.value.splice(uploadIDIndex, 1)
                            }

                        }
                        

                        const uploadIndex = processingUpload.current.value.findIndex(pUp => pUp.peerID == peerID)

                        if(uploadIndex != -1)
                        {
                            const dConnIndex = peerDataConnections.current.value.findIndex(dConn => dConn.peer == peerID )

                            if(dConnIndex != -1){
                            if (peerDataConnections.current.value[dConnIndex].open) peerDataConnections.current.value[dConnIndex].close()

                                const length = peerDataConnections.current.value.length
                           
                                if(length == 1)
                                {
                                    peerDataConnections.current.value.pop()
                                }else{
                                    peerDataConnections.current.value.splice(dConnIndex, 1)
                                }
                                
                            }
                            
                        }
                        const uploadFileIndex = processingUpload.current.value.findIndex(pUp => pUp.request.file.hash == fileHash)

                        if(uploadFileIndex != -1)
                        {
         
                          
                            const uploadFileIndex = uploadFiles.current.value.findIndex(file => file.hash == fileHash)
                            
                            if(uploadFileIndex != -1)
                            {
                                const length = uploadFiles.current.value.length
                                
                                if(length == 1)
                                {
                                    uploadFiles.current.value.pop()
                                }else{
                                    uploadFiles.current.value.splice(uploadFileIndex, 1)
                                }
                            }
                            
                        
                        
                        }

                        setPeerUpload(processingUpload.current.value)
                    }
                       
                    
                }
            });
        }
    }, [peerUpload, processingUpload.current, uploadFiles.current, peerDataConnections.current])


    useEffect(() =>{
        if(uploadRequest.upload != null)
        {
            if(userPeerID == "")
            {
              
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
        
        

        const downloadPeerID = upload.peerID
        const request = upload.request
      
        const length = processingUpload.current.value.length;
        
        const index = length > 0 ? processingUpload.current.value.findIndex(up => up.request.file.hash == request.file.hash && up.userID == upload.userID && up.request.command == upload.request.command) : -1

        if(index == -1)
        {
            
            worker.generateCode(user.userEmail + request.file.hash).then((id)=>{

                let newUpload = {
                    id: id,
                    userID: uploadUserID,
                    request: request,
                    peerID: downloadPeerID,
                    status: "Getting file"
            
                }
                
                processingUpload.current.value.push(newUpload)
                
                setPeerUpload(processingUpload.current.value)

                const downloadTicket = { id: id, peerID: peerID }

                const fileIndex = uploadFiles.current.value.findIndex(f => f.hash == request.file.hash)

        
                if (fileIndex == -1) {
                    
                    const checkFile = {
                        p2p: false,
                        command: request.command,
                        page: "peerUpload",
                        id: id,
                        file: request.file,
                        callback: (response) => {
                            if ("success" in response && response.success) {
                                
                                switch(request.command)
                                {
                                    case "getIcon":
                                    case "getImage":
                                        callback(downloadTicket)
                                        break;
                                    case "getFile":
                                          
                                            const localFile = response.file
                                            localFile.handle.getFile().then((file)=>{
                                                worker.getFileCRCTable(file).then((crcTable) =>{

                                                    const newFile = { 
                                                        directory: localFile.directory, 
                                                        mimeType: localFile.mimeType, 
                                                        name: localFile.name, 
                                                        hash:localFile.hash, 
                                                        size: localFile.size, 
                                                        type: localFile.type, 
                                                        lastModified: localFile.lastModified, 
                                                        handle: localFile.handle,
                                                        file:file,
                                                        crcTable: crcTable
                                                    }

                                                    uploadFiles.current.value.push(newFile)
                                                    callback(downloadTicket)
                                                })
                                            })
                    
                                        break;
                                }
                              
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

            

            const index = processingDownload.current.value.findIndex(dl => dl.request.file.hash == download.request.file.hash)
    
        
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

                startDownload(newDownload, peerID)
                dRequest.callback(id)
            

            } else{
                const download = processingDownload.current.value[index];
                
                const id = download.id
           
                if(download.status == "Not found" || download.status == "Starting")
                {
                    console.log("not found restarting")
               
                    startDownload(download, peerID)
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
        
       

        const peerID = dataConnection.peer

        if (index == -1 ) {
           
            dataConnection.close()
        } else {
            const upload = processingUpload.current.value[index]

          
            
            if (upload.peerID == peerID && upload.status == "Getting file")
            {

                peerDataConnections.current.value.push(dataConnection)



                dataConnection.on('data', (data) => {
                    
                    if("command" in data)
                    {

                        const fileRequestID = data.id
                        
                        const fileHash = data.fileHash
                        const upIndex = processingUpload.current.value.findIndex(up => up.id == fileRequestID)
                       
                        if(upIndex == -1){
                           
                            updatePeerUploadStatus(fileRequestID, "Error")
                            dataConnection.close()
                            
                        }else{
                            const nextUpload = processingUpload.current.value[upIndex]
                            const fileIndex = uploadFiles.current.value.findIndex(files => files.hash == fileHash)

                            switch(data.command){
                                case "getIcon":
                                case "getImage":
                                    const fileRequest = {
                                        p2p: false,
                                        command: data.command,
                                        page: "peerUpload",
                                        id: id,
                                        file: nextUpload.request.file,
                                        callback: (response) => {
                                            if ("success" in response && response.success) {
                                                const file = response.file
                                                dataConnection.send({
                                                    command: data.command,
                                                    id: id,
                                                    file: file
                                                })
                                            } else {
                                                send({id:fileRequestID, error:new Error("Could not serve file")})
                                                removeUpload(fileRequestID)
                                                dataConnection.close()
                                            }
                                        }
                                    };

                                    addFileRequest(fileRequest)
                                    break;
                                case "getFile":
                                   

                                    if (fileIndex == -1 && nextUpload.peerID != peerID ) {

                                        updatePeerUploadStatus(id, "Error")
                                        dataConnection.close()

                                    } else {
                                        updatePeerUploadStatus(id, "Uploading")
                                        const file = uploadFiles.current.value[fileIndex].file

                                        const chunkNumber = data.chunkNumber
                                        const chunkSize = data.chunkSize

                                        worker.getChunkData(file, chunkNumber, chunkSize).then((result) => {
                                            const chunkData = result.data
                                       

                                            dataConnection.send({
                                                command: "getFile",
                                                fileHash: fileHash,
                                                id: id,
                                                data: chunkData,
                                                chunkNumber: chunkNumber,
                                              
                                            })
                                        })
                                    }
                                    break;
                                case "getTable":
                                 
                                  

                                    if (fileIndex == -1 && nextUpload.peerID != peerID ) {

                                        updatePeerUploadStatus(id, "Error")
                                        dataConnection.close()

                                    } else {
                                        updatePeerUploadStatus(id, "Sending Data")
                                        const crcTable = uploadFiles.current.value[fileIndex].crcTable
                                 
                                        dataConnection.send({
                                            command: "crcTable",
                                            crcTable: crcTable,
                                            fileHash: fileHash, 
                                            id: id,
                                        })
                                       

                                    }
                                    break;
                            }
                        }
                    }
                    if ("downloadComplete" in data) {
                        const receivedID = data.id
                      
                        updatePeerUploadStatus(receivedID, "Complete")
                        
                    }
                    if ("error" in data) {
                        const errorID =  data.id
                      //  processingUpload.current.value.splice(index, 1)
                        removeUpload(errorID)
                        dataConnection.close()
                    }
                    
                });

           
            }else{
                dataConnection.close()
              
            }

        }
    }

    const partsRef = useRef({value:[]})
    const streamRef = useRef({value:[]})
    function startDownload(download, peerID){
       
        console.log("starting download")
  
        const request = download.request;
        const fileID = download.request.file.fileID
      
        const downloadID = download.id
        const index = processingDownload.current.value.findIndex(pDL => pDL.id == downloadID)
    
        if(peerID != "" && index != -1){
            const processing =  processingDownload.current.value[index]

            if(processing.status == "Starting" || processing.status == "Not found"){
                updatePeerDownloadStatus(downloadID, "Finding Peers")

                setSocketCmd({
                    cmd: "getFilePeers", params: { fileID: fileID }, callback: (foundPeers) => {
                        console.log("found peers")
                        console.log(foundPeers)
                        if ("success" in foundPeers && foundPeers.success) {
                            const peers = foundPeers.peers
                            let i = 0;
                    
                            const tryPeers = () => {
                                const peer = peers[i]
                                const contactID = peer.userID
                                const userFileID = peer.userFileID
                            

                                setSocketCmd({
                                    cmd: "peerFileRequest", params: { request: request, contactID: contactID, userFileID: userFileID, userPeerID: peerID }, callback: (peerResponse) => {
                                    
                                        if ("id" in peerResponse) {
                                            
                                        
                                            

                                        
                                            const id = peerResponse.id
                                            const peerID = peerResponse.peerID
                                            const file = request.file
                                            const fileHash = file.hash

                                           

                                            const dataConnectionIndex = peerDataConnections.current.value.findIndex(dataC => dataC.peer == peerID)

                                            const dataConnection = dataConnectionIndex == -1 ? peerConnection.connect(peerID, { label: peerID, metadata: id, reliable: true }) : peerDataConnections.current.value[dataConnectionIndex]

                                            updatePeerDownloadStatus(downloadID, "Connecting")

                                            try {
                                               
                                                const newPeerTransfer = () => {
                                                
                                                

                                                    updatePeerDownloadStatus(downloadID, "Downloading")

                                                    switch(request.command)
                                                    {
                                                        case "getFile":
                                                            const receivedPartsIndex = partsRef.current.value.findIndex(pRef => pRef.id == id)

                                                            if(receivedPartsIndex == -1)
                                                            {
                                                                dataConnection.send({
                                                                    command: "getTable",
                                                                    fileHash: fileHash,
                                                                    id: id,
                                                                })
                                                            }else{
                                                                const partsCurrent = partsRef.current.value[receivedPartsIndex]

                                                                const parts = partsCurrent.parts

                                                                const nextChunkIndex = parts.findIndex(rP => rP.status == status.invalid)

                                                                let newParts = []

                                                                parts.forEach((part, i) => {

                                                                    if (i == nextChunkIndex) {
                                                                        newParts.push({ status: status.confirming })
                                                                    } else {
                                                                        newParts.push(part)
                                                                    }
                                                                });

                                                                partsRef.current.value[receivedPartsIndex] = { id: id, parts: newParts }


                                                            }
                                                           
                                                           
                                                            break;
                                                        default:
                                                            dataConnection.send({
                                                                command: request.command,
                                                                fileHash: fileHash,
                                                                id: id
                                                            })
                                                    }
                                                   
                                                    
                                                }
                        

                                                if(!dataConnection.open){
                                                    dataConnection.on('open', newPeerTransfer)
                                                    dataConnection.on('data', (data)=>{
                                                    
                                                    
                                                        if("command" in data){
                                                        
                                                            switch (data.command)
                                                            {
                                                                case "getIcon":
                                                                case "getImage":
                                                                    receiveImage(dataConnection, data)
                                                                    break;
                                                                case "getFile":
                                                                    receiveFile(dataConnection, data)
                                                                    break;
                                                                case "crcTable":
                                                                    receiveTable(data).then((result)=>{
                                                                        if("success" in result){
                                                                            const parts = result.parts
                                                                            const nextIndex = parts.findIndex(nP => nP.status == status.invalid)

                                                                            dataConnection.send(
                                                                                dataConnection.send({
                                                                                    command: "getFile",
                                                                                    fileHash: fileHash,
                                                                                    id: id,
                                                                                    chunkNumber: nextIndex,
                                                                                })
                                                                            )
                                                                        }else{
                                                                            console.log("Incorrect table")

                                                                            dataConnection.close()
                                                                            i = i + 1;
                                                                            tryPeers()
                                                                        }
                                                                    })
                                                                    break;
                                                            }
                                                           
                                                        }
                                                    })
                                                }else{
                                                    newPeerTransfer()
                                                }
                                            
                                            } catch (err) {
                                                console.log(err)
                                                i += 1;

                                                if (i < peers.length) {
                                                    tryPeers()
                                                } else {
                                                    console.log("updating status 1")
                                                    updatePeerDownloadStatus(downloadID, "Not found")
                                                
                                                }
                                            }
                                        } else {
                                            console.log("didn't get an ID")
                                            i += 1;

                                            if (i < peers.length) {
                                                console.log("trying peers")
                                                tryPeers()
                                            } else {
                                                console.log("updating status 2")
                                                updatePeerDownloadStatus(downloadID, "Not found")
                                                
                                            }
                                            
                                        }
                                    }
                                })

                            }


                            if (peers.length > 0 && userPeerID != "") {
                                tryPeers()
                            }else{
                                console.log("updating status 3")
                                updatePeerDownloadStatus(downloadID, "Not found")
                                
                            }

                        }else{
                            console.log("updating status 4")
                        // removeDownload(downloadID)
                            updatePeerDownloadStatus(downloadID, "Not found")
                        }

                    }
                })
            }else{

            }
        }else{
            updatePeerDownloadStatus(id, "Not found")
        }

    
    }
    const receiveImage = (dataConnection, data) => {
        return new Promise(resolve => {
         
            const file = data.file
            const id = data.id
           // const fileHash = file.hash
        //    const fileName = file.name
            const fileHash = file.hash
           // const fileID = file.fileID

            const index = processingDownload.current.value.findIndex(pDl => pDl.request.file.hash == fileHash && pDl.request.command == data.command)


            if (index != -1) {
                const download = processingDownload.current.value[index]

            

                
               // worker.getDataHash(fileData).then((hash) => {
                 //   if (fileHash == hash) {
                switch(data.command)
                {
                    case "getIcon":
                        set(fileHash + ".arcicon", file.icon + "")
                        break;
                    case "getImage":
                        set(fileHash + ".arcimage", file.value + "")
                        break;
                }
               

                    dataConnection.send({ downloadComplete: true, id: id })

                   
                    updatePeerDownloadStatus(download.id, "Complete")

                    resolve(true)
                   


                 /*   } else {
                        const err = new Error("Wrong Hash")
                        updatePeerDownloadStatus(download.id, "Not found")
                        dataConnection.send({ error: err, id: id })
                        resolve(false)
                    }*/
             //   })

            } else {
                const err = new Error("Not Downloading file")
                updatePeerDownloadStatus(download.id, "Not found")
                dataConnection.send({ error: err, id: id })
                resolve(false)
            }
        })
    }



    const receiveTable = (data) => {
        return new Promise(resolve => {

            const id = data.id + ""
            const crcTableString = data.crcTable + ""
            const fileHash = data.fileHash + ""

            const index = processingDownload.current.value.findIndex(pDl => pDl.request.file.hash == fileHash && pDl.request.command == "getFile")


            if (index != -1)
            {
               
                const file = processingDownload.current.value[index].request.file
                const fileID = file.fileID
                const fileName = file.name
                const fileSize = file.size
                const chunkSize = tableChunkSize
                const chunks = Math.ceil(fileSize / chunkSize)

                const partsIndex = partsRef.current.value.findIndex(parts => parts.id == id)

                if(partsIndex == -1){
                    worker.getStringHash(crcTableString, 32).then((hash)=>{
                        const tableHash = fileHash.slice(fileHash.length - hash.length)

                        if(tableHash == hash)
                        {
                            const crcTable = crcTableString.split(":")
                            const cacheFileName = fileID + "-" + fileName

                            //function for starting from scratch
                            const resolveNewParts = () =>{
                                let receivedParts = []

                                for (let i = 0; i < chunks; i++) {
                                    
                                    receivedParts[i] = { status: status.invalid }
                                }


                                consolee.log("chunkLength: " + receivedParts.length + " crcTableLength : " + crcTable.length)

                                worker.getNewFileStream(cacheDirectory.handle, cacheFileName, fileSize).then((fileStream)=>{
                                    partsRef.current.value.push({ id: id, parts: receivedParts, crcTable: crcTable })

                                    streamRef.current.value.push({id: id, fileStream: fileStream})

                                    resolve({ success: true, parts: receivedParts })
                                })

                             
                                
                            }

                            cacheDirectory.handle.getFileHandle(cacheFileName).then((handle)=>{
                                
                                handle.getFile().then((diskFile)=>{
                                
                                    const existingFileSize = diskFile.size

                                    if(existingFileSize != fileSize){

                                        
                                        resolveNewParts() 
                                  
                        
                                    }else{
                                        worker.getFileCRCTable(diskFile).then((existingCrcTableString) => {
                                            
                                            const existingCRCTable = existingCrcTableString.split(":")

                                            let receivedParts = []

                                            for (let i = 0; i < crcTable.length ; i++)
                                            {
                                                const validPart = crcTable[i] == existingCRCTable[i]
                                                const statusMsg = validPart ? status.valid : status.invalid

                                                receivedParts.push({status: statusMsg})
                                                
                                            }
                                            handle.createWritable().then((fileStream)=>{
                                                partsRef.current.value.push({ id: id, parts: receivedParts, crcTable: crcTable })
                                                streamRef.current.value.push({id: id, fileStream: fileStream})
                                                resolve({success:true, parts: receivedParts})
                                            })
                                        })
                                    }
                                    
                                })
                            }).catch((rejected)=>{
                                console.log(rejected)

                                if (rejected.message = "NotFoundError")
                                {
                                    resolveNewParts()
                                }else{
                                    resolve({error: new Error("No access to cache")})
                                }
                                
                            })
                            
                        }else{
                            resolve({error: new Error(`Incorrect crc table.`)})
                        }
                       
                    })
                    
                }else{
                    const parts = partsRef.current.value[partsIndex].parts
                    resolve({success:false, parts: parts})
                }
                
                
            }
            
        })
    }

    const receiveFile = (dataConnection, data) => {
        return new Promise(resolve => {
            
           
            const id = data.id
            const fileHash = data.fileHhash
            

            const chunkNumber = data.chunkNumber

            const getNextPart = () =>{
                
                const partsRefIndex = partsRef.current.value.findIndex(ref => ref.id == id)
                const partsRefCurrent = partsRef.current.value[partsRefIndex]

                const parts = partsRefCurrent.parts
                const crcTable = partsRefCurrent.crcTable

                const nextIndex = parts.findIndex(nP => nP.status == status.invalid)

                if(nextIndex != -1){
                    const newParts = []

                    for(let i = 0; i < parts.length ; i ++)
                    {
                        if(i != nextIndex){
                            const part = { status: parts[i].status }
                            newParts.push(part)
                        }else{
                            newParts.push( {status: status.confirming })
                        }
                    }

                    partsRef.current.value.splice(partsRefIndex, 1, {id:id, crcTable: crcTable, parts: parts})

                    dataConnection.send({
                        command: "getFile",
                        fileHash: fileHash,
                        id: id,
                        chunkNumber: nextIndex,
                    })
                    
                }else{
                    const waitingIndex = parts.findIndex(nP => nP.status == status.confirming)
                    
                    if(waitingIndex != -1)
                    {
                        dataConnection.send({
                            command: "getFile",
                            fileHash: fileHash,
                            id: id,
                            chunkNumber: waitingIndex,
                        })
                    }
                }
                
            }
           

            const index = processingDownload.current.value.findIndex(pDl => pDl.request.file.hash == fileHash && pDl.request.command == "getFile")
         

            if(index != -1)
            {
                const download = processingDownload.current.value[index]

            
  
                const partsRefIndex = partsRef.current.value.findIndex(ref => ref.id == id)

                

                if(partsRefIndex == -1)
                {
                    dataConnection.send(
                        dataConnection.send({
                            command: "getTable",
                            fileHash: fileHash,
                            id: id,
                           
                        })
                    )
                }else{

                
                    const partsRefCurrent = partsRef.current.value[partsRefIndex]
                    const parts = partsRefCurrent.parts

                    if(parts[chunkNumber].status != status.valid)
                    {
                        const streamIndex = streamRef.current.value.findIndex(streams => streams.id == id)

                    

                        const fileStream = streamRef.current.value[streamIndex].fileStream

                        const crcTable = partsRefCurrent.crcTable

                       
                        const chunkData = data.data



                        worker.crc32FromArrayBufferAsync(chunkData).then((crc)=>{

                            if(crcTable[chunkNumber] == crc)
                            {
                                let newParts = []
                                let finished = true;


                                parts.forEach((part, i) => {

                                    if (i == chunkNumber) {
                                        newParts.push({ status: status.valid })
                                    } else {
                                        if (part.status != status.valid) {
                                            finished = false;
                                        }
                                        newParts.push(part)
                                    }
                                });

                                partsRef.current.value.splice(partsRefIndex, 1, { id: id, parts: newParts, crcTable: crcTable })
                                
                                const seek = chunkNumber * chunkSize

                                worker.writeFileStreamPart(fileStream, chunkData, seek).then((written)=>{
                                   

                                    if(!finished)
                                    {
                                       
                                        getNextPart()
                                       
                                    }else{
                                        
                                        fileStream.close().then((closed) => {
                                            streamRef.current.value.splice(streamIndex, 1)
                                           
                                           // partsRef.current.value.splice(partsRefIndex, 1)
                                            const dlFile = download.request.file
                                            const fileID = dlFile.fileID
                                            const fileName = dlFile.name

                                            cacheDirectory.handle.getFileHandle(fileID + "-" + fileName).then((fileHandle) =>{
                                                
                                                worker.getFileInfo(fileHandle, cacheDirectory.handle).then((fileInfo) =>{
                                                    if (fileHash == fileInfo.hash) {
                                                        partsRef.current.value.splice(partsRefIndex, 1)
                                                        dataConnection.send({ downloadComplete: true, id: id })

                                                        fileInfo.fileID = fileID

                                                        const locations = [
                                                            { type: "image", directory: imagesDirectory },
                                                            { type: "model", directory: modelsDirectory },
                                                            { type: "audio", directory: audioDirectory },
                                                            { type: "video", directory: videoDirectory },
                                                            { type: "arcpl", directory: placeablesDirectory },
                                                            { type: "arcpc", directory: pcsDirectory },
                                                            { type: "arcnpc", directory: npcsDirectory },
                                                            { type: "arctex", directory: texturesDirectory },
                                                            { type: "arcterr", directory: terrainDirectory },
                                                            { type: "arctype", directory: typesDirectory },

                                                        ]
                                                       

                                                        worker.moveFile(locations, fileInfo, "unsorted").then((newFile) => {
                                                            if (newFile == undefined) {
                                                                const err = new Error("Write failed")
                                                                updatePeerDownloadStatus(download.id, "Error")
                                                                throw err
                                                            } else {

                                                                addFile(newFile)

                                                                updatePeerDownloadStatus(download.id, "Complete")

                                                                resolve(true)
                                                            }

                                                        })


                                                    } else {
                                                        console.log("File hash failed checking file")
                                                     //   partsRef.current.value.splice(partsRefIndex, 1)
                                                        fileHandle.getFile((diskFile) =>{
                                                            worker.getFileCRCTable(diskFile).then((existingCrcTableString) => {

                                                                const existingCRCTable = existingCrcTableString.split(":")

                                                                let receivedParts = []

                                                                for (let i = 0; i < crcTable.length; i++) {
                                                                    const validPart = crcTable[i] == existingCRCTable[i]
                                                                    const statusMsg = validPart ? status.valid : status.invalid

                                                                    receivedParts.push({ status: statusMsg })

                                                                }
                                                                handle.createWritable().then((fileStream) => {
                                                                    partsRef.current.value.push({ id: id, parts: receivedParts, crcTable: crcTable })
                                                                    streamRef.current.value.push({ id: id, fileStream: fileStream })
                                                                    getNextPart()
                                                                })
                                                            })
                                                        })
                                                    }
                                                })
                                            })
                                        })
                                    }
                                })
                            
                            }else{
                                getNextPart()
                                resolve(true)
                            }

                        })
                    }else{
                        getNextPart()
                        resolve(true)
                    }
                }
                
            }else{
                const err = new Error("Not Downloading file")
             
                dataConnection.send({ error: err, id: id })
            
                resolve(false)
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
                            navigate("/home/peernetwork/status")
                    }} width={20} height={30} netImage={{ image: "/Images/icons/file-tray-outline.svg", scale: .7, filter: "invert(100%)" }} />
                </div>
            }
            {
                peerDownload.length > 0 &&
                <div style={{height:30, display:"flex", alignItems:"end", justifyContent:"end" }}>
                    <ImageDiv onClick={(e) => {
                        navigate("/home/peernetwork/status")
                    }} width={20} height={20} netImage={{ image: "/Images/icons/file-tray-full-outline.svg", scale: .7, filter: "invert(100%)" }} />
                </div>
            }
          
            </div>
        </>
    )
}
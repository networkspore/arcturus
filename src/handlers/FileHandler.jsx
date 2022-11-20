
import React, { useState, useEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"
import produce from "immer"
import { get } from "idb-keyval"

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

const createWorker = createWorkerFactory(() => import('../constants/utility'));


export const FileHandler = ( props = {}) =>{

    const worker = useWorker(createWorker)

    const [active, setActive] = useState()
  
    const imagesFiles = useZust((state) => state.imagesFiles)
    const updateImages = useZust((state) => state.updateImages)
    const objectFiles = useZust((state) => state.objectsFiles)
    const terrainFiles = useZust((state) => state.terrainFiles)
    const mediaFiles = useZust((state) => state.mediaFiles)

    const socket = useZust((state) => state.socket)

    const fileRequest = useZust((state) => state.fileRequest)
    const updateFileRequest = useZust((state) => state.updateFileRequest)
    const downloads = useZust((state) => state.downloads)

    const addDownload = useZust((state) => state.addDownload)

    const [processing, setProcessing] = useState([])

    const addProcessing = (request) => setProcessing(produce((state)=>{
        state.push(request);
    }))

    const removeProcessing = (request) => setProcessing(produce((state)=>{
        const index = state.findIndex(item => item.page == request.page && item.id == request.id)

        if(index > -1)
        {
            if(state.length == 1)
            {
                state.pop()
            }else{
                state.splice(index,1)
            }
        }
    }))

    const removeFileRequest = useZust((state)=> state.removeFileRequest)

    useEffect(()=>{
        if(fileRequest != null && fileRequest.length > 0){
            
            fileRequest.forEach((request, i) => {
                const index = processing.findIndex(item => item.page == request.page && item.id == request.id)

                if( index == -1 ){
                    addProcessing(request)
                    
                    executeFileCommand(request).then((result)=>{
                        console.log(result)
                        request.callback(result)
                        removeProcessing(request)
                        removeFileRequest(request)
                    })           
                   
                }else{
                    
                }
            });

        }
    },[fileRequest])




    const executeFileCommand = (request) => {
        return new Promise(resolve => {
            checkLocal(request).then((localResult) => {
                switch (request.command) {
                    case "getRealmIcon":

                        if (localResult != null) {
                            resolve({ success: true, file: localResult, request: request })
                        } else {

                            checkPeers(request).then((peersResult) => {
                                resolve({ error: "not implemented" })
                            })

                        }

                        break;
                    case "getRealmImage":
                        if (localResult != null) {
                            //        if (("value" in localResult && localResult.value != null) || !("value" in localResult)) {

                            getLocalImage(request, localResult).then((realmImageResult) => {
                                resolve(realmImageResult)
                            })
                        } else {
                            checkPeers(request).then((peersResult) => {
                                resolve({ error: "not implemented" })
                            })
                        }
                        break;

                }
            })
        })

    }


    async function getLocalImage(request, localResult){
        

        const dataURL = await worker.getImageHandleDataURL(localResult.handle)
        
        const objNames = Object.getOwnPropertyNames(request.file)
        let newFile = {}
        objNames.forEach(name => {
            if (name in localResult) {
                newFile[name] = localResult[name]
            } else {
                newFile[name] = request.file[name]
            }
        });
        newFile.value = dataURL

        return { success: true, file: newFile, request: request }

    }


    async function checkLocal(request) {
      
        switch (request.file.mimeType) {
            
            case "image":
                const i = imagesFiles.findIndex(iFile => iFile.crc == request.file.crc)

                if (i > -1) {
                    return imagesFiles[i]
                } else {
                    return null
                }
                break;
            default:
                return null
                break;
        }
    }

    

    async function checkPeers(request){
      
        socket.emit("fileRequest", request, (callback)=>{
            if("error" in callback)
            {
                return { request: request, error: new Error("File type not supported.") }
            }else{
                if(callback.success)
                {
                    const peers = callback.peers;
                    for(let i = 0; i < peers.length ; i++){
                        
                    }
                }
            }
        })
    }


    return (
        <>
            {
                processing != null && processing.length > 0 &&
                <ImageDiv onClick={(e) => {
                    navigate("/home/peernetwork/transfers")
                }} width={25} height={30} netImage={{ image: "/Images/icons/file-tray-stacked.svg", scale: .7, filter: "invert(100%)" }} />
            }
        </>
    )
}
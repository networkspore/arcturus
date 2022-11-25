
import React, { useState, useEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"
import produce from "immer"
import { get } from "idb-keyval"

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { useRef } from "react"

const createWorker = createWorkerFactory(() => import('../constants/utility'));


export const FileHandler = ( props = {}) =>{

    const worker = useWorker(createWorker)

    const [active, setActive] = useState()
  
    const imagesFiles = useZust((state) => state.imagesFiles)

    const modelsFiles = useZust((state) => state.modelsFiles)
    const terrainFiles = useZust((state) => state.terrainFiles)
    const mediaFiles = useZust((state) => state.mediaFiles)

    const updateImages = useZust((state) => state.updateImages)

    const socket = useZust((state) => state.socket)

    const fileRequest = useZust((state) => state.fileRequest)
    //const updateFileRequest = useZust((state) => state.updateFileRequest)
    //const downloads = useZust((state) => state.downloads)

    //const addDownload = useZust((state) => state.addDownload)

    const processing = useRef({value:[]})

    const addProcessing = (request) => {
        const index = processing.current.value.findIndex(item => item.page == request.page && item.id == request.id)
        
        if(index ==-1 ) {
            processing.current.value.push(request);
            return true;
        }
        return false;
    }

    const removeProcessing = (request) => {
       const index = processing.current.value.findIndex(item => item.page == request.page && item.id == request.id)

        if (index > -1) {
            if (processing.current.value.length == 1) {
                processing.current.value.pop()
            } else {
                processing.current.value.splice(index, 1)
            }
        }
    }

    const removeFileRequest = useZust((state)=> state.removeFileRequest)

    useEffect(()=>{
        if(fileRequest != null && fileRequest.length > 0){
            
            fileRequest.forEach((request, i) => {
                
                if( addProcessing(request)){
                    
                    executeFileCommand(request).then((result)=>{
                      
                        request.callback(result)
                        removeProcessing(request)
                        removeFileRequest(request)
                    })           
                   
                }else{
                    console.log("request is still processing")
                }
            });

        }
    },[fileRequest])




    const executeFileCommand = (request) => {
        return new Promise(resolve => {

         
            
            switch (request.command) {
                
                case "getIcon":
                    switch (request.file.mimeType) {

                        case "image":
                            checkLocalImages(request).then((localResult)=>{
                                if (localResult != null) {
                                    //        if (("value" in localResult && localResult.value != null) || !("value" in localResult)) {

                                    getLocalIcon(request, localResult).then((imageResult) => {
                                        resolve(imageResult)
                                    })
                                } else {
                                    checkPeers(request).then((peersResult) => {
                                        resolve({ error: "not implemented" })
                                    })
                                }
                            })
                            break;
                        default:
                            resolve({ error: "not implemented" })
                        }
                    break;
                case "getImage":
                    switch (request.file.mimeType) {

                        case "image":
                            checkLocalImages(request).then((localResult) => {
                                if (localResult != null) {
                                    //        if (("value" in localResult && localResult.value != null) || !("value" in localResult)) {

                                    getLocalImage(request, localResult).then((imageResult) => {
                                        resolve(imageResult)
                                    })
                                } else {
                                    checkPeers(request).then((peersResult) => {
                                        resolve({ error: "not implemented" })
                                    })
                                }
                            })
                            break;
                        default:
                            resolve({ error: "not implemented" })
                    }
                    break;
                   
                default:
                    resolve({ error: "not implemented" })

            }
         

        })

    }



    async function getLocalImage(request, localFile){
        
        try{

        
        const dataURL = await worker.getImageHandleDataURL(localFile);
        
        const objNames = Object.getOwnPropertyNames(request.file)
        let newFile = {}
        objNames.forEach(name => {
            newFile[name] = request.file[name]
        });
        
        const localNames = Object.getOwnPropertyNames(localFile)
        
        localNames.forEach(name => {
            newFile[name] = localFile[name]
        });
        
        newFile.value = dataURL

        return { success: true, file: newFile, request: request }
        }catch(err){
            return { error: new Error("Cannot get image from file.")}
        }
    }

    async function getLocalIcon(request, localFile) {

        try {
            const idbDataUrl = await get(localFile.crc + ".arcicon")

            const dataURL = idbDataUrl == undefined ? await worker.getThumnailFile(localFile) : idbDataUrl;

            const objNames = Object.getOwnPropertyNames(request.file)
            let newFile = {}
            objNames.forEach(name => {
                newFile[name] = request.file[name]
            });

            const localNames = Object.getOwnPropertyNames(localFile)

            localNames.forEach(name => {
                newFile[name] = localFile[name]
            });

            newFile.icon = dataURL

            return { success: true, file: newFile, request: request }
        } catch (err) {
            return { error: new Error("Cannot get image from file.") }
        }
    }



    async function checkLocalImages(request) {
   
    
        const i = imagesFiles.findIndex(iFile => iFile.crc == request.file.crc)

        if (i > -1) {
            return imagesFiles[i]
        } else {
            return null
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
                processing.current.value.length > 0 &&
                <ImageDiv onClick={(e) => {
                    navigate("/home/peernetwork/transfers")
                }} width={25} height={30} netImage={{ image: "/Images/icons/file-tray-stacked.svg", scale: .7, filter: "invert(100%)" }} />
            }
        </>
    )
}
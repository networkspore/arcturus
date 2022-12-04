
import React, { useState, useEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"
import produce from "immer"
import { get, set } from "idb-keyval"

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


    const addPeerDownload = useZust((state) => state.addPeerDownload)

    const fileRequest = useZust((state) => state.fileRequest)
    //const updateFileRequest = useZust((state) => state.updateFileRequest)
    //const downloads = useZust((state) => state.downloads)

    //const addDownload = useZust((state) => state.addDownload)

    const processing = useRef({value:[]})

    const [isProcessing, setIsProcessing] = useState(false)

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
        if (fileRequest != null && fileRequest.length > 0 ){
           
                fileRequest.forEach((request, i) => {
                  
                    if (request.file != null && request.file.crc != null && request.file.crc != "" && request.file.mimeType != null) {

                        if( addProcessing(request)){
                     
                        
                            executeFileCommand(request).then((result)=>{
                            
                                request.callback(result)
                                removeProcessing(request)
                                removeFileRequest(request)
                            })           
                        
                        }else{
                          //  console.log(request)
                        
                        }  
                    }else{
                        console.log("requesting null")
                        request.callback({error: new Error("File does not exist.")})
                        removeFileRequest(request)
                    }
                });
          

        } else {
        //  console.log('doing nothing')

           
        }
  
    },[fileRequest])

    useEffect(()=>{

        if(processing.current.value > 0){
            setIsProcessing(true)
        }else{
            setIsProcessing(false)
        }
    },[processing.current])


    const executeFileCommand = (request) => {
        return new Promise(resolve => {

           
            
            switch (request.command) {
                
                case "getIcon":
                    if (request.file.mimeType == "image") {

                     
                            checkLocalImages(request).then((localResult)=>{
                                
                                if (localResult != null) {
                                 
                                    if("icon" in localResult)
                                    {
                                        const iconResult = { success: true, file: localResult, request: request }
                                        resolve(iconResult)
                                    } else if(localResult != null){
                                        getLocalIcon(request, localResult).then((imageResult) => {
                                            resolve(imageResult)
                                        })
                                    }
                                } else {
                                    console.log(request)
                                    if (request.p2p) {
                                        console.log('getting peers')
                                        getImagePeers(request).then((peersResult) => {
                                            console.log('getting peers')
                                           
                                            resolve(peersResult)
                                         
                                        })
                                    } else {
                                        resolve({ error: "not connected" })
                                    }
                                }
                            })
                            break;
                         }else{
                            resolve({ error: "not implemented" })
                        }
                    break;
                case "getImage":
                    if(request.file.mimeType == "image") {

                        checkLocalImages(request).then((localResult) => {
                            
                            if (localResult != null) {
                                //        if (("value" in localResult && localResult.value != null) || !("value" in localResult)) {
                                if("value" in localResult)
                                {
                                    const imageResult = { success: true, file: localResult, request: request }
                                    resolve(imageResult)
                                }else{
                                    getLocalImage(request, localResult).then((imageResult) => {
                                    resolve(imageResult)
                                })
                                }
                                
                            } else if (request != null){
                                if (request.p2p) {
                                    console.log('getting peers')
                                    getImagePeers(request).then((peersResult) => {
                                        console.log('getting peers')
                                        resolve(peersResult)
                                    })
                                }else{
                                    resolve({ error: "not connected" })
                                }
                            }
                        })
                    }else{
                        resolve({ error: "not implemented" })
                    }
                    break;
                   
                default:
                    resolve({ error: "not implemented" })

            }
         

        })

    }


    const getImagePeers = (request) => {
        return new Promise(resolve => {
            
            if (request.file.fileID != undefined && request.file.fileID != null && request.file.fileID > -1) {
                const fileID = request.file.fileID;
                console.log(request)
                setSocketCmd({
                    cmd: "getImagePeers", params: { fileID: fileID }, callback: (foundPeers) => {
                        if("success" in foundPeers && foundPeers.success)
                        {
                            const peers = foundPeers.peers
                            const newPeerDownload = {
                                request: request, peers: peers, complete:0
                            }
                            addPeerDownload(newPeerDownload, (downloadID) => {
                                console.log(downloadID)
                                resolve({success:false, downloading:true, id: downloadID})
                            })
                        }else{
                            console.log(foundPeers)
                            resolve({error: new Error("Image not found")})
                        }
                    
                    }
                })
            } else {
                resolve({ error: new Error("fileID not valid") })
            }
        })
    }


    async function getLocalImage(request, localFile){
        
        try{
        
        const dataURL = await worker.getImageHandleDataURL(localFile);
        set(localFile.crc + ".arcimage", dataURL)
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
         

            const dataURL = await worker.getThumnailFile(await localFile.handle.getFile())

            set(localFile.crc + ".arcicon", dataURL)

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



    const checkLocalImages = (request) => {
        return new Promise(resolve => { 
       
            if(request.command == "getIcon") {
         
                get(request.file.crc + ".arcicon").then((iconDataURL) =>{
                 
                    if (iconDataURL != undefined) {
                
                        const objNames = Object.getOwnPropertyNames(request.file)
                        let newFile = {}
                        objNames.forEach(name => {
                            newFile[name] = request.file[name]
                        });
                
                        newFile.icon = iconDataURL
                     
                        resolve(newFile)
                    } else {
                        const i = imagesFiles.findIndex(iFile => iFile.crc == request.file.crc)

                        if (i > -1) {
                            resolve(imagesFiles[i])
                        } else {
                            resolve(null)
                        }
                    }
                })
            } else if (request.command == "getImage") {
                get(request.file.crc + ".arcimage").then((iconDataURL) => {
                    if (iconDataURL != undefined) {
                        const objNames = Object.getOwnPropertyNames(request.file)
                        let newFile = {}
                        objNames.forEach(name => {
                            newFile[name] = request.file[name]
                        });

                        newFile.value = iconDataURL
           
                        resolve( newFile)
                    } else {
                        const i = imagesFiles.findIndex(iFile => iFile.crc == request.file.crc)

                        if (i > -1) {
                            resolve(imagesFiles[i])
                        } else {
                            resolve(null)
                        }
                    }
                })
            }
           
        })
    
    }

    const setSocketCmd = useZust((state) => state.setSocketCmd)



    return (
        <>
            {
                isProcessing &&
                <ImageDiv onClick={(e) => {
                    navigate("/home/peernetwork/transfers")
                }} width={25} height={30} netImage={{ image: "/Images/icons/file-tray-stacked.svg", scale: .7, filter: "invert(100%)" }} />
            }
        </>
    )
}
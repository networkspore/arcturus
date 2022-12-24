
import React, { useState, useEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"
import produce from "immer"
import { get, set } from "idb-keyval"

import { useRef } from "react"

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

const createWorker = createWorkerFactory(() => import('../constants/utility'));


export const FileHandler = ( props = {}) =>{

    const worker = useWorker(createWorker)

    const [active, setActive] = useState()
 
    const localDirectory = useZust((state) => state.localDirectory)
    const loadingStatus = useZust((state) => state.loadingStatus)
  


    const setDownloadRequest = useZust((state) => state.setDownloadRequest)

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
                    
                    if (request.file != null && request.file.hash != null && request.file.hash != "" && request.file.mimeType != null) {

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
                case "getFile":
                    searchLocalFiles(request).then((result) => {
                        if(result == undefined)
                        {
                            if (request.p2p) {

                                makeDownloadRequest(request).then((peersResult) => {

                                    resolve(peersResult)

                                })
                            } else {
                                resolve({ error: "not connected" })
                            }
                        }else{
                           resolve( { success: true, file: result, request: request })
                         
                        }
                        
                    })
                    
                    break;
                case "getImage":
                case "getIcon":
                 
                    switch (request.file.mimeType ) {

                        case "image":
                           
                            checkLocalImages(request).then((localResult)=>{
                               
                             
                                if(localResult !== undefined && localResult != -1)
                                {
                                
                                    const iconResult = { success: true, file: localResult, request: request }

                                    resolve(iconResult)
                                } 
                                if(localResult === undefined){
                                  
                                    searchLocalFiles(request).then((localFile)=>{
                                    
                                        if (localFile === undefined)
                                        {
                                            if( request.p2p) {
                                            
                                                makeDownloadRequest(request).then((peersResult) => {
                                                
                                                
                                                    resolve(peersResult)
                                                
                                                })
                                            } else {
                                                resolve({ error: "not connected" })
                                            }
                                        }else{
                                           
                                            if (request.command == "getImage"){
                                                const promise = loadImage(request, localFile)
                                                resolve({ success: false, loading: promise, request: request })
                                            }else{
                                                const promise = loadIcon(request, localFile)
                                                resolve({ success: false, loading: promise, request: request })
                                            }
                                            
                                        }
                                    })
                                }
                                if(localResult == -1){
                                    console.log("not supported")
                                    resolve({error: "not supported"})
                                }
                            })
                            break;
                            case "media":
                              
                            default:
                            resolve({ error: "not implemented" })
                        }
                    break;
                    /*
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
                                
                            } else {

                                if (request.p2p) {
                                  
                                    makeDownloadRequest(request).then((peersResult) => {
                                        console.log(peersResult)
                                        resolve(peersResult)
                                    })
                                }else{
                                    console.log("no p2p")
                                    resolve({ error: new Error("No p2p") })
                                }
                            }
                        })
                    }else{
                        resolve({ error: "not implemented" })
                    }
                    break;*/
                   
                default:
                    resolve({ error: "not implemented" })

            }
         

        })

    }


    const makeDownloadRequest = (request) => {
        return new Promise(resolve => {
            const fileID = request.file.fileID;
            const hash = request.file.hash
            if (fileID != undefined && fileID != null && fileID > -1 && hash != null) {
                
            

                const newDownload = {
                    hash: hash, request: request, complete: 0, status: ""
                }
                
                setDownloadRequest({download:newDownload, callback:(downloadID) => {

                    console.log(newDownload)
                    console.log(downloadID)
                    if(downloadID == undefined || downloadID == null)
                    {
                        resolve({error: new Error("No peers found")})
                    }else{
                        resolve({success:false, downloading:downloadID != null, id: downloadID})
                    }
                    
                    
                }})
              
            } else {
               
                resolve({ error: new Error("fileID not valid") })
            }
        })
    }


    async function searchLocalFiles(request){
        const allFiles = await get("arc.cacheFile")
        const index = allFiles.findIndex(iFile => iFile.loaded && iFile.hash == request.file.hash)
        
        if(index != -1){ 
            return allFiles[index]

        }else{
            return undefined
        }
    }



    /*
    const quota = await navigator.storage.estimate();
    const totalSpace = quota.quota;
    const usedSpace = quota.usage;
    */

   

    const checkLocalImages = (request) => {
        return new Promise(resolve => { 
            const fileHash = request.file.hash
            switch (request.command)
            {
              
                case "getIcon":
                    get(fileHash + ".arcicon").then((iconDataURL) => {

                        if (iconDataURL != undefined) {

                            const objNames = Object.getOwnPropertyNames(request.file)
                            let newFile = {}
                            objNames.forEach(name => {
                                newFile[name] = request.file[name]
                            });

                            newFile.icon = iconDataURL

                            resolve(newFile)
                        } else {
                         
                            
                            resolve(undefined)
                            
                        }
                    })
                    break;
                case "getImage":
                    get(fileHash + ".arcimage").then((iconDataURL) => {
                        if (iconDataURL != undefined) {
                            const objNames = Object.getOwnPropertyNames(request.file)
                            let newFile = {}
                            objNames.forEach(name => {
                                newFile[name] = request.file[name]
                            });

                            newFile.value = iconDataURL

                            resolve(newFile)
                        } else {
                          
                           
                            resolve(undefined)
                              

                        }
                    })
                    break;
                default:
                    resolve(-1)
                    break;
            }
       
           
        })
    
    }

    const loadingImages = useRef({value:[]})

    const loadingIcons = useRef({value:[]})


    const loadImage = (request, localFile) =>{
        return new Promise(resolve => {
            
            const fileHash = request.file.hash

            const loadingImageIndex = loadingImages.current.value.findIndex(imgs => imgs.hash == fileHash)

            if (loadingImageIndex == -1) {

                const promise = worker.getImageHandleDataURL(localFile)
                loadingImages.current.value.push({ hash: fileHash, promise: promise })

                promise.then((dataUrl) => {

                    set(fileHash + ".arcimage", dataUrl).then((inDB) => {
                        const itemIndex = loadingImages.current.value.findIndex(imgs => imgs.hash == fileHash)
                        loadingImages.current.value.splice(itemIndex, 1)
                        resolve({ dataUrl: dataUrl, hash: fileHash })

                    })

                })

            } else {
                const promise = loadingImages.current.value[loadingImageIndex].promise

                promise.then((dataUrl) => {
                    resolve({ dataUrl: dataUrl, hash: fileHash })
                })

            }

        })
    }

    const loadIcon = (request, localFile) => {
        return new Promise(resolve => {
      
            const fileHash = request.file.hash

            const loadingImageIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)

            if (loadingImageIndex == -1) {

                const promise = worker.getThumnailFile(localFile)
                loadingIcons.current.value.push({ hash: fileHash, promise: promise})

                promise.then((dataUrl) => {

                    set(fileHash + ".arcicon", dataUrl).then((inDB) => {
                        const itemIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)
                        loadingIcons.current.value.splice(itemIndex, 1)
                        resolve({dataUrl:dataUrl, hash: fileHash})
               
                    })

                })
               
            } else {
                const promise = loadingIcons.current.value[loadingImageIndex].promise

                promise.then((dataUrl)=>{
                    resolve({ dataUrl: dataUrl, hash: fileHash })
                })

            }

        })
    }

    return (
        <>
            {
                isProcessing &&
                <ImageDiv onClick={(e) => {
                    navigate("/home/localstorage")
                }} width={25} height={30} netImage={{ image: "/Images/icons/file-tray-stacked.svg", scale: .7, filter: "invert(100%)" }} />
            }
        </>
    )
}
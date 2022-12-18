
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
  
    const cacheFiles = useZust((state) => state.cacheFiles)
    const imagesFiles = useZust((state) => state.imagesFiles)
    const modelsFiles = useZust((state) => state.modelsFiles)
  
    const mediaFiles = useZust((state) => state.mediaFiles)

    const updateImages = useZust((state) => state.updateImages)


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
                    const mimeType = request.file.mimeType
                    
                    switch(mimeType)
                    {
                        case "image":
                            checkLocalImages(request).then((localResult) =>{
                                if(localResult != null)
                                {
                                    resolve({success:true, file: localResult, request:request})
                                }else{
                                    resolve({error: new Error("File not found")})
                                }
                            })
                            break;
                    }
                    
                    break;
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
                                 
                                    if (request.p2p) {
                                    
                                        makeDownloadRequest(request).then((peersResult) => {
                                          
                                           
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
                    break;
                   
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


    async function getLocalImage(request, localFile){
        
        try{
        
        const dataURL = await worker.getImageHandleDataURL(localFile);
        set(localFile.hash + ".arcimage", dataURL)
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

            set(localFile.hash + ".arcicon", dataURL)

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

    async function searchLocalFiles(request){

        switch(request.file.mimeType)
        {
            case "image":
                const imgIndex = imagesFiles.findIndex(iFile => iFile.hash == request.file.hash)
                
                if(imgIndex != -1) return imagesFiles[imgIndex]

              

                const cacheIndex = cacheFiles.findIndex(file => file.hash == request.file.hash)
            
                return cacheIndex == -1 ? undefined : cacheFiles[cacheIndex]

                break;
        }

    }

    async function getLocalData(request){
        try{
            

            const localFile = await searchLocalFiles(request)
            
            if (localFile == undefined) throw new Error("File not found")
            
            const data = await worker.getFileData(localFile)

            set(localFile.hash + ".arcdata", data)

            const objNames = Object.getOwnPropertyNames(request.file)
            let newFile = {}
            objNames.forEach(name => {
                newFile[name] = request.file[name]
            });

            const localNames = Object.getOwnPropertyNames(localFile)

            localNames.forEach(name => {
                newFile[name] = localFile[name]
            });

            newFile.data = data

            return { success: true, file: newFile, request: request }

        }catch(err){
      
            console.log(err)
            return {error: new Error("Error getting local data")}
        }
    }

    /*
    const quota = await navigator.storage.estimate();
    const totalSpace = quota.quota;
    const usedSpace = quota.usage;
    */

    const checkLocalImages = (request) => {
        return new Promise(resolve => { 
            switch (request.command)
            {
                case "getFile":
                    get(request.file.hash + ".arcdata").then((imageData) =>{
                        if(imageData != undefined)
                        {
                            const objNames = Object.getOwnPropertyNames(request.file)
                            let newFile = {}
                            objNames.forEach(name => {
                                newFile[name] = request.file[name]
                            });

                            newFile.data = imageData

                            resolve(newFile)
                        }else{
                           
                            getLocalData(request).then((result)=>{
                                resolve(result)
                            })
        
                        }
                    })
                   
                    break;
                case "getIcon":
                    get(request.file.hash + ".arcicon").then((iconDataURL) => {

                        if (iconDataURL != undefined) {

                            const objNames = Object.getOwnPropertyNames(request.file)
                            let newFile = {}
                            objNames.forEach(name => {
                                newFile[name] = request.file[name]
                            });

                            newFile.icon = iconDataURL

                            resolve(newFile)
                        } else {
                            searchLocalFiles(request).then((localFile)=>{
                                if (localFile != undefined) {
                                    resolve(localFile)
                                } else {
                                    resolve(null)
                                }
                            })
                            
                        }
                    })
                    break;
                case "getImage":
                    get(request.file.hash + ".arcimage").then((iconDataURL) => {
                        if (iconDataURL != undefined) {
                            const objNames = Object.getOwnPropertyNames(request.file)
                            let newFile = {}
                            objNames.forEach(name => {
                                newFile[name] = request.file[name]
                            });

                            newFile.value = iconDataURL

                            resolve(newFile)
                        } else {
                            searchLocalFiles(request).then((localFile) => {
                                if (localFile != undefined) {
                                    resolve(localFile)
                                } else {
                                    resolve(null)
                                }
                            })
                        }
                    })
                    break;
                default:
                    resolve(null)
                    break;
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
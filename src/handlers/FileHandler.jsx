
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
                case "getIcon":
                    const svgMime = "image/svg+xml"
                    if (request.file.type.slice(0, svgMime.length) != svgMime) {

                        get(request.file.hash + ".arcicon").then((dataUrl) => {

                            if (dataUrl != undefined) {


                                resolve({success:"true", dataUrl:dataUrl, request: request})
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
                    }
                case "getImage":
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
        const index = allFiles.findIndex(iFile => iFile.hash == request.file.hash)
        
        if(index != -1){
            const iFile = allFiles[index]
            return iFile

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
            const fileType = request.file.type

            const item = request.file

            const newFile = {
                width: item.width,
                height: item.height,
                application: item.application,
                loaded: item.loaded,
                directory: item.directory,
                mimeType: item.mimeType,
                name: item.name,
                hash: item.hash,
                size: item.size,
                type: item.type,
                lastModified: item.lastModified,
                handle: item.handle,
            }

            switch (request.command)
            {
              
                case "getIcon":
                   
                        
                    get(fileHash + ".arcicon").then((dataUrl) => {

                        if (dataUrl != undefined) {

                           
                            resolve(dataUrl)
                        } else {
                         
                            
                            resolve(undefined)
                            
                        }
                 
                    })
                    break;
              
                default:
                    resolve(undefined)
                    break;
            }
       
           
        })
    
    }

    const loadingImages = useRef({value:[]})

    const loadingIcons = useRef({value:[]})



  

    const loadImage = (request, localFile) => {
        return new Promise(resolve => {

            const fileHash = request.file.hash

            const loadingImageIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)

            if (loadingImageIndex == -1) {
                if (request.file.type == "image/svg+xml") {
                    const promise = worker.getLocalFileSvg(localFile)
                    loadingIcons.current.value.push({ hash: fileHash, promise: promise })

                    promise.then((svg) => {

                        set(fileHash + ".arcsvg", svg).then((inDB) => {
                            const itemIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)
                            loadingIcons.current.value.splice(itemIndex, 1)
                            resolve({ item: svg, hash: fileHash })

                        })

                    })
                } else {

                    const promise = worker.getLocalFileCanvas(localFile)
                    loadingIcons.current.value.push({ hash: fileHash, promise: promise })

                    promise.then((canvas) => {

                        set(fileHash + ".arcimage", canvas).then((inDB) => {
                            const itemIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)
                            loadingIcons.current.value.splice(itemIndex, 1)
                            resolve({ item: canvas, hash: fileHash })

                        })

                    })
                }


            } else {
                const promise = loadingIcons.current.value[loadingImageIndex].promise
                if (request.file.type == "image/svg+xml") {
                    promise.then((svg) => {
                        resolve({ item: svg, hash: fileHash })
                    })
                } else {
                    promise.then((canvas) => {
                        resolve({ item: canvas, hash: fileHash })
                    })
                }
            }

        })
    }

  

    const loadIcon = (request, localFile) => {
        return new Promise(resolve => {
      
            const fileHash = request.file.hash

            const loadingImageIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)

            if (loadingImageIndex == -1) {
                if (request.file.type == "image/svg+xml")
                {
                    const promise = worker.getLocalFileSvg(localFile)
                    loadingIcons.current.value.push({ hash: fileHash, promise: promise })

                    promise.then((svg) => {

                        set(fileHash + ".arcsvg", svg).then((inDB) => {
                            const itemIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)
                            loadingIcons.current.value.splice(itemIndex, 1)
                            resolve({ svg: svg, hash: fileHash })

                        })

                    })
                }else{

                    const promise = worker.getLocalFileThumnailCanvas(localFile)
                    loadingIcons.current.value.push({ hash: fileHash, promise: promise })

                    promise.then((canvas) => {

                        set(fileHash + ".arcicon", canvas).then((inDB) => {
                            const itemIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)
                            loadingIcons.current.value.splice(itemIndex, 1)
                            resolve({ item: canvas, hash: fileHash })

                        })

                    })
                }

               
            } else {
                const promise = loadingIcons.current.value[loadingImageIndex].promise
                
                   
                promise.then((item) => {
                    resolve({ item: item, hash: fileHash })
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
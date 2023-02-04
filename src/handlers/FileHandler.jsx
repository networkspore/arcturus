
import React, { useState, useEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"
import produce from "immer"
import { get, set } from "idb-keyval"
import styles from "../pages/css/home.module.css"
import { useRef } from "react"

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { svgMime } from "../constants/constants"
import { AdditiveAnimationBlendMode } from "three"



const createWorker = createWorkerFactory(() => import('../constants/utility'));


export const FileHandler = ( props = {}) =>{
 
    const worker = useWorker(createWorker)

    const [active, setActive] = useState()
 const appsDirectory = useZust((state)=> state.appsDirectory)

    //const localDirectory = useZust((state) => state.localDirectory)
    const setAppsDirectory = useZust((state) => state.setAppsDirectory)
    const appsHandleRef = useRef({ value: null })
    const setConfigFile = useZust((state) => state.setConfigFile)
    const setLocalDirectory = useZust((state) => state.setLocalDirectory)
    const setAssetsDirectory = useZust((state) => state.setAssetsDirectory)
    const setImagesDirectory = useZust((state) => state.setImagesDirectory)
    const setMediaDirectory = useZust((state) => state.setMediaDirectory)

    const setSocketCmd = useZust((state) => state.setSocketCmd)


    const storageHashRef = useRef({value: null})
    const userNameRef = useRef({value:props.userName})

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
                    
                   
                        if( addProcessing(request)){
                     
                        
                            executeFileCommand(request).then((result)=>{
                            
                                request.callback(result)
                                removeProcessing(request)
                                removeFileRequest(request)
                            })           
                        
                        }else{
                            console.log(request)
                        
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
                case "getApp":
                    if(storageHashRef.current.value != null)
                    {
                        const promise = getApp(request)
                        resolve(promise)
                   
                    }else{
                        resolve(undefined)
                    }
                    break;
                case "removeApp":
                    if (storageHashRef.current.value != null) {
                        const promise = removeApp(request);
                        resolve(promise)
                    }else{
                        resolve(undefined)
                    }
                    break;
                case "loadStorage":
         
                       const promise = loadStorage(request)
                        resolve(promise)
                   
                    break;
                case "getIcon":
                    if (request.file != null && request.file.hash != null && request.file.hash != "" && request.file.mimeType != null) {

                   
                    if (request.file.type.slice(0, svgMime.length) != svgMime) {


                            get(request.file.hash + ".arcicon").then((dataUrl) => {

                                if (dataUrl != undefined) {


                                    resolve({ success: true, dataUrl: dataUrl, request: request })
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

                        
                       
                    }else{
                        get(request.file.hash + ".arcsvg").then((dataUrl) => {

                            if (dataUrl != undefined) {


                                resolve({ success: "true", dataUrl: dataUrl, request: request })
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
                    } 
                    } else {
                        console.log("requesting null")
                        request.callback({ error: new Error("File does not exist.") })
                        removeFileRequest(request)
                    }
                    break;
                case "getImage":
                case "getFile":
                    if (request.file != null && request.file.hash != null && request.file.hash != "" && request.file.mimeType != null) {


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
                            if (request.file.type.slice(0, svgMime.length) != svgMime) {        
                                resolve( { success: true, file: result, request: request })
                            }else{

                                get(request.file.hash + ".arcsvg").then((dataUrl) => {

                                    if (dataUrl != undefined) {


                                        resolve({ success: "true", dataUrl: dataUrl, request: request })
                                    }else{
                                        resolve({ error: "no svg" })
                                    }
                                })
                            }
                         
                        }
                        
                    })
                
            } else {
                console.log("requesting null")
                request.callback({ error: new Error("File does not exist.") })
                removeFileRequest(request)
            }
                    break;
                   
                default:
                    resolve({ error: "not implemented" })

            }
         

        })

    }




    const fetchDataUrl = (url, type, hash) =>{
        return new Promise(resolve =>{
         
            fetch(url).then((fetchResult)=>{
                fetchResult.blob().then((blob)=>{
                    console.log(blob)
                    worker.getIconDataUrl(blob, type, hash).then((dataUrl)=>{
                        set(hash + ".arcicon", dataUrl).then((set)=>{
                            resolve(dataUrl)
                        })
                    })
                })
            })

        })
    }

    const getUrlIcon = (file) =>{
        return new Promise((resolve) => {
        
            const fileHash = file.hash
            const fileType = file.type
            const url = file.url

            const loadingImageIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)

            if (loadingImageIndex == -1) {
                
                

                const promise = fetchDataUrl(url, fileType, fileHash)

                loadingIcons.current.value.push({ hash: fileHash, promise: promise })

                promise.then((dataUrl) => {

                        
                    const itemIndex = loadingIcons.current.value.findIndex(imgs => imgs.hash == fileHash)
                    loadingIcons.current.value.splice(itemIndex, 1)
                    resolve({ dataUrl: dataUrl, hash: fileHash })
                        
                
                })
        
                promise.catch((err) => {
                    resolve({ error: new Error("No image url") })
                })

            } else {
          
                const promise = loadingIcons.current.value[loadingImageIndex].promise
            
                promise.then((dataUrl) => {
                    
                        resolve({ dataUrl: dataUrl, hash: fileHash })
                })
                
                promise.catch((err)=>{
                    resolve({error: new Error("No image url")})
                })
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

    async function searchLocalApps(request) {
        const allFiles = await get(userNameRef.current.value + ".arcturus")
        if (allFiles != undefined) {
            const index = allFiles.findIndex(iFile => iFile.hash == request.file.hash)

            if (index != -1) {
                const iFile = allFiles[index]
                return iFile

            } else {
                return undefined
            }
        } else {
            return undefined
        }
    }


    async function searchLocalFiles(request){
        const allFiles = await get(userNameRef.current.value + "arc.cacheFile")
        if(allFiles != undefined){
            const index = allFiles.findIndex(iFile => iFile.hash == request.file.hash)
            
            if(index != -1){
                const iFile = allFiles[index]
                return iFile

            }else{
                return undefined
            }
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
    
  

    /*const getStorageKey = () => {
        return new Promise(resolve => {
            const storageHash = storageHashRef.current.value
            setSocketCmd({
                cmd: "addStorageApp",
                params: { storageHash: storageHash, app: item },
                callback: (result) => {
                    if ("success" in result && result.success) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            })
        })
    }*/

    const createApp = async (item) =>{
        try{
            const fetchResult = await fetch(item.app.url)

            const blob = await fetchResult.blob()

            const appsDir = appsHandleRef.current.value


            const appDirHandle = await appsDir.getDirectoryHandle(item.app.name, {create:true})

            const fileHandle = await appDirHandle.getFileHandle(item.name, { create: true })

            const appFileStream = await fileHandle.createWritable()

            await appFileStream.write(blob)

            await appFileStream.close()

            const appHandle = await appsDir.getFileHandle(item.name)

            const file = appHandle.getFile()

            const fileInfo = await worker.getFileInfo(file, appHandle, appsDir)
            
            return fileInfo

        } catch (err){
            
            console.log(err)

            return undefined

        }

    } 
    

    const removeApp = async (request) =>{
        const appFile = request.file;

        const appsDir = appsHandleRef.current.value

        

        try{
            await appsDir.removeEntry(appFile.app.name, { recursive: true })
            
            const appCache = await get(storageHashRef.current.value + ".arcturus")
            
            if(appCache != undefined){

                const installedApps = appCache.installedApps == undefined ? [] : appCache.installedApps;

                const availableApps = appCache.availableApps == undefined ? [] : appCache.availableApps;

    


            
                const availableFileIndex = availableApps.findIndex(apC => apC.hash == appFile.hash)

                if (availableFileIndex != -1) {
                    if (availableApps.length == 1) {
                        availableApps.pop()
                    } else {
                        availableApps.splice(availableFileIndex, 1)
                    }
                  
                } 

                const installedFileIndex = installedApps.findIndex(iA => iA.hash == item.hash)

                if (installedFileIndex != -1) {
                    if (installedApps.length == 1) {
                        installedApps.pop()
                    } else {
                        installedApps.splice(installedFileIndex, 1)
                    }
                }

                  return true

            }else{
                return false
            }


          
        }catch(err){
            return false
        }

    }

    const downloadingRef = useRef({value:[]})

    

    const getApp = (request) => {
        return new Promise(resolve => {
            const item = request.file 

            const dlAppIndex = downloadingRef.current.value.findIndex(dref => dref.hash == item.hash)

            if(dlAppIndex == -1)
            {
            
                const promise = processDl(item)
                downloadingRef.current.value.push({ hash: item.hash, promise: promise })
                    
                promise.then((result)=>{
                    resolve(result)
                })
                    
            
            }else{

                const dlAppItem = downloadingRef[dlAppIndex];

                dlAppItem.promise.then((result) => {
                    resolve(result)
                })

            }
       })
    }  
    
    const removeDownloadingApp = useZust((state) => state.removeDownloadingApp)
    const addDownloadingApp = useZust((state) => state.addDownloadingApp)

    
    const processDl = async (item) =>{

        addDownloadingApp(item)
        const appCache = await get(storageHashRef.current.value + ".arcturus")

        const noAppCache = appCache == undefined

        const installedApps = noAppCache  ? [] : appCache.installedApps == undefined ? [] : appCache.installedApps;

        const availableApps = noAppCache ? [] : appCache.availableApps == undefined ? [] : appCache.availableApps;


        const fileInfo = await createApp(item)

        if(fileInfo == undefined)
        {
            removeDownloadingApp(item)
            return false
        }else{

            const appFile = setItemAppFile(item, fileInfo)


            const availableFileIndex = availableApps.findIndex(apC => apC.hash == appFile.hash)

            if (availableFileIndex != -1) {
                availableApps.splice(availableFileIndex, 1, appFile)
            } else {
                availableApps.push(appFile)
            }
           
            const installedFileIndex = installedApps.findIndex(iA => iA.hash == item.hash)

            if (installedFileIndex == -1) {
                installedApps.push(item)
            }else{
                installedApps.splice(installedFileIndex, 1, appFile)
            }

            await set(storageHashRef.current.value + ".arcturus", { availableApps: availableApps, installedApps: installedApps })
            removeDownloadingApp(item)
            return true
        }
    }


   

    const checkAppFiles = (items) => {
        return new Promise(resolve => {

            const hashes = []
            items.forEach(itm => {
                hashes.push(aesjs.utils.hex.toBytes(itm.hash))
            });

            setSocketCmd({
                cmd: "checkAppFiles", params: { hashes: hashes }, callback: (result) => {
                    if ("success" in result && result.success) {
                        const apps = result.apps
                        let newAppFiles = []

                        for (let i = 0; i < apps.length; i++) {
                            const app = apps[i]
                            const itemIndex = items.findIndex(itm => itm.hash == app.hash)
                            const item = items[itemIndex]
                        
                                const newItem = setItemAppFile(item, app)
                                newAppFiles.push(newItem)
                            
                        }

                        resolve({ appFiles: newAppFiles })
                    } else {
                        resolve({ appFiles: [] })
                    }
                }
            })
        })
    }

    const setItemAppFile = (item, appfile) => {
        let newItem = {
            application: item.application,
            directory: item.directory,
            mimeType: item.mimeType,
            name: item.name,
            hash: item.hash,
            size: item.size,
            type: item.type,
            lastModified: item.lastModified,
            handle: item.handle,
            app: {
                appID: appfile.app.appID,
                description: appfile.app.description,
                name: appfile.app.name,
                extensions: appfile.app.extensions != null ? JSON.parse(appfile.app.extensions) : null,
                keyWords: appfile.app.keyWords,
                url: appfile.app.url,
            },
            image: {
                fileID: appfile.image.fileID,
                name: appfile.image.name,
                type: appfile.image,
                hash: appfile.image.hash,
                mimeType: appfile.image.mimeType,
                size: appfile.image.size,
                lastModified: appfile.image.lastModified,
                url: appfile.image.url,
            }
        }
        return newItem
    }

    const updateAppFiles = (allFiles = [], idbCacheArray = [], installedApps = []) => {

        return new Promise(resolve => {
            let i = 0;

            if(allFiles.length == 0)
            {
                resolve([])
            }else{

      

            const isArray = Array.isArray(idbCacheArray)
            const noCache = (isArray && idbCacheArray.length == 0) || !isArray
            let newCache = []

            async function checkFilesRecursive() {

                const entry = allFiles[i].handle
                const directory = allFiles[i].directory

                const file = await entry.getFile()
                //const name = file.name
                //const size = file.size
                //let changed = false

                if (noCache) {

                    const item = await worker.getFileInfo(file, entry, directory)

                    const iAppIndex = installedApps.findIndex(ap => ap.hash == item.hash)



                    let newItem = {

                        application: item.application,
                        directory: item.directory,
                        mimeType: item.mimeType,
                        name: item.name,
                        hash: item.hash,
                        size: item.size,
                        type: item.type,
                        lastModified: item.lastModified,
                        handle: item.handle,
                        app: iAppIndex == -1 ? undefined : installedApps[iAppIndex].app,
                        image: iAppIndex == -1 ? undefined : installedApps[iAppIndex].image,
                    }

                    const contains = (newCache.findIndex(c => c.hash == newItem.hash) > -1)

                    if (!contains) {
                        newCache.push(newItem)
                    }

                    i = i + 1
                    if (i < allFiles.length) {

                        checkFilesRecursive()
                    } else {
                        installedApps.forEach(item => {
                            const cacheIndex = newCache.findIndex(cache => cache.hash == item.hash)

                            if (cacheIndex == -1) {
                                let newItem = {


                                    application: item.application,
                                    directory: item.directory,
                                    mimeType: item.mimeType,
                                    name: item.name,
                                    hash: item.hash,
                                    size: item.size,
                                    type: item.type,
                                    lastModified: item.lastModified,
                                    handle: undefined,
                                    app: item.app,
                                    image: item.image,
                                }

                                newCache.push(newItem)

                            }
                        });


                        resolve(newCache)
                    }
                } else {



                    const index = noCache ? undefined : await worker.asyncFind(idbCacheArray, async item => {
                        return await entry.isSameEntry(item.handle);
                    })


                    if (index != undefined) {
                        const item = idbCacheArray[index]

                        // const hasDimensions = item.mimeType == "image"
                        const installedIndex = installedApps.findIndex(iApps => iApps.hash == item.hash)

                        let newItem = {


                            application: item.application,
                            directory: item.directory,
                            mimeType: item.mimeType,
                            name: item.name,
                            hash: item.hash,
                            size: item.size,
                            type: item.type,
                            lastModified: item.lastModified,
                            handle: item.handle,
                            app: installedIndex != -1 ? installedApps[installedIndex].app : undefined,
                            image: installedIndex != -1 ? installedApps[installedIndex].image : undefined,
                        }

                        newCache.push(newItem)


                        i = i + 1
                        if (i < allFiles.length) {
                            checkFilesRecursive()
                        } else {
                            installedApps.forEach(item => {
                                const cacheIndex = newCache.findIndex(cache => cache.hash == item.hash)

                                if (cacheIndex == -1) {
                                    let newItem = {


                                        application: item.application,
                                        directory: item.directory,
                                        mimeType: item.mimeType,
                                        name: item.name,
                                        hash: item.hash,
                                        size: item.size,
                                        type: item.type,
                                        lastModified: item.lastModified,
                                        handle: undefined,
                                        app: item.app,
                                        image: item.image,
                                    }

                                    newCache.push(newItem)

                                }
                            });


                            resolve(newCache)
                        }



                    } else {
                        const item = await worker.getFileInfo(file, entry, directory)

                        const installedIndex = installedApps.findIndex(iApps => iApps.hash == item.hash)

                        let newItem = {


                            application: item.application,
                            directory: item.directory,
                            mimeType: item.mimeType,
                            name: item.name,
                            hash: item.hash,
                            size: item.size,
                            type: item.type,
                            lastModified: item.lastModified,
                            handle: item.handle,
                            app: installedIndex != -1 ? installedApps[installedIndex].app : undefined,
                            image: installedIndex != -1 ? installedApps[installedIndex].image : undefined,
                        }
                        const contains = (newCache.findIndex(c => c.hash == newItem.hash) != -1)


                        if (!contains) {


                            newCache.push(newItem)

                        }

                        i = i + 1
                        if (i < allFiles.length) {

                            checkFilesRecursive()
                        } else {
                            installedApps.forEach(item => {
                                const cacheIndex = newCache.findIndex(cache => cache.hash == item.hash)

                                if (cacheIndex == -1) {
                                    let newItem = {


                                        application: item.application,
                                        directory: item.directory,
                                        mimeType: item.mimeType,
                                        name: item.name,
                                        hash: item.hash,
                                        size: item.size,
                                        type: item.type,
                                        lastModified: item.lastModified,
                                        handle: undefined,
                                        app: item.app,
                                        image: item.image,
                                    }

                                    newCache.push(newItem)

                                }
                            });


                            resolve(newCache)
                        }
                    }


                }
            }
            if (allFiles.length > 0) {
                checkFilesRecursive()


            } else {
                installedApps.forEach(item => {
                    const cacheIndex = newCache.findIndex(cache => cache.hash == item.hash)

                    if (cacheIndex == -1) {
                        let newItem = {


                            application: item.application,
                            directory: item.directory,
                            mimeType: item.mimeType,
                            name: item.name,
                            hash: item.hash,
                            size: item.size,
                            type: item.type,
                            lastModified: item.lastModified,
                            handle: undefined,
                            app: item.app,
                            image: item.image,
                        }

                        newCache.push(newItem)

                    }
                });


                resolve(newCache)
            }
            }
        })
    }

    const loadInstalledApps = async () => {
        try {
            const appsHandle = appsHandleRef.current.value

            const { files, directories } = await worker.getFirstDirectoryAllFiles(appsHandle);

           
            const apps = []

           
            
            files.forEach(file => {
                if (file.mimeType == "app") {
                    apps.push(file)
                }
            });

            const cache = await get(storageHashRef.current.value + ".arcturus");

            const availableApps = cache != undefined ? cache.availableApps : [];

            const installedApps = cache != undefined ? cache.installedApps : [];
          

            const updatedApps = await updateAppFiles(apps, availableApps, installedApps)

            await set(storageHashRef.current.value + ".arcturus", {availableApps: updatedApps, installedApps: installedApps})
            
            setAppsDirectory({ name: "apps", handle: appsHandle, directories: directories })


        } catch (err) {
            console.log(err)
        }
    }
    

    const loadStorageHash = (storageHash) => {
        return new Promise(resolve =>{
        setSocketCmd({
            cmd: "checkStorageHash", params: { storageHash: storageHash }, callback: (result) => {

                resolve(result)
            }})
        })
    }
    

    const loadStorage = async (request) => {
       
        const { localDirectory } = request
        console.log(localDirectory)
        let file = null
        try {
            const homeHandle = await localDirectory.handle.getDirectoryHandle("home", { create: true })
            const userHomeHandle = await homeHandle.getDirectoryHandle(userNameRef.current.value, { create: true })

            const engineHandle = await userHomeHandle.getDirectoryHandle("core", { create: true })
            const handle = await engineHandle.getFileHandle(userNameRef.current.value + ".core", { create: true })
          
            const appsHandle = await userHomeHandle.getDirectoryHandle("apps", {create: true})
            
            
            appsHandleRef.current.value = appsHandle

            
            file = await handle.getFile()


            const configFile = file != null ? await worker.getFileInfo(file, handle, userHomeHandle) : undefined


            if (configFile != undefined) {
                const storageHash = configFile.hash

                const result = await loadStorageHash(storageHash)

                if ("success" in result && result.success) {
                
                
                    storageHashRef.current.value = storageHash
                    
                    await loadInstalledApps()

                    const imageHandle = await localDirectory.handle.getDirectoryHandle("images", { create: true })
                    const mediaHandle = await localDirectory.handle.getDirectoryHandle("media", { create: true })
                    const assetsHandle = await localDirectory.handle.getDirectoryHandle("assets", { create: true })


                    const images = await worker.getFirstDirectoryAllFiles(imageHandle);

                    const media = await worker.getFirstDirectoryAllFiles(mediaHandle);

                    const assets = await worker.getFirstDirectoryAllFiles(assetsHandle);


                    
                    setLocalDirectory(localDirectory)

                    setAssetsDirectory({ name: assetsHandle.name, handle: assetsHandle, directories: assets.directories })

                    setImagesDirectory({ name: imageHandle.name, handle: imageHandle, directories: images.directories })

                    setMediaDirectory({ name: mediaHandle.name, handle: mediaHandle, directories: media.directories })

                    setConfigFile(configFile)

                   

                    return true
                }else{
                    return false
                }
                    
                
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }
    const configFile = useZust((state) => state.configFile)
    return (
        <>
            {configFile.handle == null &&
                <ImageDiv className={styles.glow}
                    onClick={(e) => {
                       navigate("/home/localstorage")
                    }}
                    width={30} height={30} netImage={{ scale: .7, image: "/Images/icons/server-outline.svg", filter: "invert(100%)" }} />
            }
   
        </>
    )
}
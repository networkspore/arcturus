import useZust from "./hooks/useZust";
import React, { useEffect, useState, useId, useLayoutEffect } from "react";
import styles from './pages/css/ContentMenu.module.css';
import { NavLink, useHref, useLocation, useNavigate } from "react-router-dom";

import produce from "immer";
import LoginPage from "./pages/LoginPage"
import WelcomePage from "./pages/WelcomePage";
import { ContactsPage } from "./pages/ContactsPage";
import { HomePage } from "./pages/HomePage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";
import { AppsPage } from "./pages/AppsPage";

import { SystemMessagesMenu } from "./handlers/SystemMessagesMenu";
import { get, update, set } from "idb-keyval";

import { ImageDiv } from "./pages/components/UI/ImageDiv";

import { PeerNetworkHandler } from "./handlers/PeerNetworkHandler";
import { FileHandler } from "./handlers/FileHandler";



import { asyncFind, getFileInfo, getFirstDirectoryAllFiles, getJsonFile } from "./constants/utility";
import { firstSetup, initDirectory, initStorage } from "./constants/systemMessages";

import { useRef } from "react";

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { SocketHandler } from "./handlers/socketHandler";
import { StorageHandler } from "./handlers/StorageHandler";
import { ContactsHandler } from "./handlers/ContactsHandler";
import { fileTypes, MB } from "./constants/constants";
import useDynamicRefs from 'use-dynamic-refs';
import { ImageViewer } from "./pages/components/UI/ImageViewer";
import MediaViewer from "./pages/components/UI/MediaViewer";
import { AppMenu } from "./pages/components/UI/AppMenu";
import { LoadingStatusBar } from "./pages/components/UI/LoadingStatusBar";
import { BackUp } from "./pages/components/UI/BackUp";
import { ProfileButton } from "./pages/components/UI/ProfileButton";

const createWorker = createWorkerFactory(() => import('./constants/utility'));



const HomeMenu = (props = {}) => {
    const setLoadingStatus = useZust((state) => state.setLoadingStatus)
    const loadingComplete = useZust((state) => state.loadingComplete)
    const worker = useWorker(createWorker)
    const [appList, setAppList] = useState([])
    const currentHash = useZust((state)=> state.currentHash)
    const setCurrentHash = useZust((state) => state.setCurrentHash)
    const location = useLocation()
    const openFile = useZust((state) => state.openFile)
    const [getRef, setRef] = useDynamicRefs()
    const prevUserID = useRef({value:false})

  
    const setCacheDirectory = useZust((state) => state.setCacheDirectory)
    const setAppsDirectory = useZust((state) => state.setAppsDirectory);

    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setModelsDirectory = useZust((state) => state.setModelsDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);
    const setAudioDirectory = useZust((state) => state.setAudioDirectory);
    const setVideoDirectory = useZust((state) => state.setVideoDirectory);
    
    const setAssetsDirectory = useZust((state) => state.setAssetsDirectory)
    const setPcsDirectory = useZust((state) => state.setPcsDirectory)
    const setNpcsDirectory = useZust((state) => state.setNpcsDirectory)
    const setTexturesDirectory = useZust((state) => state.setTexturesDirectory)
    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory)
    const setPlaceablesDirectory = useZust((state) => state.setPlaceablesDirectory)
    const setTypesDirectory = useZust((state) => state.setTypesDirectory)

    const openApp = useZust((state) => state.openApp)
    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const [showMenu, setShowMenu] = useState(false)

    const navigate = useNavigate();
    const pageSize = useZust((state) => state.pageSize);

    const user = useZust((state) => state.user);

    const [currentApps, setCurrentApps] = useState([])
    const configFile = useZust((state) => state.configFile)
    const setConfigFile = useZust((state) => state.setConfigFile)


    const addSystemMessage = useZust((state) => state.addSystemMessage)


    const toNav = useNavigate()


    const [showIndex, setShowIndex] = useState(false);


    //const connected = useZust((state)=>state.connected)
    //const setConnected = useZust((state) => state.setConnected)

    const localDirectory = useZust((state) => state.localDirectory)



    const setLocalDirectory = useZust((state) => state.setLocalDirectory)

    const [directory, setDirectory] = useState("")

    const setPage = useZust((state) => state.setPage)


    
    
    const [loadState, setLoadState] = useState(null)


    useEffect(() => {
        let currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        currentLocation = secondSlash == -1 ? currentLocation : currentLocation.slice(0, secondSlash)

        setDirectory(currentLocation)


        if (user.userID > 0) {

            if (currentLocation == '/') {
                if (location.state != undefined){
                    
                    if (location.state.configFile != undefined && location.state.configFile != null && location.state.localDirectory != undefined){
                        setConfigFile(location.state.configFile)
                        setLocalDirectory(location.state.localDirectory)
                    }else{
                       
                        addSystemMessage(initStorage)
                    }
                }
                if (!showMenu) setShowMenu(true);
                setShowIndex(0)
                setPage(1)
            } else {

                const rootDirectory = currentLocation.slice(0, secondSlash == -1 ? currentLocation.length : secondSlash)

                switch (rootDirectory) {
                    case "/login":

                        break;
                    case "/contacts":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(3)

                        break;
                    case "/home":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(4);
                        setPage(3)
                        break;
                    case "/apps":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(6);
                        break;
                
                     /*
                    case "/loading":
                       
                        setLoadState(location.state)
                        setShowIndex(-1)
                        setPage(null)
                        setShowMenu(false)
                  
                        break;*/

                    default:

                        navigate('/')

                }



            }

        } else {


            switch (currentLocation) {
                case '/login':
                    setTimeout(() => { setShowIndex(1) },100)
                   
                    break;
                case '/welcome':
                    setShowIndex(2)
                    break;
                case '/recoverpassword':
                    setShowIndex(5)
                    break;
                default:
                    navigate("/login")
                    break;
            }
        }



    }, [location, user])

    


   

    /*async function setIdbArray(){


        let idbCacheArray = await get("arc.cacheFile").catch((err) => {
          
        })
        let loadedCache = []
        if (Array.isArray(idbCacheArray)){
            idbCacheArray.forEach(item => {
                const names = Object.getOwnPropertyNames(item)

                let newItem = {}
                names.forEach(name => {
                    if(name != "loaded"){
                        newItem[name] = item[name]
                    }
                });
                newItem.loaded = false

                loadedCache.push(newItem)
            });
            await set("arc.cacheFile", loadedCache)
        }else{
            await set("arc.cacheFile", [])
        }
        
        
        
        
        return true
    }*/

   
    useEffect(()=>{
        console.log(localDirectory.handle, configFile.handle)
        if (  localDirectory.handle != null && configFile.handle != null){

            setFolderDefaults(localDirectory, configFile)
        }
    }, [localDirectory, configFile])

   /* useEffect(()=>{
        if(realms != null && realms.length > 0){
            setQuickBarDefaults()

        }else{
            setQuickBar([])
        }
    },[user, realms])*/



    /*const setQuickBarDefaults = () => {

        const userID = user.userID;

        if (userID > 0 && Array.isArray(realms) && realms.length > 0) {
            const qbarIdbName = userID + ".arcquickBar";

            get(qbarIdbName).then((idbQuickBar) => {


                if (idbQuickBar != undefined) {

                    try {
                        const qBar = idbQuickBar

                        if (Array.isArray(qBar)) {

                            let changed = false;
                            let checkedQbar = []
                            qBar.forEach(qbarRealm => {
                                const index = realms.findIndex(realm => realm.realmID == qbarRealm)
                                
                                if (index != -1) {
                                    checkedQbar.push(qbarRealm)
                                } else {
                                    changed == true;
                                }
                            });

                            if (changed) {
                               
                     
                                set(qbarIdbName, checkedQbar)
                                setQuickBar(checkedQbar);
                            
                            }else{
                                setQuickBar(checkedQbar);
                            }

                           
                           
                        } else {
                            console.log("Quick bar is corrupt")

                            setQuickBar([]);
                        }

                    } catch (err) {
                  
                        console.log(err)
                       // set(qbarIdbName, [])
                       // setQuickBar([]);
                    }

                }
            })

        } else {
            setQuickBar([]);
        }

    }*/

    async function getUserConfig(configFileHandle){
        return await getJsonFile(userConfigHandle)
    }

    async function setDefaultUserConfig(userHomeHandle){
        const defaultConfig = {
            
        }
    }
    useEffect(() => {
        if (openFile != null) {
            onOpenFile(openFile)
        }
    }, [openFile])


 
    const addCurrentApp = (item) =>setCurrentApps(produce(state =>{
       
        const appHash = item.hash
        const index = currentApps.findIndex(apps => apps.hash == appHash)

        if(index == -1){
            const app = { 
                name: item.name,
                hash: item.hash, 
                type: item.type, 
                mimeType: item.mimeType, 
                appName: item.appName, 
                application: item.application 
            }
            state.push(app)
          
        }
    }))

    const removeCurrentApp = (item) => setCurrentApps(produce(state =>{
        const index = state.findIndex(apps => apps.hash == item.hash)

        if(index != -1)
        {
            if (state.length == 1) {
                state.pop()
            } else {
                state.splice(index, 1)
            }
        }

    }))

    useEffect(()=>{
        if (currentApps.length > 0)
        {
            let icons = []
            currentApps.forEach(app => {
                    let netImage = { filter: "invert(100%)" }
                    switch (app.application) {
                        case "video":
                            netImage.image = "/Images/icons/film-outline.svg"
                            break;
                        case "audio":
                            netImage.image = "/Images/icons/musical-notes-outline.svg"
                            break;
                        default:
                            netImage.image = "/Images/icons/document-outline.svg"
                            break;
                    }
                    const appHash = app.hash

                    icons.push(


                        <div key={appHash} onClick={() => {

                            setCurrentHash(appHash)
                            //currentHash == appHash ? styles.menuActive :
                        }} style={{ outline: 0 }} className={currentHash == appHash ? styles.menuActive : styles.menu__item} about={app.name}>



                            <ImageDiv width={60} height={60} style={{
                                backgroundColor: "black",
                                boxShadow: currentHash == appHash ? "0 0 10px #ffffff20, 0 0 20px #ffffff30, inset 0 0 40px #77777730" : ""
                            }}
                                netImage={netImage}

                            />
                        </div>
                    )
                })
                setAppList(icons)
        }else{
            setAppList([])
        }

    },[currentHash,currentApps])



    const onCloseFile = (file) => {

        removeOpenApp(file)
    }

    const onOpenFile = (file) => {

        addOpenApp(file)

    }

    const addOpenApp = (item) => useZust.setState(produce((state) => {

       

        const currentFile = {
            width: "width" in item ? item.width : undefined,
            height: "height" in item ? item.height : undefined,
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
            fileID: "fileID" in item ? item.fileID : undefined,
            userFileID: "userFileID" in item ? item.userFileID : undefined,
            title: "title" in item ? item.title : undefined,
            text: "text" in item ? item.text : undefined
        }


        const fileHash = currentFile.hash

        const index = state.openApp.findIndex(apps => apps.key == fileHash)

        if(index == -1){
            switch (currentFile.mimeType) {
                case "image":
              
                    addCurrentApp({name: currentFile.name, hash:currentFile.hash, type: currentFile.type, mimeType: currentFile.mimeType, appName:"Image Viewer", application: currentFile.application})
                    state.openApp.push(
                        <ImageViewer key={fileHash} errorImage={"/Images/icons/person.svg"} currentImage={currentFile} close={() => { onCloseFile(currentFile) }} />
                    )
                    break;
                case "media":
                   
                    addCurrentApp({ name: currentFile.name, hash: currentFile.hash, type: currentFile.type, mimeType: currentFile.mimeType, appName: "Media Viewer", application: currentFile.application })
                    state.openApp.push(
                        <MediaViewer key={fileHash} errorImage={"/Images/icons/film-outline.svg"} currentVideo={currentFile} close={() => { onCloseFile(currentFile) }} />
                    )
                    break;
            }
        }

    }))

    const removeOpenApp = (file) => useZust.setState(produce((state) => {
      
        const fileHash = file.hash
        if (currentHash == fileHash) setCurrentHash("")

        const index = state.openApp.findIndex(app => app.key == fileHash)

        if (index != -1) {
            if (state.openApp.length == 1) {
                state.openApp.pop()
            } else {
                state.openApp.splice(index, 1)
            }

        }
        const removed = state.openApp.findIndex(app => app.key == fileHash) == -1
        if(removed) removeCurrentApp(file)
    }))

    //const addFiles = useZust((state) => state.addFiles)


    async function setFolderDefaults(localDirectory, configFile) {
           
            try {
                const appsHandle = await configFile.directory.getDirectoryHandle("apps", { create: true })

                const imageHandle =  await localDirectory.handle.getDirectoryHandle("images", { create: true }) 
                const mediaHandle = await localDirectory.handle.getDirectoryHandle("media", { create: true }) 
                const assetsHandle = await localDirectory.handle.getDirectoryHandle("assets", {create: true})


           
                const apps = await getFirstDirectoryAllFiles(appsHandle)
                
                const images = await getFirstDirectoryAllFiles(imageHandle);
 
                const media = await getFirstDirectoryAllFiles(mediaHandle); 
             
                const assets = await getFirstDirectoryAllFiles(assetsHandle);
           
                let allFiles = []

                apps.files.forEach(entry =>{
                    allFiles.push(entry)
                })

                images.files.forEach(entry => {
                   allFiles.push(entry)
                });

                media.files.forEach(entry => {
                
                    allFiles.push(entry)
                });
                
                assets.files.forEach(entry => {

                    allFiles.push(entry)
                });

                setAppsDirectory({name: "apps", handle: appsHandle, directories: apps.directories})
              
                setAssetsDirectory({ name: "assets", handle: assetsHandle, directories: assets.directories})

                setImagesDirectory({ name: imageHandle.name, handle: imageHandle, directories: images.directories })
              
                setMediaDirectory({ name: mediaHandle.name, handle: mediaHandle, directories: media.directories})

               
                checkAllFiles(allFiles)

            } catch (err) {
             
                addSystemMessage(initStorage)
                      
            } 
        
       
    }
    const setLoadingComplete = useZust((state) => state.setLoadingComplete)
   
    const checkAllFiles = (allFiles = []) =>{
       
        return new Promise(resolve => {
            let i = 0;
          
            get("arc.cacheFile").then((idbCacheArray)=>{
                
                const isArray = Array.isArray(idbCacheArray)
                const noCache = (isArray && idbCacheArray.length == 0) || !isArray
                let newCache = []
                setLoadingComplete(false)

              

                async function checkFilesRecursive(){
                 
                    const entry = allFiles[i].handle
                    const directory = allFiles[i].directory
                    
                    const file = await entry.getFile()
                    const name = file.name
                    //const size = file.size

                    setLoadingStatus({ name: name, hash: "", index: i, length: allFiles.length, complete: false })
                    
                    if(noCache  )
                    {
                     
                        const item = await worker.getFileInfo(file, entry, directory)
                        let newItem = {

                            application: item.application,
                            directory: item.directory,
                            mimeType: item.mimeType,
                            name: item.name,
                            hash: item.hash,
                            size: item.size,
                            type: item.type,
                            lastModified: item.lastModified,
                            handle: item.handle
                        }

                        const contains =  (newCache.findIndex(c => c.hash == newItem.hash) > -1)

                        if (!contains) newCache.push(newItem)
                       // console.log(newItem)
                        i = i + 1
                        const isSet = await set("arc.cacheFile", newCache)

                        setLoadingStatus({ name: name, hash: newItem.hash, index: i, length: allFiles.length, complete: true })
                        if (i < allFiles.length) {
                           
                            checkFilesRecursive()
                        } else {
                            setLoadingComplete(true)
                            resolve(true)
                        }
                    }else{
                   
                       
                        
                        const index = noCache ? undefined : await worker.asyncFind(idbCacheArray, async item => {
                                return await entry.isSameEntry(item.handle);
                            })
                       
                       
                        if (index != undefined) {
                            const item = idbCacheArray[index]
                            
                           // const hasDimensions = item.mimeType == "image"

                            let newItem = {
        
                                application: item.application, 
                                directory: item.directory, 
                                mimeType: item.mimeType, 
                                name: item.name, 
                                hash: item.hash, 
                                size: item.size, 
                                type: item.type, 
                                lastModified: item.lastModified,
                                handle: item.handle 
                            }
                            
                            newCache.push(newItem)

                            await set("arc.cacheFile", newCache)
                                
                            i = i + 1
                            setLoadingStatus({ 
                                name: name, 
                                hash: newItem.hash, 
                                index: i, 
                                length: allFiles.length, 
                                complete: true 
                            })

                            if (i < allFiles.length) {
                                checkFilesRecursive()
                            } else {
                                setLoadingComplete(true)
                                resolve(true)
                            }
                       
                                    
                            
                        }else{
                            const item = await worker.getFileInfo(file,entry, directory)

                            let newItem = {
        
                                application: item.application, 
                                directory: item.directory, 
                                mimeType: item.mimeType, 
                                name: item.name, 
                                hash: item.hash, 
                                size: item.size, 
                                type: item.type, 
                                lastModified: item.lastModified,
                                handle: item.handle 
                            }

                            const contains = (newCache.findIndex(c => c.hash == newItem.hash) != -1)


                            if (!contains) newCache.push(newItem)

                            i = i + 1
                            await set("arc.cacheFile", newCache)
                            setLoadingStatus({ name: name, hash: newItem.hash, index: i, length: allFiles.length, complete: true })
                            if (i < allFiles.length) {

                                checkFilesRecursive()
                            } else {
                                setLoadingComplete(true)
                                resolve(true)
                            }
                        }

                            
                            
                        

                    }
                }
                if(allFiles.length > 0){
                    checkFilesRecursive()
                

                }else{
                    resolve(true)
                }
            })
        })
    }


    /*entry
        fileSystemHandle
        kind:
        name:
        isSameEntry()
        queryPermission
        requestPermission
        */

    /*
    file
        name:
        lastModified: 
        type:
        size:
    */






    /*     <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="D&D" to={'/campaign'}>
                        <img src="Images/Campaign/1/logo.png" width={50} height={50} />
                    </NavLink>
                    */



    function onProfileClick(e) {


        toNav("/home")

    }






    const homeMenuID = useId()
/*
    useEffect(() => {
    
        if (showMenu && realms != null && realms.length > 0) {
            const tmp = []
            if (quickBar != undefined && quickBar != null && quickBar.length > 0) {
               
                quickBar.forEach((realmID, i) => {
                    
                    const realmIndex = realms.findIndex(r => r.realmID == realmID)
                    if (realmIndex != -1) {
                        const realm = realms[realmIndex];
                        const realmImage = realm.image

                       
                        tmp.push(

                            
                            <div key={realm.realmID} onClick={() => {
                                setCurrentRealmID(realm.realmID)
                                navigate("/realm/gateway")
                            }} style={{ outline: 0 }} className={showIndex == 7 && currentRealmID == realm.realmID ? styles.menuActive : styles.menu__item} about={realm.realmName}>
                               
                                   
                               
                                <ImageDiv width={60} height={60} style={{
                                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 40px #77777710"
                                }}
                                    netImage={{
                                        update: {
                                            command: "getIcon",
                                            file: realmImage,
                                            waiting: { url: "/Images/spinning.gif", style: { filter: "invert(100%)" } },
                                            error: { url: "/Images/icons/cloud-offline-outline.svg", style: { filter: "invert(100%)" } },

                                        },
                                       
                                        backgroundColor: "#171717",
                                        opacity: 1,
                                       
                                        scale: .8
                                    }}
                                />
                            </div>
                        )


                    }
                });
                setRealmQuickBarItems(tmp)
            } else {
                setRealmQuickBarItems([])
            }
        } else {
            setRealmQuickBarItems([])
        }

    }, [quickBar, realms, currentRealmID, showIndex,])
 */
    

 


    return (
        <>

        {/*showIndex == -1 &&

                <LoadingPage onComplete={"/"} state={undefined} />
            */}

            {showIndex == 1 &&
                <LoginPage />
            }
            {showIndex == 2 &&
                <WelcomePage />
            }
            {showIndex == 3 &&
                <ContactsPage />
            }
            {showIndex == 4 &&
                <HomePage />
            }
            {showIndex == 5 &&
                <RecoverPasswordPage />
            }
            {showIndex == 6 &&
               <AppsPage />
            }
      
            
          
            
            {(showMenu) &&
                <div style={{ position: "fixed", top: 0, left: 0, height: pageSize.height, width: 85, backgroundImage: "linear-gradient(to bottom, #000000,#20232570)" }}>
                    <div style={{ display: "flex", flexDirection: "column", height: pageSize.height, fontFamily: "WebPapyrus" }}>

                        <div style={{ flex: 1 }}>



                            <div onClick={(e) => {

                                navigate("/contacts")


                            }} style={{ outline: 0 }} className={directory == "/contacts" ? styles.menuActive : styles.menu__item} about="Arcturus Network" >
                                <img src="/Images/logo.png" width={50} height={50} />
                            </div>

          
                            {appList}
                        </div>

                        <div style={{ flex: 0.1 }}>

                            <NavLink style={{opacity:.6, outline: 0 }} className={location.pathname == "/apps" ? styles.menuActive : styles.menu__item} about="Apps"
                                to={'/apps'}>
                                <ImageDiv width={60} height={60} netImage={{ image: "/Images/icons/apps-outline.svg", filter: "invert(100%)", scale: .6 }} />
                            </NavLink>



                            <NavLink style={{ outline: 0 }} className={directory == "/home" ? styles.menuActive : styles.menu__item} about={user.userName}
                                to={'/home'}>
                                <ImageDiv width={60} height={60}   netImage={{
                                    image: "", filter: "", scale:.8, update: {
                                        command: "getIcon",
                                        file: user.image,
                                        waiting: { url: "/Images/spinning.gif", style: { filter: "invert(100%)" } },
                                        error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                                    },
                                       }} />
                            </NavLink>

                        </div>
                    </div>
                </div>

            }
            {openApp}
            <div style={{ 
                position: "fixed", right: 0, display: "flex", alignItems: "center", boxShadow: "0 0 10px #ffffff10, 0 0 10px #ffffff40, inset 0 0 2px #77777740",
             
                backgroundImage: "linear-gradient(to top, black, #cccccc30)",
            }}>
              

                 
                    <div style={{ display: "flex", alignItems: "center", marginLeft:5  }}>
                        {!loadingComplete && user.userID > 0 &&
                            < div style={{ paddingLeft: 5, paddingRight: 5 }} >
                        <ImageDiv width={20} height={20} netImage={{ backgroundImage: "radial-gradient(#000000 30%, #ffffff 98%)", image: "/Images/icons/hourglass-outline.svg", filter: "invert(100%)" }} />
                            </div>
                   
                        }
                        <LoadingStatusBar />
                        {location.pathname != "/" && location.pathname != "/login" &&
                            <BackUp />
                        }
                        {user.userID > 0 &&
                           <>
                                <PeerNetworkHandler />

                                <FileHandler />
                               <StorageHandler />
                                <ContactsHandler />
                            </>
                        }
               
                        <SocketHandler /> 
                   
                        {user.userID &&
                        
                            <ProfileButton onProfileClick={onProfileClick} user={user}/>
                        }
                    </div>
                    <div style={{ height: 1 }}>&nbsp;</div>
              
        
             
                { user.userID > 0 &&
                <>
                <SystemMessagesMenu />
                   
                    </>
                }
            </div>

        </>
    )

}

export default HomeMenu;

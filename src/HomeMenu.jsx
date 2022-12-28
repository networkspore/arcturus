import useZust from "./hooks/useZust";
import React, { useEffect, useState, useId } from "react";
import styles from './pages/css/ContentMenu.module.css';
import { NavLink, useHref, useLocation, useNavigate } from "react-router-dom";

import produce from "immer";
import LoginPage from "./pages/LoginPage"
import WelcomePage from "./pages/WelcomePage";
import { ContactsPage } from "./pages/ContactsPage";
import { HomePage } from "./pages/HomePage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";
import { RealmsPage } from "./pages/RealmsPage";

import { SystemMessagesMenu } from "./handlers/SystemMessagesMenu";
import { get, update, set } from "idb-keyval";

import { ImageDiv } from "./pages/components/UI/ImageDiv";

import { PeerNetworkHandler } from "./handlers/PeerNetworkHandler";
import { FileHandler } from "./handlers/FileHandler";


import { LoadingPage } from "./LoadingPage";

import { getFileInfo, getPermission, readFileJson, getPermissionAsync, getJsonFile } from "./constants/utility";
import { firstSetup, initDirectory, initStorage } from "./constants/systemMessages";
import { Realm } from "./pages/realm/Realm";
import { useRef } from "react";

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { SocketHandler } from "./handlers/socketHandler";
import { StorageHandler } from "./handlers/StorageHandler";
import { ContactsHandler } from "./handlers/ContactsHandler";
import { fileTypes, MB } from "./constants/constants";


const createWorker = createWorkerFactory(() => import('./constants/utility'));



const HomeMenu = () => {
    const worker = useWorker(createWorker)

    const location = useLocation()

    const userLoaded = useRef({value:false})

    const setLoadingStatus = useZust((state) => state.setLoadingStatus)
    const setCacheDirectory = useZust((state) => state.setCacheDirectory)
    const setRealmsDirectory = useZust((state) => state.setRealmsDirectory);

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


    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const [showMenu, setShowMenu] = useState(false)

    const navigate = useNavigate();
    const pageSize = useZust((state) => state.pageSize);

    const user = useZust((state) => state.user);


    const configFile = useZust((state) => state.configFile)
    const setConfigFile = useZust((state) => state.setConfigFile)
    const setRealms = useZust((state) => state.setRealms)

    const addSystemMessage = useZust((state) => state.addSystemMessage)


    const toNav = useNavigate()
    const currentRealmID = useZust((state) => state.currentRealmID)
    const setCurrentRealmID = useZust((state) => state.setCurrentRealmID)


    const [showIndex, setShowIndex] = useState(false);


    //const connected = useZust((state)=>state.connected)
    //const setConnected = useZust((state) => state.setConnected)

    const localDirectory = useZust((state) => state.localDirectory)



    const setLocalDirectory = useZust((state) => state.setLocalDirectory)

    const [directory, setDirectory] = useState("")

    const setPage = useZust((state) => state.setPage)

    const realms = useZust((state) => state.realms)

    const setQuickBar = useZust((state) => state.setQuickBar)
    const quickBar = useZust((state) => state.quickBar)

    const [onComplete, setOnComplete] = useState("/contacts")
    const [loadState, setLoadState] = useState(null)
    const [realmQuickBarItems, setRealmQuickBarItems] = useState(null)

    useEffect(() => {
        let currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        currentLocation = secondSlash == -1 ? currentLocation : currentLocation.slice(0, secondSlash)

        setDirectory(currentLocation)


        if (user.userID > 0) {

            if (currentLocation == '/') {
                if (location.state != undefined && location.state.loadUser != undefined) loadUser(location.state.loadUser)
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
                    case "/realms":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(6);
                        break;
                    case "/realm":
                        if (location.pathname.length > 5) {
                            if (!showMenu) setShowMenu(true)
                        } else {
                            if (showMenu) setShowMenu(false)
                        }

                        setShowIndex(7);

                        break;
                    case "/loading":
                       
                        setLoadState(location.state)
                        setShowIndex(-1)
                        setPage(null)
                        setShowMenu(false)
                  
                        break;

                    default:

                        navigate('/contacts')

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

    

    useEffect(() => {

        if (user.userID > 0 ) {
          
            if ( !userLoaded.current.value){
                setIdbArray().then(((value)=>{
                    navigate("/", {state:{loadUser:user}})
                }))
            }
          

            
            //.then((returned)=>{

               // if(!returned) navigate("/")
           // })
          
        

        }
        
    }, [user])

   

    async function setIdbArray(){


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
    }

    async function loadUser(user){

        try {
            const value = await get("localDirectory" + user.userID)
            const verified = await getPermissionAsync(value.handle)
           
            if(!verified)
            {
                console.log("Permission not granted")
                return false
            } 

            setLocalDirectory(value)

            const homeHandle = await value.handle.getDirectoryHandle("home", { create: true })
            const userHomeHandle = await homeHandle.getDirectoryHandle(user.userName, { create: true }) 
            const cacheDirectory = await userHomeHandle.getDirectoryHandle("cache", {create:true})

            setCacheDirectory({name:"cache", handle:cacheDirectory})

            const handle = await userHomeHandle.getFileHandle(user.userName + ".storage.config")

            const fileInfo = await getFileInfo(handle, userHomeHandle)

         
            setSocketCmd({
                cmd: "checkStorageHash", params: { hash: fileInfo.hash }, callback: (hashResult) => {
               
                    if ("success" in hashResult && hashResult.success) {
                        readFileJson(handle).then((jsonResult) => {
                            
                            if ("success" in jsonResult && jsonResult.success) {
                                const json = jsonResult.value;
                                fileInfo.value = json[user.userName];
                                fileInfo.fileID = hashResult.fileID;
                                fileInfo.storageID = hashResult.storageID;
                                setConfigFile(fileInfo)
                               // navigate("/loading", { state: { configFile: fileInfo, navigate: "/" } })
                                return true
                            } else {
                                console.log("Permission not granted")
                                addSystemMessage(initStorage)
                                return false
                            }
                            
                        })
                    } else {
                        console.log("Hash check failed")
                      
                        return false
                    }
                    
                }
            })
            
        }catch(err){

            console.log(err.message)
         
            return false
        }                 
    }


    useEffect(() => {
       
        if (user.userID > 0 && configFile.value != null) {
            const config = configFile.value;
            console.log("settingDefaults")
            setFolderDefaults(config).then((promise) => {

                if (promise == true) {
                   
                    setSocketCmd({
                        cmd: "getRealms", params: {}, callback: (response) => {
                            if (!("error" in response)) {
                                if (response.success) {
                                    setRealms(response.realms)
                                }
                            }
                        }
                    })


                //    navigate(onComplete)
                } else {
                    addSystemMessage(initStorage)
                    navigate("/home/localstorage/")
                }
            })

        } 

    }, [configFile, user])

    useEffect(()=>{
       
    }, [configFile])

    useEffect(()=>{
        if(realms != null && realms.length > 0){
            setQuickBarDefaults()

        }else{
            setQuickBar([])
        }
    },[user, realms])



    const setQuickBarDefaults = () => {

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

    }

    async function getUserConfig(configFileHandle){
        return await getJsonFile(userConfigHandle)
    }

    async function setDefaultUserConfig(userHomeHandle){
        const defaultConfig = {
            
        }
    }

   


    //const addFiles = useZust((state) => state.addFiles)


    async function setFolderDefaults(config) {
        
            try {
                
             

                const realmsHandle = await localDirectory.handle.getDirectoryHandle("realms", { create: true });

                const imageHandle =  await localDirectory.handle.getDirectoryHandle("images", { create: true }) 
                const modelsHandle = await localDirectory.handle.getDirectoryHandle("models", { create: true }) 
                const mediaHandle = await localDirectory.handle.getDirectoryHandle("media", { create: true }) 
                const audioHandle = await mediaHandle.getDirectoryHandle("audio", {create:true})   
                const videoHandle = await mediaHandle.getDirectoryHandle("video", { create: true })
                const assetsHandle = await localDirectory.handle.getDirectoryHandle("assets", {create: true})
                const typesHandle = await assetsHandle.getDirectoryHandle("types", { create: true })
                const pcsHandle = await assetsHandle.getDirectoryHandle("pcs", { create: true })
                const npcsHandle = await assetsHandle.getDirectoryHandle("npcs", { create: true })
                const placeablesHandle = await assetsHandle.getDirectoryHandle("placeables", { create: true })
                const texturesHandle = await assetsHandle.getDirectoryHandle("textures", { create: true })
                const terrainHandle = await assetsHandle.getDirectoryHandle("terrain", { create: true })


                
                const images = await worker.getFirstDirectoryAllFiles(imageHandle);
           
                const models = await worker.getFirstDirectoryAllFiles(modelsHandle);
              
                const audio = await worker.getFirstDirectoryAllFiles(audioHandle);
          
                const video = await worker.getFirstDirectoryAllFiles(videoHandle);
             
               
                const types = await worker.getFirstDirectoryAllFiles(typesHandle)
              
                const pcs = await worker.getFirstDirectoryAllFiles(pcsHandle)
           
                const npcs = await worker.getFirstDirectoryAllFiles(npcsHandle)
             
                const placeables = await worker.getFirstDirectoryAllFiles(placeablesHandle)
           
                const textures = await worker.getFirstDirectoryAllFiles(texturesHandle)
                
                const terrain = await worker.getFirstDirectoryAllFiles(terrainHandle)
           
                let allFiles = []

                images.files.forEach(entry => {
                   allFiles.push(entry)
                });

                models.files.forEach(entry => {
                    allFiles.push(entry)
                });
                audio.files.forEach(entry => {
                    allFiles.push(entry)
                });
                video.files.forEach(entry => {
                
                    allFiles.push(entry)
                });
                pcs.files.forEach(entry => {
                    allFiles.push(entry)
                });
                placeables.files.forEach(entry => {
                    allFiles.push(entry)
                });
                textures.files.forEach(entry => {
                    allFiles.push(entry)
                });
                terrain.files.forEach(entry => {
                    allFiles.push(entry)
                });
              
                setAssetsDirectory({ name: "assets", handle: assetsHandle })

                setTypesDirectory({ name: "types", handle: typesHandle, directories: types.directories })
              

                setPcsDirectory({ name: "pcs", handle: pcsHandle, directories: pcs.directories })
               
                setNpcsDirectory({ name: "npcs", handle: npcsHandle, directories: npcs.directories })
              

                setTexturesDirectory({ name: "textures", handle: texturesHandle, directories: textures.directories })
               

                setPlaceablesDirectory({ name: "placeables", handle: placeablesHandle, directories: placeables.directories })
              

                setTerrainDirectory({ name: "terrain", handle: terrainHandle, directories: terrain.directories })
        
            
                setImagesDirectory({ name: imageHandle.name, handle: imageHandle, directories: images.directories })
              

                setModelsDirectory({ name: modelsHandle.name, handle: modelsHandle, directories: models.directories })
             
        
                setRealmsDirectory({ name: realmsHandle.name, handle: realmsHandle, directories: realms.directories })
            
                setMediaDirectory({ name: mediaHandle.name, handle: mediaHandle})

                setAudioDirectory({ name: audioHandle.name, handle: audioHandle, directories:audio.directories })
            

                setVideoDirectory({ name: videoHandle.name, handle: videoHandle, directories: video.directories })
            
        
              

               if(allFiles.length > 0) {
                    await checkAllFiles(allFiles)
                   
                    return true
                }else{
                    return false
                }

            } catch (err) {
                console.log(err)
                return false
            } 
        
       
    }

   
    const checkAllFiles = (allFiles = []) =>{
        return new Promise(resolve => {
            let i = 0;
            get("arc.cacheFile").then((idbCacheArray)=>{
                
                const isArray = Array.isArray(idbCacheArray)
                const noCache = (isArray && idbCacheArray.length == 0) || !isArray
                let newCache = []
                userLoaded.current.value = true
                const loading = userLoaded.current.value

                async function checkFilesRecursive(){
                    if (loading != userLoaded.current.value) {
                        return false
                    }
                    const entry = allFiles[i].handle
                    const directory = allFiles[i].directory
                    
                    const name = await entry.name
                    setLoadingStatus({ name: name, hash: "", index: i, length: allFiles.length, complete: false })
        
                    if(noCache)
                    {
             
                        const newFileInfo = await worker.getFileInfo(entry, directory)
                       

                        const contains =  (newCache.findIndex(c => c.hash == newFileInfo.hash) != -1)

                        if(!contains) newCache.push(newFileInfo)
                       
                        i = i + 1
                        await set("arc.cacheFile", newCache)
                        setLoadingStatus({ name: name, hash: newFileInfo.hash, index: i, length: allFiles.length, complete: true })
                        if (i < allFiles.length) {
                           
                            checkFilesRecursive()
                        } else {
                            
                            resolve(true)
                        }
                    }else{
                       
                        const index = await worker.asyncFind(idbCacheArray, async item => {
                            return await entry.isSameEntry(item.handle);
                        })
                    
                        if (index != undefined) {
                            const item = idbCacheArray[index]
                            
                            const hasDimensions = item.mimeType == "image"

                            let newItem = {
                                width: hasDimensions ? item.width : undefined, 
                                height: hasDimensions ? item.height : undefined, 
                                application: item.application, 
                                loaded: true, 
                                directory: item.directory, 
                                mimeType: item.mimeType, 
                                name: item.name, 
                                hash: item.hash, 
                                size: item.size, 
                                type: item.type, 
                                lastModified: item.lastModified,
                                handle: item.handle 
                            }
                            
                            idbCacheArray[index] = newItem

                            await set("arc.cacheFile", idbCacheArray)
                                
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
                                
                                resolve(true)
                            }
                       
                                    
                            
                        }else{
                            const newFileInfo = await worker.getFileInfo(entry, directory)
                        
                            idbCacheArray.push(newFileInfo) 
                           
                            await set("arc.cacheFile", idbCacheArray)

                           

                            i = i + 1
                            setLoadingStatus({ name: name, hash: newFileInfo.hash, index: i, length: allFiles.length, complete: true })
                            if (i < allFiles.length) {
                                checkFilesRecursive()
                            } else {
                                
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

    useEffect(() => {
    
        if (showMenu && realms != null && realms.length > 0) {
            const tmp = []
            if (quickBar != undefined && quickBar != null && quickBar.length > 0) {
                console.log(quickBar)
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



    return (
        <>

            {showIndex == -1 &&

                <LoadingPage onComplete={onComplete} state={loadState} />
            }

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
                <RealmsPage />
            }
            {showIndex == 7 &&

                <Realm />
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

                            {realmQuickBarItems}

                        </div>

                        <div style={{ flex: 0.1 }}>

                            <NavLink style={{ outline: 0 }} className={location.pathname == "/realms" ? styles.menuActive : styles.menu__item} about="Realms"
                                to={'/realms'}>
                                <ImageDiv width={60} height={60} netImage={{ image: "/Images/realm.png", filter: "invert(100%)", scale: .75 }} />
                            </NavLink>



                            <NavLink style={{ outline: 0 }} className={directory == "/home" ? styles.menuActive : styles.menu__item} about={user.userName}
                                to={'/home'}>
                                <ImageDiv width={60} height={60}   netImage={{
                                    image: "/Images/icons/person.svg", filter: "invert(100%)", scale:.8, update: {
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
           
            <div style={{
                position: "fixed", top: 0, right: 0, display: "flex", alignItems: "center",  height: 35, backgroundColor: "black",
            }}>
                <div style={{ display: "flex", }}>

                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer", backgroundColor: "black" }} >
                        {location.pathname != "/loading" &&
                        <div onClick={onProfileClick} >
                            <ImageDiv width={30} height={30} netImage={{
                                image: "/Images/icons/person.svg", filter: "invert(100%)", scale: .9, update: {
                                    command: "getIcon",
                                    file: user.image,
                                    waiting: { url: "/Images/spinning.gif", style: { filter: "invert(100%)" } },
                                    error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                                },
                            }} />
                                  
                        </div>
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
                   
                        {location.pathname != "/loading" &&
                        <div onClick={onProfileClick} style={{
                            fontFamily: "WebPapyrus",
                            color: "#c7cfda",
                            fontSize: "16px",
                            paddingTop: "5px",
                            paddingLeft: "10px",
                            paddingRight: "15px",
                            whiteSpace: "nowrap"
                        }}> {user.userID > 0 ? user.userName : "Log In"}</div>
                     
                        }
                    </div>

                </div>
                { user.userID > 0 &&
                <SystemMessagesMenu />
                }
            </div>

        </>
    )

}

export default HomeMenu;

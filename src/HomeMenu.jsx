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


const createWorker = createWorkerFactory(() => import('./constants/utility'));



const HomeMenu = () => {
    const worker = useWorker(createWorker)

    const location = useLocation()


    const setCachesDirectory = useZust((state) => state.setCachesDirectory)
    const setRealmsDirectory = useZust((state) => state.setRealmsDirectory);

    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setModelsDirectory = useZust((state) => state.setModelsDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);

    const setCacheFiles = useZust((state) => state.setCacheFiles)
    const setImagesFiles = useZust((state) => state.setImagesFiles)
    const setModelsFiles = useZust((state) => state.setModelsFiles)

    const setMediaFiles = useZust((state) => state.setMediaFiles)

    const setAssetsDirectory = useZust((state) => state.setAssetsDirectory)
    const setPcsDirectory = useZust((state) => state.setPcsDirectory)
    const setNpcsDirectory = useZust((state) => state.setNpcsDirectory)
    const setTexturesDirectory = useZust((state) => state.setTexturesDirectory)
    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory)
    const setPlaceablesDirectory = useZust((state) => state.setPlaceablesDirectory)
    const setTypesDirectory = useZust((state) => state.setTypesDirectory)

    const setTypesFiles = useZust((state) => state.setTypesFiles)
    const setPlaceablesFiles = useZust((state) => state.setPlaceablesFiles)
    const setPcsFiles = useZust((state) => state.setPcsFiles)
    const setNpcsFiles = useZust((state) => state.setNpcsFiles)
    const setTexturesFiles = useZust((state) => state.setTexturesFiles)
    const setTerrainFiles = useZust((state) => state.setTerrainFiles)

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
    const setFiles = (value) => useZust.setState(produce((state) => {
        state.files = value;
    }))

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

        if (user.userID > 0) {

            loadUser(user).then((returned)=>{

                if(!returned) navigate("/")
            })
       
        

        }
    }, [user])

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

                                navigate("/loading", { state: { configFile: fileInfo, navigate: "/" } })
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


                    navigate(onComplete)
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

   




    async function setFolderDefaults(config) {
        const engineKey = config.engineKey;

        try {
            const cacheHandle =  await localDirectory.handle.getDirectoryHandle("cache", { create: true });

            const caches = await worker.getFirstDirectoryAllFiles(cacheHandle)


            const imageHandle = config.folders.images.default ? await localDirectory.handle.getDirectoryHandle("images", { create: true }) : await get("images" + engineKey);
            const images = await worker.getFirstDirectoryFiles(imageHandle, "image", config.folders.images.fileTypes);



            const modelsHandle = config.folders.models.default ? await localDirectory.handle.getDirectoryHandle("models", { create: true }) : await get("models" + engineKey);

            const models =  await worker.getFirstDirectoryFiles(modelsHandle, "model", config.folders.models.fileTypes) ;


            const realmsHandle =  await localDirectory.handle.getDirectoryHandle("realms", { create: true });

            const mediaHandle = config.folders.media.default ? await localDirectory.handle.getDirectoryHandle("media", { create: true }) : await get("media" + engineKey);

            const media = await worker.getFirstDirectoryFiles(mediaHandle, "media", config.folders.media.fileTypes);
            
            const assetsHandle = await localDirectory.handle.getDirectoryHandle("assets", {create: true})
           

            const typesHandle = await assetsHandle.getDirectoryHandle("types", { create: true })
            const types = await worker.getFirstDirectoryFiles(typesHandle, "arctype", ["arctype"])

            const pcsHandle = await assetsHandle.getDirectoryHandle("pcs", { create: true })
            const pcs = await worker.getFirstDirectoryFiles(pcsHandle, "arcpc", ["arcpc"])

            const npcsHandle = await assetsHandle.getDirectoryHandle("npcs", { create: true })
            const npcs = await worker.getFirstDirectoryFiles(npcsHandle, "arcnpc", ["arcnpc"])

            const placeablesHandle = await assetsHandle.getDirectoryHandle("placeables", { create: true })
            const placeables = await worker.getFirstDirectoryFiles(placeablesHandle, "arcpl", ["arcpl"])

            const texturesHandle = await assetsHandle.getDirectoryHandle("textures", { create: true })
            const textures = await worker.getFirstDirectoryFiles(texturesHandle, "arctex", ["arctex"])

            const terrainHandle = await assetsHandle.getDirectoryHandle("terrain", { create: true })
            const terrain = await worker.getFirstDirectoryFiles(terrainHandle, "arcterr", ["arcterr"])

           
            setAssetsDirectory({ name: "assets", handle: assetsHandle })

            setTypesDirectory({ name: "types", handle: typesHandle, directories: types.directories })
            setTypesFiles(types.files)

            setPcsDirectory({ name: "pcs", handle: pcsHandle, directories: pcs.directories })
            setPcsFiles(pcs.files)

            setNpcsDirectory({ name: "npcs", handle: npcsHandle, directories: npcs.directories })
            setNpcsFiles(npcs.files)

            setTexturesDirectory({ name: "textures", handle:texturesHandle, directories: textures.directories })
            setTexturesFiles(textures.files)

            setPlaceablesDirectory({ name: "placeables", handle: placeablesHandle, directories: placeables.directories })
            setPlaceablesFiles(placeables.files)
        

            setTerrainDirectory({ name: "terrain", handle: terrainHandle, directories: terrain.directories })
            setTerrainFiles(terrain.files)
          
            setCachesDirectory({name: "cache", handle: cacheHandle, directories: caches.directories})
            setCacheFiles(caches.files)
           
          
            setImagesDirectory({ name: imageHandle.name, handle: imageHandle, directories: images.directories })
            setImagesFiles(images.files)

        

            setModelsDirectory({ name: modelsHandle.name, handle: modelsHandle, directories: models.directories })
            setModelsFiles(models.files)
    
            setRealmsDirectory({ name: realmsHandle.name, handle: realmsHandle })
        
            setMediaDirectory({ name: mediaHandle.name, handle: mediaHandle, directories: media.directories })
            setMediaFiles(media.files)
         


        } catch (err) {
            console.log(err)
            return false
        }
        return true;
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

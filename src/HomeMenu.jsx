import useZust from "./hooks/useZust";
import React, { useEffect, useState } from "react";
import styles from './pages/css/ContentMenu.module.css';
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import produce from "immer";
import LoginPage from "./pages/LoginPage"
import WelcomePage from "./pages/WelcomePage";
import { NetworkPage } from "./pages/NetworkPage";
import { HomePage } from "./pages/HomePage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";
import { RealmsPage } from "./pages/RealmsPage";

import { SystemMessagesMenu } from "./SystemMessagesMenu";
import { get, update, set } from "idb-keyval";

import { ImageDiv } from "./pages/components/UI/ImageDiv";

import { PeerNetworkHandler } from "./handlers/PeerNetworkHandler";
import { FileHandler } from "./handlers/FileHandler";


import { LoadingPage } from "./LoadingPage";

import { getFileInfo, getPermission, readFileJson, getPermissionAsync } from "./constants/utility";
import { firstSetup, initDirectory, initStorage } from "./constants/systemMessages";
import { Realm } from "./pages/realm/Realm";
import { useRef } from "react";

import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { SocketHandler } from "./handlers/socketHandler";
import { useId } from "react";

 const createWorker = createWorkerFactory(() => import('./constants/utility'));



const HomeMenu = ({ props}) => {
    const worker = useWorker(createWorker)

    const location = useLocation()
    const userPeerID = useZust((state) => state.userPeerID)


    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory);
    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setModelsDirectory = useZust((state) => state.setModelsDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);

    const setImagesFiles = useZust((state) => state.setImagesFiles)
    const setModelsFiles = useZust((state) => state.setModelsFiles)
    const setTerrainFiles = useZust((state) => state.setTerrainFiles)
    const setMediaFiles = useZust((state) => state.setMediaFiles)


    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const [showMenu, setShowMenu] = useState(false) 
 
    const navigate = useNavigate();
    const pageSize = useZust((state) => state.pageSize);

    const user = useZust((state) => state.user);
 

    const configFile = useZust((state) => state.configFile)

    const setRealms = useZust((state)=> state.setRealms)

    const addSystemMessage = useZust((state) => state.addSystemMessage)


    const toNav = useNavigate()
    const currentRealmID = useZust((state) => state.currentRealmID)
    const setCurrentRealmID = useZust((state) => state.setCurrentRealmID)
    const setConfigFile = useZust((state) => state.setConfigFile)

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

  
    const page = useZust((state) => state.page)

    const setQuickBar = useZust((state) => state.setQuickBar)
    const quickBar = useZust((state) => state.quickBar)

    const [onComplete, setOnComplete] = useState("/network")

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
                    case "/network":
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
                        if(location.pathname.length >  5){
                            if (!showMenu) setShowMenu(true)
                        }else{
                            if(showMenu) setShowMenu(false)
                        }
                        
                        setShowIndex(7);
                      
                        break;
                    case "/loading":

                        if(location.state != null)
                        {
                            setPage(null)
                            setShowMenu(false)
                            setShowIndex(-1)
                            if ("navigate" in location.state) {

                                setOnComplete(location.state.navigate)
                            }
                            if ("configFile" in location.state) {

                                setConfigFile(location.state.configFile)
                            }
                            

                        }else{
                            console.log(location.state)
                        }
                        break;

                    default:

                        navigate('/network')

                }
               
                

            }

        } else {
         

            switch (currentLocation) {
                case '/login':
                  
                    setShowIndex(1)
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
  
            setSocketCmd({cmd: "getRealms", params: {}, callback: (response) => {
                if(!("error" in response)){
                    if (response.success) {
                        setRealms(response.realms)
                    }
                }
            }})
      
        

            get("localDirectory" + user.userID).then((value) => {


                if (value != undefined) {
                    
                    getPermission(value.handle, (verified) =>{

                        if(verified){
                            setLocalDirectory(value)

                            value.handle.getFileHandle("arcturus.config").then((handle) => {
                             
                                if(handle != null && handle != undefined){
                                    getFileInfo(handle, value.handle).then((file)=>{


                                        setSocketCmd({
                                            cmd: "checkStorageCRC", params: { crc: file.crc }, callback: (callback) => {
                                            
                                            if("error" in callback)
                                            {
                                                addSystemMessage(initStorage)
                                                navigate("/network")
                                            }else{
                                                if(callback.success){
                                                    readFileJson(handle).then((jsonResult) => {
                                                        if ("error" in jsonResult) {
                                                            addSystemMessage(initStorage)
                                                            navigate("/network")
                                                        } else {
                                                            if (jsonResult.success) {
                                                                const json = jsonResult.value;
                                                                file.value = json[user.userName];
                                                                file.fileID = callback.fileID;

                                                                if (!("error" in callback)) {
                                                                    file.fileID = callback.fileID;
                                                                    if (callback.success) {

                                                                        file.storageID = callback.storageID;


                                                                        navigate("/loading", { state: { configFile: file, navigate: "/network" } })

                                                                    } else {

                                                                        navigate("home/localstorage/init", { state: { configFile: file } })
                                                                    }
                                                                } else {


                                                                    addSystemMessage(initStorage)
                                                                    navigate("/network")
                                                                }
                                                            } else {
                                                              

                                                                addSystemMessage(initStorage)
                                                                navigate("/network")
                                                            }
                                                        }
                                                    })
                                                }else{
                                                    addSystemMessage(initStorage)
                                                    navigate("/network")
                                                }
                                            }
                                        }})

                                    }).catch((err) => {
                        
                                        addSystemMessage(initStorage)
                                        navigate("/network")
                                    })
                                }
                            }).catch((err) => {
                   
                                addSystemMessage(initStorage)
                                navigate("/network")
                            })
                           
                        }else{
                            addSystemMessage(initDirectory)
                            navigate("/network")
                        }
                    })
                    
                } else {
          
                    addSystemMessage(firstSetup)
                    navigate("/network")
                }

            }).catch((reason) => {
                console.error(reason)
                addSystemMessage(initDirectory)
                navigate("/network")
            })
            
        }
    }, [user])


   

    useEffect(() => {

        if (user.userID > 0, configFile.value != null) {
            const config = configFile.value;

            setFolderDefaults(config).then((promise) => {
                
                if(promise == true){
                    setQuickBarDefaults(user.userID)
                    
                    navigate(onComplete)  
                }else{
                    addSystemMessage(initStorage)
                    navigate("/home/localstorage/")
                }    
            })

        }else{
            setQuickBar([]);
        }

    }, [configFile, user])


    const setQuickBarDefaults = (userID) => {

        const qbarIdbName = userID + ".arcquickBar";
 
        get(qbarIdbName).then((idbQuickBar)=>{
         

            if (idbQuickBar != undefined)
            {
          
                try {
                    const qBar = JSON.parse(idbQuickBar)

                    if (Array.isArray(qBar)) {
                        
                        setQuickBar(qBar);

                    } else {
                        console.log("Quick bar is corrupt")


                    }

                } catch (err) {
                    console.log(err)


                }
                
            }
        })
     
            
        
    }


    
    


    async function setFolderDefaults(config) {
        const engineKey = config.engineKey;
    
        try{
            const imageHandle = config.folders.images.default ? await localDirectory.handle.getDirectoryHandle("images", { create: true }) : await get("images" + engineKey);

            const granted = await getPermissionAsync(imageHandle)
            


            const images = granted ?  await worker.getFirstDirectoryFiles(imageHandle, "image", config.folders.images.fileTypes) : null;

            

            const modelsHandle =  config.folders.models.default ? await localDirectory.handle.getDirectoryHandle("models", { create: true }) : await get("models" + engineKey);

            const modelsGranted = await getPermissionAsync(modelsHandle)


            const models = modelsGranted ? await worker.getFirstDirectoryFiles(modelsHandle, "model", config.folders.models.fileTypes) : null;
            

            const terrainHandle = config.folders.terrain.default ? await localDirectory.handle.getDirectoryHandle("terrain", { create: true }) : await get("terrain" + engineKey);

            const terrainGranted = await getPermissionAsync(terrainHandle)


            const terrain = terrainGranted ? await worker.getFirstDirectoryFiles(terrainHandle,"terrain", config.folders.terrain.fileTypes) : null;
            
            const mediaHandle = config.folders.media.default ? await localDirectory.handle.getDirectoryHandle("media", { create: true }) : await get("media" + engineKey);

            const mediaGranted = await getPermissionAsync(mediaHandle)


            const media = mediaGranted ? await worker.getFirstDirectoryFiles(mediaHandle,"media", config.folders.media.fileTypes) : null;

        
            
            if (images != null) {
                setImagesDirectory({ name: imageHandle.name, handle: imageHandle, directories: images.directories })
                setImagesFiles(images.files)

            }
            if(models != null )
            {
                setModelsDirectory({ name: modelsHandle.name, handle: modelsHandle, directories: models.directories })
                setModelsFiles(models.files)
            }
            if (terrain != null) {
                setTerrainDirectory({ name: terrainHandle.name, handle: terrainHandle, directories: terrain.directories })
                setTerrainFiles(terrain.files)
            }
            if (media != null) {
                setMediaDirectory({ name: mediaHandle.name, handle: mediaHandle, directories: media.directories })
                setMediaFiles(media.files)
            }
        }catch(err){
            console.log(err)
            return false
        }
        return  true;
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
    
   

    function onProfileClick(e){
      
        
        toNav("/home")
      
    }




    

    const homeMenuID = useId()

    useEffect(()=>{
        if(showMenu && realms != null && realms.length > 0 )
        {
            const tmp = []
            if(quickBar != undefined && quickBar != null){
                for(let i = 0; i < quickBar.length ; i ++ ){
                    const realmIndex = realms.findIndex(r => r.realmID == quickBar[i].realmID)
                    if(realmIndex != -1){
                        const realm = realms[realmIndex];
                        const iIcon = "icon" in realm.image ? realm.image.icon != null ? realm.image.icon : null : null;
                       
       
                         
                            tmp.push(
                                <div key={i} onClick={() => { 
                                    setCurrentRealmID(realm.realmID)
                                    navigate("/realm/gateway")
                                }} style={{ outline: 0 }} className={showIndex == 7 && currentRealmID == realm.realmID ? styles.menuActive : styles.menu__item} about={realm.realmName}>
                                    <ImageDiv width={60} height={60} 
                                        netImage={{ 
                                            update: { 
                                                command: "getIcon", 
                                                file: realm.image,
                                                waiting: {url: "/Images/spinning.gif", style: { filter: "invert(100%)" }},
                                                error: {url:"/Images/icons/cloud-offline-outline.svg", style:{filter:"invert(100%)"}},

                                            }, 
                                            backgroundColor: "", 
                                            opacity: 1, 
                                            image: null,  
                                            scale: 1 
                                        }} 
                                    />
                                </div>
                            )

              
                    }
                }
                setRealmQuickBarItems(tmp)
            }else{
                setRealmQuickBarItems([])
            }
        }else{
            setRealmQuickBarItems([])
        }
        
    },[quickBar, realms, currentRealmID, showIndex])

    return (
        <>
          
        {
            showIndex == -1 &&

            <LoadingPage />
        }
            
       
        {showIndex == 1 &&
            <LoginPage  />
        }
        {showIndex == 2  &&
            <WelcomePage />
        }
        {showIndex == 3 &&
            <NetworkPage  />
        }
        {showIndex == 4 &&
            <HomePage  />
        }
        {showIndex == 5 &&
            <RecoverPasswordPage  />
        }
        {showIndex == 6 &&
            <RealmsPage />
        }
        { showIndex == 7 &&
           
            <Realm />
        }

       {(showMenu) &&
                <div style={{ position: "fixed", top: 0, left: 0, height: pageSize.height, width: 85, backgroundImage: "linear-gradient(to bottom, #000000,#20232570)" }}>
                    <div style={{ display: "flex", flexDirection: "column", height: pageSize.height, fontFamily: "WebPapyrus" }}>
                        
                        <div style={{ flex: 1 }}>

                          
                             
                                    <div onClick={(e)=>{
                                     
                                            navigate("/network")
                                      
                                        
                                    }} style={{outline:0}} className={directory == "/network" ? styles.menuActive : styles.menu__item} about="Arcturus Network" >
                                        <img src="/Images/logo.png" width={50} height={50} />
                                    </div>

                               {realmQuickBarItems}
                            
                        </div>

                        <div style={{ flex: 0.1 }}>
                            
                            <NavLink style={{ outline: 0 }} className={location.pathname == "/realms"  ? styles.menuActive : styles.menu__item} about="Realms"
                                to={'/realms'}>
                                <ImageDiv width={60} height={60} netImage={{ image: "/Images/realm.png", filter: "invert(100%)", scale: .75 }} /> 
                            </NavLink>
                         


                            <NavLink style={{ outline: 0 }} className={directory == "/home" ? styles.menuActive : styles.menu__item} about={user.userName}
                                to={'/home'}>
                                <ImageDiv width={60} height={60} netImage={{ image: "/Images/icons/person.svg", filter: "invert(100%)", scale:.75}} />
                            </NavLink>

                        </div>
                    </div>
                </div>

            }
            <div style={{
                position: "fixed", top: 0, right: 0, display:"flex", alignItems:"center", width: 200, height: 35, backgroundColor: "black",}}>
                <div style={{ display: "flex",  }}>

                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer", backgroundColor: "black" }} >
                        <div onClick={(e) => {
                            toNav("/network")
                        }}>
                            <ImageDiv width={30} height={30} netImage={{
                                image: user.userID > 0 ? "/Images/logo.png" : "/Images/logout.png", width:25, height:25, 
                                filter: userPeerID != "" ? "drop-shadow(0px 0px 3px #faa014)" : "" }} />
                        </div>
                        {user.userID > 0 &&
                            <>
                                <PeerNetworkHandler />
                        
                                <FileHandler />
                             
                            </>
                        }
                        <SocketHandler />
                        <div onClick={onProfileClick} style={{
                            fontFamily: "WebPapyrus",
                            color: "#c7cfda",
                            fontSize: "16px",
                            paddingTop: "5px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        }}> { user.userID > 0 ? user.userName : <div style={{ display: "flex" }}><div>Log</div><div style={{ width: "6px" }}>&nbsp;</div><div>In</div> </div>}</div>
                    </div>

                </div>
                    
                    <SystemMessagesMenu />
                    
            </div>
            
        </>
    )
    
}

export default HomeMenu;

/*
           
   <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="New Campaign" 
                to={'/home'}>
                <img src="Images/start.png" width={50} height={45} />
            </NavLink>
            <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="Explore Campaigns" 
                to={'/home'}>
                <img src="Images/explore.png" width={50} height={45} />
            </NavLink>
*/
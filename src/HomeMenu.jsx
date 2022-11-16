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
import { get } from "idb-keyval";

import { ImageDiv } from "./pages/components/UI/ImageDiv";

import { PeerNetworkHandler } from "./handlers/PeerNetworkHandler";
import { FileHandler } from "./handlers/FileHandler";


import { LoadingPage } from "./LoadingPage";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';

import { getFileInfo, getPermission, readFileJson, getPermissionAsync } from "./constants/utility";
import { firstSetup, initDirectory, initStorage } from "./constants/systemMessages";
import { Realm } from "./pages/Realm";


const createWorker = createWorkerFactory(() => import('./constants/utility'));




const HomeMenu = ({ props}) => {
   
    const location = useLocation()
    const peerOnline = useZust((state) => state.peerOnline)
    const setPeerOnline = useZust((state) => state.setPeerOnline)
    const setUser = useZust((state) => state.setUser)

    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory);
    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setObjectsDirectory = useZust((state) => state.setObjectsDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);

    const setImagesFiles = useZust((state) => state.setImagesFiles)
    const setObjectsFiles = useZust((state) => state.setObjectsFiles)
    const setTerrainFiles = useZust((state) => state.setTerrainFiles)
    const setMediaFiles = useZust((state) => state.setMediaFiles)

   

    const [showMenu, setShowMenu] = useState(false) 
 
    const navigate = useNavigate();
    const pageSize = useZust((state) => state.pageSize);

    const user = useZust((state) => state.user);
    const socket = useZust((state) => state.socket);

    const configFile = useZust((state) => state.configFile)

    const setRealms = useZust((state)=> state.setRealms)

    const addSystemMessage = (msg) => useZust.setState(produce((state) => {
        let found = false;
        if (state.systemMessages.length > 0 ){
            state.systemMessages.forEach(message => {
                if(message.id == msg.id)
                {
                    found = true;
                }
            });
        }
   
        if(!found){
            state.systemMessages.push(
                msg
            )
        }
    }))

    const campaigns = useZust((state) => state.campaigns)
    const [camps, setCamps] = useState([]);
    const toNav = useNavigate()
    const currentCampaign = useZust((state) => state.currentCampaign)

    const setConfigFile = useZust((state) => state.setConfigFile)

    const [showIndex, setShowIndex] = useState(false);

    
    //const connected = useZust((state)=>state.connected)
    //const setConnected = useZust((state) => state.setConnected)

    const localDirectory = useZust((state) => state.localDirectory)

    const setAutoLogin = useZust((state) => state.setAutoLogin)
    
    const socketOff = (value) => useZust.setState(produce((state)=>{
        state.socket.off(value)
    }))

    const socketOn = (value, listener) => useZust.setState(produce((state) => {
        state.socket.on(value, listener)
    }))

    const disconnectSocket = () => useZust.setState(produce((state) => {
        if(state.socket!= null){
            state.socket.disconnect();
        }
    }))

    const setSystemMessages = useZust((state)=> state.setSystemMessages)

    const logout = () => {
        setAutoLogin(false);
        setUser();
        setConfigFile();
        setSocket(null)
        setPeerOnline(false)
        setShowMenu(false)
        setSystemMessages([])
    }
    const setLocalDirectory = useZust((state) => state.setLocalDirectory)
    const setFiles = (value) => useZust.setState(produce((state) => {
        state.files = value;
    }))

    const setSocket = useZust((state) => state.setSocket)
    
    const [directory, setDirectory] = useState("")

    const setPage = useZust((state) => state.setPage)

    const [onComplete, setOnComplete] = useState("/network")

    useEffect(() => {
        let currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        currentLocation = secondSlash == -1 ? currentLocation : currentLocation.slice(0, secondSlash)

        setDirectory(currentLocation)


        if (user.userID > 0) {
           
            if (currentLocation == '/') {

                if (!showMenu) setShowMenu(true);
                
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
                        if(location.pathname == "/realm/gateway") {
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
                    setSocket(null)
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
           
            socketOff("disconnect")
            socketOn("disconnect", (res) => {
                switch (res) {
                    case "io server disconnect":
                        logout()
                        break;

                }
            })
            socket.emit("getRealms", (callback)=>{
                if(callback.success)
                {
                   setRealms(callback.realms)
                }
            })

            get("localDirectory" + user.userID).then((value) => {


                if (value != undefined) {
                    
                    getPermission(value.handle, (verified) =>{

                        if(verified){
                            setLocalDirectory(value)

                            value.handle.getFileHandle("arcturus.config").then((handle) => {
                                
                                getFileInfo(handle, value.handle).then((file)=>{


                                    socket.emit("checkStorageCRC", file.crc, (callback) => {

                                        readFileJson(handle, (json) => {
                                            if (json.success) {
                                                const config = json.value;
                                                file.value = config;
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
                                                console.log(err)
                                                addSystemMessage(initStorage)
                                                navigate("/network")
                                            }
                                        })

                                    })

                                }).catch((err) => {
                                    console.log(err)
                                    addSystemMessage(initStorage)
                                    navigate("/network")
                                })
                            }).catch((err) => {
                                console.log(err)
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

    const setQuickBar = useZust((state) => state.setQuickBar)
    const quickBar = useZust((state) => state.quickBar)

    useEffect(() => {

        if (configFile.value != null) {
            const config = configFile.value;

            setFolderDefaults(config).then((promise) => {
                
                setQuickBarDefaults()
                
                navigate(onComplete)  
               
            })

        }else{
            setQuickBar([]);
        }

    }, [configFile])


    const setQuickBarDefaults = () => {
       console.log("gettingQuickBarDefaults")
        socket.emit("getQuickBar", (callback) => {
            if ("error" in callback) {
                console.log(callback.error)
            } else {
                if (callback.success) {
                    var tmpValue = callback.quickBar;
                    if (tmpValue != null && tmpValue != "") {

                        try {
                            const tmpQBar = JSON.parse(tmpValue)

                            if (Array.isArray(tmpQBar)) {
                                setQuickBar(tmpQBar);
                             
                            } else {
                                console.log("Quick bar is corrupt")
                          
                               
                            }

                        } catch (err) {
                            console.log(err)
                          
                        
                        }
                    }
                }
            }
           
        })
  
    }



    const worker = useWorker(createWorker)
    

    const addImageFile = (file) => useZust.setState(produce((state)=>{
        state.imagesFiles.push(file)
    }))



    async function setFolderDefaults(config) {
        const engineKey = config.engineKey;
    
        
        const imageHandle = config.folders.images.default ? await localDirectory.handle.getDirectoryHandle("images", { create: true }) : await get("images" + engineKey);

        const granted = await getPermissionAsync(imageHandle)
        


        const images = granted ?  await worker.getFirstDirectoryFiles(imageHandle, "image", config.folders.images.fileTypes) : null;

        

        const objectsHandle = config.folders.objects.default ? await localDirectory.handle.getDirectoryHandle("objects", { create: true }) : await get("objects" + engineKey);

        const objectsGranted = await getPermissionAsync(objectsHandle)


        const objects = objectsGranted ? await worker.getFirstDirectoryFiles(objectsHandle, "model", config.folders.objects.fileTypes) : null;
        

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
        if(objects != null )
        {
            setObjectsDirectory({ name: objectsHandle.name, handle: objectsHandle, directories: objects.directories })
            setObjectsFiles(objects.files)
        }
        if (terrain != null) {
            setTerrainDirectory({ name: terrainHandle.name, handle: terrainHandle, directories: terrain.directories })
            setTerrainFiles(terrain.files)
        }
        if (media != null) {
            setMediaDirectory({ name: mediaHandle.name, handle: mediaHandle, directories: media.directories })
            setMediaFiles(media.files)
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

    




    const page = useZust((state)=>state.page)
   
   


    /*     <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="D&D" to={'/campaign'}>
                        <img src="Images/Campaign/1/logo.png" width={50} height={50} />
                    </NavLink>
                    */
    
   

    function onProfileClick(e){
      
        
        toNav("/home")
      
    }



    const [realmQuickBarItems, setRealmQuickBarItems] = useState(null)
    const addFileRequest = useZust((state) => state.addFileRequest)
    const realms = useZust((state) => state.realms)

    const updateRealmImage = (response) => useZust.setState(produce((state) => {
        const index = realms.findIndex(realm => realm.realmID == response.request.id);
        const image = index != -1 ? state.realms[index].image : null;

        if ("error" in response) {
            console.log('error')
        } else {

            if (index != -1) {
                const file = response.file;



                const fileProperties = Object.getOwnPropertyNames(file)

                fileProperties.forEach(property => {
                    image[property] = file[property];
                });
                image.loaded = true;

                if (index != -1) state.realms[index].image = image;
            }
        }
    }))


    useEffect(()=>{
        if(showMenu && realms != null && realms.length > 0 && peerOnline)
        {
            const tmp = []
            if(quickBar != undefined && quickBar != null){
                for(let i = 0; i < quickBar.length ; i ++ ){
                    const realmIndex = realms.findIndex(r => r.realmID == quickBar[i].realmID)
                    if(realmIndex != -1){
                        const realm = realms[realmIndex];
                        if (!("icon" in realm.image)) {

                            addFileRequest({ page: "homeMenu", id: realm.realmID, file: realm.image, callback: updateRealmImage })
                            tmp.push(

                                <div onClick={()=>{navigate("/realm/gateway", {state:{realm}})}} style={{ outline: 0 }} className={location.pathname == "/realm/gateway" ? styles.menuActive : styles.menu__item} about={realm.realmName}>
                                    <ImageDiv width={60} height={60} netImage={{opacity:.6, image: "/Images/spinning.gif", filter: "invert(100%)", scale: .75 }} />
                                </div>
                            )

                        } else {
                            if (realm.image.loaded) {
                                tmp.push(
                                    <div onClick={() => { navigate("/realm/gateway", { state: { realm } }) }} style={{ outline: 0 }} className={location.pathname == "/realm/gateway" && location.state.realm.realmName == realm.realmName ? styles.menuActive : styles.menu__item} about={realm.realmName}>
                                        <ImageDiv width={60} height={60} netImage={{ backgroundColor:"", opacity: 1, image: realm.image.icon,  scale: 1 }} />
                                    </div>
                                )
                            } else {
                                tmp.push(
                                    <div onClick={() => { navigate("/realm/gateway", { state: { realm } }) }} style={{ outline: 0 }} className={ location.pathname == "/realm/gateway" ? styles.menuActive : styles.menu__item} about={realm.realmName}>
                                        <ImageDiv width={60} height={60} netImage={{ opacity: .1, image: "/Images/icons/cloud-offline-outline.svg",  filter: "invert(90%)", scale: .4 }} />
                                    </div>
                                )
                            }
                        }
                    }else{
                        console.log("QuickBar realmID: " +quickBar[i].realmID + " not found in realms")
                    }
                }
                setRealmQuickBarItems(tmp)
            }
        }else{
            setRealmQuickBarItems([])
        }
    },[quickBar, realms, showMenu, location])

    return (
        <>
          
        {
            page == null &&

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
            <HomePage  logOut={logout}  />
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
                position: "fixed", top: 0, right: 0, height: 35, width:200,
                backgroundColor: "black"
            }}>
                <div style={{ display: "flex" }}>

                    <div style={{ paddingTop: "6px", display: "flex", cursor: "pointer", backgroundColor: "black" }} >
                        <div onClick={(e) => {
                            toNav("/network")
                        }}>
                            <ImageDiv width={30} height={30} netImage={{
                                image: socket != null && user.userID > 0 ? "/Images/logo.png" : "/Images/logout.png", width:25, height:25, 
                                filter: peerOnline ? "drop-shadow(0px 0px 3px #faa014)" : "" }} />
                        </div>
                        {user.userID > 0 &&
                            <>
                                <PeerNetworkHandler />
                        
                                <FileHandler />
                            </>
                        }
                        <div onClick={onProfileClick} style={{
                            fontFamily: "WebPapyrus",
                            color: "#c7cfda",
                            fontSize: "16px",
                            paddingTop: "5px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        }}> {socket != null && user.userID > 0 ? user.userName : <div style={{ display: "flex" }}><div>Log</div><div style={{ width: "6px" }}>&nbsp;</div><div>In</div> </div>}</div>
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
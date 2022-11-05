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
import { SystemMessagesMenu } from "./SystemMessagesMenu";
import { get } from "idb-keyval";

import { crc32FromArrayBuffer, getPermission, readFileJson } from "./constants/utility";
import { ImageDiv } from "./pages/components/UI/ImageDiv";
import { PeerNetworkHandler } from "./pages/PeerNetworkHandler";
import { ErgoNetworkHandler } from "./pages/ErgoNetworkHandler";
import { CreateRealmPage } from "./pages/CreateRealmPage";


const HomeMenu = ({ props}) => {
   
    const location = useLocation()
    const peerOnline = useZust((state) => state.peerOnline)

    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory);
    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setObjectsDirectory = useZust((state) => state.setObjectsDirectory);
    const setTexturesDirectory = useZust((state) => state.setTexturesDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);

    const setImagesFiles = useZust((state) => state.setImagesFiles)
    const setObjectsFiles = useZust((state) => state.setObjectsFiles)
    const setTexturesFiles = useZust((state) => state.setTextureFiles)
    const setTerrainFiles = useZust((state) => state.setTerrainFiles)
    const setMediaFiles = useZust((state) => state.setMediaFiles)

    const [showMenu, setShowMenu] = useState(false) 
 
    const navigate = useNavigate();
    const pageSize = useZust((state) => state.pageSize);

    const user = useZust((state) => state.user);
    const socket = useZust((state) => state.socket);




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
    const configFile = useZust((state) => state.configFile)
    const [showIndex, setShowIndex] = useState(false);

    
    const connected = useZust((state)=>state.connected)
    const setConnected = useZust((state) => state.setConnected)

    const localDirectory = useZust((state) => state.localDirectory)

    const setAutoLogin = useZust((state) => state.setAutoLogin)
    
    const socketOff = (value) => useZust.setState(produce((state)=>{
        state.socket.off(value)
    }))

    const socketOn = (value, listener) => useZust.setState(produce((state) => {
        state.socket.off(value, listener)
    }))

    const disconnectSocket = () => useZust.setState(produce((state) => {
        if(state.socket!= null){
            state.socket.disconnect();
            state.socket = null;
        }
    }))

    const logout = () => {
        setAutoLogin(false);
        setUser();
        disconnectSocket();

    }
    const setLocalDirectory = (value) => useZust.setState(produce((state) => {
        state.localDirectory = value;
    }))
    const setFiles = (value) => useZust.setState(produce((state) => {
        state.files = value;
    }))

    
    const [directory, setDirectory] = useState("")

    useEffect(() => {
        let currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        currentLocation  = secondSlash == -1 ? currentLocation : currentLocation.slice(0,secondSlash)

        setDirectory(currentLocation)

        if (user.userID > 0) {
            if (currentLocation == '/') {

                if (connected) {
                    navigate("/network")
                } else {
                    navigate('/home')
                }
            } else {
                const secondSlash = currentLocation.indexOf("/", 1)

                const rootDirectory = currentLocation.slice(0, secondSlash == -1 ? currentLocation.length : secondSlash)

                //  const subDirectory = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)




                switch (rootDirectory) {
                    case "/network":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(3)
                      
                        break;
                    case "/home":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(4);
                        break;
                    case "/createRealm":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(6);
                        break;

                    default:
                     
                        navigate('/network')
                
                }

            }

        } else {
            if (showMenu) setShowMenu(false)

            switch (currentLocation) {
                case '/':
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
                    navigate("/")
                    break;
            }
        }



    }, [location, user, socket, connected])

    useEffect(() => {
        if (user.userID > 0) {

            socketOff("disconnect")
            socketOn("disconnect", (res) => {
                switch (res) {
                    case "io server disconnect":
                        break;

                }

                setConnected(false)

            })
            socketOff("connect")
            socketOn("connect", (res) => {
                setConnected(true)
            })

            const initDirectory = {
                id: 1,
                text: "Select local directory.",
                navigate: "/home/localstorage",
                netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
            }

            const initStorage = {
                id: 2,
                text: "Start storage engine.",
                navigate: "/home/localstorage/init",
                netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%" }
            }

            const firstSetup = {
                id: 0,
                text: "Welcome! Find more options on your home page.",
                navigate: "/home",
                netImage: { image: "/Images/icons/megaphone-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
            }


            get("localDirectory" + user.userID).then((value) => {


                if (value != undefined) {
                    
                    getPermission(value.handle, (verified) =>{

                        if(verified){
                            setLocalDirectory(value)

                            value.handle.getFileHandle("arcturus.config").then((handle) => {
                               
                                getFileInfo(handle).then((file)=>{
                                            console.log(file)
                                            readFileJson(handle, (json) => {
                                                if (json.success) {
                                                    const config = json.value;
                                                    if ("engineKey" in config) {
                                                        socket.emit("checkStorageCRC", file.crc, config.engineKey, (callback) => {
                                                            if (callback.valid) {
                                                                file.value = config;

                                                                setConfigFile(file)
                                                            } else {
                                                                console.log(file)
                                                                addSystemMessage(initStorage)
                                                            }
                                                        })
                                                    } else {
                                                        console.log(json)
                                                        addSystemMessage(initStorage)
                                                    }
                                                
                                        }else{
                                            console.log(err)
                                            addSystemMessage(initStorage)
                                        }
                                    })
                                    
                                }).catch((err) => {
                                    console.log(err)
                                    addSystemMessage(initStorage)
                                })
                               
                            }).catch((err) => {
                                console.log(err)
                                addSystemMessage(initStorage)
                            })
                           
                        }else{
                            addSystemMessage(initDirectory)
                        }
                    })
                    
                } else {
            
                    addSystemMessage(firstSetup)
                }

            }).catch((reason) => {
                console.error(reason)
                addSystemMessage(initDirectory)
            })
            
        }
    }, [user])






    

   

    useEffect(() => {
       
        setCamps(prev => []);
        campaigns.forEach((camp, i) => {
     
                    setCamps(prev => [...prev,(
                        <NavLink onClick={(e)=>{
                            
                            if (currentCampaign == camp[0]){ e.preventDefault();}else{
                                
                            }
                            
                        }} key={i} className={currentCampaign == camp[0] ? styles.menuActive : styles.menu__item} about={camp[1]} state={{ campaignID: camp[0], campaignName: camp[1], roomID: camp[3], adminID: camp[4] }} to={"/realm"}>
                            <div style={{width:"50px", height:"50px", borderRadius: "10px", overflow: "hidden" }}><img src={camp[2]} width={50} height={50} /></div>
                        </NavLink>
                    )])
         
        });
       
    },[campaigns,currentCampaign])


    const setFolderDefaults = (config) => {
        const engineKey = config.engineKey;

        if(localDirectory.handle != null){
            if (config.folders.images.default) {
                localDirectory.handle.getDirectoryHandle("images", { create: true }).then((handle) => {
                    
                    getDirectoryFiles(handle, config.folders.images.fileTypes).then((directoryFiles) => {
                        setImagesDirectory({ name: handle.name, handle: handle });
                        setImagesFiles(directoryFiles)
                    })
                
                })
            }else{
                get("images"+engineKey).then((value)=>{
                    if(value != undefined)
                    {
                        getPermission(value.handle, (granted)=>{

                            getDirectoryFiles(value.handle, config.folders.images.fileTypes).then((directoryFiles) => {
                                setImagesDirectory({ name: value.name, handle: value.handle, });
                                setImagesFiles(directoryFiles)
                            })
                            
                           
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
            if (config.folders.objects.default) {
                localDirectory.handle.getDirectoryHandle("objects", { create: true }).then((handle) => {
                    getDirectoryFiles(handle, config.folders.objects.fileTypes).then((directoryFiles) => {
                        setObjectsFiles(directoryFiles)
                        setObjectsDirectory({ name: handle.name, handle: handle});
                    })
                })
            }else{
                get("objects" + engineKey).then((value) => {
                    if (value != undefined) {
                        getPermission(value.handle, (granted) => {
                            getDirectoryFiles(value.handle, config.folders.objects.fileTypes).then((directoryFiles) => {
                                setObjectsDirectory(value)
                                setObjectsFiles(directoryFiles)
                            })
                           
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
            if (config.folders.terrain.default) {
                localDirectory.handle.getDirectoryHandle("terrain", { create: true }).then((handle) => {
                    getDirectoryFiles(handle, config.folders.terrain.fileTypes).then((directoryFiles) => {
                        setTerrainFiles(directoryFiles)
                        setTerrainDirectory({ name: handle.name, handle: handle });
                    })
                })
            }else{
                get("terrain" + engineKey).then((value) => {
                    if (value != undefined) {
                        getPermission(value.handle, (granted) => {
                            getDirectoryFiles(value.handle, config.folders.terrain.fileTypes).then((directoryFiles) => {
                                setTerrainFiles(directoryFiles)
                                setTerrainDirectory(value)
                            })
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
            if (config.folders.textures.default) {
                localDirectory.handle.getDirectoryHandle("textures", { create: true }).then((handle) => {
                    getDirectoryFiles(handle, config.folders.textures.fileTypes).then((directoryFiles) => {
                        setTexturesFiles(directoryFiles)
                        setTexturesDirectory({ name: handle.name, handle: handle });
                    })
                })
            }else{
                get("textures" + engineKey).then((value) => {
                    if (value != undefined) {
                        getPermission(value.handle, (granted) => {
                            getDirectoryFiles(value.handle, config.folders.textures.fileTypes).then((directoryFiles) => {
                                setTexturesFiles(directoryFiles)
                                setTexturesDirectory(value)
                            })
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
            if (config.folders.media.default) {
                localDirectory.handle.getDirectoryHandle("media", { create: true }).then((handle) => {

                    getDirectoryFiles(handle, config.folders.media.fileTypes).then((directoryFiles) => {
                     
                        setMediaFiles(directoryFiles)
                        setMediaDirectory({ name: handle.name, handle: handle });
                    })
                })
            }else{
                get("media" + engineKey).then((value) => {
                    if (value != undefined) {
                        getPermission(value.handle, (granted) => {
                            getDirectoryFiles(value.handle, config.folders.media.fileTypes).then((directoryFiles) => {
                                setMediaDirectory(value)
                            })
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        }
    }




    async function getDirectoryFiles(dirHandle, fileTypes = {}) {

        let files = [];

        for await (const entry of dirHandle.values()) {

            if (entry.kind === "file") {

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
                getPermission(entry,(valid)=>{
                getFileInfo(entry).then((newFile) => {
                    files.push(newFile)
                }
                ).catch((err) => {
                    console.log(err)
                })

                })

                // out[file.name] = file;
            }

        }

        return new Promise(resolve => { resolve(files) })

    }

    async function getFileInfo(entry) {

        return new Promise(resolve => {
            entry.getFile().then((file)=>{
                file.arrayBuffer().then((arrayBuffer) => {
                    
                    crc32FromArrayBuffer(arrayBuffer, (crc) =>{
                        resolve({name:file.name, crc: crc, size: file.size, type: file.type, lastModified: file.lastModified, handle: entry })
                    })
                })
            })
        });

    }

    useEffect(()=>{
        
        if(configFile.value != null)
        {
            const config = configFile.value;

            if("engineKey" in config)
            {
                setFolderDefaults(config)
             
            }
        }

    },[configFile])
    



    /*     <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="D&D" to={'/campaign'}>
                        <img src="Images/Campaign/1/logo.png" width={50} height={50} />
                    </NavLink>
                    */
    
   

    function onProfileClick(e){
      
        if(connected){
            toNav("/home")
        }else{
            toNav("/")
        }
    }

    return (
        <>
          

            
       
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
            <CreateRealmPage />
        }

       {(showMenu) &&
                <div style={{ position: "fixed", top: 0, left: 0, height: pageSize.height, width: 85, backgroundImage: "linear-gradient(to bottom, #000000,#20232588)" }}>
                    <div style={{ display: "flex", flexDirection: "column", height: pageSize.height, fontFamily: "WebPapyrus" }}>
                        <div style={{ flex: 1 }}>

                            {connected  &&
                                <>
                                    <NavLink className={directory == "/network" ? styles.menuActive : styles.menu__item} about="Arcturus Network" to={'/network'}>
                                        <img src="/Images/logo.png" width={50} height={50} />
                                    </NavLink>

                                </>
                            }

                            {/*
                    <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="Map"
                        to={'/editor'}>
                        <img src="Images/map.png" width={50} height={45} />
                    </NavLink>*/
                            }




                        </div>
                        <div style={{ flex: 0.1 }}>
                            {connected &&
                            <NavLink className={location.pathname == "/createRealm"  ? styles.menuActive : styles.menu__item} about="Create Realm"
                                to={'/createRealm'}>
                                    <ImageDiv width={60} height={60} netImage={{ image: "/Images/realm.png", filter: "invert(100%)", width: 45, height: 50 }} />
                               
                            </NavLink>
                            }


                            <NavLink className={directory == "/home" ? styles.menuActive : styles.menu__item} about={user.userName}
                                to={'/home'}>
                                <ImageDiv width={60} height={60} netImage={{ image: "/Images/icons/person.svg", filter: "invert(100%)", width:45, height:50}} />
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
                            toNav("/")
                        }}>
                            <ImageDiv width={30} height={30} netImage={{ image: connected ? "/Images/logo.png" : "/Images/logout.png", width:25, height:25, 
                                filter: peerOnline ? "drop-shadow(0px 0px 3px #faa014)" : "" }} />
                        </div>
                        
                        <PeerNetworkHandler />
                       
                        <ErgoNetworkHandler />
                        <div onClick={onProfileClick} style={{
                            fontFamily: "WebPapyrus",
                            color: "#c7cfda",
                            fontSize: "16px",
                            paddingTop: "5px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        }}> {connected ? user.userName : <div style={{ display: "flex" }}><div>Log</div><div style={{ width: "6px" }}>&nbsp;</div><div>In</div> </div>}</div>
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
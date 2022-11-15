import React, { useState, useEffect, useRef  } from "react";

import { useLocation, useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";
import SelectBox from "./components/UI/SelectBox"
import { set } from "idb-keyval";
import { generateCode, getFileInfo } from "../constants/utility";

export const InitStoragePage = (props = {}) => {

    const location = useLocation()
    const P2PRef = useRef();
    const ergoRef = useRef();
    const sharingRef = useRef();

    const localDirectory = useZust((state) => state.localDirectory)
    const setConfigFile = useZust((state) => state.setConfigFile)
    const configFile = useZust((state) => state.configFile)
    const terrainDirectory = useZust((state) => state.terrainDirectory);
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const objectsDirectory = useZust((state) => state.objectsDirectory);
    const texturesDirectory = useZust((state) => state.texturesDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);


    const [engineKey, setEngineKey] = useState("Generate a key")

    const [terrainDefault, setTerrainDefault] = useState(true);
    const [imagesDefault, setImagesDefault] = useState(true);
    const [objectsDefault, setObjectsDefault] = useState(true);
    const [texturesDefault, setTexturesDefault] = useState(true);
    const [mediaDefault, setMediaDefault] = useState(true);

   
    const [defaultFolders, setDefaultFolders] = useState(false)

    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";

    const navigate = useNavigate();


    const socket = useZust((state) => state.socket);
    const user = useZust((state) => state.user);


    const setWelcomePage = useZust((state) => state.setWelcomePage);
    const [newEmail, setEmail] = useState(""); 


    const pageSize = useZust((state) => state.pageSize)


    const [valid, setValid] = useState(true);

    const [showIndex, setShowIndex] = useState(0)


    const [firstRun, setFirstRun] = useState(true)

    const [stateConfig, setStateConfig] = useState(null)

    useEffect(()=>{
        if(localDirectory.handle == null)
        {
            navigate("/home/localstorage")
        }
    },[localDirectory])

    useEffect(() => {
        console.log(location.state)
        const isState = location.state != null && ("configFile") in location.state ?  location.state.configFile : null
        setStateConfig(isState)
        if(stateConfig != null) {
            setStateConfig(isState)
        }else{

            if (configFile.value == null) {
                
                setFirstRun(true)
                generateEngineKey()
                P2PRef.current.setValue(true);
                sharingRef.current.setValue("published");
                ergoRef.current.setValue(false);
            } else {

                setFirstRun(false)
                const config = configFile.value;
                console.log(config)
                setEngineKey(config.engineKey)
                sharingRef.current.setValue(config.sharing)
                P2PRef.current.setValue(config.peer2peer)
                ergoRef.current.setValue(config.ergo)
                const def = (!(configFile.value.folders.images.default) || !(configFile.value.folders.objects.default) || !(configFile.value.folders.terrain.default) || !(configFile.value.folders.media.default));

                setDefaultFolders(def)

                setCustomFolders(configFile.value.folders)

                

            }
        }
        

    }, [location,stateConfig])




    const removeSystemMessage = (id) => useZust.setState(produce((state) => {
        const length = state.systemMessages.length;
        if (length > 0) {
            if (length == 1) {
                if (state.systemMessages[0].id == id) {

                    state.systemMessages.pop()

                }
            } else {
                for (let i = 0; i < state.systemMessages.length; i++) {
                    if (state.systemMessages[i].id == id) {
                        state.systemMessages.splice(i, 1)
                        break;
                    }
                }
            }
        }

    }))

   

    const getLocalPermissions = (callback) =>{
        const opts = { mode: 'readwrite' };
        
        localDirectory.handle.queryPermission(opts).then((verified) => {
            if (verified === 'granted') {
                callback();
            }else{
                localDirectory.handle.requestPermission(opts).then((verified) =>{
                    if (verified === 'granted') {
                        callback()
                    }
                })
            }
        })
    }

    const setupConfigFile = (callback) => {
        getLocalPermissions(()=>{

            localDirectory.handle.getFileHandle("arcturus.config", { create: true }).then((fileHandle)=>{
                
                fileHandle.createWritable().then((configFileStream)=>{
                   
                    const config = {
                        engineKey: engineKey,
                        peer2peer: P2PRef.current.getValue,
                        ergo: ergoRef.current.getValue,
                        sharing: sharingRef.current.getValue,
                        folders:{
                            images: { name: !imagesDefault ? customFolders.images : imagesDirectory.name, 
                                default: imagesDefault, 
                                fileTypes: ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "svg", "bmp", "ico", "cur"],
                            },
                            objects: { name: !objectsDefault ? customFolders.objects : objectsDirectory.name, 
                                default: objectsDefault,
                                fileTypes: ["json", "obj", "fbx", "gltf", "glb", "dae", "babylon", "stl", "ply", "vrml"]
                            },
                            terrain: { name: !terrainDefault ? customFolders.terrain : terrainDirectory.name, 
                                default: terrainDefault, 
                                fileTypes: ["json"]
                            },
                            media: { name: !mediaDefault ? customFolders.media : mediaDirectory.name,
                                default: mediaDefault,
                                fileTypes: ["pcm", "mp3", "ogg", "webm", "aac", "wav", "3gp", "avi", "mov", "mp4", "m4v", "m4a", "mkv", "ogv", "ogm", ".oga", ] 
                            },
                           
                        } 
                    }
                    console.log(config)
                    configFileStream.write(JSON.stringify(config)).then((value)=>{
                        configFileStream.close().then((closed)=>{
                            localDirectory.handle.getFileHandle("arcturus.config").then((newHandle) => {
                                
                                getFileInfo(newHandle).then((fileInfo) => {

                                    const newConfig = fileInfo;

                                    newConfig.value = config

                                    const engineKey = config.engineKey;




                                    if (!imagesDefault) {
                                        set("images" + engineKey, customFolders.images)
                                    }
                                    if (!objectsDefault) {
                                        set("objects" + engineKey, customFolders.objects)
                                    }
                                    if (!terrainDefault) {
                                        set("terrain" + engineKey, customFolders.terrain)
                                    }
                                    if (!mediaDefault) {
                                        set("media" + engineKey, customFolders.media)
                                    }
                                    const newFile = {
                                        mimeType: "config",
                                        name: fileInfo.name,
                                        crc: fileInfo.crc,
                                        size: fileInfo.size,
                                        type: fileInfo.type,
                                        lastModified: fileInfo.lastModified,
                                    } 
                                    if(firstRun)
                                    {
                                  
                                        socket.emit("createStorage", newFile, newConfig.value.engineKey, (created) => {
                                            if (created.success) {
                                                newConfig.fileID = created.fileID;
                                                newConfig.storageID = created.storageID;

                                               

                                                callback(true)

                                            } else {
                                                console.log(created)
                                                callback(false)
                                            }
                                        })
                                    }else{
                                        
                                        socket.emit("updateStorageConfig",configFile.fileID, configFile.storageID, newFile, (updated)=>{
                                            if (updated) {
                                                console.log("updated")
                                                newConfig.fileID = updated.fileID;
                                                newConfig.storageID = configFile.storageID;
                                                
                                                navigate("/loading", { state: { configFile: newConfig, navigate: "/localstorage" } })

                                                callback(true)

                                            } else {
                                                callback(false)
                                            }
                                        })
                                    }


                                }).catch((err) => {
                                    console.log(err)
                                    callback(false)
                                })

                            }).catch((err) => {
                                console.log(err)
                                callback(false)
                            })
                        });

                        
                    })
                })
            }).catch((err)=>{
                console.error(err)
                callback(false)
            })
            
           
        })
        
        
    }


    function handleSubmit(e = null) {
        if(e != null)e.preventDefault();
    
        if(valid)
        {
            console.log("submitting")
    
            setValid(false)
            setupConfigFile(result=>{
                    setValid(true);
                    if(result)
                    {
                        removeSystemMessage(0)
                        removeSystemMessage(1)
                        removeSystemMessage(2)
                        navigate("/loading", { state: { configFile: newConfig, navigate: "/localstorage" } })
                    }
                })
            
    
       }


    }
    
    function onCancelClick(e){
       
        if (showIndex == 0) {
            navigate("/home/localstorage")
            
        } else {
            setShowIndex(prev => prev -= 1)
        }
    }

    function onOKclick(e){
     
        handleSubmit()
    }

    const generateEngineKey =() =>{
        const userName = user.userName;
        const userID = user.userID;
        const userEmail = user.userEmail;
      
        generateCode([userName, userID, userEmail]).then((code)=>{
            setEngineKey("ARC" + code)
        })

        
    }

    const onGenerateClick =(e) =>{
        generateEngineKey()           
    }


    const onFolder = (value) =>{

    }

    const [customFolders, setCustomFolders] = useState({images:null, objects:null,terrain:null,media:null})

    const onUseConfig = (e) =>{
        if(stateConfig != null){
            const fileID = stateConfig.fileID;
            const storageKey = stateConfig.value.engineKey;

           socket.emit("useConfig", fileID, engineKey,  (callback)=>{
                if(!("error" in callback)){
                    const storageID = callback.storageID;
                    const config = stateConfig;
                    config.value.storageID = storageID;

                    navigate("/loading", {state:{configFile:config}, navigate:"/localstorage"})
                }else{
                    console.log(callback.error)
                    alert("This config file could not be loaded.")
                    navigate("/localstorage")
                }
            })
        }else{
            alert("This config file could not be loaded.")
            navigate("/localstorage")
        }
    }
    const onCancelConfig = (e) =>{
        setConfigFile()
        navigate("home/localstorage/init")
    }

    return (
        <>
        {stateConfig != null &&
            <div style={{
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.95)",

                left: (pageSize.width / 2),
                top: (pageSize.height / 2),
                transform: "translate(-50%,-50%)",
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            }}>

                <div style={{
                    
                    textAlign: "center",
                    width: "100%",
                    paddingTop: "10px",
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    backgroundImage: "linear-gradient(#131514, #000304EE )",


                }}>
                    Config
                </div>
                    <div style={{fontFamily:"webrockwell", color:"white",padding:40, fontSize:16, textAlign:"center"}}>
                        This configuration file is not associated with your account.
                    </div>
                    <div style={{ fontFamily: "webrockwell", color: "#BBBBBB", paddingBottom:30, fontSize: 13, textAlign: "center" }}>
                        Would you like to use it anyway?
                    </div>
                    <div style={{
                        justifyContent: "center",

                        paddingTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={onCancelConfig}>No</div>

                        <div style={{

                            marginLeft: "10px", marginRight: "10px",
                            height: "50px",
                            width: "1px",
                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                        }}>

                        </div>
                        <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={onUseConfig} >Yes</div>
                    </div>
            </div>
        }
        { stateConfig == null &&
        <div  style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.95)",
         
            left: (pageSize.width / 2),
            top: (pageSize.height / 2),
            transform:"translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
        }}>
            
            <div style={{
                paddingBottom: 10,
                textAlign: "center",
                width: "100%",
                paddingTop: "10px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",


            }}>
               {firstRun ? "Setup" : "Config"}
            </div>

            <div style={{  width: "100%", height:"100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                        {showIndex == 0 &&
                            <div style={{
                       
                      
                                flex: 1,
                                minWidth:800,
                            
                                padding: "20px",
                                fontFamily: "WebRockwell",
                                color: "#cdd4da",
                                fontSize: "18px",
                                display: "flex", flexDirection: "column",
                                alignItems: "center",
                            }}>


                                <div style={{
                                    fontSize: "13px"
                                }}>

                                    arcturus.config

                                </div>
                                <div style={{

                                    marginTop: "5px",
                                    height: "1px",
                                    width: "100%",
                                    backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                                }} />

                                <div style={{ height:"100%", paddingLeft: 15, paddingTop: 5, width: "100%", backgroundColor: "#33333330" }}>


                                    <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                        <div style={{ marginRight: 0,  width: 160, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                            Engine Key:
                                        </div>
                                        <div style={{ flex:1}}>  {engineKey} </div>
                                        {firstRun &&
                                            <div onClick={onGenerateClick} style={{ paddingTop: 5, height: 10, fontSize: 14, width: 100 }} className={styles.OKButton} > Generate </div>
                                        }
                                    </div>

                                    <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                        <div style={{ marginRight: 0, alignItems: "flex-end", width: 160, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                            Peer Network:
                                        </div>
                                        <div style={{ flex: 1 }}>

                                            <SelectBox
                                                ref={P2PRef}
                                                textStyle={{
                                                    color: "#ffffff",
                                                    fontFamily: "Webrockwell",
                                                    border: 0,
                                                    fontSize: 14,
                                                }}
                                                optionsStyle={{

                                                    backgroundColor: "#333333C0",
                                                    paddingTop: 5,
                                                    fontSize: 14,
                                                    fontFamily: "webrockwell"
                                                }}

                                                placeholder="" options={[
                                                    { value: true, label: "Enabled" },
                                                    { value: false, label: "Disabled" }
                                                ]} />
                                        </div>
                                      
                                    </div>

                                    <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                        <div style={{ marginRight: 0, alignItems: "flex-end", width: 160, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                            Ergo Network:
                                        </div>
                                        <div style={{ flex: 1 }}>

                                            <SelectBox
                                                ref={ergoRef}
                                                textStyle={{
                                                    color: "#ffffff",
                                                    fontFamily: "Webrockwell",
                                                    border: 0,
                                                    fontSize: 14,
                                                }}
                                                optionsStyle={{

                                                    backgroundColor: "#333333C0",
                                                    paddingTop: 5,
                                                    fontSize: 14,
                                                    fontFamily: "webrockwell"
                                                }}

                                                 placeholder="" options={[
                                                    { value: true, label: "Enabled" },
                                                    { value: false, label: "Disabled" }
                                                ]} />
                                        </div>
                                     
                                    </div>

                                    <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                        <div style={{ marginRight: 0, alignItems: "flex-end", width: 160, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                            File Sharing:
                                        </div>
                                        <div style={{ flex: 1 }}>

                                            <SelectBox
                                                ref={sharingRef}
                                                textStyle={{
                                                    color: "#ffffff",
                                                    fontFamily: "Webrockwell",
                                                    border: 0,
                                                    fontSize: 14,
                                                }}
                                                optionsStyle={{

                                                    backgroundColor: "#333333C0",
                                                    paddingTop: 5,
                                                    fontSize: 14,
                                                    fontFamily: "webrockwell"
                                                }}

                                                placeholder="File Sharing" options={[
                                                    { value: "published", label: "Published Files Only" },
                                                    { value: "disabled", label: "Disabled" },

                                                ]} />
                                        </div>
                                    
                                    </div>
                                    <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                        <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                            Custom Folders:
                                        </div>
                                        <div style={{ cursor: "pointer", paddingLeft: 0, }} className={styles.checkPos} onClick={(e) => { setDefaultFolders(prev => !prev) }} >
                                            <div className={!defaultFolders ? styles.check : styles.checked} />
                                        </div>
                                    </div>









                                    {defaultFolders &&
                                        <>


                                            <div style={{ display: "flex", paddingTop: 10, width: "100%"  }} >
                                                <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                    Images Folder:
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div onClick={async function (e) {
                                                        try {
                                                            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

                                                            const name = await dirHandle.name;


                                                            setCustomFolders(
                                                                produce((state) => {
                                                                    state.images = { name: name, handle: dirHandle };
                                                                })
                                                            )

                                                            setImagesDefault(false)
                                                        } catch (error) {
                                                            if (error == DOMException.ABORT_ERR) {

                                                            }
                                                            setImagesDefault(true)
                                                        }
                                                    }}

                                                        style={{
                                                            cursor: "pointer",
                                                            width: 250,
                                                            fontSize: 14,
                                                            marginTop: 5,
                                                            textAlign: "left",
                                                            border: "0px",
                                                            outline: 0,
                                                            color: imagesDefault ? "#ffffff80" : "white",
                                                            fontFamily: "webrockwell"
                                                        }} >
                                                        {imagesDirectory.name}
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", marginTop: 5, cursor: "pointer" }} onClick={(e) => { setImagesDefault(prev => !prev) }} >
                                                    <div style={{ marginRight: 10, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                        default:
                                                    </div>
                                                    <div style={{ cursor: "pointer", paddingLeft: 0, }} className={styles.checkPos}  >
                                                        <div className={imagesDefault ? styles.checked : styles.check} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                                <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                    3D Objects Folder:
                                                </div>
                                                <div style={{ flex: 1 }}>

                                                    <div onClick={async function (e) {
                                                        try {
                                                            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

                                                            const name = await dirHandle.name;

                                                            setCustomFolders(
                                                                produce((state) => {
                                                                    state.objects = { name: name, handle: dirHandle };
                                                                })
                                                            )

                                                            setObjectsDefault(false)
                                                        } catch (error) {
                                                            if (error == DOMException.ABORT_ERR) {

                                                            }
                                                            setObjectsDefault(true)
                                                        }
                                                    }}

                                                        style={{
                                                            cursor: "pointer",
                                                            width: 250,
                                                            fontSize: 14,
                                                            marginTop: 5,
                                                            textAlign: "left",
                                                            border: "0px",
                                                            outline: 0,
                                                            color: objectsDefault ? "#ffffff80" : "white",
                                                            fontFamily: "webrockwell"
                                                        }} >
                                                        {objectsDirectory.name}
                                                    </div>

                                                </div>

                                                <div style={{ display: "flex", marginTop: 5, cursor: "pointer" }} onClick={(e) => { setObjectsDefault(prev => !prev) }} >
                                                    <div style={{ marginRight: 10, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                        default:
                                                    </div>
                                                    <div style={{ cursor: "pointer", paddingLeft: 0, }} className={styles.checkPos}  >
                                                        <div className={objectsDefault ? styles.checked : styles.check} />
                                                    </div>
                                                </div>

                                            </div>
                                            

                                            <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                                <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                    Terrain Folder:
                                                </div>
                                                <div style={{ flex: 1 }}>

                                                    <div onClick={async function (e) {
                                                        try {
                                                            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

                                                            const name = await dirHandle.name;
                                                            setCustomFolders(
                                                                produce((state) => {
                                                                    state.terrain = { name: name, handle: dirHandle };
                                                                })
                                                            )

                                                            setTerrainDefault(false)
                                                        } catch (error) {
                                                            if (error == DOMException.ABORT_ERR) {

                                                            }
                                                            setTerrainDefault(true)
                                                        }
                                                    }}

                                                        style={{
                                                            cursor: "pointer",
                                                            width: 250,
                                                            fontSize: 14,
                                                            marginTop: 5,
                                                            textAlign: "left",
                                                            border: "0px",
                                                            outline: 0,
                                                            color: terrainDefault ? "#ffffff80" : "white",
                                                            fontFamily: "webrockwell"
                                                        }} >
                                                        {terrainDirectory.name}
                                                    </div>

                                                </div>
                                                <div style={{ display: "flex", marginTop: 5, cursor: "pointer" }} onClick={(e) => { setTexturesDefault(prev => !prev) }} >
                                                    <div style={{ marginRight: 10, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                        default:
                                                    </div>
                                                    <div style={{ cursor: "pointer", paddingLeft: 0, }} className={styles.checkPos}  >
                                                        <div className={texturesDefault ? styles.checked : styles.check} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                                 <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                    Media Folder:
                                                </div>
                                                <div style={{ flex: 1 }}>

                                                    <div onClick={async function (e) {
                                                        try {
                                                            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

                                                            const name = await dirHandle.name;
                                                            setCustomFolders(
                                                                produce((state) => {
                                                                    state.media = { name: name, handle: dirHandle };
                                                                })
                                                            )

                                                            setMediaDefault(false)
                                                        } catch (error) {
                                                            if (error == DOMException.ABORT_ERR) {

                                                            }
                                                            setMediaDefault(true)
                                                        }
                                                    }}

                                                        style={{
                                                            cursor: "pointer",
                                                            width: 250,
                                                            fontSize: 14,
                                                            marginTop: 5,
                                                            textAlign: "left",
                                                            border: "0px",
                                                            outline: 0,
                                                            color: mediaDefault ? "#ffffff80" : "white",
                                                            fontFamily: "webrockwell"
                                                        }} >
                                                        {mediaDirectory.name}
                                                    </div>

                                                </div>
                                                <div style={{ display: "flex", marginTop: 5, cursor: "pointer" }} onClick={(e) => { setMediaDefault(prev => !prev) }} >
                                                    <div style={{ marginRight: 10, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                        default:
                                                    </div>
                                                    <div style={{ cursor: "pointer", paddingLeft: 0, }} className={styles.checkPos}  >
                                                        <div className={mediaDefault ? styles.checked : styles.check} />
                                                    </div>
                                                </div>
                                            </div>




                                        </>
                                    }
                                    <div style={{ height: 15 }}></div>
                                </div>
                        <div style={{
                            justifyContent: "center",

                            paddingTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={onCancelClick}>Back</div>

                            <div style={{

                                marginLeft: "10px", marginRight: "10px",
                                height: "50px",
                                width: "1px",
                                backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                            }}>

                            </div>
                            <div style={{  width:80, height:30}} className={styles.OKButton} onClick={onOKclick} >{firstRun ? "Ok" : "Update"}</div>
                        </div>
                            </div>
                        }
               
                    </div>
                    </div>
                    }
                    </>

    )
}

/* <textArea 
                                                placeholder="(*.glb *.png *.jpg)"
                                                type={"text"}
                                                style={{
                                                    resize: "none",
                                                    width: 270,
                                                    fontSize: 14,
                                                    marginTop: 5,
                                                    textAlign: "left",
                                                    border: "0px",
                                                    outline: 0,
                                                    color: "white",
                                                    backgroundColor: "#00000000",
                                                    fontFamily: "webrockwell"
                                                }} />*/

/*
 <div onClick={onCancelClick} style={{ cursor: "pointer", display: "flex",}}>
                                <div  >
                                    <ImageDiv netImage={{
                                        image: "/Images/icons/person.svg",
                                        width: 130,
                                        backgroundColor:"#33333350",
                                        height: 130,
                                        filter: "invert(100%)"
                                    }} />
                                    <div style={{
                                        position: "relative",
                                        transform: "translate(17px,-15px)",
                                        fontSize: "13px",
                                        color: "#cdd4da",
                                        textShadow: "1px 1px 2px #101314, -1px -1px 1px #101314",
                                        fontFamily: "Webrockwell",
                                        cursor: "pointer"
                                    }} >Select Image</div>
                                </div>
                                    <div>
                                        <div style={{display:"flex"}}>
                                            <div style={{

                                                marginLeft: "20px", marginRight: "20px",
                                                height: "50px",
                                                width: "1px",
                                                backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                            }}>

                                            </div>
                                            <div style={{width:150, height:50, display:"flex", alignItems:"center"}}  onClick={onOKclick} >Profile Image</div>
                                        </div>
                                        <div style={{ fontFamily: "WebPapyrus", paddingLeft: 45, fontSize: 14, color:"#ffffff50" }}>Select a profile image from your images.</div>
                                    </div>
                                </div>
                                */
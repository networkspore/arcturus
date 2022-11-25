import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import styles from './css/home.module.css';


import FileList from './components/UI/FileList';

import { set, del } from 'idb-keyval';
import produce from 'immer';
import {  useLocation, useNavigate, NavLink} from 'react-router-dom';
import { InitStoragePage } from './InitStoragePage';
import SelectBox from './components/UI/SelectBox';
import { ImageDiv } from './components/UI/ImageDiv';
import { getFileInfo, getPermission, getPermissionAsync, readFileJson } from '../constants/utility';
import { initStorage } from '../constants/systemMessages';

export const LocalStoragePage = () => {

    const searchInputRef = useRef()
   
    const [directoryOptions, setDirectoryOptions] = useState([])

    const terrainDirectory = useZust((state) => state.terrainDirectory);
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const modelsDirectory = useZust((state) => state.modelsDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);


    const terrainFiles = useZust((state) => state.terrainFiles);
    const imagesFiles = useZust((state) => state.imagesFiles);
    const modelsFiles = useZust((state) => state.modelsFiles);
    const texturesFiles = useZust((state) => state.textureFiles);
    const mediaFiles = useZust((state) => state.mediaFiles);

    const addSystemMessage = useZust((state) => state.addSystemMessage)


    const socket = useZust((state) => state.socket)

    const location = useLocation();

    const navigate = useNavigate();

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)

    const localDirectory = useZust((state) => state.localDirectory)
    const setLocalDirectory = (value) => useZust.setState(produce((state) => {
        state.localDirectory = value;
    }));

    const [currentDirectories, setCurrentDirectories] = useState([])
 
    const configFile = useZust((state) => state.configFile)

    const setConfigFile = useZust((state) => state.setConfigFile)

    const [currentFolder, setCurrentFolder] = useState("")
    const [currentFiles, setCurrentFiles] = useState()

    const [showIndex, setShowIndex] = useState(); 

    const [directoryIndex, setDirectoryIndex] = useState(-1)

    const [fileList, setFileList] = useState([])

    const [showInitPage, setShowInitPage] = useState(false)
    
    const handleChange = (e) => {

    }
    const directoryChanged = (index) =>{
        
    }
    async function onReload() {
        const granted = await getPermissionAsync(localDirectory.handle)
        if(!granted) return false;

        const fileHandle = await localDirectory.handle.getFileHandle("arturus.config");
        if(fileHandle == null || fileHandle == undefined){ 
            turnOffLocalStorage();
            alert("Config file missing.")
            navigate("/localstorage/init")  
            return false;
        }

        const config = configFile.value;

        if (config == null){
            turnOffLocalStorage();
            navigate("/localstorage/init")
            return false;
        }
        const file = await getFileInfo(fileHandle, localDirectory.handle)

        const engineKey = configFile.value.engineKey

        socket.emite("checkFileCRC", file.crc, (valid)=>{
            
        })
            
       
    }


    const [subDirectory, setSubDirectory] = useState("")
    

    useEffect(()=>{

        if(localDirectory.handle != null)
        {
            getPermission(localDirectory.handle, (verified)=>{

                
                const currentLocation = location.pathname;
                const directory = "/home/localstorage";

                const thirdSlash = currentLocation.indexOf("/",directory.length)

                const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash) : "";
                setSubDirectory(l)

                switch(l){
                    case "/init":
                        setCurrentFiles([])
                        setShowIndex(1)
                        break;
                    case "/images":
                        setCurrentDirectories(imagesDirectory.directories)
                   
                        setCurrentFiles(imagesFiles)
                       
                        setShowIndex(2)
                        break;
                    case "/models":
                        setCurrentFiles(modelsFiles)
                        setShowIndex(2)
                        break;
                    case "/terrain":
                        setCurrentFiles(terrainFiles)
                        setShowIndex(2)
                        break;
                    case "/textures":
                        setCurrentFiles(texturesFiles)
                        setShowIndex(2)
                        break;
                    case "/media":
                        setCurrentFiles(mediaFiles)
                        setShowIndex(2)
                        break;
                    default:
                        setCurrentFiles([])
                        setShowIndex(0);
                        break;
                }
            })
        }
    },[location,localDirectory])



    async function pickAssetDirectory() {
        try{
            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
         
            handleFirst(dirHandle)
            
        }catch (error) {
            if(error == DOMException.ABORT_ERR) {
                
            }
        }
    }

 

 

    async function handleFirst (dirHandle) {
         
        const name = await dirHandle.name;

        const lDirectory = { name: name, handle: dirHandle }
        setLocalDirectory(lDirectory)
      
        set("localDirectory" + user.userID, lDirectory)
  
        try{
            dirHandle.handle.getFileHandle("arcturus.config").then((handle) => {
                console.log(handle)
                if (handle != null && handle != undefined) {
                    getFileInfo(handle, value.handle).then((file) => {



                        socket.emit("checkStorageCRC", file.crc, (callback) => {
                            if ("error" in callback) {
                                addSystemMessage(initStorage)
                                navigate("/home/localstorage/init")
                            } else {
                                if (callback.success) {
                                    readFileJson(handle).then((jsonResult) => {
                                        if ("error" in jsonResult) {
                                            addSystemMessage(initStorage)
                                            navigate("/home/localstorage/init")
                                        } else {
                                            if (jsonResult.success) {
                                                const json = jsonResult.value;
                                                file.value = json[user.userName];
                                                file.fileID = callback.fileID;

                                                
                                                file.fileID = callback.fileID;
                                                if (callback.success) {

                                                    file.storageID = callback.storageID;


                                                    navigate("/loading", { state: { configFile: file, navigate: "/home/localstorage" } })

                                                } else {

                                                    navigate("home/localstorage/init", { state: { configFile: file } })
                                                }
                                              
                                            } else {
                                                console.log(jsonResult.error)

                                                addSystemMessage(initStorage)
                                                navigate("/home/localstorage/init")
                                            }
                                        }
                                    })
                                } else {
                                    addSystemMessage(initStorage)
                                    navigate("/home/localstorage/init")
                                }
                            }
                        })

                    }).catch((err) => {
                        console.log(err)
                        addSystemMessage(initStorage)
                        navigate("/home/localstorage/init")
                    })
                }
        })
         
    }catch(err){
            console.log(err)
            addSystemMessage(initStorage)
            navigate("/home/localstorage/init")
    }
}
        
    


    const turnOffLocalStorage = (nav = "/home/localstorage") =>{
       
        
        
        del("localDirectory" + user.userID)
        setLocalDirectory({name:"", handel:null});

        del(configFile.name + user.userID)
       
        setConfigFile();

        setTerrainDirectory();

        setImagesDirectory();

       setModelsDirectory();

        setMediaDirectory();
        setCurrentFiles([])

        navigate(nav)
        
    }

    return (
        
       <>
            <div  style={{
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.9)",
                width: pageSize.width - 410,
                height: pageSize.height,
                left: 410,
                top: 0,
                display: "flex",
                flexDirection: "column",
             
            }}>
                <div style={{
                    paddingBottom: "10px",
                    textAlign: "center",
                    width: "100%",
                    paddingTop: "18px",
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                        backgroundImage: "linear-gradient(#131514, #000304EE )",

                }}>
                    Local Storage
                </div>
                <div style={{ 
                    display: "flex", 
                    height:"50px",
                    backgroundColor:"#66666650",
                    
                     alignItems: "center",
                    marginLeft:"10px",
                    marginRight:"10px",
                    paddingLeft:"10px"
                    }}>
                    
                  
                    <div onClick={(e)=>{
                        turnOffLocalStorage()
                    }} about={localDirectory.name == "" ? "Start" : "Turn off"} className={styles.tooltip__item} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }}>

                        <img src='/Images/icons/power-outline.svg' width={25} height={25} style={{ 
                            filter: localDirectory.name == "" ? "Invert(25%)" : configFile.handle != null ? "invert(100%) drop-shadow(0px 0px 3px white)" : "invert(60%) drop-shadow(0px 0px 3px #faa014)" 
                        }} />

                    </div>
                   
                    
                    <div onClick={(e)=>{
                        onReload()
                    }} about={"Reload"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >
                     
                        <img src='/Images/icons/reload-outline.svg' width={25} height={25} style={{ filter: localDirectory.name == "" ? "Invert(25%)" : "Invert(100%"}} />
                     
                    </div>

                    
                    <div  style={{ 
                        display: "flex", 
                        flex:1,
                        cursor: "pointer",
                        fontFamily: "Webrockwell", 
                        fontSize:"14px",
                        }}>
                        <div onClick={(e) => { 
                            
                            pickAssetDirectory() 
                            
                        }} style={{ 
                            width:"100%", 
                            display:"flex", 
                            alignItems:"center", 
                            justifyContent:"center",
                            borderRadius:"30px",
                            backgroundImage: "linear-gradient(to right, #00000050,#11111150,#00000050)",
                            marginLeft:"10px", 
                           
                          
                            }}> 
                            <div style={{
                                paddingLeft: "15px", 
                                paddingTop: "3px",
                                paddingRight:"5px"
                                }}>
                                <img src='/Images/icons/server-outline.svg' style={{
                                    width:"25px",
                                    height:"25px",
                                    filter: localDirectory.name == "" ? "Invert(25%)" : "invert(100%)"
                                }} />
                            </div>
                            {localDirectory.name != "" &&
                                <div style={{ color:  "#cdd4da",}}>
                                    fsa://
                                </div>
                            }
                            <div style={{flex:1}}>
                                <div style={{
                                   
                                    paddingLeft:"2px",
                                    width: "100%",
                                    height: "18px",
                                    textAlign: "left",
                                    border: "0px",
                                    color: localDirectory.name == "" ? "#777777" : "#cdd4da",
                                    backgroundColor: "#00000000",
                                 
                                                            
                                }}>
                                    {localDirectory.name == "" ? "Select a local directory..." : localDirectory.name}{subDirectory}
                                </div>
                                
                            </div>

                         
                        </div>
                        </div>

                                <div style={{width:20}}></div>
                    <div style={{
                        height:30,
                       
                        display: "flex", justifyContent: "right", borderRadius: "30px",
                       }}>
                        <div style={{ margin: 3, backgroundColor: "#33333320", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <input ref={searchInputRef} name={"imageSearch"} onChange={handleChange} style={{
                                color: "white",
                                backgroundColor: "#33333300",
                                fontFamily: "webpapyrus",
                                fontSize: 12,
                                width: 200,
                                outline: 0,
                                border: 0
                            }} type={"text"} />
                        </div>
                        <div style={{ width: 100, margin: 3 }}>
                            <SelectBox onChange={directoryChanged} textStyle={{ fontSize:14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={directoryOptions} />
                        </div>
                        <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer"
                        }}>
                            <ImageDiv width={30} height={30} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                        </div>
                    </div>
                        


                        <div style={{width:20}}>
                   
                            
                 
                      
                    </div>
                  
                </div>
            <div style={{  display: "flex", flex:1, height:(pageSize.height-100), padding:"15px" }}>

             
               
                    {configFile.handle == null && showIndex != 1  &&
                    <div style={{display:"flex",width:"100%", height:"100%", flexDirection:"column", alignItems:"center",justifyContent:"center", color:"white",}}>
                            <ImageDiv onClick={(e) => { pickAssetDirectory() }}
                            style={{cursor:"pointer"}}
                        width={80}
                        height={80}
                        netImage={{
                            scale: .7,
                            image: "/Images/icons/server-outline.svg",
                            filter:"invert(100%)",
                            
                        }}
                    />  
                            <div onClick={(e) => { pickAssetDirectory() }} style={{ cursor:"pointer", color: "white"}} > Select a local directory </div>
                    </div>         
                }
                {configFile.handle != null && showIndex == 2 &&
                    <div style={{
                        overflowX:"hidden",
                        overflowY:"scroll",
                        maxHeight:"95%",
                        width:"100%"
                    }}>
                        <FileList directories={currentDirectories}  files={currentFiles}/>
                    </div>
                }
                {showIndex == 0 && configFile.handle != null &&
                    
                        <FileList className={styles.bubbleButtonLink} fileView={{type:"icons",direction:"column", iconSize:{width:100,height:100}}} tableStyle={{ maxHeight: pageSize.height - 400 }} files={[
                                { to: "/home/localstorage/images", name: imagesDirectory.name, type: "folder", crc: "", lastModified: null, size: null, netImage: {opacity:.7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" }},
                        { to: "/home/localstorage/models", name: "models", type: "folder", crc: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                        { to: "/home/localstorage/terrain", name: "terrain", type: "folder", crc: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                        { to: "/home/localstorage/media", name: "media", type: "folder", crc: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                        { to: "/home/localstorage/init", name: configFile.name, type: "Config", crc: configFile.crc, lastModified: configFile.lastModified, size: configFile.size, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/settings-outline.svg", width: 15, height: 15, filter: "invert(100%)"  }},
                        ]} />
                  
                }
                {showIndex == 1 &&
                    <InitStoragePage 
                        close={()=>{
                            setShowIndex(0)
                        }} resetLocalStorage={()=>{
                            turnOffLocalStorage("/home/localstorage/init")
                        }}
                    />
                    }
            </div>
        </div>
       




</>
    )
        }

        /*

<div style={{ paddingLeft: "20px", display: "flex" }}>

            <div  id='AddButton' className={showIndex == 1 ? styles.toolbarActive:styles.toolbar} style={{display: "flex"}} 
            onClick={newMenuOnClick}>
            <div style={{}}>
                <img src='Images/icons/add-circle.svg' width={20} height={20} style={{ filter: "invert(100%)" }} />
            </div>
            <div style={{
                paddingLeft: "10px",
                fontFamily: "WebRockwell",
                fontSize: "15px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
            }}>
                Add
            </div>
        </div>
        <div className={styles.toolbar} style={{ display: "flex", }}>
            <div style={{}}>
                <img src='Images/icons/enter-outline.svg' width={20} height={20} style={{ filter: "invert(100%)" }} />
            </div>
            <div style={{
                paddingLeft: "10px",
                fontFamily: "WebRockwell",
                fontSize: "15px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
            }}>
                Load
            </div>
        </div>0
        <div style={{ width: pageSize.width - 575 }}>
            &nbsp;
        </div>
        <div className={styles.toolbar} style={{ display: "flex", backgroundColor: "rgba(80,80,80,.3)" }}>
            <div style={{}}>
                <img src='Images/icons/folder-open-outline.svg' width={20} height={20} style={{ filter: "invert(100%)" }} />
            </div>
            <div style={{
                paddingLeft: "10px",
                fontFamily: "WebRockwell",
                fontSize: "15px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
            }}>
                Local
            </div>
        </div>
    </div>*/
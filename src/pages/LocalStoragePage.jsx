import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import styles from './css/home.module.css';


import FileList from './components/UI/FileList';

import { set, del, get } from 'idb-keyval';
import produce from 'immer';
import {  useLocation, useNavigate, NavLink} from 'react-router-dom';
import { InitStoragePage } from './InitStoragePage';
import SelectBox from './components/UI/SelectBox';
import { ImageDiv } from './components/UI/ImageDiv';
import { getFileInfo, getPermission, getPermissionAsync, readFileJson } from '../constants/utility';
import { initStorage } from '../constants/systemMessages';
import { useLayoutEffect } from 'react';
import LinksList from './components/UI/LinksList';



export const LocalStoragePage = (props = {}) => {

    const searchInputRef = useRef()
    const directoryOptionsRef = useRef()
    const fileListDivRef = useRef()
    
    const directory = "/home/localstorage"
   
    const [directoryOptions, setDirectoryOptions] = useState([])

    const [viewImage, setViewImage] = useState(null)
    const [viewMedia, setViewMedia] = useState(null)
    const appsDirectory = useZust((state) => state.appsDirectory)
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const modelsDirectory = useZust((state) => state.modelsDirectory);
    const audioDirectory = useZust((state) => state.audioDirectory);
    const videoDirectory = useZust((state) => state.videoDirectory)
    const pcsDirectory = useZust((state) => state.pcsDirectory)
    const npcsDirectory = useZust((state) => state.npcsDirectory)
    const texturesDirectory = useZust((state) => state.texturesDirectory)
    const terrainDirectory = useZust((state) => state.terrainDirectory)
    const placeablesDirectory = useZust((state) => state.placeablesDirectory)
    const typesDirectory = useZust((state) => state.typesDirectory)

    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setModelsDirectory = useZust((state) => state.setModelsDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);


    const setAssetsDirectory = useZust((state) => state.setAssetsDirectory)
    const setPcsDirectory = useZust((state) => state.setPcsDirectory)
    const setNpcsDirectory = useZust((state) => state.setNpcsDirectory)
    const setTexturesDirectory = useZust((state) => state.setTexturesDirectory)
    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory)
    const setPlaceablesDirectory = useZust((state) => state.setPlaceablesDirectory)
    const setTypesDirectory = useZust((state) => state.setTypesDirectory)
    const setCacheDirectory = useZust((state) => state.setCacheDirectory)
    const setAppsDirectory = useZust((state) => state.setAppsDirectory)


    const addSystemMessage = useZust((state) => state.addSystemMessage)

    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const [fileViewType, setFileViewType] = useState("icons")
    //const [fileViewLoaded, setFileViewLoaded] = useState(true)

    const location = useLocation();

    const navigate = useNavigate();

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)

    const localDirectory = useZust((state) => state.localDirectory)
    const setLocalDirectory = useZust((state) => state.setLocalDirectory)

    const [currentDirectories, setCurrentDirectories] = useState([])
 
    const configFile = useZust((state) => state.configFile)

    const setConfigFile = useZust((state) => state.setConfigFile)
   const [currentFiles, setCurrentFiles] = useState()

    const [showIndex, setShowIndex] = useState(-1); 


    const [subDirectory, setSubDirectory] = useState("")

    const [searchText, setSearchText] = useState("")
    const [currentMimeType, setCurrentMimeType] = useState("")
    const [currentType, setCurrentType] = useState("")

    const [typeOptions, setTypeOptions] = useState()
    const [fileListWidth, setFileListWidth] = useState(600)
    
    

    useEffect(() => { 
        if(fileListDivRef.current)
        {
            const offsetWidth = fileListDivRef.current.offsetWidth
            setFileListWidth( offsetWidth > 480 ? offsetWidth : 480)
        }else{
            setFileListWidth(600)
        }
    }, [pageSize, fileListDivRef.current])

    useEffect(()=>{
        if(configFile.handle != null ){
            setTypeOptions([
                { value: "", label: localDirectory.name },
                { value: "/settings", label: "Settings" },
                { value: "/init", label: "Setup" },
                { value: "/all", label: "All" },
                {value: "/apps", label: "Apps"},
                {
                    value: "/images", label: "Images"
                },
                {
                    value: "/media", label: "Media"
                },
                {
                    value: "/media/audio-video", label: "Audio-Video"
                },
                {
                    value: "/media/video", label: "Video"
                },
                {
                    value: "/media/audio", label: "Audio"
                },
                {
                    value: "/models", label: "Models"
                },
                {
                    value: "/assets", label: "Assets"
                },
                {
                    value: "/assets/pcs", label: "PCs"
                },
                {
                    value: "/assets/npcs", label: "NPCs"
                },
                {
                    value: "/assets/placeables", label: "Placeables"
                },
                {
                    value: "/assets/textures", label: "Textures"
                },
                {
                    value: "/assets/terrain", label: "Terrain"
                },
                {
                    value: "/assets/types", label: "Types"
                },

            ])
           
        }else{
            setTypeOptions([
                { value: "", label: "" },
                { value: "/init", label: "Setup" },
            ])
            
        }
        
    },[configFile, localDirectory])

    useEffect(()=>{
        const currentLocation = location.pathname;
        const secondSlash = currentLocation.indexOf("/", directory.length)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)
        const thirdSlash = subLocation.indexOf("/", 1)
        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)
        const fourthSlash = subLocation.indexOf("/", thirdSlash == -1 ? subLocation.length : thirdSlash + 1)

        const ssD = thirdSlash != -1 ? subLocation.slice(thirdSlash, fourthSlash == -1 ? subLocation.length : fourthSlash) : ""

        if(localDirectory.handle != null)
        {
       
        

            const fifthSlash = subLocation.indexOf("/", fourthSlash == -1 ? subLocation.length : fourthSlash + 1)
            const sssD = fourthSlash != -1 ? subLocation.slice(fourthSlash, fifthSlash == -1 ? subLocation.length : fifthSlash) : ""

            console.log(sD + ssD)

            setSubDirectory(sD)
       
              

                switch(sD + ssD){
                    case "/init":
                        setCurrentFiles([])
                        setShowIndex(1)
                        directoryOptionsRef.current.setValue(sD)
                        break;
                    case "/all":

                        directoryOptionsRef.current.setValue(sD)
                        
                     
                        setCurrentMimeType("")
                        setCurrentType("")
                        setShowIndex(0)

                        break;
                    case "/apps":
                        setCurrentDirectories(appsDirectory.directories)
                  
                        directoryOptionsRef.current.setValue(sD)
                        setCurrentMimeType("arcnet")
                        setCurrentType("")
                        setShowIndex(0)
                        break;
                    case "/images":
                        setCurrentDirectories(imagesDirectory.directories)

                        directoryOptionsRef.current.setValue(sD)
                        setCurrentMimeType("image")
                        setCurrentType("")
                        setShowIndex(0)
                        break;
                    case "/assets":
                      
                            
                        directoryOptionsRef.current.setValue(sD)

                                setCurrentFiles([
                                    { to: "/home/localstorage/assets/pcs", name: "pcs", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: "/home/localstorage/assets/npcs", name: "npcs", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: "/home/localstorage/assets/placeables", name: "placeables", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: "/home/localstorage/assets/textures", name: "textures", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: "/home/localstorage/assets/terrain", name: "terrain", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: "/home/localstorage/assets/types", name: "types", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                ])

                                setCurrentMimeType("")
                                setCurrentType("")
                                setShowIndex(2)
                                break;
                            case "/assets/pcs":
                                setCurrentDirectories(pcsDirectory.directories)
                             
                               
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("arcpc")
                                setCurrentMimeType("asset")

                                setShowIndex(0)
                                break;
                            case "/assets/npcs":
                                setCurrentDirectories(npcsDirectory.directories)

                      
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("arcnpc")
                                setCurrentMimeType("asset")

                                setShowIndex(0)
                                break;
                            case "/assets/placeables":
                                setCurrentDirectories(placeablesDirectory.directories)

                      
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("arcpl")
                                setCurrentMimeType("asset")

                                setShowIndex(0)
                                break;
                            case "/assets/textures":
                                setCurrentDirectories(texturesDirectory.directories)
                             
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("arctex")
                                setCurrentMimeType("asset")
                                setShowIndex(0)
                                break;
                            case "/assets/terrain":
                                setCurrentDirectories(terrainDirectory.directories)
                    
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("arcterr")
                                setCurrentMimeType("asset")
                                setShowIndex(0)
                                break;
                            case "/assets/types":
                                setCurrentDirectories(typesDirectory.directories)
                          
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("arctype")
                                setCurrentMimeType("asset")
                                setShowIndex(0)
                                break;
                     
                    
                    case "/models":
                        setCurrentDirectories(modelsDirectory.directories)
                    
                         directoryOptionsRef.current.setValue(sD)
                        setCurrentType("")
                        setCurrentMimeType("model")
                        setShowIndex(0)
                        break;
                    case "/media":
                       
                      
                        directoryOptionsRef.current.setValue(sD)

                                setCurrentFiles([
                                    { to: directory + "/media/audio-video", name: "Audio-Video", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: directory + "/media/audio", name: "Audio", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                                    { to: directory + "/media/video", name: "Video", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },

                                ])
                                setCurrentMimeType("")
                                setCurrentType("")
                                setShowIndex(2)
                                break;
                            case "/media/audio-video":

                                let newDirectories = []
                                newDirectories = newDirectories.concat(audioDirectory.directories)
                                newDirectories = newDirectories.concat(videoDirectory.directories)

                                setCurrentDirectories(newDirectories)
                      
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("")
                                setCurrentMimeType("media")

                                setShowIndex(0)
                                break;
                    case "/media/audio":
                                setCurrentDirectories(audioDirectory.directories)
                           
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("audio")
                                setCurrentMimeType("media")

                                setShowIndex(0)
                                break;
                    case "/media/video":
                                setCurrentDirectories(videoDirectory.directories)
                 
                                directoryOptionsRef.current.setValue(sD + ssD)
                                setCurrentType("video")
                                setCurrentMimeType("media")

                                setShowIndex(0)
                                break;
                      
                   
                    case "/settings":
                        
                        directoryOptionsRef.current.setValue(sD)
                        setCurrentFiles([
                            { to: "/home/localstorage/init", state: { localDirectory: localDirectory.handle }, name: "Setup", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/settings-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                        ])
                      
                        setShowIndex(0);
                        break;
                    default:
                        
                        if (directoryOptionsRef.current)directoryOptionsRef.current.setValue(sD)
                        setCurrentFiles([
                            { to: directory + "/all", name: "All", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                            { to: directory + "/assets", name: "Assets", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                            { to: directory + "/images", name: "Images", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                            { to: directory + "/models", name: "Models", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                            { to: directory + "/media", name: "Media", mimeType: "link", type: "link", hash: window.crypto.randomUUID(), lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                        ])
                        
                        setShowIndex(2);
                        break;
                }
            
        }else{
            switch (sD + ssD) {
                case "/init":
                    setShowIndex(1)
                break;
                default:
                    
                    
                    setShowIndex(-1)
            }
        }
    }, [location, localDirectory, ])

    const fileSelected = (selectedFile) => {

    }

    const directoryChanged = (option) => {
        const index = option

        if (index != null && typeOptions.length > 0) {
            const value = typeOptions[index].value
            const to = directory + value

            if (location.pathname != to) navigate(to)
        }
    }
    const handleChange = (e) => {
   
        const { name, value } = e.target;

        if (name == "searchText") {
            setSearchText(value)
        }
    }

  

    async function pickAssetDirectory() {
        setSocketCmd({
            cmd: "checkOnline", params: {}, callback: async (onlineResult) => {
                if("success" in onlineResult){
            try{
                
            
                const dirHandle = await window.showDirectoryPicker({ id:"localStorage", mode: "readwrite" });
                await turnOffLocalStorage()
                    navigate("/home/localstorage/init", { state: { localDirectory: dirHandle } })
            
            }catch (error) {
                if(error == DOMException.ABORT_ERR) {
                    
                }
            }
        }
        }})
        
    }
 

   
    const clearSearch = () =>{
        searchInputRef.current.value = ""
        setCurrentDirectories([])
        setCurrentFiles([])
    }
    
    const addFileRequest = useZust((state) => state.addFileRequest)
    async function turnOffLocalStorage(){
       
        
        try{
            addFileRequest({})
            return true;
        }catch(err){
            console.log(err)
            return false
        }
        
    }

    return (
        
       <>
            <div  style={{
                
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.8)",
                width: pageSize.width - 410,
                height: pageSize.height,
                left: 410,
                top: 0,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            }}>
                <div style={{
                  
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    width: "100%",
                 
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                        backgroundImage: "linear-gradient(#131514, #000304EE )",

                }}>
                 
                  <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:15, paddingBottom:10}}>  Local Storage</div>
                  <div style={{width:45}}>&nbsp;</div>
                </div>
                <div style={{ 
                    display: "flex", 
                    height:"50px",
                    backgroundColor:"#66666650",
                    minWidth:800,
                     alignItems: "center",
                   
                    }}>
                    
                  
                   
                   
                    
                    
                    <div onClick={(e) => {
                        navigate(-1)

                    }} about={"Back"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >

                        <img src={"/Images/icons/arrow-back-outline.svg"} width={20} height={20} style={{ filter: "Invert(100%" }} />

                    </div>
                    
                    <div onClick={(e) => {
                        if (localDirectory.handle != null) {
                         
                            props.onReload()
                        }
                    }} about={"Reload Files"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >

                        <img src='/Images/icons/refresh-outline.svg' width={20} height={20} style={{ filter: localDirectory.handle == null ? "Invert(25%)" : "Invert(100%" }} />

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
                                    {localDirectory.handle != null && "fsa:" } {localDirectory.name == "" ? "Select local directory..." : subDirectory == "/init" || subDirectory == "/settings" ? "/" : "//" + localDirectory.name}{localDirectory.handle != null && location.pathname.slice(directory.length)}
                                </div>
                                
                            </div>
                            <div style={{ width: 20 }}>&nbsp;</div>
                         
                        </div>
                        </div>
                               
                                <div style={{width:20}}></div>
                    <div style={{
                        height:30,
                       
                        display: "flex", justifyContent: "right", borderRadius: "30px",
                       }}>
                        
                        
                        <div style={{ margin: 3, backgroundColor: "#33333320", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <input ref={searchInputRef} name={"searchText"} onChange={handleChange} style={{
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
                            <SelectBox ref={directoryOptionsRef} onChange={directoryChanged} textStyle={{ fontSize:14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={typeOptions} />
                        </div>
                        <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer"
                        }}>
                            <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                        </div>
                 
                        <div onClick={(e) => {
                            navigate("/home/localstorage/settings")

                        }} about={"Settings"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipLeft__item} >

                            <img src={"/Images/icons/menu-outline.svg"} width={20} height={20} style={{ filter: "Invert(100%" }} />

                        </div>
                    </div>
                        


                     
                </div>
            <div style={{  display: "flex", flex:1, height:(pageSize.height-100), width: "100%", overflowX:"clip", overflowClipMargin:200  }}>

             
               
                    {showIndex == -1  &&
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
                            <div onClick={(e) => { pickAssetDirectory() }} style={{ cursor:"pointer", color: "white"}} > Select a local directory... </div>
                            
                    </div>         
                }
                    {configFile.handle != null && showIndex == 0 &&

                        <div style={{overflow:"clip", overflowClipMargin:500, alignItems: "center", display: "flex", flexDirection: "column", width: "100%", flex: 1, marginRight: 10, marginLeft: 10 }}>
                            <div style={{ height: 50 }}>&nbsp;</div>
                            <div ref={fileListDivRef} style={{
                                overflowClipMargin: 500,
                                overflowX: fileListWidth > 480 ? 'clip' : "scroll",
                                minWidth: "600",
                                overflowY: "scroll",
                                maxHeight: "95%",
                                width: "100%",

                                display: "flex"

                            }}>

                                <FileList
                                    width={fileListWidth}
                                    
                                    fileView={{ type: fileViewType, direction: "row", iconSize: { width: 100, height: 100 } }}
                                    onChange={fileSelected}
                                    filter={{ name: searchText, mimeType: currentMimeType, type: currentType }}
                                 
                                />
                            </div>
                        </div>
                    }
              
                {showIndex == 1 && props.onReload != undefined &&
                    <InitStoragePage 
                        onReload={()=>{
                       
                            props.onReload()}}
                        close={()=>{
                            navigate("/home/localstorage")
                        }} resetLocalStorage={()=>{
                            turnOffLocalStorage()
                        }}
                    />
                    }
                    {configFile.handle != null && showIndex == 2 &&

                        <div style={{ overflow: "clip", overflowClipMargin: 500, alignItems: "center", display: "flex", flexDirection: "column", width: "100%", flex: 1, marginRight: 10, marginLeft: 10 }}>
                            <div style={{ height: 50 }}>&nbsp;</div>
                            <div ref={fileListDivRef} style={{
                                overflowClipMargin: 500,
                                overflowX: fileListWidth > 480 ? 'clip' : "scroll",
                                minWidth: "600",
                                overflowY: "scroll",
                                maxHeight: "95%",
                                width: "100%",

                                display: "flex"

                            }}>

                                <LinksList
                                    width={fileListWidth}

                                    fileView={{ type: fileViewType, direction: "row", iconSize: { width: 100, height: 100 } }}
                                    onChange={fileSelected}
                                    files={currentFiles}
                                />
                            </div>
                        </div>
                    }
              
                  
            </div>
        </div>
            {showIndex == 0 && 
                <div style={{borderRadius:5, position: "fixed", top: 97, left: pageSize.width /2 + 150 + 45 ,transform:"translateX(-50%)", height: 40, backgroundColor: "#333333C0", display: "flex" }}>
                <div onClick={(e) => {
                    navigate(-1)

                }} about={"Add File"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipCenter__item} >

                    <img src={"/Images/icons/add-circle-outline.svg"} width={20} height={20} style={{ filter: "Invert(80%)" }} />

                </div>
                <div onClick={(e) => {
                    navigate(-1)

                }} about={"Delete File"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipCenter__item} >

                    <img src={"/Images/icons/trash-outline.svg"} width={20} height={20} style={{ filter: "Invert(80%)" }} />

                </div>

                    <div style={{

                        marginLeft: "5px", marginRight: "5px",
                        height: "90%",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }} />
                <div onClick={(e) => {
                    navigate(-1)

                }} about={"Add to Library"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipCenter__item} >

                    <img src={"/Images/icons/cloud-upload-outline.svg"} width={20} height={20} style={{ filter: "Invert(80%)" }} />

                </div>
                <div onClick={(e) => {
                    navigate(-1)

                }} about={"Remove from Library"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipCenter__item} >

                    <img src={"/Images/icons/cloud-download-outline.svg"} width={20} height={20} style={{ filter: "Invert(80%)" }} />

                </div>
                <div style={{

                    marginLeft: "5px", marginRight: "5px",
                    height: "90%",
                    width: "1px",
                    backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                }} />
                <div onClick={(e) => {
                    setFileViewType("icons")

                }} about={"Icons"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipCenter__item} >

                    <img src={"/Images/icons/grid-outline.svg"} width={20} height={20} style={{ filter: fileViewType == "icons" ? "Invert(100%)" : "Invert(60%)" }} />

                </div>
                <div onClick={(e) => {
                    setFileViewType("details")

                }} about={"Details"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipCenter__item} >

                    <img src={"/Images/icons/list-outline.svg"} width={20} height={20} style={{ filter: fileViewType == "details" ? "Invert(100%)" : "Invert(60%)" }} />

                </div>
                   

            </div>}


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
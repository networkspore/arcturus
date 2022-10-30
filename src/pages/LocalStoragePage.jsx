import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import styles from './css/home.module.css';




import { set } from 'idb-keyval';
import produce from 'immer';
import {  useLocation, useNavigate } from 'react-router-dom';
import { InitStoragePage } from './InitStoragePage';



export const LocalStoragePage = () => {
    const terrainDirectory = useZust((state) => state.terrainDirectory);
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const objectsDirectory = useZust((state) => state.objectsDirectory);
    const texturesDirectory = useZust((state) => state.texturesDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);

    const setTerrainDirectory = useZust((state) => state.setTerrainDirectory);
    const setImagesDirectory = useZust((state) => state.setImagesDirectory);
    const setObjectsDirectory = useZust((state) => state.setObjectsDirectory);
    const setTexturesDirectory = useZust((state) => state.setTexturesDirectory);
    const setMediaDirectory = useZust((state) => state.setMediaDirectory);

    


    const location = useLocation();

    const navigate = useNavigate();

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)

    const localDirectory = useZust((state) => state.localDirectory)
    const setLocalDirectory = (value) => useZust.setState(produce((state) => {
        state.localDirectory = value;
    }));


 
    const configFile = useZust((state) => state.configFile)

    const setConfigFile = useZust((state) => state.setConfigFile)

    const [showIndex, setShowIndex] = useState(); 

    const [directoryIndex, setDirectoryIndex] = useState(-1)

    const [fileList, setFileList] = useState([])

    const [showInitPage, setShowInitPage] = useState(false)
    

    function refreshOnClick(e) {

    }

  
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    function formatedNow(now = new Date(), small = false) {

        const year = now.getUTCFullYear();
        const month = now.getUTCMonth()
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();
        const miliseconds = now.getUTCMilliseconds();

        const stringYear = year.toString();
        const stringMonth = month < 10 ? "0" + month : String(month);
        const stringDay = day < 10 ? "0" + day : String(day);
        const stringHours = hours < 10 ? "0" + hours : String(hours);
        const stringMinutes = minutes < 10 ? "0" + minutes : String(minutes);
        const stringSeconds = seconds < 10 ? "0" + seconds : String(seconds);
        const stringMiliseconds = miliseconds < 100 ? (miliseconds < 10 ? "00" + miliseconds : "0" + miliseconds) : String(miliseconds);


        const stringNow = stringYear + "-" + stringMonth + "-" + stringDay + " " + stringHours + ":" + stringMinutes;



        return small ? stringNow : stringNow + ":" + stringSeconds + ":" + stringMiliseconds;
    }

    
    

    useEffect(()=>{
        const currentLocation = location.pathname;

        if (currentLocation == "/home/localstorage/init")
        {
            
            setShowIndex(1)
        }else{
            setShowIndex(0)
        }
    },[location])
/*
    useEffect(() => {
        if (localDirectory.name != "") {
            if (Array.isArray(files)) {
                if (files.length > 0) {

                    var tmp = []
                    files.forEach(item => {
                        const iSize = formatBytes(item.size)
                        const iModified = formatedNow(new Date(item.lastModified));

                        const iType = item.type;



                        tmp.push(
                            <div style={{ display: "flex" }} className={styles.result}>
                                <div style={{ width: 180, color: "#777777", }}>{iType}</div>
                                <div style={{ flex: 1, color: "white", }}>{item.name}</div>
                                <div style={{ width: 225, color: "#777777", }}>{iModified}</div>
                                <div style={{ width: 150, color: "#777777", }}>{iSize}</div>
                            </div>
                        )

                    });
                    setFileList(tmp)

                } else {
                    setFileList([])

                }
            } else {
                setFileList([])
            }

        }
    }, [files])*/


    async function pickAssetDirectory() {
        try{
            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
            await handleFirst(dirHandle)
        }catch (error) {
            if(error == DOMException.ABORT_ERR) {
                
            }
        }
    }

 

 

    async function handleFirst (dirHandle) {
        turnOffLocalStorage()
        
        setFileList([])
      
        const name = await dirHandle.name;
  
        setLocalDirectory({ name: name, handle: dirHandle })

        set("localDirectory" + user.userID, {name: name, handle: dirHandle})
        
        dirHandle.getFileHandle("arcturus.config.json").then((handle)=>{
            console.log(handle)

           readFileJson(handle, (json)=>{
                if(json.success)
                {
                    const config = json.value;
                    if("engineKey" in config)
                    {
                        setConfigFile({ value: json.value, handle: handle, name: name })
                    }
                    
                }else{
                    navigate("/home/localstorage/init")
                }
            })
        }).catch((err)=>{
            navigate("/home/localstorage/init")
        })
    }





    const turnOffLocalStorage = () =>{
        
        if(localDirectory.name != ""){
            del("localDirectory" + user.userID)
            setLocalDirectory();
        }

        if(configFile.name != "")
        {
            del(configFile.name + user.userID)
            setConfigFile();
        }
        
        if(terrainDirectory.name !=""){
            setTerrainDirectory();
        }
        if (imagesDirectory.name != "" ){
            setImagesDirectory();
        }
        if (objectsDirectory.name != "" ){
            setObjectsDirectory();
        }
        if (texturesDirectory.name != ""){
            setTexturesDirectory();
        }
        if (mediaDirectory.name != ""){
            setMediaDirectory();
        }

    }

    return (
        
       <>
            <div id='AssetsPage' style={{
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.95)",
                width: pageSize.width - 385,
                height: pageSize.height,
                left: 385,
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

                    
                    <div onClick={(e)=>{pickAssetDirectory()}}  style={{ 
                        display: "flex", 
                        flex:1,
                        cursor: "pointer",
                        fontFamily: "Webrockwell", 
                        fontSize:"14px",
                        }}>
                        <div style={{
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
                                    {localDirectory.name == "" ? "Select a local directory..." : localDirectory.name}
                                </div>
                                
                            </div>
                        </div>
                        <div style={{width:30}}>
                   
                            
                        
                        </div>
                    </div>
                  
                </div>
            <div style={{  display: "flex", flex:1, height:(pageSize.height-100), padding:"15px" }}>

             
               
                <div style={{flex:1}}>

                        <div style={{ display: "flex" }}>
                            <div style={{width:10}}></div>
                            <div style={{ width: 180, color: "#777777", }}>Type</div>
                            <div style={{ flex: 1, color: "#777777", }}>Name</div>
                            <div style={{ width: 225, color: "#777777", }}>Last Modified</div>
                            <div style={{ width: 150, color: "#777777", }}>Size</div>
                            <div style={{width:20}}></div>
                        </div>

                        <div style={{
                            marginBottom:'2px',
                            marginLeft: "10px",
                            height: "1px",
                            width: "100%",
                            backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                        }}>&nbsp;</div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            height: pageSize.height - 175,
                            flex: 1,
                            backgroundColor: "#33333322",
                            overflowY: "scroll",
                            color: "#cdd4da"
                        }}
                        >
                  

                            {fileList}

                        </div>
                </div>
               

            </div>
        </div>
        {showIndex == 1 &&
            <InitStoragePage />
        }




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
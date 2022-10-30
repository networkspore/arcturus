import React, { useState, useEffect, useRef  } from "react";

import { useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";

import MD5 from "crypto-js/md5";

import SelectBox from "./components/UI/SelectBox"
import { set } from "idb-keyval";

export const InitStoragePage = () => {
    
    const codeRef = useRef();
    const sharingPermissionsRef = useRef();

    const localDirectory = useZust((state) => state.localDirectory)
    const setConfigFile = useZust((state) => state.setConfigFile)

    const terrainDirectory = useZust((state) => state.terrainDirectory);
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const objectsDirectory = useZust((state) => state.objectsDirectory);
    const texturesDirectory = useZust((state) => state.texturesDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);




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

    useEffect(() => {
        setWelcomePage();
    }, [])


 

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


    function handleChange(e) {
        const { name, value } = e.target;

        if(name == "ref"){
            if (value.length > 7) {
                socket.emit("checkRefCode", value, (callback)=>{
                    if(callback > 0)
                    {
                        setValid(prev => true);
                       
                    }else{
                        if (valid) setValid(prev => false);
                    }
                });
            }else{
               
                if(valid)setValid(prev => false);
            }
        }
    }

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

           

            localDirectory.handle.getFileHandle("arcturus.config.json", { create: true }).then((fileHandle)=>{
                
                fileHandle.createWritable().then((configFileStream)=>{
                   
                    const config = {
                        engineKey: codeRef.current.value,
                        defaultFileSharing: sharingPermissionsRef.current.getValue,
                        folders:{
                            images: { name: !imagesDefault ? customFolders.images : imagesDirectory.name, 
                                default: imagesDefault, 
                                fileTypes: ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "svg", "bmp", "ico", "cur"],
                            },
                            objects: { name: !objectsDefault ? customFolders.objects : objectsDirectory.name, 
                                default: objectsDefault,
                                fileTypes: ["json", "obj", "fbx", "gltf", "glb", "dae", "babylon", "stl", "ply", "vrml"]
                            },
                            textures: { name: !texturesDefault ? customFolders.texture : texturesDirectory.name, 
                                default: texturesDefault,
                                fileTypes: ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "svg", "bmp", "ico", "cur"],
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

                    configFileStream.write(JSON.stringify(config)).then((value)=>{
                        configFileStream.close();

                        const configFile = { value: config, name: fileHandle.name, handle: fileHandle }

                        const engineKey = config.engineKey;

                        
                        

                        if(!imagesDefault)
                        {
                            set("images" + engineKey, customFolders.images)
                        }
                        if(!objectsDefault)
                        {
                            set("objects" + engineKey, customFolders.objects)
                        }
                        if(!texturesDefault)
                        {
                            set("textures" + engineKey, customFolders.texture)
                        }
                        if(!terrainDefault)
                        {
                            set("terrain" + engineKey, customFolders.terrain)
                        }
                        if(!mediaDefault)
                        {
                            set("media" + engineKey, customFolders.media)
                        }
                        

                        setConfigFile(configFile)
                        


                        callback(true)
                    }).catch((err) => {
                        callback(false)
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
            
            switch(showIndex)
            {
                case 0:
                    setValid(false)
                    setupConfigFile(result=>{
                        setValid(true);
                        if(result)
                        {
                            setShowIndex(prev => prev += 1);
                        }
                    })
                    

                    break;
                case 1:
                    break;
            }
                
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
 
    function onGenerateClick(e = null) {


        const code = MD5(formatedNow()).toString().slice(0,7)
        codeRef.current.value = code;
    }

    const onFolder = (value) =>{

    }

    const [customFolders, setCustomFolders] = useState({images:null, objects:null,terrain:null,texture:null,media:null})

    useEffect(()=>{
        switch(showIndex)
        {
            case 0:
                onGenerateClick();
                break;
        }
    }, [showIndex])

    return (
        <>
            
            <div id='Profile' style={{
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.95)",
                width: 800,
                transform:"translate(-50%,-50%)",
                left: (pageSize.width / 2),
                top: (pageSize.height / 2),
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
                   Setup
                </div>
                <div style={{ paddingLeft: "15px", display: "flex", }}>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 190, padding: "10px" }}>
                    
                        <div onClick={(e) => { setShowIndex(0) }} style={{ 
                            paddingTop: 10, paddingBottom: 8, paddingLeft: 10, 
                            width: "100%", 
                            color: showIndex == 0 ? "#ffffff90" : "#88888860" , 
                            backgroundImage: (showIndex == 0) ? "linear-gradient(to bottom, #44444450,#44444480,#44444450)" : "linear-gradient(to bottom, #22222250,#44444420)", 
                            fontFamily: "WebRockwell" }}>

                        1. Start Engine

                    </div>

                        <div 
                        style={{ 
                            paddingTop: 10, paddingBottom: 10, paddingLeft: 10, 
                            width: "100%", 
                            color: showIndex == 1 ? "#ffffff90" : "#88888860" , 
                            backgroundImage: (showIndex == 1) ? "linear-gradient(to bottom, #44444450,#44444480,#44444450)" : "linear-gradient(to bottom, #22222250,#44444420)", 
                            fontFamily:"Webrockwell"}}>

                        2. Profile Information

                    </div>


                    </div>
                    <div style={{marginLeft:10, width: 2, minHeight:200, height:"100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", width: 530 }}>

                        <div style={{ width: "100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                            {showIndex == 0 &&
                            <div style={{
                                flex:1,
                                width:"490px",
                                padding:"20px",
                                fontFamily: "WebRockwell",
                                color: "#cdd4da",
                                fontSize: "18px",
                                display: "flex",  flexDirection:"column",
                                alignItems: "center",  
                            }}>
                               
                               
                                <div style={{
                                    fontSize:"13px"
                                }}>

                                    arcturus.config.json

                                </div>
                                <div style={{

                                    marginTop: "5px",
                                    height: "1px",
                                    width: "100%",
                                    backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                                }}/>

                                <div style={{ paddingLeft: 15, paddingTop:5, width:"100%",backgroundColor:"#33333320"}}>


                                    <div style={{ display: "flex", paddingTop: 15, width:"100%" }} >
                                        <div style={{ marginRight: 10, alignItems: "flex-end", width: 190,  fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                            Engine Key:
                                        </div>
                                        <div> <input
                                            ref={codeRef}
                                            placeholder="(generate)"
                                            autoFocus
                                            type={"text"}
                                            style={{
                                                width: 250,
                                                fontSize: 14,
                                                marginTop: 5,
                                                textAlign: "left",
                                                border: "0px",
                                                outline: 0,
                                                color: "white",
                                                backgroundColor: "#00000000",
                                                fontFamily: "webrockwell"
                                            }} /> </div>
                                        <div onClick={onGenerateClick} style={{ paddingTop: 5, height: 10, fontSize: 14, width: 100 }} className={styles.OKButton} > Generate </div>
                                    </div>

                                    <div style={{ display: "flex", paddingTop: 15, width:"100%"}} >
                                        <div style={{ marginRight: 0, alignItems: "flex-end", width: 160, fontSize: 14,  display: "flex", color: "#ffffff80" }}>
                                            Default File Sharing:
                                        </div>
                                        <div style={{ flex:1} }> 
                                            
                                            <SelectBox 
                                                ref={sharingPermissionsRef}
                                                textStyle={{
                                                    color:"#ffffff",
                                                    fontFamily:"Webrockwell",
                                                    border:0,
                                                    fontSize: 14,
                                                }}
                                                optionsStyle={{
                                                    
                                                    backgroundColor:"#333333C0",
                                                    paddingTop:5,
                                                    fontSize:14,
                                                    fontFamily:"webrockwell"
                                                }}
                                            
                                                defaultValue={"NULL:NULL"}   placeholder="Class" options={[
                                                    { value: "ALL:ALL", label: "Everyone" },
                                                    { value: "NULL:NULL", label: "(disabled)" } 
                                            ]} />
                                         </div>
                                        <div  style={{ paddingTop: 5, height: 10, fontSize: 14, width: 150 }} > </div>
                                    </div>
                                        <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                            <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                Custom Folders:
                                            </div>
                                            <div style={{ cursor: "pointer", paddingLeft: 0, }} className={styles.checkPos} onClick={(e) => { setDefaultFolders(prev => !prev) }} >
                                                <div className={!defaultFolders ? styles.check : styles.checked} />
                                            </div>
                                        </div>

                                   
                                

                                <div style={{ height: "20px" }}></div>

                                    
                                
                                </div>
                                    {defaultFolders &&
                                        <>
                                       

                                            <div style={{ display: "flex", paddingTop:10,  width: "100%" }} >
                                                <div style={{ marginRight: 10, alignItems: "flex-end", width: 150, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                    Images Folder:
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div onClick={async function (e){
                                                        try {
                                                            const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

                                                            const name = await dirHandle.name;
                                                          
                                                            
                                                            setCustomFolders(
                                                                produce((state)=>{
                                                                    state.images = {name:name, handle:dirHandle};
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
                                                    Textures Folder:
                                                </div>
                                                <div style={{ flex: 1 }}>

                                                <div onClick={async function (e) {
                                                    try {
                                                        const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

                                                        const name = await dirHandle.name;
                                                        setCustomFolders(
                                                            produce((state) => {
                                                                state.textures = { name: name, handle: dirHandle };
                                                            })
                                                        )

                                                        setTexturesDefault(false)
                                                    } catch (error) {
                                                        if (error == DOMException.ABORT_ERR) {

                                                        }
                                                        setTexturesDefault(true)
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
                                                            color: texturesDefault ? "#ffffff80" : "white",  
                                                            fontFamily: "webrockwell"
                                                        }} >
                                                        {texturesDirectory.name}
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
                                                <div style={{ marginRight: 10, alignItems: "flex-end", width:190, fontSize: 14, display: "flex", color: "#ffffff80" }}>
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
                            </div>
                            }
                          
                        </div>
                       
                    </div>
                    
                </div>
                
                <div style={{
                    justifyContent: "center",

                    paddingTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}><div style={{ width: 190 }}></div>
                    <div style={{ paddingLeft: 10, paddingRight: 10, width: 40 }} className={styles.CancelButton} onClick={onCancelClick}>Back</div>

                    <div style={{

                        marginLeft: "30px", marginRight: "30px",
                        height: "50px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}>

                    </div>
                    <div className={styles.OKButton} onClick={onOKclick} >Next</div>
                </div>
            </div>
       
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
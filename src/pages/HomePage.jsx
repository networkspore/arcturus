import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './css/home.module.css';
import produce from 'immer';

import { ImageDiv } from './components/UI/ImageDiv';
import { LocalStoragePage } from './LocalStoragePage';
import { AccountSettingsPage } from './AccountSettingsPage';
import { PeerNetworkPage } from './PeerNetworkPage';
import { ImagePicker } from './components/UI/ImagePicker';







export const HomePage = (props ={}) => {
                 
    const localDirectory = useZust((state) => state.localDirectory)

    const assetsDirectory = useZust((state) => state.assetsDirectory)
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const modelsDirectory = useZust((state) => state.modelsDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);
    const cachesDirectory = useZust((state) => state.cachesDirectory)
    const className = styles.bubble__item;

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
   
    const [showIndex, setshowIndex] = useState(0)
    const navigate = useNavigate();


    const [subDirectory, setSubDirectory] = useState("")
    const [subSubDirectory, setSubSubDirectory] = useState("")
    const [subSubSubDirectory, setSubSubSubDirectory] = useState("")

    const location = useLocation();

    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const onLogoutClick = (e) => {
        window.location.replace("/")
    
    }


 
/* <ImageDiv clsssName={styles.bubble__item} onClick={(e) => {
                        setshowIndex(10)
                    }} width={130} height={130} about={"Select Image"} netImage={{
                        update: {
                            command: "getIcon",
                            file: user.image,
                            waiting: { url: "/Images/spinning.gif" },
                            error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                        },
                        backgroundColor: "#44444450",
                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                    }} />*/





    useEffect(()=>{
        const currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)
        
    
            const thirdSlash = subLocation.indexOf("/", 1)
            const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)
            const fourthSlash = subLocation.indexOf("/", thirdSlash == -1 ? subLocation.length : thirdSlash + 1)
            
            const ssD = thirdSlash != -1 ? subLocation.slice(thirdSlash, fourthSlash == -1 ? subLocation.length : fourthSlash) : ""
         
            const fifthSlash = subLocation.indexOf("/", fourthSlash == -1 ? subLocation.length : fourthSlash + 1)
        const sssD = fourthSlash != -1 ? subLocation.slice(fourthSlash, fifthSlash == -1 ? subLocation.length : fifthSlash) : ""

            setSubDirectory(sD)
            setSubSubDirectory(ssD)
            setSubSubSubDirectory(sssD)
      
            switch(sD)
            {
                case "/localstorage":
                    setshowIndex(2)
                break;
                case "/peernetwork":
                    setshowIndex(3)
                    break;
                case "/account":
                    setshowIndex(4)
                    break;

                default:
                    setshowIndex(0)
            }
        
        
    },[location])

  

    return (
        
       <>
            
            <div  style={{ display: "flex", flexDirection: "column", position: "fixed",  backgroundImage: "linear-gradient(to bottom, #000000,#20232570)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>


                <div about={"Account"} onClick={(e) => {
                    navigate("/home/account")
                }} style={{ cursor:"pointer", display: "flex", flexDirection: "column", alignItems:"center", padding:"10px"}}>
                   


                    <ImageDiv className={styles.glow} width={150} height={150}  netImage={{
                        scale:1,
                        update: {
                            command: "getIcon",
                            file: user.image,
                            waiting: { url: "/Images/spinning.gif", style: { filter: "invert(0%)" }},
                            error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                        },
                        backgroundColor: "#44444450",
                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                    }} />

                    <div style={{height:20}}> &nbsp;</div>
                    <div  style={{cursor:"pointer",  paddingTop:5, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                        <div 
                            className={styles.glow}
                            style={{

                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "15px",
                            fontWeight: "bolder",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",

                        }} >{ user.userName }</div>

                    </div>

                    <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>


                </div>
                <div style={{height:10}}>&nbsp;</div>
                <div style={{ width: 260, paddingLeft:"15px", display:"flex", flexDirection:"column",  }}>
                    
                    
                     

                   
                   
                    <div onClick={(e) => { navigate("/home/localstorage") }} className={styles.result} 
                    style={{ 
                       
                        color: subDirectory == "/localstorage" ? "white" : "", 
                       
                        fontSize: "15px", 
                        fontFamily: "WebPapyrus", 
                       
                         }}>

                            <div>
                            <ImageDiv netImage={{ filter: subDirectory == "/localstorage" ? "invert(100%)" : "invert(70%)", image:"/Images/icons/server-outline.svg"}} width={20} height={20} />
                            </div>
                            <div style={{display:"flex", paddingLeft: "10px" }} >
                                Local Storage
                            </div>
                        </div>
                 
                    {subDirectory == "/localstorage" && localDirectory.handle != null &&
                    <div style={{marginLeft:30}}>
                          
                                <>
                                <div onClick={(e) => { navigate("/home/localstorage/all") }} 
                                style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                        <img 
                                        style={{ filter: subSubDirectory == "/all" ? "invert(100%)" : "invert(80%)", }} 
                                        src={subSubDirectory == "/all" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} 
                                        width={20} height={20} 
                                        />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubDirectory == "/all" ? "white" : "" }} >
                                        All
                                    </div>
                                </div>
                                <div onClick={(e) => { navigate("/home/localstorage/apps") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                        <img style={{ filter: subSubDirectory == "/apps" ? "invert(100%)" : "invert(80%)", }} src={subSubDirectory == "/apps" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubDirectory == "/apps" ? "white" : "" }} >
                                        Apps
                                    </div>
                                </div>

                                <div onClick={(e) => { navigate("/home/localstorage/assets") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                        <img style={{ filter: subSubDirectory == "/assets" ? "invert(100%)" : "invert(80%)", }} src={subSubDirectory == "/assets" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubDirectory == "/assets" ? "white" : "" }} >
                                        Assets
                                    </div>
                                </div>
                                {subSubDirectory == "/assets" &&
                                        <div style={{ marginLeft: 20 }} >

                                            <div onClick={(e) => { navigate("/home/localstorage/assets/pcs") }} className={styles.result}
                                                style={{ padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                                            <ImageDiv netImage={{ filter: location.pathname == "/home/localstorage/assets/pcs" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/localstorage/assets/pcs" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/localstorage/assets/pcs" ? "white" : "" }} >
                                                    Playable Characters
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/localstorage/assets/npcs") }} className={styles.result}
                                                style={{
                                                    padding: 5,
                                                    display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                                }}>
                                            <ImageDiv netImage={{ filter: location.pathname == "/home/localstorage/assets/npcs" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/localstorage/assets/npcs" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/localstorage/assets/npcs" ? "white" : "" }} >
                                                    Non-Playable Characters
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/localstorage/assets/placeables") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                            <ImageDiv netImage={{ filter: location.pathname == "/home/localstorage/assets/placeables" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/localstorage/assets/placeables" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/localstorage/assets/placeables" ? "white" : "" }} >
                                                    Placeable Models
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/localstorage/assets/textures") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                            <ImageDiv netImage={{ filter: location.pathname == "/home/localstorage/assets/textures" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/localstorage/assets/textures" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/localstorage/assets/textures" ? "white" : "" }} >
                                                    Textures
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/localstorage/assets/terrain") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                            <ImageDiv netImage={{ filter: location.pathname == "/home/localstorage/assets/terrain" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/localstorage/assets/terrain" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/localstorage/assets/terrain" ? "white" : "" }} >
                                                    Terrain
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/localstorage/assets/types") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                            <ImageDiv netImage={{ filter: location.pathname == "/home/localstorage/assets/types" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/localstorage/assets/types" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/localstorage/assets/types" ? "white" : "" }} >
                                                    Types
                                                </div>
                                            </div>

                                        </div>
                                    }</>
                            
                
                     
                        <div onClick={(e) => { navigate("/home/localstorage/images") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: subSubDirectory == "/images" ? "invert(100%)" : "invert(80%)", }} src={subSubDirectory == "/images" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px", color: subSubDirectory == "/images" ? "white" : "" }} >
                                Images
                            </div>
                        </div>
                     
               
                     
                        <div onClick={(e) => { navigate("/home/localstorage/models") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: subSubDirectory == "/models" ? "invert(100%)" : "invert(80%)", }} src={subSubDirectory == "/models" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px", color: subSubDirectory == "/models" ? "white" : "" }} >
                                Models
                            </div>
                        </div>
                    
                    
                           
             
               
                 
                                <div onClick={(e) => { navigate("/home/localstorage/media") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                    <ImageDiv  netImage={{ borderRadius:"",  backgroundColor: "", scale: 1, image: subSubDirectory == "/media" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg", filter: subSubDirectory == "/media" ? "invert(100%)" : "invert(80%)" }} width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubDirectory == "/media" ? "white" : "" }} >
                                        Media
                                    </div>
                                </div>
                            {subSubDirectory == "/media" &&
                                <div style={{ marginLeft: 20 }} >
                                    <div onClick={(e) => { navigate("/home/localstorage/media/audio-video") }} 
                                    style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} 
                                    className={styles.result} >
                                        <div>
                                            <ImageDiv  netImage={{ borderRadius:"",  backgroundColor: "", scale: 1, image: subSubSubDirectory == "/audio-video" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg", filter: subSubSubDirectory == "/audio-video" ? "invert(100%)" : "invert(80%)" }} width={20} height={20} />
                                        </div>
                                        <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/audio-video" ? "white" : "" }} >
                                            Audio-Video
                                        </div>
                                    </div>
                                    <div onClick={(e) => { navigate("/home/localstorage/media/audio") }}
                                        style={{  fontSize: "15px", fontFamily: "WebPapyrus" }}
                                        className={styles.result} >
                                        <div>
                                            <ImageDiv  netImage={{ borderRadius:"",  backgroundColor: "", scale: 1, image: subSubSubDirectory == "/audio" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg", filter: subSubSubDirectory == "/audio" ? "invert(100%)" : "invert(80%)" }} width={20} height={20} />
                                        </div>
                                        <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/audio" ? "white" : "" }} >
                                            Audio
                                        </div>
                                    </div>
                                    <div onClick={(e) => { navigate("/home/localstorage/media/video") }}
                                        style={{  fontSize: "15px", fontFamily: "WebPapyrus" }}
                                        className={styles.result} >
                                        <div>
                                            <ImageDiv  netImage={{ borderRadius:"", backgroundColor:"", scale: 1, image: subSubSubDirectory == "/video" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg", filter: subSubSubDirectory == "/video" ? "invert(100%)" : "invert(80%)" }} width={20} height={20} />
                                        </div>
                                        <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/video" ? "white" : "" }} >
                                            Video
                                        </div>
                                    </div>
                                </div>
                            }
                                      
                           
                        
                           
                    </div>
                    }
                    
                    
                  
                    <div onClick={(e) => { navigate("/home/peernetwork")}} className={styles.result}  style={{ color: subDirectory == "/peernetwork" ? "white" : "", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                        <div>
                            <ImageDiv  netImage={{  scale:.7, image: "/Images/icons/cloud-outline.svg", filter:subDirectory == "/peernetwork" ?"invert(100%)" :"invert(70%)" }} width={25} height={25} />
                        </div>
                        <div style={{ paddingLeft: "10px" }} >
                            Peer Network
                        </div>
                    </div>
                  
                    {subDirectory == "/peernetwork" && localDirectory.handle != null &&
                    <div style={{marginLeft: 20}}>
                            <NavLink className={styles.result} to={"/home/peernetwork/library"}>
                                <div style={{ color: subSubDirectory == "/library" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                                    <div>
                                        <img style={{ filter: "invert(100%)" }} src="/Images/icons/library-outline.svg" width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }} >
                                       Library
                                    </div>
                                </div>
                            </NavLink>
          
                            {subSubDirectory == "/library" &&
                        <div style={{ marginLeft: 30 }}>
                            {assetsDirectory.handle != null &&
                                <>

                                        <div onClick={(e) => { navigate("/home/peernetwork/library/all") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                            <div >
                                                <img style={{ filter: subSubSubDirectory == "/all" ? "invert(100%)" : "invert(80%)", }} src={subSubSubDirectory == "/all" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                            </div>
                                            <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/all" ? "white" : "" }} >
                                                All
                                            </div>
                                        </div>
                                    <div onClick={(e) => { navigate("/home/peernetwork/library/assets") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                        <div >
                                                <img style={{ filter: subSubSubDirectory == "/assets" ? "invert(100%)" : "invert(80%)", }} src={subSubSubDirectory == "/assets" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                        </div>
                                            <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/assets" ? "white" : "" }} >
                                            Assets
                                        </div>
                                    </div>
                                    {subSubSubDirectory == "/assets" &&
                                        <div style={{ marginLeft: 20 }} >

                                            <div onClick={(e) => { navigate("/home/peernetwork/library/assets/pcs") }} className={styles.result}
                                                style={{ padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                                                <ImageDiv  netImage={{ borderRadius:"",  filter: location.pathname == "/home/peernetwork/library/assets/pcs" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/peernetwork/library/assets/pcs" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/assets/pcs" ? "white" : "" }} >
                                                    PCs
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/peernetwork/library/assets/npcs") }} className={styles.result}
                                                style={{
                                                    padding: 5,
                                                    display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                                }}>
                                                <ImageDiv  netImage={{ borderRadius:"",  filter: location.pathname == "/home/peernetwork/library/assets/npcs" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/peernetwork/library/assets/npcs" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/assets/npcs" ? "white" : "" }} >
                                                    NPCs
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/peernetwork/library/assets/placeables") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                                <ImageDiv  netImage={{ borderRadius:"",  filter: location.pathname == "/home/peernetwork/library/assets/placeables" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/peernetwork/library/assets/placeables" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/assets/placeables" ? "white" : "" }} >
                                                    Placeable Models
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/peernetwork/library/assets/textures") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                                <ImageDiv  netImage={{ borderRadius:"",  filter: location.pathname == "/home/peernetwork/library/assets/textures" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/peernetwork/library/assets/textures" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/assets/textures" ? "white" : "" }} >
                                                    Textures
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/peernetwork/library/assets/terrain") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                                <ImageDiv  netImage={{ borderRadius:"",  filter: location.pathname == "/home/peernetwork/library/assets/terrain" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/peernetwork/library/assets/terrain" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/assets/terrain" ? "white" : "" }} >
                                                    Terrain
                                                </div>
                                            </div>

                                            <div onClick={(e) => { navigate("/home/peernetwork/library/assets/types") }} className={styles.result} style={{
                                                padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                                            }}>
                                                <ImageDiv  netImage={{ borderRadius:"",  filter: location.pathname == "/home/peernetwork/library/assets/types" ? "invert(100%)" : "invert(80%)", backgroundColor: "", image: location.pathname == "/home/peernetwork/library/assets/types" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg" }} width={20} height={20} />

                                                <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/assets/types" ? "white" : "" }} >
                                                    Types
                                                </div>
                                            </div>

                                        </div>
                                    }
                                       
                                    </>
                                    
                            }
                                

                            {imagesDirectory.handle != null &&

                                <div onClick={(e) => { navigate("/home/peernetwork/library/images") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                        <img style={{ filter: subSubSubDirectory == "/images" ? "invert(100%)" : "invert(80%)", }} src={subSubSubDirectory == "/images" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/images" ? "white" : "" }} >
                                        Images
                                    </div>
                                </div>

                            }
                            {modelsDirectory.handle != null &&

                                <div onClick={(e) => { navigate("/home/peernetwork/library/models") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                        <img style={{ filter: subSubSubDirectory == "/models" ? "invert(100%)" : "invert(80%)", }} src={subSubSubDirectory == "/models" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/models" ? "white" : "" }} >
                                        Models
                                    </div>
                                </div>

                            }


                            {mediaDirectory.handle != null &&
                                <>
                                <div onClick={(e) => { navigate("/home/peernetwork/library/media") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                    <div>
                                        <img style={{ filter: subSubSubDirectory == "/media" ? "invert(100%)" : "invert(80%)", }} src={subSubSubDirectory == "/media" ? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px", color: subSubSubDirectory == "/media" ? "white" : "" }} >
                                        Media
                                    </div>
                                </div>
                                {subSubSubDirectory == "/media" &&
                                        <div style={{ marginLeft: 20 }} >
                                                <div onClick={(e) => { navigate("/home/peernetwork/library/media/audio") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                                    <div>
                                                        <img style={{ filter: location.pathname == "/home/peernetwork/library/media/audio"? "invert(100%)" : "invert(80%)", }} src={location.pathname == "/home/peernetwork/library/media/audio"? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                                    </div>
                                                    <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/media/audio"? "white" : "" }} >
                                                        Audio
                                                    </div>
                                                </div>
                                                <div onClick={(e) => { navigate("/home/peernetwork/library/media/video") }} style={{  fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                                    <div>
                                                        <img style={{ filter: location.pathname == "/home/peernetwork/library/media/video"? "invert(100%)" : "invert(80%)", }} src={location.pathname == "/home/peernetwork/library/media/video"? "/Images/icons/folder-open-outline.svg" : "/Images/icons/folder-outline.svg"} width={20} height={20} />
                                                    </div>
                                                    <div style={{ paddingLeft: "10px", color: location.pathname == "/home/peernetwork/library/media/video"? "white" : "" }} >
                                                        Video
                                                    </div>
                                                </div>
                                        </div>
                                        
                                }
                                </>
                            }

                                    
                        </div>
                        }
                           
                        </div>
                    }
                </div>
                <div  style={{ height: "100%", width: 290, display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", marginBottom: 50, marginTop: 50, }}>
                    <div onClick={(e) => { window.location.replace("/") }} style={{ width: 100, height: 30, borderRadius: 10 }} className={styles.bubbleButton}>Log Out</div>
                </div>

            </div>
       
      
        

            {showIndex == 2 &&
                <LocalStoragePage cancel={() => { setshowIndex(0) }} onReload={() => { 
                   console.log("homepage reload")
                    props.onReload() }}/>
            }
            
            {showIndex == 3 &&
                <PeerNetworkPage cancel={() => { setshowIndex(0) }} />
            }
            {showIndex == 4 &&
                <AccountSettingsPage cancel={() => { setshowIndex(0) }}  />
            }
            
           
       </>
        
    )
}

/* 
 <NavLink className={styles.result} to={"/home/peernetwork/status"}>
                                <div style={{ color: subSubDirectory == "/status" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                                    <div>
                                        <img style={{ filter: "invert(100%)" }} src="/Images/icons/pulse-outline.svg" width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }} >
                                        Status
                                    </div>
                                </div>
                            </NavLink>
                            {subSubDirectory == "/status" &&
                            <div style={{paddingLeft:20}}>
                            <NavLink className={styles.result} to={"/home/peernetwork/status/downloads"}>
                                <div style={{ color: subSubDirectory == "/downloads" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                                    <div>
                                        <img style={{ filter: "invert(100%)" }} src="/Images/icons/cloud-download-outline.svg" width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }} >
                                        Downloads
                                    </div>
                                </div>
                            </NavLink>
                            <NavLink className={styles.result} to={"/home/peernetwork/status/uploads"}>
                                <div style={{ color: subSubDirectory == "/uploads" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                                    <div>
                                        <img style={{ filter: "invert(100%)" }} src="/Images/icons/cloud-upload-outline.svg" width={20} height={20} />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }} >
                                        Uploads
                                    </div>
                                </div>
                            </NavLink>
                            </div>}

<div  style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
                        onClick={(e) => {
                            setshowIndex(1)
                        }}
                    >

                        <div>
                            <img style={{ filter: "invert(100%)" }} src="Images/icons/person-circle-outline.svg" width={20} height={20} />
                        </div>
                        <div style={{ paddingLeft: "10px" }} >
                           Profile
                        </div>
                    </div>*/
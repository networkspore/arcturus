import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './css/home.module.css';
import produce from 'immer';

import { ContactsPage } from './ContactsPage';
import { ProfilePage } from './ProfilePage';
import { ImageDiv } from './components/UI/ImageDiv';
import { LocalStoragePage } from './LocalStoragePage';
import { AccountSettingsPage } from './AccountSettingsPage';
import { PeerNetworkPage } from './PeerNetworkPage';
import { ImagePicker } from './components/UI/ImagePicker';






export const HomePage = (props ={}) => {
                 
    const terrainDirectory = useZust((state) => state.terrainDirectory);
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const modelsDirectory = useZust((state) => state.modelsDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);
    const cachesDirectory = useZust((state) => state.cachesDirectory)
    const className = styles.bubble__item;

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const updateUserImage = useZust((state) => state.updateUserImage)
    const [showIndex, setshowIndex] = useState(0)
    const navigate = useNavigate();


    const [subDirectory, setSubDirectory] = useState("")

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
           
            setSubDirectory(sD)
            
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

    const onUpdateUserImage = (onUpdate) =>{
        const file = onUpdate.file

        const fileInfo = {
            name: file.name, 
            crc: file.crc, 
            size: file.size, 
            type: file.type, 
            mimeType: file.mimeType, 
            lastModified: file.lastModified
        }
       

        setSocketCmd({cmd: "updateUserImage", params:{imageInfo:fileInfo, accessID: onUpdate.accessID, userAccess: onUpdate.userAccess}, callback:(updateResult)=>{
            if("success" in updateResult && updateResult.success)
            {
                updateUserImage(updateResult.file)
            }

        }})
    }

    return (
        
       <>
            
            <div style={{display:"flex", flexDirection:"column", position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
                <div style={{
                    padding: "10px",
                    textAlign: "center",
                 
                }}></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems:"center", padding:"10px"}}>
                   


                    <ImageDiv width={150} height={150} onClick={(e) => {
                        setshowIndex(10)
                    }}  about={"Select Image"}  className={className} netImage={{
                        scale:1,
                        update: {
                            command: "getImage",
                            file: user.image,
                            waiting: { url: "/Images/spinning.gif" },
                            error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                        },
                        backgroundColor: "#44444450",
                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                    }} />

                    <div style={{height:20}}> &nbsp;</div>
                    <div style={{  paddingTop:5, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                        <div style={{

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
                    
                    
                        <NavLink className={styles.result}  to={ "/home/account"}>
                        <div  style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
                          
                        >

                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/id-card-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Account Settings
                            </div>
                        </div>
                        </NavLink>
                

                   
                   
                    <div onClick={(e) => { navigate("/home/localstorage") }} className={styles.result} style={{ color: subDirectory == "/localstorage" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/server-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Local Storage
                            </div>
                        </div>
                 
                    {subDirectory == "/localstorage" &&
                    <div style={{marginLeft:30}}>
                    {imagesDirectory.handle != null &&
                     
                        <div onClick={(e) => { navigate("/home/localstorage/images")}}  style={{ color: location.pathname == "/home/localstorage/images" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Images
                            </div>
                        </div>
                     
                    } 
                    {modelsDirectory.handle != null &&
                     
                            <div onClick={(e) => { navigate("/home/localstorage/models") }}  style={{ color: location.pathname == "/home/localstorage/models" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                <div>
                                    <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                                </div>
                                <div style={{ paddingLeft: "10px" }} >
                                    Models
                                </div>
                            </div>
                    
                    }
                           
                    {terrainDirectory.handle != null &&
                     
                        <div onClick={(e) => { navigate("/home/localstorage/terrain") }} style={{ color: location.pathname == "/home/localstorage/terrain" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Terrain
                            </div>
                        </div>
                  
                            }
                    {mediaDirectory.handle != null &&
                 
                        <div onClick={(e) => { navigate("/home/localstorage/media") }} style={{ color: location.pathname == "/home/localstorage/media" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Media
                            </div>
                        </div>
                   
                            }
                            {cachesDirectory.handle != null &&
                                
                                <div onClick={(e) => { navigate("/home/localstorage/cache") }} style={{ color: location.pathname == "/home/localstorage/cache" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                        <div>
                                            <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                                        </div>
                                        <div style={{ paddingLeft: "10px" }} >
                                            Cache
                                        </div>
                                    </div>
                              
                            }
                    </div>
                    }
                    <NavLink className={styles.result}  to={"/home/peernetwork"}>
                        <div  style={{ color: subDirectory == "/peernetwork" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/cloud-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Peer Network
                            </div>
                        </div>
                    </NavLink>
                   
                </div>
                <div onClick={(e) => { window.location.replace("/") }} style={{ height: "100%", width: 290, display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", marginBottom: 50, marginTop: 50, }}>
                    <div style={{ width: 100, height: 30, borderRadius: 10 }} className={styles.bubbleButton}>Log Out</div>
                </div>

            </div>
       
      
        

            {showIndex == 2 &&
                <LocalStoragePage cancel={() => { setshowIndex(0) }} />
            }
            
            {showIndex == 3 &&
                <PeerNetworkPage cancel={() => { setshowIndex(0) }} />
            }
            {showIndex == 4 &&
                <AccountSettingsPage cancel={() => { setshowIndex(0) }}  />
            }
            {showIndex == 10 &&
                <ImagePicker selectedImage={user.image} 
                    onCancel ={()=>{
                        setshowIndex(0)
                    }}
                    onOk={onUpdateUserImage}
                />
            }
       </>
        
    )
}

/* <div  style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
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
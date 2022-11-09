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






export const HomePage = (props ={}) => {
                 
    const terrainDirectory = useZust((state) => state.terrainDirectory);
    const imagesDirectory = useZust((state) => state.imagesDirectory);
    const objectsDirectory = useZust((state) => state.objectsDirectory);
    const mediaDirectory = useZust((state) => state.mediaDirectory);

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const [showIndex, setshowIndex] = useState(0)
    const nav = useNavigate();
    const setUser = useZust((state) => state.setUser)

    const [subDirectory, setSubDirectory] = useState("")

    const location = useLocation();

    const configFile = useZust((state) => state.configFile)

    const [profile, setProfile] = useState({
        name:"Offline", 
        image:{}
    });


    const onLogoutClick = (e) => {
        props.logOut();
    
    }


    const getProfile = (callback) => {
      //  if (configFile.handle == null) {

            const defaultProfile = {
                name: user.userName,
                image: {
                    image:"/Images/icons/person.svg",
                    backgroundColor: "#44444450",
                    backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                    width: 130,
                    height: 130,
                    filter: "invert(100%)",
                },
                
            }

            callback(defaultProfile)
      //  }
    }




    useEffect(()=>{
        
        getProfile((value)=>{
            setProfile(value)
        })
    },[configFile])



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

    return (
        
       <>
            
            <div style={{ position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
                <div style={{
                    padding: "10px",
                    textAlign: "center",
                 
                }}></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems:"center",  height:"150px", padding:"10px"}}>
                    <ImageDiv netImage={profile.image} />
                    <div style={{ paddingTop:5, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                        <div style={{

                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "15px",
                            fontWeight: "bolder",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",

                        }} >{ profile.name }</div>

                    </div>

                    <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                </div>
                        
                <div style={{ width: 260, paddingLeft:"15px" }}>
                    
                    
                        <NavLink to={ "/home/account"}>
                        <div className={styles.result} style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
                          
                        >

                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/id-card-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Account Settings
                            </div>
                        </div>
                        </NavLink>
                

                   
                    <NavLink to={"/home/localstorage"}>
                        <div className={styles.result} style={{ color: subDirectory == "/localstorage" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/server-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Local Storage
                            </div>
                        </div>
                    </NavLink>
                    {subDirectory == "/localstorage" &&
                    <div style={{marginLeft:30}}>
                    {imagesDirectory.handle != null &&
                        <NavLink to={"/home/localstorage/images"}>
                                    <div style={{ color: location.pathname == "/home/localstorage/images" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                <div>
                                    <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                                </div>
                                <div style={{ paddingLeft: "10px" }} >
                                    Images
                                </div>
                            </div>
                        </NavLink>
                    }
                    {objectsDirectory.handle != null &&
                        <NavLink to={"/home/localstorage/objects"}>
                                    <div style={{ color: location.pathname == "/home/localstorage/objects" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                                <div>
                                    <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                                </div>
                                <div style={{ paddingLeft: "10px" }} >
                                    3D Objects
                                </div>
                            </div>
                        </NavLink>
                    }

                    {terrainDirectory.handle != null &&
                        <NavLink to={"/home/localstorage/terrain"}>
                                    <div style={{ color: location.pathname == "/home/localstorage/terrain" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Terrain
                            </div>
                        </div>
                        </NavLink>
                    }
                    {mediaDirectory.handle != null &&
                        <NavLink to={"/home/localstorage/media"}>
                                    <div style={{ color: location.pathname == "/home/localstorage/media" ? "white" : "#777171", paddingLeft: 10, display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }} className={styles.result} >
                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/folder-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Media
                            </div>
                        </div>
                        </NavLink>
                    }

                    </div>
                    }
                    <NavLink to={"/home/peernetwork"}>
                        <div className={styles.result} style={{ color: subDirectory == "/peernetwork" ? "white" : "", display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                            <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/cloud-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Peer Network
                            </div>
                        </div>
                    </NavLink>
                </div>
               

            </div>
       
            <div style={{ 
                
                position: "fixed", 
                width:60, height: "70px",
                left: 335, 
                bottom: "0px", 
                fontFamily:"Webpapyrus",
                display: "flex", justifyContent:"center",alignItems: "center",
                 
                 }}
                className={styles.menuLeft__item} 
                about={"Log-out"} 
                onClick={onLogoutClick}
            >
               
                <ImageDiv width={40} height={40} style={{borderRadius: 10,}}  netImage={{backgroundColor: "", image: "/Images/icons/lock-open-outline.svg", filter: "invert(100%)"}} />
                  
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
       </>
        
    )
}

/* <div className={styles.result} style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
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
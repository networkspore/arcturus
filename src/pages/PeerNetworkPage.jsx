import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import styles from './css/home.module.css';

import { set, del } from 'idb-keyval';
import produce from 'immer';
import {  useLocation, useNavigate, NavLink} from 'react-router-dom';


import { ImageDiv } from './components/UI/ImageDiv';
import { getFileInfo } from '../constants/utility';
import { PeerNetworkMenu } from './PeerNetworkMenu';


export const PeerNetworkPage = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const localDirectory = useZust((state) => state.localDirectory)

    const peerConnection = useZust((state)=> state.peerConnection)
    const peerOnline = useZust((state) => state.peerOnline)
 
    const configFile = useZust((state) => state.configFile)


    const [showIndex, setShowIndex] = useState(); 



    function refreshOnClick(e) {

    }


    const [subDirectory, setSubDirectory] = useState("")
    

    useEffect(()=>{

        const config = configFile.value;

        const currentLocation = location.pathname;
        const directory = "/home/peernetwork";

        const thirdSlash = currentLocation.indexOf("/",directory.length)

        const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash) : "";
        setSubDirectory(l)

        switch(l){
            case "/settings":
                setShowIndex(1)
                break;
            default:
                if(config != null){
                    if(config.peer2peer){
                        setShowIndex(2);
                    }else{
                        setShowIndex(0)
                    }
                }else{
                    setShowIndex(0)
                }
                break;
        }
          


    },[location])

    const disable = useRef({value:false})


    const turnOffPeerNetwork = () => {
        navigate("/home/localstorage/init")
    }
    const setPeerConnection = useZust((state) => state.setPeerConnection)
    const onReload = () =>{
        setPeerConnection(null)
    }

    return (
        
       <>
            <div  style={{
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.95)",
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
                    Peer Network
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
                        turnOffPeerNetwork()
                    }} about={peerConnection == null ? "Start" : "Turn off"} className={styles.tooltip__item} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }}>

                        <img src='/Images/icons/power-outline.svg' width={25} height={25} style={{ 
                            filter: peerConnection == null ? "Invert(25%)" : peerOnline ? "invert(100%) drop-shadow(0px 0px 3px white)" : "invert(60%) drop-shadow(0px 0px 3px #faa014)"
                        }} />

                    </div>
                   
                    
                    <div onClick={(e)=>{
                        onReload()
                    }} about={"Reconnect"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >
                     
                        <img src='/Images/icons/refresh-outline.svg' width={25} height={25} style={{ filter: peerConnection == null ? "Invert(25%)" : "Invert(100%"}} />
                     
                    </div>

                    
                    <div  style={{ 
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
                                <img src={peerOnline ? '/Images/icons/cloud-outline.svg' : "/Images/icons/cloud-offline-outline.svg" } style={{
                                    width:"20px",
                                    height:"20px",
                                    filter: peerConnection == null ? "Invert(25%)" : "invert(100%)"
                                }} />
                            </div>
                            {peerConnection != null &&
                                <div style={{ color:  "#cdd4da",}}>
                                    webRTC://
                                </div>
                            }
                            <div style={{flex:1}}>
                                <div style={{
                                    paddingTop:"2px",
                                    paddingLeft:"2px",
                                    width: "100%",
                                    height: "18px",
                                    textAlign: "left",
                                    border: "0px",
                                    color: peerConnection == null ? "#777777" : "#cdd4da",
                                    backgroundColor: "#00000000",
                                    fontFamily: "Webrockwell", 
                                    fontSize: "14px",        
                                }}>
                                    {peerConnection == null ? configFile.value == null ? "Initialize local storage..." : configFile.value.peer2peer ?  "Reconnect..." : "Peer Network disabled" : "peernetwork"}{subDirectory}
                                </div>
                                
                            </div>
                        </div>
                        <div style={{width:30}}>
                   
                            
                        
                        </div>
                    </div>
                  
                </div>
            <div style={{  display: "flex", flex:1, height:(pageSize.height-100), padding:"15px" }}>

             
               
                {showIndex == 0 &&
                        <div onClick={(e) => { navigate("home/localstorage/init") }}
                             style={{display:"flex",width:"100%", height:"100%", flexDirection:"column", alignItems:"center",justifyContent:"center", color:"white",
                        }}>
                            <ImageDiv 
                                style={{cursor:"pointer"}}
                                width={"80"}
                                height={"80"}
                                netImage={{
                                    image: "/Images/icons/cloud-offline-outline.svg",
                                    filter:"invert(100%)",
                                    width:40,
                                    height:40 
                            }}/>  
                            <div  style={{ cursor:"pointer", color: "white"}} > Initialize local storage... </div>
                    </div>         
                }
               
                    {showIndex == 2 && peerOnline &&
                        <PeerNetworkMenu />
                    }
                    {showIndex == 1 &&
                        <div style={{ flex: 1, display: "block", color: "white" }}>
                            config
                        </div>
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
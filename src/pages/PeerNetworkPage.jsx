import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import styles from './css/home.module.css';
import SelectBox from './components/UI/SelectBox';
import {  useLocation, useNavigate, NavLink} from 'react-router-dom';

import FileList from './components/UI/FileList';
import { ImageDiv } from './components/UI/ImageDiv';
import { LibraryPage } from './LibraryPage';
import { PeerStatusPage } from './components/PeerStatusPage';


export const PeerNetworkPage = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const localDirectory = useZust((state) => state.localDirectory)

    const peerConnection = useZust((state)=> state.peerConnection)
    const userPeerID = useZust((state) => state.userPeerID)

   // const setPeerConnection = useZust((state) => state.setPeerConnection)
 
    const configFile = useZust((state) => state.configFile)


    const [showIndex, setShowIndex] = useState(); 

    const [currentSearchOption, setCurrentSearchOption] = useState(null)
    const [change, setChange] = useState("")

    
    const searchInputRef = useRef()
    const searchOptionRef = useRef()
    
    const [searchOptions, setSearchOptions] = useState([])

    const [currentPeer, setCurrentPeer] = useState({userID:null, userName:"null"})

    function refreshOnClick(e) {

    }


    const [subDirectory, setSubDirectory] = useState("")
    
    const handleChange = (e) => {
        setChange(e)
    }
    const searchOptionChanged = (index) => {
        setCurrentSearchOption(index)
    }

    useEffect(()=>{

        if(location.state != null && "currentPeer" in location.state){
            const statePeer = location.state.currentPeer
            const cPeer = {
                userID: statePeer.userID,
                userName: statePeer.userName
                
            }
            setCurrentPeer(cPeer)
        }else{
            const cPeer = {
                userID: user.userID,
                userName: user.userName

            }
            setCurrentPeer(cPeer)
        }

        const config = configFile.value;

        const currentLocation = location.pathname;
        const directory = "/home/peernetwork";

        const thirdSlash = currentLocation.indexOf("/",directory.length)
        const fourthSlash = currentLocation.indexOf("/", thirdSlash + 1)

        const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash, fourthSlash == -1 ? currentLocation.length : fourthSlash) : "";
        setSubDirectory(l)
        

        switch(l){
            case "/settings":
                setShowIndex(1)
                break;
            case "/status":
                setShowIndex(3)
                break;
          
            case "/library":
                setShowIndex(5)
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

    const onReload = () =>{
        if(peerConnection != null){
            peerConnection.reconnect()
        }
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
                    <div>Peer Network</div>
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
                            filter: peerConnection == null ? "Invert(25%)" : userPeerID != "" ? "invert(100%) drop-shadow(0px 0px 3px white)" : "invert(60%) drop-shadow(0px 0px 3px #faa014)"
                        }} />

                    </div>
                   
                   
                    <div onClick={(e)=>{
                        
                        navigate(location.pathname == "/home/peernetwork/status" ? "/home/peernetwork" : "/home/peernetwork/status")
                    }} about={location.pathname == "/home/peernetwork/status" ? "Back" :"Status"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >
                     
                        <img src={location.pathname == "/home/peernetwork/status" ? "/Images/icons/arrow-back-outline.svg" :'/Images/icons/pulse-outline.svg'} width={25} height={25} style={{ filter: "Invert(100%"}} />
                     
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
                                <img src={userPeerID != "" ? '/Images/icons/cloud-outline.svg' : "/Images/icons/cloud-offline-outline.svg" } style={{
                                    width:"20px",
                                    height:"20px",
                                    filter: peerConnection == null ? "Invert(25%)" : "invert(100%)"
                                }} />
                            </div>
                            
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
                                   {currentPeer.userName}://{peerConnection == null ? configFile.value == null ? "Initialize local storage..." : configFile.value.peer2peer ? "Reconnect..." : "Peer Network disabled" : location.pathname.slice(6, location.pathname.length)}
                                </div>
                                
                            </div>
                            

                            
                        </div>
                        <div style={{ width: 20 }}></div>
                        <div style={{
                            height: 30,

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
                                <SelectBox ref={searchOptionRef} onChange={searchOptionChanged} textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={searchOptions} />
                            </div>
                            <div  onClick={(e) => { searchInputRef.current.focus() }} style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", paddingRight:10, paddingLeft:10
                            }}>
                                <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                            </div>
                        </div>
                       
                        
                    </div>
                  
                </div>

                
            <div style={{  display: "flex", flex:1, height:(pageSize.height-100), margin:"30px" }}>

             
               
                {showIndex == 0 &&
                        <div onClick={(e) => { navigate("home/localstorage/init") }}
                             style={{display:"flex",width:"100%", height:"100%", flexDirection:"column", alignItems:"center",justifyContent:"center", color:"white",
                        }}>
                            <ImageDiv 
                                style={{cursor:"pointer"}}
                                width={40}
                                height={40}
                                netImage={{
                                    opacity:.7,
                                    image: "/Images/icons/cloud-offline-outline.svg",
                                    filter:"invert(100%)",
                                  
                            }}/>  
                            <div style={{ cursor: "pointer", color:peerConnection == null ? "#777171"  : "white", paddingTop: 10 }} >  Peer Network Disabled</div>
                    </div>         
                }
               
                    {showIndex == 2 && 
                        <FileList className={styles.bubble__item}
                            fileView={{
                                type: "icons",
                                direction: "row",
                                iconSize: { width: 100, height: 100, scale: .5 }
                            }}
                            tableStyle={{
                                maxHeight: pageSize.height - 400
                            }}
                            files={
                                [
                                    {
                                        to: "/home/peernetwork/library",
                                        name: "Library",
                                        type: "folder",
                                        hash: "",
                                        lastModified: null,
                                        size: null,
                                        netImage: { scale: .5, opacity: .7, backgroundColor: "", image: "/Images/icons/library-outline.svg", filter: "invert(100%)" }
                                    },
                                ]}
                        />
                    }
                    {showIndex == 1 &&
                        <div style={{ flex: 1, display: "block", color: "white" }}>
                            config
                        </div>
                    }
                  
                    {showIndex == 3 &&
                       <PeerStatusPage location={location}/>
                    }
                   
                    {showIndex == 5 &&
                        <LibraryPage 

                            setSearchOptions={(options) =>{
                                setSearchOptions(options)
                            }}
                            setSearchValue={(value)=>{
                                searchOptionRef.current.setValue(value)
                            }} 
                            setSearchText={(text)=>{
                                searchInputRef.current.value = text
                            }}
                            optionChanged={currentSearchOption}
                            onChange={change}

                            admin={user.userID == currentPeer.userID} currentPeer={currentPeer} />
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
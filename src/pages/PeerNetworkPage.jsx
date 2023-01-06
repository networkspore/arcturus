import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import styles from './css/home.module.css';
import SelectBox from './components/UI/SelectBox';
import {  useLocation, useNavigate, NavLink} from 'react-router-dom';

import FileList from './components/UI/FileList';
import { ImageDiv } from './components/UI/ImageDiv';
import { LibraryPage } from './LibraryPage';
import { PeerStatusPage } from './components/PeerStatusPage';
import { PeerDownloadPage } from './PeerDownloadPage';
import { PeerUploadPage } from './PeerUploadPage';


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
    const [currentFiles, setCurrentFiles] = useState([])
    const [currentSearchOption, setCurrentSearchOption] = useState(null)
    const [change, setChange] = useState("")

    
    const searchInputRef = useRef()
    const searchOptionRef = useRef()
    
    const [searchOptions, setSearchOptions] = useState([])

    const currentContact = useZust((state) => state.currentContact)
    const [currentPeer, setCurrentPeer] = useState({userID:null, userName:"null"})
    const [directory, setDirectory] = useState("/home/peernetwork")
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

        if(currentContact != null){

            const cPeer = {
                userID: currentContact.userID,
                userName: currentContact.userName
                
            }
            setCurrentPeer(cPeer)
        }else{
            const cPeer = {
                userID: user.userID,
                userName: user.userName

            }
            setCurrentPeer(cPeer)
        }

        const currentLocation = location.pathname;
        const d = currentContact == null ? "/home/peernetwork" : "/contacts/" + currentContact.userName + "/peernetwork";

        setDirectory(d)

        const thirdSlash = currentLocation.indexOf("/",d.length)
        const fourthSlash = currentLocation.indexOf("/", thirdSlash + 1)

        const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash, fourthSlash == -1 ? currentLocation.length : fourthSlash) : "";
        setSubDirectory(l)
        
        if (configFile.handle != null) {

        switch(l){
            case "/settings":
                setCurrentFiles(
                    [
                        {
                            to:"/home/peernetwork/status",
                            name: "Status",
                            type: "folder",
                            hash: "",
                            lastModified: null,
                            size: null,
                            netImage: { scale: .5, opacity: .7, backgroundColor: "", image: "/Images/icons/pulse-outline.svg", filter: "invert(100%)" }
                        },
                    ])
                setShowIndex(2)
                break;
            case "/status":
                setShowIndex(6)
                break;
            case "/library":
                setShowIndex(5)
                break;
            default:
           
                setCurrentFiles(
                    [
                        {
                            to: d + "/library",
                            name: "Library",
                            type: "folder",
                            hash: "",
                            lastModified: null,
                            size: null,
                            netImage: { scale: .5, opacity: .7, backgroundColor: "", image: "/Images/icons/library-outline.svg", filter: "invert(100%)" }
                        },
                    ])
                setShowIndex(2);
                   
                break;
        }
    }else{
        setShowIndex(0);
    }


    }, [location, currentContact, configFile])

  //  const disable = useRef({value:false})


    const turnOffPeerNetwork = () => {
        navigate("/home/localstorage")
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

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",

                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    backgroundImage: "linear-gradient(#131514, #000304EE )",

                }}>
                  
                    
                    
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 15, paddingBottom: 10 }}>  Peer Network</div>
                    <div style={{ width: 45 }}>&nbsp;</div>
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
                    
                  
                  

                    <div onClick={(e) => {
                       navigate(-1) 
                       
                    }} about={"Back"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >

                        <img src={"/Images/icons/arrow-back-outline.svg"} width={25} height={25} style={{ filter: "Invert(100%" }} />

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
                                   {currentPeer.userName}://{peerConnection == null ? configFile.handle == null ? "Initialize local storage..." :  "Network unavailable" : location.pathname.slice(directory.length +1, location.pathname.length)}
                                </div>
                                
                            </div>
                            

                            
                        </div>
                        <div style={{ width: 20 }}></div>
                        <div style={{
                            height: 30,

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
                                <SelectBox ref={searchOptionRef} onChange={searchOptionChanged} textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={searchOptions} />
                            </div>
                            <div  onClick={(e) => { searchInputRef.current.focus() }} style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", paddingRight:10, paddingLeft:10
                            }}>
                                <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                            </div>
                            <div onClick={(e) => {
                                navigate("/home/peernetwork/settings")

                            }} about={"Settings"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltipLeft__item} >

                                <img src={"/Images/icons/menu-outline.svg"} width={20} height={20} style={{ filter: "Invert(100%" }} />

                            </div>
                        </div>
                       
                        
                    </div>
                  
                </div>

                
            <div style={{  display: "flex", flex:1, height:(pageSize.height-100), margin:"30px" }}>

             
               
                {showIndex == 0 &&
                        <div onClick={(e) => { navigate("/home/localstorage") }}
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
                            files={currentFiles}
                        />
                    }
                    {showIndex == 1 &&
                        <div style={{ flex: 1, display: "block", color: "white" }}>
                           
                        </div>
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

                            admin={user.userID == currentPeer.userID} currentPeer={currentPeer} 
                            directory={directory}
                            />
                    }
                    {showIndex == 6 &&
                        <>
                        <PeerDownloadPage />
                        <PeerUploadPage />
                        </>
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
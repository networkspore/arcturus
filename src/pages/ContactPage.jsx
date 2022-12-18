import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './css/home.module.css';
import { ImageDiv } from './components/UI/ImageDiv';
import { access } from '../constants/constants';
import { ImageViewer } from './components/UI/ImageViewer';
import { LibraryPage } from './LibraryPage';
import { PeerNetworkPage } from './PeerNetworkPage';

export const ContactPage = () => {
    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const currentContact = useZust((state) => state.currentContact)
    const setCurrentContact = useZust((state) => state.setCurrentContact)

    const [showIndex, setshowIndex] = useState(0)
    const navigate = useNavigate();

    const [viewImage, setViewImage] = useState(null)

    const [subDirectory, setSubDirectory] = useState("")
    const [subSubDirectory, setSubSubDirectory] = useState("")
    const [subSubSubDirectory, setSubSubSubDirectory] = useState("")

    const location = useLocation();

    const setSocketCmd = useZust((state) => state.setSocketCmd)

    useEffect(()=>{return ()=>{setCurrentContact(null)}},[])

    useEffect(() => {
        const currentLocation = location.pathname;
        const directory = "/contacts"
        const secondSlash = currentLocation.indexOf("/", directory.length)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

        setSubDirectory(sD)

        const fourthSlash = subLocation.indexOf("/", thirdSlash == -1 ? subLocation.length : thirdSlash + 1)

        const ssD = thirdSlash != -1 ? subLocation.slice(thirdSlash, fourthSlash == -1 ? subLocation.length : fourthSlash) : ""

        const fifthSlash = subLocation.indexOf("/", fourthSlash == -1 ? subLocation.length : fourthSlash + 1)
        const sssD = fourthSlash != -1 ? subLocation.slice(fourthSlash, fifthSlash == -1 ? subLocation.length : fifthSlash) : ""

        setSubDirectory(sD)
        setSubSubDirectory(ssD)
        setSubSubSubDirectory(sssD)

        switch(ssD)
        {
            case "/peernetwork":
                setshowIndex(1)
                break;
            default:
                setshowIndex(0)
            break;
        }
    }, [location])
    
    const requestContact = (e) =>{

    }

    return (
        <>
        <div style={{ display: "flex", flexDirection: "column", position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
            <div className={styles.glow} onClick={(e) => { 
                setCurrentContact(null)
                 navigate("/contacts") 
                }} style={{
                    opacity:.7,
                    cursor:"pointer",
                padding: "10px",
                textAlign: "center",

            }}><ImageDiv width={20} height={20} netImage={{filter:"invert(100%)", image:"/Images/icons/arrow-back-outline.svg"}} /></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px" }}>



                <ImageDiv width={150} height={150} onClick={(e) => {
                    setViewImage(currentContact.image)
                }} about={"click to view"} className={styles.bubble__item} netImage={{
                    scale: 1,
                    update: {
                        command: "getImage",
                        file: currentContact.image,
                        waiting: { url: "/Images/spinning.gif" },
                        error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                    },
                    backgroundColor: "#44444450",
                    backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                }} />

                <div style={{ height: 20 }}> &nbsp;</div>
                <div style={{ paddingTop: 5, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                    <div style={{

                        textAlign: "center",
                        fontFamily: "WebRockwell",
                        fontSize: "15px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314",

                    }} >{currentContact.userName}</div>

                </div>

                <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>


            </div>
            <div style={{ height: 10 }}>&nbsp;</div>
           
            {(currentContact.accessID == access.public ||( currentContact.accessID == access.contacts && currentContact.isContact)) &&
            <div style={{ width: 260, paddingLeft: "15px", display: "flex", flexDirection: "column", }}>


               
                
                    <NavLink className={styles.result} to={"/contacts/" + currentContact.userName + "/peernetwork"}>
                        <div style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus", alignItems: "center", justifyContent: "center" }} >

                            <div style={{}}>
                                <ImageDiv width={20} height={20} netImage={{ image: "/Images/icons/cloud-outline.svg", filter: "invert(100%)" }} />
                            </div>
                            <div style={{ paddingLeft: "10px", }} >
                                Peer Network
                            </div>
                        </div>
                    </NavLink>
                
            </div>
            }
                {!currentContact.isContact &&
                    <div onClick={requestContact} style={{paddingBottom:50, width: 290, height:"100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent:"end", marginBottom: 30, marginTop: 10 }}>
                        <div style={{ width: 100, height: 30, borderRadius: 10, whiteSpace: "nowrap" }} className={styles.bubbleButton}>Request Contact</div>
                    </div>
                }
        </div>

        {showIndex == 1 &&
                <PeerNetworkPage />
        }




        {viewImage != null &&
            <ImageViewer errorImage={"/Images/icons/person.svg"} currentImage={viewImage} close={()=>{setViewImage(null)}}/>
        }
        </>
    )
}

/* <NavLink className={styles.result} to={"/contacts/" + currentContact.userName + "/profile"}>
                    <div style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus", alignItems:"center", justifyContent:"center" }} >

                        <div style={{}}>
                                <ImageDiv width={20} height={20} netImage={{ image: "/Images/icons/person-outline.svg", filter:"invert(100%)"}}/>
                        </div>
                        <div style={{ paddingLeft: "10px", }} >
                            Profile
                        </div>
                    </div>
                </NavLink>*/
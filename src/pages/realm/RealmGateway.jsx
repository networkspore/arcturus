import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyMixer } from "three";
import { status } from "../../constants/constants"
import useZust from "../../hooks/useZust";
import { ImageDiv } from "../components/UI/ImageDiv";
import SelectBox from "../components/UI/SelectBox";
import styles from "../css/home.module.css"
import { GatewayRoom } from "./GatewayRoom";
import { UpdateRealmInformation } from "./UpdateRealmInformation";

export const RealmGateway= (props = {}) =>{


    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
    const realms = useZust((state) => state.realms)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)


    const [admin, setAdmin] = useState(false)
    const [messages, setMessages] = useState([])
    const [realmUsers, setRealmUsers] = useState([])
    const [gatewayUsers, setGatewayUsers] = useState([])
    const [realmMember, setRealmMember] = useState(false)

    const [currentRealm, setCurrentRealm] = useState({
        realmID: null,
        realmName: "",
        userID: null,
        roomID: null,
        realmPage: null,
        realmIndex: null,
        statusID: null,
        accessID: null,
        realmDescription: null,
        advisoryID: null,
        image: null,
        config: null,
        realmType: null,
    })
    const [subDirectory, setSubDirectory] = useState("")

    const [showIndex, setShowIndex] = useState(null)

    const className = styles.bubble__item;
    const activeClassName =  styles.bubbleActive__item;
  

    const [isQuickBar, setIsQuickBar] = useState(false)
    const quickBar = useZust((state) => state.quickBar)
    const setQuickBar = useZust((state) => state.setQuickBar)
    const quickBarAdd = (realm) => useZust.setState(produce((state) => {
        if (!(Array.isArray( state.quickBar))) {
            state.quickBar = [realm]
        }else{
            const length = state.quickBar.length

            if (length > 0) {
                const index = state.quickBar.findIndex(qbar => qbar.realmID == realm.realmID)
                if (index == -1) {
                    state.quickBar.splice(0, 0, realm)
                }
            } else {
                state.quickBar.push(realm)
            }
        }
    }))

    const quickBarRemove = (realmID) => useZust.setState(produce((state)=>{
        if (!(Array.isArray(state.quickBar))) {
            state.quickBar = []
        } else {
            const length = state.quickBar.length
            console.log(length)
            if(length > 0)
            {
                const index = state.quickBar.findIndex(qbar => qbar.realmID == realmID)
                console.log(index)
                if(index > -1){
                    
                    if(length == 1)
                    {
                       
                       state.quickBar.pop()
                    }else{
                 
                        state.quickBar.splice(index, 1)
                    }   
                }
            }
        }
    }))

    const itemStyle = {
        borderRadius: 40,
        margin: "3%",
        overflow: "hidden",
        textShadow: "2px 2px 2px black",
        cursor: "pointer"
    }




    useEffect(() => {
    

        const currentLocation = props.currentLocation
        const directory = "/realm/gateway";

        if(currentLocation != directory){
            const thirdSlash = currentLocation.indexOf("/", directory.length)

            const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash) : "";
            setSubDirectory(l)

            if(props.admin){
                switch (l) {
                    case "/information":
                        setShowIndex(0)
                        break;
                    case "/hall":
                        setShowIndex(1)
                        break;
                    case "/pcs":
                        setShowIndex(2);
                        break;
                    case "/nps":
                        setShowIndex(3)
                        break;
                    case "/placeables":
                        setShowIndex(4)
                        break;
                    case "/textures":
                        setShowIndex(5)


                }
            }
        }else{

            setSubDirectory("")
            setShowIndex(-1)
        }
    }, [props.currentLocation])

    useEffect(()=>{

       setMessages(props.messages)
 
    },[props.messages])

    useEffect(()=>{
        setAdmin(props.admin)
        setCurrentRealm(props.currentRealm)
    },[props.admin, props.currentRealm])
    
    useEffect(()=>{
        setRealmUsers(props.realmUsers)
    },[props.realmUsers])
    

    useEffect(()=>{
        setGatewayUsers(props.gatewayUsers)
    },[props.gatewayUsers])

    useEffect(()=>{
        setRealmMember(props.realmMember)
    },[props.realmMember])


    useEffect(()=>{
        if (Array.isArray(quickBar)) {
            const index = quickBar.findIndex(qbar => qbar.realmID == currentRealm.realmID)

            setIsQuickBar(index > -1)
           
        }
    },[quickBar, currentRealm])
  
    
    const onStartRealm = (e) =>{
        navigate("/realm")
    }

    const onToggleQuickBar = (e) =>{
    
        const length = quickBar.length;

        if(length == 0)
        {
            setQuickBar([currentRealm])
        }else{
            const index = quickBar.findIndex(qb => qb.realmID == currentRealm.realmID)
           
            if(index == -1){
                quickBarAdd(currentRealm)
                
            }else{
                quickBarRemove(currentRealm.realmID)
            }
        }
       
    }




    return (
        <>
        <div style={{  position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
                <div style={{
                   width: "100%",
                   display:"flex",
                   justifyContent:"right"
                
                }}>
                    <ImageDiv style={{cursor:"pointer"}} onClick={onToggleQuickBar} width={30} height={30} netImage={{
                        image: isQuickBar ? "/Images/icons/star.svg" : "/Images/icons/star-outline.svg",
                        backgroundColor:"",
                        filter:"invert(100%)",
                        opacity:.5,
                        scale:.7
                }} />

                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems:"center",  height:"150px", padding:"10px"}}>
                    <ImageDiv width={130} height={ 130} about={"Select Image"} className={admin ? className : ""} netImage={{
                        image: currentRealm.realmID != null && "icon" in currentRealm.image ? currentRealm.image.icon : "/Images/spinning.gif",
                        backgroundColor: "#44444450",
                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                       
                    }} />
 
                    <div style={{ marginTop:20, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                        <div style={{

                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "15px",
                            fontWeight: "bolder",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",

                        }} >{ currentRealm != null ? currentRealm.realmName : "loading..." }</div>

                    </div>

                    <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                </div>
                        
                <div style={{ paddingTop:35, width: 260, paddingLeft:"20px" }}>
                    <div style={{ height: 5 }}>&nbsp;</div>
                    <div onClick={(e) => { navigate("/realm/gateway") }} className={styles.result}
                        style={{ padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                        <ImageDiv netImage={{ filter: subDirectory == "" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/realm.png" }} width={25} height={25} />

                        <div style={{ paddingLeft: "10px", color: subDirectory == "" ? "white" : "" }} >
                            Gateway
                        </div>
                    </div>
                    {admin && <>
                     
                    <div style={{
                            paddingTop:20,
                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "14px",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",
                            paddingBottom:3,
                        }} >Creator</div>
                        <div style={{ height: 1, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                        <div style={{height:5}}>&nbsp;</div>
                        <div onClick={(e) => { navigate("/realm/gateway/information") }} className={styles.result}
                            style={{ padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/information" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/information-circle-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/information" ? "white" : "" }} >
                                Information
                            </div>
                        </div>
                        <div onClick={(e) => { navigate("/realm/gateway/pcs") }} className={styles.result} 
                        style={{ padding:5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/pcs" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/man-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/pcs" ? "white" : "" }} >
                                Playable Characters
                            </div>
                        </div>

                        <div onClick={(e) => { navigate("/realm/gateway/npcs") }} className={styles.result} 
                        style={{ 
                            padding:5,
                            display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/npcs" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/paw-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/npcs" ? "white" : "" }} >
                                Non-Playable Characters 
                            </div>
                        </div>

                        <div onClick={(e) => { navigate("/realm/gateway/placeables") }} className={styles.result} style={{
                            padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/placeables" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/cube-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/placeables" ? "white" : "" }} >
                                Placeable Models
                            </div>
                        </div>

                        <div onClick={(e) => { navigate("/realm/gateway/textures") }} className={styles.result} style={{
                            padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/textures" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/images-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/textures" ? "white" : "" }} >
                                Textures
                            </div>
                        </div>
                    </>}
                </div>
               

            </div>
            {
                showIndex == -1 &&
                <GatewayRoom admin={admin} realmMember={realmMember} currentRealm={currentRealm} messages={messages} gatewayUsers={gatewayUsers} realmUsers={realmUsers}/>
            }
            {admin && 
                showIndex == 0  &&
                <UpdateRealmInformation admin={admin} currentRealm={currentRealm}/>
            }
       </>
    )
}

/*
 <div onClick={(e)=>{navigate("/realm/gateway/information")}} className={styles.result} style={{ display: "flex", alignItems:"center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                        <ImageDiv netImage={{ filter: subDirectory == "/information" ? "invert(100%)" : "invert(50%)",backgroundColor:"", image:"/Images/icons/information-circle-outline.svg"}} width={25} height={25} />
                        
                        <div style={{ paddingLeft: "10px", color: subDirectory == "/information" ? "white" : "" }} >
                           Information
                        </div>
                    </div>
                    <div onClick={(e) => { navigate("/realm/gateway/hall") }} className={styles.result} style={{ display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                        <ImageDiv netImage={{ filter: subDirectory == "/hall" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/chatbubbles-outline.svg" }} width={25} height={25} />

                        <div style={{ paddingLeft: "10px", color:subDirectory == "/hall" ? "white" : "" }} >
                            Hall
                        </div>
                    </div>
                    */
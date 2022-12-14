import { update, set } from "idb-keyval";
import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate} from "react-router-dom";
import { PropertyMixer } from "three";
import { status } from "../../constants/constants"
import useZust from "../../hooks/useZust";
import { ImageDiv } from "../components/UI/ImageDiv";
import SelectBox from "../components/UI/SelectBox";
import styles from "../css/home.module.css"
import { GatewayRoom } from "./GatewayRoom";
import { UpdateRealmInformation } from "./UpdateRealmInformation";


import { ImagePicker } from "../components/UI/ImagePicker";
import { EditRealmCharacters } from "./EditRealmCharacters";


export const RealmGateway= (props = {}) =>{


    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
   // const realms = useZust((state) => state.realms)
    const user = useZust((state) => state.user)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const updateRealmImage = useZust((state) => state.updateRealmImage)


    const [admin, setAdmin] = useState(false)
    const [messages, setMessages] = useState([])
    const [realmUsers, setRealmUsers] = useState([])
    const [gatewayUsers, setGatewayUsers] = useState([])
    const [realmMember, setRealmMember] = useState(false)
   // const [showImagePicker, setShowImagePicker] = useState(false)

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
    const quickBarAdd = (realmID) => useZust.setState(produce((state) => {
        if (!(Array.isArray( state.quickBar))) {
            state.quickBar = [realmID]
        }else{
            const length = state.quickBar.length

            if (length > 0) {
                const index = state.quickBar.findIndex(qbar => qbar == realmID)
                if (index == -1) {
                    state.quickBar.splice(0, 0, realmID)
                }
            } else {
                state.quickBar.push(realmID)
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
                const index = state.quickBar.findIndex(qbar => qbar == realmID)
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
    

        const currentLocation = props.currentLocation + ""
        const directory = "/realm/gateway";

        if(currentLocation != directory){
            const thirdSlash = currentLocation.indexOf("/", directory.length)

            const fourthSlash = currentLocation.indexOf("/", directory.length + 2)

            const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash, fourthSlash == -1 ? undefined : fourthSlash) : "";
            setSubDirectory(l)
            console.log(subDirectory)
            if(props.admin){
                switch (l) {
                    case "/information":
                        setShowIndex(0)
                        break;
                    case "/assets":
                        setShowIndex(1)
                        break;
                    

                }
            }
        }else{

            setSubDirectory("")
            setShowIndex(-1)
        }
        
    }, [props.currentLocation])
/*
    useEffect(()=>{
        console.log(showIndex)
    },[showIndex])*/

    useEffect(()=>{

       setMessages(props.messages)
 
    },[props.messages])

    useEffect(()=>{
        console.log(props.currentRealm)
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
        console.log(quickBar)
        console.log(currentRealm)
        if (Array.isArray(quickBar)) {
            const index = quickBar.includes(currentRealm.realmID)

            setIsQuickBar(index > -1)
           
        }
    },[quickBar, currentRealm])
  
    
    const onStartRealm = (e) =>{
        navigate("/realm")
    }
    const needsUpdate = useRef({value:false})
    const onToggleQuickBar = (e) =>{

     
        const length = quickBar.length;
        needsUpdate.current.value = true;
        if(length == 0)
        {
            setQuickBar([currentRealm.realmID])
        }else{
            const index = quickBar.findIndex(qb => qb.realmID == currentRealm.realmID)
           
            if(index == -1){
                quickBarAdd(currentRealm.reamID)
                
            }else{
                quickBarRemove(currentRealm.realmID)
            }
     
        }
        
    }

    useEffect(()=>{
        if(needsUpdate.current.value == true)
        {
            saveQuickBar(user.userID)
        }
    },[quickBar, user])


    const saveQuickBar = (userID) =>{
        needsUpdate.current.value == false
        
        if (quickBar.length > 0) {
           
          
               

            const qbarIdbName = userID + ".arcquickBar";
       

            set(qbarIdbName, quickBar)



            /*  update(userID + ".arcquickBar", (qBar) => {

                    if (qBar == undefined) {
                    } else {
                        qBar = json
                    }
                })*/

        } else {
            update(userID + ".arcquickBar", (quickBarUpater) => {
                quickBarUpater = []
            })
        }

            
        }
  
        const onUpdateRealmImage = (update) =>{
            setShowIndex(null)
            const fileInfo = {
                name: update.name,
                hash: update.hash,
                size: update.size,
                type: update.type,
                mimeType: update.mimeType,
                lastModified: update.lastModified
            }

            setSocketCmd({
                cmd: "updateRealmImage", params: {realmID:currentRealm.realmID, imageInfo: fileInfo }, callback: (updateResult) => {
                    console.log(updateResult)
                    if ("success" in updateResult && updateResult.success) {
                        updateRealmImage(currentRealm.realmID, updateResult.file)
                    }
                   
                }
            })
        }


    return (
        <>
        <div style={{display:"flex", flexDirection:"column",  position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
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
                    <ImageDiv width={150} height={150} onClick={(e) => {
                        setShowIndex(10)
                    }} about={"Select Image"} className={className} netImage={{
                        scale: 1.1,
                        update: {
                            command: "getImage",
                            file: currentRealm.image,
                            waiting: { url: "/Images/spinning.gif" },
                            error: { url: "/Images/cloud-offline-outline.svg", style: { filter: "invert(70%)" } },

                        },
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
                        
                    </>}
                    
                </div>
               
                <div style={{ height: "100%", width: 290, display:"flex", flexDirection:"column", justifyContent:"end", alignItems:"center", marginBottom:50, marginTop:50, }}>
                    <div style={{ width:100, height:30, borderRadius:10}} className={styles.bubbleButton}>Enter</div>
                </div>
            </div>
            {showIndex == -1 &&
                <GatewayRoom admin={admin} realmMember={realmMember} currentRealm={currentRealm} messages={messages} gatewayUsers={gatewayUsers} realmUsers={realmUsers}/>
            }
            {admin && 
                showIndex == 0  &&
                <UpdateRealmInformation  currentRealm={currentRealm}/>
            }
           
            {admin && showIndex == 10 &&
                <ImagePicker selectedImage={currentRealm.image} onCancel={()=>{setShowIndex(null)}} onOk={onUpdateRealmImage}/>
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
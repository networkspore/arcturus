import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { errorSaving, noChanges, notConnected, saved } from "../../constants/systemMessages";
import useZust from "../../hooks/useZust";
import { ChatBox } from "../components/UI/ChatBox";
import { ContactsBox } from "../components/UI/ContactsBox";

import { ImageDiv } from "../components/UI/ImageDiv";
import SelectBox from "../components/UI/SelectBox";
import styles from "../css/home.module.css"


export const GatewayRoom = (props = {}) =>{

 

    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
    const realms = useZust((state) => state.realms)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)

    const addSystemMessage = useZust((state) => state.addSystemMessage)

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

    const className = styles.bubble__item;
    const activeClassName = styles.bubbleActive__item;

    const [admin, setAdmin] = useState(false)
    const [messages, setMessages] = useState([])
    const [realmUsers, setRealmUsers] = useState([])
    const [gatewayUsers, setGatewayUsers] = useState([])
    const [realmMember, setRealmMember] = useState(false)

    const [showLeft, setShowLeft] = useState(false)

    useEffect(() => {
        setAdmin(props.admin)
        setCurrentRealm(props.currentRealm)
    }, [props.admin, props.currentRealm])


    useEffect(() => {

        setMessages(props.messages)

    }, [props.messages])


    useEffect(() => {
       
        setRealmUsers(props.realmUsers)
    }, [props.realmUsers])


    useEffect(() => {
        setGatewayUsers(props.gatewayUsers)
    },[props.gatewayUsers])

    useEffect(() => {
        setRealmMember(props.realmMember)
    }, [props.realmMember])

    const onMessageSend = (msgTxt, callback) =>{
        callback(true)
    }

    return(
        <>
            {currentRealm !=null && currentRealm.realmID != null &&
        <div style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.75)",
            width: pageSize.width - 410,
            height: pageSize.height,
            left: 410,
            top: 0,
            display: "flex",
            flexDirection: "column",
                    boxShadow: "inset 0 0 10px #ffffff10, inset 0 0 20px #77777730", 
        }}>
            <div style={{
   
              display:"flex",
                width: "100%",
                paddingTop: "18px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",
                alignItems:"center",
                justifyContent:"center"
            }}>
                        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent:"center"}}> {currentRealm.realmName + " "}Gateway</div>
                        <div style={{ flex: 1,  maxWidth: 250,}}>&nbsp;</div>
            </div>
           
                    <div style={{ 
                        display: "flex",
                 
                        height:"100%"
                        }}>
                        {showLeft ?
                             <div style={{flex:  .5 }}>&nbsp;</div>
                             :
                             <div style={{width:50}}> &nbsp;</div>
                        }
                        <div style={{marginLeft:30, minWidth:300, flex: 1, display:"flex", flexDirection:"column" }}>
                         
                            <ChatBox onMessageSend={onMessageSend} 
                                chatHeight={pageSize.height - 200} roomID={currentRealm.roomID} messages={messages}/>
                            <div style={{ height: 80, }}>&nbsp;</div>
                        </div>
                        <div style={{flex:1, marginTop:30, marginRight:10, maxWidth:250, display: "flex", flexDirection: "column", overflow:"hidden", 
                            backgroundImage:"linear-gradient(to right, #00000050, #cccccc08)" }}>
                            <div style={{ height: "100%" }}>
                                <ContactsBox 
                                    contacts={gatewayUsers}
                                />
                            </div>
                           
                            <div style={{ height: 120, }}>&nbsp;</div>
                        </div>
                        
                    </div>
                 
        </div>
        }
        </>
    )
}


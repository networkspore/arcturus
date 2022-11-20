import produce from "immer";
import React, {useState, useEffect, useRef} from "react";
import { useId } from "react";
import useZust from "../../../hooks/useZust";
import styles from "../../css/home.module.css"

export const ChatBox = (props ={}) => {

    const msgTextRef = useRef();
    const chatDivRef = useRef()
    const parentDivRef = useRef();

    const chatListenerID = useId()

    const activeBorder = "5px ridge #ffffff20";
    const inactiveBorder = "5px solid #ffffff08"

    const [showChat, setShowChat] = useState(false)
    const [hideChat, setHideChat] = useState(false)
    const [chat, setChat] = useState([])
    const [bounds, setBounds] = useState({width:300})
    const [chatHeight, setChatHeight] = useState(200)
    const [textAlign, setTextAlign] = useState("left")
    const [border, setBorder] = useState(inactiveBorder)
    const [roomID, setRoomID] = useState(null)
    const [joinedRoom, setJoinedRoom] = useState(false)
    
    const pageSize = useZust((state) => state.pageSize)
    const socket = useZust((state) => state.socket)
    const addSocketListener = useZust((state) => state.addSocketListener)

    useEffect(()=>{
        if(parentDivRef.current)
        {
            const bounds = parentDivRef.current.getBoundingClientRect()
            setBounds(bounds)
        }
        setChatHeight("chatHeight" in props ? props.chatHeight : 300)
        setHideChat("hideChat" in props ? props.hideChat : false)
        setTextAlign("inputTextAlign" in props ? props.inputTextAlign : "left")
        setRoomID("roomID" in props ? props.roomID : null)
    },[props, parentDivRef.current, pageSize])

    useEffect(()=>{
        if(roomID != null){
            if(!joinedRoom)
            {
             //   socket.emit("joinRoom")
            }
        }
    },[roomID])



    const displayStoredMessages = (msgs = []) => {
        for (let i = 0; i < msgs.length; i++) {
            displayMessage(msgs[i].name, msgs[i].type, msgs[i].msg);
        }
    }

    const displayMessage = (name = "", type = 0, msg = "") => {


        const arr = [];
        if (type == 1) {

        }
        switch (type) {
            case 0:
                arr.push(
                    <p className={styles.paragraph}> <b className={styles.systemHeading}>{"--" + name}</b>{":"}<i className={styles.systemtMessage}>{" " + msg + "--"}</i>
                    </p>

                )
                break;
            case 1:
                arr.push(
                    <p className={styles.paragraph}> <b className={styles.chatHeading}>{name}</b>{":"}<i className={styles.chatMessage}>{" " + msg}</i>
                    </p>

                )
                break;
        }
        setChat(prev => [...prev, arr]);


    }

    function onMessageSend(e){
        
        if (socket.connected) {
            const msgTxt = msgTextRef.current.value;
            if (joinedRoom && msgTxt != "") {

                //   msgText.current.disabled = true;
                socket.emit("sendGatewayMsg", roomID,  msgTxt, (sent, stored) => {
                    //       msgText.current.disabled = false;
                    msgTextRef.current.value = "";
                });
            } else {

            }
        } else {
            addSystemMessage(notConnected)
            return { error: new Error("Not Connected") }
        }


    }

    return(
        <div ref={parentDivRef} style={{flex:1, display:"flex", flexDirection:"column", }}>
            <div ref={chatDivRef} style={{ 
                position: hideChat ? "fixed" : "block", 
                textAlign: "left", 
                color: "white", 
                overflowY: "scroll", 
             
                width: hideChat ? bounds.width : "100%", 
                height: chatHeight }}>
                {chat}
            </div>
            <div style={{flex:1 }}>
                <textarea 
                    ref={msgTextRef}
                    onBlur={(e) => {
                        setShowChat(false);
                        setBorder(inactiveBorder)
                    }}
                    onFocus={(e)=>{
                        setBorder(activeBorder)
                    }} 
                    onKeyDown={(e) => {
                        if (e.key == "Enter") onMessageSend(e)
                    }} type="text"  
                    style={{ 
                        resize: "none",
                        border: border,
                        outline:0,
                        backgroundColor: "#00000070", 
                        paddingRight: 20, 
                        textAlign: textAlign,
                        width:bounds.width,
                        fontFamily:"webrockwell" ,
                        fontSize: 14,
                        padding:10,
                        color:"#ffffff"
                    }} />

            </div>
        </div>
    )
}

/* <div onClick={(e) => {
            setShowChat(true);
        }} style={{
            display: "flex",
            flexDirection:"column",
            flex:1, backgroundColor: "#33333350",
        }}>
            <div style={{ display: showChat ? "none" : "flex", width: "100%" }} className={styles.disclaimer}>
                <div style={{ overflow: "hidden", marginLeft: "5%", width: "100%" }}>

                    <div style={{ width: "10px" }}></div>
                    {chat != null ? chat.length > 0 ? chat[chat.length - 1] : <></> : <></>}

                </div>
            </div>
        </div>
*/
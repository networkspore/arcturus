import produce from "immer";
import React, {useState, useEffect, useRef} from "react";
import { useId } from "react";
import useZust from "../../../hooks/useZust";
import styles from "../../css/home.module.css"

export const ChatBox = (props ={}) => {

    const msgTextRef = useRef();
    const chatDivRef = useRef()
    const parentDivRef = useRef();
    const textAreaDiv = useRef()

    const chatListenerID = useId()

    const activeBorder = "5px ridge #ffffff10";
    const inactiveBorder = "5px solid #ffffff08"

    const [focused, setFocused] = useState(false)
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
    
        const msgTxt = msgTextRef.current.value;
    
        if (msgTxt != "") {

            //   msgText.current.disabled = true;
            props.onMessageSend( msgTxt, (sent) => {
                //       msgText.current.disabled = false;
                msgTextRef.current.value = "";
          
            })
        } else {

        }

    }
    useEffect(()=>{
        if(focused)
        {
            
            msgTextRef.current.rows = 8
        }else{
            msgTextRef.current.rows = 1
        }
    }, [focused])

    return(
        <div ref={parentDivRef} style={{flex:1, display:"flex", flexDirection:"column", }}>
            <div ref={chatDivRef} style={{ 
                display:"flex",
                flexDirection:"column", 
                textAlign: "left", 
                color: "white", 
                overflowY: "scroll", 
             
                width: hideChat ? bounds.width : "100%", 
                height: "100%" }}>
                {chat}
            </div>
            <div height={10}>&nbsp;</div>
            <div ref={textAreaDiv} style={{display:"flex", flex:1, alignItems:"end", justifyContent:"end" }}>
              
                <textarea className={ focused ? styles.bubbleButtonActive : styles.bubbleButton}
                    ref={msgTextRef}
                    onBlur={(e) => {
                        setFocused(false);
                        setBorder(inactiveBorder)
                       
                    }}
                    onFocus={(e)=>{
                        setFocused(true)
                        setBorder(activeBorder)
                   
                    }} 
                    onKeyDown={(e) => {
                        if ( e.ctrlKey == true) {
                            if (e.key == "Enter") {
                                msgTextRef.current.value += "\r\n"
                            }
                        }else{
                            if (e.key == "Enter") {
                                e.preventDefault()
                                onMessageSend(e)
                            }
                        }
                    }} type="text"  
                    style={{ 
                        resize: "none",
                        border: 0,
                        outline:0,
                        backgroundColor: "#00000070", 
                       width: "90%",
                        textAlign: textAlign,
                        fontFamily:"webrockwell" ,
                        fontSize: 14,
                        padding:10,
                        color:"#ffffff"
                    }} />
                    { focused &&
                <div className={styles.bubbleButton} style={{display:"flex", fontFamily:"webpapyrus", alignItems:"center", justifyContent:"center", border:border, 
                        position: "absolute", width: 80, height: 20, backgroundColor: "#000000dd", transform: "translate(-25%,40%)", }}>
                    Send
                </div>}
             
                <div style={{flex:focused ? .8 : 1}}>&nbsp;</div>
            
            </div>
           
        </div>
    )
}

/* <div onClick={(e) => {
            setFocused(true);
        }} style={{
            display: "flex",
            flexDirection:"column",
            flex:1, backgroundColor: "#33333350",
        }}>
            <div style={{ display: focused ? "none" : "flex", width: "100%" }} className={styles.disclaimer}>
                <div style={{ overflow: "hidden", marginLeft: "5%", width: "100%" }}>

                    <div style={{ width: "10px" }}></div>
                    {chat != null ? chat.length > 0 ? chat[chat.length - 1] : <></> : <></>}

                </div>
            </div>
        </div>
*/
import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { loginToken, socketIOhttp, socketToken } from "../constants/httpVars";
import { useCookies } from "react-cookie";
import useZust from "../hooks/useZust";
import { io } from "socket.io-client";
import { ImageDiv } from "../pages/components/UI/ImageDiv";
import sha256 from 'crypto-js/sha256';
import styles from '../pages/css/login.module.css';
import { getStringHash } from "../constants/utility";

export const SocketHandler = (props = {}) => {
    
    const user = useZust((state) => state.user)
    const socketCmd = useZust((state) => state.socketCmd)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const setContactsCmd = useZust((state) => state.setContactsCmd)
    const loggedIn = useRef({value:false})

    const passRef = useRef()
    const socketConnected = useZust((state) => state.socketConnected)
    const setSocketConnected = useZust((state) => state.setSocketConnected)
    const [showLogin, setShowLogin] = useState(false)
    const setUploadRequest = useZust((state) => state.setUploadRequest)

    
    const sock = useRef({value:null})
    const tryCount = useRef({value:0})

    useEffect(()=>{ 
        if(!(user.userID > 0))
        {
            loggedIn.current.value = false;
            sock.current.value = null

            
        }
    }, [user])


 

    

    useEffect(()=>{
       
        if (user.userID > 0 && sock.current.value == null ){
            setSocketConnected(false)
          
            setShowLogin(true)
           
           
        } else if (user.userID > 0 && sock.current.value != null && !sock.current.value.connected){
          
            sock.current.value = null
            setSocketConnected(false)
   
           
            setShowLogin(true)

            
        }else{
           
            setShowLogin( false )
        }
        
     
    }, [sock.current, user])

    const socketConnect = () =>{
       
        sock.current.value = io(socketIOhttp, { auth: { token: loginToken }, transports: ['websocket'] });

        sock.current.value.on("connect", () => {
         
        
      
            sock.current.value.emit("login", socketCmd.params, (response) => {
            
                if ("success" in response && response.success) {
                   
                    // setSocket(sock.current.value)
                    loggedIn.current.value = true
                    setSocketConnected(true)
                    socketCmd.callback(response)
                    setShowLogin(false)
                    tryCount.current.value = 1
                    addDefaultListeners()
                    sock.current.value.on("disconnect", (res) => {
                        switch (res) {
                            case "io server disconnect":
                                sock.current.value = null
                                break;

                        }
                    })
                } else {
           
                    sock.current.value.disconnect()
                    sock.current.value = null;
                    loggedIn.current.value = false
                    tryCount.current.value += 1
                    socketCmd.callback({ success: false })

                }

            })

        })
    }

    useEffect(() =>{
    
        if (sock.current.value == null)
        {
          
            if (socketCmd.cmd == "login" && !(("anonymous") in socketCmd)) {
                
                if (sock.current.value == null && tryCount.current.value < 5)
                {
                    socketConnect()
                }else{
               
                    socketCmd.callback({ error: new Error("Too many tries."), maxRetry:true})
                }
            } else{
                if (sock.current.value == null && socketCmd.cmd == "login") {

                    sock.current.value = io(socketIOhttp, { auth: { token: socketToken }, transports: ['websocket'] });
     
                    sock.current.value.on("connect", () => {
            
                        socketCmd.callback({ success: true })
                        sock.current.value.on("disconnect", (res) => {
                   
                            switch (res) {
                                case "io server disconnect":
                                    window.location.replace("/")
                                    break;

                            }
                        })
                    })
                } else {
                    
                    
                    if (socketCmd != null && typeof socketCmd.callback == "function"){
                        
                       
                        socketCmd.callback({ error: "not connected" })
                    }
                }
            }
            
            
        }else{
            if (("anonymous") in socketCmd) {

                switch (socketCmd.cmd) {
                    case "checkRefCode":
                        sock.current.value.emit("checkRefCode", socketCmd.params.refCode, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "checkUserName":
                        sock.current.value.emit("checkUserName", socketCmd.params.text, (response) => {
                            socketCmd.callback(response)
                        })
                        break;

                    case "checkEmail":
                        sock.current.value.emit("checkEmail", socketCmd.params.text, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateUserPassword":
                        sock.current.value.emit("updateUserPassword", socketCmd.params, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "sendRecoveryEmail":
                        sock.current.value.emit("sendRecoveryEmail", socketCmd.params.email, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case 'createUser':
                        sock.current.value.emit("createUser", socketCmd.params.user, (response) => {
                            socketCmd.callback(response)
                        })
                        break;

                }

            }else{

                
                switch (socketCmd.cmd) {
                    case "getRealms":
                        sock.current.value.emit("getRealms", (response)=>{
                            socketCmd.callback(response)
                        })
                        break;
                    case "checkStorageHash":
                    
                        sock.current.value.emit("checkStorageHash", socketCmd.params.hash, (response) =>{
                            socketCmd.callback(response)
                        })
                        break;
                
                    case "checkFileHash":
                        sock.current.value.emit("checkFileHash", socketCmd.params.hash, (response) => {
                            socketCmd.callback(response)
                        }) 
                        break;
                    case "updateUserPeerID":
                        sock.current.value.emit("updateUserPeerID", socketCmd.params.userPeerID, (response) =>{
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateUserImage":
                        sock.current.value.emit("updateUserImage", socketCmd.params.imageInfo, socketCmd.params.accessID, socketCmd.params.userAccess, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case 'createRefCode':
                        sock.current.value.emit('createRefCode', socketCmd.params.code, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "getUserReferalCodes":
                        sock.current.value.emit("getUserReferalCodes", (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "createStorage":
                        sock.current.value.emit("createStorage", socketCmd.params.file, socketCmd.params.key, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateStorageConfig":
                        sock.current.value.emit("updateStorageConfig", socketCmd.params.fileID, socketCmd.params.file, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "useConfig":
                        sock.current.value.emit("useConfig", socketCmd.params.fileID, socketCmd.params.key, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case 'searchPeople':
                        sock.current.value.emit("searchPeople", socketCmd.params.text,  (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "requestContact":
                        sock.current.value.emit("requestContact", socketCmd.params.contactUserID, socketCmd.params.msg, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "acknowledgeContact":
                        sock.current.value.emit("acknowledgeContact", socketCmd.params.response, socketCmd.params.contactID, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "checkRealmName":
                        sock.current.value.emit("checkRealmName", socketCmd.params.text, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "createRealm":
                    
                        sock.current.value.emit("createRealm", socketCmd.params.realmName, socketCmd.params.file, socketCmd.params.page, socketCmd.params.index, (response) => {
                            socketCmd.callback(response)
                        })
                        
                        break;
                    case "deleteRealm":
                        sock.current.value.emit("deleteRealm", socketCmd.params.realmID, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "enterRealmGateway":
                    
                        sock.current.value.emit("enterRealmGateway", socketCmd.params.realmID, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateRealmInformation":
                        sock.current.value.emit("updateRealmInformation", socketCmd.params.information, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateRealmImage":
                    
                        sock.current.value.emit("updateRealmImage", socketCmd.params.realmID, socketCmd.params.imageInfo, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "getFilePeers":
                        sock.current.value.emit("getFilePeers", socketCmd.params.fileID, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "peerFileRequest": 
                        sock.current.value.emit("peerFileRequest", socketCmd.params,  (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "sendEmailCode":
                        sock.current.value.emit("sendEmailCode", (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateUserEmail":
                        sock.current.value.emit("updateUserEmail", socketCmd.params, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "updateUserAccess":
                        sock.current.value.emit("updateUserAccess", socketCmd.params, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    default:
                        if (socketCmd.cmd != null && socketCmd.callback != null){
                        
                            socketCmd.callback({error: new Error( "not implemented")})
                        }
                        break;
                }
            }
        }
    },[socketCmd])

    
    const addDefaultListeners = () =>{
    
        if(sock.current.value != null)
        {
            sock.current.value.on("peerFileRequest", (uploadRequest, response) =>{
             
                setUploadRequest({upload: uploadRequest, callback:(uploadResponse)=>{
                
                    response(uploadResponse)
                }})
                
            })

            sock.current.value.on("contactsCmd", (cmd)=>{
                setContactsCmd(cmd)
            })
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();
     
        const pass = await getStringHash(passRef.current.value);
    
      
        if(pass.length > 5 && user.userID > 0){
            
            login(user.userName, pass);

        }else{
            window.location.replace("/")
        }
    }
    const setContacts = useZust((state) => state.setContacts)
    const setUserFiles = useZust((state) => state.setUserFiles)

    function login(name_email = "", pass = "") {
        setShowLogin(false)
            setSocketCmd({
          
                cmd: "login", params: { nameEmail: name_email, password: pass }, callback: (response) => {
             
                    if("success" in response && response.success)
                    {
                        tryCount.current.value = 0;
                        setSocketConnected(true)
                        const contacts = response.contacts
                        const userFiles = response.userFiles
                        setUserFiles(userFiles)
                        setContacts(contacts)
                    }else{
                       
                        if ("success" in response && !response.success){
                            alert("Check your password and try again")
                            setShowLogin(true)
                        }else if("error" in response){
                            alert(response.error.message)
                            setShowLogin(true)
                        }
                    }
                   
                }
            })
      
    }


    return (
        
        <>
        {
            !socketConnected && user.userID > 0 &&
            <ImageDiv onClick={(e) => {
                setShowLogin(true)
            }} width={25} height={30} netImage={{ image: "/Images/icons/key-outline.svg", scale: .7, filter: "invert(100%)" }} />
        }
        {showLogin &&
            <div style={{
                display: "flex",
                left: "50%",
                height: 375,
                top: "50%",
                position: "fixed",
                transform: "translate(-50%,-50%)",
                width: 600,
                cursor:"default",
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                backgroundImage: "linear-gradient(to bottom,  #00030490,#13161780)",
                textShadow: "2px 2px 2px black",
                flexDirection: "column",
                alignItems: "center",

                paddingBottom: 30,
            }}
            >
                
                <div style={{
                    paddingBottom: 10,
                   display:"flex",
                   justifyContent:"end",
                   alignItems:"start",
                    width: "100%",
                    paddingTop:10,
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    backgroundImage: "linear-gradient(#131514, #000304EE )",
                   

                }}>
                    <div style={{paddingRight:10, paddingBottom:5, cursor:"pointer"}}>
                    <ImageDiv  width={20} height={20} onClick={(e)=>{setShowLogin(false)}} netImage={{ opacity:.7, image:"/Images/icons/close-outline.svg", filter:'invert(70%)'}}/>
                    </div>
                </div>
                
                <div style={{ textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffff60", fontWeight: "bold", fontSize: "50px", fontFamily: "WebPapyrus", color: "#cdd4da" }}>
                    Log In
                </div>
                <form onSubmit={event => handleSubmit(event)}>
                    <div style={{ display: "flex", paddingTop: 30, justifyContent: "center", }}>
                        <div style={{

                            display: "flex",

                            justifyContent: "center",
                            backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                            paddingBottom: 5,
                            paddingTop: 5,
                            paddingLeft: 5,
                            paddingRight: 5,
                            width: 400,
                        }}>
                            <div style={{
                                outline: 0,
                                border: 0,
                                width: 400, textAlign: "center", color: "#777777", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus"
                            }}  > {user.userName} </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", paddingTop: 40, justifyContent: "center", }}>
                        <div style={{

                            display: "flex",

                            justifyContent: "center",
                            backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                            paddingBottom: 5,
                            paddingTop: 5,
                            paddingLeft: 5,
                            paddingRight: 5
                        }}>
                            <input onKeyUp={(e) => {
                                if (e.code == "Enter") {
                                    handleSubmit(e)
                                }
                            }} ref={passRef} style={{
                                outline: 0,
                                border: 0,
                                color: "white",
                                width: 500, textAlign: "center", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus"
                            }} name="loginPass" placeholder="Password" type="password"  />
                        </div>
                    </div>
                   

                 
                    <div style={{ width: "100%", display: "flex", justifyContent: "right" }}>
                        <div onClick={handleSubmit} style={{
                            textAlign: "center",
                            cursor:   "pointer" ,
                            fontFamily: "WebPapyrus",
                            fontSize: "25px",
                            fontWeight: "bolder",
                            width: 100,
                            color:  "#ffffffcc" ,

                            paddingTop: "10px",
                            paddingBottom: "10px",
                            transform: "translate(45px, 30px)"
                        }}
                                className={ styles.OKButton}

                        > Enter </div>
                        <div style={{ width: 20 }}></div>

                    </div>


                </form>
          

            </div>
        }
            </>
    )
}
import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { loginToken, socketIOhttp, socketToken } from "../constants/httpVars";
import { useCookies } from "react-cookie";
import useZust from "../hooks/useZust";
import { io } from "socket.io-client";
import { ImageDiv } from "../pages/components/UI/ImageDiv";
import sha256 from 'crypto-js/sha256';
import styles from '../pages/css/home.module.css';
import { getStringHash, generateCode, browserID, getUintHash, getPermissionAsync } from "../constants/utility";
import { decrypt, generateKey, encrypt, createMessage, readKey, decryptKey, readPrivateKey,readMessage } from 'openpgp';
import { set, get } from "idb-keyval";


export const SocketHandler = (props = {}) => {
    
    const user = useZust((state) => state.user)
    const appHandler = useRef()
    const socketCmd = useZust((state) => state.socketCmd)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const setContactsCmd = useZust((state) => state.setContactsCmd)
    const loggedIn = useRef({value:false})

    const passRef = useRef()
    const socketConnected = useZust((state) => state.socketConnected)
    const setSocketConnected = useZust((state) => state.setSocketConnected)
    const [showLogin, setShowLogin] = useState(false)
    const setUploadRequest = useZust((state) => state.setUploadRequest)
    const setContacts = useZust((state) => state.setContacts)
    const setUser = useZust((state) => state.setUser)
    const addFileRequest = useZust((state) => state.addFileRequest)
    const sock = useRef({value:null})

    const contextRef = useRef({ value: null })


    useEffect(() => {
        createNewContext()
    }, [])


    useEffect(()=>{ 
        if(!(user.userID > 0))
        {
            loggedIn.current.value = false;
            sock.current.value = null

            
        }
    }, [user])


    useEffect(() => {

        if (sock.current.value == null && user.userID > 0) {



            setSocketConnected(false)

            setShowLogin(true)


        } else {
            if (user.userID > 0 && sock.current.value != null && !sock.current.value.connected) {

                contextRef.current.value = null
                sock.current.value = null
                setSocketConnected(false)


                setShowLogin(true)

            } else {

                setShowLogin(false)
            }
        }

    }, [sock.current.value, user])


    async function createNewContext(){
    
        const code = await generateCode(1024)
        


        const { privateKey, publicKey, revocationCertificate } = await generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [{ name: 'Arcturus', email: 'arcturus@arcturusnetwork.com' }],
            passphrase: code,
            format: 'armored'
        });
        

        contextRef.current.value ={
            contextID: await getStringHash(browserID,64),
            code: code,
            key: {
                privateKey: privateKey,
                publicKey: publicKey,
                revocationCertificate: revocationCertificate
            }
        }
    }



    async function encryptStringToServer(string){
        try{
        const publicKeyArmored = serverKeyRef.current.value


        const publicKey = await readKey({ armoredKey: publicKeyArmored });
       // await Promise.all(publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey })));
 

        /*const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue(string);
                controller.close();
            }
        });*/
     //   console.log(readableStream)await createMessage({ text: readableStream })

        const encrypted = await encrypt({
            message: await createMessage({ text: string }), // input as Message object
            encryptionKeys: publicKey
        });
         return encrypted
        }catch(err){
            sock.current.value = null
            console.log(err)
        }
    

       
    }

    async function decryptFromServer(encryptedString) {
        try{
            const contextCode = contextRef.current.value.code
            const armoredPrivateKey = contextRef.current.value.key.privateKey

            const decryptedKey = await decryptKey({
                privateKey: await readPrivateKey({ armoredKey: armoredPrivateKey }),
                passphrase: contextCode
            });

            const decryptedMessage = await readMessage({
                armoredMessage: encryptedString
            });


            const decrypted = await decrypt({
                message: decryptedMessage,
                decryptionKeys: decryptedKey

            });

            const chunks = [];
            for await (const chunk of decrypted.data) {
                chunks.push(chunk);
            }

            const decryptedString = chunks.join('');

            return decryptedString
        }catch(e){
            sock.current.value = null
            return undefined
        }

    }
 


    const userCode = useRef({value:null})

    const serverKeyRef = useRef({value:null})

    const socketConnect = (connectCmd) =>{
      
            sock.current.value = io(socketIOhttp, { auth: { token: loginToken }, transports: ['websocket'] });

            sock.current.value.on("serverInit", (serverKey)=>{

                serverKeyRef.current.value = serverKey
                const {nameEmail, password } = connectCmd.params
                const clientContext = {
                    contextID: contextRef.current.value.contextID,
                    contextKey: contextRef.current.value.key.publicKey,
                    nameEmail: nameEmail,
                    password: password
                }
                
                const jsonString = JSON.stringify(clientContext)

                encryptStringToServer(jsonString).then((encryptedJson) =>{

                    sock.current.value.emit("login", encryptedJson, (encryptedResponse) => {
                       
                        decryptFromServer(encryptedResponse).then((decryptedString)=>{
                            if(decryptedString != undefined){
                                const response = JSON.parse(decryptedString)

                                if ("success" in response && response.success) {
                                
                                    // setSocket(sock.current.value)
                                    loggedIn.current.value = true
                                    setSocketConnected(true)

                                    
                                    userCode.current.value = response.userCode

                                    const loginResponse = {
                                        success: true,
                                        user: response.user,
                                        contacts: response.contacts,
                                        userFiles: response.userFiles,
                                    
                                    }

                                    
                                    setShowLogin(false)
                                    
                                    addDefaultListeners()
                                    
                                    connectCmd.callback(loginResponse)
                                } else {
                        
                                    sock.current.value.disconnect()
                                    sock.current.value = null;
                                    loggedIn.current.value = false
                                    
                                    connectCmd.callback({ success: false})

                                }
                            }else{
                                connectCmd.callback({ success: false })
                            }
                        })
                    })
                })
            })
     
    }

    useEffect(() =>{
    
        if (sock.current.value == null)
        {
          
            if (socketCmd.cmd == "login" && !(("anonymous") in socketCmd)) {
                
                if (sock.current.value == null )
                {
                    socketConnect(socketCmd)
                }else{
               
                    socketCmd.callback({ error: new Error("Too many tries."), maxRetry:true})
                }
            } else{
                if (sock.current.value == null && socketCmd.cmd == "login") {

                    sock.current.value = io(socketIOhttp, { auth: { token: socketToken }, transports: ['websocket'] });
     
                    sock.current.value.on("serverInit", (serverKey) => {
                        serverKeyRef.current.value = serverKey
                        const clientContext = {
                            contextID: contextRef.current.value.contextID,
                            contextKey: contextRef.current.value.key.publicKey
                        } 
                        const ctxString = JSON.stringify(clientContext)
                        encryptStringToServer(ctxString).then((encryptedCtx) =>{

                            sock.current.value.emit("getAnonContext", encryptedCtx, (isContext)=>{
                                if(isContext){
                                    socketCmd.callback({ success: true })
                                }else{
                                    socketCmd.callback({success: false })

                                }
                            })

                        })
                        sock.current.value.on("disconnect", (res) => {

                            window.location.replace("/") 

                        })
                    })
                } else {
                    setShowLogin(true)
                    
                    if (socketCmd != null && typeof socketCmd.callback == "function"){
                        
                       
                        socketCmd.callback({ error: "not connected" })
                    }
                }
            }
            
            
        }else{
            if (("anonymous") in socketCmd) {

                switch (socketCmd.cmd) {
                    case "checkUserName":
                        sock.current.value.emit("checkUserName", socketCmd.params.text, (response) => {
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
                       
                        const userString = JSON.stringify(socketCmd.params)
                        console.log(userString)
                        encryptStringToServer(userString).then((encryptedUserString) =>{
                            console.log(encryptedUserString)
                            sock.current.value.emit("createUser", encryptedUserString, (response) => {
                                console.log(response)
                               
                                    socketCmd.callback(response)
                              

                            })
                        })

                        break;
                    case 'checkRefCodeEmail':
                        const jsonString = JSON.stringify(socketCmd.params)
                        const codeCallback = socketCmd.callback
                        encryptStringToServer(jsonString).then((encryptedParams) => {
                            sock.current.value.emit('checkRefCodeEmail', encryptedParams, (encryptedResponse) => {
                                decryptFromServer(encryptedResponse).then((resultJson) => {
                                    if(resultJson != undefined){
                                        const response = JSON.parse(resultJson)
                                        console.log(response)
                                        
                                        codeCallback(response)
                                    }else{
                                        codeCallback({error: new Error("Unable to decrypt")})
                                    }
                                })


                            })
                        })
                        break;

                }

            }else{

                          
                switch (socketCmd.cmd) {
                    case "createApp":
                        
                        encryptStringToServer(JSON.stringify(socketCmd.params)).then((encryptedParams) => {
                        
                            sock.current.value.emit("createApp", encryptedParams, (encryptedResponse) => {
                                
                                decryptFromServer(encryptedResponse).then((resultJson) => {
                                    if(resultJson != undefined){
                                        const response = JSON.parse(resultJson)
                                    
                                        socketCmd.callback(response)
                                    }else{
                                        socketCmd.callback({error: new Error("Unable to decrypt")})
                                    }
                                })
                            })
                        })

                        break;
                    case "checkOnline":
                        console.log("checkingOnline")
                        sock.current.value.timeout(500).emit("ping", (err, response)=>{
                            if(err){
                                sock.current.value = null
                                socketCmd.callback({ error: err })
                            }else{
                                 socketCmd.callback({ success: true, response:response})
                            }
                           
                        })
                        
                        break;
                    case "getAppList":
                        sock.current.value.emit("getAppList", socketCmd.params, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "getRealms":
                        sock.current.value.emit("getRealms", (response)=>{
                            socketCmd.callback(response)
                        })
                        break;
                    case "createStorage":
                        sock.current.value.emit("createStorage", socketCmd.params, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "checkStorageHash":
                      
                        sock.current.value.emit("checkStorageHash", socketCmd.params, (response) =>{
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
                        sock.current.value.emit("updateUserImage", socketCmd.params.imageInfo, (response) => {
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
                    case "getPeerLibrary":
                        sock.current.value.emit("getPeerLibrary", socketCmd.params, (response) => {
                            socketCmd.callback(response)
                        })
                        break;
                    case "getUserCode":
                        socketCmd.callback(userCode.current.value)
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
            sock.current.value.on("disconnect", (res) => {
                switch (res) {
                    case "io server disconnect":
                        sock.current.value = null
                        break;

                }
            })

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

  //  const setUserFiles = useZust((state) => state.setUserFiles)

    function login(name_email = "", pass = "") {
        setShowLogin(false)
            setSocketCmd({
          
                cmd: "login", params: { nameEmail: name_email, password: pass }, callback: async (response) => {
                    if (response.success) {

                        const user = response.user
                        const contacts = response.contacts
                        const userFiles = response.userFiles

                        await set(user.userID + "userFiles", userFiles)


                        setContacts(contacts)
                        setUser(user)

                        const value = await get(user.userID + "localDirectory")
                        let verified = false
                        if (value != undefined){ 
                            verified = await getPermissionAsync(value.handle)
                        
                            if (verified) addFileRequest({
                                command: "loadStorage", localDirectory: value, page: "login", id: crypto.randomUUID(), callback: (result) => {
                                    result.then((loaded) => {
                                        if (!loaded) {
                                            addSystemMessage(initStorage)
                                        }
                                    }) 
                            }})
                        }
                  


                    } else {
                        setDisable(false)
                        resolve(false)
                    }
            }})
      
    }


    return (
        
        <>
       
        {
            !socketConnected && user.userID > 0 &&
                <ImageDiv className={styles.glow} onClick={(e) => {
                setShowLogin(true)
            }} width={25} height={30} netImage={{ image: "/Images/icons/key-outline.svg", scale: .7, filter: "invert(100%)" }} />
        }
            {showLogin && user.userID > 0 && !socketConnected &&
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
                backgroundColor: "rgba(0,3,4,.98)",
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
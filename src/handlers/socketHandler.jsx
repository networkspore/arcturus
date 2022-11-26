import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { loginToken, socketIOhttp, socketToken } from "../constants/httpVars";
import useZust from "../hooks/useZust";
import { io } from "socket.io-client";

export const SocketHandler = (props = {}) => {
    
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const setSocket = useZust((state) => state.setSocket)
    const socketCmd = useZust((state) => state.socketCmd)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const loggedIn = useRef({value:false})



    useEffect(()=>{ 
        if(!(user.userID > 0))
        {
            loggedIn.current.value = false;
            sock.current.value = null

            
        }
    }, [user])




    const sock = useRef({value:null})

    const tryCount = useRef({value:1})

    useEffect(() =>{
        
        if(!loggedIn.current.value)
        {
            console.log(socketCmd)
            if (socketCmd.cmd == "login" && !(("anonymous") in socketCmd)) {
                    
                if (sock.current.value == null && tryCount.current.value < 5)
                {
                    sock.current.value =  io(socketIOhttp, { auth: { token: loginToken }, transports: ['websocket'] });
                
                    sock.current.value.on("connect", ()=>{
                        console.log("connected")
                        if(sock.current.value != null){
                            sock.current.value.emit("login", socketCmd.params, (response)=>{
                                if("success" in response && response.success){
                                   // setSocket(sock.current.value)
                                    loggedIn.current.value = true
                                    socketCmd.callback(response)
                                  
                                    tryCount.current.value = 1
                                    sock.current.value.on("disconnect", (res) => {
                                        switch (res) {
                                            case "io server disconnect":
                                                window.location.replace("/")
                                                break;

                                        }
                                    })
                                }else{
                              
                                    sock.current.value.disconnect()
                                    sock.current.value = null;
                                    loggedIn.current.value = false
                                    tryCount.current.value++
                                    socketCmd.callback({success:false})
                                    
                                }
                                setSocketCmd()
                            })
                        }
                    })
                }
            }else{
              
                if (sock.current.value == null && socketCmd.cmd == "login") {
                    sock.current.value = io(socketIOhttp, { auth: { token: socketToken }, transports: ['websocket'] });

                    sock.current.value.on("connect", () => {
                        socketCmd.callback({success:true})
                        sock.current.value.on("disconnect", (res) => {
                            switch (res) {
                                case "io server disconnect":
                                    window.location.replace("/")
                                    break;

                            }
                        })
                    })
                }else if(sock.current.value != null){
                
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
                        default:
                            socketCmd.callback({error: new Error("Not Implemented")})
                    }

                }else{
                    socketCmd.callback({ error: "not connected" })
                }
            }
            
            
        }else{
            switch (socketCmd.cmd) {
                case "getRealms":
                    sock.current.value.emit("getRealms", (response)=>{
                        socketCmd.callback(response)
                    })
                    break;
                case "checkStorageCRC":
                
                    sock.current.value.emit("checkStorageCRC", socketCmd.params.crc, (response) =>{
                        socketCmd.callback(response)
                    })
                    break;
                case "checkUserFiles":
                    sock.current.value.emit("checkUserFiles", socketCmd.params.crc, (response) => {
                        socketCmd.callback(response)
                    })
                    break; 
                case "checkFileCRC":
                    sock.current.value.emit("checkFileCRC", socketCmd.params.crc, (response) => {
                        socketCmd.callback(response)
                    }) 
                    break;
                case "updateUserPeerID":
                    sock.current.value.emit("updateUserPeerID", socketCmd.params.userPeerID, (response) =>{
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
                    sock.current.value.emit("deleteRealm", socketCmd.params.realmiD, (response) => {
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
            
                default:
                   socketCmd.callback({error: new Error( "not implemented")})
                    break;
            }
        }
    },[socketCmd])

    return (
        <></>
    )
}
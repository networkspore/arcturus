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


    useEffect(()=>{
        
       
      
    },[socket])

    const sock = useRef({value:null})

    const tryCount = useRef({value:1})

    useEffect(() =>{
        
        if(!loggedIn.current.value)
        {
            if(socketCmd.cmd == "login")
            {   
                console.log(sock.current.value)
                if (sock.current.value == null && tryCount.current.value < 5)
                {
                    sock.current.value =  io(socketIOhttp, { auth: { token: loginToken }, transports: ['websocket'] });
                
                    sock.current.value.on("connect", ()=>{
                        console.log("connected")
                        if(sock.current.value != null){
                            sock.current.value.emit("login", socketCmd.params, (response)=>{
                                if("success" in response && response.success){
                                    setSocket(sock.current.value)
                                    loggedIn.current.value = true
                                    socketCmd.callback(response)
                                    sock.current.value = null
                                    tryCount.current.value = 1
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
            }
            
        }else{
            switch (socketCmd.cmd) {
                default:
                   
                    break;
            }
        }
    },[socketCmd])

    return (
        <></>
    )
}
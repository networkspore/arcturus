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
        }
    }, [user.userID])


    useEffect(()=>{
        
       
      
    },[socket])

    const sock = useRef({value:null})

    useEffect(() =>{
        
        if(!loggedIn.current.value)
        {
            if(socketCmd.cmd == "login")
            {
                if(sock.current.value == null)
                {
                    sock.current.value =  io(socketIOhttp, { auth: { token: loginToken }, transports: ['websocket'] });
                
                    sock.current.value.on("connect", ()=>{
                       
                        if(sock.current.value != null){
                            sock.current.value.emit("login", socketCmd.params, (response)=>{
                                if("success" in response && response.success){
                                    setSocket(sock.current.value)
                                    loggedIn.current.value = true
                                    socketCmd.callback(response)
                                }else{
                                    sock.current.value.disconnect()
                                    sock.current.value = null;
                                    loggedIn.current.value = fakse
                                }
                                setSocketCmd()
                            })
                        }
                    })
                }
            }
            
        }else{
            switch (socketCmd.cmd) {
                case "login":
                   
                    break;
            }
        }
    },[socketCmd])

    return (
        <></>
    )
}
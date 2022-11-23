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
    const [loggedIn, setLoggedIn] = useState({name_email:null, password:null, userSocket:null})



    useEffect(()=>{ 
        if(user.userID > 0)
        {
            setLoggedIn(true)
        }else{
            setLoggedIn(false)
        }
    }, [user.userID])


    useEffect(()=>{
        
        console.log(socket)
      
    },[socket])

    const sock = useRef({value:null})

    useEffect(() =>{
        console.log(loggedIn)
        if(!loggedIn)
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
                                    setLoggedIn(true)
                                    socketCmd.callback(response)
                                    sock.current.value = null
                                }else{
                                    sock.current.value.disconnect()
                                    sock.current.value = null;
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
    },[socketCmd, loggedIn])

    return (
        <></>
    )
}
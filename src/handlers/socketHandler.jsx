import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import useZust from "../hooks/useZust";


export const SocketHandler = (props = {}) => {
    
    const user = useZust((state) => state.user)
    const socketListeners = useZust((state) => state.socketListeners)
    const socket = useZust((state) => state.socket)

    const [listeners, setListeners] = useState([])

    const addListener = (listener) => setListeners(produce((state)=>{
        state.push(listener)
    }))

    useEffect(()=>{

    },[])

    useEffect(()=>{
        if (Array.isArray(socketListeners) && socketListeners.length > 0)
        {
            socketListeners.forEach(socketListner => {
                const index = listeners.findIndex(listener => listener.id == socketListner.id)
                if(index == -1)
                {
                    socket.on(socketListner.cmd, socketListner.callback)
                    addListener(socketListner)
                }
            });
        }
    },[socketListeners])
}
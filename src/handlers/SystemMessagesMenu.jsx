import React, { useState, useEffect,useRef } from "react";

import { useNavigate } from "react-router-dom";

import useZust from "../hooks/useZust";
import { ImageDiv } from "../pages/components/UI/ImageDiv";

import styles from '../pages/css/home.module.css'
import produce from "immer";
import { useLayoutEffect } from "react";

export const SystemMessagesMenu = (props = {}) => {


    const user = useZust((state) => state.user)

    const navigate = useNavigate();

    const [menuList, setMenuList] = useState([]);
  
    const systemMessages = useZust((state) => state.systemMessages)

    const removeSystemMessage = (id) => useZust.setState(produce((state) => {
        const length = state.systemMessages.length;
        if(length > 0)
        {
            if(length == 1){
                if(state.systemMessages[0].id == id)
                {
                  
                    state.systemMessages.pop()
        
                }
            }else{
                for(let i =0; i < state.systemMessages.length ; i++)
                {
                    if (state.systemMessages[i].id == id) {
                        state.systemMessages.splice(i, 1)
                        break;
                    }
                }
            }
        }
       
    }))

    useEffect(() => {
        if(systemMessages.length > 0)
        {
          
            let tmpArray = [];

            systemMessages.forEach(message => {
                const messageNavigate = message.navigate;
                const messageID = message.id
                const messageText = message.text
                const messageNetImage = message.netImage
                const messageDeleteOn = "deleteOn" in message ? message.deleteOn + "" : ""
                const cancelable = "cancelable" in message ? message.cancelable : false
                const callback = "callback" in message ? message.callback : null

                
                if(messageDeleteOn.length > 0){
                    const index = messageDeleteOn.indexOf(":")
                    const args = messageDeleteOn.split(":")
        
                    const cmd = index == -1 ? messageDeleteOn : args[0]
        
                    switch(cmd)
                    {
                        case "seconds":
              
                            const seconds = parseInt(args[1]) * 1000
                      
                            setTimeout(() => {  
                               
                                removeSystemMessage(messageID)
                            }, seconds);

                            break;
                    }

                    
                }

                tmpArray.push(
                    <div key={messageID} onClick={(e)=>{
                        if (callback != null){
                            callback(messageID)
                        }
                        removeSystemMessage(messageID)
                        navigate(messageNavigate)

                    }}  style={{display:"flex"}} className={styles.result}>
                        <div style={{paddingLeft:"2px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <ImageDiv width={20} height={20} netImage={messageNetImage} />
                        </div>
                        <div style={{ color: "white", flex: 1, paddingLeft:"10px"}}>
                            {messageText}
                        </div>
                        {cancelable &&
                        <div onClick={(e)=>{
                            e.stopPropagation()
                            removeSystemMessage(messageID)
                        }}>
                            <ImageDiv width={20} height={20} netImage={{image:"Images/icons/close-outline.svg", filter:"invert(100%)"}} />
                        </div>
                        }
                    </div>
                )
            });

            setMenuList(tmpArray)
        }else{
            setMenuList([])
        }

    }, [systemMessages])
  //  const timerRef = useRef({ timeoutID:null})
 

    return (
        
      
        <div style={{
            display:"flex",
            flexDirection:"column",
            width:250,
            position:"fixed",
            right: 0,
            top: 33,

            margin:5,
        }}>
            <div style={{
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                backgroundImage: "linear-gradient(black, #cccccc20)",
                width:"100%"
            }}>
            {menuList}
            </div>
          
        </div>
      
      
    )
}



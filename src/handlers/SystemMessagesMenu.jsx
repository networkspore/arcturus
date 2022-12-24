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
    const loadingStatus = useZust((state) => state.loadingStatus)
    const setLoadingStatus = useZust((state) => state.setLoadingStatus)
  
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
    const [complete, setComplete] = useState(false)
    useLayoutEffect(()=>{
        const isComplete = loadingStatus != null ? loadingStatus.complete && loadingStatus.index == loadingStatus.length - 1 : true

        setComplete( isComplete)
        if (isComplete && loadingStatus != null)
        {
            setTimeout(() => {
              setLoadingStatus(null)
            }, 2000);
        }

       
    },[loadingStatus])

    return (
        
      
        <div style={{
            display:"flex",
            flexDirection:"column",
            width:250,
            position:"fixed",
            right: 0,
            top: 33,
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            backgroundImage:"linear-gradient(black, #cccccc20)",
            margin:5,
        }}>
          
            {menuList}
            { loadingStatus != null &&
                <div onClick={(e)=>{setLoadingStatus(null)}} style={{
                    display: "flex",
                    flex: 1,
                    width:"100%",
                    alignItems: "center",
                    justifyContent: "center",
                   
                    backgroundImage: `linear-gradient(to right, #ffffff ${(loadingStatus.index / loadingStatus.length * 100) + "%"}, #00000030 ${(loadingStatus.index / loadingStatus.length * 100) + "%"})`,
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff40, inset 0 0 30px #77777740",
                }}>
                    
                     <div style={{ 
                        color:  "#888888",
                        fontFamily: "webpapyrus", 
                        fontSize: 13, paddingTop: 3, 
                        paddingBottom: 3, 
                         mixBlendMode: "difference", 
                         fontWeight:"bold",
                         textShadow:"#ffffff50"
                         }}> 

                        {complete ? "Complete" : loadingStatus.name.length > 30 ? loadingStatus.name.slice(0,30) + ".." : loadingStatus.name}
                    </div>
                </div>
            }
        </div>
      
      
    )
}



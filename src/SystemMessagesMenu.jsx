import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import useZust from "./hooks/useZust";
import { ImageDiv } from "./pages/components/UI/ImageDiv";

import styles from './pages/css/home.module.css'

export const SystemMessagesMenu = (props = {}) => {

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)

    const navigate = useNavigate();

    const [menuList, setMenuList] = useState([]);

    const connected = useZust((state) => state.connected)

    const systemMessages = useZust((state) => state.systemMessages)

    useEffect(() => {
        if(systemMessages.length > 0)
        {
          
            let tmpArray = [];

            systemMessages.forEach(message => {
                const messageNavigate = message.navigate;
                const messageID = message.id
                const messageText = message.text
                const messageNetImage = message.netImage
                tmpArray.push(
                    <div onClick={(e)=>{
                        navigate(messageNavigate)
                    }} key={messageID} style={{display:"flex"}} className={styles.result}>
                        <div style={{paddingLeft:"2px"}}>
                            <ImageDiv width={18} height={18} netImage={messageNetImage} />
                        </div>
                        <div style={{ paddingLeft:"10px"}}>
                            {messageText}
                        </div>
                    </div>
                )
            });

            setMenuList(tmpArray)
        }

    }, [systemMessages])



    return (
        <>
        {connected && menuList.length > 0 &&
        <div style={{
           
            backgroundColor: "#000000A0",
            width: 200,
            
            right: 0,
            top: 20,
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            display:"flex",
            marginTop:"5",
            marginBottom:5,
            marginLeft:5,
            marginRight:5
        }}>
            <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
                <div style={{flex:1, display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>

                    <div style={{ width: "100%", flex: 1, backgroundColor: "#33333390", display: "flex", alignItems: "left", flexDirection: "column", justifyContent: "center", }}>


                        {menuList}
                    </div>
                </div>
                    <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
        </div>
        }
        </>
    )
}



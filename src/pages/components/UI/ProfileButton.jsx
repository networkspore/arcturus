import React from "react"
import { useNavigate } from "react-router-dom"
import { ImageDiv } from "./ImageDiv"
import styles from "../../css/home.module.css"

export const ProfileButton = (props ={}) =>{
  

    return(
        <div className={styles.glow} onClick={props.onProfileClick} style={{
            
            fontFamily: "WebPapyrus",
            color: "#c7cfda",
            fontSize: "16px",
            paddingLeft: "3px",
            paddingRight: "20px",
            whiteSpace: "nowrap",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            cursor:"pointer"
        }}>   <ImageDiv width={30} height={28} netImage={{
                
            image: "", filter: "invert(100%)", scale: .8, update: {
                command: "getIcon",
                file: props.user.image,
                waiting: { url: "/Images/spinning.gif", style: { filter: "invert(100%)" } },
                error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

            },
            }} /><div style={{ paddingLeft: 2 }}>{props.user.userName}</div> </div>
    )
}
import React from "react"
import { useNavigate } from "react-router-dom"
import { ImageDiv } from "./ImageDiv"
import styles from "../../css/home.module.css"
import useZust from "../../../hooks/useZust"

export const ProfileButton = (props ={}) =>{
    const configFile = useZust((state) => state.configFile)

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
        }}>   {configFile.handle != null && props.user.image != null && props.user.image.hash != null ? <ImageDiv width={30} height={28} 
            netImage={{
                backgroundColor:"",
                image: "", filter: "", scale: .8, 
                update: {
                    command: "getIcon",
                    file: props.user.image,
                    waiting: { url: "/Images/spinning.gif", style: { filter: "invert(100%)" } },
                    error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } }, 
                },
                }} /> : <ImageDiv width={30} height={28}
                    netImage={{
                        backgroundColor: "",
                        image: "/Images/icons/person.svg", filter: "invert(100%)"
                    }} /> }
            <div style={{ paddingLeft: 2 }}>{props.user.userName}</div> </div>
    )
}
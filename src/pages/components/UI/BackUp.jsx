import React from "react"
import { useNavigate } from "react-router-dom"
import { ImageDiv } from "./ImageDiv"
import styles from "../../css/home.module.css"

export const BackUp = (props ={}) =>{
    const navigate = useNavigate()

    return(
        <div className={styles.glow} style={{  paddingRight:5}} onClick={(e) => {
            navigate("/")
        }} >
            
            <ImageDiv width={30} height={30}  netImage={{
                 filter:"invert(100%)", image: "/Images/icons/return-up-back-outline.svg", scale: .6,
            }} />

        </div>
    )
}
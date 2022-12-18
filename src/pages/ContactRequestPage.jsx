import produce from "immer"
import { useEffect, useState } from "react"
import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import styles from '../../css/home.module.css';

export const ContactRequestPage = (props = {}) =>{
  //  const [fullSize, setFullSize] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)

    const pageSize = useZust((state) => state.pageSize)

    useEffect(()=>{
        setCurrentImage(props.currentImage)
    },[props.currentImage])

   /* const toggleFullSize = (e) =>{
        setFullSize(state => !state)
    }*/

    return (
        <>
        {currentImage != null &&
        <div id='Contact Request' style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.95)",
            left:   "50%",
            top: "50%",
            width:  600,
            height:  400,
            transform: "translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
        }}>
            <div style={{
              
                display:"flex",
                alignItems:"start",
                justifyContent:"center",
                width: "100%",
                paddingTop: 0,
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",


            }}>
          
            <div className={styles.glow} onClick={(e) => {
                    props.close()
                }} style={{
                    opacity: .7,
                    cursor: "pointer",
                    paddingLeft: "10px",
                    paddingTop:5,
                    textAlign: "center",

            }}><ImageDiv width={20} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/close-outline.svg" }} />
            </div>
           
                
                        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}> Contact Request</div>
            </div>
            <div style={{width:"100%", flex:1, height:"100%"}}>
                       
            </div>
        </div>
            }
        </>
    )
}
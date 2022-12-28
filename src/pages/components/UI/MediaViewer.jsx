import produce from "immer"
import { useEffect, useState, useRef } from "react"
import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import styles from '../../css/home.module.css';
import { VideoDiv } from "./VideoDiv";


export const MediaViewer = (props = {}) => {
    const [fullSize, setFullSize] = useState(false)
    const [currentVideo, setCurrentVideo] = useState(null)
    const [showBar, setShowBar] = useState(true)
    const pageSize = useZust((state) => state.pageSize)

    useEffect(()=>{
        setCurrentVideo(props.currentVideo)
    },[props.currentVideo])

    const timeout = useRef({ value: null })

    const onMouseMove = (e) => {
  
        setShowBar(true)

        if (timeout.current.value != null) clearTimeout(timeout.current.value)

        
        callTimeout()
        


    }
    const toggleFullSize = (e) => {
        setFullSize(state => !state)

    }
    const callTimeout = () => {
      
        timeout.current.value = setTimeout(() => {
            setShowBar(false)
            timeout.current.value = null
        }, 1000);
    }

    const hideBar = (e) =>{
        setShowBar(false)

    }
    

    return (
        <>
        {currentVideo != null &&
            <div   id='MediaViewer' style={{
            position: "fixed",
            zIndex:100,
            backgroundColor: "rgba(0,3,4,.95)",
            left: fullSize ?0 : "50%",
            top: fullSize ? 0 : "50%",
            width: fullSize ? pageSize.width  : 720,
            height: fullSize ? pageSize.height: 480,
            transform:fullSize ? "" : "translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            display:"flex",
            flexDirection:"column"
        }}>
           {showBar && <div onMouseEnter={(e)=>{
                if (timeout.current.value != null) clearTimeout(timeout.current.value)
           }} style={{
                position:"absolute",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                width: "100%",
                paddingTop: 0,
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",
                zIndex:999

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
            <div className={styles.glow} onClick={toggleFullSize} style={{
                opacity: .7,
                cursor: "pointer",
                            paddingLeft: "10px",
                            paddingTop: 5,
                textAlign: "center",

            }}><ImageDiv width={18} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/scan-outline.svg" }} />
            </div>
                
                        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}> {currentVideo.title == undefined ? currentVideo.name : currentVideo.userFileName}</div>
                <div style={{width:50, height:40}}>&nbsp;</div>
                    </div>}
                    <div tabIndex={0} style={{flex:1, display:"flex"}}>
                    <VideoDiv 
                        onMouseMove={onMouseMove} 
                        file={currentVideo}
                    />
                    </div>
        </div>
            }
        </>
    )
}
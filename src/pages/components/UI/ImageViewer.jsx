import produce from "immer"
import { useEffect, useState } from "react"
import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import styles from '../../css/home.module.css';
import { useRef } from "react";

export const ImageViewer = (props = {}) =>{
    const [fullSize, setFullSize] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)
    const [showBar, setShowBar] = useState(true)
    const [currentHeight, setCurrentHeight] = useState(800)
    const [currentWidth, setCurrentWidth] = useState(600)
    const pageSize = useZust((state) => state.pageSize)

    useEffect(()=>{
        if(currentImage){
    
            if(fullSize)
            {
                if(pageSize.height <= currentImage.height)
                {
                    setCurrentHeight(pageSize.height)
                }else{
                    setCurrentHeight(currentImage.height)
                }
                if(pageSize.width <= currentImage.width)
                {
                    setCurrentWidth(pageSize.width)
                }else{
                    setCurrentWidth(currentImage.width)
                }
            }else{
                setCurrentHeight(800)
                setCurrentWidth(600)
            }
           
        }
    },[fullSize, currentImage])

    useEffect(()=>{
        setCurrentImage(props.currentImage)
    },[props.currentImage])

    const toggleFullSize = (e) =>{
        setFullSize(state => !state)

    }

  
    const timeout = useRef({value:null})
    useEffect(() => { onMouseMove(null) },[])

    const onMouseMove = (e) => {
        setShowBar(true)
        
        if(timeout.current.value) clearTimeout(timeout.current.value)
     
        
           
        const callTimeout = () => {
            timeout.current.value = setTimeout(() => {
                setShowBar(false)
                timeout.current.value = null
            }, 1000);
        }

    
        if(showBar)    callTimeout()
     
    }

    return (
        <>
        {currentImage != null &&
        <>
                {fullSize && <div onMouseMove={onMouseMove} style={{ position: "fixed", backgroundColor: "#000000DD", top:0, left:0,width:pageSize.width, height:pageSize.height}}></div> }
        <div  onMouseMove={onMouseMove}  tabIndex={0}  id='ImageViewer' style={{
                outline:0,
            position: "fixed",
            zIndex:100,
            backgroundColor:fullSize ? "": "#000000EE",
            left:  "50%",
            top:  "50%",
            padding:5,
                   
            transform:"translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection:"column",
                    overflowY: currentHeight < currentImage.height ? "scroll" : "",
                    overflowX: currentWidth < currentImage.width ? "scroll" : "",
         height: currentHeight,
         width:currentWidth
        }}>
           {showBar && !fullSize && <div style={{
                position:"fixed",
                top:0,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                width:"100%",
                paddingTop: 0,
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",


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
            <div className={styles.glow} 
                onClick={(e) =>{
                    toggleFullSize(e)
                }} 
                style={{
                    opacity: .7,
                    cursor: "pointer",
                                paddingLeft: "10px",
                                paddingTop: 5,
                    textAlign: "center",

            }}><ImageDiv width={18} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/scan-outline.svg" }} />
            </div>
                
                        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}> {currentImage.title == undefined ? currentImage.name : currentImage.userFileName}</div>
                <div style={{width:50, height:40}}>&nbsp;</div>
            </div>}
                    <div onMouseMove={onMouseMove} style={{ height: fullSize ? currentImage.height : 800, width: fullSize ? currentImage.width : 600, }}>
                        <ImageDiv width={"100%"} height={"100%"} style={{ borderRadius: 0, }} netImage={{
                            scale: 1,
                            update: {
                                
                                command: "getImage",
                                file: currentImage,
                                waiting: { url: "/Images/spinning.gif" },
                                error: { url: props.errorImage, style: { filter: "invert(80%)" } },

                            },
                            backgroundColor: "",
                        

                        }} />
            </div>
        </div>
        </>
            }
            {showBar && fullSize && <div style={{
                position:"fixed",
                top:0,
                left:95,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: pageSize.width - 85,
                paddingTop: 0,
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundColor:"black",
                height:40,
                zIndex:999,
            }}>

                <div className={styles.glow} onClick={(e) => {
                    props.close()
                }} style={{
                    opacity: .7,
                    cursor: "pointer",
                    paddingLeft: "10px",
                    paddingTop: 5,
                    textAlign: "center",

                }}><ImageDiv width={20} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/close-outline.svg" }} />
                </div>
                <div className={styles.glow}
                    onClick={(e) => {
                        toggleFullSize(e)
                    }}
                    style={{
                        opacity: .7,
                        cursor: "pointer",
                        paddingLeft: "10px",
                        paddingTop: 5,
                        textAlign: "center",

                    }}><ImageDiv width={18} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/scan-outline.svg" }} />
                </div>

                <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}> {currentImage.title == undefined ? currentImage.name : currentImage.userFileName}</div>
                <div style={{ width: 50, height: 40 }}>&nbsp;</div>
            </div>}
        </>
    )
}
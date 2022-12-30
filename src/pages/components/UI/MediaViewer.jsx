import produce from "immer"
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react"
import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import styles from '../../css/home.module.css';
import { VideoDiv } from "./VideoDiv";



const MediaViewer = (props = {}, ref) => {

    const divRef = useRef()
    const currentHash = useZust((state) => state.currentHash)
    const setCurrentHash = useZust((state) => state.setCurrentHash)
    const [currentVideo, setCurrentVideo] = useState(null)

    const [mediaSize, setMediaSize] = useState(null)

    const timeout = useRef({ value: null })

    const [currentHeight, setCurrentHeight] = useState(720)
    const [currentWidth, setCurrentWidth] = useState(480)
    const [showBar, setShowBar] = useState(true)

    const setOnce = useRef({value:false})

    useEffect(()=>{
        setCurrentVideo(props.currentVideo)
        if (setOnce.current.value == false && props.currentVideo != undefined){
            setOnce.current.value = true
            setCurrentHash(props.currentVideo.hash)
        }
    },[props.currentVideo])



    useEffect(()=>{
        
        
        if(mediaSize == null){
            setCurrentWidth(740)
            setCurrentHeight(480)
        }else{
            const ratio = mediaSize.width / mediaSize.height
            const dw = ratio >= 4/3 ? 740 : mediaSize.height
            const dh = dw * ratio
            const w  = mediaSize.width < dw ? mediaSize.width : dw
            const h = mediaSize.height < dh ? mediaSize.height : dh
            setCurrentWidth(w)
            setCurrentHeight(h)
        }
        
    },[ mediaSize])

    const onMouseMove = (e) => {
  
        setShowBar(true)

        if (timeout.current.value != null) clearTimeout(timeout.current.value)

        
        callTimeout()
        


    }
  
    const callTimeout = (ms = 2700) => {
      
        timeout.current.value = setTimeout(() => {
            setShowBar(false)
            timeout.current.value = null
        }, ms);
    }



    const onLoadedMetaData = (e) =>{
        const {offsetWidth, offsetHeight} = e.target
    
        setMediaSize({
            width: offsetWidth, 
            height: offsetHeight,
        })

   
    }

    useImperativeHandle(
        ref,
        () => ({
            
    }),[])
    

    return (
        <>
        {currentVideo != null &&
            <div
                tabIndex={0}
            
                ref={divRef}
                id='MediaViewer' 
                style={{
                    visibility: currentHash == currentVideo.hash ? "visible" : "hidden",
                position: "fixed",
                outline:0,
                backgroundColor: "rgba(0,3,4,.95)",
                left: "50%",
                top:  "50%",
                width:  currentWidth,
                height:  currentHeight,
                transform: "translate(-50%,-50%)",
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
            }}>
          
            <div tabIndex={0} style={{display:"flex", flex:1,  height: currentHeight, width:currentWidth}}>
            <VideoDiv
                
                close={props.close}
                showBar={showBar}
                cancelTimeout={()=>{
                    if (timeout.current.value != null) clearTimeout(timeout.current.value)
                }}
                width={currentWidth}
                height={currentHeight}
                onLoadedMetaData={onLoadedMetaData}
                onMouseMove={onMouseMove} 
                file={currentVideo}
            />
            </div>
                   
        </div>
        
            }
          
        </>
    )
}
export default forwardRef(MediaViewer)
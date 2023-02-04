import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react"

import { ImageDiv } from "./ImageDiv"
import { useInView } from 'react-intersection-observer';

const RowFile = (props ={}) =>{
  //  const [onScreen, setOnScreen] = useState(false)
  //  const [isVisible, setIsVisible] = useState(true)
    const { ref, inView, entry } = useInView({
 
        threshold: 0,
    });
  

    //const isVisible = !!entry?.isIntersecting
    /*useImperativeHandle(
        ref,
        () => ({
            setShow:(value) =>{setOnScreen(value)},
            getShow:onScreen,
            divRef:divRef,
        }),[divRef.current, onScreen])*/


    /*useEffect(()=>{
        if(divRef.current){
            if(props.observe != undefined){
                props.observe(divRef.current)
            }
        }
        return ()=>{
            props.unobserve(divRef.current)
        }
    },[])*/



    return (

        <div 
            id={props.idHeader + props.hash}
            ref={ref}
            {... props}
        >
            {inView ? <>
            <div style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                <ImageDiv width={20} height={20} style={{ borderRadius: 5, overflow: "hidden" }} netImage={props.netImage} />
            </div>
            <div style={{ flex: 0.2, color: "#888888", }}>{props.mimeType}</div>

            <div style={{ flex: 1, color: "white", }}>{props.name}</div>
            <div style={{ flex: 0.4, maxWidth: 150, minWidth: 80, color: "#888888", whiteSpace: "nowrap", overflow: "clip", marginRight: 10 }}>{props.modified.slice(0, 16)}</div>
            <div style={{ flex: 0.3, color: "#888888", display: "flex", whiteSpace: "nowrap", overflow: "clip", }}>{props.size}</div>
            </>:<div style={{height:20}}></div>}
        </div>

       
            
    )
}

export default RowFile
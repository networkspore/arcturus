import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react"

import { ImageDiv } from "./ImageDiv"
import { useInView } from 'react-intersection-observer';

const IconFile = (props ={}) =>{
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
            id={props.id} 
            ref={ref}
            onDoubleClick={props.onDoubleClick}
            onClick={props.onClick}
            style={{ 
                overflow: "clip", 
                maxWidth: 120, 
                overflowClipMargin: props.selected ? 500 : 0, 
                zIndex: props.selected ? 9999 : 0, 
                display: "flex", flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center" 
                }}>
                    { inView ?<>
                <ImageDiv 
                    style={{ margin: 10, overflow: "hidden" }}

                    className={props.className}
                    height={props.height}
                    width={props.width}
                    netImage={props.netImage}

                />
            <div style={{
                boxShadow: props.selected ? "0 0 10px #ffffff80" : "",
                textShadow: props.selected ? "1px 1px 3px black" : "", display: "flex", alignItems: "center", fontFamily: "webpapyrus", fontSize: "12", whiteSpace: "nowrap", padding: 5, 
                background: props.selected ? "#777777" : "", 
                color: props.selected ? "black" : "white", borderRadius: 10
            }}>
                {props.selected ? props.name : props.name.length > 11 ? props.name.slice(0, 11) + ".." : props.name}
            </div></> : <><div
        style={{
            margin: 10,
            overflow: "hidden",
            height: props.height,
            width: props.width,
        }}>&nbsp;</div>
        <div style={{
              
                display: "flex", alignItems: "center", fontFamily: "webpapyrus", fontSize: "12", whiteSpace: "nowrap", padding: 5,
                background: props.selected ? "#777777" : "",
                color: props.selected ? "black" : "white", borderRadius: 10
            }}>
                &nbsp;
            </div></>
            }

        </div>
    )
}

export default IconFile
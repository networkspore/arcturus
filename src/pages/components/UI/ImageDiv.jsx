import { get } from "idb-keyval";
import React, { useEffect, useState, useRef } from "react";
import useZust from "../../../hooks/useZust";


export const ImageDiv = (props = {}) => {
    const pageSize = useZust((state) => state.pageSize)
    const divRef = useRef()

    const [imgURL, setImgURL] = useState(null);
    const [scaleWidth, setScaleWidth] = useState("0px");
    const [scaleHeight, setScaleHeight] = useState("0px");
    const [filter, setFilter] = useState("")

    const [imgStyle, setImgStyle] = useState({})

    
    const [style, setStyle] = useState({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      
        overflow: "hidden",
        borderRadius: "20px"
    })

    const onClick = "onClick" in props ? props.onClick : null

  

    useEffect(() => {
       
       
        const tmp = ("netImage" in props) ? props.netImage !== undefined ?  props.netImage : {} : {};

      

        let info = { 
            opacity: ("opacity" in tmp) ? tmp.opacity : 1,
            scale: ("scale" in tmp) ? tmp.scale : 1, 
            image: ("image" in tmp) ? tmp.image : "", 
            filter: ("filter" in tmp) ? tmp.filter : null, 
            backgroundImage: ("backgroundImage" in tmp) ? tmp.backgroundImage : null, 
            backgroundColor: ("backgroundColor" in tmp) ? tmp.backgroundColor : "#000000" 
        };
        
       
        
        const propsWidth = ("width" in props) ? props.width : "width" in tmp ? tmp.width : null;

        const propsHeight = ("height" in props) ? props.height : "height" in tmp ? tmp.height : null;
     
        let scale = info.scale;
        const bounds = propsWidth != null && propsHeight != null ? {width:propsWidth, height:propsHeight}: divRef.current ?  divRef.current.getBoundingClientRect() : {width:30, height:30}

        let percent = 1;

        let tmpHeight = 0, tmpWidth = 0;

        if(bounds.width > bounds.height)
        {{
            if(bounds.width != 0)
                percent = bounds.height / bounds.width
    
            }
            tmpWidth = (scale * 100 * percent) + "%"
           tmpHeight = (scale * 100) + "%"
     

        } else {
            {
                if (bounds.width != 0){
    
                    percent = bounds.width /bounds.height
                }
                tmpWidth = (scale*100) + "%"
                tmpHeight = (scale*100*percent)+"%"
            
            }
        }
    
        let tmpStyle = {
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            borderRadius:"20px",
            width: bounds.width,
            height: bounds.height,
            backgroundColor: info.backgroundColor,
            backgroundImage: info.backgroundImage,
        };

        if ("style" in props) {
            let styleArray = Object.getOwnPropertyNames(props.style);

            styleArray.forEach(element => {
                tmpStyle[element] = props.style[element];
            });
        }
        let tmpImgStyle = { width: tmpWidth, 
            height: tmpHeight, 
            filter: info.filter, 
            opacity:info.opacity
        }
      
        setImgStyle(tmpImgStyle)

        setImgURL(info.image)
 
        
        setStyle(tmpStyle)
     
    
    }, [props, pageSize])




   async function updateImgURL (image) {

   }

    return (
        <div about={props.about} className={props.className} ref={divRef} onClick={onClick} style={style}>
            {imgURL != null && imgURL != "" ? <img src={imgURL} style={imgStyle} /> : ""}
        </div>
    )
}
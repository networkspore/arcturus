import React, { useEffect, useState, useRef } from "react";
import useZust from "../../../hooks/useZust";


export const ImageDiv = (props = {}) => {
    const pageSize = useZust((state) => state.pageSize)
    const divRef = useRef()

    const [img, setImg] = useState("");
    const [scaleImgWidth, setScaleWidth] = useState("0px");
    const [scaleImgHeight, setScaleHeight] = useState("0px");
    const [filter, setFilter] = useState("")
    const [backgroundImage, setBackgroundImage] = useState("")
    const [backgroundColor, setBackgroundColor] = useState("")
    const [width, setWidth] = useState(110)
    const [height, setHeight] = useState(110)

    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage,
        overflow: "hidden",
        borderRadius: "20px"
    }
    
    if ("style" in props) {
        let styleArray = Object.getOwnPropertyNames(props.style);

        styleArray.forEach(element => {
            style[element] = props.style[element];
        });
    }

    const onClick = "onClick" in props ? props.onClick : null

    useEffect(() => {
        var w = width;
        var h = height
        if ("width" in props) {
            setWidth(props.width)
            w = props.width;
        }
        if ("height" in props) {
            setHeight(props.height)
            h = props.height;
        }

        if ("netImage" in props) {
            var info = { scale:1, image: "" , filter:"", backgroundImage: "", backgroundColor:"#000000"};
            const tmp = props.netImage != null ? props.netImage : info;
            info.image = ("image" in tmp) ? tmp.image : "";
            
            if ("filter" in tmp) {
                info.filter = tmp.filter;
            }
            if ("backgroundImage" in tmp) {
                info.backgroundImage = tmp.backgroundImage;
            }
            if ("backgroundColor" in tmp) {
                info.backgroundColor = tmp.backgroundColor;
            }
            info.scale = ("scale" in tmp) ? tmp.scale : 1
                 
            setImg(info.image);
            const propsWidth = ("width" in props) ? props.width : null;

            const propsHeight = ("height" in props) ? props.height : null;

            let scale = info.scale;
            const bounds = propsWidth != null && propsHeight != null ? {width:propsWidth, height:propsHeight}: divRef.current ?  divRef.current.getBoundingClientRect() : {width:0, height:0}
       
            let percent = 1;
            if(bounds.width > bounds.height)
            {{
                if(bounds.width != 0)
                    percent = bounds.height / bounds.width
         
                }
                const tmpWidth = (scale * 100 * percent) + "%"
                const tmpHeight = (scale * 100) + "%"
                setScaleHeight(tmpHeight);
                setScaleWidth(tmpWidth);

            } else {
                {
                    if (bounds.width != 0){
          
                        percent = bounds.width /bounds.height
                    }
                    const tmpWidth = (scale*100) + "%"
                    const tmpHeight = (scale*100*percent)+"%"
                    setScaleHeight( tmpHeight);
                    setScaleWidth( tmpWidth);
                }
            }
          
           
        

            
            setFilter(info.filter);
            
            setBackgroundImage(info.backgroundImage)
            setBackgroundColor(info.backgroundColor)

            
        }


    }, [props, pageSize])

   

    return (
        <div about={props.about} className={props.className} ref={divRef} onClick={onClick} style={style}>
            {img != null && img != "" ? <img src={img} style={{width:scaleImgWidth, height:scaleImgHeight, filter:filter}} /> : ""}
        </div>
    )
}
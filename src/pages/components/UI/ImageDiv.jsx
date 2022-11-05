import React, {useEffect, useState} from "react";



export const ImageDiv = (props = {}) => {



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
            var info = { scale:0.75, image: "" , filter:"", backgroundImage: "", backgroundColor:"#000000"};
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
            info.scale = ("scale" in tmp) ? tmp.scale : .75
                 
            setImg(info.image);
            

            const percent = (info.scale * 100) +"%"
           
            setScaleHeight(percent);
            setScaleWidth(percent);

            
            setFilter(info.filter);
            
            setBackgroundImage(info.backgroundImage)
            setBackgroundColor(info.backgroundColor)

            
        }


    }, [props])

   

    return (
        <div onClick={onClick} style={style}>
            {img != null ? <img src={img} style={{width:scaleImgWidth, height:scaleImgHeight, filter:filter}} /> : ""}
        </div>
    )
}
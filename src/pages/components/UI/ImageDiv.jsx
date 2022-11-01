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
            var info = { width: 0, height: 0, image: "" , filter:"", backgroundImage: "", backgroundColor:"#000000"};
            const tmp = props.netImage;
            if ("image" in tmp) {
                info.image = tmp.image;
            }
            if ("width" in tmp) {
                info.width = tmp.width;
            }
            if ("height" in tmp) {
                info.height = tmp.height;
            }
            if ("filter" in tmp) {
                info.filter = tmp.filter;
            }
            if ("backgroundImage" in tmp) {
                info.backgroundImage = tmp.backgroundImage;
            }
            if ("backgroundColor" in tmp) {
                info.backgroundColor = tmp.backgroundColor;
            }
         
            if (info.width > w || info.height > h) {


                if (info.width > info.height) {
                    setScaleWidth("100%")
                    const ratio = (350 / info.width) * info.height;
                    setScaleHeight(ratio + "px");
                } else {
                    setScaleHeight("100%");
                    const ratio = (300 / info.height) * info.width;

                    setScaleWidth(ratio + "px")
                }



            } else {
               
                setScaleWidth(info.width + "px")
                setScaleHeight(info.height + "px");
            }
            setFilter(info.filter);
            setImg(info.image);
            setBackgroundImage(info.backgroundImage)
            setBackgroundColor(info.backgroundColor)
        }


    }, [props])

   

    return (
        <div onClick={onClick} style={style}>
            {img != "" ? <img src={img} style={{width:scaleImgWidth, height:scaleImgHeight, filter:filter}} /> : ""}
        </div>
    )
}
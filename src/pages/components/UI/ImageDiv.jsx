import React, { useEffect, useState, useRef, useId} from "react";
import useZust from "../../../hooks/useZust";


export const ImageDiv = (props = {}) => {
    const pageSize = useZust((state) => state.pageSize)
    const divRef = useRef()

    const [imgURL, setImgURL] = useState(null);
    const [scaleWidth, setScaleWidth] = useState("0px");
    const [scaleHeight, setScaleHeight] = useState("0px");
    const [filter, setFilter] = useState("")

    const [imgStyle, setImgStyle] = useState({})
    const imgDivId = useId()
    
    const [style, setStyle] = useState({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      
        overflow: "hidden",
        borderRadius: "20px"
    })

 
    const addFileRequest = useZust((state) => state.addFileRequest)
  
    const [updated, setUpdated] = useState(null) 

    const onUpdate = (response) => {
        console.log(response)
        if("success" in response && response.success){
            switch (response.request.command){
                case "getIcon":
                    setUpdated({ success: true, url: response.file.icon, style: { filter: "" } })
                break;
                case "getImage":
                    setUpdated({ success: true, url: response.file.image, style: { filter: "" } })
                    break;
                default:
                    setUpdated({ success: false, url: props.netImage.update.error.url, style: props.netImage.update.error.style })
            }
        }else{

        }
    }

    useEffect(() => {
      
       
        const tmp = ("netImage" in props) ? props.netImage !== undefined ?  props.netImage : {} : {};

        const update = "update" in tmp && tmp.update != null && tmp.update.file != null && tmp.update.file.crc != null && tmp.update.file.crc != "" ? tmp.update : null
       
        
        if(update != null && updated == null && update.file.crc != "") {
        
            console.log(update)
            addFileRequest({command: tmp.update.command, page: "imgDiv", id: imgDivId, file: tmp.update.file, callback: onUpdate})
        }
        let info = { 
            opacity: ("opacity" in tmp) ? tmp.opacity : 1,
            scale: ("scale" in tmp) ? tmp.scale : 1, 
            image: ("image" in tmp) && update == null ? tmp.image : update == null ? null : updated ? updated.url : update.waiting.url, 
            filter: ("filter" in tmp) && update == null ? tmp.filter : update == null ? null : updated? updated.style.filter : update.waiting.style.filter, 
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
     
    
    }, [props, pageSize, updated])




   async function updateImgURL (image) {

   }

    return (
        <div about={props.about} className={props.className} ref={divRef} onClick={props.onClick} style={style}>
            {imgURL != null && imgURL != "" ? <img src={imgURL} style={imgStyle} /> : ""}
        </div>
    )
}
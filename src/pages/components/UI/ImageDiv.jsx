import { update } from "idb-keyval";
import React, { useEffect, useState, useRef, useId} from "react";
import { useLayoutEffect } from "react";
import { flushSync } from "react-dom";
import useZust from "../../../hooks/useZust";


export const ImageDiv = (props = {}) => {
    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
    const peerDownload = useZust((state) => state.peerDownload)
    const divRef = useRef()
    const prevCRC = useRef({ value: null })

    const [imgURL, setImgURL] = useState(null);


    const [imgStyle, setImgStyle] = useState({})
    const imgDivId = useId()
    
    const [style, setStyle] = useState({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow:"clip",
        borderRadius: 20
    })

    const [clipStyle, setClipStyle] = useState({
        display: "flex",
        overflow: "clip", 
        borderRadius: "20px",
        alignItems: "center",
        justifyContent: "center", })
 
    const addFileRequest = useZust((state) => state.addFileRequest)
  
    const [updated, setUpdated] = useState(null) 

    const waitingForDownload = useRef({value:null})



    const onUpdate = (response) => {

        
        if("success" in response){

            if (response.success){
                
                waitingForDownload.current.value = null;

                switch (response.request.command){
                    case "getIcon":
                        setUpdated({ success: true, url: response.file.icon, crc: response.file.crc })
                    break;
                    case "getImage":
                        
                        setUpdated({ success: true, url: response.file.value, crc: response.file.crc })
                        break;
                }
            }else if("downloading" in response){
           
                const downloadID = response.id;
                const waitingID = waitingForDownload.current.value == null ? null : waitingForDownload.current.value.id;

                if(waitingID != downloadID){
                    waitingForDownload.current.value = response;

                }
            }else{
                waitingForDownload.current.value = null;
                console.log("couldn't wait for download")
                setUpdated({ error: new Error("file request error") })
            }
        }else{
            waitingForDownload.current.value = null;
            setUpdated({error: new Error("file request error")})
        }
    }
    
    useEffect(()=>{
        if (props.netImage.update != undefined && props.netImage.update != null)
        {
            const update = props.netImage.update

            if (prevCRC.current.value != null && update.file != null && update.file.crc != null && update.file.crc != prevCRC.current.value){
                setUpdated(null)
                prevCRC.current.value = update.file.crc
            } else if (update.file != undefined && update.file.crc != null){
                prevCRC.current.value = update.file.crc
            }else{
                prevCRC.current.value = null
            }
        
        }
    },[props.netImage.update])

    useEffect(()=>{
        if(waitingForDownload.current.value != null)
        {
           
            const waitingID = waitingForDownload.current.value.id

            const index = peerDownload.findIndex(pDl => pDl.id == waitingID)
            if(index != -1){
                const pDl = peerDownload[index]
                if(pDl.complete == 1)
                {
                    const request = pDl.request;

                    addFileRequest(request)
                }
            }
        }
    },[peerDownload])

    useLayoutEffect(() => {
        const isLocal = configFile.value != null
        const isP2P = configFile.value != null && configFile.value.peer2peer != null && configFile.value.peer2peer
       
        let tmp = props.netImage != undefined ?  props.netImage : {};

        const update = "update" in tmp ? tmp.update : null
       
        
        if (updated != null && update != null) {
            if (updated != null && "error" in updated) {

                tmp.image = update.error.url;

                if ("style" in update.error) {
                    const styleNames = Object.getOwnPropertyNames(update.error.style)
                    styleNames.forEach(name => {
                        tmp[name] = update.error.style[name]
                    });
                }

            } else {
                tmp.filter = ""
                tmp.image = updated.url;
            }
        } else if (update != null && update.file != null && updated == null && isLocal){
           
            if ("waiting" in update){

                tmp.image = update.waiting.url;

                if ("style" in update.waiting) {
                    const styleNames = Object.getOwnPropertyNames(update.error.style)
                    styleNames.forEach(name => {
                        tmp[name] = update.error.style[name]
                    });
                }

                const request = { 
                    p2p: isP2P, 
                    command: tmp.update.command, 
                    page: "imgDiv", 
                    id: imgDivId, 
                    file: tmp.update.file, 
                    callback: onUpdate 
                };
        
                addFileRequest(request)
            }

        } else if (!isLocal && update != null){
            tmp.image = update.error.url;
            if ("style" in update.error) {
                const styleNames = Object.getOwnPropertyNames(update.error.style)
                styleNames.forEach(name => {
                    tmp[name] = update.error.style[name]
                });
            }
        }
   

        let info = { 
            fill: ("fill" in tmp) ? tmp.fill : false,
            opacity: ("opacity" in tmp) ? tmp.opacity : 1,
            scale: ("scale" in tmp) ? tmp.scale : 1, 
            image: ("image" in tmp) ? tmp.image : "", 
            filter: ("filter" in tmp) ? tmp.filter : "", 
            backgroundImage: ("backgroundImage" in tmp) ? tmp.backgroundImage : null, 
            backgroundColor: ("backgroundColor" in tmp) ? tmp.backgroundColor : "#000000" 
        };
        
       
        
        const propsWidth = ("width" in props) ? props.width :  null;

        const propsHeight = ("height" in props) ? props.height :  null;
     
        let scale = info.scale;
        const bounds = propsWidth != null && propsHeight != null ? {width:propsWidth, height:propsHeight}: divRef.current ?  divRef.current.getBoundingClientRect() : {width:30, height:30}

        let percent = 1;

        let tmpHeight = 0, tmpWidth = 0;
        let imgPercent = {width:1, height:1}
        if(bounds.width > bounds.height)
        {
            if(bounds.width != 0){
                percent = bounds.height / bounds.width
    
            }
            
            tmpWidth = (scale * 100 * percent) + "%"
           tmpHeight = (scale * 100) + "%"
            imgPercent = {width:scale * percent, height:scale}

        } else {
            
            if (bounds.width != 0){

                percent = bounds.width /bounds.height
            }
            tmpWidth = (scale*100) + "%"
            tmpHeight = (scale*100*percent)+"%"
        
            imgPercent = { width: scale , height: scale * percent }
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
        let tmpImgStyle = { 
            width: "100%", 
            height: "100%", 
            filter: info.filter, 
            opacity:info.opacity
        }
     
        let clip = {
            width: info.fill? "100%" : bounds.width * imgPercent.width,
            height: info.fill ? "100%" : bounds.height * imgPercent.height,
            borderRadius: tmpStyle.borderRadius,
            display: "flex",
            overflow: "clip",
            alignItems: "center",
            justifyContent: "center", 
        }
        setClipStyle(clip)
      
        setImgStyle(tmpImgStyle)

        setImgURL(info.image)
 
        
        setStyle(tmpStyle)


     
    
    }, [props,  updated, configFile.value])




    return (
        <div about={props.about} className={props.className} ref={divRef} onClick={props.onClick} style={style}>
            {imgURL != null && imgURL && <div style={clipStyle}> <img src={imgURL} style={imgStyle} /> </div>}
        </div>
    )
}
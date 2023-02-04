import { get } from "idb-keyval";
import React, { useEffect, useState, useRef, useId, useLayoutEffect } from "react";
import useZust from "../../../hooks/useZust";
import { CanvasDiv } from "./CanvasDiv";


export const ImageDiv = (props = {}) => {

    const configFile = useZust((state) => state.configFile)
    const peerDownload = useZust((state) => state.peerDownload)
    const userPeerID = useZust((state) => state.userPeerID)
    const divRef = useRef()
    const canvasRef = useRef(); 
    const clipRef = useRef()
    const imgRef = useRef()
    const prevHash = useRef({ value: null })

    const [imgURL, setImgURL] = useState(null);

    const currentFileRef = useRef(({ value: props.netImage.update != undefined ? props.netImage.update.file : undefined}))


    const [imgStyle, setImgStyle] = useState({})
    const imgDivId = useId()

    const [style, setStyle] = useState({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "clip",
        borderRadius: 20
    })

    const [clipStyle, setClipStyle] = useState({
        display: "flex",
        overflow: "clip",
        borderRadius: "20px",
        alignItems: "center",
        justifyContent: "center",
    })

    const addFileRequest = useZust((state) => state.addFileRequest)

    const [updated, setUpdated] = useState(null)

    const waiting = useRef({ value: null })
    const loadingStatus = useZust((state) => state.loadingStatus)
    const loadingComplete = useZust((state) => state.loadingComplete)



    const [updateCanvas, setUpdateCanvas] = useState(null)

    useEffect(() => {
   
        if (clipRef.current != null && updateCanvas != null && canvasRef.current != null ) {
      
            updateLocalFileCanvas(updateCanvas.file)
        }
        
    }, [updateCanvas, canvasRef.current, clipRef.current])



    useEffect(() => {
        if (props.netImage.update != undefined && props.netImage.update.file != undefined && props.netImage.update.file != null) {
            const fileHash = props.netImage.update.file.hash
            if (loadingStatus != null && loadingStatus.complete && loadingStatus.hash == fileHash) {
                
                  
                    waiting.current.value = null
                    const request = {
                        p2p: false,
                        command: props.netImage.update.command,
                        page: "imgDiv",
                        id: crypto.randomUUID(),
                        file: props.netImage.update.file,
                        callback: onUpdate
                    };
                 
                    addFileRequest(request)
              
                
            }
        }
    }, [loadingStatus, props.netImage])


   

    useEffect(() => {
        const waitingID = waiting.current.value

        if (waitingID != null) {



            if (waitingID != "error" && waitingID != "loading") {


                const index = peerDownload.findIndex(pDl => pDl.id == waitingID)

                if (index != -1 && props.netImage.update != undefined && props.netImage.update != null) {

                    if (peerDownload[index].status == "Complete") {
                        //  const request = pDl.request;




                        waiting.current.value = null
                        const request = {
                            p2p: false,
                            command: props.netImage.update.command,
                            page: "imgDiv",
                            id: imgDivId,
                            file: props.netImage.update.file,
                            callback: onUpdate
                        };

                        addFileRequest(request)

                    } else {
                        if (peerDownload[index].status == "Not found") {

                            setUpdated({ error: new Error("Not found") })
                        }
                    }
                } else {

                    //  waiting.current.value = null
                }
            }
        }
    }, [props.netImage, peerDownload])

    const prevCRC = useRef({value:null})

    useEffect(() => {
        if (props.netImage != undefined && props.netImage.update != undefined && props.netImage.update != null) {
            const update = props.netImage.update
        
            if (prevCRC.current.value != null && update.file != null && update.file.hash != null && update.file.hash != prevCRC.current.value) {

                setUpdated(null)
                prevCRC.current.value = update.file.hash
            } else if (update.file != undefined && update.file.hash != null) {
                prevCRC.current.value = update.file.hash
            } else {
                prevCRC.current.value = null
             
            }


        }
    }, [props.netImage])





 
    const onUpdate = (response) => {
        console.log(response)

        if ("success" in response) {

            if (response.success) {


                if ("dataUrl" in response) {


                    setUpdated({ success: true, dataUrl: response.dataUrl })

                } else if ("file" in response) {

                    console.log("update canvas")
                    setUpdateCanvas({ file: response.file })

                }

            } else if ("downloading" in response) {

                if (response.downloading) {

                    waiting.current.value = response.id;
                    setUpdated(null)
                } else {
                    waiting.current.value = "error"
                    setUpdated({ error: new Error("No peer network") })
                }

            } else if ("opening" in response) {

                const promise = response.opening

                promise.then((result) => {

                    setUpdated({ success: true, dataUrl: result.dataUrl })
                })

            } else if ("loading" in response) {
                if (response.loading) {

                    waiting.current.value = "loading";
                    setUpdated(null)
                } else {
                    waiting.current.value = "error"
                    setUpdated({ error: new Error("No peer network") })
                }

            }
        } else {
            waiting.current.value = "error"
            setUpdated({ error: new Error("file request error") })
        }
    }

    useLayoutEffect(() => {

        const isLocal = configFile.handle != null


        let tmp = props.netImage != undefined ? props.netImage : {};

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

                if ("dataUrl" in updated) {
                    tmp.image = updated.dataUrl

                }
                tmp.filter = ""
            }
        } else if (update != null && update.file != null && updated == null && isLocal) {

            if ("waiting" in update) {

                tmp.image = update.waiting.url;

                if ("style" in update.waiting) {
                    const styleNames = Object.getOwnPropertyNames(update.error.style)
                    styleNames.forEach(name => {
                        tmp[name] = update.error.style[name]
                    });
                }


            }
            console.log("calling find request")
            const request = {
                p2p: true && loadingComplete,
                command: tmp.update.command,
                page: "imgDiv",
                id: imgDivId,
                file: tmp.update.file,
                callback: onUpdate
            };

            addFileRequest(request)

        } else if (!isLocal && update != null) {
            console.log("no local")
            tmp.image = update.error.url;
            if ("style" in update.error) {
                const styleNames = Object.getOwnPropertyNames(update.error.style)
                styleNames.forEach(name => {
                    tmp[name] = update.error.style[name]
                });
            }
        }


        let info = {

            opacity: ("opacity" in tmp) ? tmp.opacity : 1,
            scale: ("scale" in tmp) ? tmp.scale : 1,
            image: ("image" in tmp) ? tmp.image : "",
            filter: ("filter" in tmp) ? tmp.filter : "",
            backgroundImage: ("backgroundImage" in tmp) ? tmp.backgroundImage : null,
            backgroundColor: ("backgroundColor" in tmp) ? tmp.backgroundColor : "#000000"
        };



        const propsWidth = ("width" in props) ? props.width : null;

        const propsHeight = ("height" in props) ? props.height : null;

        let scale = info.scale;

        const bounds = propsWidth != null && propsHeight != null ? { width: propsWidth, height: propsHeight } : divRef.current ? divRef.current.getBoundingClientRect() : { width: 30, height: 30 }

        let percent = 1;

        let tmpHeight = 0, tmpWidth = 0;
        let imgPercent = { width: 1, height: 1 }
        let clipWidth = "100%"
        let clipHeight = "100%"

        if (typeof bounds.width != "string") {
            if (bounds.width > bounds.height) {
                if (bounds.width != 0) {
                    percent = bounds.height / bounds.width

                }

                tmpWidth = (scale * 100 * percent) + "%"
                tmpHeight = (scale * 100) + "%"
                imgPercent = { width: scale * percent, height: scale }

            } else {

                if (bounds.height != 0) {

                    percent = bounds.width / bounds.height
                }
                tmpWidth = (scale * 100) + "%"
                tmpHeight = (scale * 100 * percent) + "%"

                imgPercent = { width: scale, height: scale * percent }
            }
            clipWidth = bounds.width * imgPercent.width
            clipHeight = bounds.height * imgPercent.height
        } else {

            if (updated != null && "file" in updated) {
                const fileWidth = updated.file.width != undefined ? updated.file.width : null
                const fileHeight = updated.file.height != undefined ? updated.file.width : null

                clipWidth = (scale * 100) + "%"
                clipHeight = (scale * 100) + "%"
            } else {
                clipWidth = (scale * 100) + "%"
                clipHeight = (scale * 100) + "%"
            }






        }

        let tmpStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "20px",
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
            opacity: info.opacity
        }

        let clip = {
            width: clipWidth,
            height: clipHeight,
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




    }, [props, updated, userPeerID])

    

    return (
        <div about={props.about} className={props.className} ref={divRef} onClick={props.onClick} style={style}>
            <div id={"ClipDiv"} ref={clipRef} style={clipStyle}>
                {updateCanvas != null ? <CanvasDiv width={clipStyle.width} height={clipStyle.height} file={updateCanvas.file}/> : imgURL != null && imgURL != "" && <img ref={imgRef} src={imgURL} style={imgStyle} /> }
            </div>
        </div>
    )
}//{updated != null && "success" in updated ? <canvas ref={canvasRef} /> 
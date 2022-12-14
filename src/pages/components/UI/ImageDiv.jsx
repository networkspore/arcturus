import { get } from "idb-keyval";
import React, { useEffect, useState, useRef, useId, useLayoutEffect } from "react";
import useZust from "../../../hooks/useZust";


export const ImageDiv = (props = {}) => {

    const configFile = useZust((state) => state.configFile)
    const peerDownload = useZust((state) => state.peerDownload)
    const userPeerID = useZust((state) => state.userPeerID)
    const divRef = useRef()
    const canvasRef = useRef(); 
    const clipRef = useRef()

    const prevHash = useRef({ value: null })

    const [imgURL, setImgURL] = useState(null);


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





    useEffect(() => {
        if (userPeerID != "") {

            if (waiting.current.value == "error") {
                waiting.current.value = null
                setUpdated(null)
            }
        }
    }, [userPeerID, configFile])

    useEffect(() => {
        if (waiting.current.value != undefined && waiting.current.value == "loading" && props.netImage.update != undefined && props.netImage.update.file != undefined) {
            const fileHash = props.netImage.update.file.hash
            if (loadingStatus.complete && loadingStatus.hash == fileHash) {
                waiting.current.value = null
                setUpdated(null)
            }
        }
    }, [loadingStatus, props.netImage])


    const onUpdate = (response) => {


        if ("success" in response) {

            if (response.success) {

                // waiting.current.value = null;

                if("dataUrl" in response){
                
                    setUpdated({ success: true, dataUrl: response.dataUrl })
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

                    setUpdated({ success: true, url: result.dataUrl, hash: result.hash })
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
                tmp.filter = props.netImage.filter
                if("dataUrl" in updated){
                    tmp.image = updated.dataUrl
                }
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

                const request = {
                    p2p: true && loadingComplete,
                    command: tmp.update.command,
                    page: "imgDiv",
                    id: imgDivId,
                    file: tmp.update.file,
                    callback: onUpdate
                };

                addFileRequest(request)
            }

        } else if (!isLocal && update != null) {
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



        const propsWidth = ("width" in props) ? props.width : null;

        const propsHeight = ("height" in props) ? props.height : null;

        let scale = info.scale;
        const bounds = propsWidth != null && propsHeight != null ? { width: propsWidth, height: propsHeight } : divRef.current ? divRef.current.getBoundingClientRect() : { width: 30, height: 30 }

        let percent = 1;

        let tmpHeight = 0, tmpWidth = 0;
        let imgPercent = { width: 1, height: 1 }
        if (bounds.width > bounds.height) {
            if (bounds.width != 0) {
                percent = bounds.height / bounds.width

            }

            tmpWidth = (scale * 100 * percent) + "%"
            tmpHeight = (scale * 100) + "%"
            imgPercent = { width: scale * percent, height: scale }

        } else {

            if (bounds.width != 0) {

                percent = bounds.width / bounds.height
            }
            tmpWidth = (scale * 100) + "%"
            tmpHeight = (scale * 100 * percent) + "%"

            imgPercent = { width: scale, height: scale * percent }
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
            width: info.fill ? "100%" : bounds.width * imgPercent.width,
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




    }, [props, updated, configFile.handle, loadingComplete])



    async function updateLocalFileCanvas(localFile, netImage) {

        const svgMime = "image/svg+xml"
        const fileName = localFile.type.slice(0, svgMime.length)

        if (fileName != svgMime){
       
            if (divRef.current && canvasRef.current && clipRef.current)
            {
                const file = await localFile.handle.getFile()
                const bmp = await createImageBitmap(file)

                const fullSize = "fullSize" in netImage ? netImage.fullSize : false
                //const bounds = divRef.current.getBoundingClientRect()
                const bounds2 = fullSize ? {width:bmp.width, height:bmp.height} : clipRef.current.getBoundingClientRect()
               

                canvasRef.current.width = bounds2.width
                canvasRef.current.height = bounds2.height

             

                const ctx = canvasRef.current.getContext("2d");
            
                ctx.drawImage(bmp, 0, 0, bounds2.width, bounds2.height )
                
            }
        }else{
            console.log("svg file some how")
        }
    
        /*
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);*/



    }



    return (
        <div about={props.about} className={props.className} ref={divRef} onClick={props.onClick} style={style}>
            <div ref={clipRef} style={clipStyle}>
            { imgURL != null && <img src={imgURL} style={imgStyle} /> }
            </div>
        </div>
    )
}//{updated != null && "success" in updated ? <canvas ref={canvasRef} /> 
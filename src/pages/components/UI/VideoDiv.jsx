import React, { useEffect, useState, useId, useRef } from "react"
import styles from "../../css/home.module.css"
import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import MP4Box from "mp4box";
import { MB } from "../../../constants/constants";

export const VideoDiv = (props = {}) =>{
    const vidRef = useRef()
    const segRef = useRef({value:[]})
    const [ready, setReady] = useState(null)
    const [showMedia, setShowMedia] = useState(false)

    const vidID = useId()
    
    const addFileRequest = useZust((state) => state.addFileRequest)


    async function onUpdate(update){
       
        if("success" in update && update.success)
        {
            const localFile = update.localFile
            initLocalMp4(localFile)
        }
    }

    useEffect(()=>{
        if (ready && vidRef.current.ms.readyState == "open")
        {
            appendNextSegment()

        }
    }, [ready, segRef.current])

    const segIndex = useRef({ value: 0 })

    function appendNextSegment(){
        if (Array.isArray(segRef.current.value) && segRef.current.value.length > 0 && segIndex.current.value < segRef.current.value.length) {
            const index = segIndex.current.value
            const seg = segRef.current.value[index]
            const id = seg.id
            // vidRef.current.ms.sourceBuffers[index]
            setReady(false)

            const l = vidRef.current.ms.sourceBuffers.length

            for (let i = 0; i < l; i++) {
                const sb = vidRef.current.ms.sourceBuffers[i]
                if (sb.id == id) {
                  
                    sb.appendBuffer(seg.buffer)

                }
            }
            segIndex.current.value++ 
        }else{
            if (vidRef.current.ms.readyState == "open") {
                console.log("clearing values")
                URL.revokeObjectURL(vidRef.current.src)
                vidRef.current.ms.endOfStream()
                segRef.current.value = []
            }
        }
    }

    async function initLocalMp4(localFile) {
        const file = await localFile.handle.getFile()
        const chunkSize = MB * 50

        const box = MP4Box.createFile()

            //  arrayBuffer.fileStart = 0
        let info = null;
        

       
        const processVideo = () => {

            const mediaSource = new MediaSource();
            vidRef.current.ms = mediaSource
            vidRef.current.src = URL.createObjectURL(mediaSource);
            const duration = info.isFragmented ? info.fragment_duration / info.timescale : info.duration / info.timescale

           
            mediaSource.addEventListener("sourceopen", (e) => {
                //  


                for (var i = 0; i < info.tracks.length; i++) {
                    const track = info.tracks[i]

                    const type = `video/mp4; codecs="${track.codec}"`;

                    const sourceBuffer = mediaSource.addSourceBuffer(type);
                    sourceBuffer.id = track.id;
                    box.setSegmentOptions(track.id);


                }

                var initSegs = box.initializeSegmentation();

                initSegs.forEach((seg, i) => {
                    vidRef.current.ms.sourceBuffers[i].onupdate = (e) => {
                        setReady(true)
                        console.log("ready")
                    }
                    segRef.current.value.push({ id: seg.id, buffer: seg.buffer, last: false })
                });
                if (ready == null) {
                    setReady(true)
                }

                box.onSegment = function (id, user, buffer, sampleNumber, last) {
                    //    console.log(id, user, buffer, sampleNumber, last)
                    //   const index = vidRef.current.ms.sourceBuffers.findIndex(sb => sb.id == id)
                    //segments.push({id:id, user:user, buffer:buffer, sampleNumber:sampleNumber, last:last})
                    mediaSource.duration = duration

                    segRef.current.value.push({ id: id, buffer: buffer, last: last })

                }


                box.start()
            });

            mediaSource.addEventListener("sourceclose", (e) => {
                console.log("media source closed")
            });
 

        }

        let chunkIndex = 0
        const size = file.size
        const chunks = Math.ceil(size / chunkSize)

        if(file.size < chunkSize){
            const aB =  await file.arrayBuffer()
            
            aB.fileStart = 0
            box.onReady = (i) => {
                info = i
                processVideo()
            }
            box.appendBuffer(aB)
            box.flush()
        }else{
            

            // const spark = chunks > 1 ? new SparkMD5.ArrayBuffer() : null
            box.onReady = (i) => {
                info = i
            }
            async function getHashRecursive() {
                const chunkEnd = (chunkIndex + 1) * chunkSize
                const last = chunkEnd >= size
                const fileStart = chunkIndex * chunkSize
                const blob = await file.slice(fileStart, chunkEnd ? size : chunkEnd)

                const arrayBuffer = await blob.arrayBuffer()
                arrayBuffer.fileStart = fileStart
                box.appendBuffer(arrayBuffer, last)
                chunkIndex++
                if(!last)
                {
                    getHashRecursive()

                }else{
                    box.flush()
                    processVideo()
                }

            }
            getHashRecursive()
        }

    }
      

   

   

    //`video/webm; codecs="vp9,opus"`


    useEffect(() => {
        const file = props.file
        const request = {
            p2p: false,
            command: "getVideo",
            page: "vidDiv",
            id: vidID,
            file: file,
            callback: onUpdate
        };

        addFileRequest(request)

    }, [props.file])



    const onLoadedMetadata =(e) =>{
       if(props.onLoadedMetaData) {
            props.onLoadedMetaData(e)
        }
        setShowMedia(true)
    }

 
 
    const toggleFullSize = (e) => {
        if (vidRef.current.mozRequestFullScreen) {
            vidRef.current.mozRequestFullScreen();
        } else if (vidRef.current.webkitRequestFullScreen) {
            vidRef.current.webkitRequestFullScreen();
        }  

    }
    
    return (
        <div style={{
            width: "100%",
            height: "100%", 
          
}}>
            <video 
                
                style={{
                    width:  props.width, 
                    height:  props.height, 
                }}
                controls
                ref={vidRef} 
                onLoadedMetadata={onLoadedMetadata}
                onMouseMove={props.onMouseMove != undefined && props.onMouseMove} >
                
        </video> 
            {showMedia == false &&
                <div style={{
                    position: "fixed",

                    backgroundColor: "rgba(0,3,4,.95)",
                    left: "50%",
                    top: "50%",
                    width: props.width,
                    height: props.height,
                    transform: "translate(-50%,-50%)",
                }}>
                    <ImageDiv height={props.height} width={props.width} netImage={{ image: "/Images/spinning.gif" }} />
                </div>
            }
            {props.showBar && <div onMouseEnter={(e) => {
               props.cancelTimeout()
            }} style={{
                position: "absolute",
                top: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                paddingTop: 0,
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",
                zIndex: 999,
                height:40,
            }}>

                <div className={styles.glow} onClick={(e) => {
                    props.close()
                }} style={{
                    opacity: .7,
                    cursor: "pointer",
                    paddingLeft: "10px",
                    paddingTop: 5,
                    textAlign: "center",
                    zIndex:999
                }}><ImageDiv width={20} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/close-outline.svg" }} />
                </div>
                <div 
                    className={styles.glow} 
                    onClick={toggleFullSize} 
                    style={{
                        opacity: .7,
                        cursor: "pointer",
                        paddingLeft: "10px",
                        paddingTop: 5,
                        textAlign: "center",
                        zIndex: 999
                    }}>
                        <ImageDiv width={18} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/scan-outline.svg" }} />
                </div>
                <div style={{ flex: 1 }}> </div>
                <div style={{zIndex:1,width:props.width ,position:"absolute", left:0, top:10, display: "flex", flex: 1, alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", overflow: "slice" }}>
                    {props.file.title == undefined ? props.file.name : props.file.userFileName}</div>
               
            </div>}
        </div>
    )
}
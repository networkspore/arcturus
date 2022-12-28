import React, { useEffect, useState, useId, useRef } from "react"

import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import MP4Box from "mp4box";

export const VideoDiv = (props = {}) =>{
    const vidRef = useRef()
    const segRef = useRef({value:[]})
    const [ready, setReady] = useState(null)
    
    const vidID = useId()
    
    const addFileRequest = useZust((state) => state.addFileRequest)

    var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    async function onUpdate(update){
       
        if("success" in update && update.success)
        {
            const localFile = update.localFile
            initLocalMp4(localFile)
        }
    }

    useEffect(()=>{
        if(ready)
        {
            
            appendNextSegment()
        }
    }, [ready, segRef.current])

    function appendNextSegment(){
        if (segRef.current.value.length > 0) {
            const seg = segRef.current.value.splice(0, 1)[0]
            console.log(seg)
            const id = seg.id
            // vidRef.current.ms.sourceBuffers[index]
            setReady(false)

            const l = vidRef.current.ms.sourceBuffers.length

            for (let i = 0; i < l; i++) {
                const sb = vidRef.current.ms.sourceBuffers[i]
                if (sb.id == id) {
                    console.log("apending")
                    console.log(seg)
                    sb.appendBuffer(seg.buffer)

                }
            }

            
        }else{
           
            vidRef.current.ms.endOfStream()
        }
    }

    async function initLocalMp4(localFile) {
        const file = await localFile.handle.getFile()
        const aB = await file.arrayBuffer()

        const box = MP4Box.createFile()

            //  arrayBuffer.fileStart = 0
         

        box.onReady = (info) => {
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
                    box.setSegmentOptions(track.id, aB);

                   
                }
                 
               
                

                var initSegs = box.initializeSegmentation();
        
                initSegs.forEach((seg, i ) => {
                    vidRef.current.ms.sourceBuffers[i].onupdate = (e) =>{
                        setReady(true)
                        console.log("ready")
                    }
                    segRef.current.value.push({id:seg.id, buffer:seg.buffer, last:false})
                });
                if(ready == null)
                {
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

            mediaSource.addEventListener("sourceclose", (e) =>{
                console.log("media source closed")
            });
          //  var mime = 'video/mp4; codecs=\"';

        

          
            
            }
        
        
        aB.fileStart = 0
        box.appendBuffer(aB)
        box.flush()
        



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



  


    function onLoadedMetaData(e){
        console.log("loaded metadata")
        console.log(e)
    } 


    
    return (
        <div width={"100%"} height={"100%"} > 
            
            <video ref={vidRef} controls
                onLoadedMetadata={onLoadedMetaData} 
                onMouseMove={props.onMouseMove != undefined && props.onMouseMove} 
                width={"100%"} height={"100%"}>
            </video> 
        </div>
    )
}
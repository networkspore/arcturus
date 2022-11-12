
import React, { useState, useEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"
import produce from "immer"

export const FileHandler = ( props = {}) =>{
    const [active, setActive] = useState()

    const imagesFiles = useZust((state) => state.imagesFiles)
    const objectFiles = useZust((state) => state.objectsFiles)
    const terrainFiles = useZust((state) => state.terrainFiles)
    const mediaFiles = useZust((state) => state.mediaFiles)

    const fileRequest = useZust((state) => state.fileRequest)
    const takeRequest = (request) => useZust.setState(produce((state) =>{
        if(state.fileRequest.length > 0)
            if (state.fileRequest.length == 1 )
            {
                request(state.pop(state.fileRequest));
            }else {
                request(state.fileRequest.splice(0, 1))
            }
    }))


    useEffect(()=>{
        if(fileRequest != null)
        {
            if(fileRequest.length > 0)
            {
                
                takeRequest((request)=>{
                    checkLocal(request, (localFile) => {
                        if ("error" in localFile) {
                            request.resolve({error: localFile.error})
                        } else {
                            if(localFile.success){
                                request.resolve({success:true, file:localFile.file})
                            }else{
                                request.resolve({success:false})
                                //checkPeers(request, (foundPeer)=>{

                                //})
                            }
                        }
                    })
                })
                
            }
        }
    },[fileRequest, imagesFiles, objectFiles, terrainFiles, mediaFiles])

    const checkLocal = (request, callback) => {
        switch(request.mimeType)
        {
            case "image":
                const i = imagesFiles.findIndex( iFile => iFile.crc == request.crc)
                if (i > 0)
                {
                    callback( {success:true, file: imagesFiles[i] } )
                }else{
                    callback( {success:false})
                }
                break;
            default:
                callback({error: new Error("File type not supported.")})
                break;
        }
    }

    const checkPeers = (request, callback) =>{
        console.log("checking peers")
    }


    return (
        <>
            {
                fileRequest != null && fileRequest.length > 0 &&
                <ImageDiv onClick={(e) => {
                    navigate("/home/peernetwork/transfers")
                }} width={25} height={30} netImage={{ image: "/Images/icons/file-tray-stacked.svg", scale: .7, filter: "invert(100%)" }} />
            }
        </>
    )
}
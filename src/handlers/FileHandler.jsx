
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
    const updateFileRequest = useZust((state) => state.updateFileRequest)
    const downloads = useZust((state) => state.downloads)

    const addDownload = useZust((state) => state.addDownload)

    const [processing, setProcessing] = useState([])

    const addProcessing = (request) => setProcessing(produce((state)=>{
        state.push(request);
    }))

    const removeProcessing = (request) => setProcessing(produce((state)=>{
        const index = state.findIndex(item => item.page == request.page && item.id == request.id)

        if(index > -1)
        {
            if(state.length == 1)
            {
                state.pop()
            }else{
                state.splice(index,1)
            }
        }
    }))

    const removeFileRequest = useZust((state)=> state.removeFileRequest)

    useEffect(()=>{
        if(fileRequest != null && fileRequest.length > 0){
            
            fileRequest.forEach((request, i) => {
                const index = processing.findIndex(item => item.page == request.page && item.id == request.id)

                if( index == -1 ){
                    addProcessing(request)
                    checkLocal(request).then((localResult)=>{
                        if("error" in localResult)
                        {
                            request.callback({ request: request, error: localResult.error})
                            removeProcessing(request)
                            removeFileRequest(request)
                        }else{
                            console.log(localResult)
                            if(localResult.success)
                            {
                                request.callback({ request: request, file: localResult.file })
                                removeProcessing(request)
                                removeFileRequest(request)
                            }else{
                                request.callback({request:request, error: new Error( "Not implemented")})
                                removeProcessing(request)
                                removeFileRequest(request)
                            }
                        }
                    })
                }else{
                    
                }
            });

        }
    },[fileRequest])

    useEffect(()=>{
    
    },[processing])


    async function checkLocal(request) {
       
        switch(request.file.mimeType)
        {
            case "image":
                const i = imagesFiles.findIndex( iFile => iFile.crc == request.file.crc)
           
                if (i > -1)
                {
                    return {success:true, file: imagesFiles[i] } 
                }else{
                    return {success:false}
                }
                break;
            default:
                return{error: new Error("File type not supported.")}
                break;
        }
    }

    const checkPeers = (request, callback) =>{
        console.log("checking peers")
    }


    return (
        <>
            {
                processing != null && processing.length > 0 &&
                <ImageDiv onClick={(e) => {
                    navigate("/home/peernetwork/transfers")
                }} width={25} height={30} netImage={{ image: "/Images/icons/file-tray-stacked.svg", scale: .7, filter: "invert(100%)" }} />
            }
        </>
    )
}
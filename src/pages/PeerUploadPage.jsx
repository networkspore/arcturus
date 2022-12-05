import { useState, useEffect, useLayoutEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from './css/home.module.css';

export const PeerUploadPage = (props = {}) =>{

    const peerUpload= useZust((state) => state.peerUpload)
    
    const [uploadList, setUploadList] = useState([])
    const pageSize = useZust((state) => state.pageSize)
    
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    useLayoutEffect(()=>{
        if(peerUpload.length > 0)
        {
            const upList = []
            peerUpload.forEach(uploadItem => {
                const file = uploadItem.request.file
                console.log(file)
                let iIcon = "/Images/icons/images-outline.svg"
               
                const mimeType = file.mimeType;
                const iCrc = file.crc
                const iName = file.name
                const iSize = formatBytes(file.size)
                const complete = uploadItem.complete
                const completePercent = (complete * 100) + "%"
                const uncompletePercent = complete == 0 ? 0 : (complete * 100) +"%"
                const status = uploadItem.status
                upList.push(
                      <div key={iCrc} style={{ display:"flex", alignItems:"center", justifyContent:"start", paddingTop:20 }}>
                        <div style={{ flex: .05, display: "flex", justifyContent: "center", }}>
                                <ImageDiv style={{ borderRadius: 5, overflow: "hidden" }} width={20} height={20} netImage={{ image: iIcon, filter:"invert(100%)" }} />
                            </div>
                            <div style={{ flex: .39, color: "white", display:"flex", justifyContent:"center", }}>{iName}</div>
                            
                            <div style={{
                                display:"flex",
                                flex: .4,
                                alignItems:"center",
                                justifyContent:"center",
                                color: "#888888",
                                backgroundImage: `linear-gradient(to right, #cccccc90 ${completePercent}, #00000050 ${uncompletePercent})`,
                                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                            }}>
                            {status == "Downloading" ? completePercent : <div style={{fontFamily:"webpapyrus", fontSize:12, paddingTop:3, paddingBottom:3}}> {status}</div>}
                            </div>
                            
                        <div style={{ flex: 0.1, color: "#888888", display: "flex", justifyContent: "center", }}>{mimeType}</div>
                        <div style={{ flex: 0.1, color: "#888888", display: "flex", justifyContent: "center", }}>{iSize}</div>
                        <div style={{ flex: 0.1, color: "#888888", display: "flex", justifyContent: "center", }}>{iCrc}</div>
                            
                           
                            
                        </div >
                )
            });
            setUploadList(upList)
        }else{
            setUploadList([])
        }
    },[peerUpload])

    return (
        <div style={{display:"flex", width:"100%", flex:1, flexDirection:"column",}}>
            <div style={{ display: "flex", }}>

                <div style={{ flex: 0.05, color: "#777777", }}>&nbsp;</div>
                <div style={{ flex: .37, color: "white", display: "flex", justifyContent: "center", }}>Name</div>
                <div style={{ flex: .37, color: "white", display:"flex", justifyContent:"center" }}>Status</div>
                <div style={{ flex: 0.09, color: "#777777", display: "flex", justifyContent: "center", }}>Type</div>
                <div style={{ flex: 0.1, color: "#777777", display: "flex", justifyContent: "center", }}>Size</div>
                <div style={{ flex: 0.1, color: "#777777", display: "flex", justifyContent: "center", }} >CRC </div>

                
                
              

            </div>
            <div style={{
                marginBottom: '2px',
                marginLeft: "10px",
                height: "3px",
                width: "100%",
                backgroundImage: "linear-gradient(to right, #000304DD 0%, #77777730 20%,#77777760 50%,#77777730 80%, #000304DD 100%)",
               
            }}>&nbsp;</div>
            <div style={{
                height: pageSize.height - 180,
                overflowY: "scroll",
            }}>
            {peerUpload.length == 0 ? <div style={{ display: "flex", flex: 1, color: "#777777", padding: 10, opacity: .8, justifyContent: "center", }}>
                    No Uploads
                </div> : uploadList
            }
            </div>
        </div>
    )
}
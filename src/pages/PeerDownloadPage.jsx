import { useState, useEffect, useLayoutEffect } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from './css/home.module.css';

export const PeerDownloadPage = (props = {}) =>{

    const peerDownload = useZust((state) => state.peerDownload)
    
    const [downloadList, setDownloadList] = useState([])
    
    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    useLayoutEffect(()=>{
        if(peerDownload.length > 0)
        {
            const dlList = []
            peerDownload.forEach(downloadItem => {
                const file = downloadItem.request.file
                console.log(file)
                let iIcon = "/Images/icons/images-outline.svg"
               
                const mimeType = file.mimeType;
                const iCrc = file.crc
                const iName = file.name
                const iSize = formatBytes(file.size)
                const complete = downloadItem.complete
                const completePercent = (complete * 100) + "%"
                const uncompletePercent = complete == 0 ? 0 : (complete * 100) +"%"
                dlList.push(
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"start" }}>
                        <div style={{ flex: .1, display: "flex", justifyContent: "center", }}>
                                <ImageDiv style={{ borderRadius: 5, overflow: "hidden" }} width={20} height={20} netImage={{ image: iIcon, filter:"invert(100%)" }} />
                            </div>
                            <div style={{ flex: .5, color: "white", display:"flex", justifyContent:"center", }}>{iName}</div>
                            <div style={{
                                display:"flex",
                                flex: .5,
                                alignItems:"center",
                                justifyContent:"center",
                                color: "#888888",
                                backgroundImage: `linear-gradient(to right, #cccccc90 ${completePercent}, #00000050 ${uncompletePercent})`,
                                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                            }}>
                                {completePercent}
                            </div>
                        <div style={{ flex: 0.2, color: "#888888", display: "flex", justifyContent: "center", }}>{mimeType}</div>
                        <div style={{ flex: 0.1, color: "#888888", display: "flex", justifyContent: "center", }}>{iSize}</div>
                        <div style={{ flex: 0.2, color: "#888888", display: "flex", justifyContent: "center", }}>{iCrc}</div>
                            
                           
                            
                        </div >
                )
            });
            setDownloadList(dlList)
        }else{
            setDownloadList([])
        }
    },[peerDownload])

    return (
        <div style={{display:"flex", width:"100%", flex:1, flexDirection:"column",}}>
            <div style={{ display: "flex", }}>

                <div style={{ flex: 0.1, color: "#777777", }}>&nbsp;</div>
                <div style={{ flex: .5, color: "white", display: "flex", justifyContent: "center", }}>Name</div>
                <div style={{ flex: .5, color: "white", display:"flex", justifyContent:"center" }}>Status</div>
                <div style={{ flex: 0.2, color: "#777777", display: "flex", justifyContent: "center", }}>Type</div>
                <div style={{ flex: 0.1, color: "#777777", display: "flex", justifyContent: "center", }}>Size</div>
                <div style={{ flex: 0.2, color: "#777777", display: "flex", justifyContent: "center", }} >CRC </div>

                
                
              

            </div>
            <div style={{
                marginBottom: '2px',
                marginLeft: "10px",
                height: "1px",
                width: "100%",
                backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
            }}>&nbsp;</div>
            {peerDownload.length == 0 ? <div style={{ display: "flex", flex: 1, color: "#777777", padding: 10, opacity: .8, justifyContent: "center", }}>
                    No Downloads
                </div> : downloadList
            }
        </div>
    )
}
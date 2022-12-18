import React, { useEffect } from "react";
import styles from './css/home.module.css';
import FileList from "./components/UI/FileList";
import { ImageDiv } from "./components/UI/ImageDiv";
import useZust from "../hooks/useZust";

export const PeerNetworkMenu = (props ={}) =>{
    const pageSize = useZust((state) => state.pageSize)
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
            <FileList className={styles.bubble__item} 
                fileView={{ 
                    type: "icons", 
                    direction: "row", 
                    iconSize: { width: 100, height: 100, scale:.5 } }} 
                    tableStyle={{ 
                        maxHeight: pageSize.height - 400 
                    }} 
                    files={
                        [ 
                            {
                                to: "/home/peernetwork/library",
                                name: "Library",
                                type: "folder",
                                hash: "",
                                lastModified: null,
                                size: null,
                                netImage: { scale: .5, opacity: .7, backgroundColor: "", image: "/Images/icons/library-outline.svg", filter: "invert(100%)" } 
                            },
                            
                        ]}    
                />
        </div>
    )
}
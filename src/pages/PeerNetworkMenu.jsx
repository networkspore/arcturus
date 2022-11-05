import { useEffect } from "react";

import FileList from "./components/UI/FileList";

export const PeerNetworkMenu = (props ={}) =>{
    return (
        <FileList fileView={{ type: "icons", direction: "column", iconSize:{width:100, height:100} }} files={[
            { to: "/home/peernetwork/library", name: "Library", type: "folder", crc: "", lastModified: null, size: null, netImage: { backgroundColor: "", image: "/Images/icons/library-outline.svg", filter:"invert(100%)" } }, 
            { to: "/home/peernetwork/market", name: "Market", type: "folder", crc: "", lastModified: null, size: null, netImage: { backgroundColor: "", image: "/Images/icons/storefront-outline.svg", filter: "invert(100%)" } }, 
            { to: "/home/peernetwork/forum", name: "Forum", type: "folder", crc: "", lastModified: null, size: null, netImage: { backgroundColor: "", image: "/Images/icons/newspaper-outline.svg", filter: "invert(100%)" } }, 
            
        ]}/>
    )
}
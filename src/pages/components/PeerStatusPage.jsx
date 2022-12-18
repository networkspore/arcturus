import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PeerDownloadPage } from "../PeerDownloadPage";
import { PeerUploadPage } from "../PeerUploadPage";
import styles from '../css/home.module.css';
import FileList from "./UI/FileList";
import useZust from "../../hooks/useZust";

export const PeerStatusPage = (props = {}) =>{
    
    const pageSize = useZust((state) => state.pageSize)
    const [showIndex, setShowIndex] = useState(0)
    const [subDirectory, setSubDirectory] = useState("")
    useEffect(() => {

        const location = props.location

        const currentLocation = location.pathname;
        const directory = "/home/peernetwork/status";

        const thirdSlash = currentLocation.indexOf("/", directory.length)
        const fourthSlash = currentLocation.indexOf("/", thirdSlash + 1)

        const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash, fourthSlash == -1 ? currentLocation.length : fourthSlash) : "";
        setSubDirectory(l)


        switch (l) {
            case "/downloads":
                setShowIndex(1)
                break;
            case "/uploads":
                setShowIndex(3)
                break;
            default:
                setShowIndex(0)
                break;
        }



    }, [props.location])

    return (
        <>
        {showIndex == 0 &&
        <FileList className={styles.bubble__item}
            fileView={{
                type: "icons",
                direction: "row",
                iconSize: { width: 100, height: 100, scale: .5 }
            }}
            tableStyle={{
                maxHeight: pageSize.height - 400
            }}
            files={
                [

                    {
                        to: "/home/peernetwork/status",
                        name: "Downloads",
                        type: "folder",
                        hash: "",
                        lastModified: null,
                        size: null,
                        netImage: { scale: .5, opacity: .7, backgroundColor: "", image: "/Images/icons/cloud-download-outline.svg", filter: "invert(100%)" }
                    },
                    {
                        to: "/home/peernetwork/status",
                        name: "Uploads",
                        type: "folder",
                        hash: "",
                        lastModified: null,
                        size: null,
                        netImage: { scale: .5, opacity: .7, backgroundColor: "", image: "/Images/icons/cloud-upload-outline.svg", filter: "invert(100%)" }
                    },
                ]}
                />}
                {showIndex == 1 &&
                    <PeerDownloadPage />
                }
                {showIndex == 2 &&
                    <PeerUploadPage />
                }
        </>
    )
}
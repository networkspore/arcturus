
import React, { useState, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import useZust from "../hooks/useZust";

import styles from './css/home.module.css';




const EditorPage = () => {

    const setPage = useZust((state) => state.setPage)
    const setShowMainOverlay = useZust((state) => state.setShowMainOverlay);
    //  const setFillMainOverlay = useZust((state) => state.setFillMainOverlay);

    const setShowLeftOverlay = useZust((state) => state.setShowLeftOverlay);
    const setMainOverlaySize = useZust((state) => state.setMainOverlaySize)
    const setMainOverlayPos = useZust((state) => state.setMainOverlayPos);

    const pageSize = useZust((state) => state.pageSize);
    const mainOverlaySize = useZust((state) => state.mainOverlaySize);
    const showTopOverlay = useZust((state) => state.showTopOverlay);
    const topOverlaySize = useZust((state) => state.topOverlaySize);
    const leftOverlaySize = useZust((state) => state.leftOverlaySize);
    const showLeftOverlay = useZust((state) => state.showLeftOverlay);
  
    const navigate = useNavigate();

    let setOnce = true;

    useEffect(() => {
        if (setOnce) {
            setPage(10);
            setShowLeftOverlay(false);
            
            setShowMainOverlay(true);
            //   setFillMainOverlay(false);
        }
        setMainOverlaySize({ width: pageSize.width-(showLeftOverlay ? leftOverlaySize.width : 0 ) -20, height: 80  });
        setMainOverlayPos({ top: pageSize.height - 80, left: (showLeftOverlay ? leftOverlaySize.width : 10) })
       
        return () => {
            setShowMainOverlay(false);
            setShowLeftOverlay(true);
        }
    }, [pageSize, showLeftOverlay]);

    return (
        <div style={{ backgroundColor: "rgba(20,20,20,.5)", width: mainOverlaySize.width, height: mainOverlaySize.height }}>
            <div onClick={(e) => {
                navigate("/home");
            }} style={{  position: "fixed", bottom: mainOverlaySize.height - 10, left: mainOverlaySize.width - 5 }}><img style={{ cursor: "pointer"}} width={14} height={14} src="Images/closeX.png" /></div>
        </div>
    );


};



export default EditorPage;
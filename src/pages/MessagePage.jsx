import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';

import { NavLink, useNavigate } from 'react-router-dom';
import styles from './css/home.module.css';
import produce from 'immer';
import SelectBox from './components/UI/SelectBox';
import { AddImagePage } from './AddImagePage';





export const MediaAssetsPage = (props = {}) => {
    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)

    const [showIndex, setShowIndex] = useState(); 


    function onAddImage(e) {
       setShowIndex(2)
    }

    function onAdd3DObject(e) {
       setShowIndex(0)
    }

    function newMenuOnClick(e) {
        if(showIndex == 1)
        {
            setShowIndex(0)
        }else{
            setShowIndex(1)
        }
    }

    function addImageObject(imgObj) {

    }
    

    return (
        
       <>
<div id='MediaAssetsPage' style={{ position: "fixed", backgroundColor: "rgba(0,3,4,.95)", width: pageSize.width - 285 - 150, height: pageSize.height, left: 285 + 150, top: "0px" }}>
    <div style={{
        padding: "10px",
        textAlign: "center",
        width: "100%",
        paddingTop: "20px",
        fontFamily: "WebRockwell",
        fontSize: "18px",
        fontWeight: "bolder",
        color: "#cdd4da",
        textShadow: "2px 2px 2px #101314",
        backgroundImage: "linear-gradient(black, #030507AA)"

    }}>
                    Message
    </div>
    <div style={{ paddingLeft: "20px", display: "flex", justifyItems:"right" }}>

        
        <div className={styles.toolbar} style={{ display: "flex", }}>
            <div style={{}}>
                <img src='Images/icons/folder-open-outline.svg' width={20} height={20} style={{ filter: "invert(100%)" }} />
            </div>
            <div style={{
                paddingLeft: "10px",
                fontFamily: "WebRockwell",
                fontSize: "15px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
            }}>
                Find
            </div>
        </div>
    </div>
</div>
{showIndex ==1 &&
    <div id='searchMenu' style={{ position: "fixed", top: "102px", right:"30px", width: "200px", backgroundColor:"rgba(40,40,40,.7)", }}>
        
    </div>
}

{showIndex == 2 &&
    <AddImagePage 
        cancel={()=>{setShowIndex(0)}}
        result={(imgObj)=>{addImageObject(imgObj)}}
    />
}
</>
    )
        }
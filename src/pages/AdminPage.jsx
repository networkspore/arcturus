import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from 'react-router-dom';
import useZust from "../hooks/useZust";
import CampUsers from "./components/UI/campUsers";

import produce from 'immer';


import styles from './css/campaign.module.css';
import { EditCharacters } from "./components/Admin/EditCharacters";
import { EditMonsters } from "./components/Admin/EditMonsters";
import { EditPlaceables } from "./components/Admin/EditPlaceables";
import EditTextures from "./components/Admin/EditTextures";




const AdminPage = () => {

    const setPage = useZust((state) => state.setPage)

  

    const pageSize = useZust((state) => state.pageSize);
    

    const [displayAdminPage, setDisplayAdminPage] = useState(-1);

  
    return (
        <>
            <div style={{
                display: "block",

                left: 0,

                top: 0,
                position: "fixed",
                margin: "auto auto",

            }}
            >

                <div style={{ textAlign: "center", position: "absolute", zIndex: 1 }}>

        <div style={{display:"block", backgroundColor: "rgba(20,23,24,.7)",width: 200, height: pageSize.height}}>
           
            <div  style={{
                fontFamily: "WebRockwell",
                fontSize: "25px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314"
            }}>Admin</div>
            
            <div style={{paddingLeft:"20px",paddingTop:"20px", height:"100%",  display: "block" }}>
                    <div style={{padding:"5px"}} className={styles.menuName} 
                                onClick={(e) => { setDisplayAdminPage(1); }}>
                        Edit Characters
                    </div>
                    <div style={{ padding: "5px" }} className={styles.menuName} 
                                onClick={(e) => { setDisplayAdminPage(2); }}>
                        Edit Monsters
                    </div> 
                    <div style={{ padding: "5px" }} className={styles.menuName} 
                                onClick={(e) => { setDisplayAdminPage(3); }}>
                        Edit Placeables
                    </div>
                    <div style={{ padding: "5px" }} className={styles.menuName}
                                onClick={(e) => { setDisplayAdminPage(4); }}>
                        Edit Textures
                    </div> 
            </div>
          
            

                {displayAdminPage == 1 ? <EditCharacters /> : <></>}
                {displayAdminPage == 2 ? <EditMonsters /> : <></>}
                {displayAdminPage == 3 ? <EditPlaceables /> : <></>}
                {displayAdminPage == 4 ? <EditTextures /> : <></>}
        </div>
        </div></div>
            
        </>
    )
}

export default AdminPage;

/*


    const onSubmit = (e) => {
        e.preventDefault();

        if (name.length > 3 && imageSelected)
        {
            if(imgFile.length > 65500)
            {
                alert("Images can be a maximum of ~64 KB")
            }else{
                navigate("/finalizeCampaign", {state: {userID:user.userID, campaignName:name,campaignImage: imgFile }})
              
            }
        }

    }

    const nameChanged = (e) => [
       setName(prev => campName.current.value)
    ]

////////////////////



    <form onSubmit={e => onSubmit(e)} >
            <div style={{paddingTop:"50px"}}>
                <input ref={campName} onChange={e => nameChanged(e)} name="name" className={styles.blkInput} type="text" placeholder="Campaign Name" />
            </div>
            <div style={{paddingTop:"60px"}}> <img src="Images/down.png" /></div>
            <div >
                <input id="imageUpload" style={{ display: "none" }} type="file" accept="image/*" onChange={(e) => {

                    reader.onload = () => {

                        setImgFile(reader.result);
                    }
                    reader.readAsDataURL(e.target.files[0]);
                    setImageSelected(prev => true);
                }} />
                {!imageSelected &&
                    <div style={{ paddingTop: "70px", paddingBottom: "50px" }}>
                            <label style={{ padding: "6px 12px"}} for="imageUpload" className={styles.imageButton} >Select an image...</label>
                    </div>
                }
                {imageSelected &&
                        <div style={{ paddingTop: "50px", paddingBottom: "3px"}}>
                            <label style={{ padding: "8px 8px 0px 8px" }} for="imageUpload" className={styles.imageButton} >
                             
                                <img src={imgFile} width="90" height="90" />
                                 </label>
                    </div>
                }
                    <div style={{textAlign:"right", width: mainOverlaySize.width }}>
                        <label onMouseOver={(e) => {
                            if (imageSelected && name.length > 3) rightImg.current.src = "Images/right.png"
                        }} onMouseOut={(e) => {
                            rightImg.current.src = "Images/rightDull.png"
                            }} for="next" style={{ border: "0px none", cursor: imageSelected && name.length > 3 ? "pointer" : "default"}} >
                            <img style={{ opacity: imageSelected && name.length > 3 ? 1 : .5 }} ref={rightImg} src="Images/rightDull.png" />
                        </label>
                        <input style={{display:"none"}} id="next" value=">" className={styles.arrowSubmit} type="submit" />
                    </div>
                
            </div>
            </form>
*/
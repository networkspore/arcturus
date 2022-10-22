import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from 'react-router-dom';
import useZust from "../hooks/useZust";
import CampUsers from "./components/UI/campUsers";

import produce from 'immer';


import styles from './css/campaign.module.css';




const CreateCampaignPage = () => {

    const setPage = useZust((state) => state.setPage)
    const setShowMainOverlay = useZust((state) => state.setShowMainOverlay);
    //  const setFillMainOverlay = useZust((state) => state.setFillMainOverlay);


    const setMainOverlaySize = useZust((state) => state.setMainOverlaySize)
    const setMainOverlayPos = useZust((state) => state.setMainOverlayPos);

    const pageSize = useZust((state) => state.pageSize);
    const mainOverlaySize = useZust((state) => state.mainOverlaySize);


    const reader = new FileReader();

    const user = useZust((state) => state.user);


    const [imageSelected, setImageSelected] = useState(false); 

    const rightImg = useRef();
    const campName = useRef();

    const navigate = useNavigate();

  //  const [img, setImg] = useState(<img ref={imgRef} width="90" height="90" />);
    const [name, setName] = useState("");
    const [imgFile, setImgFile] = useState()
    useEffect(()=>{
        setPage(11);
       
        setMainOverlaySize({width:800,height:500});
        setMainOverlayPos({ top: pageSize.height / 2 - mainOverlaySize.height / 2, left: pageSize.width / 2 - mainOverlaySize.width });
        setShowMainOverlay(true);
        return () =>
        {
            setShowMainOverlay(false);
        }
    },[])

    useEffect(()=>{
        setMainOverlayPos({ top: pageSize.height / 2 - mainOverlaySize.height/2, left: pageSize.width / 2 - mainOverlaySize.width /2 });
    },[pageSize,mainOverlaySize]);

    

    const onSubmit = (e) => {
        e.preventDefault();

        if (name.length > 3 && imageSelected)
        {
            if(imgFile.length > 65500)
            {
                alert("Images can be a maximum of ~64 KB")
            }else{
                navigate("/finalizeRealm", {state: {userID:user.userID, campaignName:name,campaignImage: imgFile }})
              
            }
        }

    }

    const nameChanged = (e) => [
       setName(prev => campName.current.value)
    ]

    return (
        <div style={{padding: "40px 40px", display:"block", backgroundColor: "rgba(10,13,14,.7)",width: mainOverlaySize.width, height: mainOverlaySize.height}}>
            <form onSubmit={e => onSubmit(e)} >
            <div  className={styles.mainTitle}>NEW CAMPAIGN</div>
            <div className={styles.subMainTitle}></div>
            
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
                                 {/*img*/} 
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
        </div>
    )
}

export default CreateCampaignPage;

/*
   <div name="loginRemember" class={styles.checkPos} >
                    <div class={data.loginRemember ? styles.checked : styles.check} name="loginRemember" onClick={onLoginRemember} />
                    <div onClick={onLoginRemember} style={
                        {
                        cursor: "pointer", color: (data.loginRemember) ? "#D6BD00" : "#776a05"
                        }} class={styles.keep}>Keep me signed in.</div>
                </div>

                
.checkPos
{
	text-align: left;
	padding-left: 45px;
	padding-top: 10px;
	display: flex;
}

.check {

	margin:3px;
	margin-right: 5px;
  width: 11px;
  height: 11px;
  border: 1px dotted #70787a;
	
  background-color:rgba(0, 0, 0, 0);
  cursor:"pointer"
}

.checked {
	 border: 0px;
	margin:3px;
	margin-right: 5px;
	  width: 11px;
  height: 11px;
  background-image: radial-gradient( #ffe51c 25%,  #101314 100%);
  background-repeat: no-repeat;
  background-position: center;

   cursor:"pointer"
}
*/
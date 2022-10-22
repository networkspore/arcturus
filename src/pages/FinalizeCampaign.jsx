import React, { useState, useEffect, useRef } from "react";


import { useNavigate, useLocation } from 'react-router-dom';
import useZust from "../hooks/useZust";
import CampUsers from "./components/UI/campUsers";

import produce from 'immer';


import styles from './css/campaign.module.css';
import SelectBox from "./components/UI/SelectBox";



const FinalizeCampaign = () => {

 
    const setShowMainOverlay = useZust((state) => state.setShowMainOverlay);
    //  const setFillMainOverlay = useZust((state) => state.setFillMainOverlay);


    const setMainOverlayPos = useZust((state) => state.setMainOverlayPos);

    const pageSize = useZust((state) => state.pageSize);
    const mainOverlaySize = useZust((state) => state.mainOverlaySize);




    const socket = useZust((state) => state.socket);

    const addCampaign = (c) => useZust.setState(produce((state) => {
       state.campaigns.push(c);
    }));



    const navigate = useNavigate();
    const { state } = useLocation();

  //  const [img, setImg] = useState(<img ref={imgRef} width="90" height="90" />);

  
    useEffect(()=>{
        setShowMainOverlay(true);
        return () =>
        {
            setShowMainOverlay(false);
        }
    },[])

    useEffect(()=>{
        setMainOverlayPos({ top: pageSize.height / 2 - mainOverlaySize.height/2, left: pageSize.width / 2 - mainOverlaySize.width /2 });
    },[pageSize]);

    useEffect(()=>{
        if('userID' in state)
        {

        }else{
            navigate('/createCampaign' , {replace: true});
        }
    },[state])

    const [submitting, setSubmitting] = useState(false);
    const statusRef = useRef();

    const onSubmit = (e) => {
        e.preventDefault();
        
      
        if (!submitting)
        {
            const status = statusRef.current.getValue()[0].value;
            setSubmitting(prev => true)
            socket.emit("newCampaign", state.userID, state.campaignName, state.campaignImage, status, (response) =>{
                if("notCreated" in response){
                        setSubmitting(prev => false);
                        alert("Campaign not created.")
                } else if (response[0] > 0){
                    response[2] = state.campaignImage;
                    addCampaign(response);
                    
                    navigate("/campaign", { replace: true, state: {campaignID:response[0], roomID:response[3], adminID:response[4]}})
                }
            })
            
        }

    }

    const nameChanged = (e) => [
       setName(prev => campName.current.value)
    ]
    const statusOptions = [
        {value: 'Open', label:"Open"},
        {value: "Closed", label:"Closed"},
    ]
    const friendOptions = [
        {value: 'N/A', label:"Not Available"}
    ]
    return (
        <div style={{padding: "40px 60px", display:"block", backgroundColor: "rgba(10,13,14,.7)",width: mainOverlaySize.width, height: mainOverlaySize.height}}>
            <form onSubmit={e => onSubmit(e)} >
            <div  className={styles.mainTitle}>{state.campaignName}</div>
            
            <div style={{ display: "flex", width:"100%", flexDirection:"row"}}>
                <div style={{flex:1}}></div>
                <div style={{flex:1}}>
            <div style={{ paddingTop: "50px", width: "400px", height: "300px", border: "0px solid #D6BD00", }}>
                    <div className={styles.subMainTitle} style={{ width: "100%", textAlign: "left" }} >Campaign Status</div>
                    <div style={{ paddingTop:"5px", width: "100%", textAlign: "left"}} > 
                        <SelectBox ref={statusRef} options={statusOptions} />
                </div>
                    <div className={styles.subMainTitle} style={{ paddingTop:"40px", width: "100%", textAlign: "left"}} >
                    Invite Friends    
                </div>
                <div style={{paddingTop:"5px"}}>
                        <SelectBox  options={friendOptions} />
                </div>
            </div>
                    </div>
                    <div style={{flex:1}}></div>
            </div>
                    <div style={{paddingTop:"10px" }}>
                        
                    <input style={{ color:"#ffe51c"}} id="create" value="CREATE" className={styles.blkSubmit} type="submit" />
                    </div>
                
            
            </form>
        </div>
    )
}

export default FinalizeCampaign;

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
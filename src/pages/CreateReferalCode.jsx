import React, { useState, useEffect, useRef } from "react";
import sha256 from 'crypto-js/sha256';
import MD5 from "crypto-js/md5";
import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";

import styles from './css/home.module.css'
import { generateCode } from "../constants/utility";
import aesjs from "aes-js";


export const CreateReferalCode = (props = {}) => {

    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const codeRef = useRef();

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)

    const [availableCodes, setAvailableCodes] = useState([]);
    const [codeList, setCodeList] = useState([]);

    const [codeAvailable, setCodeAvailable] = useState(true);

    const addCode = (c) => {
        setAvailableCodes(produce((state) => {
            state.push(c);
        }));
    }

    function onCancelClick(e) {
        props.cancel();
    }

    function onOKclick(e) {
        const code = codeRef.current.value;
        codeRef.current.value = ""
       
        if(code != "" && codeAvailable)
        {
            setSocketCmd({
                cmd: 'createRefCode', params: {code:code}, callback: (response) => {
           
                if(response.success){
                    addCode(response.code)
                  
                }
            }}) 
            
        }
    }
    const [copied, setCopied] = useState("")
    useEffect(()=>{
        if(availableCodes.length > 0)
        {
            let tmpCodes = [];

            availableCodes.forEach(result => {
                const created = String(result.refCreated).split(" ")[0];
                const code = result.refCode;


                tmpCodes.push(
                    <div key={code} style={{ display: "flex", width: "100%", marginLeft: "10px", height: "25px" }}>
                        <div style={{ width: 90, color: "#777777" }}>{created}</div>
                        <div style={{ width: (275) }}>{code}</div>
                        <div style={{ width: 60, fontSize: 12 }} className={copied == code ? styles.noResult : styles.hoverWhite}>
                            <div id={code} onClick={(e)=>{copyToClipboard(code)}} >{copied == code ? "copied" : "copy"}</div>
                        </div>
                    </div>
                )
            });
          
            setCodeList(tmpCodes);
            
        }
    },[availableCodes, copied])

    function copyToClipboard(value){
  
        setCopied(value)
        navigator.clipboard.writeText(value);
    }

    function onBackClick(e) {
    
        props.back()
    }

    async function onGenerateClick(e){
       
       

        const code = await generateCode(user.userEmail, 45, true);
        codeRef.current.value = code
    }

    function formatedNow(now = new Date(), small = false) {
        
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth()
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();
        const miliseconds = now.getUTCMilliseconds();

        const stringYear = year.toString();
        const stringMonth =  month < 10 ? "0" + month : String(month);
        const stringDay = day < 10 ? "0" + day : String(day);
        const stringHours = hours < 10 ? "0" + hours : String(hours);
        const stringMinutes = minutes < 10 ? "0" + minutes : String(minutes);
        const stringSeconds = seconds < 10 ? "0" + seconds : String(seconds);
        const stringMiliseconds = miliseconds < 100 ? (miliseconds < 10 ? "00" + miliseconds : "0" + miliseconds) : String(miliseconds);


        const stringNow = stringYear + "-" +  stringMonth + "-" + stringDay + " " + stringHours + ":" + stringMinutes ;


        
        return small ? stringNow : stringNow + ":" + stringSeconds + ":" + stringMiliseconds;
    }


    useEffect(()=>{
        setSocketCmd({
            cmd: "getUserReferalCodes", params: {  }, callback: (result) => {
       
            if(result.success)
            {
                
                  setAvailableCodes(result.result)
            }
        }})
    },[])
    
    return (
        <div style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.95)",
            width: 800,
            height: 500,
            left: (pageSize.width / 2) - 400,
            top: (pageSize.height / 2) - 250,
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
        }}>
            <div style={{
                paddingBottom: 10,
                textAlign: "center",
                width: "100%",
                paddingTop: "20px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",


            }}>
                Referal Codes
            </div>
            <div style={{ paddingLeft: "15px", display: "flex", height: "430px" }}>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 200, padding: "10px" }}>
                    
                    <ImageDiv width={150} height={150} about={"Account"} netImage={{
                        scale: 1,
                        image: "/Images/icons/document-lock-outline.svg",

                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                        filter: "invert(100%)"
                    }} />

                    <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

             
                </div>
                <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
                <div style={{ display: "flex", 
                
                flexDirection: "column", 
                justifyContent: "center", 
                width: "500px", 
                backgroundColor: "#33333322" }}
                >
                    <div style={{
                        width: "300px",
                        fontFamily: "Webrockwell",
                        color: "#cdd4da",
                        fontSize: "18px",
                    }}>
                        <div style={{ display: "flex", paddingTop: "50px", marginLeft:"10px" }} >
                            <div onClick={onGenerateClick} style={{ paddingLeft:10, paddingRight:10 }} className={styles.CancelButton} > Generate </div>
                            <div> <input
                                ref={codeRef}
                                placeholder="Enter a code..." 
                                autoFocus 
                                type={"text"}
                                style={{
                                    width:270,
                                    height: "38px",
                                    textAlign: "center",
                                    border: "0px",
                                    color: "white",
                                    backgroundColor: "black",
                                   
                                }} /> </div>
                            <div onClick={onOKclick} style={{ paddingLeft: 30, paddingRight: 30 }} className={styles.OKButton} > Create </div>
                        </div>
                     
                    </div>
                    <div style={{marginLeft: "20px", marginTop:"30px"}}>
                    <div style={{
                        backgroundColor:"#00000050",
                        width:"450px",
                        height:280,
                        textAlign: "center",
                        fontFamily: "WebRockwell",
                        fontSize: "13px",
                        color: "#cdd4da",
                    
                    }}>
                        <div style={{ display: "flex", width: "100%", marginLeft: "10px" }}>
                                <div style={{ width: 90, color: "#777777", }}>Created</div>
                            <div style={{ width: 275 }}>Referral Code</div>
                            <div style={{ flex: 60 }}>&nbsp;</div>
                        </div>
                            <div style={{ paddingTop: 3, marginLeft: "10px", height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                        {codeList}
                    </div>
                    </div>
                    <div style={{
                        justifyContent: "center",
                        width: "500px",
                        
                        display: "flex",
                        alignItems: "center"
                    }}>

                        <div style={{paddingLeft:"10px", paddingRight:"10px"}} className={styles.OKButton} onClick={onBackClick} >Back</div>

                    </div>
                    <div>&nbsp;</div>
                </div>

            </div>
        </div>
    )
}
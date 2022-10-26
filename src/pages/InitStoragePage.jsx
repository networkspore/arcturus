import React, { useState, useEffect, useRef  } from "react";

import { useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';


export const InitStoragePage = () => {
    
 
    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";

    const navigate = useNavigate();


    const socket = useZust((state) => state.socket);
    const user = useZust((state) => state.user);


    const setWelcomePage = useZust((state) => state.setWelcomePage);
    const [newEmail, setEmail] = useState(""); 


    const pageSize = useZust((state) => state.pageSize)


    const [valid, setValid] = useState(false);

    

    useEffect(() => {
        setWelcomePage();
    }, [])

 


    function handleChange(e) {
        const { name, value } = e.target;
        
  
        if(name == "email") {
           
            if (/.+@.+\.[A-Za-z]+$/.test(value))
           {
               socket.emit("checkEmail", value, (callback)=> {
                   if(callback)
                   {
                        setEmail(value);
                   }else{
                       setEmail("");
                   }
               })
            }else{
                setEmail("");
            }
        }

        if(name == "ref"){
            if (value.length > 7) {
                socket.emit("checkRefCode", value, (callback)=>{
                    if(callback > 0)
                    {
                        setValid(prev => true);
                       
                    }else{
                        if (valid) setValid(prev => false);
                    }
                });
            }else{
               
                if(valid)setValid(prev => false);
            }
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if(valid)setCurrent(2)


    }
    
    function onCancelClick(e){

    }

    function onOKclick(e){

    }
 

   

    return (
        <>
            
            <div id='Profile' style={{
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
                    paddingTop: "10px",
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    backgroundImage: "linear-gradient(#131514, #000304EE )",


                }}>
                    Storage Initialization
                </div>
                <div style={{ paddingLeft: "15px", display: "flex", flex:1}}>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 200, padding: "10px" }}>
                      
                     

                        <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>


                    </div>
                    <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", width: 530 }}>

                        <div style={{ width: "100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                            <div style={{
                                width: "300px",
                                fontFamily: "Webrockwell",
                                color: "#cdd4da",
                                fontSize: "18px",
                            }}>
                                <div style={{ display: "flex", paddingTop: "50px" }} >
                                    <div> <input autoFocus type={"text"}
                                        style={{
                                            width: 200,
                                            height: "20px",
                                            textAlign: "center",
                                            border: "0px",
                                            color: "white",
                                            backgroundColor: "black",
                                            fontFamily: "WebPapyrus",

                                        }} /> </div>
                                    <div style={{ paddingLeft: "20px" }} > Handle </div>
                                </div>
                                <div style={{ height: "20px" }}></div>



                            </div>
                        </div>
                       
                    </div>
                    
                </div>
                <div style={{
                    justifyContent: "center",
              
                    paddingTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <div className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

                    <div style={{

                        marginLeft: "20px", marginRight: "20px",
                        height: "50px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}>

                    </div>
                    <div className={styles.OKButton} onClick={onOKclick} >OK</div>
                </div>
            </div>
       
        </>     
    )
}

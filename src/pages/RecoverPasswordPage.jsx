import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from 'react-router-dom';


import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import sha256 from "crypto-js/sha256";



export const RecoverPasswordPage = (props = {}) => {


    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";


    const socket = useZust((state) => state.socket)
 

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailCode, setEmailCode] = useState("");
    

    const [pass, setPass] = useState("");
    const [confirm, setConfirm] = useState("")


    const navigate = useNavigate();

    const [attempts, setAttempts] = useState(0)

    const refEmailCodeInput = useRef()

    useEffect(()=>{
        if(socket == null)
        {
            navigate("/")
        }
    },[])


    function handleChange(e) {
        const { name, value } = e.target;

        if (name == "name") {
            if (value.length > 2) {
                socket.emit("checkUserName", value, (callback) => {
                    if (!callback) {
                        setName(value)
                 
                    } else {
                        setName("")
            
                    }
                })
            } else {
                setName("")
            }

        }
        if (name == "email") {

            if (/.+@.+\.[A-Za-z]+$/.test(value)) {
                socket.emit("checkEmail", value, (callback) => {
                    if (!callback) {
                        setEmail(value);
                    } else {
                        setEmail("");
                    }
                })
            } else {
                setEmail("");
            }
        }

        if (name == "emailCode") {
            if (value.length > 5) {
                setEmailCode(value)
            } else {
                setEmailCode("")
            } 
        }
        
        if (name == "pass") setPass(value);
        if (name == "confirm") setConfirm(value);
        
       
    }


    function handleSubmit(e) {
       
     
        if(attempts > 4)
        {
            alert("Error: Your password could not be updated.")
            navigate("/")
        }else{
            if ( pass == confirm && pass != "" )
            {
                if (emailCode != "" )
                {
                    var shapass = sha256(pass).toString();

                    socket.emit("updateUserPassword", { email:email, code: emailCode, password: shapass }, (callback) => {
                        if(callback.success)
                        {
                            navigate("/")
                            alert("Your password has been updated.")
                        }else{
                            alert("The information you have provided does not match our records.")
                            setAttempts(prev => prev++)
                        }
                    })

                }else{
                    alert("Recovery code required.")
                }
            }else{
                alert("Passwords do not match")
            }
        }
        
        


    }

    const [emailSent, setEmailSent] = useState(false) 
   
    function onSendEmailCode(event) {
        event.preventDefault();

        if(!emailSent)
        {
          
            if(email.length > 6){
                setEmailSent(true)
                socket.emit("sendRecoveryEmail", email, (callback)=>{
                    if(callback.success){
                        setEmailSent(true)
                  
                        
                    }else{
                        setEmailSent(false);
                        alert( "Unable to send code. " + callback.error)
                    }
                })
            }else{
                setEmailSent(false)
                alert("Please enter an email address.")
            }
        }
    }

    return (
        <div style={{
            width: 850,
            backgroundImage: "linear-gradient(to bottom, #10131450,#00030450,#10131450)",
            position: "fixed",
            display: "flex",
            left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            alignItems: "center", justifyContent: "center", flexDirection: "column",
            paddingTop: "50px",
        }}>
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 5, marginBottom: 5 }}>&nbsp;</div>
            <div style={{

                fontSize: "40px",
                textAlign: "center",
                fontFamily: "Webpapyrus",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffff60",
                fontWeight: "bolder",
                color: "#cdd4da",


            }} >Password &nbsp; Recovery</div>
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 5, marginBottom: 5 }}>&nbsp;</div>



            <div style={{ paddingTop: '60px' }}>
                <div style={{

                    fontSize: "20px",
                    textAlign: "center",
                    fontFamily: "Webpapyrus",

                    fontWeight: "bold",
                    color: "#99999a",


                }} >Recovery &nbsp; Information</div>
                <div style={{ height: 5, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                <div>
                    <div style={{ height: 30 }}></div>
                    <div style={{
                        alignItems: "center", justifyContent: "center",
                        display: "flex",


                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingLeft: 20,
                        paddingRight: 20
                    }}>

                        <input onKeyUp={(e) => {
                            if (e.code == "Enter") {
                                handleSubmit(e)
                            }
                        }} placeholder="Enter your email here" style={{
                            outline: 0,
                            border: 0,
                            color: "white",
                            width: 600, textAlign: "center", fontSize: "18px", backgroundColor: "black", fontFamily: "WebPapyrus"

                        }} name="email" type="email" onChange={event => handleChange(event)} />

                    </div>
                    <div style={{ paddingTop: 30 }}>
                        <div style={{

                            display: "flex",

                            justifyContent: "center",
                            backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                            paddingBottom: 5,
                            paddingTop: 5,
                            paddingLeft: 20,
                            paddingRight: 20,
                          
                        }}>
                            <div ><div style={{ width: 60 }}></div></div>
                            <div>
                            <input ref={refEmailCodeInput} onKeyUp={(e) => {
                                if (e.code == "Enter") {
                                    if(emailSent){
                                        handleSubmit(e)
                                    }
                                }
                            }} name="emailCode" style={{
                                outline: 0,
                                border: 0,
                                color: "white",
                                width: 200, textAlign: "center", fontSize: "18px", backgroundColor: "black", fontFamily: "WebPapyrus"

                            }} placeholder={emailSent ? "Place code here":"Send code"} type="input"  onChange={event => handleChange(event)} />
                            </div>
                            <div>
                                <div style={{paddingTop:6, paddingBottom:4, paddingLeft:6, paddingRight:6}} onClick={(e) => { if (!emailSent) onSendEmailCode(e) }} className={emailSent ? styles.CancelButton : styles.OKButton}>{emailSent ? "Sent" : "Send"}</div>
                            </div>
                        </div>

                    </div>
                    {emailCode != "" &&
                        <div style={{paddingTop:20}}>
                            <div style={{

                                display: "flex",

                                justifyContent: "center",
                                backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                                paddingBottom: 5,
                                paddingTop: 5,
                                paddingLeft: 20,
                                paddingRight: 20
                            }}>

                                <input style={{
                                    outline: 0,
                                    border: 0,
                                    color: "white",
                                    width: 400, textAlign: "center", fontSize: "15px", backgroundColor: "black", fontFamily: "WebPapyrus"

                                }} name="pass" placeholder="Password" type="password" onChange={event => handleChange(event)} />
                                <div style={{ display: (pass.length < 8 && confirm.length > 1) ? "block" : "none" }} className={styles.disclaimer}>Password must be at least 8 characters.</div>
                            </div>
                            <div style={{ height: 20 }}></div>
                            <div style={{

                                display: "flex",

                                justifyContent: "center",
                                backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                                paddingBottom: 5,
                                paddingTop: 5,
                                paddingLeft: 20,
                                paddingRight: 20
                            }}>
                                <input name="confirm" style={{
                                    outline: 0,
                                    border: 0,
                                    color: "white",
                                    width: 400, textAlign: "center", fontSize: "15px", backgroundColor: "black", fontFamily: "WebPapyrus"

                                }} placeholder="Re-enter password" type="password" onChange={event => handleChange(event)} />
                                
                            </div>
                        </div>
                    }
                  
                </div>
                <div>
                <div style={{ display: "flex", paddingTop: "20px", marginBottom: 30, alignItems: "center", justifyContent: "center", }} >

                    <div style={{
                        textAlign: "center",
                        cursor: "pointer",
                        fontFamily: "WebPapyrus",
                        fontSize: "18px",
                        fontWeight: "bolder",
                        width: 100,

                        paddingLeft: "0px",
                        paddingTop: "10px",
                        paddingBottom: "10px",

                    }}
                        className={styles.CancelButton}
                        onClick={(e) => { navigate("/") }} >
                        Cancel
                    </div>

                   
                
                    <div style={{

                        marginLeft: "10px", marginRight: "10px",
                        height: "80px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}></div>
                    <div onClick={handleSubmit} style={{
                        textAlign: "center",
                        cursor: (pass.length > 7 && confirm == pass) ? "pointer" : "default",
                        fontFamily: "WebPapyrus",
                        fontSize: "18px",
                        fontWeight: "bolder",
                        width: 100,
                        color: ( pass.length > 7 && confirm == pass) ? enableColor : defaultColor,
                        paddingLeft: "0px",
                      
                    }}
                        class={( pass.length > 7 && confirm == pass) ? styles.OKButton : ""}

                    > Confirm </div>

                    </div>
              </div>




            </div>

        </div>

    )
}

// setSocket(io(socketIOhttp, { auth: { token: socketToken, user: { nameEmail: 'annonymous' } }, transports: ['websocket'] }))
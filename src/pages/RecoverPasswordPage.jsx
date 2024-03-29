import React, { useState, useEffect, useRef } from "react";




import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import sha256 from "crypto-js/sha256";
import { getStringHash } from "../constants/utility";



export const RecoverPasswordPage = (props = {}) => {


    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";


    const setSocketCmd = useZust((state) => state.setSocketCmd)

   
    

    const [emailSent, setEmailSent] = useState(false) 

    const [attempts, setAttempts] = useState(0)

    const refEmailCodeInput = useRef()
    const confirmRef = useRef()
    const passRef = useRef()
    const emailRef = useRef()

    function handleSubmit(e) {
       
        const pass = passRef.current.value
        const confirm = confirmRef.current.value
        const emailCode = refEmailCodeInput.current.value
     
        if(attempts > 4)
        {
            alert("Error: Your password could not be updated.")
            window.location.replace("/")
        }else{
            if ( pass == confirm && pass != "" )
            {
                if (emailCode != "" )
                {
                    getStringHash(pass).then((hash) =>{
                        setSocketCmd({
                            anonymous: true,
                            cmd: "updateUserPassword", params: { email: email, code: emailCode, password: hash }, callback: (callback) => {

                            if(callback.success)
                            {
                                
                                alert("Your password has been updated.")
                                window.location.replace("/")
                            }else{
                                alert("The information you have provided does not match our records.")
                                setAttempts(prev => prev++)
                            }
                        }})

                    })
                }else{
                    alert("Recovery code required.")
                }
            }else{
                alert("Passwords do not match")
            }
        }
        
        


    }

   
    function onSendEmailCode(event) {
        event.preventDefault();

        if(!emailSent)
        {
            const email = emailRef.current.value
            if(email.length > 6){
                setEmailSent(true)
                setSocketCmd({
                    anonymous: true,
                    cmd: "sendRecoveryEmail", params: { email: email}, callback: (callback) => {

                    if(callback.success){
                        setEmailSent(true)
                  
                        
                    }else{
                        setEmailSent(false);
                        alert( "Unable to send code. " + callback.error)
                    }
                }})
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



            <div style={{ paddingTop: '40px' }}>
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

                        <input 
                            ref={emailRef}
                            onKeyUp={(e) => {
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

                                <input
                                
                                    ref={passRef}
                                    style={{
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
                                <input
                                
                                    ref={confirmRef}
                                    name="confirm" style={{
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
                        onClick={(e) => { window.location.replace("/") }} >
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
                        className={( pass.length > 7 && confirm == pass) ? styles.OKButton : ""}

                    > Confirm </div>

                    </div>
              </div>




            </div>

        </div>

    )
}

// setSocket(io(socketIOhttp, { auth: { token: socketToken, user: { nameEmail: 'annonymous' } }, transports: ['websocket'] }))
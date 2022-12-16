import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useZust from "../hooks/useZust"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from './css/home.module.css'

export const ChangePasswordPage = (props = {}) =>{
    const pageSize = useZust((state) => state.pageSize)
     
    const passRef = useRef()
    const pass2Ref = useRef()
    const codeRef = useRef()
    const navigate = useNavigate()
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const [emailSent, setEmailSent] = useState(false)



    const onSendClick = (e) =>{
        if (!emailSent) {

            
            setEmailSent(true)
            setSocketCmd({
                cmd: "sendEmailCode", params: {}, callback: (callback) => {

                    if (callback.success) {
                        setEmailSent(true)


                    } else {
                        setEmailSent(false);
                        alert("Unable to send code. Email may have been changed in last 24hrs.")
                    }
                }
            })
            
        }
    }

    const onOKclick = (e) =>{
        const pass = passRef.current.value;
        const pass2 = pass2Ref.current.value;
        const code = codeRef.current.value;
        if(pass != pass2)
        {
            alert("Passwords do not match.")
        }else{
            if(pass.length < 8)
            {
                alert("Passwords must be at least eight characters.")
            }else{
                setSocketCmd({ cmd: "updateUserPassword", params: { password:pass, code:code} })
            }
           
        }
        
    }

    const onCancelClick = (e) =>{
        props.back()
    }

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
                Change Password
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
                <div style={{
                    display: "flex",
                    alignItems:"center",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "500px",
                    backgroundColor: "#33333322"
                }}
                >
                    <div style={{
                     
                        fontFamily: "Webrockwell",
                        color: "#cdd4da",
                        fontSize: "18px",
                        paddingTop:40
                    }}>
                        <div style={{ display: "flex", paddingTop: "50px", marginLeft: "10px" }} >
                           
                            <div> <input
                                ref={passRef}
                                placeholder="Enter password"
                                autoFocus
                                type={"password"}
                                style={{
                                    width: 270,
                                    height: "38px",
                                    textAlign: "center",
                                    border: "0px",
                                    color: "white",
                                    backgroundColor: "black",

                                }} /> </div>
                          
                        </div>

                    </div>
                    <div style={{
                  
                        fontFamily: "Webrockwell",
                        color: "#cdd4da",
                        fontSize: "18px",
                    }}>
                        <div style={{ display: "flex", paddingTop: "50px", marginLeft: "10px" }} >

                            <div> <input
                                ref={pass2Ref}
                                placeholder="Re-enter password"
                                autoFocus
                                type={"password"}
                                style={{
                                    width: 270,
                                    height: "38px",
                                    textAlign: "center",
                                    border: "0px",
                                    color: "white",
                                    backgroundColor: "black",

                                }} /> </div>

                        </div>

                    </div>

                    <div style={{
                  
                        fontFamily: "Webrockwell",
                        color: "#cdd4da",
                        fontSize: "18px",
                        paddingBottom:40,
                        paddingTop:20
                    }}>
                        <div style={{ display: "flex", paddingTop: "50px", marginLeft: "10px" }} >

                            <div> <input
                                ref={codeRef}
                                placeholder={emailSent ? "Enter code from email" : "Send 2FA code"}
                                autoFocus
                                type={"text"}
                                style={{
                                    width: 150,
                                    height: "30px",
                                    textAlign: "center",
                                    border: "0px",
                                    color: "white",
                                    backgroundColor: "black",

                                }} /> </div>
                            <div style={{marginLeft:10, paddingLeft:10, paddingRight:10, height: 40, whiteSpace:"nowrap" }} className={styles.OKButton} onClick={onSendClick} >Send Code</div>
                        </div>

                    </div>
                    <div style={{
                        justifyContent: "center",

                        paddingTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <div style={{ height: 40, width: 90 }} className={styles.CancelButton} onClick={onCancelClick}>Back</div>

                        <div style={{

                            marginLeft: "20px", marginRight: "20px",
                            height: "50px",
                            width: "1px",
                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                        }}></div>
                        <div style={{ height: 40, width: 80 }} className={styles.OKButton} onClick={onOKclick} >OK</div>
                    </div>
                    <div>&nbsp;</div>
                </div>

            </div>
        </div>
    )
}
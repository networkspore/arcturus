import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useZust from "../hooks/useZust"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from './css/home.module.css'

export const ChangeEmailPage = (props = {}) =>{
    const pageSize = useZust((state) => state.pageSize)
     
    const passRef = useRef()
    const pass2Ref = useRef()
    const codeRef = useRef()
    const navigate = useNavigate()
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const [emailSent, setEmailSent] = useState(false)
    const user = useZust((state) => state.user)
    const setUser = useZust((state) => state.setUser)

    const onOKclick = (e) =>{
        const email = passRef.current.value;
        const email2 = pass2Ref.current.value;
        if (/.+@.+\.[A-Za-z]+$/.test(email))
        {
            if(email != email2)
            {
                alert("Your email addresses do not match.")
            }else{
               console.log("changing email")
                setSocketCmd({ cmd: "updateUserEmail", params: { email:email}, callback:(result)=>{
                    console.log(result)
                    if("success" in result && result.success)
                    {
                        const names = Object.getOwnPropertyNames(user)

                        let newUser = {}

                        names.forEach(name => {
                            if(name == "userEmail")
                            {
                                newUser.userEmail = email
                            }else{
                                newUser[name] = user[name]
                            }  
                        });

                        setUser(newUser)
                        alert("Email changed")
                        props.back()
                    }else{
                        alert("Unable to change email.")
                    }
                }})
               
            
            }
        }else{
            alert("Your email address is not valid.")
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
                Change Email
            </div>
            <div style={{ paddingLeft: "15px", display: "flex", height: "430px" }}>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 200, padding: "10px" }}>

                    <ImageDiv width={150} height={150} about={"Account"} netImage={{
                        scale: 1,
                        image: "/Images/icons/mail-outline.svg",

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
                                placeholder="Enter email"
                                autoFocus
                                type={"text"}
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
                        paddingBottom: 20
                    }}>
                        <div style={{ display: "flex", paddingTop: "50px", marginLeft: "10px" }} >

                            <div> <input
                                ref={pass2Ref}
                                placeholder="Re-enter email"
                                autoFocus
                                type={"text"}
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
                        paddingTop: 40,
                        fontFamily: "Webrockwell",
                        color: "#777777",
                        fontSize: "12px",
                        paddingBottom:40,
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        flexDirection:"column"
                    }}>
                        <div style={{fontSize:14, paddingBottom:10}}> Notice:</div><div>Your password may not be changed for 24hrs after changing your email.</div>
                    </div>
                  
                    <div style={{
                        justifyContent: "center",

                        paddingTop: "30px",
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
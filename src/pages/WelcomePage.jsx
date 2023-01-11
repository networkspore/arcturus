import React, { useState, useEffect, useRef  } from "react";
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";
import {NewUserPage} from "./NewUserPage"
import styles from './css/home.module.css';


const WelcomePage = () => {
    
    const emailRef = useRef()
    const refRef = useRef()
 
    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";

    const navigate = useNavigate();

    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const setWelcomePage = useZust((state) => state.setWelcomePage);


    const [currentInfo, setCurrentInfo] = useState(null);

    
  
    const [valid, setValid] = useState(false);


    useEffect(() => {
        setWelcomePage();

    
        return () => {
            location.replace("/")
        }
    }, [])

    const [emailValid, setEmailValid] = useState(false)
    function handleChange(e) {
        
        const refCode = refRef.current.value
        const email = emailRef.current.value
        
        let eValid = false
        let refValid = false
   
       
     
        if (/.+@.+\.[A-Za-z]+$/.test(email))
        {
            
            eValid = true
        }else{
            eValid = false
       
        }
    

   
        if (refCode.length > 7) {
            refValid = true
        }else{
            refValid = false
            
        }
        setEmailValid(eValid)

        setValid(eValid && refValid)
  
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if(valid){
            setValid(false)
            const refCode = refRef.current.value
            const userEmail = emailRef.current.value
            console.log(refCode)
            console.log(userEmail)
            startLogin() 
            setSocketCmd({ anonymous:true, cmd: 'checkRefCodeEmail', params:{
                refCode:refCode,
                userEmail: userEmail,
            }, callback:(result) =>{
        
                if("success" in result && result.success){
                        cancelLoader()
                        setValid(true)    
                       setCurrentInfo({refCode: refCode, userEmail:userEmail})
                }else{
                    setValid(true)
                    setCurrentInfo(null)
                    alert("Could not validate your email address and referral code.")
                    cancelLoader()
                }
            } })
            
        }


    }
    const loginStatusLength = 800
    const interval = useRef({ value: null })
    const [loginStatus, setLoginStatus] = useState(null)


    function startLogin() {
       
            setLoginStatus(1)
 

        interval.current.value = { id: setInterval(incrementStatus, 50), index: 0 }
        return true
    }

    function cancelLoader() {
        clearInterval(interval.current.value.id)
        interval.current.value = null
        setLoginStatus(null)
    }

    const incrementStatus = () => {
        if ( interval.current.value.index < loginStatusLength) {
            interval.current.value.index += 50
            setLoginStatus(interval.current.value.index)
        } else {
            clearInterval(interval.current.value.id)
        }
    }


    const createUser = (userInfo) =>{
        return new Promise(resolve =>{
       
        const { userName, userPassword } = userInfo
        const { refCode, userEmail } = currentInfo
        const newUser = {
            refCode: refCode,
            userEmail: userEmail,
            userName: userName,
            userPassword: userPassword
        }
        console.log(newUser)
   
        setSocketCmd({
            anonymous: true,
            cmd: 'createUser', params: newUser , callback: (response) => {
           
            if ("success" in response && response.success)
            {
                resolve(true)
            }else{
        
                resolve(false)
            }

        }});
        })
    }
   

    return (
        <>
        { currentInfo == null ?
        
            <div style={{ width: 850,
                    backgroundImage: "linear-gradient(to bottom, #10131450,#00030450,#10131450)", 
                position: "fixed", 
                display:"flex",
                left: "50%", top: "50%", transform: "translate(-50%,-50%)", 
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", 
                alignItems: "center",justifyContent: "center", flexDirection: "column",
                
            }}>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        color: "white",
                        paddingBottom:60,
                    }}>{loginStatus != null ?
                        <div style={{
                            flex: 1,
                            height: 1,
                            boxShadow: `0 0 10px #ffffff${((loginStatus / loginStatusLength) * 255).toString(16).slice(0, 2)}, 0 0 30px #ffffff${((loginStatus / loginStatusLength) * 160).toString(16).slice(0, 2)}`,
                        }}>
                            &nbsp;
                        </div>
                        : <div style={{
                            flex: 1,
                            height: 1,
                        }}></div>
                        }
                    </div> 
                    
                <div  style={{
                    
                    fontSize:"48px",
                    textAlign: "center",
                    fontFamily: "Webpapyrus",
                        textShadow:"0 0 10px #ffffff40, 0 0 20px #ffffff60",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                  
               
                }} > Create Account</div>
                
                    <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #00030450, #77777730, #00030450)", paddingTop:3}}>&nbsp;</div>
                  
                   

              

                    <div style={{paddingTop:80}}>
                        <div style={{

                            display: "flex",
                            
                            justifyContent: "center",
                            backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                            paddingBottom: 5,
                            paddingTop:5,
                            paddingLeft:20,
                            paddingRight:20
                        }}>

                            <input 

                                ref={refRef}
                            onKeyUp={(e) => {
                                if (e.code == "Enter") {
                                    handleSubmit(e)
                                }
                            }} name="ref" style={{
                                outline: 0,
                                border: 0,
                                color: "white",
                                width: 600, textAlign: "center", fontSize: "30px", backgroundColor: "black", fontFamily: "WebPapyrus"

                            }}   placeholder="Referral code..." type="input" autoFocus onChange={event => handleChange(event)} />
                                        </div>

                    </div>

                    <div style={{ paddingTop: "5px", color: "#77717180",textShadow:"1px 1px 1px black", fontSize: "12px", fontFamily:"Webrockwell" ,paddingBottom:"50px"}} >
                        Enter a referral code.
                    </div>
                            <div style={{paddingTop:"30px"}}>
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
                            }} placeholder="email@somewhere.com" style={{
                                outline: 0,
                                border: 0,
                                color: "white",
                                width: 600, textAlign: "center", fontSize: "30px", backgroundColor: "black", fontFamily: "WebPapyrus"
                                        
                                        }} name="email"  type="email" onChange={event => handleChange(event)} />

                                       </div>
                            </div>
                    <div style={{ paddingTop: "5px", textShadow: "1px 1px 1px black", color: "#77717180", fontFamily:"Webrockwell", fontSize:"12px", paddingBottom:"40px" }} >
                        {emailValid ? "Email valid." : "Enter a valid email."}
                                </div>
                    <div style={{ display: "flex", paddingTop: "20px", marginBottom:30, alignItems: "center", justifyContent: "center", }} >
                      
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
                                onClick={(e) => { window.location.replace("/")}} >
                                Cancel
                            </div>

                     
                        <div style={{

                            marginLeft: "10px", marginRight: "10px",
                            height: "80px",
                            width: "1px",
                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                        }}></div>
                                <div onClick={handleSubmit}  style={{
                                        textAlign: "center",
                                        cursor: ( (valid)) ? "pointer" : "default", 
                                        fontFamily: "WebPapyrus",
                                        fontSize: "18px",
                                        fontWeight: "bolder",
                                        width:100,
                                        color: ((valid)) ? enableColor : defaultColor, 
                                        paddingLeft: "0px",
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                    }}
                                    className={(valid) ? styles.OKButton: ""} 
                                  
                                > Confirm </div>
                        </div>
                        
                        </div>:
                <NewUserPage createUser={createUser}/>
        }
        </>     
    )
}

export default WelcomePage;

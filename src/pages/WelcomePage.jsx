import React, { useState, useEffect, useRef  } from "react";

import { useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import NewUserPage from './NewUserPage'
import { io } from "socket.io-client";
import { socketIOhttp, socketToken } from '../constants/httpVars';

const WelcomePage = () => {
    
 
    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";

    const navigate = useNavigate();

    const setSocket = useZust((state) => state.setSocket)
    const socket = useZust((state) => state.socket);
    const user = useZust((state) => state.user);
    const setUser = useZust((state) => state.setUser);

    const setRedirect = useZust((state) => state.setLoading);
    const redirect = useZust((state) => state.loading);


    const setWelcomePage = useZust((state) => state.setWelcomePage);
    const [newEmail, setEmail] = useState(""); 


    const [current, setCurrent] = useState(0);

    
    
   const [refID, setRefID] = useState("");

    const [valid, setValid] = useState(false);

    const [showpage, setShowpage] = useState(false)
    

    useEffect(() => {
        setWelcomePage();

        setCurrent(1);
        return () => {
            setSocket(null)
        }
    }, [])

    useEffect(() => {
        if (socket == null) {
            navigate("/")
        }
    },[socket])


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
                        setRefID(callback);
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
    

 

    const createUser = (newUser) =>{
        newUser.userRefID = refID;
        socket.emit('createUser', newUser, (response) => {
            if (!response.create) {
                alert(response.msg);
                navigate("/welcome")
            } else {
                alert("User created, Please log in.")
                navigate('/')
            }

        });
    }
   

    return (
        <>
        { current == 1 &&
        
            <div style={{ width: 850,
                    backgroundImage: "linear-gradient(to bottom, #10131450,#00030450,#10131450)", 
                position: "fixed", 
                display:"flex",
                left: "50%", top: "50%", transform: "translate(-50%,-50%)", 
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", 
                alignItems: "center",justifyContent: "center", flexDirection: "column",
                paddingTop: "60px",
            }}>
                    <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom:5, marginBottom:5}}>&nbsp;</div>
                <div  style={{
                    
                    fontSize:"50px",
                    textAlign: "center",
                    fontFamily: "Webpapyrus",
                        textShadow:"0 0 10px #ffffff40, 0 0 20px #ffffff60",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                  
               
                }} > Create Account</div>
                
                    <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingTop:5}}>&nbsp;</div>
                  
                   

              

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

                            <input onKeyUp={(e) => {
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

                    <div style={{ paddingTop: "5px", color: "#77717180", fontSize: "12px", fontFamily:"Webrockwell" ,paddingBottom:"50px"}} >
                        {valid ?  "Code valid." : "Enter a valid referral code."}
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

                            <input onKeyUp={(e) => {
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
                                <div style={{ paddingTop: "5px", color: "#77717180", fontFamily:"Webrockwell", fontSize:"12px", paddingBottom:"40px" }} >
                                    {newEmail == "" ? "Enter an unused email." : "Email valid."}
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
                                onClick={(e) => { navigate("/")}} >
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
                                        cursor: ((newEmail.length > 4) && (valid)) ? "pointer" : "default", 
                                        fontFamily: "WebPapyrus",
                                        fontSize: "18px",
                                        fontWeight: "bolder",
                                        width:100,
                                        color: ((newEmail.length > 4)&&(valid)) ? enableColor : defaultColor, 
                                        paddingLeft: "0px",
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                    }}
                                    class={((newEmail.length > 4)&&(valid)) ? styles.OKButton: ""} 
                                  
                                > Confirm </div>
                            </div>

        </div>
        }
        {current ==2 &&
            <NewUserPage socket={socket} newEmail={newEmail} refCode={refID} createUser={(newUser)=>createUser(newUser)}/>
        }
        </>     
    )
}

export default WelcomePage;

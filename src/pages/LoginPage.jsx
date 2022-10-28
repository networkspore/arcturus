import React, { useEffect, useState } from "react";
import styles from './css/login.module.css';
import { useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";
import sha256 from 'crypto-js/sha256';
import useZust from "../hooks/useZust";
import produce from "immer";
import { io } from "socket.io-client";
import { socketIOhttp, socketToken } from '../constants/httpVars';
import { useRef } from "react";
import { get } from "idb-keyval";

 const LoginPage = (props = {}) =>  {

    const txtName = useRef();
    const txtPass = useRef();

    const setSocket = useZust((state) => state.setSocket)
    const setUser = useZust((state) => state.setUser)
    const setContacts = useZust((state) => state.setContacts)
    const setContactRequests = (value) => useZust.setState(produce((state)=>{
        state.contactRequests = value;
    }))

    const [data, setData] = useState({ loginRemember: false, loginName: "", loginPass: "" });
    const [cookie, setCookie] = useCookies(['login']);
   

     
    const navigate = useNavigate(); 
    
    const [disable, setDisable] = useState(false)
    const autoLogin = useZust((state) => state.autoLogin)

    
   // const [overlayPos, setOverlayPos] = useState({top:200, left:200})
   // const overlaySize = {width: 600, height: 400};

    const pageSize = useZust((state) => state.pageSize);
   // const scrollLeft = useZust((state) => state.scrollLeft)
   // const scrollTop = useZust((state) => state.scrollTop)

    const setLoginPage = useZust((state) => state.setLoginPage);


    const setConnected = useZust((state) => state.setConnected)

    const onLoginRemember = e =>{
        setData(prevState => ({
            ...prevState,
            ["loginRemember"]: !prevState.loginRemember
        }));

    }
    
    const handleChange = e => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));

    }
    

    useEffect(()=>{
      
        let isLogin = false;
    
        if(autoLogin){
            if ("login" in cookie){
                if(cookie.login.useCookie)
                {
                    
                    isLogin = login(cookie.login.name, cookie.login.pass);
            
                }
            }
        }else{
            if ("login" in cookie) {
                if (cookie.login.useCookie) {
                    setCookie("login", { useCookie: false, name: "", pass: "" })
                    
                   
                }
            }
        }
        if(!isLogin){
            setLoginPage();
        }
         //   setFillMainOverlay(false);

        
       // setOverlayPos(produce((state) => {
         //  state.top = pageSize.height/2 - 200;
         //  state.left =  pageSize.width * .25 - 300;
       // }))

        return () => {
     
        }
    }
    ,[]);

    function onLostPassword(event){
        if (!disable) {
            setDisable(true);
            setSocket(io(socketIOhttp, { auth: { token: socketToken, user: { nameEmail: 'anonymous' } }, transports: ['websocket'] }))
            navigate("/recoverpassword")
        }
    }


    function handleCreate(event) {

        if (!disable) {
            setDisable(true);
            setSocket(io(socketIOhttp, { auth: { token: socketToken, user: { nameEmail: 'anonymous' } }, transports: ['websocket'] }))
            navigate("/welcome")
        }
        
        
    }

    function handleSubmit(e) {
        e.preventDefault();
        let pass = sha256(data.loginPass).toString();
        login(data.loginName, pass);
    }
    
    function login(name_email = "", pass ="")
    {
        if(!disable){
            setDisable(true);
            const sock = io(socketIOhttp, { auth: { token: socketToken, user: { nameEmail: name_email, password: pass } }, transports: ['websocket'] });
            sock.on("disconnect",(error)=>{
                alert("Could not connect. Check your password and try again.")
              setDisable(false)
            })
            sock.on("loggedIn", (user, contacts, requests) =>{
              
                if(data.loginRemember){
               
                    setCookie("login", { useCookie: true, name: name_email, pass: pass })
                }
                setUser(user)
                setContacts(contacts)
                setContactRequests(requests)
                setSocket(sock);
                setConnected(true)
                

            
                return true;
            })
            
        }
    }


return (
    <div style={{
        display: "flex",
        left: "25%",
        height: 425, 
        top: "50%",
        position: "fixed",
        transform:"translate(-50%,-50%)",
        width: 600,
        
        boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
        backgroundImage: "linear-gradient(to bottom,  #00030490,#13161780)",
        textShadow: "2px 2px 2px black",
        flexDirection:"column",
        alignItems:"center",
    
        paddingBottom: 30,
    }}
    >
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


        }}></div>
            <div style={{ textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffff60", cursor: "default", paddingTop: 15, paddingBottom: 20, fontWeight: "bold", fontSize: "50px", fontFamily: "WebPapyrus", color:"#cdd4da" }}>
                Log In
            </div>
            <form onSubmit={event => handleSubmit(event)}>
            <div style={{ display: "flex", paddingTop: "15px", justifyContent: "center", }}>
                    <div style={{

                        display: "flex",
                        
                        justifyContent: "center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingLeft:5,
                        paddingRight:5,
                        width:400,
                    }}>
                        <input onKeyUp={(e) => {
                            if (e.code == "Enter") {
                                handleSubmit(e)
                            }
                        }}  style={{ 
                            outline:0,
                            border:0, 
                            width: 400, textAlign: "center", color:"white", fontSize: "25px", backgroundColor: "black", fontFamily:"WebPapyrus" }} ref={txtName} name="loginName"  placeholder="Name or Email" type="text" onChange={handleChange} />
                    </div>
                </div>

            <div style={{ display: "flex", paddingTop: "30px", justifyContent: "center", }}>
                    <div style={{

                        display: "flex",

                        justifyContent: "center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingLeft: 5,
                        paddingRight: 5
                    }}>
                        <input onKeyUp={(e) => { if(e.code == "Enter"){
                            handleSubmit(e)
                        } }} ref={txtPass} style={{
                            outline:0, 
                            border: 0, 
                            color: "white", 
                            width: 500, textAlign: "center", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus" }} name="loginPass" placeholder="Password" type="password" onChange={handleChange} />
                    </div>
                </div>
            <div style={{ width: "93%", display: "flex", alignItems: "center", justifyContent: "right", transform:"translate(0px,4px)" }}>
                    <div onClick={onLostPassword} style={{ 
                        fontFamily: "WebPapyrus", 
                        fontSize: 15,
                    }} className={styles.glowText}>
                        Lost password
                    </div>
                  
                </div>
                
                <div style={{paddingLeft:20,}} name="loginRemember" className={styles.checkPos} >
                    <div className={data.loginRemember ? styles.checked : styles.check} name="loginRemember" onClick={onLoginRemember} />
                    <div onClick={onLoginRemember} style={
                        {
                            fontFamily:"WebPapyrus",
                        cursor: "pointer", 
                        color: (data.loginRemember) ? "#ffffffDD" : "#777777",
                        textShadow: (data.loginRemember) ? "1px 1px 2px #000000" : "",
                        
                        }} >Keep me signed in.</div>
                </div>
                <div style={{ width:"100%", display:"flex", justifyContent:"right"}}>
                    <div onClick={handleSubmit} style={{
                        textAlign: "center",
                        cursor: (data.loginName.length > 2 && data.loginPass.length > 7) || (disable) ? "pointer" : "default",
                        fontFamily: "WebPapyrus",
                        fontSize: "25px",
                        fontWeight: "bolder",
                        width: 100,
                        color: (data.loginName.length > 2 && data.loginPass.length > 7) || (disable) ? "white" : "#77777750",
                        
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        transform:"translate(5px, 20px)"
                    }}
                        className={(data.loginName.length > 2 && data.loginPass.length > 7) || (disable) ? styles.OKButton : ""}

                    > Enter </div>
                    <div style={{width:20}}></div>
               
                </div>

               
            </form>
        <div style={{ paddingTop: 20 }}>
            <a onClick={handleCreate} style={{ fontFamily: "WebPapyrus", fontSize: 15 }} className={styles.glowText}>Create Account</a>
        </div>

        </div>
       
    )
    
    

};

export default LoginPage;
import React, { useEffect, useState } from "react";
import styles from './css/login.module.css';
import { useNavigate} from 'react-router-dom';
import { flushSync } from 'react-dom';
import useZust from "../hooks/useZust";

import { useRef } from "react";
import { getStringHash, getPermissionAsync, getFileInfo } from "../constants/utility";
import { get, set } from "idb-keyval";

 const LoginPage = (props = {}) =>  {



    const txtName = useRef();
    const txtPass = useRef();

    const setUser = useZust((state) => state.setUser)
    const setContacts = useZust((state) => state.setContacts)

    const [data, setData] = useState({ loginRemember: false, loginName: "", loginPass: "" });
    const autoLogin = useZust((state) => state.autoLogin)
     
    const navigate = useNavigate(); 
    
    const [disable, setDisable] = useState(false)
    const [userList, setUserList] = useState(null)
    const loginStatusLength = 3200
     const interval = useRef({ value: null })
     const [loginStatus, setLoginStatus] = useState(null)
  
    const setLoginPage = useZust((state) => state.setLoginPage);
    const setUserFiles = useZust((state) => state.setUserFiles)

    const setConnected = useZust((state) => state.setConnected)

    const onLoginRemember = e =>{
        setData(prevState => ({
            ...prevState,
            ["loginRemember"]: !prevState.loginRemember
        }));

    }

    useEffect(()=>{
        setLoginPage()
      
    },[])

    const contexts = useRef({value: []})


    
    const handleChange = e => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));

    }
   


    function onLostPassword(event){
        if (!disable) {
           
            if (!disable) flushSync(() => { setDisable(true) })

            startLogin()

            setSocketCmd({
                anonymous: true,
                cmd: "login", params: { nameEmail: "anonymous" }, callback: (response) => {
                    if (!("error" in response)) {
                        if (response.success) {
                            navigate("/recoverpassword")
                        }
                    }

                }
            })
        }
    }


    function handleCreate(event) {

        if (!disable) {
            if (!disable) flushSync(() => { setDisable(true) })

            startLogin()

            setSocketCmd({anonymous:true,
                cmd: "login", params: { nameEmail: "anonymous" }, callback: (response) => {
                  console.log(response)
                if(!("error" in response)){
                    if(response.success)
                    {
                         navigate("/welcome")
                    }
                }
               
            }})
            
            
          
        }
        
        
    }
   
    async function handleSubmit(e) {
        e.preventDefault();
        if (!disable) flushSync(() => { setDisable(true) })
  
        startLogin()
       
        

        if(!disable) login().then((isLogin) => {
            cancelLoader()
            if (!disable && !isLogin) alert("Check your password and try again.")
        })
 
    }

    function startLogin(){
       
        setLoginStatus(1)
       
       
        interval.current.value = { id: setInterval(incrementStatus, 50), index: 0 } 
        return true
    }

    function cancelLoader(){
        clearInterval(interval.current.value.id)
        interval.current.value = null
        setLoginStatus(null)
    }

    const incrementStatus = () =>{
        if (interval.current.value.index < loginStatusLength)
        {
            interval.current.value.index += 50
            setLoginStatus(interval.current.value.index)
        }else{
            clearInterval(interval.current.value.id)
        }
    }
    
    const setSocketCmd = useZust((state) => state.setSocketCmd)

   


    function login()
    {
        return new Promise(resolve =>{
            const clearPass = txtPass.current.value
            const name_email = txtName.current.value

            getStringHash(clearPass,64).then((pass)=>{
                if(!disable){
                    setDisable(true)
                    
                
                    setSocketCmd({cmd:"login", params:{nameEmail: name_email, password: pass},callback: async (response)=>{
                    
                     
                        if(response.success){

                            const user = response.user
                            const contacts = response.contacts
                            const userFiles = response.userFiles

                            await set(user.userID + "userFiles", userFiles)


                            setContacts(contacts)
                            setUser(user)
                            
                            const value = await get(user.userID + "localDirectory")
                            const verified = await getPermissionAsync(value.handle)

                            navigate("/", { state: {localDirectory: value !== undefined && verified ? value : undefined } })
                                            
                                                   
                        }else{
                            setDisable(false)
                            resolve(false)
                        }
                    }})    
                }
            })
        })
    }


return (
    <>
    {userList == null &&
       
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
    
        
    }}
    >
                

                    <div style={{
                        width: "100%",
                        display: "flex",
                        color: "white",
                    }}>{loginStatus != null ?
                        <div style={{
                            flex: 1,
                            height: 1,
                            boxShadow: `0 0 10px #ffffff${((loginStatus / loginStatusLength) * 255).toString(16).slice(0, 2)}, 0 0 30px #ffffff${((loginStatus / loginStatusLength) * 200).toString(16).slice(0, 2)}`,
                        }}>
                            &nbsp;
                        </div>
                        :<div style={{
                            flex: 1,
                            height: 1,
                        }}></div>
                        }
                    </div> 
                
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
                        <input 
                        
                            disabled={disable}
                            onKeyUp={(e) => {
                            if (e.code == "Enter") {
                                handleSubmit(e)
                            }
                        }}  style={{ 
                            color: disable ? "#777777" : "white", 
                            outline:0,
                            border:0, 
                            width: 400, textAlign: "center",  fontSize: "25px", backgroundColor: "black", fontFamily:"WebPapyrus" }} ref={txtName} name="loginName"  placeholder="Name or Email" type="text" onChange={handleChange} />
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
                        <input 
                             disabled={disable}
                        onKeyUp={(e) => { if(e.code == "Enter"){
                            handleSubmit(e)
                        } }} ref={txtPass} style={{
                            outline:0, 
                            border: 0, 
                            color: disable ? "#777777" : "white", 
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
                
                
                <div style={{ width:"100%", display:"flex", }}>
                    <div style={{flex:1}}>&nbsp;</div>
                    <div onClick={handleSubmit} style={{
                        textAlign: "center",
                        cursor: !disable && (data.loginName.length > 2 && data.loginPass.length > 7) ? "pointer" : "default",
                        fontFamily: "WebPapyrus",
                        fontSize: "25px",
                        fontWeight: "bolder",
                        width: 100,
                            color: !disable &&(data.loginName.length > 2 && data.loginPass.length > 7)  ? "white" : "#77777750",
                        
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        transform:"translate(5px, 20px)"
                    }}
                            className={!disable && (data.loginName.length > 2 && data.loginPass.length > 7)  ? styles.OKButton : ""}

                    > Enter </div>
                    <div style={{width:20}}></div>
               
                </div>

               
            </form>
        <div style={{ paddingTop: 20 }}>
            <a onClick={handleCreate} style={{ fontFamily: "WebPapyrus", fontSize: 15 }} className={styles.glowText}>Create Account</a>
        </div>
          
                <div style={{
                    width:"100%",
                    display:"flex",
                    paddingTop:5,
                    opacity:.5
                    }}>
                          {loginStatus != null ?

                    <div style={{
                            flex: loginStatus / loginStatusLength,
                            height: 2,
                            backgroundImage: `linear-gradient(to bottom, #cdd4da${(((loginStatus / loginStatusLength) * 200)+55).toString(16).slice(0, 2)} ${(loginStatus / loginStatusLength * 100) + "%"}, #000000${((loginStatusLength / loginStatus) * 255).toString(16).slice(0, 2) } ${(loginStatus / loginStatusLength * 100) + "%"})`,
                            boxShadow: `0 0 5px #ffffff40, 0 0 10px #ffffff${(((loginStatus / loginStatusLength) * 255)).toString(16).slice(0, 2)}`,
                    }}>
                        &nbsp;
                         
                        </div> : <div style={{
                            flex: loginStatus / loginStatusLength,
                            height: 2,
                        }} > &nbsp;

                        </div>
}
                </div>
          
         </div>
      
        }
         </>
    )
    
    

};

export default LoginPage;
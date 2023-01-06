import React, { useEffect, useState } from "react";
import styles from './css/login.module.css';
import { useNavigate} from 'react-router-dom';

import sha256 from 'crypto-js/sha256';
import useZust from "../hooks/useZust";

import { useRef } from "react";
import { getFileInfo, getStringHash, getPermissionAsync } from "../constants/utility";
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
  
    const setLoginPage = useZust((state) => state.setLoginPage);
    const setUserFiles = useZust((state) => state.setUserFiles)

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
        setLoginPage()
    
     

    }
    ,[]);

    async function getUserList()
    {
        const uL = await  get("arc.users")

        if(Array.isArray(uL) && uL.length > 0){
            setUserList(uL)
        }
    }
     async function updateUserList(user) {
         const userList = await get("arc.users")

         if (!isArray(userList)) {
             await set("arc.users", [user])
         } else {
             const index = userList.findIndex(u => u.userID == user.userID)

             if (index == -1) {
                 userList.push(user)
                 await set("arc.users", userList)
             } else {
                 userList.splice(index, 1, user)
                 await set("arc.users", userList)
             }
         }
     }

    function onLostPassword(event){
        if (!disable) {
            setDisable(true);
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
            setDisable(true);
            setSocketCmd({anonymous:true,
                cmd: "login", params: { nameEmail: "anonymous" }, callback: (response) => {
                  
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
        let pass = await getStringHash(data.loginPass);
        login(data.loginName, pass);
    }
    
    const setSocketCmd = useZust((state) => state.setSocketCmd)

     async function loadConfig(value, user) {

         try {

             const homeHandle = await value.handle.getDirectoryHandle("home")
             const userHomeHandle = await homeHandle.getDirectoryHandle(user.userName)


             const handle = await userHomeHandle.getFileHandle(user.userName + ".storage.key")
             const file = await handle.getFile()
             const fileInfo = await getFileInfo(file, handle, userHomeHandle)
          
           
            return fileInfo
           

         } catch (err) {

             console.log(err.message)

             return undefined
         }
     }


    async function login(name_email = "", pass ="")
    {
        if(!disable){
            setDisable(true)
            
           
            setSocketCmd({cmd:"login", params:{nameEmail: name_email, password: pass},callback: async (response)=>{
              
                setDisable(false)
            if(response.success){

                const user = response.user
                const contacts = response.contacts
                const userFiles = response.userFiles

                await set(user.userID + "userFiles", userFiles)
                setContacts(contacts)
                setUser(user)
                
                const value = await get(user.userID + "localDirectory")
                

                if(value != undefined ){
                    const verified = await getPermissionAsync(value.handle)
                   
                    const configFile = verified ? await loadConfig(value, user) : undefined
                    
                 
                    if (configFile != undefined) {
                        const storageHash = configFile.hash
              

                        setSocketCmd({cmd:"checkStorageHash", params:{storageHash:storageHash}, callback:async (result)=>{
                            
                            if("success" in result && result.success){

                              
                                navigate("/",{state:{configFile:configFile, localDirectory: value}})
                                
                            }else{
                                navigate("/", { state: { error: "config" } })
                            }
                        }})    

                    } else {
                        await get(user.userID + "localDirectory", undefined)
                        navigate("/", { state: { configFile: null } })
                    }
                }else{
                    
                    navigate("/", { state: { configFile: null } })
                }
                
                }else{
                    alert("Check your password and try again.")
                }
            }})    
        }
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
      
        }
         </>
    )
    
    

};

export default LoginPage;
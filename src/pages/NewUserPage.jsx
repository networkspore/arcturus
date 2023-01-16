import React, { useState, useEffect } from "react";
import { flushSync } from 'react-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import { getStringHash } from "../constants/utility";
import { useRef } from "react";


export const NewUserPage = (props = {}) => {
  

    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";

    const nameRef = useRef()
    const passRef = useRef()
    const confirmRef = useRef()
    
    const loginStatusLength = 3000
    const interval = useRef({ value: null })
    const [loginStatus, setLoginStatus] = useState(null)


    const createUser = props.createUser;

    const [valid, setValid] = useState(false)


    const [enabled, setEnabled] = React.useState(true);
  


    const [nameAvailable, setNameAvailable] = useState(true);


    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const canCheck = useRef({value:true})

    function handleChange(e) {
        const { name, value } = e.target;

        if (name == "name") {
            if (value.length > 2) {

                if(canCheck.current.value){
                    canCheck.current.value = false
                    setSocketCmd({anonymous:"true",
                        cmd: "checkUserName", params: {text: value  }, callback: (result) => {
                            canCheck.current.value = true
                            
                            if (result) {
                            
                                setNameAvailable(pre => true);
                            } else {
                              
                                setNameAvailable(pre => false);
                            }
                        }})
                }
            } else {
              
            }
           
        } 

        const nameValue = nameRef.current.value
        const pass = passRef.current.value
        const confirm = confirmRef.current.value

        if(pass == confirm && nameValue.length > 2 && pass.length > 7)
        {
            setValid(true)
        }else{
            setValid(false)
        }
        
    
    }



    async function handleSubmit(e) {
        e.preventDefault();
        const name = nameRef.current.value
        const pass = passRef.current.value
        const confirm = confirmRef.current.value

        if(enabled && valid && nameAvailable && pass == confirm){
            setEnabled(false);

           

            var hashpass = await getStringHash(pass, 64);
            let newUser = { userName: name, userPassword: hashpass }
            startLogin()
            createUser(newUser).then((created)=>{
                if(!created)
                {
                    setEnabled(true)
                    nameRef.current.value = ""
                    passRef.current.value = ""
                    confirmRef.current.value = ""
                    alert(`Unable to create this user, please try again.`)
                    cancelLoader()
                }else{
                    alert(`Your account is now active!`)
                    location.replace("/")
                }
            })
        }

        
    }

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
        if (interval.current.value.index < loginStatusLength) {
            interval.current.value.index += 50
            setLoginStatus(interval.current.value.index)
        } else {
            clearInterval(interval.current.value.id)
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
      
    }}>
        <div style={{
            width: "100%",
            display: "flex",
            color: "white",
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
                 
            <div>
            <div style={{
                paddingTop:40,
                fontSize: "20px",
                textAlign: "center",
                fontFamily: "Webpapyrus",

                fontWeight: "bold",
                color: "#99999a",


            }} >Account Information</div>
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>
            <div style={{height:50}}></div>
            <div style={{   

                display: "flex",

                justifyContent: "center",
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
                }} 
                        ref={nameRef}
                    name="name" placeholder="User name" autoFocus onChange={event => handleChange(event)} 
                        style={{
                            outline: 0,
                            border: 0,
                            color: "white",
                            width: 600, textAlign: "center", fontSize: "20px", backgroundColor: "black", fontFamily: "WebPapyrus"

                        }}
                    />
                    
                </div>
            <div style={{ width:"100%", alignItems:"center", justifyContent:"center", display: nameAvailable ? "none" : "flex", color:"#77777780", fontSize:12 }} className={styles.disclaimer} >Name not available</div>
                <div style={{height:60}}></div>
                <div style={{

                    display: "flex",

                    justifyContent: "center",
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
                }} 
                    ref={passRef}
                style={{

                    outline: 0,
                    border: 0,
                    color: "white",
                    width: 400, textAlign: "center", fontSize: "15px", backgroundColor: "black", fontFamily: "WebPapyrus"

                }} name="pass" placeholder="Password" type="password" onChange={event => handleChange(event)} />

                       
                </div>
                <div style={{ fontSize: "12px", alignItems:"center", justifyContent:"center", color:"#77777780", display: !valid ? "flex" : "none" }} className={styles.disclaimer}>Password must be at least 8 characters.</div>

            <div style={{height:30}}></div>
            <div style={{

                display: "flex",

                justifyContent: "center",
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
                }} name="confirm"
                    ref={confirmRef}
                style={{
                    outline: 0,
                    border: 0,
                    color: "white",
                    width: 400, textAlign: "center", fontSize: "15px", backgroundColor: "black", fontFamily: "WebPapyrus"

                }} placeholder="Re-enter password" type="password" onChange={event => handleChange(event)} />
                        
                </div>
                
            </div>
            <div style={{ fontSize: "12px", alignItems: "center", justifyContent: "center", color: "#77777780", display: !valid ? "flex" : "none" }} className={styles.disclaimer}>Passwords must match</div>

            <div style={{ display: "flex", paddingTop: 30, marginBottom: 10, alignItems: "center", justifyContent: "center", }} >

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
                <div onClick={handleSubmit} style={{
                    textAlign: "center",
                    cursor: (valid) ? "pointer" : "default",
                    fontFamily: "WebPapyrus",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    width: 100,
                    color: (valid) ? enableColor : defaultColor,
                    paddingLeft: "0px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                }}
                    className={(valid) ? styles.OKButton : ""}

                > Confirm </div>
            </div>

        <div style={{
            width: "100%",
            display: "flex",
            paddingTop: 5,
            opacity: .5
        }}>
            {loginStatus != null ?

                <div style={{
                    flex: loginStatus / loginStatusLength,
                    height: 2,
                    backgroundImage: `linear-gradient(to bottom, #cdd4da${((loginStatus / loginStatusLength) * 255).toString(16).slice(0, 2)} ${(loginStatus / loginStatusLength * 100) + "%"}, #000000${((loginStatusLength / loginStatus) * 255).toString(16).slice(0, 2)} ${(loginStatus / loginStatusLength * 100) + "%"})`,
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff20",
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

    
 
)
}

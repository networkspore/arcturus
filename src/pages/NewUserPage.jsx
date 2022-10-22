import React, { useState, useEffect } from "react";

import { useNavigate } from 'react-router-dom';


import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import sha256 from "crypto-js/sha256";



const NewUserPage = (props = {}) => {
  

    const defaultColor = "#77777750";
    const enableColor = "#FFFFFF";
    
    const newEmail = props.newEmail;
    const refID = props.refCode;

    const callback = props.createUser;

    const socket = props.socket;

    const [name, setName] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [pass, setPass] = useState("");


    const [enabled, setEnabled] = React.useState(true);
  


    const [nameAvailable, setNameAvailable] = useState(true);




    function handleChange(e) {
        const { name, value } = e.target;

        if (name == "name") {
            if (value.length > 2) {
                socket.emit("checkUserName", value, (callback) => {
                    if (callback) {
                        setName(value)
                        setNameAvailable(pre => true);
                    } else {
                        setName("")
                        setNameAvailable(pre => false);
                    }
                })
            } else {
                setName("")
            }
           
        } 
        if (name == "pass") setPass(prev =>value);
        if (name == "confirm") setConfirm(prev =>value);

    }



    function handleSubmit(e) {
        e.preventDefault();
        setEnabled(false);
        var shapass = sha256(pass).toString();

        callback({ userName: name, userPass: shapass, userEmail: newEmail })
        

        
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

            fontSize: "50px",
            textAlign: "center",
            fontFamily: "Webpapyrus",
            textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffff60",
            fontWeight: "bolder",
            color: "#cdd4da",


        }} > Welcome</div>
        <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 5, marginBottom: 5 }}>&nbsp;</div>
  
              
  
        <div style={{ paddingTop: '60px' }}>
            <div style={{
                
                fontSize: "20px",
                textAlign: "center",
                fontFamily: "Webpapyrus",
           
                fontWeight: "bold",
                color: "#99999a",
               

            }} >Account Information</div>
            <div style={{ height: 5, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>
           
            <div>
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

                    <input name="name" placeholder="User name" autoFocus onChange={event => handleChange(event)} 
                        style={{
                            outline: 0,
                            border: 0,
                            color: "white",
                            width: 600, textAlign: "center", fontSize: "20px", backgroundColor: "black", fontFamily: "WebPapyrus"

                        }}
                    />
                    <div style={{display:nameAvailable ? "none" : "block"}} className={styles.disclaimer}>Name not available</div>
                </div>
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

                <input style={{
                    outline: 0,
                    border: 0,
                    color: "white",
                    width: 400, textAlign: "center", fontSize: "15px", backgroundColor: "black", fontFamily: "WebPapyrus"

                }} name="pass" placeholder="Password" type="password" onChange={event => handleChange(event)} />
                        <div style={{ display: (pass.length < 8 && confirm.length > 1) ? "block" : "none"  }} className={styles.disclaimer}>Password must be at least 8 characters.</div>
                </div>
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
                <input name="confirm" style={{
                    outline: 0,
                    border: 0,
                    color: "white",
                    width: 400, textAlign: "center", fontSize: "15px", backgroundColor: "black", fontFamily: "WebPapyrus"

                }} placeholder="Re-enter password" type="password" onChange={event => handleChange(event)} />
                        <div style={{ display: ((confirm.length > 7) && (confirm != pass)) ? "block" : "none"  }} className={styles.disclaimer}>Passwords must match</div>
                </div>
            </div>

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
                    cursor: (name.length > 2 && pass.length > 7 && confirm == pass && refID > 0) ? "pointer" : "default",
                    fontFamily: "WebPapyrus",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    width: 100,
                    color: (name.length > 2 && pass.length > 7 && confirm == pass && refID > 0) ? enableColor : defaultColor,
                    paddingLeft: "0px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                }}
                    class={(name.length > 2 && pass.length > 7 && confirm == pass && refID > 0) ? styles.OKButton : ""}

                > Confirm </div>
            </div>

          
  

        </div>

    </div>
 
)
}

export default NewUserPage;
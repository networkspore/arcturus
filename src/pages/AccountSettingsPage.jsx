import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import useZust from "../hooks/useZust";

import { CreateReferalCode } from "./CreateReferalCode";
import styles from './css/home.module.css'

export const AccountSettingsPage = (props = {}) => {

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)

    const [profileInfo, setProfileInfo] = useState(null);
    const nav = useNavigate();

    const [showIndex, setShowIndex] = useState(0);

    useEffect(() => {
      

    }, [])


    function onCancelClick(e) {
        props.cancel();
    }

    function onOKclick(e) {

    }


    return (

        <>
            {showIndex == 0 &&
                <div id='Profile' style={{
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
                        Account Settings
                    </div>
                    <div style={{ paddingLeft: "15px", display: "flex", height: "430px", }}>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 200, padding: "10px" }}>
                           
                        
                        </div>
                        <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", width: 530 }}>
                            <div style={{ width: "100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                                <div style={{
                                    width: "300px",
                                    fontFamily: "Webrockwell",
                                    color: "#cdd4da",
                                    fontSize: "18px",
                                }}>
                                    
                                    <div style={{ height: "20px" }}></div>
                                    <div style={{ display: "flex", paddingTop: "20px" }} >
                                        <div> <input value={'Click to change...'} type={"text"} style={{ cursor: "pointer", width: 200, height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                                        <div style={{ paddingLeft: "20px" }} > Password </div>
                                    </div>
                                    <div style={{ height: "20px" }}></div>
                                    <div style={{ display: "flex", paddingTop: "20px" }} >
                                        <div> <input type={"text"} value={"Click to verify..."} style={{ cursor: "pointer", width: 200, height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                                        <div style={{ paddingLeft: "20px" }} > Email</div>
                                    </div>
                                    <div style={{ height: "20px" }}></div>

                                    <div style={{ display: "flex", paddingTop: "20px" }} >
                                        <div> <input type={"text"} style={{ width: 200, height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                                        <div style={{ paddingLeft: "20px", color: " #777777" }} > Modified </div>
                                    </div>
                                    <div style={{ height: "20px" }}></div>
                                </div>
                            </div>
                            <div style={{
                                justifyContent: "center",

                                paddingTop: "10px",
                                display: "flex",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                <div className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

                                <div style={{

                                    marginLeft: "20px", marginRight: "20px",
                                    height: "50px",
                                    width: "1px",
                                    backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                }}></div>
                                <div className={styles.OKButton} onClick={onOKclick} >OK</div>
                            </div>
                        </div>

                    </div>
                </div>
            }
            {showIndex == 1 &&
                <CreateReferalCode back={() => {

                    setShowIndex(0)
                }} />
            }

        </>
    )
}



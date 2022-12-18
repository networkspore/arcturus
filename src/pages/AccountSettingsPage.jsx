import React, { useState, useEffect } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import useZust from "../hooks/useZust";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { ChangeEmailPage } from "./ChangeEmailPage";
import { ImageDiv } from "./components/UI/ImageDiv";

import { CreateReferalCode } from "./CreateReferalCode";
import styles from './css/home.module.css'
import { access } from "../constants/constants";
import { ChangeAccessPage } from "./ChangeAccessPage";

export const AccountSettingsPage = (props = {}) => {

    const pageSize = useZust((state) => state.pageSize)

    const user = useZust((state) => state.user)

    const [showIndex, setShowIndex] = useState(0);
    const [userAccess, setUserAccess] = useState("")

    useEffect(() => {
       if(user!=null && user.userID != null){
            switch(user.accessID)
            {
                case access.private:
                    setUserAccess("Private")
                    break;
                case access.contacts:
                    setUserAccess("Contacts")
                    break;
                case access.public:
                    setUserAccess("Public")
                    break;

            }
        }
    }, [user])


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
                        Account
                    </div>
                    <div style={{ paddingLeft: "15px", display: "flex", height: "430px", }}>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 200, padding: "10px" }}>
                            <ImageDiv width={150} height={150} about={"Account"}  netImage={{
                                scale: 1,
                                image: "/Images/icons/id-card-outline.svg",
                               
                                backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                                filter:"invert(100%)"
                            }} />
                        
                        </div>
                        <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", width: 530 }}>
                            <div style={{ width: "100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                                <div style={{
                                    width: "300px",
                                    fontFamily: "Webrockwell",
                                    color: "#cdd4da",
                                    fontSize: "18px",
                                    paddingBottom:80,
                                    paddingTop:60
                                }}>
                                    
                                    <div style={{ height: "20px" }}></div>
                                    <div style={{ display: "flex", paddingTop: "20px" }} >
                                        <div onClick={(e)=>{setShowIndex(2)}} style={{
                                            display:"flex",
                                            alignItems:"center",
                                            justifyContent:"center",
                                            fontSize:14, cursor: "pointer", width: 200, height: "25px",  border: "0px", color: "#777171", backgroundColor: "black" }} > 
                                            Click to change...
                                        </div>
                                        <div style={{ paddingLeft: "20px" }} onDoubleClick={(e)=>{
                                                setShowIndex(1)
                                            }} 
                                        > Password </div>
                                    </div>
                                    <div style={{ height: "20px" }}></div>
                                    <div style={{ display: "flex", paddingTop: "20px" }} >
                                        <div onClick={(e)=>{
                                            setShowIndex(3)
                                        }} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 14, cursor: "pointer", width: 200, height: "25px", border: "0px", color: "#777171", backgroundColor: "black",
                                            flexDirection:"column",
                                            whiteSpace:"nowrap"
                                        }} >
                                            <div>{user.userEmail.length < 23 ? user.userEmail : user.userEmail.slice(0,21) + "..."}</div>
                                       
                                        </div> 
                                        <div style={{ paddingLeft: "20px" }} > Email</div>
                                    </div>
                                    <div style={{ height: "20px" }}></div>
                                    <div style={{ display: "flex", paddingTop: "20px" }} >
                                        <div onClick={(e) => {
                                            setShowIndex(4)
                                        }} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 14, cursor: "pointer", width: 200, height: "25px", border: "0px", color: "#777171", backgroundColor: "black",
                                            flexDirection: "column",
                                                whiteSpace: "nowrap"
                                            }} >
                                            <div>{userAccess}</div>
                                           
                                        </div> 
                                        
                                       <div style={{ paddingLeft: "20px", whiteSpace:"nowrap" }} > Access </div>
                                        </div>
                                       
                                    </div>

                                    
                                    <div style={{ height: "20px" }}></div>
                                </div>
                                <div style={{
                                    justifyContent: "center",

                                    paddingTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%"
                                }}>
                                    <div style={{height:40, width: 90}} className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

                                    <div style={{

                                        marginLeft: "20px", marginRight: "20px",
                                        height: "50px",
                                        width: "1px",
                                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                    }}></div>
                                    <div style={{height:40, width:80}} className={styles.OKButton} onClick={onOKclick} >OK</div>
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
            {
                showIndex == 2 &&
                <ChangePasswordPage back={()=>{setShowIndex(0)}} />
            }
            {
                showIndex == 3 &&
                <ChangeEmailPage back={() => { setShowIndex(0) }} />
            }
            {
                showIndex == 4 &&
                <ChangeAccessPage back={() => { setShowIndex(0)}} />
            }
        </>
    )
}



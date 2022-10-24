import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './css/home.module.css';
import produce from 'immer';

import { ContactsPage } from './ContactsPage';
import { ProfilePage } from './ProfilePage';
import { ImageDiv } from './components/UI/ImageDiv';
import { LocalStoragePage } from './LocalStoragePage';
import { AccountSettingsPage } from './AccountSettingsPage';






export const HomePage = (props ={}) => {

    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const [showIndex, setshowIndex] = useState(0)
    const nav = useNavigate();
    const setUser = useZust((state) => state.setUser)

    const connected =  useZust((state) => state.connected)

    const location = useLocation();

    const [profile, setProfile] = useState({
        name:"Offline", 
        image:{}
    });


    const onLogoutClick = (e) => {
        props.logOut();
    
    }


    useEffect(()=>{
        props.getProfile((value) => {
            setProfile(value)
        })        
    },[])

    useEffect(()=>{
        const currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)
        
        if(subLocation != ""){
            const thirdSlash = subLocation.indexOf("/", 1)
            
            const subDirectory = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)
            console.log(subDirectory)
            switch(subDirectory)
            {
                case "/localstorage":
                    setshowIndex(2)
                break;
            }
        }
        
    },[location])


    return (
        
       <>
            
            <div style={{ position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
                <div style={{
                    padding: "10px",
                    textAlign: "center",
                 
                }}></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems:"center",  height:"150px", padding:"10px"}}>
                    <ImageDiv netImage={profile.image} />
                    <div style={{ paddingTop:5, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                        <div style={{

                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "15px",
                            fontWeight: "bolder",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",

                        }} >{ profile.name }</div>

                    </div>

                    <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                </div>
                        
                <div style={{ width: 260, paddingLeft:"15px" }}>
                    
                   
                        <NavLink to={"/home/localstorage"}>
                    <div className={styles.result} style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}>

                        <div>
                            <img style={{ filter: "invert(100%)" }} src="/Images/icons/server-outline.svg" width={20} height={20} />
                        </div>
                        <div style={{ paddingLeft: "10px" }} >
                            Local Storage
                        </div>
                    </div>
                    </NavLink>
                        {connected &&                        <div className={styles.result} style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
                            onClick={(e)=>{
                                setshowIndex(4)
                            }}
                            >
                           
                           <div>
                                <img style={{ filter: "invert(100%)" }} src="/Images/icons/id-card-outline.svg" width={20} height={20} />
                            </div>
                            <div style={{ paddingLeft: "10px" }} >
                                Account Settings
                            </div>
                        </div>
                     
                    }

                    
                  
                </div>
               

            </div>
       
            <div style={{ 
                backgroundImage: "linear-gradient(to right,#00000010 5%, #10131470 10%, #80808000 100%)",
                position: "fixed", 
                width:60, 
                left: 335, 
                bottom: "0px", 
                fontFamily:"Webpapyrus",
                display: "flex", justifyContent:"center"
                 }}>
                

                    <NavLink style={{width:"100%"}} to={"/"}  className={styles.menu__item} about={"Log-out"} onClick={onLogoutClick}>
                            <div style={{height:"70px",display:"flex", justifyItems:"center", alignItems:"center"}}>
                                <div>
                            <ImageDiv netImage={{ backgroundColor:"", image: "/Images/icons/lock-open-outline.svg", width: 25, height: 25, filter: "invert(100%)"}} width={40} height={40}  />
                                </div>
                               
                            </div>
                    </NavLink>

            </div>
        

            {showIndex == 2 &&
               <LocalStoragePage />
            }
            
            {showIndex == 3 &&
                <ContactsPage />
            }
            {showIndex == 4 &&
                <AccountSettingsPage cancel={() => { setshowIndex(0) }}  />
            }
       </>
        
    )
}

/* <div className={styles.result} style={{ display: "flex", fontSize: "15px", fontFamily: "WebPapyrus" }}
                        onClick={(e) => {
                            setshowIndex(1)
                        }}
                    >

                        <div>
                            <img style={{ filter: "invert(100%)" }} src="Images/icons/person-circle-outline.svg" width={20} height={20} />
                        </div>
                        <div style={{ paddingLeft: "10px" }} >
                           Profile
                        </div>
                    </div>*/
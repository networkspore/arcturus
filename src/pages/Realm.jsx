import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RealmGateway } from "./RealmGateway";

import styles from "./css/home.module.css"
import useZust from "../hooks/useZust";
import { RealmGamePage } from "./RealmGamePage";


export const Realm = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [showIndex, setShowIndex] = useState(0)
    const [navState, setNavState] = useState(null)
    const [subDirectory, setSubDirectory] = useState("")
    const [currentRealm, setCurrentRealm] = useState(null)

    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
    const setPage = useZust((state) => state.setPage)

    useEffect(() => {
        const currentLocation = location.pathname;

       
        switch (currentLocation) {
            case "/realm/disabled":
                setShowIndex(-1);
                break;
            case "/realm/gateway":
                if (location.state != undefined && location.state.realm != undefined && location.state.realm != null){
                
                    setCurrentRealm(location.state.realm)
                    setShowIndex(0);
                
                }
                break;
            case "/realm":
                if (location.state != undefined && location.state.realm != undefined && location.state.realm != null) {

                    setCurrentRealm(location.state.realm)
                    setShowIndex(1);
                    setPage(null)
                }
                break;
        }
       
    }, [location])

    useEffect(()=>{
        if(configFile.value != null)
        {
            if(configFile.value.peer2peer == false)
            {
                navigate("/realm/disabled")
            }
        }else{
            navigate("/realm/disabled")
        }
    },[configFile])


    return (
        <>
        {showIndex == -1 &&

            <div style={{
                position: "fixed",
                backgroundColor: "rgba(0,3,4,.95)",

                left: (pageSize.width / 2),
                top: (pageSize.height / 2),
                transform: "translate(-50%,-50%)",
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            }}>
                <div style={{

                    textAlign: "center",
                    width: "100%",
                    paddingTop: "10px",
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    backgroundImage: "linear-gradient(#131514, #000304EE )",
                }}>
                    Realms
                </div>
                <div style={{ fontFamily: "webrockwell", color: "white", padding: 40, fontSize: 16, textAlign: "center" }}>
                    Realms require the peer-to-peer network to be enabled.
                </div>
                <div style={{ fontFamily: "webrockwell", color: "#BBBBBB", paddingBottom: 30, fontSize: 13, textAlign: "center" }}>
                    Would you like to enable peer-to-peer?
                </div>
                <div style={{
                    justifyContent: "center",

                    paddingTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={(e) => { navigate("/network") }}>No</div>

                    <div style={{

                        marginLeft: "10px", marginRight: "10px",
                        height: "50px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}>

                    </div>
                    <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={(e) => { navigate("/home/localstorage/init") }} >Yes</div>
                </div>
            </div>
        }
            
        {
            showIndex == 0 &&
            <RealmGateway currentRealm={currentRealm}/>
        }

        {showIndex == 1 &&
                < RealmGamePage currentRealm={currentRealm} />
        }
        </>
    )
}
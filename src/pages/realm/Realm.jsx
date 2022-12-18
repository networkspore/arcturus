import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RealmGateway } from "./RealmGateway";

import styles from "../css/home.module.css"
import { Canvas } from "@react-three/fiber";
import useZust from "../../hooks/useZust";
import { errorRealmEnter, noGatewayEnter} from "../../constants/systemMessages";


export const Realm = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState("/realm/gateway")
    const [showIndex, setShowIndex] = useState(0)
    const currentRealmID = useZust((state) => state.currentRealmID)
    const setSocketCmd = useZust((state) => state.setSocketCmd)    

    const [admin, setAdmin] = useState(false)
    const [realmMember, setRealmMember] = useState(false)
    const [inRealm, setInRealm] = useState(false)
    const [realmUsers, setRealmUsers] = useState([])
    const [gatewayUsers, setGatewayUsers] = useState([])
    const [gatewayMessages, setGatewayMessages] = useState([])
    


    const user = useZust((state) => state.user)
    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
    const setPage = useZust((state) => state.setPage)
    const realms = useZust((state) => state.realms)
    const addSystemMessage = useZust((state) => state.addSystemMessage)
    const addFileRequest = useZust((state) => state.addFileRequest)

    const [currentRealm, setCurrentRealm] = useState({
        realmID: null,
        realmName: "",
        userID: null,
        roomID: null,
        realmPage: null,
        realmIndex: null,
        statusID: null,
        accessID: null,
        realmDescription: null,
        advisoryID: null,
        image: null,
        config: null,
        realmType: null,
    })
 
   
   

    useEffect(() =>{
        setCurrentRealm({
            realmID: null,
            realmName: "",
            userID: null,
            roomID: null,
            realmPage: null,
            realmIndex: null,
            statusID: null,
            accessID: null,
            realmDescription: null,
            advisoryID: null,
            image: null,
            config: null,
            realmType: null,
        })
        if(currentRealmID != null)
        {
            console.log("enteredRealm")
           
            setSocketCmd({
                cmd: "enterRealmGateway", params: { realmID: currentRealmID }, callback: (enteredGateway) => {
               
                if ("error" in enteredGateway)
                {
                    addSystemMessage(errorRealmEnter)
                }else{
                    if (enteredGateway.success){

                        setAdmin(enteredGateway.admin)
                        setGatewayUsers(enteredGateway.gatewayUsers) 
                        setRealmUsers(enteredGateway.realmUsers)
                        setGatewayMessages(enteredGateway.gatewayMessages)
                        setRealmMember(enteredGateway.realmMember)

                        const index = realms.findIndex(realm => realm.realmID == currentRealmID)

                        setCurrentRealm(realms[index])
                    }else{
                        addSystemMessage(noGatewayEnter)
                    }
                }
                
            }})
        }
      
    },[currentRealmID,realms])

    useEffect(() => {
        const cL = location.pathname;

        const secondSlash = cL.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : cL.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

      
        switch (sD) {
            case "/disabled":
                setShowIndex(-1)
                break;
            case "/gateway":
                setShowIndex(0)
                break;
            default:
                if (cL == "/realm"){
                    setShowIndex(1);
                    setPage(null)
                }
                break;
        }

        setCurrentLocation(cL)

    }, [location])


/*
    useEffect(()=>{
        if(realmID.current.value != null)
        {
            const index = realms.findIndex(r => r.realmID == realmID)
            setCurrentRealm(realms[index])
        }
    },[realms])
*/
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
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                left: (pageSize.width / 2),
                top: (pageSize.height / 2),
                transform: "translate(-50%,-50%)",
              
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
                    <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={(e) => { navigate("/contacts") }}>No</div>

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
            
        {showIndex == 0 && currentRealm.realmID != null &&
            <RealmGateway 
                admin={admin} 
                currentRealm={currentRealm} 
                currentLocation={currentLocation}
                realmUsers={realmUsers}
                gatewayUsers={gatewayUsers}
                messages={gatewayMessages}
                realmMember={realmMember}
            />
        }

        {showIndex == 1 &&
                 currentRealmID != null &&
                <>
                    <div style={{ width: "100%", height: "100%", display: page == null && realmScene != null ? "block" : "none" }}>
                        {page == null && realmScene != null &&
                            <Suspense fallback={LoadingPage}>
                                <Canvas linear flat shadows mode="concurrent"
                                    performance={{ min: 0.8, debounce: 200 }} camera={{
                                        fov: 90,
                                        near: 1,
                                        far: 1000.0,
                                        position: [0, 15, 0]
                                    }}>
                                    <TableTop
                                        admin={admin}
                                        ref={tableTopRef}
                                    />
                                </Canvas>
                            </Suspense>

                        }
                    </div>
                    {admin &&
                        <div style={{
                            position: "fixed", display: "flex", flexDirection: "column",
                            left: "50%", bottom: 0,
                            width: 800,
                            transform: "translateX(-50%)",
                                            backgroundColor: "rgba(0,3,4,.95)",
                        boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                        }}>
                            <RealmEditor />
                        </div>
                    }
                </>
            
        }
        </>
    )
}
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { LoadingPage } from "../LoadingPage";
import TableTop from "./components/TableTop";
import { RealmEditor } from "./realm/RealmEditor";


export const RealmGamePage = (props = {}) =>{
    
    const location = useLocation()
    const navigate = useNavigate()
    const setPage = useZust((state) => state.setPage)
    const page = useZust((state) => state.page)
    const user = useZust((state) => state.user)
    const [currentRealm, setCurrentRealm] = useState(null)
    const [realmScene, setRealmScene] = useState(null)
    const [admin, setAdmin] = useState(false)

    const tableTopRef = useRef()

    useEffect(()=>{

        if("currentRealm" in props)
        {
            setCurrentRealm(props.currentRealm)
        }
    },[props])

    useEffect(() => {
        if (currentRealm != null) {
            setAdmin(user.userID == currentRealm.userID)

        }
    }, [user, currentRealm])

    useEffect(()=>{
        if(realmScene == null)
        {
            setPage(0)
        }
    },[realmScene])
    
    return (
        <>
        {currentRealm != null &&
            <>
                <div style={{ width:"100%", height:"100%", display: page == null && realmScene != null ? "block" : "none" }}>
                    {page == null && realmScene != null &&
                        <Suspense fallback={LoadingPage}>
                           <Canvas linear flat shadows mode="concurrent"
                                performance={{ min: 0.8, debounce: 200 }}  camera={{
                                    fov: 90,
                                    near: 1,
                                    far: 1000.0,
                                    position: [0, 15, 0]
                                }}>
                                <TableTop
                                    admin={admin}
                                    currentRealm={currentRealm}
                                    ref={tableTopRef}
                                />
                            </Canvas>
                        </Suspense>

                    }
                </div>
                {admin &&
                <div style={{
                    position: "fixed", display: "flex", flexDirection:"column",
                    left: "50%", bottom: 0,
                    width: 800, backgroundColor: "rgba(10,12,16,.5)",
                    transform:"translateX(-50%)"
                }}>
                    <RealmEditor currentRealm={currentRealm} />
                </div>
                 }
            </>
        }
        </>
    )
}
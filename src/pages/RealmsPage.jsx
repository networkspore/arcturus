import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { RealmCreatePage } from "./RealmCreatePage";
import BubbleList from "./components/UI/BubbleList";
import styles from "./css/home.module.css"
import { ImageDiv } from "./components/UI/ImageDiv";


export const RealmsPage = () =>{

    const navigate = useNavigate();
    const location = useLocation();
    const pageSize = useZust((state) => state.pageSize)

    const [showIndex, setShowIndex] = useState(0)
    const [subDirectory, setSubDirectory] = useState("")

    const [selectedRealm, setSelectedRealm] = useState(null)

    useEffect(() => {
        const currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

        setSubDirectory(sD)

        switch (sD) {
            case "/create":
                setShowIndex(1)
                break;
            default:
                setShowIndex(0)
                break;
        }
    },[location])

    const onRealmChange = (r) =>{
        setSelectedRealm(r)
    }
   
    return (
        <>
        {showIndex == 0 &&
        <div style={{
            position: "fixed",
            width: pageSize.width - 95,
            height: pageSize.height,
            left: 95,
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            justifyContent:"center"
        }}>
          
             
            <div style={{
             
                textAlign: "center",
                width: "100%",
                paddingTop: "15px",
                paddingBottom:"5px",
                fontFamily: "Webpapyrus",
                fontSize: "20px",
                fontWeight: "bolder",
                color: "#cdd4da",
                        textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
                       
                    

            }}>
                Realms
            </div>
                    <div style={{ height: 1, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 2, marginBottom: 5 }}>&nbsp;</div>
                    <div style={{ height: 20 }}></div>
                    {selectedRealm != null &&
                    <>
                        <div style={{display:"flex", alignItems:"left",  width:"100%"}}>
                            <div style={{width:"5%", paddingRight:10}}></div>
                            <div className={styles.InactiveIcon} style={{display:"flex"}}>
                                <div style={{width:5}}></div>
                                    <ImageDiv width={30} height={30} netImage={{  image:"/Images/icons/add-circle-outline.svg", filter:"invert(100%)"}}/>
                                <div  onClick={(e) => { navigate("/realms/create") }} style={{ fontSize: 20,  fontFamily: "WebPapyrus", padding: 10, cursor: "pointer" }}>
                                    Create Realm
                                </div>
                            </div>
                        </div>
                   
                        </>
                    }
                    {selectedRealm === null &&
                    <>
                        <div style={{height:60}}>&nbsp;</div>
                     
                    </>
                    }
                    
        
            <div style={{width:"100%", display:"flex",height:"100%"}}>
                
                <BubbleList onChange={onRealmChange}
                            defaultItem={{ netImage:{image: "/Images/realm.png"} }}
                    
                />
            </div>
           
        </div>
        }
        { showIndex == 1 &&
            <RealmCreatePage />
        }
       
        </>
    )
}
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useZust from "../../hooks/useZust";
import FileList from "../components/UI/FileList";
import { ImageDiv } from "../components/UI/ImageDiv";
import { EditRealmCharacters } from "./EditRealmCharacters";
import styles from "../css/home.module.css"
import SelectBox from "../components/UI/SelectBox";

export const RealmAssets = (props ={}) =>{
    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
    const localDirectory = useZust((state) => state.localDirectory)

    const searchInputRef = useRef()
    
   
    const [directoryOptions, setDirectoryOptions] = useState([])

    const [currentRealm, setCurrentRealm] = useState(null)
    const [subDirectory, setSubDirectory] = useState("")

    const [showIndex, setShowIndex] = useState(null)

    useEffect(()=>{
        console.log(props.currentRealm)
        if(props.currentRealm != undefined){
            setCurrentRealm(props.currentRealm)
        }
    }, [props.currentRealm])

    useEffect(() => {


        const currentLocation = props.currentLocation + ""
        const directory = "/realm/gateway/assets";

        if (currentLocation != directory) {
            const thirdSlash = currentLocation.indexOf("/", directory.length)

            const fourthSlash = currentLocation.indexOf("/", directory.length + 2)

            const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash, fourthSlash == -1 ? undefined : fourthSlash) : "";
           // setSubDirectory(l)
          //  console.log(subDirectory)

            if (props.admin) {
                switch (l) {
                    case "/pcs":
                        setShowIndex(1)
                        break;
                   
                }
            }
        } else {

            setSubDirectory("")
            setShowIndex(-1)
        }

    }, [props.currentLocation, props.admin])

    const directoryChanged = (changed) =>{

    }

    const handleChange = (e) =>{

    }

    return ( 
        <>
        {currentRealm != null &&
        <div style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.9)",
            width: pageSize.width - 410,
            height: pageSize.height,
            left: 410,
            top: 0,
            display: "flex",
            flexDirection: "column",

        }}>
            <div style={{
                paddingBottom: "10px",
                textAlign: "center",
                width: "100%",
                paddingTop: "18px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",

            }}>
                Assets
            </div>
            <div style={{
                display: "flex",
                height: "50px",
                backgroundColor: "#66666650",

                alignItems: "center",
                marginLeft: "10px",
                marginRight: "10px",
                paddingLeft: "10px"
            }}>



                <div style={{
                    display: "flex",
                    flex: 1,
                    cursor: "pointer",
                    fontFamily: "Webrockwell",
                    fontSize: "14px",
                }}>
                    <div onClick={(e) => {

                       // pickAssetDirectory()

                    }} style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "30px",
                        backgroundImage: "linear-gradient(to right, #00000050,#11111150,#00000050)",
                        marginLeft: "10px",

                        height:30
                    }}>
                        <div style={{
                            paddingLeft: "15px",
                         
                            paddingRight: "5px"
                        }}>
                            <div style={{cursor:"pointer"}} onClick={(e) => {

                            }}>
                            <ImageDiv width={20} height={20}  netImage={{
                                scale: 1,
                                update: {
                                    command: "getImage",
                                    file: currentRealm.image,
                                    waiting: { url: "/Images/spinning.gif" },
                                    error: { url: "/Images/cloud-offline-outline.svg", style: { filter: "invert(70%)" } },

                                },
                                backgroundColor: "#44444450",
                                backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                            }} /></div>
                        </div>
                     
                        <div style={{ color: "#cdd4da", }}>
                            fsa://
                        </div>
                    
                        <div style={{ flex: 1 }}>
                            <div style={{

                                paddingLeft: "2px",
                                width: "100%",
                                height: "18px",
                                textAlign: "left",
                                border: "0px",
                                color: localDirectory.name == "" ? "#777777" : "#cdd4da",
                                backgroundColor: "#00000000",


                            }}>
                                {localDirectory.name + "/realm/" + currentRealm.realmName}{subDirectory}
                            </div>

                        </div>
                        <div style={{ width: 20 }}>&nbsp;</div>

                    </div>
                </div>
              
                <div style={{ width: 20 }}></div>
                <div style={{
                    height: 30,

                    display: "flex", justifyContent: "right", borderRadius: "30px",
                }}>
                    <div style={{ margin: 3, backgroundColor: "#33333320", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <input ref={searchInputRef} name={"imageSearch"} onChange={handleChange} style={{
                            color: "white",
                            backgroundColor: "#33333300",
                            fontFamily: "webpapyrus",
                            fontSize: 12,
                            width: 200,
                            outline: 0,
                            border: 0
                        }} type={"text"} />
                    </div>
                    <div style={{ width: 100, margin: 3 }}>
                        <SelectBox onChange={directoryChanged} textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={directoryOptions} />
                    </div>
                    <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer"
                    }}>
                        <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                    </div>
                </div>



                <div style={{ width: 20 }}>

                    {showIndex == 1 &&
                        <EditRealmCharacters currentRealm={currentRealm} />
                    }


                </div>

            </div>
        
        </div>
        }
        </>
    )
}
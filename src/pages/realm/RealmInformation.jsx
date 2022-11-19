import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useZust from "../../hooks/useZust";
import { ImageDiv } from "../components/UI/ImageDiv";
import SelectBox from "../components/UI/SelectBox";
import styles from "../css/home.module.css"


const RealmInformation = (props = {}) =>{

    const publishRef = useRef();
    const descriptionRef = useRef();
    const advisoryRef = useRef();
    const realmTypeRef = useRef();

    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
    const realms = useZust((state) => state.realms)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const currentRealm = useZust((state) => state.currentRealm)
    const className = styles.bubble__item;
    const activeClassName = styles.bubbleActive__item;


    const [admin, setAdmin] = useState(false)

    useEffect(()=>{
       setAdmin(props.Admin)
    },[props.admin])

  


    return(
    <div id='RealmInformation' style={{
        position: "fixed",
        backgroundColor: "rgba(0,3,4,.95)",
        width: 700,
        height: 700,
        left: ((pageSize.width + 360) / 2),
        top: (pageSize.height / 2),
        transform: "translate(-50%,-50%)",
        boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
    }}>
        <div style={{
            paddingBottom: 10,
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
            Information
        </div>
        <div style={{ margin: 30 }}>
            <div style={{ display: "flex", height: 150, }}>
                <ImageDiv
                    width={100}
                    height={100}
                    about={"Select Image"}
                    style={{ textShadow: "2px 2px 2px black", }}
                    className={className}
                    netImage={{
                        opacity: .3,
                        scale: .3,
                        backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
                        borderRadius: 40,
                        backgroundColor: "",
                        image: "/Images/icons/add-circle-outline.svg",
                        filter: "invert(60%)",
                    }}
                />
            </div>
            <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>
            <div style={{ height: "100%", paddingTop: 5, width: "100%", backgroundColor: "#33333330" }}>



                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                    <div style={{ width: 15 }} />
                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                        Game:
                    </div>
                    <div style={{ flex: .5 }}>
                       
                            <input
                                ref={realmTypeRef}
                                placeholder={"Game type..."}
                                type={"text"} style={{
                                    textAlign: "left",
                                    outline: 0,
                                    border: 0,
                                    color: "white",
                                    width: 200,
                                    fontSize: "14px",
                                    backgroundColor: "#00000060",
                                    fontFamily: "webrockwell",
                                    padding: 4,
                                }}
                            /> 

                    </div>

                </div>

                <div style={{ display: "flex", width: "100%", paddingTop: 15, }} >
                    <div style={{ width: 15 }} />
                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                        Membership:
                    </div>
                    <div style={{ flex: .5, color: "#ffffffA0", fontSize: 12 }}>
                        <SelectBox
                            ref={publishRef}
                            textStyle={{
                                padding: 4,
                                backgroundColor: "#00000060",
                                width: 200,
                                color: "#ffffff",
                                fontFamily: "Webrockwell",
                                border: 0,
                                fontSize: 14,
                            }}
                            optionsStyle={{

                                backgroundColor: "#333333C0",
                                paddingTop: 5,
                                fontSize: 14,
                                fontFamily: "webrockwell"
                            }}

                            placeholder="availability" options={[
                                { value: "0", label: "Closed" },
                                { value: "1", label: "Contacts Only" },
                                { value: "2", label: "Public" }
                            ]} />
                    </div>
                </div>
                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                    <div style={{ width: 15 }} />
                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                        Description:
                    </div>
                    <div style={{ flex: 1, color: "#ffffffA0", fontSize: 13 }}>
                        <textarea
                            cols={45}
                            rows={6}
                            placeholder="Write a description..."
                            style={{
                                resize: "none",
                                outline: 0,
                                width: "90%",
                                border: 0,
                                backgroundColor: "#00000060",
                                color: "white",
                                fontFamily: "Webrockwell"
                            }} ref={descriptionRef} />
                    </div>

                </div>


                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                    <div style={{ width: 15 }} />
                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                        Content Advisory:
                    </div>
                    <div style={{ flex: .5, color: "#ffffffA0", fontSize: 12 }}>
                        <SelectBox
                            ref={advisoryRef}
                            textStyle={{
                                color: "#ffffff",
                                fontFamily: "Webrockwell",
                                border: 0,
                                fontSize: 14,
                            }}

                            optionsStyle={{
                                backgroundColor: "#333333C0",
                                paddingTop: 5,
                                fontSize: 14,
                                fontFamily: "webrockwell"
                            }}

                            placeholder="advisory" options={[
                                { value: -1, label: "None" },
                                { value: 0, label: "General" },
                                { value: 1, label: "Mature" },
                                { value: 2, label: "Adult" }
                            ]} />

                    </div>
                </div>

                <div style={{ height: 10 }} />

            </div>



        </div>
    </div>
    )
}

export default RealmInformation
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useZust from "../hooks/useZust";
import { ContactsList } from "./components/UI/ContactsList";
import { ImageDiv } from "./components/UI/ImageDiv";
import SelectBox from "./components/UI/SelectBox";
import styles from "./css/home.module.css"

export const RealmGateway= (props = {}) =>{

    const publishRef = useRef();
    const descriptionRef = useRef();
    const advisoryRef = useRef();

    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
    const realms = useZust((state) => state.realms)
    const user = useZust((state) => state.user)

    const [currentRealm, setCurrentRealm] = useState(null)
    const [currentPublishing, setCurrentPublishing] = useState("PRIVATE")
    const [admin, setAdmin] = useState(false)
  
    const [showIndex, setShowIndex] = useState(0)

    const className = styles.bubble__item;
    const activeClassName =  styles.bubbleActive__item;

    const itemStyle = {
        borderRadius: 40,
        margin: "3%",
        overflow: "hidden",
        textShadow: "2px 2px 2px black",
        cursor: "pointer"
    }

    useEffect(()=>{
        if (props.currentRealm != undefined && props.currentRealm != null)
        {
            const realmID = props.currentRealm.realmID
            
            const index = realms.findIndex(r => r.realmID == realmID)

            const realm = index != -1 ? realms[index] : null ;

            if(realm != null){
                setCurrentRealm(realm)
            }else{
                navigate("/realms")
            }

          
        }
    },[props.currentRealm, realms])
    
    useEffect(()=>{
        if(currentRealm != null){
            setAdmin(user.userID == currentRealm.userID)

        }
    },[user, currentRealm])

    
    const onStartRealm = (e) =>{
        navigate("/realm", {state:{realm:currentRealm}})
    }


    return (
        <div style={{
            position: "fixed",
            width: pageSize.width - 95,
            height: pageSize.height,
            left: 95,
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <div style={{
                display:"flex",
    
                alignItems:"center",
                justifyContent:"center",
                width: pageSize.width - 105,
                paddingTop: "10px",
                paddingBottom: "5px",
                fontFamily: "Webpapyrus",
                fontSize: "20px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
            }}>
                Gateway
            </div>
            <div style={{ height: 1, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 2, marginBottom: 5 }}>&nbsp;</div>
            {currentRealm != null &&
            <div style={{
                position: "fixed",
                width: pageSize.width - 115,
                height: pageSize.height,
                left: 95,
                top: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>


            <div style={{
                backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
        
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                
            }}>
                <div style={{display:"flex", width:600}}>
                    <div style={{ display: "flex", flexDirection: "column",  alignItems: "center", justifyContent:"start",  }}>
                                {admin &&
                            <div style={{
                                borderTopLeftRadius:10, 
                                padding:3, 
                                backgroundImage: "linear-gradient(to right, #33333350 20%, #77777710 70%, #00030400)", 
                                display: "flex",  width:"100%", alignItems:"left", }}
                            >
                                
                                    <div style={{ paddingTop: 8, paddingLeft: 10, width: "100%", fontWeight: "bolder", color: "#ffffff90", fontFamily: "webpapyrus", fontSize: 18 }}>   Creator </div>
                                
                            </div>
                            }
                              
                                <ImageDiv style={{paddingLeft:15, paddingRight:15}} width={170} height={170} netImage={{
                                    image: currentRealm.image.icon,
                                    backgroundColor:"",
                                }} />

                               
                        {admin &&
                        <div style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
                            
                          
                            <div style={{

                                
                                fontWeight: "bold",
                            
                                fontSize: "14px",
                                fontFamily: "WebPapyrus",
                                color: "#cdd4da",
                                textShadow: "3px 3px 4px black",
                             
                                paddingBottom: "10px",

                            }}>
                                Members
                            </div>
                            <div style={{
                                marginBottom: '2px',

                                height: "1px",
                                width: "100%",
                                backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                            }}>&nbsp;</div>
                        </div>
                        }
                    </div>
                        
                            <div style={{ width: 750, display: "flex", flexDirection: "column", flex:1, alignItems:"flex-start", height:"100%"}}>
                                <div style={{
                                    
                                    width: "100%",
                                    textAlign: "center",
                                    fontFamily: "Webpapyrus",
                                    fontSize: "16px",
                                    fontWeight: "bolder",
                                    color: "white",
                                    textShadow: "2px 2px 2px #101314",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingTop:5,
                                    paddingBottom:5,
                                }} >
                                    {currentRealm.realmName}
                                   
                                </div>
                                <div style={{height:2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    &nbsp;
                                </div>
                                    <div style={{height:40}}>
                                   
                                    </div>
                                    <div style={{display:"flex", height:150, }}>
                                    <ImageDiv
                                        width={100}
                                        height={100}
                                        about={"Select Image"}
                                        style={{ textShadow: "2px 2px 2px black", }}
                                        className={className}
                                        netImage={{
                                            opacity:.3,
                                            scale: .3,
                                            backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
                                            borderRadius: 40,
                                            backgroundColor: "",
                                            image: "/Images/icons/add-circle-outline.svg",
                                            filter:"invert(60%)",
                                        }}
                                    />
                                    </div>
                                <div style={{

                                    textAlign:"center",
                                    fontWeight: "bold",
                                    width:"100%",
                                    fontSize: "14px",
                                    fontFamily: "WebPapyrus",
                                    color: "#888888",
                                    textShadow: "3px 3px 4px black",
                                    paddingTop: "10px",
                                    paddingBottom: "6px",

                                }}>
                                   Information
                                </div>
                                <div style={{

                                    marginTop: "5px",
                                    height: "1px",
                                    width: "100%",
                                    backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                                }} />
                                    <div style={{ height: "100%", paddingTop: 5, width: "100%", backgroundColor: "#33333330" }}>
                                       

                                        <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                            <div style={{width:15}}/>
                                            <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                               Visibility:
                                            </div>
                                            <div style={{ flex: .5 }}> 
                                                <SelectBox
                                                    ref={publishRef}
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

                                                    placeholder="visibility" options={[
                                                        { value: "none", label: "Private" },
                                                        { value: "contacts", label: "Contacts Only" },
                                                        { value: "public", label: "Public"}
                                                    ]} />
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
                                                        { value: "none", label: "General" },
                                                        { value: "mature", label: "Mature Themes" },
                                                        { value: "restricted", label: "Adult Content" }
                                                    ]} />

                                            </div>
                                        </div>
                                        <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                        <div style={{ width: 15 }} />
                                            <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                                Game:
                                            </div>
                                            <div style={{ flex: .5 }}>
                                                <input
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
                                                        paddingTop: 3,
                                                        paddingBottom: 3,
                                                    }}
                                                />
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
                                        <div style={{height:10}}/>
                                        
                                    </div>  
                                
                                
                        </div >
                           
                    </div>
                        <div style={{display:"flex", width:"100%"  }}>
                            <div style={{ width: 150, }} />
                            <div style={{ flex: 1, backgroundColor:"" }}>
                                <div style={{height:200}}>&nbsp;</div>
                                <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}> 
                                    <div style={{ width: 200, } } />
                                    <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={onStartRealm} >Start</div>
                                    <div style={{ width: 200, }} />
                                </div>
                            </div>
                           
                            <div style={{ width: 150, }} />
                            
                            
                        </div>
                        
                </div>
                
            </div>
            }
        </div>
    )
}
import produce from "immer";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { status } from "../../constants/constants"
import useZust from "../../hooks/useZust";
import { ContactsList } from "../components/UI/ContactsList";
import { ImageDiv } from "../components/UI/ImageDiv";
import SelectBox from "../components/UI/SelectBox";
import styles from "../css/home.module.css"
import RealmInformation from "./RealmInformation";

export const RealmGateway= (props = {}) =>{


    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)
    const realms = useZust((state) => state.realms)
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const currentRealm = useZust((state) => state.currentRealm)

    const [currentPublishing, setCurrentPublishing] = useState("PRIVATE")
    const [admin, setAdmin] = useState(false)

    const [subDirectory, setSubDirectory] = useState("")

    const [showIndex, setShowIndex] = useState(null)

    const className = styles.bubble__item;
    const activeClassName =  styles.bubbleActive__item;
    const prevQuickBar = useRef({ value: null })

    const [isQuickBar, setIsQuickBar] = useState(false)
    const quickBar = useZust((state) => state.quickBar)
    const setQuickBar = useZust((state) => state.setQuickBar)
    const quickBarAdd = (realm) => useZust.setState(produce((state) => {
        if (state.quickBar != null) {
            const length = state.quickBar.length

            if (length > 0) {
                const index = state.quickBar.findIndex(qbar => qbar.realmID == realm.realmID)
                if (index == -1) {
                    state.quickBar.splice(0, 0, realm)
                }
            }else{
                state.quickBar.push(realm)
            }
        }else{
            state.quickBar = [realm]
        }
    }))
    const quickBarRemove = (realmID) => useZust.setState(produce((state)=>{
        if(state.quickBar != null){
            const length = state.quickBar.length
            console.log(length)
            if(length > 0)
            {
                const index = state.quickBar.findIndex(qbar => qbar.realmID == realmID)
                console.log(index)
                if(index > -1){
                    
                    if(length == 1)
                    {
                        console.log("popping")
                       state.quickBar.pop()
                    }else{
                        console.log("splicing")
                        state.quickBar.splice(index, 1)
                    }   
                }
            }
        }
    }))

    const itemStyle = {
        borderRadius: 40,
        margin: "3%",
        overflow: "hidden",
        textShadow: "2px 2px 2px black",
        cursor: "pointer"
    }




    useEffect(() => {

        setAdmin(props.admin)

        const currentLocation = props.currentLocation
        const directory = "/realm/gateway";

        const thirdSlash = currentLocation.indexOf("/", directory.length)

        const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash) : "";
        setSubDirectory(l)

        console.log(l)
        switch (l) {
            case "/information":
                setShowIndex(0)
                break;
            case "/hall":
                setShowIndex(1)
                break;
            case "/pcs":
                setShowIndex(2);
                break;
            case "/nps":
                setShowIndex(3)
                break;
            case "/placeables":
                setShowIndex(4)
                break;
            case "/textures":
                setShowIndex(5)


        }
    }, [props])



    useEffect(() => {
        if (prevQuickBar.current.value == null) {
            prevQuickBar.current.value = true
        } else {

            const json = JSON.stringify(quickBar)
            if (json != null) {
                socket.emit("setQuickBar", json)
            }
        }

    }, [quickBar])

    useEffect(()=>{
        if (Array.isArray(quickBar)) {
            const index = quickBar.findIndex(qbar => qbar.realmID == currentRealm.realmID)

            setIsQuickBar(index > -1)
           
        }
    },[quickBar, currentRealm])
  
    
    const onStartRealm = (e) =>{
        navigate("/realm")
    }

    const onToggleQuickBar = (e) =>{
    
        const length = quickBar.length;

        if(length == 0)
        {
            setQuickBar([currentRealm])
        }else{
            const index = quickBar.findIndex(qb => qb.realmID == currentRealm.realmID)
           
            if(index == -1){
                quickBarAdd(currentRealm)
                
            }else{
                quickBarRemove(currentRealm.realmID)
            }
        }
       
    }




    return (
        <>
        <div style={{  position: "fixed", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710", backgroundColor: "rgba(10,13,14,.6)", width: 300, height: pageSize.height, left: 95, top: "0px" }}>
                <div style={{
                   width: "100%",
                   display:"flex",
                   justifyContent:"right"
                
                }}>
                    <ImageDiv style={{cursor:"pointer"}} onClick={onToggleQuickBar} width={30} height={30} netImage={{
                        image: isQuickBar ? "/Images/icons/star.svg" : "/Images/icons/star-outline.svg",
                        backgroundColor:"",
                        filter:"invert(100%)",
                        opacity:.5,
                        scale:.7
                }} />

                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems:"center",  height:"150px", padding:"10px"}}>
                    <ImageDiv about={"Select Image"} className={admin ? className : ""} netImage={{
                        image: "icon" in currentRealm.image ? currentRealm.image.icon : "/Images/spinning.gif",
                        backgroundColor: "#44444450",
                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                        width: 130,
                        height: 130,
                    }} />
 
                    <div style={{ marginTop:20, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                        <div style={{

                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "15px",
                            fontWeight: "bolder",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",

                        }} >{ currentRealm != null ? currentRealm.realmName : "loading..." }</div>

                    </div>

                    <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                </div>
                        
                <div style={{ paddingTop:35, width: 260, paddingLeft:"20px" }}>
                    <div onClick={(e)=>{navigate("/realm/gateway/information")}} className={styles.result} style={{ display: "flex", alignItems:"center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                        <ImageDiv netImage={{ filter: subDirectory == "/information" ? "invert(100%)" : "invert(50%)",backgroundColor:"", image:"/Images/icons/information-circle-outline.svg"}} width={25} height={25} />
                        
                        <div style={{ paddingLeft: "10px", color: subDirectory == "/information" ? "white" : "" }} >
                           Information
                        </div>
                    </div>
                    <div onClick={(e) => { navigate("/realm/gateway/hall") }} className={styles.result} style={{ display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                        <ImageDiv netImage={{ filter: subDirectory == "/hall" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/chatbubbles-outline.svg" }} width={25} height={25} />

                        <div style={{ paddingLeft: "10px", color:subDirectory == "/hall" ? "white" : "" }} >
                            Hall
                        </div>
                    </div>
                    {admin && <>
                    <div style={{
                            paddingTop:20,
                            textAlign: "center",
                            fontFamily: "WebRockwell",
                            fontSize: "14px",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",
                            paddingBottom:3,
                        }} >Creator</div>
                        <div style={{ height: 1, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>

                        <div style={{height:5}}>&nbsp;</div>
                        <div onClick={(e) => { navigate("/realm/gateway/pcs") }} className={styles.result} 
                        style={{ padding:5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/pcs" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/man-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/pcs" ? "white" : "" }} >
                                Playable Characters
                            </div>
                        </div>

                        <div onClick={(e) => { navigate("/realm/gateway/npcs") }} className={styles.result} 
                        style={{ 
                            padding:5,
                            display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/npcs" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/paw-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/npcs" ? "white" : "" }} >
                                Non-Playable Characters 
                            </div>
                        </div>

                        <div onClick={(e) => { navigate("/realm/gateway/placeables") }} className={styles.result} style={{
                            padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/placeables" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/cube-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/placeables" ? "white" : "" }} >
                                Placeable Models
                            </div>
                        </div>

                        <div onClick={(e) => { navigate("/realm/gateway/textures") }} className={styles.result} style={{
                            padding: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus" }}>
                            <ImageDiv netImage={{ filter: subDirectory == "/textures" ? "invert(100%)" : "invert(50%)", backgroundColor: "", image: "/Images/icons/images-outline.svg" }} width={25} height={25} />

                            <div style={{ paddingLeft: "10px", color: subDirectory == "/textures" ? "white" : "" }} >
                                Textures
                            </div>
                        </div>
                    </>}
                </div>
               

            </div>
            {showIndex == 0 &&
              <RealmInformation admin={admin}/>
            }
       </>
    )
}

/*
  
                   
                <div style={{display:"flex", }}>
                    
                        
                            <div style={{ width:"100%", display: "flex", flexDirection: "column", flex:1, alignItems:"flex-start", height:"100%"}}>
                                
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
                                                    padding:4,
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
                                   
                                        <div style={{height:10}}/>
                                    
                                    </div>  
                             
                                
                        </div >
                            
                    </div>

                       
                        <div style={{display:"flex", width:"100%"  }}>
                            <div style={{ width: 150, }} />
                            <div style={{ flex: 1, backgroundColor:"" }}>
                                <div style={{height:150}}>&nbsp;</div>
                               
                                <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}> 
                                    <div style={{ width: 200, } } />
                                    
                                    <ImageDiv width={120} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} onClick={onStartRealm} about="Enter" className={styles.bubble__item}  height={30} netImage={{backgroundColor:"",filter:"invert(60%)",image:"/Images/icons/earth-outline.svg"}}/>
                                   
                                    <div style={{ width: 200, }} />
                                </div>
                            </div>
                       
<div style={{ width: 150, }} >

</div>
                        </div >
                        */
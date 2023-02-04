import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import FileList from "./components/UI/FileList";
import BubbleList from "./components/UI/BubbleList";
import styles from "./css/home.module.css"
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";
import { AppsAdminPage } from "./AppsAdminPage";

import { AddAppPage } from "./AddAppPage";



export const AppsPage = () =>{
    const user = useZust((state) => state.user)
    const searchInputRef = useRef()
    const directoryOptionsRef = useRef()

    const bubbleRef = useRef()
    const navigate = useNavigate();
    const location = useLocation();
    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
  
    const [showIndex, setShowIndex] = useState(0)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const [showMenu, setShowMenu] = useState(false)
    
    const [fileListWidth, setFileListWidth] = useState(480)
    const [selectedApp, setSelectedApp] = useState(null)

    const [selectedItem, setSelectedItem] = useState(null)

    const [apps, setApps] = useState([])

    const [appItems, setAppItems] = useState([])

    const addApp = (app) => useZust.setState(produce((state)=>{
        const index = apps.findIndex(r => r.appIndex == app.appIndex)
        if(index == -1) state.apps.push(app)
    }))
    
    const addSystemMessage = useZust((state) => state.addSystemMessage)

    const addFileRequest = useZust((state) => state.addFileRequest)

    const [searchText, setSearchText] = useState("")

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name == "searchText") {
            setSearchText(value)
        }
    }



 
    useEffect(() => {
        const currentLocation = location.pathname;

       

        if (configFile.handle != null) {
            switch (currentLocation) {
                case "/apps/admin":
                    setShowIndex(10)
                    break;
                case "/apps/add":
                    setShowIndex(5)            
            
                    break;
                case "/apps":
                    setShowIndex(0)
                    break;
            }
        } else {
            setShowIndex(-1)
        }
    }, [location, configFile])

    const divRef = useRef()
    useEffect(()=>{
        if(divRef.current)
        {
           
            const offsetWidth = divRef.current.offsetWidth
            setFileListWidth(offsetWidth > 480 ? offsetWidth : 480)
        }else{
            setFileListWidth(480)
        }
    },[divRef.current, pageSize])
    

  
    const onAdd = (app, callback) => {

       
        setSocketCmd({
            cmd: "addUserApp", params: {app: app,page: selectedItem.page,index: selectedItem.index, }, callback: (response) => {

            if ("error" in response) {
                callback(false)

            } else if ("app" in response) {

                const app = response.app
                callback(true)

                addApp(app)
              
               

            }
        }})

    }


    const onfileSelected = (r) =>{
        setShowMenu(false)
        if(r != null && r.id > -1 )
        {
           const index = apps.findIndex(app => app.appID == r.id)
           const app = index > -1 ? apps[index] : null;

           
            setSelectedApp(app)
            
        }else{
            setSelectedApp(null)
        }
        setSelectedItem(r)
    }

    const onAddApp = (e) =>{
        setShowMenu(false)
        navigate("/apps/add", {state:{selectedItem:selectedItem}})
}
    const onDeleteApp = (e) =>{
        setShowMenu(false)
        setShowIndex(-2)
    }

    const removeApp = (appID) => useZust.setState(produce((state)=>{
        const length = state.apps.length;
        if(length != undefined && length > 0)
        {
            const index = apps.findIndex(app => app.appID == appID)

            
            state.apps.splice(index, 1)
            
        }
    }))

    const onDeleteAppYes = (e) =>{
      
        const appID = selectedApp.appID;
        if(appID == undefined || appID == null)
        {
            setShowIndex(0)
            navigate("/apps")
        }else{
            setShowIndex(0)
            setSocketCmd({
                cmd: "deleteApp", params: {appID: appID }, callback: (callback) => {
                if("error" in callback){
                    //addSystemMessage(errorAppEnd)
                }else{
                    if (callback.success) {
                        removeApp(appID)
                    }else{
                      //  addSystemMessage(errorAppEnd)
                    }
                    
                }
       
                setSelectedApp(null)
       
                setSelectedItem(null)
              //  navigate("/apps")
            }})
        }
        
    }
    const onNextPage = (e) =>{

    }
    const onPrevPage = (e) => {

    }

   
    return (
        <>
            {showIndex == -2 &&

                <div style={{
                    position: "fixed",
                    backgroundColor: "rgba(0,3,4,.95)",
                    width: 400,
                    left: (pageSize.width / 2),
                    top: (pageSize.height / 2),
                    transform: "translate(-50%,-50%)",
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                }}>
                    <div  style={{
                        cursor:"default",
                        display:"flex",
                        width: "100%",
                        paddingTop: "10px",
                        fontFamily: "WebRockwell",
                        fontSize: "18px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314",
                        backgroundImage: "linear-gradient(#131514, #000304EE )",
                    }}>
                       
                            
                        Apps
                    
                    </div>
                    
                    <div style={{ fontFamily: "webrockwell", color: "white", paddingBottom: 40, paddingRight: 40, paddingLeft: 40, fontSize: 16, textAlign: "center" }}>
                       Would you like to end this app?
                    </div>
                  
                    <div style={{
                        justifyContent: "center",

                        paddingTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={(e) => { navigate("/apps") }}>No</div>

                        <div style={{

                            marginLeft: "10px", marginRight: "10px",
                            height: "50px",
                            width: "1px",
                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                        }}>

                        </div>
                        <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={onEndAppYes} >Yes</div>
                    </div>
                </div>

            }
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
                    cursor:"default",
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
                    Apps
                </div>
                <div style={{ fontFamily: "webrockwell", color: "white", padding: 40, fontSize: 16, textAlign: "center" }}>
                    Apps require local storage to be enabled.
                </div>
                <div style={{ fontFamily: "webrockwell", color: "#BBBBBB", paddingBottom: 30, fontSize: 13, textAlign: "center" }}>
                    Would you like to enable local storage?
                </div>
                <div style={{
                    justifyContent: "center",

                    paddingTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={(e)=>{navigate("/")}}>No</div>

                    <div style={{

                        marginLeft: "10px", marginRight: "10px",
                        height: "50px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}>

                    </div>
                    <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={(e)=>{navigate("/home/localstorage")}} >Yes</div>
                </div>
            </div>
            
        }
        {showIndex == 0 &&
        <>
    
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
          
             
            <div 
                onClick={((e)=>{navigate("/apps/admin")})}
            style={{
                cursor:"default",
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
                Apps 
            </div>
                    <div style={{ height: 1, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 2, marginBottom: 5 }}>&nbsp;</div>
                    <div style={{ height: 20 }}></div>
                 
            <div style={{width:"90%", display:"flex",height:"calc(100vh-300)", flex:1, marginTop:30, flexDirection:"column"}}>
             
                        <div ref={divRef} className={styles.bubble}  style={{ display: "flex", cursor: "default", flexDirection: "column", backgroundImage: "linear-gradient(to bottom, #000000,#20232570)", flex:1}}>
                        <div style={{display:"flex", height:90, flex:1, flexDirection:"column", backgroundImage:"linear-gradient(to bottom,#ffffff10 0%, #000000EE 30%, #11111110 90%)",}}>
                            <div style={{height:30}}>&nbsp;</div>
                            <div style={{display:"flex", }}>
                                <div style={{width:20}}></div>
                                   
                                    <div className={styles.bubbleButton} onClick={(e) => { navigate("/apps/add") }} style={{
                                        height: 30,
                                        width:30,
                                        borderRadius: 15,
                                        marginTop:7,
                                        marginLeft:5
                                    }}>
                                        <ImageDiv about={"Add App"} className={styles.tooltipCenter__item} 
                                            width={35}
                                            height={35}
                                            netImage={{
                                                backgroundColor: "",
                                                image: "/Images/icons/add-outline.svg",
                                                filter: "drop-shadow(0px 0px 3px #cdd4da)"
                                            }}
                                        />

                                    </div>
                                <div style={{ display:"flex", flex:1, height:40, justifyContent:"center", alignItems:"center", marginTop:10}}>

                                        <div style={{ margin: 15, paddingTop:5, paddingBottom:5, paddingLeft:10, borderRadius:15, backgroundColor: "#33333350", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <input ref={searchInputRef} name={"searchText"} onChange={handleChange} style={{
                                                color: "white",
                                                backgroundColor: "#00000000",
                                                fontFamily: "webpapyrus",
                                                fontSize: 18,
                                                width: 350,
                                                outline: 0,
                                                border: 0
                                            }} type={"text"} />
                                        </div>
                                        
                                        <div about={"Search"} className={styles.tooltipCenter__item} onClick={(e) => { searchInputRef.current.focus() }} style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer",
                                            width:20, height:20,borderRadius:15
                                           
                                        }}>
                                            <ImageDiv width={30} height={30} style={{ filter: "drop-shadow(0px 0px 8px #cdd4da)" }} netImage={{ backgroundColor: "", filter: "invert(0%)", image: "/Images/icons/search.svg" }} />
                                        </div>
                                </div>
                                    <div style={{ width: 80 }}></div>
                                   
                                </div>
                        </div>
                      <div style={{maxHeight:pageSize.height - 300, overflowY:"scroll", marginLeft:30}}>
                                <FileList
                                    width={fileListWidth-50}
                                    fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100 } }}
                                    onChange={(e) => { }}
                                    filter={{ name: "", mimeType: "app", type: "" }}
                                />
                 
                        </div>
                    </div>
                       
            </div>
           <div style={{height:50}}></div>
        </div>
        </>
        }
            
            
       
        {showMenu && selectedApp != null && 
            <div  style={{backgroundColor:"black", display:"flex", flexDirection:"column", position:"fixed", left:135, top: 120, width:200, padding:5 }}>
                    <div className={styles.result} onClick={(e)=>{
                        setShowMenu(false)
                        } } style={{display:"flex", alignItems:"center", justifyContent:"left"}}>

                    <ImageDiv width={30} height={30} netImage={{ image: "/Images/enter-outline.png", filter: "invert(100%)" }} />
                    <div style={{paddingLeft:10}}>
                        Open
                    </div>
                </div>
                    <div className={styles.result} onClick={onDeleteApp} style={{ display: "flex", alignItems: "center", justifyContent: "left" }}>

                        <ImageDiv width={30} height={30} netImage={{ image: "/Images/icons/trash-outline.svg", filter: "invert(100%)" }} />
                        <div style={{ paddingLeft: 10 }}>
                            Delete
                        </div>
                    </div>
            </div>
        }
        {showIndex == 10 &&
            <AppsAdminPage />
        }
        {showIndex == 5 &&
            <AddAppPage />
        }
        </>
    )
}
/* { showIndex == 1 &&
            <AppCreatePage onNewApp={onNewApp}/>
        }*/
import { get, set } from "idb-keyval"
import produce from "immer"
import React, {useRef, useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { getFileInfo, getFirstDirectoryAllFiles } from "../constants/utility"
import useZust from "../hooks/useZust"
import AppList from "./components/UI/AppList"
import FileList from "./components/UI/FileList"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from "./css/home.module.css"

export const AddAppPage = (props = {}) =>{

    const divRef = useRef()
    const appDivRef = useRef()
    const searchInputRef = useRef()
 
    const navigate = useNavigate()

    const [searchText, setSearchText] = useState("")

    const pageSize = useZust((state) => state.pageSize)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const user = useZust((state) => state.user)
    const setLoadingStatus = useZust((state) => state.setLoadingStatus)
    const setLoadingComplete = useZust((state) => state.setLoadingComplete)
    const [categories, setCategories] = useState([])
    const [allApps, setAllApps] = useState([])
    const [fileListWidth, setFileListWidth] = useState(480)
    const [appListWidth, setAppListWidth] = useState(300)

    const [selectedApp, setSelectedApp] = useState(null)
    const configFile = useZust((state) => state.configFile)
    
    const [fileDirectories, setFileDirectories] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [showListIndex, setShowListIndex] = useState(1)
    const [appFiles, setAppFiles] = useState([])
    const [appList, setAppList] = useState([])
    const [missingList, setMissingList] = useState([])

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name == "searchText") {
            setSearchText(value)
        }
    }
    const onSelectedApp = (e) =>
    {
        console.log(e)
        const hash = e.selectedHash

        if(hash != null){
            const fileIndex = allApps.findIndex(apps => apps.hash == hash)

            setSelectedApp(allApps[fileIndex])
        }else{
           
        }
       
    }
    const onSelectedFile = (e) =>{
        console.log(e)
    }

    const onOpenApp = (e) =>{

    }
 
    const appsDirectory = useZust((state) => state.appsDirectory)

    useEffect(()=>{
        if(configFile.hash != undefined && appsDirectory.handle != null){
            onRefresh(configFile.hash)

            setFileDirectories(appsDirectory.directories)
      
        }
    }, [configFile, appsDirectory])
    
        

    const onRefresh = async (hash) =>{
    
        const appFiles = await get(hash + ".arcturus")
        
        const { availableApps } = appFiles != undefined ? appFiles : {availableApps: []}

       

        let list = []
        availableApps.forEach(app => {
            const appImage = app.image
            list.push(
                <div key={i} >
                    <div style={{ fontSize: "14px", display: "flex", justifyContent: "left", alignItems: "center", fontFamily: "WebPapyrus" }}
                        className={styles.result} onClick={(e) => {
                            e.stopPropagation()

                        }}>
                        <ImageDiv width={30} height={30} netImage={app.image != null && app.image.fileID != null && app.image.fileID > 0 ? {
                            scale: 1,
                            update: {
                                command: "getIcon",
                                file: appImage,
                                waiting: { url: "/Images/spinning.gif" },
                                error: { url: app.image.url, style: { filter: "invert(100%)" } },

                            },
                            backgroundColor: "#44444450",
                            backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                        } : {
                            image: "/Images/icons/browsers-outline.svg",
                            filter: "invert(100%)",
                            backgroundColor: "#44444450",
                            backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                        }} />
                        <div style={{ paddingLeft: 10, textShadow: "2px 2px 2px black" }}>

                            {app.app.name}{app.handle == undefined && <ImageDiv width={30} height={30} netImage={{
                                image:"/Images/icoms/alert-circle-outline.svg",
                                backgroundColor: "#44444450",
                                backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                            }}
                            
                            />}

                        </div>
                        <div style={{ flex: 1 }} />

                    </div>

                </div>
            )
        });
        setAppList(list)

    }

    useEffect(() => {
        if(configFile.handle != null){
            getAllApps()
        }
    }, [configFile])




    const getAllApps = () => {
    

        setSocketCmd({
            cmd: "getAppList", params: {}, callback: (result) => {
                if ("success" in result && result.success) {
                    setAllApps(result.apps)
                    if(result.categories != undefined)
                    {
                        setCategories(result.categories)
                    }
                }
            }
        })
            
      
    }




    useEffect(() => {
        if (divRef.current) {
            const offsetWidth = divRef.current.offsetWidth
            setFileListWidth(offsetWidth > 300 ? offsetWidth : 300)
        } else {
            setFileListWidth(300)
        }
        if (appDivRef.current) {
            const offsetWidth = appDivRef.current.offsetWidth
            setAppListWidth(offsetWidth > 480 ? offsetWidth : 480)
        } else {
            setAppListWidth(480)
        }

    }, [pageSize,appDivRef.current, divRef.current])


 

    const downloadingApps = useZust((state) => state.downloadingApps)
  
 

    const onGetApp =  async () =>{
       
        if (!downloadingApps.findIndex(dlApps => dlApps.hash == selectedApp.hash)) {
         

            await getApp(selectedApp)

            onRefresh()
        }
    }

    const addFileRequest = useZust((state) => state.addFileRequest)
    
    const getApp = () =>{
        return new Promise(resolve =>{
            addFileRequest({
                command: "getApp", hash: selectedApp, page: "addAppPage", id: crypto.randomUUID(), callback:async (promise)=>{
                   
            
                    resolve(await promise)
            }})
        })
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
               Select Apps
            </div>
                    <div style={{ height: 1, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", paddingBottom: 2, marginBottom: 5 }}>&nbsp;</div>
                    <div style={{ height: 20 }}></div>
                    
            <div style={{width:"90%", display:"flex",height:"calc(100vh-300)", flex:1, marginTop:30, flexDirection:"column"}}>
             
                    <div className={styles.bubble} style={{display:"flex",cursor:"default", flexDirection:"column", backgroundColor:"#11111180",paddingBottom:30}}>
                        <div style={{display:"flex", height:90, flexDirection:"column", backgroundImage:"linear-gradient(to bottom,#ffffff10 0%, #000000EE 30%, #11111110 90%",}}>
                            <div style={{height:30}}>&nbsp;</div>
                            <div style={{display:"flex", flex:1}}>
                                <div style={{display:"flex", width:100, marginLeft:20}}>

                                <div about={"Back"} className={styles.tooltipCenter__item} style={{transform:"translateY(-20px)"}}>
                            <ImageDiv onClick={(e) => {navigate("/apps")}} 
                                width={30}
                                height={30}
                                netImage={{
                                    backgroundColor: "",
                                    image: "/Images/icons/arrow-back-outline.svg",
                                    filter: "drop-shadow(0px 0px 3px #cdd4daCC)"
                                }}
                            /></div>
                            <div style={{width:10}}>&nbsp;</div>

         
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
                                        
                                        <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer"
                                        }}>
                                            <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                                        </div>
                                </div>
                                    <div style={{ width: 80 }}></div>
                                    <div style={{width:20}}></div>
                                </div>
                    </div>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <div ref={divRef} style={{display:"flex", height:pageSize.height - 325, marginLeft:30, paddingTop:15,}}>
                            <div style={{transform:"translateY(-15px)",paddingRight:20, alignItems:"center", justifyContent:"", display: "flex", flexDirection: "column", height: "100%", width: 300, overflowY: "scroll", overflowX: "clip",  }}>
                                {selectedApp != null  ?
                                    <>
                                        <div style={{ width: "100%", display: "flex" }}><div style={{ flex: 1 }} />  
                                        <ImageDiv onClick={() => { setSelectedApp(null) }} about={"Cancel"} className={styles.tooltipCenter__item}
                                            width={30}
                                            height={30}
                                            style={{ borderRadius: 0, marginTop: 10, marginRight: 10 }}
                                            netImage={{
                                                backgroundColor: "",
                                                image: "/Images/icons/close.svg",
                                                filter: "drop-shadow(0px 0px 3px #cdd4daCC)"
                                            }}
                                        /></div>
                                        <ImageDiv  style={{
                                            marginTop:10,
                                            boxShadow:" 0 0 10px #ffffff40, 0 0 20px #ffffff40, inset 0 0 30px #77777710",
                                            filter: "drop-shadow(0px 0px 3px #ffffff30)",
                                        }} className={styles.bubble} width={100} height={100} netImage={{
                                            scale: .97,
                                            update: {
                                                command: "getImage",
                                                file: selectedApp.image,
                                                waiting: { url: "/Images/spinning.gif", style: { filter: "invert(0%)" } },
                                                error: { url: "/Images/icons/cloud-offline.svg", style: { filter: "invert(100%)" } },

                                            },
                                            backgroundColor: "#ffffff50",
                                            backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                                        }} />
                                        <div style={{height:10}}></div>
                                        <div style={{ cursor: "pointer", paddingTop: 3, width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
                                            <div
                                                className={styles.glow}
                                                style={{

                                                    textAlign: "center",
                                                    fontFamily: "WebRockwell",
                                                    fontSize: "20px",
                                                    fontWeight: "bolder",
                                                    color: "#cdd4da",
                                                    textShadow: "2px 2px 2px #101314",

                                                }} >{selectedApp.app.name}</div>

                                        </div>

                                        <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>
                                        <div style={{ width:"100%", marginTop:10}}>
                                            <div style={{ color: "#888888", textShadow: "0 0 1px #000000", fontFamily:"webpapyrus", backgroundColor:"#11111150", fontWeight:"bolder", padding:10, borderRadius:10, border:"solid 2px black", minHeight:100}}>
                                            {selectedApp.app.description}
                                            </div>
                                        </div>
                                        <div style={{ display:"flex", width: "100%", marginTop:10, paddingTop:2, paddingBottom:2, alignItems:"center" }}>
                                           
                                           
                                            <div style={{flex:1,paddingTop:20 }}></div>
                                          
                                                <ImageDiv onClick={onGetApp} about={"Get"} className={styles.tooltipCenter__item}
                                                width={35}
                                                height={35}
                                                style={{ borderRadius: 0 }}
                                                netImage={{
                                                    backgroundColor: "",
                                                    image: "/Images/icons/download.svg",
                                                    filter: "drop-shadow(0px 0px 3px #cdd4daCC)"
                                                }}
                                            />
                                               
                                                <div style={{width:10}}></div>
                                        </div>
                                        <div style={{flex:1}}></div>
                                    </>
                                :
                                    <div></div>
                                }
                               
                                    < div style={{

                                        width: "100%",

                                    }}>


                                        <div
                                            onClick={(e) => {
                                                if (showListIndex == 3) {
                                                    setShowListIndex(1)
                                                } else {
                                               //    endSearch()
                                                    setSelectedApp(null)
                                                    setShowListIndex(3);
                                                }

                                            }}
                                            className={styles.glowText}
                                            style={{

                                                fontWeight: "bold",
                                                width: "100%",
                                                fontSize: "14px",
                                                fontFamily: "WebPapyrus",
                                                color: "#888888",
                                                textShadow: "3px 3px 4px black",
                                                paddingTop: "10px",
                                                paddingBottom: "6px",
                                                display: "flex"
                                            }}>
                                            <div>Installed Apps</div>

                                        {(appList.length == 0 || showListIndex != 3)  &&
                                                <>
                                                    <div style={{ flex: 1 }} />
                                                    <div style={{}}> {appList.length} </div>
                                                </>
                                            }
                                        </div>
                                    {showListIndex == 3 && appList.length > 0 &&
                                            <>
                                                <div style={{
                                                    marginBottom: '2px',

                                                    height: "1px",
                                                    width: "100%",
                                                    backgroundImage: "linear-gradient(to right,  #77777730,#77777755, #000304DD, #000304DD)",
                                                }}>&nbsp;</div>

                                                <div style={{}}>
                                                    <div style={{

                                                        marginBottom: '2px',

                                                        height: "1px",
                                                        width: "100%",


                                                    }}></div>
                                                    <div style={{ margin: "15px" }}>
                                                        {appList}
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                
                            </div>
                          
                            <div ref={appDivRef}  style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#11111150", flex: 1, padding: 20, overflowY: "scroll", overflowX:"clip" }}>
                                <AppList
                                    width={appListWidth}
                                
                                    fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100 } }}
                                    onChange={onSelectedApp}
                                    onDoubleClick={onOpenApp}
                                    filter={{ name: "", mimeType: "app", type: "" }}
                                    files={allApps}
                                    installedFiles={appFiles}
                                />
                            </div>
                                

                        </div>
                        <div style={{height:30}}></div>
                    </div>
                </div>
               
                    </div>
         
                </div>
    )
}
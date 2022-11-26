import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { RealmCreatePage } from "./RealmCreatePage";
import BubbleList from "./components/UI/BubbleList";
import styles from "./css/home.module.css"
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";
import { errorRealmEnd } from "../constants/systemMessages";


export const RealmsPage = () =>{
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const navigate = useNavigate();
    const location = useLocation();
    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
    const setCurrentRealmID = useZust((state) => state.setCurrentRealmID)
    const [showIndex, setShowIndex] = useState(0)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const [showMenu, setShowMenu] = useState(false)
    

    const [selectedRealm, setSelectedRealm] = useState(null)

    const [selectedItem, setSelectedItem] = useState(null)

    const realms = useZust((state)=> state.realms)

    const [realmItems, setRealmItems] = useState([])

    const addRealm = (realm) => useZust.setState(produce((state)=>{
        const index = realms.findIndex(r => r.realmIndex == realm.realmIndex)
        if(index == -1) state.realms.push(realm)
    }))
    
    const addSystemMessage = useZust((state) => state.addSystemMessage)

    const addFileRequest = useZust((state) => state.addFileRequest)

 
    useEffect(() => {
        const currentLocation = location.pathname;

        const p2pEnabled = configFile.value != null && configFile.value.peer2peer;

        if (p2pEnabled) {
            switch (currentLocation) {
                case "/realms/create":
                    if ("selectedItem" in location.state) {
                        setSelectedItem(location.state.selectedItem)
                        setShowIndex(1)
                    }
                    break;
                case "/realms":
                    setShowIndex(0)
                    break;
            }
        } else {
            setShowIndex(-1)
        }
    }, [location, configFile])
    

    const updateRealmImage = useZust((state) => state.updateRealmImage)

    useEffect(()=>{
        if(realms != null){
         
            if(realms.length > 0)
            {
                
                const tmp = []
                
                realms.forEach(realm => {
                    
                    if (("value" in realm.image && realm.image.value != null)) {
                   
                        tmp.push(
                            { index: realm.realmIndex, page: realm.realmPage, id: realm.realmID, name: realm.realmName, netImage: { scale: 1, image: realm.image.value, opacity: .9} }
                        )
                    }else{
                        addFileRequest({ command: "getImage", page: "realms", id: realm.realmID, file: realm.image, callback: updateRealmImage })
                        if (("icon" in realm.image)) {
                            tmp.push(
                                { index: realm.realmIndex, page: realm.realmPage, id: realm.realmID, name: realm.realmName, netImage: { scale: 1, image: realm.image.icon, opacity: .9 } }
                            )
                        }else{
                            tmp.push(
                                {
                                    index: realm.realmIndex,
                                    page: realm.realmPage,
                                    id: realm.realmID,
                                    name: realm.realmName,
                                    netImage: { opacity: .2, scale: .6, image: "/Images/spinning.gif" }
                                }
                            )
                        }
                        
                    }
                    
                    
                
                });
                setRealmItems(tmp)
            }else{
                setRealmItems([])
            }
        }else{
            setRealmItems([])
        }
    },[realms])

    const onNewRealm = (realm, callback) => {

        const newFile = {
            mimeType: realm.image.mimeType,
            name: realm.image.name,
            crc: realm.image.crc,
            size: realm.image.size,
            type: realm.image.type,
            lastModified: realm.image.lastModified,
        }
        setSocketCmd({
            cmd: "createRealm", params: {realmName: realm.realmName,file: newFile,page: selectedItem.page,index: selectedItem.index, }, callback: (response) => {

        

            if ("error" in response) {
                callback(false)

            } else if ("realm" in response) {

                const realm = response.realm
                callback(true)

                addRealm(realm)
                setCurrentRealmID(realm.realmID)
                navigate("/realm/gateway")

            }
        }})

    }


    const onRealmChange = (r) =>{
        setShowMenu(false)
        if(r != null && r.id > -1 )
        {
           const index = realms.findIndex(realm => realm.realmID == r.id)
           const realm = index > -1 ? realms[index] : null;

           
            setSelectedRealm(realm)
            
        }else{
            setSelectedRealm(null)
        }
        setSelectedItem(r)
    }

    const onCreateRealm = (e) =>[
        navigate("/realms/create", {state:{selectedItem:selectedItem}})
    ]

    const onEndRealm = (e) =>{
        setShowIndex(-2)
    }

    const removeRealm = (realmID) => useZust.setState(produce((state)=>{
        const length = state.realms.length;
        if(length != undefined && length > 0)
        {
            const index = realms.findIndex(realm => realm.realmID == realmID)

            
            state.realms.splice(index, 1)
            
        }
    }))

    const onEndRealmYes = (e) =>{
      
        const realmID = selectedRealm.realmID;
        if(realmID == undefined || realmID == null)
        {
            setShowIndex(0)
            navigate("/realms")
        }else{
            setSocketCmd({
                cmd: "deleteRealm", params: {realmID: realmID }, callback: (callback) => {
                if("error" in callback){
                    addSystemMessage(errorRealmEnd)
                }else{
                    if (callback.success) {
                        removeRealm(realmID)
                    }else{
                        addSystemMessage(errorRealmEnd)
                    }
                    
                }
       
                setSelectedRealm(null)
                setCurrentRealmID(null)
                setSelectedItem(null)
                navigate("/realms")
            }})
        }
        
    }
    const onNextPage = (e) =>{

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
                    <div style={{ fontFamily: "webrockwell", color: "#BBBBBB", paddingBottom: 30, paddingTop:30, fontSize: 13, textAlign: "center" }}>
                        Notice: This will not delete any of the files associated with this realm.
                    </div>
                    <div style={{ fontFamily: "webrockwell", color: "white", paddingBottom: 40, paddingRight: 40, paddingLeft: 40, fontSize: 16, textAlign: "center" }}>
                       Would you like to end this realm?
                    </div>
                  
                    <div style={{
                        justifyContent: "center",

                        paddingTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={(e) => { navigate("/realms") }}>No</div>

                        <div style={{

                            marginLeft: "10px", marginRight: "10px",
                            height: "50px",
                            width: "1px",
                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                        }}>

                        </div>
                        <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={onEndRealmYes} >Yes</div>
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
                    <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={(e)=>{navigate("/network")}}>No</div>

                    <div style={{

                        marginLeft: "10px", marginRight: "10px",
                        height: "50px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}>

                    </div>
                    <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={(e)=>{navigate("/home/localstorage/init")}} >Yes</div>
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
                    <div style={{ display:"flex", width:"100%"}}> 
                   
                    {selectedItem != null && selectedRealm == null &&
                        <>
                            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent:"center" }}>
                            
                                <div style={{ width: 55, borderRadius: 55 }} about={"Begin a realm"} className={styles.tooltipCenter__item} onClick={(e) => {
                                   
                                }}>

                                    <ImageDiv style={{ filter: "drop-shadow(0 0 10px #ffffff90) drop-shadow(0 0 20px #ffffff70)" }} width={55} height={55} netImage={{ backgroundColor: "", image: "/Images/icons/earth-outline.svg", filter: "invert(100%) drop-shadow(0 0 10px #ffffff40) drop-shadow(0 0 20px #ffffff40)" }} />

                                </div></div>
                        </>
                    }
                    {selectedRealm != null &&
                        <>
                           
                            <div style={{display:"flex", flex: 1, alignItems:"center" }}> 
                            <div style={{width:50}}>&nbsp;</div>
                                <div style={{  width: 30, borderRadius: 20 }} about={"Menu"} className={styles.tooltipCenter__item} onClick={(e)=>{
                                    setShowMenu(true)
                                }}>

                                    <ImageDiv width={35} height={35} netImage={{ backgroundColor: "", image: "/Images/icons/menu-outline.svg", filter: "invert(100%) drop-shadow(0 0 10px #ffffff40) drop-shadow(0 0 20px #ffffff40)" }} />

                            </div></div>

                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex:1,}}>
                                <div style={{ width:30}}>&nbsp;</div>

                                <div about="Gateway" 
                                    className={styles.tooltipCenter__item} 
                                    onClick={(e) => { 
                                        setCurrentRealmID(selectedRealm.realmID)
                                        navigate("/realm/gateway")
                                    }}  
                                    style={{display: "flex", 
                                    }}>
                                    <div style={{ width: 100 }}>&nbsp;</div>
                                    <ImageDiv style={{ filter:"drop-shadow(0 0 10px #ffffff90) drop-shadow(0 0 20px #ffffff70)"}} width={55} height={55} netImage={{ scale: 1,  backgroundColor: "", image: "/Images/realm.png", filter: "invert(100%)" }} />
                                    <div style={{ width: 100 }}>&nbsp;</div>
                                </div>
                              
                                   

                            </div>

                            <div style={{display:"flex", justifyContent:"end", alignItems:"center", flex:1, }}>
                                <div about={"Next Page"} className={styles.tooltipCenter__item} onClick={onNextPage} style={{  }}>
                                 
                                    <ImageDiv width={30} height={30} netImage={{ image: "/Images/icons/chevron-forward-outline.svg", filter: "invert(100%)" }} />
                                  
                                </div>
                                
                            </div>
                            <div style={{ flex:0.02 }}>&nbsp;</div>
                        </>
                    }
                    </div>
            <div style={{width:"100%", display:"flex",height:"100%"}}>
                
                <BubbleList onChange={(item)=>{
                  
                    onRealmChange(item)
                }} items={realmItems}
                            defaultItem={{ netImage:{ backgroundColor:""} }}
                    
                />
            </div>
           
        </div>
        </>
        }
            
            
        { showIndex == 1 &&
            <RealmCreatePage onNewRealm={onNewRealm}/>
        }
        {showMenu && selectedRealm != null && 
            <div  style={{backgroundColor:"black", display:"flex", flexDirection:"column", position:"fixed", left:135, top: 120, width:200, padding:5 }}>
                    <div className={styles.result} onClick={(e) => {
                        setCurrentRealmID(selectedRealm.realmID)
                        navigate("/realm/gateway")
                    } } style={{display:"flex", alignItems:"center", justifyContent:"left"}}>

                    <ImageDiv width={30} height={30} netImage={{ image: "/Images/realm.png", filter: "invert(100%)" }} />
                    <div style={{paddingLeft:10}}>
                        Enter Gateway
                    </div>
                </div>
                    <div className={styles.result} onClick={onEndRealm} style={{ display: "flex", alignItems: "center", justifyContent: "left" }}>

                        <ImageDiv width={30} height={30} netImage={{ image: "/Images/icons/flash-outline.svg", filter: "invert(100%)" }} />
                        <div style={{ paddingLeft: 10 }}>
                            End Realm
                        </div>
                    </div>
            </div>
        }
           
        </>
    )
}
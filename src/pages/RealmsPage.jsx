import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { RealmCreatePage } from "./RealmCreatePage";
import BubbleList from "./components/UI/BubbleList";
import styles from "./css/home.module.css"
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";


export const RealmsPage = () =>{
    const user = useZust((state) => state.user)
    const socket = useZust((state) => state.socket)
    const navigate = useNavigate();
    const location = useLocation();
    const pageSize = useZust((state) => state.pageSize)

    const [showIndex, setShowIndex] = useState(0)
    const [subDirectory, setSubDirectory] = useState("")

    const [selectedRealm, setSelectedRealm] = useState(null)

    const [selectedItem, setSelectedItem] = useState(null)

    const realms = useZust((state)=> state.realms)

    const [realmItems, setRealmItems] = useState([])

    const addRealm = (realm) => useZust.setState(produce((state)=>{
        const index = realms.findIndex(r => r.realmIndex == realm.realmIndex)
        if(index == -1) state.realms.push(realm)
    }))
    

    const addFileRequest = useZust((state) => state.addFileRequest)

    useEffect(() => {
        const currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

        setSubDirectory(sD)

        switch (sD) {
            case "/create":
                if("selectedItem" in location.state){
                    setSelectedItem( location.state.selectedItem) 
                    setShowIndex(1)
                }
                break;
            default:
                setShowIndex(0)
                break;
        }
    },[location])
    
    const updateRealmImage = (response) =>useZust.setState(produce((state)=>{
        const index = realms.findIndex(realm => realm.realmID == response.request.id);
        const image = index != -1 ? state.realms[index].image : null;

        if("error" in response){
            console.log('error')
        }else{
            
            if (index != -1)
            {
                const file = response.file;
                
                

                const fileProperties = Object.getOwnPropertyNames(file)

                fileProperties.forEach(property => {
                    image[property] = file[property];
                });
                image.loaded = true;

                if (index != -1) state.realms[index].image = image;
            } 
        }
    }))
    useEffect(()=>{
        if(realms.length > 0)
        {
            const tmp = []
            
            realms.forEach(realm => {
                if (!("icon" in realm.image)) {
                    
                    addFileRequest({ page: "realms", id: realm.realmID, file: realm.image, callback: updateRealmImage })
                    tmp.push(

                        { index: realm.realmIndex, page: realm.realmPage, id: realm.realmID, name: realm.realmName, netImage: {opacity:.2, scale: .6, image:"/Images/spinning.gif"} }

                    )

                }else{
                    if(realm.image.loaded)
                    {
                        tmp.push(

                            { index: realm.realmIndex, page: realm.realmPage, id: realm.realmID, name: realm.realmName, netImage: { scale: 1, image: realm.image.icon, opacity: .9} }

                        )
                    }else{
                        tmp.push(

                            { index: realm.realmIndex, page: realm.realmPage, id: realm.realmID, name: realm.realmName, netImage: { scale: .4, image: "/Images/icons/cloud-offline-outline.svg", opacity: .1, filter: "invert(90%)" } }

                        )
                    }
                }   
               
            });
            setRealmItems(tmp)
        }else{
            setRealmItems([])
        }
    },[realms])

    const onRealmChange = (r) =>{
        
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
                    
                    {selectedItem == null &&
                    <>
                        <div style={{height:90}}>&nbsp;</div>
                     
                    </>
                    }
                    {selectedItem != null && selectedRealm == null &&
                        <>
                        <div style={{ height: 30 }}>&nbsp;</div>
                            <div style={{ display: "flex", alignItems: "left", width: "100%" }}>
                                <div style={{ width: "5%", paddingRight: 10 }}></div>
                                <div className={styles.InactiveIcon} style={{ display: "flex" }}>
                                    <div style={{ width: 5 }}></div>
                                    <ImageDiv width={30} height={30} netImage={{ image: "/Images/icons/add-circle-outline.svg", filter: "invert(100%)" }} />
                                    <div onClick={onCreateRealm} style={{ fontSize: 20, fontFamily: "WebPapyrus", padding: 10, cursor: "pointer" }}>
                                        Create Realm
                                    </div>
                                </div>
                            </div>

                        </>
                    }
                    {selectedRealm != null &&
                        <>
                            <div style={{ display: "flex", alignItems: "center", justifyContent:"center",  width: "100%" }}>
                               
                            <div onClick={(e) => { navigate("/realm/gateway", {state:{realm:selectedRealm}})}} about="Gateway" className = { styles.tooltipCenter__item } style={{padding:10, display: "flex" }}>
                                    
                                <ImageDiv style={{ filter:"drop-shadow(0 0 10px #ffffff90) drop-shadow(0 0 20px #ffffff70)"}} width={55} height={55} netImage={{ scale: 1,  backgroundColor: "", image: "/Images/realm.png", filter: "invert(100%)" }} />
                                </div>
                            </div>

                        </>
                    }
        
            <div style={{width:"100%", display:"flex",height:"100%"}}>
                
                <BubbleList onChange={(item)=>{
                  
                    onRealmChange(item)
                }} items={realmItems}
                            defaultItem={{ netImage:{ backgroundColor:""} }}
                    
                />
            </div>
           
        </div>
        }
        { showIndex == 1 &&
            <RealmCreatePage onNewRealm={(realm, callback)=>{
                
                const newFile = {
                    mimeType: realm.image.mimeType,
                    name: realm.image.name,
                    crc: realm.image.crc,
                    size: realm.image.size,
                    type: realm.image.type,
                    lastModified: realm.image.lastModified,
                } 

                socket.emit("createRealm", realm.realmName, newFile, selectedItem.page, selectedItem.index, (response) => {

                    

                    if ("error" in response) {
                        callback(false)

                    } else if ("realm" in response) {
                        console.log(response)
                        const realm = response.realm
                        callback(true)

                        addRealm(realm)
                        navigate("/realm/gateway", { state: realm })

                    }
                })
            
            }}/>
        }
       
        </>
    )
}
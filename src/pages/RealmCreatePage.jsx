import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";
import styles from "./css/home.module.css"
import FileList from "./components/UI/FileList";
import { useEffect } from "react";
import SelectBox from "./components/UI/SelectBox";
import { getPermissionAsync } from "../constants/utility";

export const RealmCreatePage = (props = {}) =>{
    
    

    const navigate = useNavigate();

    const searchInputRef = useRef()

    const pageSize = useZust((state) => state.pageSize)

    const user = useZust((state) => state.user);
    const socket = useZust((state) => state.socket)

    const [imageSelected, setImageSelected] = useState(null); 

    const [realmName, setRealmName] = useState("")
    const configFile = useZust((state) => state.configFile)



    const [selectImage, setSelectImage] = useState(false)

    const imagesFiles = useZust((state)=> state.imagesFiles)

    const [imageSearch, setImageSearch] = useState("")

    const imagesDirectory = useZust((state) => state.imagesDirectory)

    const [directoryOptions, setDirectoryOptions] = useState([])

    const [currentDirectory, setCurrentDirectory] = useState("")

    const localDirectory = useZust((state) => state.localDirectory)

    

    useEffect(()=>{
        if(selectImage){
            
            const options = []

            options.push ({value:null, label:"All"})
            if(Array.isArray(imagesDirectory.directories)){
                imagesDirectory.directories.forEach(directory => {
                    if(directory != null){
                        if("name" in directory){
                            options.push({ value: directory.name, label: directory.name })
                        }
                    }
                });
            }
            setDirectoryOptions(options)
        }
    }, [selectImage, imagesDirectory])

    const directoryChanged = (index) =>{
        console.log(index)
        if(directoryOptions.length > 0)
        {
            const directoryName = directoryOptions[index].value
            setCurrentDirectory(directoryName)
        }else{
            setCurrentDirectory("")
        }
    }
 

    const handleChange = (e) =>{
        const { name, value } = e.target;

        if (name == "realmName") {
            if (value.length > 2) {
                socket.emit("checkRealmName", value, (callback) => {
                    if (callback) {
                        setRealmName(value)

                    } else {
                        setRealmName("")

                    }
                })
            } else {
                setRealmName("")
        
                setImageSelected(null)
            }

        }
        if (name == "imageSearch") {
            if (value.length > 0) {
                setImageSearch(value)
            } else {
              if(imageSearch != "")  setImageSearch("")
            }

        }
        
    }

    const onSelectImage = (e) => {
        setSelectImage(prev => !prev)
    }

    const onImageSelected = (e) =>{
        const img = imagesFiles[e];
        const pub = checkImagePublished(img.crc) 
            
        img.imageID = ("imageID" in pub) ? pub.imageID : null;

        setImageSelected(img)
        
      
    }
    const [submitting, setSubmitting] = useState(false);

    const publishedImages = useZust((state) => state.publishedImages)

    const checkImagePublished = (crc) => {
        const pF = publishedImages;
        const length = pF.length;

        if(length == 0){
            return {}
        }else{
            for(let i = 0; i< length ; i++)
            {
                if(pF[i].crc == crc){
                    return pF[i]
                }
            }

            return {}
        }
    }

    async function handleSubmit (e) {
        const config = configFile.value;
        const granted = await getPermissionAsync(localDirectory.handle)
        if(! submitting && granted)
        {
            socket.emit("createRealm", realmName, imageSelected.imageID, (response) => {

                setSubmitting(false);

                if ("error" in response) {

                    alert(response.error.message)
                    navigate("/realms")

                } else if (response.created) {

                    const realm = response.realm
                    
                    navigate("/realm/config", {state:{realmID: realm.realmID, roomID:realm.roomID, realmName:realmName, imageFile: imageSelected }})    

                }
            })
                    
            
        }
    }


    const onCancelClick = (e) =>{
        navigate("/realms")
    }

    return(
        <>
        
        <div style={{
            
            backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
            position: "fixed",
            display: "flex",
            left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            alignItems: "center", justifyContent: "center", 
            
        }}>
           
            <div style={{paddingTop:50, flex:1, display:"flex", flexDirection:"column"}}>
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #00030440 20%, #77777740 50%, #00030440 100%)", }}>&nbsp;</div>
            <div style={{
           
                fontSize: "50px",
                textAlign: "center",
                fontFamily: "Webpapyrus",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #202020,  0 0 30px #f7bc1510",
                fontWeight: "bolder",
                color: "#cdd4da",
                width:"100%"

            }} >Create &nbsp; Realm</div>
    
       
            <div >
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #00030440 20%, #77777740 50%, #00030440 100%)", }}>&nbsp;</div>
            <div style={{marginTop:40,}}>
                <div style={{ height: 30 }}></div>
                <div style={{
                    alignItems: "center", justifyContent: "center",
                    display: "flex",


                    backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 20,
                    paddingRight: 20
                }}>
                        {realmName.length > 2 &&
                        <div style={{width:40}}> &nbsp;</div>
                        }
                    <input onKeyUp={(e) => {
                        if (e.code == "Enter") {
                            handleSubmit(e)
                        }
                    }} placeholder="Realm name..." style={{
                        outline: 0,
                        border: 0,
                        color: "white",
                        width: 600, textAlign: "center", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus"

                    }} name="realmName" onChange={event => handleChange(event)} />
                        {realmName.length > 2 &&
                            <ImageDiv width={30} height={30} netImage={{ image: realmName == "" ? "/Images/icons/close-outline.svg" : "/Images/icons/checkmark-outline.svg", width: 20, height: 20, filter: "invert(100%" }} /> 
                        }
                        </div>
                    <div style={{ width:"100%"}}>
                        <div style={{height:40}}/>
                     
                        
                    </div>
                {imageSelected != null &&
                    <>    
                  

                    <div style={{ display:"flex",
                    flexDirection:"column",
                        paddingBottom: 10,
                        justifyContent: "center",
                        alignItems: "center", }}>
                            
                        <div style={{

                            display: "flex",

                            backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                            paddingBottom: 5,
                            paddingTop: 5,
                            paddingLeft: 100,
                            paddingRight: 100,
                            flexDirection:"column"
                        }}>
                        
                            <div style={{ cursor: "pointer" }} onClick={ onSelectImage }>
                                <ImageDiv width={100} height={100} netImage={{scale:1, image: imageSelected.icon}}/>
                            </div>
                        
                        </div> 
                        
                    
                        </div>
                        </>

                    }
                        {realmName != "" && imageSelected == null && 
                    <div style={{

                        display: "flex",
                        alignItems:"center",
                        justifyContent:"center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 2,
                        marginTop: 10,
                        marginBottom: 10,
                        paddingTop: 2,

                        flexDirection: "column"
                    }}>
                        <div style={{ display: "flex", backgroundColor: "#000000", width: 140, paddingTop: 8, paddingBottom: 8, }} onClick={onSelectImage} className={styles.OKButton}>
                            <div style={{

                                marginRight: 5,
                                height: "15px",
                                width: "1px",
                        
                            }}>

                            </div>
                            <div style={{  }}>Select Image</div>
                            <div style={{

                                marginLeft: 2,
                                height: "15px",
                                width: "1px",
                               
                            }}>

                            </div>
                        </div>
                    </div>
                    }
                </div>
              
                <div style={{ paddingTop:20, paddingBottom:15 }}>  
                
                    <div style={{
                        justifyContent: "center",

                        paddingTop: "10px",
                        display: "flex",
                       
                     
                    }}>
                        <div style={{width:100}}  className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

                        <div style={{

                            marginLeft: "20px", marginRight: "20px",
                            height: "50px",
                            width: "1px",
                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                        }}>

                        </div>
                            <div style={{ width: 100 }} className={imageSelected != null ? styles.OKButton : styles.OKDisabled} onClick={handleSubmit} >Ok</div>
                    </div>
                </div>
            </div>
                </div>
            {realmName.length > 2 && selectImage && 
                <div style={{ marginTop: 10, display: "flex", flexDirection:"column"}}>
                    <div style={{ paddingBottom: 15, display: "flex", justifyContent:"right" }}>
                        <div style={{margin:3, backgroundColor: "#33333340", display:"flex", alignItems:"center" }}> 
                            <input ref={searchInputRef} name={"imageSearch"} onChange={handleChange} style={{ 
                                color: "white", 
                                backgroundColor: "#33333300", 
                                fontFamily: "webpapyrus", 
                                fontSize: 12, 
                                width: 150,
                                 outline: 0, 
                                 border: 0 }} type={"text"} />
                        </div>
                        <div style={{margin:3, width:100}}>
                            <SelectBox onChange={directoryChanged} textStyle={{ backgroundColor: "#33333340", border:0, outline:0, color:"white"}} placeholder={"All"} options={directoryOptions} />
                        </div>
                        <div onClick={(e)=>{ searchInputRef.current.focus() }} style={{
                            cursor:"pointer"
                            }}>
                                <ImageDiv  width={30} height={30} netImage={{ filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                        </div>
                    </div>
                    <div style={{ justifyContent: "center", display: "flex", width:300, height: 400, overflowX:"visible", overflowY: "scroll", color: "white",  }}>
                        <FileList onChange={onImageSelected}  filter={{name:imageSearch, directory:currentDirectory}}  fileView={{ type: "icons", direction: "list", iconSize: { width: 100, height: 100 } }} files={imagesFiles} />
                    </div>
                    
                </div>
            }
        </div>
        
     
        </>
    )
}
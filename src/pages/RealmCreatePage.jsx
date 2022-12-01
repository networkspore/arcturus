import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";
import styles from "./css/home.module.css"
import FileList from "./components/UI/FileList";
import { useEffect } from "react";
import SelectBox from "./components/UI/SelectBox";
import produce from "immer";
import { errorRealmCreate, errorSelectingImage, initDirectory, initStorage } from "../constants/systemMessages";

export const RealmCreatePage = (props = {}) =>{
    
    const navigate = useNavigate();
    const searchInputRef = useRef()
    const pageSize = useZust((state) => state.pageSize)
    const socket = useZust((state) => state.socket)
    const configFile = useZust((state) => state.configFile)
    const imagesFiles = useZust((state) => state.imagesFiles)
    const localDirectory = useZust((state) => state.localDirectory)
    const imagesDirectory = useZust((state) => state.imagesDirectory)
    const addSystemMessage = useZust((state) => state.addSystemMessage)

    const [imageSelected, setImageSelected] = useState(null); 
    const [realmName, setRealmName] = useState("")
    const [imageSearch, setImageSearch] = useState("")
    const [directoryOptions, setDirectoryOptions] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(()=>{
        if(localDirectory.handle != null){
            const config = configFile.value;
           
            if(config == null)
            {

                addSystemMessage(initStorage)
                navigate("/realms")
            }
            
        }else{
         
            addSystemMessage(initDirectory)
            navigate("/realms")
        }
    },[configFile, localDirectory])

    useEffect(()=>{
        if(imagesDirectory.directories != null){
            
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
    }, [ imagesDirectory])
/*
    useEffect(()=>{
        if(Array.isArray(imagesFiles))
        {
         //   <ImageDiv about={"Select Image"} style={{ textShadow: "2px 2px 2px black", }} className={styles.bubble__item} netImage={{ scale: 1.2, backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", borderRadius: 40, backgroundColor: "", image: imageSelected.icon }} />
            const tmpList = []

            imagesFiles.forEach(iFile => {
                let file = {

                }
                tmpList.push(

                )
            });
        
        }
    },[imagesFiles])*/

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
    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const handleChange = (e) =>{
        const { name, value } = e.target;

        if (name == "realmName") {
            if (value.length > 2) {
                setSocketCmd({
                    cmd: "checkRealmName", params: {text: value}, callback: (callback) => {
               
                    if (callback) {
                        setRealmName(value)
                    } else {
                        setRealmName("")
                    }
                }})
            } else {
                setRealmName("")
        
                setImageSelected(null)
            }

        }
      
        
    }

    const imageSearchChanged = (e) =>{
        const { name, value } = e.target;
        if (name == "imageSearch") {
            if (value.length > 0) {
                setImageSearch(value)
            } else {
                if (imageSearch != "") setImageSearch("")
            }

        }
    }



    const onImageSelected = (e) =>{
        const img = imagesFiles[e];

        if(img != undefined){
            if("crc" in img)
            {
     

                setImageSelected(img)

            }else{
                setImageSelected(null)
                addSystemMessage(errorSelectingImage)
            }
        }else{
            addSystemMessage(errorSelectingImage)
        }
    }


    async function handleSubmit (e) {
      
        if (!submitting){
            setSubmitting(true)
            setTimeout(() => {
                setSubmitting(false)
                handleChange(e)
            }, 3);
            props.onNewRealm({realmName:realmName, image:imageSelected}, (success)=>{
                    if(!success)
                    {
                        setSubmitting(false)
                        addSystemMessage(errorRealmCreate)
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
                position:"fixed",
                alignItems:"center",
                justifyContent:"center",
                width: pageSize.width - 95,
                display:"flex",
                left: 95,
                top: 0,
                flexDirection:"column",
                paddingTop: "15px",
                paddingBottom: "5px",
                fontFamily: "Webpapyrus",
                fontSize: "20px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",

            }}>
                <div>Create Realm</div>
                <div style={{ height: 3, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", marginTop: 4, marginBottom: 5 }}>&nbsp;</div>
            </div>

            <div style={{
                position: "fixed",
                width: pageSize.width - 95,
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
        
            display: "flex",
       
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            alignItems: "center", 
            justifyContent: "center", 
            
        }}>
            <div style={{display:"flex"}}> 
         
    
       
            <div >
         
            <div style={{marginTop:50,}}>
                <div style={{ height: 20 }}></div>
                <div style={{
                    alignItems: "center", justifyContent: "center",
                    display: "flex",


                    backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 20,
                    paddingRight: 20
                }}>
                        
                        <div style={{width:40}}> &nbsp;</div>
                        
                    <input onKeyUp={(e) => {
                        if (e.code == "Enter") {
                            handleSubmit(e)
                        }
                    }} placeholder="Realm name..." style={{
                        outline: 0,
                        border: 0,
                        color: "white",
                        width: 500, textAlign: "center", fontSize: "25px", backgroundColor: "#00000090", fontFamily: "WebPapyrus"

                    }} name="realmName" onChange={event => handleChange(event)} />
                        
                                        <ImageDiv width={30} height={30} netImage={{opacity:.4, image: realmName == ""  ? "/Images/icons/close-outline.svg" : "/Images/icons/checkmark-outline.svg", filter: "invert(100%)" }} /> 
                        
                        </div>
                    <div style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                            
                        <div style={{height:35}}/>
                     
                        
                    </div>
               
                  
                        {imageSelected != null && realmName.length > 2 &&
                    <div style={{
                                    filter: "drop-shadow(0 0 5px #ffffff30) drop-shadow(0 0 10px #ffffff40)",
                         display:"flex",
                    flexDirection:"column",
                        paddingBottom: 10,
                        justifyContent: "center",
                        alignItems: "center", }}>
                            
                     
                        
                            <div style={{ cursor: "pointer" }} onClick={ onImageSelected }>
                                <ImageDiv 
                                    width={300}
                                    height={300}
                                    about={imageSelected.name} 
                                    style={{ textShadow: "2px 2px 2px black", }} 
                                    className={  styles.bubbleActive__item} 
                                    netImage={{ 
                                        scale:1, 
                                        backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", 
                                        borderRadius: 40, 
                                        backgroundColor: "#44444450",
                                        update: {
                                            command: "getImage",
                                            file: imageSelected,
                                            waiting: {url: "/Images/spinning.gif" },
                                            error: {url: "/Images/icons/image-outline.svg", style: {filter: "invert(100%)" } },
                                        },
                                        
                                        }} 
                                    />
                            </div>
                        
                       
                    
                        </div>
                        
                            }
                            {imageSelected == null && realmName.length > 2 &&
                                <div style={{
                                   
                                    display:"flex",
                               
                                 
                                    justifyContent: "center",
                                    alignItems: "center", }}>
                                        <ImageDiv width={300}  height={300} about={"Select Image"} style={{ textShadow: "2px 2px 2px black", }} className={styles.bubble__item}  netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", borderRadius:40, backgroundColor:"", image: "" }} />
                                </div>
                            }
                    
                       
                </div>
                            <div style={{ paddingTop: 20, paddingBottom: 15 }}>

                                <div style={{
                                    justifyContent: "center",

                                    paddingTop: "10px",
                                    display: "flex",


                                }}>
                                    <div style={{ width: 100 }} className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

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
                    {realmName.length > 2 &&
                        <div style={{
                        
                       
                            display: "flex",
                            flexDirection: "column",
                    
                        
                        }}>
                            <div style={{ marginTop: 15, paddingBottom: 15, display: "flex", justifyContent: "right" }}>
                                <div style={{ margin: 3, backgroundColor: "#33333340", display: "flex", alignItems: "center" }}>
                                    <input ref={searchInputRef} name={"imageSearch"} onChange={imageSearchChanged} style={{
                                        color: "white",
                                        backgroundColor: "#33333300",
                                        fontFamily: "webpapyrus",
                                        fontSize: 12,
                                        width: 150,
                                        outline: 0,
                                        border: 0
                                    }} type={"text"} />
                                </div>
                                <div style={{ margin: 3, width: 100 }}>
                                    <SelectBox onChange={directoryChanged} textStyle={{ backgroundColor: "#33333340", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={directoryOptions} />
                                </div>
                                <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                                    cursor: "pointer"
                                }}>
                                    <ImageDiv width={30} height={30} netImage={{ filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                                </div>
                            </div>
                            <div style={{ justifyContent: "center", display: "flex", width: 300, height: 480, overflowX: "visible", overflowY: "scroll", color: "white", }}>
                                <FileList 
                                    className={styles.bubble__item} 
                                    activeClassName={styles.bubbleActive__item} 
                                    onChange={onImageSelected} 
                                    filter={{ name: imageSearch, directory: currentDirectory }} 
                                    fileView={{ type: "icons", direction: "list", iconSize: { width: 100, height: 100, scale:1.2 } }} 
                                    files={imagesFiles} 
                                />
                             
                            </div>
                            <div style={{ height: 10 }}>&nbsp;</div>
                        </div>
                    }
                </div>
            
        </div>
        
         
            
        </>
    )
}


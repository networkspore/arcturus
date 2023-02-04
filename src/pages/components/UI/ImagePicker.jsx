import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

import useZust from "../../../hooks/useZust";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import FileList from "./FileList";
import SelectBox from "./SelectBox";
import { ImageViewer } from "./ImageViewer";
import { errorSelectingImage, initDirectory, initStorage } from "../../../constants/systemMessages";
import { access } from "../../../constants/constants";
import { get } from "idb-keyval";
import { useNavigate } from "react-router-dom";



export const ImagePicker = (props ={}) =>{
    const searchInputRef = useRef()
    const accessRef = useRef()
    const textRef = useRef()
    const titleRef = useRef()
    //const pickerID = useId()
    const user = useZust((state) => state.user)
    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
   
    

    const localDirectory = useZust((state) => state.localDirectory)
    const imagesDirectory = useZust((state) => state.imagesDirectory)
    const loadingStatus = useZust((state) => state.loadingStatus)
    const addSystemMessage = useZust((state) => state.addSystemMessage)
    const [viewImage, setViewImage] = useState(null)
    const [imageSelected, setImageSelected] = useState(null);
    const [imageSearch, setImageSearch] = useState("")
    const [directoryOptions, setDirectoryOptions] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState("")
    const [filesFocus, setFilesFocus] = useState(false)
    const userFiles = useRef({value:[]})

    const getUserFiles = async (userID) => {
        const uFiles = await get(userID + "userFiles")
       userFiles.current.value = uFiles
    }

    useEffect(() => {
        getUserFiles(user.userID)
    }, [user])

   useLayoutEffect(() => {
    console.log(imagesDirectory)
        if (imagesDirectory.directories != null) {
            console.log(imagesDirectory.directories)
            const options = []

            options.push({ value: null, label: "All" })
            if (Array.isArray(imagesDirectory.directories)) {
                imagesDirectory.directories.forEach(directory => {
                    if (directory != null) {
                        if ("name" in directory) {
                            options.push({ value: directory.name, label: directory.name })
                        }
                    }
                });
            }

        
            setDirectoryOptions(options)
        }
    }, [imagesDirectory])

    const navigate = useNavigate()

    useEffect(() => {
        if (configFile.handle == null) {
            
            addSystemMessage(initStorage)
            navigate(-1)
        }
    }, [configFile])

    useEffect(()=>{
     
        if( props.selectedImage != undefined && props.selectedImage.hash != null)
        {
           
            const hash = props.selectedImage.hash

            const index = userFiles.current.value.findIndex(file => file.hash == hash)


            const userImage = index == -1 ? props.selectedImage : userFiles.current.value[index]
           
            
            if("accessID" in userImage)
            {
                console.log(userImage.accessID)
                accessRef.current.setValue(userImage.accessID)
            } else if (accessRef.current != undefined) {
                console.log("setting public")
                accessRef.current.setValue(access.public)
            }
            if("title" in userImage){
                titleRef.current.value = userImage.title
            }else{
                titleRef.current.value = ""
            }
            if("text" in userImage){
                textRef.current.value = userImage.text
            }else{
                textRef.current.value = ""
            }
            
            setImageSelected(props.selectedImage)
        }else{
            if (accessRef.current) {
                console.log("setting public")
                accessRef.current.setValue(access.public)
            }
        } 
    },[props.selectedImage])




    const directoryChanged = (index) => {
        console.log(index)
        
        if (index != null && directoryOptions.length > 0) {
            const directoryName = directoryOptions[index].value
            setCurrentDirectory(directoryName)
        } else {
            setCurrentDirectory("")
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        
        if (name == "imageSearch") {
            if (value.length > 0) {
                setImageSearch(value)
            } else {
                if (imageSearch != "") setImageSearch("")
            }

        }

    }

   

    const onHashSelected = async (hash) => {
        
        

        const userFileindex = userFiles.current.value.findIndex(file => file.hash == hash)

        const allFiles = await get(user.userName + "arc.cacheFile")
        

        const index = allFiles.findIndex(files => files.hash == hash)

        

        const userImage = userFileindex != -1 ? userFiles.current.value[userFileindex] : index != -1 ? allFiles[index] : null


    
        if ("accessID" in userImage) {
         
            accessRef.current.setValue(userImage.accessID)
        } else if (accessRef.current != undefined) {
     
            accessRef.current.setValue(access.public)
        }
        if ("title" in userImage) {
            titleRef.current.value = userImage.title
        } else {
            titleRef.current.value = ""
        }
        if ("text" in userImage) {
            textRef.current.value = userImage.text
        } else {
            textRef.current.value = ""
        }
   
        setImageSelected(userImage)
       
    }

    const onCancelClick = (e) =>{
        props.onCancel()
    }

    const onOkClick = (e) =>{
        const accessID = accessRef.current.getValue
        const title = titleRef.current.value
        const text = textRef.current.value
        props.onOk({file:imageSelected, accessID:accessID, title:title, text:text, userAccess: ""})
    }

    return (
        <>
           

            <div style={{
                position: "fixed",
                left: pageSize.width /2,
                top: pageSize.height /2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                backgroundColor: "rgba(0,3,4,.95)",
                
            }}>
                <div style={{display:"flex", width:"100%"}}>
                    <div style={{ transform: "translate(10px,10px)", marginTop:15,  marginLeft: 10, height: 25, display: "flex", alignItems: "center", }}>
                        <SelectBox
                            className={styles.bubbleButton}
                            about={"Access Control"}
                            ref={accessRef}
                            style={{ width: 80 }}
                            textStyle={{
                                textAlign: "center",
                                padding: 4,

                                width: "100%",
                                color: "#ffffff",
                                fontFamily: "Webpapyrus",
                                border: 0,
                                fontSize: 14,
                            }}
                            optionsStyle={{
                                width: "100%",
                                marginLeft: 10,

                                paddingTop: 5,
                                fontSize: 14,
                                fontFamily: "webrockwell"
                            }}
                            placeholder="access"
                            options={[
                                { label: "Private", value: access.private },
                                { label: "Contacts", value: access.contacts },
                                { label: "Public", value: access.public }
                            ]} />

                    </div>
                <div style={{
                    display:"flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex:1,
                    fontFamily: "Webpapyrus",
                    fontSize: "20px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
                    }}> 
                        
                    Select an image</div>
                <div style={{ marginTop: 15, paddingBottom: 15, display: "flex", justifyContent: "right" }}>
                    <div style={{ margin: 3, backgroundColor: "#33333340", display: "flex", alignItems: "center" }}>
                        <input ref={searchInputRef} name={"imageSearch"} onChange={handleChange} style={{
                            color: "white",
                            backgroundColor: "#33333300",
                            fontFamily: "webpapyrus",
                            fontSize: 12,
                            width: 160,
                            outline: 0,
                            border: 0
                        }} type={"text"} />
                    </div>
                    <div style={{ margin: 3, width: "100%", display:"flex", alignItems:"center", justifyContent:"center",  }}>
                        <div style={{width:80}}>
                        <SelectBox onChange={directoryChanged} textStyle={{ backgroundColor: "#33333340", border: 0, outline: 0, color: "white" }} 
                        placeholder={"All"} 
                        options={directoryOptions} />
                            </div>
                      
                    </div>
                    <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                        cursor: "pointer",
                        marginTop:5,
                        marginRight:10,
                        marginLeft:10
                    }}>
                        <ImageDiv width={20} height={30} netImage={{ filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                    </div>
                </div>
                </div>
                <div style={{

       

                    display: "flex",

                    alignItems: "start",
                    justifyContent: "center",

                }}>
                    <div style={{ display: "flex" }}>

                        <div style={{ width:50 }}>&nbsp;</div>

                        <div >

                            <div style={{paddingTop:10, display: "flex", flexDirection: "column", alignItems: "center",  paddingBottom:20,   borderRadius:20 }}>
                              
                                <div style={{paddingTop:5, paddingBottom:5, flex: 1, width: 480, color:"white", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    
                                    <input ref={titleRef}  

                                    className={styles.bubble}
                                        placeholder={"Title"}
                                    style={{
                                        cursor:"text",
                                        padding:10,
                                        textAlign:"center",
                                        color: "white",
                                        backgroundColor: "#33333300",
                                        fontFamily: "webpapyrus",
                                        fontSize: 14,
                                        width: 160,
                                        outline: 0,
                                        border: 0
                                    }} type={"text"} />
                                </div>
                              
   {imageSelected &&

                                <>
                          
                                    <div style={{
                                        filter: "drop-shadow(0 0 5px #ffffff30) drop-shadow(0 0 10px #ffffff40)",
                                        display: "flex",
                                        flexDirection: "column",
                                        paddingBottom: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                     
                                    }}>
                                     
                                       
                                 
                                        <div onClick={(e)=>{setViewImage(imageSelected)}} style={{ cursor: "pointer" }}>
                                            <div style={{height:20, }}>&nbsp;</div>
                                            <ImageDiv
                                                width={400}
                                                height={400}
                                                about={imageSelected.name}
                                                style={{ textShadow: "2px 2px 2px black", overflow:"hidden" }}
                                                className={styles.bubble__item}
                                                netImage={{
                                                    scale: 1.15,
                                                    backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
                                                    borderRadius: 40,
                                                    backgroundColor: "",
                                                    update: {
                                                        command: "getImage",
                                                        file: imageSelected,
                                                        waiting: { url: "/Images/spinning.gif",  },
                                                        error: { url: "" },

                                                    }
                                                }}
                                            />
                                        </div>

                                   
                                       
                                    </div>
                                               
                                        
                             
                                   
                                </>
                  }
                  {!imageSelected &&
                                    <div style={{

                                   


                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <div style={{ height: 20,  }}>&nbsp;</div>
                                        <ImageDiv width={400} height={400} about={"Select Image"} style={{ textShadow: "2px 2px 2px black", }} className={styles.bubble__item} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", borderRadius: 40, backgroundColor: "", image: "" }} />
                                    </div>
                                }


                                <div style={{ width: 300, padding: 10, marginTop: 30 }} className={styles.bubble}>

                                    <textarea placeholder="Description..."
                                        rows={2}
                                        style={{ backgroundColor: "#00000000", resize: "none", fontSize: "13px", outline: 0, width: "100%", border: 0, color: "white", fontFamily: "Webrockwell" }}
                                        ref={textRef}
                                    />
                                </div>
                            </div>
                            
                            <div style={{ paddingBottom: 15 }}>

                                <div style={{
                                    justifyContent: "center",

                                    paddingTop: "10px",
                                    display: "flex",


                                }}>
                                    <div style={{ width: 90 }} className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

                                    <div style={{

                                        marginLeft: "10px", marginRight: "10px",
                                        height: "50px",
                                        width: "1px",
                                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                    }}>

                                    </div>
                                    <div style={{ width: 90 }} className={imageSelected != null ? styles.OKButton : styles.OKDisabled} onClick={onOkClick} >Ok</div>
                                </div>
                            </div>
                        </div>


                    </div>
           
                        <div style={{


                            display: "flex",
                            flexDirection: "column",
                            height:"100%",
                          
                        }}>
                       <div style={{}}>
                            <div style={{
                                backgroundImage: "linear-gradient(to bottom, #11111190, #050505C0)",
                                display:"flex",
                                }}>
                                <div style={{ width: 2, height: "100%", backgroundImage: "linear-gradient(to bottom, #000304DD, #33333333, #000304DD)", }}>&nbsp;</div>
                                <div style={{
                                    display: "flex",
                                    overflowX: "clip",
                                    overflowClipMarginX: 100,
                                    overflowY: "scroll",
                                    height: 620,
                                    width: 505,
                                    marginLeft:15,
                                    marginTop:15
                                }}>
                                <FileList
                                    width={490 }
                                    onDoubleClick={(e)=>{setViewImage(e)}}
                                    className={styles.bubble__item}
                                    activeClassName={styles.bubbleActive__item}
                                    onChange={onHashSelected}
                                    filter={{ name: imageSearch, mimeType:"image", directory: currentDirectory }}
                                    fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100, scale:1.2 } }}
                                   
                                />
                                </div>
                            </div>

                        </div>
                    </div>
                    
                </div>

            </div>

            {viewImage != null &&
                <ImageViewer errorImage={"/Images/icons/person.svg"} currentImage={viewImage} close={() => { setViewImage(null) }} />
            }

        </>
    )

}
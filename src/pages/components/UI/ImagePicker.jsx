import React, { useState, useRef, useEffect, useId } from "react";

import useZust from "../../../hooks/useZust";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import FileList from "./FileList";
import SelectBox from "./SelectBox";
import produce from "immer";

import { errorSelectingImage, initDirectory, initStorage } from "../../../constants/systemMessages";
import { access } from "../../../constants/constants";


export const ImagePicker = (props ={}) =>{
    const searchInputRef = useRef()
    const accessRef = useRef()
    const pickerID = useId()

    const pageSize = useZust((state) => state.pageSize)
    const configFile = useZust((state) => state.configFile)
    const imagesFiles = useZust((state) => state.imagesFiles)
    const localDirectory = useZust((state) => state.localDirectory)
    const imagesDirectory = useZust((state) => state.imagesDirectory)
    const addFileRequest = useZust((state) => state.addFileRequest)
    const addSystemMessage = useZust((state) => state.addSystemMessage)

    const [imageSelected, setImageSelected] = useState(null);
    const [imageSearch, setImageSearch] = useState("")
    const [directoryOptions, setDirectoryOptions] = useState([])
    const [currentDirectory, setCurrentDirectory] = useState("")
   
    useEffect(() => {
        if (imagesDirectory.directories != null) {

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

    useEffect(() => {
        if (localDirectory.handle != null) {
            const config = configFile.value;

            if (config == null) {
             
                addSystemMessage(initStorage)
         
            }

        } else {
            alert("Local storage required")
            addSystemMessage(initDirectory)
       
        }
    }, [configFile, localDirectory])

    useEffect(()=>{
        props.selectedImage
        if( props.selectedImage != undefined && props.selectedImage.crc != null)
        {
           
            const userImage = props.selectedImage

            console.log(userImage)
            if("accessID" in userImage)
            {
                console.log(userImage.accessID)
                accessRef.current.setValue(userImage.accessID)
            } else if (accessRef.current != undefined) {
                console.log("setting public")
                accessRef.current.setValue(access.public)
            }
            setImageSelected(props.selectedImage)
        }else if(accessRef.current != undefined){
            console.log("setting public")
            accessRef.current.setValue(access.public)
        }
    },[props.selectedImage])




    const directoryChanged = (index) => {
        console.log(index)
        if (directoryOptions.length > 0) {
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

   

    const onImageSelected = (e) => {
        const img = imagesFiles[e];

        if (img != undefined) {
            if ("crc" in img) {
              
                setImageSelected(img)

            } else {
                setImageSelected(null)
                addSystemMessage(errorSelectingImage)
            }
        } else {
            addSystemMessage(errorSelectingImage)
        }
    }

    const onCancelClick = (e) =>{
        props.onCancel()
    }

    const onOkClick = (e) =>{
        const accessID = accessRef.current.getValue
        props.onOk({file:imageSelected, accessID:accessID, userAccess:""})
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
                backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
                
            }}>
                <div style={{display:"flex", width:"100%"}}>
                    <div style={{ marginLeft: 12,marginTop:6,width:80 }}>  <ImageDiv width={20} height={25} netImage={{ opacity: .8, image: "/Images/icons/image-outline.svg", filter: "invert(100%)" }} /></div>
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
                        <SelectBox onChange={directoryChanged} textStyle={{ backgroundColor: "#33333340", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={directoryOptions} />
                            </div>
                    </div>
                    <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                        cursor: "pointer"
                    }}>
                        <ImageDiv width={30} height={30} netImage={{ filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                    </div>
                </div>
                </div>
                <div style={{

       

                    display: "flex",

                    alignItems: "center",
                    justifyContent: "center",

                }}>
                    <div style={{ display: "flex" }}>

                        <div style={{ width: 90 }}>&nbsp;</div>

                        <div >

                            <div style={{}}>
                             
                                <div style={{ width: "100%", height: 30, paddingTop: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <SelectBox
                                        className={styles.bubbleButton}
                                        about={"Access Control"}
                                        ref={accessRef}
                                        style={{ width: 150 }}
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
                                            widtH: "100%",
                                            backgroundColor: "#333333C0",
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
                           
   {imageSelected &&

                            
                            
                                    <div style={{
                                        filter: "drop-shadow(0 0 5px #ffffff30) drop-shadow(0 0 10px #ffffff40)",
                                        display: "flex",
                                        flexDirection: "column",
                                        paddingBottom: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      
                                    }}>
                                     
                                       
                                 
                                        <div style={{ cursor: "pointer" }}>
                                            <div style={{height:50, }}>&nbsp;</div>
                                            <ImageDiv
                                                width={300}
                                                height={300}
                                                about={imageSelected.name}
                                                style={{ textShadow: "2px 2px 2px black", overflow:"hidden" }}
                                                className={styles.bubbleActive__item}
                                                netImage={{
                                                    scale: 1.15,
                                                    backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
                                                    borderRadius: 40,
                                                    backgroundColor: "",
                                                    update: {
                                                        command: "getImage",
                                                        file: imageSelected,
                                                        waiting: { url: "/Images/spinning.gif" },
                                                        error: { url: "" },

                                                    }
                                                }}
                                            />
                                        </div>

                                   

                                    </div>
                            
                  }
                  {!imageSelected &&
                                    <div style={{

                                   


                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <div style={{ height: 50,  }}>&nbsp;</div>
                                        <ImageDiv width={300} height={300} about={"Select Image"} style={{ textShadow: "2px 2px 2px black", }} className={styles.bubble__item} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", borderRadius: 40, backgroundColor: "", image: "" }} />
                                    </div>
                                }


                            </div>
                            
                            <div style={{ paddingBottom: 15 }}>

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
                                    <div style={{ width: 100 }} className={imageSelected != null ? styles.OKButton : styles.OKDisabled} onClick={onOkClick} >Ok</div>
                                </div>
                            </div>
                        </div>


                    </div>
           
                        <div style={{


                            display: "flex",
                            flexDirection: "column",


                        }}>
                            
                            <div style={{marginBottom:20, justifyContent: "center", display: "flex", width: 300, height: 430, overflowX: "visible", overflowY: "scroll", color: "white", }}>
                                <FileList
                                    className={styles.bubble__item}
                                    activeClassName={styles.bubbleActive__item}
                                    onChange={onImageSelected}
                                    filter={{ name: imageSearch, directory: currentDirectory }}
                                    fileView={{ type: "icons", direction: "list", iconSize: { width: 100, height: 100, scale:1.2 } }}
                                    files={imagesFiles}
                                />
                            </div>

                        </div>
                    
                </div>

            </div>



        </>
    )

}
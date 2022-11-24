import React, { useState, useRef, useEffect } from "react";

import useZust from "../../../hooks/useZust";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import FileList from "./FileList";
import SelectBox from "./SelectBox";
import produce from "immer";

import { errorSelectingImage, initDirectory, initStorage } from "../../../constants/systemMessages";
import { useId } from "react";

export const ImagePicker = (props ={}) =>{
    const searchInputRef = useRef()
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

    const updateImage = (response) => {

    }

    useEffect(()=>{
        if(imageSelected != null && !("value" in imageSelected))
        {
            const index = imagesFiles.findIndex(img => img.crc == imageSelected.crc)

            if(index != -1)
            {
                setImageSelected(imagesFiles[index])
            }
        }
        
    },[imagesFiles,imageSelected])

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
    const pickerID = useId()

   

    const onImageSelected = (e) => {
        const img = imagesFiles[e];

        if (img != undefined) {
            if ("crc" in img) {
                if(!("value" in img)){
                    addFileRequest({ command: "getImage", page: "imagePicker", id: img.crc , file: img, callback: updateImage })
                }
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

    }

    const onOkClick = (e) =>{

    }

    return (
        <>
            <div style={{
                position: "fixed",
                alignItems: "center",
                justifyContent: "center",
                width: pageSize.width - 95,
                display: "flex",
                left: 95,
                top: 0,
                flexDirection: "column",
                paddingTop: "15px",
                paddingBottom: "5px",
                fontFamily: "Webpapyrus",
                fontSize: "20px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",

            }}>
                <div>Select an image</div>
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
                    <div style={{ display: "flex" }}>

                        <div style={{ width: 90 }}>&nbsp;</div>

                        <div >

                            <div style={{ marginTop: 50, }}>
                                <div style={{ height: 20 }}></div>
                               
                           
   {imageSelected &&
                               
                                    <div style={{
                                        filter: "drop-shadow(0 0 5px #ffffff30) drop-shadow(0 0 10px #ffffff40)",
                                        display: "flex",
                                        flexDirection: "column",
                                        paddingBottom: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      
                                    }}>
                                     

                                 
                                        <div style={{ cursor: "pointer" }} onClick={onImageSelected}>
                                            <ImageDiv
                                                width={200}
                                                height={200}
                                                about={imageSelected.name}
                                                style={{ textShadow: "2px 2px 2px black", }}
                                                className={imageSelected.name.length > 15 ? styles.activeBubbleScroll__item : styles.bubbleActive__item}
                                                netImage={{
                                                    scale: 1,
                                                    backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
                                                    borderRadius: 40,
                                                    backgroundColor: "",
                                                    image: "value" in imageSelected ? imageSelected.value :  imageSelected.icon
                                                }}
                                            />
                                        </div>

                                   

                                    </div>

                  }
                  {!imageSelected &&
                                    <div style={{

                                        display: "flex",


                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <ImageDiv width={300} height={300} about={"Select Image"} style={{ textShadow: "2px 2px 2px black", }} className={styles.bubble__item} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", borderRadius: 40, backgroundColor: "", image: "" }} />
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
                                    <div style={{ width: 100 }} className={imageSelected != null ? styles.OKButton : styles.OKDisabled} onClick={onOkClick} >Ok</div>
                                </div>
                            </div>
                        </div>


                    </div>
           
                        <div style={{


                            display: "flex",
                            flexDirection: "column",


                        }}>
                            <div style={{ marginTop: 15, paddingBottom: 15, display: "flex", justifyContent: "right" }}>
                                <div style={{ margin: 3, backgroundColor: "#33333340", display: "flex", alignItems: "center" }}>
                                    <input ref={searchInputRef} name={"imageSearch"} onChange={handleChange} style={{
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
                            <div style={{ justifyContent: "center", display: "flex", width: 300, height: 400, overflowX: "visible", overflowY: "scroll", color: "white", }}>
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
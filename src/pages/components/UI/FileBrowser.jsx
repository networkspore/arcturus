import React, { useState, useRef, useEffect } from "react"
import { get } from "idb-keyval"
import { typeOptions } from "../../../constants/constants"
import useZust from "../../../hooks/useZust"
import { ImageDiv } from "./ImageDiv"
import SelectBox from "./SelectBox"
import FileList from "./FileList"

import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom"

export const FileBrowser = (props = {}) =>{
    const searchInputRef = useRef()
    const directoryOptionsRef = useRef()

    const navigate = useNavigate()

    const [searchText, setSearchText] = useState("")
    const [currentMimeType, setCurrentMimeType] = useState("")
    const [currentType, setCurrentType] = useState("")
    const [allFiles, setAllFiles] = useState([])
   
    const localDirectory = useZust((state) => state.localDirectory)

    const clearSearch = () => {
        searchInputRef.current.value = ""

    }
    const directoryChanged = (option) => {
        const index = option

        if (index != null && typeOptions.length > 0) {
            const value = typeOptions[index].value

            setCurrentMimeType(value.mimeType)
            setCurrentType(value.type)
        }
    }
    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name == "searchText") {
            setSearchText(value)
        }
    }

    function onRefresh() {
      
        if (localDirectory.handle != null) {
            get("arc.cacheFile").then((files) => {

                if (files != undefined) {
                    setAllFiles(files)
                } else {
                    setAllFiles([])
                }
            })
        } else {
            setAllFiles([])
        }
    }


    const [selectedFile, setSelectedFile] = useState(null)
    const onfileSelected = (file) => {
        setSelectedFile(file)
    } 



    return (
       <div style={{
            position: "fixed",
            left: "50vw",
            top: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
            width:720
        }}>
            <div style={{
                display: "flex",
                height: "50px",
                backgroundColor: "#66666650",
                width:"100%",
                alignItems: "center",

            }}>

                <div onClick={(e) => {
                    props.onBack()

                }} about={"Back"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >

                    <img src={"/Images/icons/arrow-back-outline.svg"} width={20} height={20} style={{ filter: "Invert(100%" }} />

                </div>

                <div onClick={(e) => {
                    onRefresh()
                }} about={"Refresh"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >

                    <img src='/Images/icons/refresh-outline.svg' width={20} height={20} style={{ filter: "Invert(100%" }} />

                </div>


                <div style={{ width: 20 }}></div>
                <div style={{
                    height: 30,

                    display: "flex", justifyContent: "right", borderRadius: "30px",
                }}>


                    <div style={{ margin: 3, backgroundColor: "#33333320", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <input ref={searchInputRef} name={"searchText"} onChange={handleChange} style={{
                            color: "white",
                            backgroundColor: "#33333300",
                            fontFamily: "webpapyrus",
                            fontSize: 12,
                            width: 200,
                            outline: 0,
                            border: 0
                        }} type={"text"} />
                    </div>
                    <div style={{ width: 145, margin: 3 }}>
                       <SelectBox ref={directoryOptionsRef} onChange={directoryChanged} textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={typeOptions} />
                    </div>
                    <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer"
                    }}>
                        <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                    </div>


                </div>




            </div>
            <div style={{ height: 700, overflowY: "scroll", overflowX: "clip", overflowClipMargin: 100 }}>
                <FileList
                    width={480}

                    fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100 } }}
                    onChange={onfileSelected}
                    filter={{ name: searchText, mimeType: currentMimeType, type: currentType, loaded: true }}
                    files={allFiles}
                />
            </div>
        </div>
    )
}
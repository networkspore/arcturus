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

    const [width, setWidth] = useState(null)
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

    useEffect(()=>{
 
        if(props.width != undefined){
      
            setWidth(props.width)
        }
    },[props.width])
   // const typeRef = useRef({value:null})


 


    const [selectedFile, setSelectedFile] = useState(null)
    const onfileSelected = (file) => {
        setSelectedFile(file)
    } 



    return (
        <>
        {width != null &&
       <div  {... props}>
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
                       <SelectBox ref={directoryOptionsRef} defaultLabel={props.type} onChange={directoryChanged} textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"All"} options={typeOptions} />
                    </div>
                    <div onClick={(e) => { searchInputRef.current.focus() }} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer"
                    }}>
                        <ImageDiv width={20} height={20} netImage={{ backgroundColor: "", filter: "invert(100%)", image: "/Images/icons/search.svg" }} />
                    </div>


                </div>




            </div>
            <div style={{ height: 700, width:width, overflowY: "scroll", overflowX: "clip", overflowClipMargin: 100 }}>
                <FileList
                    width={width}

                    fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100 } }}
                    onChange={onfileSelected}
                    filter={{ name: searchText, mimeType: currentMimeType, type: currentType, loaded: true }}
                    
                />
            </div>
        </div>}
        </>
    )
}
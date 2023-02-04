import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useId } from "react";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom";
import produce from "immer";
import useZust from "../../../hooks/useZust";
import { ImageViewer } from "./ImageViewer";
import IconFile from "./IconFile";

import { get } from "idb-keyval";
import RowFile from "./RowFile";


const FileList = (props = {}, ref) => {
    const idHeader = window.crypto.randomUUID()
    if (props == null) props = {};
    const onChange = "onChange" in props ? props.onChange : null;
    const dbRef = useRef({value:null})
   // const [getRef, setRef] = useDynamicRefs()

    //const fileListID = useId()

    const divRef = useRef()
    const navigate = useNavigate()
    const [list, setList] = useState(null);
    const localDirectory = useZust((state)=> state.localDirectory)

    const pageSize = useZust((state) => state.pageSize)

    const longClassName = ("longClassName" in props) ? props.longClassName : styles.bubbleScroll__item
    const activeLongClassName = ("activeLongClassName" in props) ? props.activeLongClassName : styles.activeBubbleScroll__item

    const iconClassName = ("iconClassName" in props) ? props.iconClassName : styles.bubbleIcon;
    const activeIconClassName = ("activeIconClassName" in props) ? props.activeIconClassName : styles.activeBubbleIcon;

    const className = ("className" in props) ? props.className : styles.bubble__item;


    const activeClassName = ("activeClassName" in props) ? props.activeClassName : styles.bubbleActive__item;

    const filesStyle = { zIndex: "9999", textAlign: "left", color: "#cdd4da", position: "absolute", cursor: "pointer", backgroundColor: "rgba(20,23,24,.7)", };
    const rowStyle = { margin: "0px 10px 10px 10px", display: "flex", alignItems: "center", flex: 1, }
    const textStyle = { color: "white", paddingTop: 10, fontFamily: "webrockwell", display: "flex", alignItems: "center", justifyContent: "center" };
    const tableStyle = {
        display: "flex",
        flexDirection: "column",
        maxHeight: 500,
        overflowY: "scroll",
        flex: 1,
        backgroundColor: "#33333322",

        color: "#cdd4da"
    }

    const [selectedHash, setSelectedHash] = useState(null);
    //const [files, setFiles] = useState([]);
   
    const loadingStatus = useZust((state) => state.loadingStatus)


    if ("tableStyle" in props) {
        let optionsArray = Object.getOwnPropertyNames(props.tableStyle);

        optionsArray.forEach(element => {
            tableStyle[element] = props.tableStyle[element];
        });
    }



    if ("filesStyle" in props) {
        let optionsArray = Object.getOwnPropertyNames(props.filesStyle);

        optionsArray.forEach(element => {
            filesStyle[element] = props.filesStyle[element];
        });
    }


    if ("textStyle" in props) {
        let optionsArray = Object.getOwnPropertyNames(props.textStyle);

        optionsArray.forEach(element => {

            textStyle[element] = props.textStyle[element];
        });
    }


    const fileView = useRef({ value: { type: "details", direction: "row", iconSize: { width: 100, height: 100, scale: 1 } } })

    useEffect(() => {
        if ("fileView" in props) {

            
                let optionsArray = Object.getOwnPropertyNames(props.fileView);
                let op = {}
                optionsArray.forEach(element => {
                    op[element] = props.fileView[element]
                })
                fileView.current.value = op
              
           
        }  
        if (onChange != null) {
            if (lastHash.current.value != selectedHash) {
                lastHash.current.value = selectedHash;



            }
        }
        if(divRef.current){ 
            onRefresh()
         }
    }, [props.fileView,localDirectory, divRef.current, selectedHash])



  
    const refreshing = useRef({ value: false })
    useEffect(() => {
        if (!refreshing.current.value) {
            refreshing.current.value = true;

            setTimeout(() => {
                onRefresh()
                refreshing.current.value = false
            }, 500);
        }
    }, [loadingStatus])

    const user = useZust((state) => state.user)
    const onRefresh = async () =>{
    
        

        if (localDirectory.handle != null) {
           
            const files = await get(user.userName + "arc.cacheFile") 
         
            if (files != undefined) {
                //  setFiles();
                setAllFiles(files)
            } else {
                setAllFiles([])
                //  setFiles([])
            }
         
        } else {
            setAllFiles([])
           // setFiles([])
        }
    }

    const onBlur = (e) => {

        if (e.relatedTarget == null) {
         
            setSelectedHash(null)
        } else {
            const prevId = e.relatedTarget.id
            const prevIdSlice = prevId != null && prevId.length > idHeader.length ? prevId.slice(0, idHeader.length) : prevId
            
        
     
            if (prevIdSlice == idHeader) {
             
            } else {

       
                setSelectedHash(null)
            }
        }


    }
 



    function setAllFiles(files){
        var array = [];
   
        const filter = props.filter != undefined ? props.filter : { name: "", directory: "", type: "" }
        let rows = null

        if (files != null) {
            // const bounds =  divRef.current.getBoundingClientRect() 
            const width = props.width != undefined ? props.width : 600
            const floor = Math.floor(width / (fileView.current.value.iconSize.width + 20))
            const numColumns = fileView.current.value.direction == "row" ? floor == 0 ? 1 : floor : 1;
            const numRows = files.length > 0 && numColumns != 0 ? Math.ceil(files.length / numColumns) : 1
          
            rows = new Array(numRows)

            if (rows != null) {
                for (let i = 0; i < rows.length; i++) {
                    rows[i] = new Array(numColumns)
                }
            }

            const scale = "scale" in fileView.current.value.iconSize ? fileView.current.value.iconSize.scale : 1

            const backgroundColor = "backgroundColor" in fileView.current.value.iconSize ? fileView.current.value.iconSize.backgroundColor : "#33333390"
            const backgroundImage = "backgroundImage" in fileView.current.value.iconSize ? fileView.current.value.iconSize.backgroundImage : ""
            let j = 0;
            let currentRow = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files[i]

                const iName = file.name + "";
                const iDirectoryName = ("directory" in file) ? file.directory.name : null;
                const mimeType = ("mimeType" in file) ? file.mimeType : "";
                const iType = ("type" in file) ? file.type : "";
                const iLoaded = ("loaded" in file) ? file.loaded : false

                const filterName = (filter.name != undefined && filter.name != null && filter.name != "");
                const filterDirectory = (filter.directory != undefined && filter.directory != null && filter.directory != "")
                const filterMimeType = (filter.mimeType != undefined && filter.mimeType != null && filter.mimeType != "")
                const filterType = (filter.type != undefined && filter.type != null && filter.type != "")
                const filterLoaded = (filter.loaded != undefined && filter.loaded != null && file.loaded != "")



                let show = false;

                if (filterDirectory) {
                    show = iDirectoryName == filter.directory

                }
                show = filterDirectory == show;

                if (show && filterMimeType) {
                    show = mimeType == filter.mimeType
                }
                if (show && filterType) {
                    const ftLen = filter.type.length
                    const iLen = iType.length

                    if (iLen > ftLen) {
                        show = iType.slice(0, ftLen) == filter.type
                    } else {
                        show = iType == filter.type
                    }

                }

                if (show && filterName) {
                    const lowerName = iName.toLowerCase();
                    const lowerFilterName = filter.name.toLowerCase();
                    show = lowerName.includes(lowerFilterName)

                }

                if (show && filterLoaded) {
                    show == iLoaded == filter.loaded
                }




                if (show) {
                    const iSize = formatBytes(file.size)
                    const iModified = formatedNow(new Date(file.lastModified));

                    const iType = ("type" in file) ? file.type : "";

                    const iTo = "to" in file ? file.to : null
                    const iHandle = file.handle;
                    const iIcon = ("icon" in file) ? file.icon : "/Images/icons/document-outline.svg";
                    const iHash = ("hash" in file) ? file.hash : null

                    const update = iTo == null ? {
                        command: "getIcon",
                        file: file,
                        waiting: { url: "/Images/spinning.gif", style: { filter: "" } },
                        error: { url: "/Images/icons/document-outline.svg", style: { filter: "invert(100%)" } },

                    } : null

                    const iImage = iTo == null ? {
                        filter: "",
                        scale: scale,
                        backgroundColor: backgroundColor,
                        backgroundImage: backgroundImage,
                        image: iIcon,
                        borderRadius: 15,
                        update: update,
                    } : file.netImage
                    // if(update != null) iImage.update = update


                    switch (fileView.current.value.type) {
                        case "icons":
                            switch (fileView.current.value.direction) {
                                case "row":


                                    if (rows != null && numColumns != 0) {
                                        const rowIndex = currentRow
                                        const columnIndex = j

                                        j += 1
                                        if (!(j < numColumns)) {
                                            j = 0
                                            currentRow = currentRow + 1
                                        }
                                      
                                       
                                        if (!isNaN(rowIndex) && !isNaN(columnIndex)) {
                                            rows[rowIndex][columnIndex] = <IconFile
                                                hash={iHash}
                                                key={iHash}
                                                name={iName}
                                                netImage={iImage}
                                                height={fileView.current.value.iconSize.height}
                                                width={fileView.current.value.iconSize.width}

                                                onDoubleClick={(e) => {
                                                    if (props.onDoubleClick != undefined) {
                                                        props.onDoubleClick(file)
                                                    }
                                                }}
                                               
                                                idHeader={idHeader}
                                                onFocus={(e) => {
                                                  
                                                    setSelectedHash(iHash)
                                                  
                                                }}
                                                onBlur={onBlur}
                                                className={iHash == selectedHash ? activeIconClassName : iconClassName}
                                                onClick={(e) => { e.stopPropagation() }}
                                                selected={selectedHash == iHash}
                                            />
                                        }
                                    }
                                    break;
                                case "list":
                                default:

                                    // iImage.scale = 1;
                                    array.push(
                                        <IconFile
                                            key={iHash}
                                            name={iName}
                                            netImage={iImage}
                                            height={fileView.current.value.iconSize.height}
                                            width={fileView.current.value.iconSize.width}

                                            onDoubleClick={(e) => {
                                                if (props.onDoubleClick != undefined) {
                                                    props.onDoubleClick(file)
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                               
                                            }}
                                            onBlur={onBlur}
                                            className={iHash == selectedHash ? activeIconClassName : iconClassName}

                                            selected={iHash == selectedHash}
                                        />

                                    )

                            }
                            break;
                        case "details":
                        default:

                            array.push(
                                <RowFile 
                                    key={i} 
                                    hash={iHash}
                                    style={{ width: "100%", display: "flex", paddingLeft: 0 }} 
                                    className={styles.result} 
                                    tabIndex={i}
                                    name={iName}
                                    netImage={iImage}
                                    height={fileView.current.value.iconSize.height}
                                    width={fileView.current.value.iconSize.width}

                                    onDoubleClick={(e) => {
                                        if (props.onDoubleClick != undefined) {
                                            props.onDoubleClick(file)
                                        }
                                    }}
                                    
                                    idHeader={idHeader}
                                    onFocus={(e) => {
                                        
                                        setSelectedHash(iHash)
                                    }}
                                    onBlur={onBlur}
                                    
                                    onClick={(e) => { e.stopPropagation() }}
                                    selected={iHash == selectedHash}
                                />
                                    
                                
                            )
                            break;
                    }
                }

            }

        }
        if (fileView.current.value.type == "icons" && fileView.current.value.direction == "row") {
            array = []
            for (let i = 0; i < rows.length; i++) {
                array.push(
                    <div key={i} style={{ display: "flex" }}>
                        {rows[i]}
                    </div>
                )
            }
        }

        setList(array)
    }

    useImperativeHandle(
        ref,
        () => ({
            getSelectedHash: selectedHash,
            setSelectedHash: (hash) => {


                setSelectedHash(hash)
            },
        }), [selectedHash]);


    const lastHash = useRef({ value: null })






    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    function formatedNow(now = new Date(), small = false) {

        const year = now.getUTCFullYear();
        const month = now.getUTCMonth()
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();
        const miliseconds = now.getUTCMilliseconds();

        const stringYear = year.toString();
        const stringMonth = month < 10 ? "0" + month : String(month);
        const stringDay = day < 10 ? "0" + day : String(day);
        const stringHours = hours < 10 ? "0" + hours : String(hours);
        const stringMinutes = minutes < 10 ? "0" + minutes : String(minutes);
        const stringSeconds = seconds < 10 ? "0" + seconds : String(seconds);
        const stringMiliseconds = miliseconds < 100 ? (miliseconds < 10 ? "00" + miliseconds : "0" + miliseconds) : String(miliseconds);


        const stringNow = stringYear + "-" + stringMonth + "-" + stringDay + " " + stringHours + ":" + stringMinutes;



        return small ? stringNow : stringNow + ":" + stringSeconds + ":" + stringMiliseconds;
    }



    return (
        <>
            <div ref={divRef} style={{ minHeight: props.minHeight == undefined ? "" : props.minHeight, display: "flex", flexDirection: "column", flex: 1, alignItems: fileView.current.value.direction == "list" ? "center" : "" }} >
                {fileView.current.value.type == "details" &&
                    <div style={{ display: "flex", flex: 1, flexDirection: "column", }}>
                        <div style={{ display: "flex", flex: 1 }}>

                            <div style={{ flex: 0.1, color: "#777777", }}>&nbsp;</div>
                            <div style={{ flex: 0.2, color: "#777777", }}>Type</div>


                            <div style={{ flex: 1, color: "#777777", }}>Name</div>
                            <div style={{ flex: 0.4, maxWidth: 150, minWidth: 80, color: "#888888", whiteSpace: "nowrap", overflow: "clip", marginRight: 10 }}>Modified</div>
                            <div style={{ flex: 0.3, color: "#888888", display: "flex", whiteSpace: "nowrap", overflow: "clip", }}>Size</div>

                        </div>
                        <div style={{
                            marginBottom: '2px',
                            marginLeft: "10px",
                            height: "1px",
                            width: "100%",
                            backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                        }}>&nbsp;</div>
                    </div>
                }


                {list}


            </div>

        </>
    )
}

export default forwardRef(FileList);
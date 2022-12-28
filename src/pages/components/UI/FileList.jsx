import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useId } from "react";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom";
import produce from "immer";
import useZust from "../../../hooks/useZust";
import { ImageViewer } from "./ImageViewer";



const FileList = (props = {}, ref) => {
    if (props == null) props = {};
    const onChange = "onChange" in props ? props.onChange : null;

    
    //const fileListID = useId()
  
    const divRef = useRef()
    const navigate = useNavigate()
    const [list, setList] = useState(null);

    const pageSize = useZust((state) => state.pageSize)

    const longClassName = ("longClassName" in props) ? props.longClassName : styles.bubbleScroll__item
    const activeLongClassName = ("activeLongClassName" in props) ? props.activeLongClassName : styles.activeBubbleScroll__item
    
    const iconClassName = ("iconClassName" in props) ? props.iconClassName : styles.bubbleIcon;
    const activeIconClassName = ("activeIconClassName" in props) ? props.activeIconClassName : styles.activeBubbleIcon;

    const className = ("className" in props) ? props.className : styles.bubble__item;


    const activeClassName = ("activeClassName" in props) ? props.activeClassName : styles.bubbleActive__item;
    
    const filesStyle = { zIndex: "9999", textAlign: "left", color: "#cdd4da", position: "absolute", cursor: "pointer", backgroundColor: "rgba(20,23,24,.7)",  };
    const rowStyle = { margin: "0px 10px 10px 10px", display: "flex", alignItems: "center", flex:1, }
    const textStyle = { color: "white", paddingTop: 10, fontFamily: "webrockwell", display: "flex", alignItems: "center", justifyContent: "center" } ;
    const tableStyle = {
        display: "flex",
        flexDirection: "column",
        maxHeight: 500, 
        overflowY: "scroll",
        flex: 1,
        backgroundColor: "#33333322",
        
        color: "#cdd4da"
    }



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

    const [selectedHash, setSelectedHash] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileView, setFileView] = useState({type:"details",direction:"row", iconSize:{width:100,height:100, scale:1}})

    useEffect(() => {

        if ("files" in props) {
            setFiles(props.files);
            lastHash.current.value =  null
        }
        
    }, [props.files])

    useEffect(()=>{
        if ("fileView" in props) {
            
            setFileView(produce((state)=>{
                let optionsArray = Object.getOwnPropertyNames(props.fileView);

                optionsArray.forEach(element => {
                    state[element] = props.fileView[element]
                })
            }))
        }
    },[props.fileView])

    

    useEffect(() => {

        var array = [];
      
        let rows = null 
    
        if (files != null) {
          
            const filter = "filter" in props ? props.filter : { name: "", directory: "", type: "", loaded: false }
           // const bounds =  divRef.current.getBoundingClientRect() 
            const width = props.width != undefined ? props.width : 600
            const floor = Math.floor( width / (fileView.iconSize.width + 20))
            const numColumns = fileView.direction == "row" ? floor == 0 ? 1 : floor  : 1 ;
            const numRows =  files.length > 0 && numColumns != 0 ? Math.ceil(files.length / numColumns) : 1 
            rows = new Array(numRows)

            if(rows != null)
            {
                for(let i = 0; i < rows.length ; i++)
                {
                    rows[i] = new Array(numColumns)
                }
            }
            
            const scale = "scale" in fileView.iconSize ? fileView.iconSize.scale : 1
        
            const backgroundColor = "backgroundColor" in fileView.iconSize ? fileView.iconSize.backgroundColor : ""
            const backgroundImage = "backgroundImage" in fileView.iconSize ? fileView.iconSize.backgroundImage : ""
            let j = 0;
            let currentRow = 0;
         
            for(let i = 0; i < files.length; i ++){
                const file = files[i]

                const iName = file.name + "";
                const iDirectoryName = ("directory" in file) ? file.directory.name : null;
                const mimeType = ("mimeType" in file) ? file.mimeType : "";
                const iType = ("type" in file) ? file.type : "";
                const iLoaded = ("loaded" in file) ? file.loaded : false 
             
                const filterName = (filter.name != undefined && filter.name != null && filter.name != "" );
                const filterDirectory = (filter.directory != undefined && filter.directory != null && filter.directory != "")
                const filterMimeType = (filter.mimeType != undefined && filter.mimeType != null && filter.mimeType != "" )
                const filterType = (filter.type != undefined && filter.type != null && filter.type != "" )
                const filterLoaded = filter.loaded != undefined 
                
               
            
                let show = false;

                if(filterDirectory){
                    show = iDirectoryName == filter.directory

                }
                show = filterDirectory == show;

                if (show && filterMimeType)
                {
                    show = mimeType == filter.mimeType
                }
                if (show && filterType) {
                    const ftLen = filter.type.length
                    const iLen = iType.length

                    if(iLen > ftLen)
                    {
                        show = iType.slice(0, ftLen) == filter.type
                    }else{
                        show = iType == filter.type
                    }
                     
                }

                if(show && filterName)
                {
                    const lowerName = iName.toLowerCase();
                    const lowerFilterName = filter.name.toLowerCase();
                    show = lowerName.includes(lowerFilterName)
   
                }
         
                if (show && filterLoaded )
                {
                    
                    show = iLoaded == filter.loaded
                }


            

                if( show || iType == "link")
                {
                    const iSize = formatBytes(file.size)
                    const iModified = formatedNow(new Date(file.lastModified));
                    
                    const iType = ("type" in file) ? file.type : "";
          
                    const iTo = "to" in file ? file.to : null
                   // const iHandle = file.handle;
                    
                    
               
                    const iHash = ("hash" in file) ? file.hash : null

                    const iApplication = "application" in file ? file.application : undefined
                    
                    const staticIcon = ("icon" in file) ? file.icon : undefined

                    let iIcon = staticIcon != undefined ? staticIcon : ""

                    if(staticIcon == undefined)
                    {
                        switch(iApplication)
                        {
                            case "image":
                                iIcon = "/Images/icons/image-outline.svg"
                                break;
                            case "video":
                                iIcon = "/Images/icons/film-outline.svg"
                                break;
                            case "audio":
                                iIcon = "/Images/icons/musical-notes-outline.svg"
                                break;
                            default:
                                iIcon = "/Images/icons/document-outline.svg"
                        }
                    }
                    
                    const update = iTo == null ? {
                        command: "getIcon",
                        file: file,
                        waiting: { url: "/Images/spinning.gif", },
                        error: { url: iIcon, style: { filter: "invert(100%)" } },

                    } : null

                    const iImage = iTo == null ? {
                        scale: scale,
                        backgroundColor: backgroundColor,
                        backgroundImage: backgroundImage,
                        image: iIcon, 
                        borderRadius:15,
                        update: update,
                    } : file.netImage
                   // if(update != null) iImage.update = update
                 
             
                    switch(fileView.type)
                    {
                        case "icons":
                            switch(fileView.direction)
                            {
                                case "row":
                                  

                                    if(rows != null && numColumns != 0)
                                    {
                                        const rowIndex = currentRow
                                        const columnIndex = j
                                  
                                        j += 1
                                        if (!(j < numColumns))
                                        {
                                            j = 0
                                            currentRow = currentRow + 1
                                        }

                                                                          
                                        if (!isNaN(rowIndex) && !isNaN(columnIndex))
                                        {
                                            rows[rowIndex][columnIndex] = <div 
                                                onDoubleClick={(e) => {
                                                    if(props.onDoubleClick != undefined)
                                                    {
                                                        props.onDoubleClick(file)
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (iTo == null) {
                                                        setSelectedHash(iHash)
                                                    } else {
                                                        navigate(iTo)
                                                    }
                                                }}
                                            
                                            key={i} style={{ overflow: "clip", maxWidth: 120, overflowClipMargin: iHash == selectedHash ? 100 : 0,  zIndex: iHash == selectedHash ? 99:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}><ImageDiv key={i}
                                            style={{ margin: 10, overflow: "hidden", opacity:iLoaded ? 1 : .7 }}
                                            
                                            className={iHash == selectedHash ? activeIconClassName  : iconClassName}
                                            height={fileView.iconSize.width}
                                            width={fileView.iconSize.height}
                                            netImage={iImage}
                                            
                                            /><div style={{ textShadow: iHash == selectedHash ? "1px 1px 3px white" : "",  display: "flex", alignItems:"center", fontFamily:"webpapyrus", fontSize:"12", whiteSpace: "nowrap", padding: 10, background: "black", color:"white"  }}>
                                                {iHash == selectedHash ? iName : iName.length > 11 ? iName.slice(0,11) + ".." : iName }
                                            </div>
                                           
                                        </div>}
                                    }
                                break;
                                case "list":
                                default:
                       
                                   // iImage.scale = 1;
                                    array.push(
                                        <div onDoubleClick={(e) => {
                                            if (props.onDoubleClick != undefined) {
                                                props.onDoubleClick(file)
                                            }
                                        }} onClick={(e) => {
                                            e.stopPropagation()
                                            if (iTo == null) {
                                                setSelectedHash(iHash)
                                            } else {
                                                navigate(iTo)
                                            }
                                        }} key={i} style={{ overflowX: "clip", overflowClipMargin: iHash == selectedHash ? 100 : 0,  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <ImageDiv 
                                            style={{ margin: 10,  }}
                                             
                                           
                                            className={iHash == selectedHash ? activeIconClassName : iconClassName}
                                            height={fileView.iconSize.width}
                                            width={fileView.iconSize.height}
                                            netImage={iImage}

                                            /><div style={{ textShadow: iHash == selectedHash ? "1px 1px 3px white" : "", display: "flex", alignItems: "center", fontFamily: "webpapyrus", fontSize: "12", whiteSpace: "nowrap", padding: 10, background: iHash == selectedHash ? "black" : "#00000050", color: "white" }}>
                                                {iHash == selectedHash ? iName : iName.length > 11 ? iName.slice(0, 11) + ".." : iName}
                                            </div>

                                        </div>
                                        
                                    )

                            }
                            break;
                        case "details":
                        default:
                            
                            array.push(
                                <div  key={i} style={{ width: "100%", display: "flex", paddingLeft: 0 }} className={styles.result} tabIndex={i} 
                                    onDoubleClick={(e) => {
                                        if (props.onDoubleClick != undefined) {
                                            props.onDoubleClick(file)
                                        }
                                    }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (iTo == null) {
                                        setSelectedHash(iHash)
                                    } else {
                                        navigate(iTo)
                                    }
                                    //  setSelectedIndex(Number(index))
                                }}>
                                    <div style={{ flex: 0.1, alignItems:"center", justifyContent:"center" }}>
                                        {iImage != null &&

                                            <ImageDiv width={20} height={20} style={{borderRadius: 5, overflow:"hidden"}} netImage={iImage} />

                                        }
                                    </div>
                                    <div style={{ flex: 0.2, color: "#888888", }}>{mimeType}</div>
                             
                                    <div style={{ flex: 1, color: "white", }}>{iName}</div>
                                    <div style={{ flex: 0.4, maxWidth:150, minWidth:80, color: "#888888", whiteSpace:"nowrap", overflow:"clip", marginRight:10}}>{mimeType == "link" ?"" :  iModified.slice(0,16)}</div>
                                    <div style={{ flex: 0.3, color: "#888888", display: "flex", whiteSpace: "nowrap", overflow: "clip",  }}>{mimeType == "link" ? "" : iSize}</div>
                                </div>
                            )
                            break;
                    }
                }
                     
            }
            
        }
        if (fileView.type == "icons" && fileView.direction == "row")
        {
            array = []
            for(let i = 0; i < rows.length ; i ++)
            {
                array.push(
                    <div key={i} style={{display:"flex"}}>
                        {rows[i]}
                    </div>
                )
            }
        }
     
        setList( array)

    }, [files, selectedHash, props, fileView, props.filter])


    useImperativeHandle(
        ref,
        () => ({
            getSelectedHash: selectedHash,
            setSelectedHash: (hash) => {


                setSelectedHash(hash)
            },

          
            setFiles: (value) => {

                setFiles(value)
            },
            getFiles: files,
        }), [selectedHash, files]);


    const lastHash = useRef({ value: null })

    useEffect(() => {

        if (onChange != null) {
            if (lastHash.current.value != selectedHash){
                lastHash.current.value = selectedHash;

                onChange(selectedHash);
             
            }
        }

    }, [selectedHash])



 

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
        <div onClick={(e)=>{setSelectedHash(null)}} ref={divRef} style={{display:"flex", flexDirection:"column",  flex:1, alignItems: fileView.direction == "list" ? "center" :""}} >
            {fileView.type == "details" &&
                <div style={{ display: "flex", flex: 1, flexDirection:"column", }}>
                    <div style={{ display: "flex", flex:1 }}>
        
                        <div style={{ flex: 0.1, color: "#777777", }}>&nbsp;</div>
                        <div style={{ flex: 0.2, color: "#777777", }}>Type</div>
                    
                    
                        <div style={{ flex: 1, color: "#777777", }}>Name</div>
                            <div style={{ flex: 0.4, maxWidth: 150, minWidth:80, color: "#888888", whiteSpace: "nowrap", overflow: "clip", marginRight: 10 }}>Modified</div>
                            <div style={{ flex: 0.3, color: "#888888", display: "flex", whiteSpace: "nowrap", overflow: "clip",  }}>Size</div>

                    </div>
                    <div style={{
                        marginBottom:'2px',
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
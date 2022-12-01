import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useId } from "react";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom";
import produce from "immer";
import useZust from "../../../hooks/useZust";




const FileList = (props = {}, ref) => {
    if (props == null) props = {};
    const onChange = "onChange" in props ? props.onChange : null;

    
    const fileListID = useId()
  
    const divRef = useRef()
    const navigate = useNavigate()
    const [list, setList] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const longClassName = ("longClassName" in props) ? props.longClassName : styles.bubbleScroll__item
    const activeLongClassName = ("activeLongClassName" in props) ? props.activeLongClassName : styles.activeBubbleScroll__item
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

    const [selectedCrc, setSelectedCrc] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileView, setFileView] = useState({type:"details",direction:"row", iconSize:{width:100,height:100, scale:1}})

    useEffect(() => {

        if ("files" in props) {
            setFiles(props.files);
            lastIndex.current.index =  -1
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
        const filter = props.filter != undefined ? props.filter : {name:"", directory:""}
        let rows = null 
    
        if (files != null && divRef.current) {
            const bounds = divRef.current != null ? divRef.current.getBoundingClientRect() : null

            const numColumns = fileView.direction == "row" ? bounds != null ? Math.floor(bounds.width / fileView.iconSize.width) : null : null;
            const numRows = numColumns != null ? numColumns != 0 ? Math.ceil(files.length / numColumns) : 1 : null
            rows = numColumns != null && numRows != null && fileView.type == "icons" && fileView.direction == "row" ? new Array(numRows) : null

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
       
            files.forEach((file, i) => {
                const iName = file.name + "";
                const iDirectoryName = ("directory" in file) ? file.directory.name : null;
                
                let filterName = (filter.name != "" && filter.name != null);
                let filterDirectory = (filter.directory != "" && filter.directory != null)
              
                let show = false;
                if(filterDirectory){
                    show = iDirectoryName == filter.directory

                }
                show = filterDirectory == show;
                if(show && filterName)
                {
                    const lowerName = iName.toLowerCase();
                    const lowerFilterName = filter.name.toLowerCase();
                    show = lowerName.includes(lowerFilterName)
   
                }
            

                if( show)
                {
                    const iSize = formatBytes(file.size)
                    const iModified = formatedNow(new Date(file.lastModified));
                    
                    const iType = ("type" in file) ? file.type : "";
                    const iCrc = file.crc;
                    const iTo = "to" in file ? file.to : null
                    const iHandle = file.handle;
                    const iIcon = ("icon" in file) ? file.icon : "/Images/icons/document-outline.svg";
                    const mimeType = ("mimeType" in file) ? file.mimeType : "";
                    
                    const update = iTo == null ? {
                        command: "getIcon",
                        file: file,
                        waiting: { url: "/Images/spinning.gif", style: { filter: "invert(100%)" } },
                        error: { url: "/Images/icons/cloud-offline-outline.svg", style: { filter: "invert(100%)" } },

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
                                    if(rows != null)
                                    {
                                        const rowIndex = Math.floor(i/numColumns)
                                        const columnIndex = ((( i / numColumns ) -rowIndex) * numColumns)
                                        

                                        rows[rowIndex][columnIndex] = <ImageDiv key={i}
                                            style={{ margin: 10, overflow: "hidden" }}
                                            about={iName}
                                            onClick={(e) => {
                                                if (iTo == null) {
                                                    setSelectedIndex(i)
                                                } else {
                                                    navigate(iTo)
                                                }
                                            }}
                                            className={i == selectedIndex ? iName.length > 15 ? activeLongClassName : activeClassName : iName.length > 15 ? longClassName : className}
                                            height={fileView.iconSize.width}
                                            width={fileView.iconSize.height}
                                            netImage={iImage}
                                            
                                        />
                                    }
                                break;
                                case "list":
                                default:
                                    
                                    iImage.scale = 1;
                                    array.push(
                                        <div key={i} style={{paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10,width:fileView.iconSize.width, height:fileView.iconSize.height}}  >
                                        <ImageDiv 
                                        
                                             about={iName}
                                                className={i == selectedIndex ? iName.length > 15 ? activeLongClassName : activeClassName : iName.length > 15 ? longClassName : className}
                                            onClick={(e) => {
                                                if (iTo == null) {
                                                    setSelectedIndex(i)
                                                } else {
                                                    navigate(iTo)
                                                }}} 
                                            style={{overflow:"hidden"}}
                                            height={fileView.iconSize.width} 
                                            width={fileView.iconSize.height} 
                                            netImage={iImage} 
                                        />
                                        </div>
                                        
                                    )

                            }
                            break;
                        case "details":
                        default:
                          
                            array.push(
                                <div key={i} style={{ width: "100%", display: "flex", paddingLeft: 0 }} className={styles.result} tabIndex={i} onClick={(e) => {

                                    if (iTo == null) {
                                        setSelectedIndex(i)
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
                                    <div style={{ flex: 0.2, color: "#888888", }}>{iCrc}</div>
                                    <div style={{ flex: 1, color: "white", }}>{iName}</div>
                                    <div style={{ flex: 0.3, color: "#888888", }}>{iModified}</div>
                                    <div style={{ flex: 0.3, color: "#888888", }}>{iSize}</div>
                                </div>
                            )
                            break;
                    }
                }
                     
            })
            
        }
        if(rows != null)
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

    }, [files, selectedIndex, props.filter, fileView])

    useEffect(() => {

        const value = selectedCrc;
        if (value == -1 || value == null || value == undefined) {
            setSelectedIndex(-1);
        } else {
            if (files != null && files !== undefined) {
                if ("length" in files) {
                    files.forEach((element, i) => {
                        if (element.value == value) setSelectedIndex(i);
                    });
                }
            }
        }
    }, [selectedCrc,files])

    useImperativeHandle(
        ref,
        () => ({
            getName: files == null ? "" : selectedIndex == -1 ? "" : files[selectedIndex] === undefined ? "" : files[selectedIndex].name,
            getCrc: files == null ? -1 : selectedIndex == -1 ? -1 : files[selectedIndex] === undefined ? -1 : files[selectedIndex].crc,
            setByCrc: (crc) => {


                setSelectedCrc(crc)
            },
            setSelectedIndex: (value) => {
                if (value == -1 || value == null || value === undefined) {
                    setSelectedCrc(-1)
                } else if (value > -1) {
                    if (files != null) {
                        if (files.length > 0) {
                            setSelectedCrc(files[Number(value)].crc)
                        }
                    }
                }
            },
            selectedIndex: selectedIndex,
            selectedFile: files == null ? null : selectedIndex == -1 ? null : files[selectedIndex] === undefined ? null : files[selectedIndex],
            setFiles: (value) => {

                setFiles(value)
            },
            getFiles: files,
        }), [selectedIndex, files]);


    const lastIndex = useRef({ index: -1 })

    useEffect(() => {

        if (onChange != null) {
            if (lastIndex.current.index != selectedIndex){
                lastIndex.current.index = selectedIndex;

                onChange(selectedIndex);
             
            }
        }

    }, [selectedIndex])



 

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
        <div ref={divRef} style={{ overflowX: "clip" }}>
            {fileView.type == "details" &&
                <div style={{ display: "flex", flex: 1, flexDirection:"column", }}>
                    <div style={{ display: "flex", flex:1 }}>
        
                        <div style={{ flex: 0.1, color: "#777777", }}>&nbsp;</div>
                        <div style={{ flex: 0.2, color: "#777777", }}>Type</div>
                        <div style={{ flex: 0.2, color: "#777777", }} >CRC </div>
                    
                        <div style={{ flex: 1, color: "#777777", }}>Name</div>
                        <div style={{ flex: 0.3, color: "#777777", }}>Last Modified</div>
                        <div style={{ flex: 0.3, color: "#777777", }}>Size</div>

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
      
    )
}

export default forwardRef(FileList);
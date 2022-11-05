import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom";
import produce from "immer";


const FileList = (props = {}, ref) => {
    if (props == null) props = {};
    const onChanged = "onChanged" in props ? props.onChanged : null;
    const divRef = useRef()
    const navigate = useNavigate()
    const [list, setList] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

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
    const [fileView, setFileView] = useState({type:"list",direction:"row", iconSize:{width:100,height:100}})

    useEffect(() => {

        if ("files" in props) {
            setFiles(props.files);
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
        if (files != null && divRef.current) {
            const superBounds = divRef.current.getBoundingClientRect()
            
            const bounds = {width: superBounds.height < fileView.iconSize.width +20 ? fileView.iconSize.width + 20: superBounds.width,
                height: superBounds.height < fileView.iconSize.height +20 ? fileView.iconSize.height + 20 : superBounds.height }
            console.log(bounds)
            if(bounds.width != 0 && bounds.height != 0){
            switch(fileView.type)
            {
                case "icons":
                    const iconSize = "iconSize" in fileView ? fileView.iconSize : { width: 75, height: 75 }
                    if(fileView.direction != "column" ){
                        const columns = Math.floor(bounds.width / (iconSize.width +20))
                        const length = files.length;
                        let i = 0;

                        while(i < length)
                        {
                            let j = 0;
                            let innerRow = []
                            while(j < columns && i < length)
                            {
                                const iType = files[i].type;
                                const iImage = "netImage" in files[i] ? files[i].netImage : { image: iType == "folder" ? "/Images/icons/folder-outline.svg" : "/Images/icons/document-outline.svg",  filter: "invert(100%)" };
                                iImage.width = iconSize.width;
                                iImage.height = iconSize.height;
                                const iTo = "to" in files[i] ? files[i].to : null

                                const iName = files[i].name;
                                innerRow.push( 
                                    <div key={i} style={{ paddingLeft: 5, paddingRight: 5, marginBottom: 5, marginTop: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} className={styles.result} tabIndex={i} onClick={(e) => {

                                        if (iTo == null) {
                                            setSelectedCrc(files[i].crc)
                                        } else {
                                            navigate(iTo)
                                        }
                                        //  setSelectedIndex(Number(index))
                                    }}> 
                                        <ImageDiv width={iconSize.width } height={iconSize.height} netImage={iImage} />
                                        <div style={textStyle}>{iName}</div>
                                    </div>
                                )
                                i++;
                                j++;
                            }
                            const row = <div key={"row"+j} style={{ width: "100%", display: "flex", paddingLeft: 0 }} > {innerRow}</div>
                            array.push(row)
                        }
                    }else{
                        if(bounds.height > 0)
                        {
                            const rows = Math.floor(bounds.height / (iconSize.height + 50))
                        
                            const length = files.length;
                            let i = 0;  
                            

                            while (i < length) {
                                let j = 0;
                                let innerColumn = []
                                while (j < rows && i < length) {
                                    const iType = files[i].type;
                                    const iImage = "netImage" in files[i] ? files[i].netImage : { image: iType == "folder" ? "/Images/icons/folder-outline.svg" : "/Images/icons/document-outline.svg", filter: "invert(100%)" };
                                    iImage.width= iconSize.width - 30;
                                    iImage.height = iconSize.height
                                    const iTo = "to" in files[i] ? files[i].to : null

                                    const iName = selectedCrc == files[i].crc ? files[i].name : files[i].name.length > 9 ? files[i].name.slice(0,8) + "..." : files[i].name;
                                    innerColumn.push(
                                        <div key={i} style={{paddingLeft: 10, paddingRight: 10, marginBottom: 5, marginTop: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} className={styles.result} tabIndex={i} onClick={(e) => {

                                            if (iTo == null) {
                                                setSelectedCrc(files[i].crc)
                                            } else {
                                                navigate(iTo)
                                            }
                                            //  setSelectedIndex(Number(index))
                                        }}>
                                            <ImageDiv width={iconSize.width} height={iconSize.height} netImage={iImage} />
                                            <div style={{ paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{iName}</div>
                                        </div>
                                    )
                                    i++;
                                    j++;
                                }
                             
                                const column = <div key={"column" + j} style={{ width: iconSize.width, height:"100%", display: "flex", flexDirection:"column", paddingLeft: 0 }} > {innerColumn}</div>
                                array.push(column)
                            }
                        }
                    }
                    
                    break;
                default:
                    files.forEach((file, i) => {

                        const iSize = formatBytes(file.size)
                        const iModified = formatedNow(new Date(file.lastModified));
                        const iName = file.name;
                        const iType = file.type;
                        const iCrc = file.crc;
                        const iImage = "netImage" in file ? file.netImage : null;
                        const iTo = "to" in file ? file.to : null
                        
                            array.push(
                                <div key={i} style={{width:"100%", display:"flex", paddingLeft:0}} className={styles.result} tabIndex={i} onClick={(e) => {

                                    if(iTo == null){
                                        setSelectedCrc(file.crc)
                                    }else{
                                        navigate(iTo)
                                    }
                                    //  setSelectedIndex(Number(index))
                                }}>
                                    <div style={{ flex: 0.1 }}>
                                    {iImage != null &&
                                        
                                        <ImageDiv width={20} height={20} netImage={iImage} />
                                        
                                    }
                                    </div>
                                    <div style={{ flex: 0.2, color: "#888888", }}>{iType}</div>
                                    <div style={{ flex: 0.2, color: "#888888", }}>{iCrc}</div>
                                    <div style={{ flex: 1, color: "white", }}>{iName}</div>
                                    <div style={{ flex: 0.3, color: "#888888", }}>{iModified}</div>
                                    <div style={{ flex: 0.3, color: "#888888", }}>{iSize}</div>
                                </div>
                            )
                        
                    });
                }}
        }

        setList(array)

    }, [files, selectedCrc, fileView])

    useEffect(() => {

        const value = selectedCrc;
        if (value == -1) {
            setSelectedIndex(-1);
        } else if (value == null || value == undefined) {
        } else {
            if (files != null || files !== undefined) {
                if ("length" in files) {
                    files.forEach((element, i) => {
                        if (element.value == value) setSelectedIndex(i);
                    });
                }
            }
        }
    }, [selectedCrc])

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


    const lastCrc = useRef({ crc: -1 })

    useEffect(() => {

       
        if (onChanged != null) {
            if (selectedIndex != lastCrc.current.crc) {
                lastCrc.current.index = selectedCrc;
                onChanged(selectedCrc);
            }
        }

    }, [selectedIndex, files, selectedCrc])





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
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", marginLeft:30, marginRight:30}}>
            {fileView.type == "list" &&
                <div style={{ display: "flex", flex: 1, flexDirection:"column" }}>
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
            
                      
            <div ref={divRef} style={{display:"flex", width:"100%", height:"100%", flexDirection:fileView.direction == "row" ? "column" : "row"}}>
                    {list}
            </div>

        </div>
      
    )
}

export default forwardRef(FileList);
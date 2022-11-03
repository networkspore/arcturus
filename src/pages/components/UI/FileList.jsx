import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom";


const FileList = (props = {}, ref) => {
    if (props == null) props = {};
    const onChanged = "onChanged" in props ? props.onChanged : null;

    const navigate = useNavigate()
    const [list, setList] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const filesStyle = { zIndex: "9999", textAlign: "left", color: "#cdd4da", position: "absolute", cursor: "pointer", backgroundColor: "rgba(20,23,24,.7)",  };
    const rowStyle = { margin: "0px 10px 10px 10px", display: "flex", alignItems: "center", flex:1, }
    const textStyle = { backgroundColor: "rgba(0,0,0,0)", fontSize: "20px", fontFamily: "WebPapyrus", outline: 0, borderWidth: "0 0 2px", borderColor: "#ffe51c", color: "#D6BD00", textAlign: "left", width: "100%", cursor: "pointer" };
    const tableStyle = {
        display: "flex",
        flexDirection: "column",
        maxHeight: 500, 
        overflowY: "scroll",
        flex: 1,
        backgroundColor: "#33333322",
        
        color: "#cdd4da"
    }

    const defaultCrc = "defaultCrc" in props ? props.defaultCrc : null;
    
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


    useEffect(() => {

        if ("files" in props) {
            setFiles(props.files);
            if (defaultCrc != null) setSelectedCrc(defaultCrc)
        }
    }, [props])

    useEffect(() => {

  
        var array = [];
        if (files != null) {
            files.forEach((file, i) => {

                const iSize = file.size == null ? "" : formatBytes(file.size)
                const iModified = file.lastModified == null ? "" : formatedNow(new Date(file.lastModified));
                const iName = file.name;
                const iType = file.type;
                const iCrc = file.crc;
                const iImage = "netImage" in file ? file.netImage : null;
                const iTo = "to" in file ? file.to : null
                console.log(iImage)
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
        }
       
       
     

        setList(array)

    }, [files, selectedCrc])

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
          <div style={{display:"block", width:"100%"}}>

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
                      
                        <div style={{width:"100%"}}>
                             {list}
                        </div>

                </div>
      
    )
}

export default forwardRef(FileList);
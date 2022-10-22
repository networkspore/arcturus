import React, { useState, useRef, useEffect } from 'react';

import useZust from '../hooks/useZust';
import styles from './css/home.module.css'
import produce from 'immer';
import SelectBox from './components/UI/SelectBox';


export const AddImagePage = (props = {}) => {


    const pageSize = useZust((state) => state.pageSize)
    
    const reader = new FileReader();
    const imgArrayReader = new FileReader();

    const [imageName, setImageName] = useState("")
    const [fileSize, setFileSize] = useState("")
    const [fileLastModified, setFileLastModified] = useState("")
    const [fileType, setFileType] = useState("");
    const [imgWidth, setImgWidth] = useState("");
    const [imgHeight, setImgHeight] = useState("");

    const [scaleImgWidth, setScaleWidth] = useState("0px")
    const [scaleImgHeight, setScaleHeight] = useState("0px")
    const [fileInfo, setFileInfo] = useState({name:"",size:null, modified:null,type:null})

    const [imgFile, setImgFile] = useState(new Image())
    const [imgArrayFile, setImgArrayFile] = useState(null);


    const [imageSelected, setImageSelected] = useState(false); 


    function onCancelClick(e){
        props.cancel();
    }

    function onOKclick(e){

    }

    function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

   


    return (
        <div style={{
            position:"fixed", 
            top:(pageSize.height/2)-270, 
            left:(pageSize.width/2)-350,
            width: "700px", 
            height:"540px",
            backgroundColor: "#20232488",
        }}>
            <div style={{
                
                
                textAlign: "center",
                width: "100%",
                paddingTop: "20px",
                paddingBottom: "5px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(black, #20232422)",
                overflow:"hidden"
            }}>
                Add Image
            </div>

            <div style={{display:"flex", margin:"20px"}} >
                <div style={{flex:1, display: "block",padding:"10px", marginTop:"20px"}} > 
                    <div style={{ color: "#777171", paddingTop:"20px",paddingBottom: "10px", }}>Information:</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",   backgroundColor: "rgba(10, 13, 14, .6)", height:"230px" }}>
                        <div>
                        <div style={{ display: "flex", color:"#777171", fontFamily:"Webrockwell", fontSize:"14px"}} >
                            <div> <input value={imageName} type={"text"} style={{ height:"20px", textAlign:"center", border: "0px", color:"#777171", backgroundColor:"black"}} /> </div>
                            <div style={{paddingLeft:"20px"}} > Name </div>
                        </div>
                        <div style={{ display: "flex", color: "#777171", fontFamily: "Webrockwell", fontSize: "14px" , paddingTop: "20px" }} >
                            <div> <input value={fileSize} type={"text"} style={{ height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                            <div style={{ paddingLeft: "20px" }} > Size </div>
                        </div>
                        <div style={{ display: "flex", color: "#777171", fontFamily: "Webrockwell", fontSize: "14px",  paddingTop: "20px" }} >
                            <div> <input value={fileType} type={"text"} style={{ height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                            <div style={{ paddingLeft: "20px" }} > Type </div>
                        </div>
                        <div style={{ display: "flex", color: "#777171", fontFamily: "Webrockwell", fontSize: "14px", paddingTop: "20px" }} >
                            <div> <input value={fileLastModified} type={"text"} style={{ height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                            <div style={{ paddingLeft: "20px" }} > Modified </div>
                        </div>
                        <div style={{ display: "flex", color: "#777171", fontFamily: "Webrockwell", fontSize: "14px", paddingTop: "20px" }} >
                            <div> <input value={imageSelected ? imgWidth + "px x " + imgHeight + "px" : ""} type={"text"} style={{ height: "20px", textAlign: "center", border: "0px", color: "#777171", backgroundColor: "black" }} /> </div>
                            <div style={{ paddingLeft: "20px" }} > Dimensions </div>
                        </div>
                        </div>
                    </div>
                    
                    <div style={{textAlign:"right"}}>    
                            <input id="imageUpload" style={{ display: "none" }} type="file" accept="image/*" onChange={(e) => {
                          
                            const file = e.target.files[0];

                                reader.onload = () => {
                                   
                                    let tmpImg = new Image();
                                    tmpImg.onload = () => {
                                        const width = tmpImg.width;
                                        const height = tmpImg.height;
                                        setImageName(file.name)
                                        setFileLastModified(new Date(file.lastModified).toUTCString())
                                        setFileSize(formatBytes(file.size))
                                        setFileType(file.type)
                                        setImgWidth(width)
                                        setImgHeight(height)

                                        imgArrayReader.readAsArrayBuffer(file);

                                        if( width > 300 || height > 300)
                                        {
                                            

                                            if(width > height)
                                            {
                                                setScaleWidth("100%")
                                                const ratio = (350 / width) * height;
                                                setScaleHeight(ratio + "px");
                                            }else{
                                                setScaleHeight("100%")
                                                const ratio = (300 / height) * width;

                                                setScaleWidth(ratio + "px")
                                            }
                                          
                                            
                                           
                                        }else{
                                            setScaleWidth(width + "px")
                                            setScaleHeight(height + "px");
                                        }

                                        setImgFile(reader.result)

                                        setImageSelected(true);

                                        imgArrayReader.onload = () => {


                                            const uint = new Uint8Array(imgArrayReader.result)

                                            props.result({
                                                name: file.name,
                                                size: file.size,
                                                modified: file.lastModified,
                                                type: file.type,
                                                width: width,
                                                height: height,
                                                data: uint
                                            })

                                        }
                                    }
                                    tmpImg.src = reader.result;
                                }
                               
                                
                                
                                
                                reader.readAsDataURL(file);
                                
                            }} />
                            
                            <div style={{ paddingTop: "20px" }}>
                                <label style={{ padding: "6px 12px" }} for="imageUpload" className={styles.toolmenuButton} >Browse...</label>
                            </div>
                    </div>  
                            
                      
                        
                   
                </div>
                <div style={{display:"block", flex:1, margin:"20px", marginTop:"50px"}}>
                    <div style={{ display: "flex",alignItems:"center", justifyContent: "center", width: "300px", height: "300px", backgroundColor: "black", overflow: "hidden", borderRadius:"20px"}}>
                        {imageSelected ? <img src={imgFile} width={scaleImgWidth} height={scaleImgHeight} /> : "" }
                    </div>
                </div>
            </div>
            <div style={{justifyItems:"center",width:"700px", display:"flex"}}>
                <div style={{width:"320px"}}></div>
                <div className={imageSelected ? styles.OKButton : styles.OKDisabled} onClick={onOKclick} >OK</div>
                <div style={{ width: "210px" }}></div>
                <div className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>
            </div>
        </div>
    )

}
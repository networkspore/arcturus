import produce from "immer"
import { useEffect, useState, useRef } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from "./css/home.module.css"
import FileList from "./components/UI/FileList"

import { useNavigate } from "react-router-dom";
import { get } from "idb-keyval"
import SelectBox from "./components/UI/SelectBox"
import { typeOptions } from "../constants/constants"
import { ImagePicker } from "./components/UI/ImagePicker"
import { FileBrowser } from "./components/UI/FileBrowser"

export const AppsAdminPage = (props = {}) => {
    const fileUrlRef = useRef()
    const imageUrlRef = useRef()
    const nameRef = useRef()
    const openableRef = useRef()
    const descriptionRef = useRef()
    const advisoryRef = useRef()

    const fileTypeRef = useRef()

    const navigate = useNavigate()
    const [fullSize, setFullSize] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const [currentHeight, setCurrentHeight] = useState(720)
    const [currentWidth, setCurrentWidth] = useState(480)
    const pageSize = useZust((state) => state.pageSize)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const [availableApps, setAvailableApps] = useState([])
    const [showIndex, setShowIndex] = useState(0)

    const [currentImage, setCurrentImage] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)

    useEffect(()=>{
        setSocketCmd({cmd: "getAppList", params:{type:"", admin:true}, callback:(results)=>{
            if("success" in results && results.success && "admin" in results && results.admin ){
                setIsAdmin(true)
             

                    setAvailableApps(results.apps)
              
            }else{
                navigate("/apps")
            }
        }})
    },[])

    useEffect(() => {
        

            if (fullSize) {
               
                    setCurrentHeight(pageSize.height)
      
                    setCurrentWidth(pageSize.width)
             
            } else {
                setCurrentHeight(720)
                setCurrentWidth(480)
            }

      
    }, [fullSize])
    const toggleFullSize = (e) => {
        setFullSize(state => !state)

    }

    const onUpdateImage = (img) =>{
        const file = img.file
        const text = img.text
        const title = img.title
        const accessID = img.accessID
        const userAccess = img.userAccess

        const fileInfo = {
            name: file.name,
            hash: file.hash,
            size: file.size,
            type: file.type,
            mimeType: file.mimeType,
            lastModified: file.lastModified,
            title: title,
            text: text,
            accessID: accessID,
            userAccess: userAccess
        }
        setShowIndex(0)
        setCurrentImage(fileInfo)
    }

    return (
    
          <>
          {isAdmin && 
          <>
                <div style={{
                    left:95,
                    position:"fixed",
                    display: "flex",
                    alignItems: "center",
                 
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    width: "calc(100vw - 95px)",
                    height: 40

                }}>
                    <div style={{
                        display: "flex", height:30, transform:"translateY(-20px)", boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff40",
                        paddingRight:10,
                         }}>
                        <div className={styles.glow} onClick={(e) => {
                            navigate("/apps")
                        }} style={{
                            opacity: .7,
                            cursor: "pointer",
                            paddingLeft: "10px",
                            paddingTop: 5,
                            textAlign: "center",

                        }}><ImageDiv width={20} height={20} netImage={{ filter: "invert(100%)", image: "/Images/icons/close-outline.svg" }} />
                        </div>
                       
                       
                    </div>
                       
                    <div style={{
                        cursor: "default",
                        textAlign: "center",
                        width: "100%",
                     
                        paddingBottom: "5px",
                        fontFamily: "Webpapyrus",
                        fontSize: "20px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
}}>Application Editor</div>
                    <div style={{ width: 170,  display: "flex",  }}>
                       &nbsp;
                    </div>
                </div>
       {showIndex == 0 &&
                    <div  tabIndex={0} id='AppAdmin' style={{
                        outline: 0,
                        position: "fixed",
                        zIndex: 100,
                   
                        left: "50vw",
                        top: "50%",
                        padding: 5,

                        transform: "translate(-50%,-50%)",
                        boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                        backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
  
                    }}>

                    <div style={{width:600, height:250}}>

                    </div>
                        
    
                    
                        <div style={{ width: 600, }}>
                            <div style={{  paddingTop: 5, width: "100%", backgroundColor: "#33333330" }}>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Name:
                                    </div>
                                    <div style={{ flex: .5 }}><input
                                        ref={nameRef}
                                        placeholder={"name"}
                                        type={"text"} style={{
                                            textAlign: "left",
                                            outline: 0,
                                            border: 0,
                                            color: "white",
                                            width: 200,
                                            fontSize: "14px",
                                            backgroundColor: "#00000060",
                                            fontFamily: "webrockwell",
                                            padding: 4,
                                        }}
                                    /> </div>


                                </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 90, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Image:
                                    </div>
                                <div style={{ flex: .5 }}> <div onClick={(e) => {
                                    setShowIndex(1)
                                }} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", height: "150px", width: 200, padding: "10px" }}>
                                    <ImageDiv about={"Select Image"} className={styles.bubble__item} width={150} height={150} netImage={{
                                        scale: .97,
                                        update: {
                                            command: "getImage",
                                            file: currentImage,
                                            waiting: { url: "/Images/spinning.gif", style: { filter: "invert(0%)" } },
                                            error: { url: "/Images/icons/rocket-outline.svg", style: { filter: "invert(100%)" } },

                                        },
                                        backgroundColor: "#44444450",
                                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",

                                    }} />


                                </div></div>


                                </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Image Url:
                                    </div>
                                    <div style={{ flex: .5 }}><input
                                        ref={imageUrlRef}
                                        placeholder={"name"}
                                        type={"text"} style={{
                                            textAlign: "left",
                                            outline: 0,
                                            border: 0,
                                            color: "white",
                                            width: 200,
                                            fontSize: "14px",
                                            backgroundColor: "#00000060",
                                            fontFamily: "webrockwell",
                                            padding: 4,
                                        }}
                                    /> </div>


                                </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        File:
                                    </div>
                                    <div style={{ flex: .5 }}> <div className={styles.bubbleButton} onClick={(e) => { setShowIndex(2) }}>{currentFile == null ? "Pick a file" : currentFile.name + " " + currentFile.hash.slice(0, 5)}</div></div>


                                </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        File Url:
                                    </div>
                                    <div style={{ flex: .5 }}><input
                                        ref={fileUrlRef}
                                        placeholder={"File url"}
                                        type={"text"} style={{
                                            textAlign: "left",
                                            outline: 0,
                                            border: 0,
                                            color: "white",
                                            width: 200,
                                            fontSize: "14px",
                                            backgroundColor: "#00000060",
                                            fontFamily: "webrockwell",
                                            padding: 4,
                                        }}
                                    /> </div>


                                </div>

                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Openable File Types:
                                    </div>
                                    <div style={{ flex: .5 }}><input
                                        ref={openableRef}
                                        placeholder={"Openable list"}
                                        type={"text"} style={{
                                            textAlign: "left",
                                            outline: 0,
                                            border: 0,
                                            color: "white",
                                            width: 200,
                                            fontSize: "14px",
                                            backgroundColor: "#00000060",
                                            fontFamily: "webrockwell",
                                            padding: 4,
                                        }}
                                    /> </div>
                                    

                                </div>

                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                      
                                    </div>
                                <div style={{ flex: .5 }}>

                                    <SelectBox
                                        ref={fileTypeRef}
                                        textStyle={{
                                            color: "#ffffff",
                                            fontFamily: "Webrockwell",
                                            border: 0,
                                            fontSize: 14,
                                        }}

                                        optionsStyle={{
                                            backgroundColor: "#333333C0",
                                            paddingTop: 5,
                                            fontSize: 14,
                                            fontFamily: "webrockwell"
                                        }}

                                        placeholder="file types" options={typeOptions} />

                                </div>
                                    </div>
                               
                             


                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Content Advisory:
                                    </div>
                                    <div style={{ flex: .5, color: "#ffffffA0", fontSize: 12 }}>
                                        <SelectBox
                                            ref={advisoryRef}
                                            textStyle={{
                                                color: "#ffffff",
                                                fontFamily: "Webrockwell",
                                                border: 0,
                                                fontSize: 14,
                                            }}

                                            optionsStyle={{
                                                backgroundColor: "#333333C0",
                                                paddingTop: 5,
                                                fontSize: 14,
                                                fontFamily: "webrockwell"
                                            }}

                                            placeholder="advisory" options={[
                                                { value: -1, label: "None" },
                                                { value: 0, label: "General" },
                                                { value: 1, label: "Mature" },
                                                { value: 2, label: "Adult" }
                                            ]} />

                                    </div>
                                </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Description:
                                    </div>
                                    <div style={{ flex: 1, color: "#ffffffA0", fontSize: 13 }}>
                                        <textarea
                                            cols={45}
                                            rows={6}
                                            placeholder="Write a description..."
                                            style={{
                                                resize: "none",
                                                outline: 0,
                                                width: "90%",
                                                border: 0,
                                                backgroundColor: "#00000060",
                                                color: "white",
                                                fontFamily: "Webrockwell"
                                            }} ref={descriptionRef} />
                                    </div>

                                </div>
                               
                                <div style={{ height: 10 }} />

                            </div>
                            
                        </div>
                          
                           
                        </div>
                        }
                        {showIndex == 1 &&
                        <ImagePicker selectedImage={currentImage} onCancel={() => { setShowIndex(0) }} onOk={onUpdateImage} />
                        }
                        {showIndex == 2 &&
                        <FileBrowser onBack={()=>{setShowIndex(0)}}/>
                        }
                    </>   
            }
        </>
    )
}
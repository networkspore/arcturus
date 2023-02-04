import produce from "immer"
import { useEffect, useState, useRef } from "react"
import useZust from "../hooks/useZust"
import { ImageDiv } from "./components/UI/ImageDiv"
import styles from "./css/home.module.css"
import FileList from "./components/UI/FileList"

import { useNavigate } from "react-router-dom";
import { get } from "idb-keyval"
import SelectBox from "./components/UI/SelectBox"
import { allExtOptions, fileTypes, typeOptions } from "../constants/constants"
import { ImagePicker } from "./components/UI/ImagePicker"
import { FileBrowser } from "./components/UI/FileBrowser"
import aesjs from 'aes-js';
import WorkerBuilder from "../constants/WorkerBuilder";
import Worker from "../constants/coreWorker";
import { generateCode, getFileInfo, getRandomIntSync } from "../constants/utility"
import AppList from "./components/UI/AppList"


export const AppsAdminPage = (props = {}) => {
    const coreWorker = new WorkerBuilder(Worker)
    const [userFiles, setUserFiles] = useState([])
    const user = useZust((state) => state.user)
    
    const fileUrlRef = useRef()
    const imageUrlRef = useRef()
    const nameRef = useRef()
    const descriptionRef = useRef()
    const allExtensionsRef = useRef()
    const [extPlaceholder, setExtPlaceholder] = useState("None")
    const fileTypeRef = useRef()
    const keyWordsRef = useRef()
    const availableApps = useRef({value:[]})

    const navigate = useNavigate()
    const [fullSize, setFullSize] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const [currentHeight, setCurrentHeight] = useState(720)
    const [currentWidth, setCurrentWidth] = useState(480)
    const pageSize = useZust((state) => state.pageSize)
    const setSocketCmd = useZust((state) => state.setSocketCmd)
    
    const [showIndex, setShowIndex] = useState(0)

    const [currentImage, setCurrentImage] = useState(null)


    const localDirectory = useZust((state) => state.localDirectory)
    const [fileViewType, setFileViewType] = useState("icons")

    const [searchText, setSearchText] = useState("")
    const [currentMimeType, setCurrentMimeType] = useState("")
    const [currentType, setCurrentType] = useState("")
    const [openableList, setOpenableList] = useState([])

    const [allApps, setAllApps] = useState([])

    const [extensions, setExtensions] = useState([])

    const [selectedExt, setSelectedExt] = useState(null)
    const [exts, setExts] = useState(null)

    const [selectedFile, setSelectedFile] = useState(null)
    const [currentApp, setCurrentApp] = useState(null)
    
    const setFile = (fileName, type, bytes) => {
        return new Promise(resolve => {

                const msg = { cmd: "setFile", name: fileName, bytes: bytes, type: type }
                coreWorker.onmessage = (e) => {

                    const result = e.data
                    console.log(result)
                    switch (result.cmd) {
                        case "setFile":
                            resolve(result)
                            break;
                    }
                }

                coreWorker.postMessage(msg)

          

        })
    }
    const removeFile = (fileName, type) => {
        return new Promise(resolve => {
            const msg = { cmd: "removeFile", name: fileName, type: type }
            coreWorker.onmessage = (e) => {

                const result = e.data

                switch (result.cmd) {
                    case "removeFile":

                        resolve(true)

                        break;
                }
            }
            coreWorker.postMessage(msg)
        })
    }

    const getDirectory = (directory) => {
        return new Promise(resolve => {
            const msg = { cmd: "getDirectory", directory: directory }
            coreWorker.onmessage = (e) => {

                const result = e.data

                switch (result.cmd) {
                    case "getDirectory":

                        resolve(result)

                        break;
                }
            }
            coreWorker.postMessage(msg)
        })
    }


    const getAllApps = () =>{
        setSocketCmd({cmd:"checkOnline", params:{}, callback:(online)=>{
            console.log("online", online)
       
        setSocketCmd({cmd:"getAppList", params:{mimeType:""}, callback:(result)=>{
            if("success" in result && result.success){
                setAllApps(result.apps)
            }
        }})
        }
        })
    }
  

    useEffect(()=>{
        getAllApps()
    },[user])



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
    const onfileSelected = (e) =>{
        const hash = e.selectedHash
        const fileIndex = allApps.findIndex(apps => apps.hash == hash)

        setCurrentApp(allApps[fileIndex])
    }

    useEffect(()=>{
        console.log(currentApp)
        if(currentApp != null){
            setCurrentImage(currentApp.image)
            setSelectedFile(currentApp)
          //  setExts()
            setExts(currentApp.app.extensions)
             
            nameRef.current.value = currentApp.app.name
            descriptionRef.current.value = currentApp.app.description
            keyWordsRef.current.value = currentApp.app.keyWords
        }else{
            nameRef.current.value = ""
            setCurrentImage(null)
            setSelectedFile(null)
            setExts(null)
        }
    },[currentApp])

    const onUpdateImage = (img) =>{
        const file = img.file

        const fileInfo = {
            name: file.name,
            hash: file.hash,
            size: file.size,
            type: file.type,
            mimeType: file.mimeType,
            lastModified: file.lastModified,
        }
        setShowIndex(0)
        setCurrentImage(fileInfo)
    }

    const onRemoveExt = (e) =>{
        
        if(extensions.length > 0){
            
            const selectedIndex = exts.findIndex(ex => ex == selectedExt)
          
            if (selectedIndex > -1){ 
                removeExt(selectedIndex)
              
            }
        }
    }

    const removeExt = (index) => setExts(produce((state)=>{
        if(state.length == 1){
            state.pop()
        }else{
            state.splice(index, 1)
        }
        setSelectedExt(null)
    }))

    const setDefaultTypes = (e) =>{
 
        if(e !=null && e > -1){
           const typeOption =  fileTypeRef.current.options[e]

          switch(e){
            case 0:
                  setExtPlaceholder(typeOption.label)
                  setExtensions([])
                break;
            case 1:
                  setExtPlaceholder(typeOption.label)
                  setExts(fileTypes.all)
                break;
            case 2:
                  setExtPlaceholder(typeOption.label)
                  setExts(fileTypes.app)
                break;
            case 3:
                  setExtPlaceholder(typeOption.label)
            
                  setExts(fileTypes.image)
                break;
            case 4:
                setExtPlaceholder(typeOption.label)
           
         
                  setExts(fileTypes.media)
                break;
            case 5:
                  setExtPlaceholder(typeOption.label)
                  
                  setExts(fileTypes.video)
                break;
            case 6:
                  setExtPlaceholder(typeOption.label)
          
                  setExts(fileTypes.audio)
                break;
            case 7:
                  setExtPlaceholder(typeOption.label)
                 
                 
                  setExts(fileTypes.model)
                break;
            case 8:
                  setExtPlaceholder(typeOption.label)
                  setExts(fileTypes.asset)
                break;
          }
            //extensionsRef.current.options = newExts
          
        
        }
    }
  
    useEffect(() =>{
        if(exts != null)
        {
            let values = []
            exts.forEach(ex => {
                const ext = ex
                if(!values.find(ex => ex.key == ext)){
                values.push(
                    <div key={ext} onClick={(e)=>{
                        if(selectedExt == ext){ 
                            
                            setSelectedExt(null)

                        }else{
                        
                            setSelectedExt(ext)
                    }
                    }} style={{width:"100%",color:ext==selectedExt ? "#FFFFFF" :"", backgroundColor:ext == selectedExt ? "#33333350" : ""}} className={styles.result}>
                        {ext}
                    </div>
                )}
            });
            
            setExtensions(values)
    
        }else{
            setExtensions([])
        }
    },[exts,selectedExt])

    const [saveName, setSaveName] = useState(null)
   

    const onSelectFile = async (e) =>{
        try {
           
            const handle = await window.showOpenFilePicker({multiple:false})
            console.log(handle)
            const file = await handle[0].getFile()
         
            const fileInfo = await getFileInfo(file, handle, null)
            console.log(handle, file, fileInfo)
            setSelectedFile(fileInfo)

        } catch (error){

            if (error == DOMException.ABORT_ERR) {

            }
          console.log(error)
        }

    }

    useEffect(()=>{
        if(selectedFile != null){
            fileUrlRef.current.value = `/apps/${selectedFile.name}`
        }else{
            fileUrlRef.current.value = ""
        }
    },[selectedFile])

    useEffect(()=>{
        if (currentImage != null)
        {
            imageUrlRef.current.value = `/apps/images/${currentImage.name}`
        } else {
            imageUrlRef.current.value = ""
        }
    },[currentImage])

    async function createFile(e) {

        const phraseString = await generateCode(getRandomIntSync(500,1050))
        if (phraseString != "" && phraseString.length > 10) {
            try {
                const nameRefValue = nameRef.current.value

                const suggestedName = nameRefValue.replace(/\s+/g, '-').toLowerCase() + ".arcapp"
                
                const handle = await window.showSaveFilePicker({
                    id: "newApps", suggestedName:suggestedName});

              
                //const file = await handle.getFile()

                setSaveName(await handle.name)

       
                const phraseBytes = aesjs.utils.utf8.toBytes(phraseString)


                const fileStream = await handle.createWritable()

                await fileStream.write(phraseBytes)


                await fileStream.close()



            } catch (error) {
                if (error == DOMException.ABORT_ERR) {

                }
                setSaveName(null)
            }
        } else {

        }
    }
    const onCreated = async (result) =>{
        if("success" in result && result.success)
        {
            const file = result.file
          
            setAllApps(produce((state)=>{
                state.push(file)
            }))
        }
    }

    const onCreate = (e) =>{
        try{
            console.log(selectedFile, currentImage, nameRef.current.value)
            if( selectedFile != null && currentImage != null && nameRef.current.value.length > 2)
            {
                console.log(selectedFile)
                const file = selectedFile
                const img = currentImage
                const description = descriptionRef.current.value
                const name = nameRef.current.value
                const extsJson = JSON.stringify(exts)
                const fileUrl = fileUrlRef.current.value
                const imageUrl = imageUrlRef.current.value
                const keyWords = keyWordsRef.current.value


                
                const fileInfo = {
                    name: file.name,
                    hash: file.hash,
                    size: file.size,
                    type: file.type,
                    mimeType: file.mimeType,
                    lastModified: file.lastModified,
                }

                const imageInfo = {
                    name: img.name,
                    hash: img.hash,
                    size: img.size,
                    type: img.type,
                    mimeType: img.mimeType,
                    lastModified: img.lastModified,
                }
         
                const cmd = {
                    cmd: "createApp", params: {
                        name: name,
                        description: description,
                        extensions: extsJson,
                        keyWords:keyWords,
                        image: imageInfo,
                        imageUrl: imageUrl,
                        file: fileInfo,
                        fileUrl: fileUrl
                    }, callback: onCreated
                }
                console.log(cmd)
                setSocketCmd(cmd)
            }else{
                alert("Check input")
            }
        }catch(err){
            console.log(err)
        }
    }

    return (
    
          <>
          {user.admin && 
          <>
                <div style={{
                    left:95,
                    position:"fixed",
                    display: "flex",
                    alignItems: "center",
                    top:0,
                    fontFamily: "WebRockwell",
                    fontSize: "18px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314",
                    width: "calc(100vw - 95px)",
                 

                }}>
                    <div style={{
                        display: "flex", height:30,  boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff40",
                      
                         }}>
                        <div className={styles.bubbleButton} onClick={(e) => {
                            navigate("/apps")
                        }} style={{
                            opacity: .7,
                            cursor: "pointer",
                           
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
       
                    <div  tabIndex={0} id='AppAdmin' style={{
                        outline: 0,
                        position: "fixed",
                        left:  "50vw",
                        top: "50%",
                        padding: 5,
                        transform: "translate(-50%,-50%)",
                        boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                        backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>

                        <div style={{ height: 780, width: 480, overflowY: "scroll", overflowX: "clip", overflowClipMargin: 100, paddingRight: 15, }}>
                            <AppList
                                width={480}
                                minHeight={780}
                                fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100 } }}
                                onChange={onfileSelected}
                                filter={{ name: "", mimeType: "app", type: ""}}
                                files={allApps}
                            />
                        </div>
                        <div style={{ width: 600, }}>
                      
                            <div style={{ paddingLeft:10,  paddingTop: 5, width: "100%", backgroundColor: "#33333330" }}>
                            <div style={{ width: "100%", display: "flex" }}><div style={{ flex: 1 }}></div>
                                <div onClick={(e)=>{
                                    setCurrentApp(null)
                                }} className={styles.bubbleButton}
                                    style={{borderRadius:10, width:10, height:10}}
                                ><ImageDiv width={15} height={15} netImage={{
                                    backgroundColor:"",
                                    image:"/Images/icons/close-outline.svg", filter:"invert(75%)"}} /></div>
                            </div>
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
                                        update: currentImage != null ? {
                                            command: "getImage",
                                            file: currentImage,
                                            waiting: { url: "/Images/spinning.gif", style: { filter: "invert(0%)" } },
                                            error: { url: "/Images/icons/rocket-outline.svg", style: { filter: "invert(100%)" } },

                                        } : undefined,
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
                                    <div style={{ marginRight: 15, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        File:
                                    </div>
                                    <div onClick={createFile} style={{ marginRight:15}} className={styles.bubbleButton}>{saveName == null ? "Create File" : saveName}</div>
                                   
                                </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                       &nbsp;
                                    </div>
                                    <div style={{ display: "flex",
                                    color:"#777777", alignItems: "center", 
                                    paddingLeft: 10, marginTop: 5, marginBottom: 5, marginRight: 15, fontSize:14, fontFamily:"webrockwell",
                                    backgroundColor: "#00000060", width: 150 }} >{selectedFile != null ? selectedFile.name : "No file"}</div>
                                    <div onClick={onSelectFile} style={{ width: 100, }} className={styles.bubbleButton}>Select File</div>
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
                                    <div style={{ marginRight: 10, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                      Extensions:
                                    </div>
                                    <div style={{ backgroundColor: "#00000060",width:130, maxHeight:90, paddingRight:10, overflowX:"hidden",  overflowY:"scroll"}}>
                                        {extensions}

                                </div>
                                    <div onClick={onRemoveExt} style={{ paddingRight: 10 }}>
                                        <ImageDiv className={styles.bubbleButton} style={{ padding: 0 }} width={20} height={20} netImage={{ image: "/Images/icons/remove-circle-outline.svg", filter: extensions.length < 1 ? "invert(50%)" : "invert(100%)" }} />
                                    </div>
                                    <div style={{ paddingRight: 10 }} >
                                        <SelectBox
                                            ref={allExtensionsRef}
                                            textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} 

                                            optionsStyle={{
                                                backgroundColor: "#333333C0",
                                                paddingTop: 5,
                                                fontSize: 14,
                                                fontFamily: "webrockwell"
                                            }}

                                            placeholder="Select an extension" options={allExtOptions} />

                                </div>
                                    <ImageDiv className={styles.bubbleButton} style={{ padding: 0 }} width={20} height={20} netImage={{ image: "/Images/icons/add-circle-outline.svg", filter: "invert(100%)" }} />

                                    </div>
                               
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 10, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                       File Types:
                                    </div>
                                   
                                    <div style={{ paddingRight: 10 }}>
                                        <SelectBox onChange={setDefaultTypes} ref={fileTypeRef} textStyle={{ fontSize: 14, backgroundColor: "#33333320", border: 0, outline: 0, color: "white" }} placeholder={"Default types"} options={[{value:-1, label:"None"},...typeOptions]} />
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
                            <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                <div style={{ width: 15 }} />
                                <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                    Category:
                                </div>
                                <div style={{ flex: 1, color: "#ffffffA0", fontSize: 13 }}>
                                    <input
                                        ref={fileUrlRef}
                                        placeholder={"Category"}
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
                                    />
                                </div>

                            </div>
                                <div style={{ display: "flex", paddingTop: 15, width: "100%" }} >
                                    <div style={{ width: 15 }} />
                                    <div style={{ marginRight: 0, width: 120, fontSize: 14, display: "flex", color: "#ffffff80" }}>
                                        Key words:
                                    </div>
                                    <div style={{ flex: 1, color: "#ffffffA0", fontSize: 13 }}>
                                        <textarea
                                            cols={45}
                                            rows={2}
                                            placeholder="Key words / catetories"
                                            style={{
                                                resize: "none",
                                                outline: 0,
                                                width: "90%",
                                                border: 0,
                                                backgroundColor: "#00000060",
                                                color: "white",
                                                fontFamily: "Webrockwell"
                                            }} ref={keyWordsRef} />
                                    </div>

                                </div>
                                <div style={{display:"flex", alignItems:"center", justifyContent:"center", width:"100%", paddingTop: 15, paddingBottom:15}}>
                                {selectedFile == null || selectedFile != null && !("app" in selectedFile) ? <div style={{ width: 100 }} onClick={onCreate} className={styles.bubbleButton}>Create</div> : <div style={{ width: 100 }} className={styles.bubbleButton}> Update </div> }
                                </div>
                                <div style={{ height: 10 }} />

                            </div>
                            
                        </div>
                          
                           
                        </div>
                        
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
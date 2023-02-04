import React, { useState, useEffect, useRef  } from "react";

import { useLocation, useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";
import SelectBox from "./components/UI/SelectBox"
import { set } from "idb-keyval";

import { generateCode, getFileInfo, getPermissionAsync, getRandomInt, getRandomIntSync, getStringHash, getUintHash } from "../constants/utility";
import { access, constants } from "../constants/constants";
import { decrypt, generateKey } from 'openpgp';
import aesjs from 'aes-js';
import { termsOfService } from "../constants/termsOfService";
import WorkerBuilder from "../constants/WorkerBuilder";
import Worker from "../constants/coreWorker";

import { flushSync } from "react-dom";



export const InitStoragePage = (props = {}) => {

    const coreWorker = new WorkerBuilder(Worker)

    const location = useLocation()


    const phraseRef = useRef()

    const setSocketCmd = useZust((state) => state.setSocketCmd)
    //const [promptMe, setPromptMe] = useState(true)
    //const [keyDirectory, setKeyDirectory] = useState(null)
    const [keyFile, setKeyFile] = useState(null)
    //const [showMore, setShowMore] = useState(false)
    const [setupExisting, setSetupExising] = useState(true)
    const [rememberKey, setRememberKey] = useState(false)

    const setLocalDirectory = useZust((state) => state.setLocalDirectory)
    const setConfigFile = useZust((state) => state.setConfigFile)

    
    const navigate = useNavigate();

    const user = useZust((state) => state.user);

    const pageSize = useZust((state) => state.pageSize)


    const [valid, setValid] = useState(true);

    const [showIndex, setShowIndex] = useState(0)

    const [setupInfo, setSetupInfo] = useState(null)
    const [saveName, setSaveName] = useState(null)


   
    useEffect(()=>{

        if (location.state != undefined && location.state.localDirectory != undefined )
        {
            setSocketCmd({
                cmd: "getUserCode", params: {}, callback: async (userCodeHex) => {

                    if(typeof userCodeHex == "string"){
           
                        checkDirectoryKey(user, location.state.localDirectory)
                    }else{
                        navigate("/home/localstorage")
                    }
            }})

        }else{
            navigate("/home/localstorage")
        }
    },[location, user])



    async function onRememberKey(e){

        setRememberKey(prev => !prev)
    }

   

    const removeSystemMessage = (id) => useZust.setState(produce((state) => {
        const length = state.systemMessages.length;
        if (length > 0) {
            if (length == 1) {
                if (state.systemMessages[0].id == id) {

                    state.systemMessages.pop()

                }
            } else {
                for (let i = 0; i < state.systemMessages.length; i++) {
                    if (state.systemMessages[i].id == id) {
                        state.systemMessages.splice(i, 1)
                        break;
                    }
                }
            }
        }

    }))

   

    async function getLocalPermissions(){
        const opts = { mode: 'readwrite' };
        
        const verified = await setupInfo.directory.queryPermission(opts)
            if (verified === 'granted') {
                return true
            }else{
                const isVerified = await setupInfo.directory.requestPermission(opts)
                
                return isVerified === 'granted'
                                
            }
        
    }

    const updateKey = (userName, key) =>{
        return new Promise(resolve =>{
            if (rememberKey) {

                const coreBytes = Uint8Array.from(Array.from(keyFile).map(letter => letter.charCodeAt(0)));
                const aesCtr = new aesjs.ModeOfOperation.ctr(key);
                const encryptedCore = aesCtr.encrypt(coreBytes);


                const msg = { cmd: "setFile", name: userName, bytes: encryptedCore, type: "context" }
                coreWorker.onmessage = (e) => {

                    const result = e.data
                  
                    switch (result.cmd) {
                        case "setFile":
                            resolve(result)
                            break;
                    }
                }

                coreWorker.postMessage(msg)

            } else {
                const msg = { cmd: "removeFile", name: userName, type: "context" }
                coreWorker.onmessage = (e) => {

                    const result = e.data

                    switch (result.cmd) {
                        case "removeFile":
                            
                            resolve(true)
                           
                            break;
                    }
                }
                coreWorker.postMessage(msg)
            }

        })
    }

   // const [regularPassword, setRegularPassword] = useState(null)

    function setupConfigFile(userName, userEmail){
        return new Promise(resolve =>{ 
      
            if (keyFile == null){ 
                resolve({ error: new Error("no key") })
            }else{
        
           

                    setSocketCmd({
                        cmd: "getUserCode", params: {}, callback: async (userCodeHex) => {


                            
                            const uintCode = new Uint8Array(aesjs.utils.hex.toBytes(userCodeHex))

                            const key = await getUintHash(uintCode, 32)

                            const permission = await getPermissionAsync(setupInfo.directory) 

                         

                            await updateKey(userName, key)

                          try{ 
                              console.log(setupInfo.directory)
                            
                            const homeHandle = await setupInfo.directory.getDirectoryHandle("home", { create: true })

                   
                        
                            const userHomeHandle =  await homeHandle.getDirectoryHandle(userName, { create: true })
                              
                              const appsHandle = await userHomeHandle.getDirectoryHandle("apps", { create: true })
                    
                            const engineHandle = await userHomeHandle.getDirectoryHandle("core", { create: true })
                           
                            const fileHandle = await engineHandle.getFileHandle(userName + ".core", { create: true })
                         
                            const configFileStream = await fileHandle.createWritable()
                            
                            const core = await generateKey({
                                type: 'ecc', 
                                curve: 'curve25519', 
                                userIDs: [{ name: userName, email: userEmail }], 
                                passphrase: keyFile, 
                                format: 'armored' 
                            });

                            
                            const coreJson = JSON.stringify(core)
                    
                            const coreBytes = aesjs.utils.utf8.toBytes(coreJson)

                            const aesCtr = new aesjs.ModeOfOperation.ctr(key);

                            const encryptedCore = aesCtr.encrypt(coreBytes);

                        
                            await configFileStream.write(encryptedCore)


                            


                            await configFileStream.close()


                                                        
                            const newHandle = await engineHandle.getFileHandle(userName + ".core")
                                                    
                            const file = await newHandle.getFile()

                            console.log(file)
                        
                            const info = await getFileInfo(file, newHandle, engineHandle)

                                                                            
                            resolve({ success: true, localFile: info })
                             } catch (err) {
                                 console.log(err)
                                 resolve({ error: err })
                             }                                     
                    }})                                 

               

            }
        })
    }

    async function checkDirectoryKey(user, dirHandle) {
        try {
         
            const homeHandle = await dirHandle.getDirectoryHandle("home")
            const userHomeHandle = await homeHandle.getDirectoryHandle(user.userName)
            const engineHandle = await userHomeHandle.getDirectoryHandle("core")
            const fileHandle = await engineHandle.getFileHandle(user.userName + ".core")
            const file = await fileHandle.getFile()

            const fileInfo = await getFileInfo(file, fileHandle, engineHandle)
            const fileHash = fileInfo.hash
        
            setSocketCmd({
                cmd: "checkStorageHash", params: { storageHash: fileHash }, callback: (result) => {
                  
                    if ("success" in result) {

                        setSetupInfo({file: fileInfo, directory:dirHandle})
                     
                        
                    }else{
                        setSetupInfo({ file: null, directory: dirHandle })
                    }
                         
                }
            })

        } catch (err) {
            setSetupInfo({ file: null, directory: dirHandle })
            return false
        }
    }

    async function onUseExisting(e){
        if(valid){
           
        const { file, directory } = setupInfo
        const dirName = directory.name
        const localDir = { name: dirName, handle: directory }
        await set(user.userID + "localDirectory", localDir)
  
            flushSync(() => {
                setLocalDirectory(localDir)
                setConfigFile(file)
            })
           props.onReload()
     
        navigate("/home/localstorage")
        }
    }


    async function handleSubmit(e = null){
        if(e != null)e.preventDefault();
    
  
        if(valid)
        {
  
            setValid(false)
           
            
                
            const result = await setupConfigFile(user.userName, user.userEmail)
        
            
            if ("success" in result && result.success){
                
                    const { localFile } = result
                    
                        setSocketCmd({
                            cmd: "createStorage", params: { storageHash: localFile.hash }, callback: (result)=>{
                        
                        console.log(result)
                        if("success" in result)
                        {    
                            
                            const setupDir = setupInfo.directory
                            const localDir = { name: setupDir.name, handle: setupDir}
                            set(user.userID + "localDirectory", localDir).then((result)=>{
                           
                                flushSync(() => {
                                    setLocalDirectory(localDir)
                                    setConfigFile(localFile)
                                })

                            
                                props.onReload()
                                navigate("/home/localstorage")
                            })
                        }else{
                           
                            navigate("/home/localstorage")
                        }
                    }})

            }else{
                setValid(true)
                console.log(result.error)
                alert("Could not set the config file.")
            }
            
            
    
       }


    }
    
    function onCancelClick(e){
       
     
        navigate("/home/localstorage")
            
      
    }
 



   
    const [phraseValid, setPhraseValid] = useState(false)
  
    const onPhraseChanged = (e) =>{
        
        if (phraseRef.current.value.length > 30) {
            setPhraseValid(true)
        } else {
            setPhraseValid(false)
        }
    }
    async function onGenerate(e){
    
        setSocketCmd({
            cmd: "getUserCode", params: {}, callback: async (userCodeHex) => {
           

                const str = userCodeHex.slice(getRandomIntSync(0, 32), getRandomIntSync(64,128))
           

                const length = await getRandomInt(400, 600, str)
                const code = await generateCode(length)
                
                
                
                phraseRef.current.value = code
                onPhraseChanged(e)
        }})
    }


    async function onCreate(e){
        
        const phraseString = phraseRef.current.value
        if (phraseString != "" && phraseString.length > 10)
        {
            try {
            
                const handle = await window.showSaveFilePicker({id:"keyfile"});
                
                setSaveName(await handle.name)
                //const file = await handle.getFile()

                

                setSocketCmd({cmd:"getUserCode",params:{},callback:async(userCodeHex)=>{
                    
                   
                    const phraseBytes = aesjs.utils.utf8.toBytes(phraseString)
               

                    const uintCode = new Uint8Array(aesjs.utils.hex.toBytes(userCodeHex))
                    
                    const key = await getUintHash(uintCode, 32)

                    const aesCtr = new aesjs.ModeOfOperation.ctr(key);

                    const encryptedContent = aesCtr.encrypt(phraseBytes);
 

                    const fileStream = await handle.createWritable()

                    await fileStream.write(encryptedContent)


                    await fileStream.close()

                    
                    setKeyFile(phraseString)

                    

                }})

                
          
             
            } catch (error) {
                if (error == DOMException.ABORT_ERR) {

                }
            }
        }else{
           
        }
    }
    /*
    async function onSelectKeyFile(e) {
        try {
            const files = await window.showOpenFilePicker({ id: "keyfile", multiple: false });
            const pickedFile = files[0]

            const file = await pickedFile.getFile()

       

            setSocketCmd({
                cmd: "getUserCode", params: {}, callback: async (uintCode) => {

                    const contents = await decryptAesFileBytes(file, uintCode)
                
                    const header = "keycode:"

                    if(contents.slice(0,header.length) == header){
                        setKeyFile(contents)
                    }else{
                        setKeyFile(null)
                        alert("This is not a valid key file")
                    }
                }
            })
        } catch (error) {
            if (error == DOMException.ABORT_ERR) {

            }
        }
    }*/


    useEffect(()=>{
        if(setupInfo != null){
            if (phraseRef.current && setupInfo.file == null){
                onGenerate(null)
            }else{
                if (setupInfo.file != null){
                    onUseExisting(null)

                

                }
            }
        }
    },[phraseRef.current, setupInfo])

    return (
        <>

            {setupInfo != null ?
        <div  style={{
             position: "fixed",
                    backgroundImage: "linear-gradient(#000000, #000304CC)",
                    width:780,
                    left: "50vw",
                    top: "50vh",
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                    transform:"translate(-50%,-50%)"
                }}>
                    <div style={{
                        paddingBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        paddingTop: 10,
                        fontFamily: "WebRockwell",
                        fontSize: "18px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314",
                        backgroundImage: "linear-gradient(#131514CC, #000304CC )",

                    }}>
                Setup
            </div>

            <div style={{  height:"100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                      
                            <div style={{
                       
                      
                                flex: 1,
                              
                            
                                padding: "20px",
                                fontFamily: "WebRockwell",
                                color: "#cdd4da",
                                fontSize: "18px",
                                display: "flex", flexDirection: "column",
                                alignItems: "center",
                            }}>
                            <div style={{ fontFamily: "webrockwell", color: "#ffffffaa", padding: 30, fontSize: 16, display:"flex", alignItems:"center", flexDirection:"column" }}>
                                {setupInfo.file == null  && keyFile == null ? <div>
                                    <div style={{ width: "100%", color: "#cdd4da", display: "flex", alignItems: "center", flexDirection: "column" }}>
                        
                                        Storage Key
                                      
                                    </div>
                                   
                                  
                               
                                    <div style={{ paddingTop: 15, fontSize: 14, display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
                                    
                                        
                                        
                                    
                                    <div style={{ flex: 1, color: "#ffffffA0", fontSize: 13 }}>
                                                <div style={{paddingBottom:10, width: "100%", alignItems: "end", justifyContent: "end", paddingTop: 20, marginRight: 0, fontSize: 14, display: "flex", color: "#ffffff80", whiteSpace: "nowrap",  }}>
                                                  <div style={{display:"flex", }}>Key information:</div>
                                                  
                                                <div style={{flex:1}}>&nbsp;</div>
                                                <div style={{}} onClick={onGenerate} className={styles.bubbleButton}>Generate</div>
                                                </div>
                                        <textarea
                                            onChange={onPhraseChanged}
                                            cols={45}
                                            rows={8}
                                            placeholder="Enter your key information"
                                            style={{
                                                cursor: "auto",
                                                resize: "none",
                                                outline: 0,
                                                width: 500,
                                                border: 0,
                                                backgroundColor: "#00000060",
                                                color: "white",
                                                fontFamily: "WebRockwell"
                                            }} ref={phraseRef} />
                                                <div style={{display:"flex", width: "100%",  }}>
                                                <div style={{ fontSize: 13, paddingTop: 30, color: "#777777" }}>

                                                    <div style={{ display: "flex", }}> <b style={{ color: "#888888" }}>Notice:</b><div style={{ width: 6 }}>&nbsp;</div> 1. Keep in a secure location.</div>
                                                    <div style={{ display: "flex", paddingTop:5, }}> <div style={{ width: 50 }}>&nbsp;</div>  2. Do not store in the '{setupInfo.directory.name}' directory. </div></div>
                                                <div style={{flex:1}}>&nbsp;</div>
                                                <div style={{ marginTop:25, fontSize: 14, width:80, color: saveName == null && phraseValid ? "white" : "", backgroundColor: saveName == null && phraseValid ? "#33333350" : "",   whiteSpace:"nowrap" }} onClick={onCreate} className={styles.bubbleButton}>
                                                    Create
                                                </div>
                                                
                                                </div>
                                           
                                           
                                    </div>
                                           
                                           
                                    </div>
                                 
                                    
                
                                    
                                </div> : <div style={{ paddingTop: 15,  display: "flex", flexDirection: "column", width: "100%",  justifyContent: "center" }}>
                                        <div style={{paddingBottom:10, fontSize: 18, width: "100%", color: "#CCCCCC", display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            Engine Key
                                        </div>

                                            <div style={{ width:600, height: 2, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)", }}>&nbsp;</div>

                                        <div style={{  width: "100%", flex: 1,   display: "flex",  alignItems:"center", justifyContent:"center"  }}>
                              
                                        <div>
                                                <div style={{ marginTop: 50, width: 130, fontSize: 14, color: rememberKey ? "white" : "", backgroundColor: rememberKey ? "#33333350" : "", whiteSpace: "nowrap" }} onClick={(e) => {
                                                    if (!rememberKey) onRememberKey(e)
                                                }} className={styles.bubbleButton}>
                                             Remember key
                                        </div>
                                            <div style={{ paddingTop: 10, paddingBottom:10, display: "flex", whiteSpace: "nowrap",  alignItems: "center", justifyContent: "center", color: "#777777", fontFamily: "webrockwell", fontSize: 13, }}>
                                             (Increased convenience)
                                        </div>
                                        </div>
                                            <div style={{

                                                marginLeft: "40px", marginRight: "40px",
                                                height: "80px",
                                                width: "1px",
                                                backgroundImage: "linear-gradient(to bottom, #00030440, #77777725, #00030440)",
                                            }}>

                                            </div>
                                            <div>
                                                <div style={{ backgroundColor: rememberKey ? "" : "#33333350", color: rememberKey ? "" : "white", marginTop: 50, width: 130, fontSize: 14, whiteSpace: "nowrap" }} onClick={(e)=>{
                                                    if(rememberKey)onRememberKey(e)
                                                }} className={styles.bubbleButton}>
                                                    Prompt
                                                </div>
                                                <div style={{  paddingTop: 10, paddingBottom: 10, display: "flex", whiteSpace: "nowrap", alignItems: "center", justifyContent: "center", color: "#777777", fontFamily: "webrockwell", fontSize: 14, }}>
                                                    (Increased security)
                                                </div>
                                            </div>
                                    
                                </div>
                            </div>
                         


                                  


                            }
                            </div>
                            {keyFile != null ? <>
                            {setupInfo.file == null ?     
                        <div style={{
                            justifyContent: "center",

                            paddingTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={onCancelClick}>Back</div>
                                        <div style={{

                                            marginLeft: "10px", marginRight: "10px",
                                            height: "50px",
                                            width: "1px",
                                            backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                        }}>

                                        </div>
                                        <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={handleSubmit} > Ok</div>
                         
                        </div>
                        :
                                <div style={{
                                    justifyContent: "center",

                                    paddingTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%"
                                }}>
                                    <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={onCancelClick}>Back</div>
                                    <div style={{

                                        marginLeft: "10px", marginRight: "10px",
                                        height: "50px",
                                        width: "1px",
                                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                    }}>

                                    </div>
                                    <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={onUseExisting} > Existing</div>
                                    <div style={{

                                        marginLeft: "10px", marginRight: "10px",
                                        height: "50px",
                                        width: "1px",
                                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                    }}>

                                    </div>
                                    <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={handleSubmit} > New</div>
                                </div>
                                }</>:
                                    <div style={{
                                        justifyContent: "center",

                                        paddingTop: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%"
                                    }}>
                                        <div style={{ width: 80, height: 30 }} className={styles.CancelButton} onClick={onCancelClick}>Back</div>
                                    </div>
                                
                                }
                            </div>
                        
               
                    </div>
                    </div>
                : <div style={{
                    position: "fixed",
                    backgroundColor: "rgba(0,3,4,.95)",

                    left: (pageSize.width / 2),
                    top: (pageSize.height / 2),
                    transform: "translate(-50%,-50%)",
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                }}>

                    <div style={{
                        paddingBottom: 10,
                        textAlign: "center",
                        width: "100%",
                        paddingTop: "10px",
                        fontFamily: "WebRockwell",
                        fontSize: "18px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314",
                        backgroundImage: "linear-gradient(#131514, #000304EE )",


                    }}>
                        Setup
                    </div>

                    <div style={{ width: "100%", height: "100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>

                        <div style={{


                            flex: 1,
                            minWidth: 600,

                            padding: "20px",
                            fontFamily: "WebRockwell",
                            color: "#cdd4da",
                            fontSize: "18px",
                            display: "flex", flexDirection: "column",
                            alignItems: "center",
                        }}>
                            <div style={{ display: "flex", fontFamily: "webrockwell", color: "white", padding: 40, fontSize: 16, textAlign: "center" }}>
                                <div>Getting setup information....</div>
                            </div>
                        </div>
                    </div>
                    </div>
                    }

                    </>

    )
}

/*    <div style={{

                                marginLeft: "10px", marginRight: "10px",
                                height: "50px",
                                width: "1px",
                                backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                            }}>

                            </div>
                            <div style={{  width:80, height:30}} className={styles.OKButton} onClick={handleSubmit} > Ok</div>  <div style={{ flex: 1, color: "#ffffffA0", fontSize: 13 }}>
                                        <div style={{ paddingBottom: 10, width: "100%", alignItems: "end", justifyContent: "end",  marginRight: 0, fontSize: 14, display: "flex", color: "#ffffff80", whiteSpace: "nowrap", }}>
                                            <div style={{ display: "flex", }}>
                                            
                                            </div>

                                            <div style={{ flex: 1 }}>&nbsp;</div>
                                            
                                        </div>
                                        <textarea
                                            readOnly
                                            cols={45}
                                            rows={20}
                                            value={termsOfService}
                                            style={{
                                                cursor: "auto",
                                                resize: "none",
                                                outline: 0,
                                                width: 500,
                                                border: 0,
                                                backgroundColor: "#00000060",
                                                color: "white",
                                                fontFamily: "WebRockwell"
                                            }} >
                                                
                                            </textarea>
                                       

                                    </div>
                                */
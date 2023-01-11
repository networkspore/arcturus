import React, { useState, useEffect, useRef  } from "react";

import { useLocation, useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";
import SelectBox from "./components/UI/SelectBox"
import { set } from "idb-keyval";
import { decryptKeyFile, formatedNow, generateCode, getDataHash, getEntryInfo, getFileHash, getFileInfo, getRandomInt, getStringHash, getUintHash } from "../constants/utility";
import { access, constants } from "../constants/constants";
import { decrypt, generateKey } from 'openpgp';
import aesjs from 'aes-js';

export const InitStoragePage = (props = {}) => {

    const location = useLocation()

    const passwordRef = useRef()
    const password2Ref = useRef()
    const phraseRef = useRef()

    const setSocketCmd = useZust((state) => state.setSocketCmd)
    //const [promptMe, setPromptMe] = useState(true)
    //const [keyDirectory, setKeyDirectory] = useState(null)
    const [keyContents, setKeyContents] = useState(null)
    //const [showMore, setShowMore] = useState(false)
    const [createKey, setCreateKey] = useState(false)

    const setLocalDirectory = useZust((state) => state.setLocalDirectory)
    const setConfigFile = useZust((state) => state.setConfigFile)

    
    const navigate = useNavigate();

    const user = useZust((state) => state.user);
    const [isUserCustody, setIsUserCustody] = useState(false)

    const pageSize = useZust((state) => state.pageSize)


    const [valid, setValid] = useState(true);

    const [showIndex, setShowIndex] = useState(0)

    const [setupInfo, setSetupInfo] = useState(null)
    const [saveName, setSaveName] = useState(null)
   
    useEffect(()=>{
        console.log(location.state)
        if (location.state != undefined && location.state.localDirectory != undefined )
        {
            
           
            checkDirectoryKey(user, location.state.localDirectory)

        }else{
            navigate("/home/localstorage")
        }
    },[location, user])



  


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

    const [regularPassword, setRegularPassword] = useState(null)

    async function setupConfigFile(userName, userEmail){
       
        const verified = await getLocalPermissions()
        if(!verified) return ({error: new Error("not verified")})
        if (keyContents == null) ({ error: new Error("no key") })
        try{ 
            const homeHandle = await setupInfo.directory.getDirectoryHandle("home", { create: true })
            const userHomeHandle = await homeHandle.getDirectoryHandle(user.userName, { create: true })
            const engineHandle = await userHomeHandle.getDirectoryHandle("engine", { create: true })
            const fileHandle = await engineHandle.getFileHandle(userName + ".core", { create: true })

            const configFileStream = await fileHandle.createWritable()
                            
            
            

       
            const { privateKey, publicKey, revocationCertificate } = await generateKey({
                type: 'ecc', 
                curve: 'curve25519', 
                userIDs: [{ name: userName, email: userEmail }], 
                passphrase: keyContents, 
                format: 'armored' 
            });


            const keyJson = JSON.stringify({privateKey:privateKey, publicKey:publicKey, revocationCertificate: revocationCertificate})
     
         
            await configFileStream.write(keyJson)


            await configFileStream.close()
                                        
            const newHandle = await engineHandle.getFileHandle(userName + ".core")
                                    
            const file = await newHandle.getFile()
        
            const fileInfo = await getFileInfo(file, newHandle, engineHandle)
                                                               
            return { success: true, localFile: fileInfo }
                                                                
                                                           

        } catch (err) {
            console.log(err)
            return { error: err }
        }

        
    }

    async function checkDirectoryKey(user, dirHandle) {
        try {
            console.log("looking for directory key")
            const homeHandle = await dirHandle.getDirectoryHandle("home")
            const userHomeHandle = await homeHandle.getDirectoryHandle(user.userName)
            const engineHandle = await userHomeHandle.getDirectoryHandle("engine")
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

    async function useExisting(e){
        if(valid){
            setValid(false)
        const { file, directory } = setupInfo
        const dirName = directory.name
        const localDir = { name: dirName, handle: directory }
        await set(user.userID + "localDirectory", localDir)
  
        setLocalDirectory(localDir)
        setConfigFile(file)
        alert("Using current setup")
        navigate("/home/localstorage")
        }
    }


    async function handleSubmit(e = null){
        if(e != null)e.preventDefault();
    
  
        if(valid)
        {
  
            setValid(false)
           
            
         
                const result = await setupConfigFile(user.userName, user.userEmail)
          
                
                if(!("error" in result)){
                    if(result.success)
                    {
                        const localFile = result.localFile 
    
                        const storageHash = localFile.hash

                        const params = {storageHash: storageHash}

                        setSocketCmd({cmd:"createStorage", params:params, callback: async (result)=>{
                            setValid(true);
                            console.log(result)
                            if("success" in result)
                            {    
                               
                                removeSystemMessage(0)
                                removeSystemMessage(1)
                                removeSystemMessage(2)
                                const setupDir = setupInfo.directory
                                const localDir = { name: setupDir.name, handle: setupDir}
                                await set(user.userID + "localDirectory", localDir)
                                setLocalDirectory(localDir)
                                setConfigFile(localFile)
                                alert("Setup complete.")
                                navigate("/home/localstorage")
                            }else{
                                alert("Please try again.")
                                navigate("/home/localstorage")
                            }
                        }})
                    }
                }else{
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
        console.log(phraseRef.current.value.length)
        if (phraseRef.current.value.length > 30) {
            setPhraseValid(true)
        } else {
            setPhraseValid(false)
        }
    }
    async function onGenerate(e){
    
    
        const length = await getRandomInt(400, 600, user.userEmail)
        const text = await generateCode(user.userEmail, length)
        
        
        phraseRef.current.value = text
        onPhraseChanged(e)
    }


    async function onSave(e){
        
        const fileContents = phraseRef.current.value + ""
        if (fileContents != "" && fileContents.length > 10)
        {
            try {
            
                const handle = await window.showSaveFilePicker({id:"keyfile"});
                
                setSaveName(await handle.name)
                //const file = await handle.getFile()

                

                setSocketCmd({cmd:"getUserCode",params:{},callback:async(uintCode)=>{

                   
                    const contentBytes = aesjs.utils.utf8.toBytes("keycode:" + fileContents)

                    const key = await getUintHash(uintCode, 32)

                    const aesCtr = new aesjs.ModeOfOperation.ctr(key);

                    const encryptedContent = aesCtr.encrypt(contentBytes);
 

                    const fileStream = await handle.createWritable()

                    await fileStream.write(encryptedContent)


                    await fileStream.close()

                }})

                
          
             
            } catch (error) {
                if (error == DOMException.ABORT_ERR) {

                }
            }
        }else{
           
        }
    }
    async function onSelectKeyFile(e) {
        try {
            const files = await window.showOpenFilePicker({ id: "keyfile", multiple: false });
            const pickedFile = files[0]

            const file = await pickedFile.getFile()

       

            setSocketCmd({
                cmd: "getUserCode", params: {}, callback: async (uintCode) => {

                    const contents = await decryptKeyFile(file, uintCode)
                
                    const header = "keycode:"

                    if(contents.slice(0,header.length) == header){
                        setKeyContents(contents)
                    }else{
                        setKeyContents(null)
                        alert("This is not a valid key file")
                    }
                }
            })
        } catch (error) {
            if (error == DOMException.ABORT_ERR) {

            }
        }
    }


    useEffect(()=>{
        if (phraseRef.current && setupInfo.file == null){
            onGenerate(null)
        }
    },[phraseRef.current, setupInfo])

    return (
        <>
            {setupInfo != null ?
        <div  style={{
             position: "fixed",
                    backgroundColor: "#00000090",
                    width:780,
                    left: "50vw",
                    top: "50vh",
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                    transform:"translate(-50%,-50%)"
                }}>
                    <div style={{
                        paddingBottom: 10,
                        textAlign: "center",
                    
                        paddingTop: "20px",
                        fontFamily: "WebRockwell",
                        fontSize: "18px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314",
                        backgroundImage: "linear-gradient(#13151480, #0003020 )",


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
                                {setupInfo.file == null ? <div>
                                    <div style={{width:"100%", }}>
                        
                                        <div style={{paddingBottom:20}}>Create / Select a key file: </div>
                                     
                                      
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
                                                <div style={{display:"flex", fontSize: 13, paddingTop: 30, color: "#777777" }}><b style={{ color: "#888888" }}>Notice:</b><div style={{ width: 6 }}>&nbsp;</div> 1. Keep in a secure location.</div>
                                                <div style={{flex:1}}>&nbsp;</div>
                                                <div style={{ color: saveName == null && phraseValid ? "white" : "", backgroundColor: saveName == null && phraseValid ? "#33333350" : "", marginTop: 20,  whiteSpace:"nowrap" }} onClick={onSave} className={styles.bubbleButton}>Save</div>
                                                    <div style={{ color: saveName ? "white" : "", backgroundColor: saveName ? "#33333350" : "",marginLeft:20, marginTop: 20, whiteSpace: "nowrap" }} onClick={onSelectKeyFile} className={styles.bubbleButton}>Select </div>
                                                </div>
                                            <div style={{transform:"translateY(-5px)", width: "199%", display: "flex", alignItems: "start", justifyContent: "start", fontSize: 13, color:"#777777" }}><div style={{width:50}}>&nbsp;</div>  2. Do not store in the '{setupInfo.directory.name}' directory. </div>
                                            <div style={{ transform: "translateY(-5px)", width: "199%", display: "flex", alignItems: "start", justifyContent: "start", fontSize: 13, color: "#777777", paddingTop:6 }}><div style={{ width: 50 }}>&nbsp;</div>  3. This file may be used to log in to your account. </div>
                                    </div>
                                           
                                           
                                    </div>
                                 
                                    
                
                                    
                                </div>:
                                <div>
                                    <div>This local storage engine has been previously setup. Would you like to re-initialize it?.</div>
                                        <div style={{ fontSize: 14, paddingTop: 30, color: "#777777" }}><b style={{ color: "#888888" }}>Notice:</b> Re-initializing the engine will destroy '{setupInfo.directory.name}/home/{user.userName}/'.<br />(Please back up this directory if you wish to maintain access to any files which may be stored there.)</div>
                                </div>}
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
                            <div style={{  width:80, height:30}} className={styles.OKButton} onClick={handleSubmit} > Ok</div>
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
                                    <div style={{ width: 80, height: 30 }} className={styles.OKButton} onClick={useExisting} > Existing</div>
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

/* 
  <div className={styles.glow} onClick={(e) => { setShowMore(prev => !prev) }} style={{ fontSize: 14, cursor: "pointer", paddingTop: 20, color: showMore ? "#888888" : "#777777" }}>Show {showMore ? "less" : "more"}  <b style={{fontSize:10}}>▼</b></div>
                                    {showMore &&
                                    <div style={{ fontSize: 14, paddingTop: 20, color: "#777777" }}><b style={{ color: "#888888" }}>Info:</b><br/> 
                                        The following directories will be created if they don't exist: <br/>
                                        {setupInfo.directory.name}/home/ <br /> 
                                        {setupInfo.directory.name}/home/{user.userName} <br />
                                        {setupInfo.directory.name}/home/{user.userName}/engine <br />
                                        {setupInfo.directory.name}/home/{user.userName}/apps <br />
                                        {setupInfo.directory.name}/images <br />
                                        {setupInfo.directory.name}/media  <br />
                                        {setupInfo.directory.name}/assets <br />
                        
                                    </div>
                                    }</>
<textArea 
                                                placeholder="(*.glb *.png *.jpg)"
                                                type={"text"}
                                                style={{
                                                    resize: "none",
                                                    width: 270,
                                                    fontSize: 14,
                                                    marginTop: 5,
                                                    textAlign: "left",
                                                    border: "0px",
                                                    outline: 0,
                                                    color: "white",
                                                    backgroundColor: "#00000000",
                                                    fontFamily: "webrockwell"
                                                }} />*/

/*
 <div onClick={onCancelClick} style={{ cursor: "pointer", display: "flex",}}>
                                <div  >
                                    <ImageDiv netImage={{
                                        image: "/Images/icons/person.svg",
                                        width: 130,
                                        backgroundColor:"#33333350",
                                        height: 130,
                                        filter: "invert(100%)"
                                    }} />
                                    <div style={{
                                        position: "relative",
                                        transform: "translate(17px,-15px)",
                                        fontSize: "13px",
                                        color: "#cdd4da",
                                        textShadow: "1px 1px 2px #101314, -1px -1px 1px #101314",
                                        fontFamily: "Webrockwell",
                                        cursor: "pointer"
                                    }} >Select Image</div>
                                </div>
                                    <div>
                                        <div style={{display:"flex"}}>
                                            <div style={{

                                                marginLeft: "20px", marginRight: "20px",
                                                height: "50px",
                                                width: "1px",
                                                backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                            }}>

                                            </div>
                                            <div style={{width:150, height:50, display:"flex", alignItems:"center"}}  onClick={onOKclick} >Profile Image</div>
                                        </div>
                                        <div style={{ fontFamily: "WebPapyrus", paddingLeft: 45, fontSize: 14, color:"#ffffff50" }}>Select a profile image from your images.</div>
                                    </div>
                                </div>
                                */
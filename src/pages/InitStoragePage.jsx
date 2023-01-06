import React, { useState, useEffect, useRef  } from "react";

import { useLocation, useNavigate } from 'react-router-dom';

import useZust from "../hooks/useZust";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";
import produce from "immer";
import SelectBox from "./components/UI/SelectBox"
import { set } from "idb-keyval";
import { generateCode, getEntryInfo, getFileInfo, getStringHash, getUintHash } from "../constants/utility";
import { access, constants } from "../constants/constants";
import { generateKey } from 'openpgp';
import aesjs from 'aes-js';

export const InitStoragePage = (props = {}) => {

    const location = useLocation()

    

    const setSocketCmd = useZust((state) => state.setSocketCmd)
  

    const setLocalDirectory = useZust((state) => state.setLocalDirectory)
    const setConfigFile = useZust((state) => state.setConfigFile)

    
    const navigate = useNavigate();

    const user = useZust((state) => state.user);


    const pageSize = useZust((state) => state.pageSize)


    const [valid, setValid] = useState(true);

    const [showIndex, setShowIndex] = useState(0)

    const [setupInfo, setSetupInfo] = useState(null)
   
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



    async function setupConfigFile(userName, userEmail){
       
        const verified = await getLocalPermissions()
        if(!verified) return ({error: new Error("not verified")})

        try{ 
            const homeHandle = await setupInfo.directory.getDirectoryHandle("home", { create: true })
            const userHomeHandle = await homeHandle.getDirectoryHandle(user.userName, { create: true })
            const fileHandle = await userHomeHandle.getFileHandle(userName + ".storage.key", { create: true })

            const configFileStream = await fileHandle.createWritable()
                            
            const storageKey = await generateCode(userName + userEmail, 128)   

       
            const { privateKey, publicKey, revocationCertificate } = await generateKey({
                type: 'ecc', 
                curve: 'curve25519', 
                userIDs: [{ name: userName, email: userEmail }], 
                passphrase: storageKey, 
                format: 'armored' 
            });

            const keyJson = JSON.stringify({privateKey:privateKey, publicKey:publicKey, revocationCertificate: revocationCertificate})
     

            
          
            const aesKey = await getUintHash(Uint8Array.from(Array.from(storageKey).map(letter => letter.charCodeAt(0))), 32) //arrayKey.slice(0,32)

            var jsonBytes = aesjs.utils.utf8.toBytes(keyJson);

            var aesCtr = new aesjs.ModeOfOperation.ctr(aesKey);
            var ctrBytes = aesCtr.encrypt(jsonBytes);

            await configFileStream.write(ctrBytes)


            await configFileStream.close()
                                        
            const newHandle = await userHomeHandle.getFileHandle(userName + ".storage.key")
                                    
            const file = await newHandle.getFile()
        
            const fileInfo = await getFileInfo(file, newHandle, userHomeHandle)
                                                               
            return { success: true, storageKey: storageKey, localFile: fileInfo }
                                                                
                                                           

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
            const fileHandle = await userHomeHandle.getFileHandle(user.userName + ".storage.key")
            const file = await fileHandle.getFile()

            const fileInfo = await getFileInfo(file, fileHandle, dirHandle)
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
                        const storageKey = result.storageKey
                        const storageHash = localFile.hash

                        const params = {storageKey: storageKey, storageHash: storageHash}

                        setSocketCmd({cmd:"createStorage", params:params, callback: async (result)=>{
                            setValid(true);
                            console.log(result)
                            if("success" in result)
                            {    
                                const storageID = result.storageID
                                removeSystemMessage(0)
                                removeSystemMessage(1)
                                removeSystemMessage(2)
                                const dirName = directoryHandle.name
                                const localDir = {name:dirName, handle: directoryHandle}
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




    return (
        <>
            {setupInfo != null ?
        <div  style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.95)",
         
            left: (pageSize.width / 2),
            top: (pageSize.height / 2),
            transform:"translate(-50%,-50%)",
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
                Setup Storage
            </div>

            <div style={{  width: "100%", height:"100%", flex: 1, backgroundColor: "#33333322", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", }}>
                      
                            <div style={{
                       
                      
                                flex: 1,
                                minWidth:800,
                            
                                padding: "20px",
                                fontFamily: "WebRockwell",
                                color: "#cdd4da",
                                fontSize: "18px",
                                display: "flex", flexDirection: "column",
                                alignItems: "center",
                            }}>
                            <div style={{display:"flex", fontFamily: "webrockwell", color: "#ffffffaa", padding: 40, fontSize: 16, textAlign: "center" }}>
                                {setupInfo.file == null ? <div>A new local storage engine will be setup on: '{setupInfo.directory.name}' </div>:
                                <div>
                                    <div>This local storage engine has been previously setup. Would you like to reboot it?.</div>
                                        <div style={{ fontSize: 14, paddingTop: 30, color: "#777777" }}><b style={{color:"#888888"}}>Notice:</b> Rebooting the engine will destroy the encryption key.<br/>(Please back up your current '.key' file. If you do not want to lose it.)</div>
                                </div>}
                            </div>
                        
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
                        Setup Storage
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

/* <textArea 
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
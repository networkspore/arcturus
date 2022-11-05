import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";
import styles from "./css/home.module.css"


export const CreateRealmPage = (props = {}) =>{
    
    const navigate = useNavigate();

    const pageSize = useZust((state) => state.pageSize)

    const user = useZust((state) => state.user);
    const socket = useZust((state) => state.socket)

    const [imageSelected, setImageSelected] = useState(null); 

    const [realmName, setRealmName] = useState("")
    const configFile = useZust((state) => state.configFile)

    const [valid, setValid] = useState(false)

    const handleChange = (e) =>{
        const { name, value } = e.target;

        if (name == "realmName") {
            if (value.length > 2) {
                socket.emit("checkRealmName", value, (callback) => {
                    if (!callback) {
                        setRealmName(value)

                    } else {
                        setRealmName("")

                    }
                })
            } else {
                setRealmName("")
            }

        }
    }

    const onSelectImage = (e) => {

    }

    const handleSubmit = (e) =>{
        const config = configFile.value;
        if(realmName != "" && imageSelected != null && config != null )
        {

            socket.emit(createRealm, config.engineKey)
        
        }
    }

    const onCancelClick = (e) =>{
        navigate("/")
    }

    return(
        <div style={{
            width: 850,
            backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
            position: "fixed",
            display: "flex",
            left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            alignItems: "center", justifyContent: "center", flexDirection: "column",
            paddingTop: "50px",
        }}>
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #00030440 20%, #77777740 50%, #00030440 100%)", }}>&nbsp;</div>
            <div style={{
           
                fontSize: "50px",
                textAlign: "center",
                fontFamily: "Webpapyrus",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #202020,  0 0 30px #f7bc1510",
                fontWeight: "bolder",
                color: "#cdd4da",
                width:"100%"

            }} >Create &nbsp; Realm</div>
    
       
            <div >
            <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #00030440 20%, #77777740 50%, #00030440 100%)", }}>&nbsp;</div>
            <div style={{marginTop:40, backgroundImage: "linear-gradient( to right, #00000030, #33333320, #00000030)"}}>
                <div style={{ height: 30 }}></div>
                <div style={{
                    alignItems: "center", justifyContent: "center",
                    display: "flex",


                    backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 20,
                    paddingRight: 20
                }}>

                    <input onKeyUp={(e) => {
                        if (e.code == "Enter") {
                            handleSubmit(e)
                        }
                    }} placeholder="Realm name..." style={{
                        outline: 0,
                        border: 0,
                        color: "white",
                        width: 600, textAlign: "center", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus"

                    }} name="realmName" onChange={event => handleChange(event)} />

                </div>
                {imageSelected != null &&
                <div style={{ display:"flex",
                flexDirection:"column",
                    paddingTop: 30, paddingBottom: 10,
                    justifyContent: "center",
                    alignItems: "center", }}>
                    <div style={{

                        display: "flex",

                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingLeft: 20,
                        paddingRight: 20,
                        flexDirection:"column"
                    }}>
                       
                        <div style={{ cursor: "pointer" }} onClick={ onSelectImage }>
                            <ImageDiv width={200} height={200} netImage={imageSelected}/>
                        </div>
                       
                    </div> 
                    
                   
                    </div>
                    }
                    {realmName != "" &&
                    <div style={{

                        display: "flex",
                        alignItems:"center",
                        justifyContent:"center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 2,
                        marginTop: 10,
                        marginBottom: 10,
                        paddingTop: 2,

                        flexDirection: "column"
                    }}>
                        <div style={{ display: "flex", backgroundColor: "#000000", width: 140, paddingTop: 8, paddingBottom: 8, }} onClick={onSelectImage} className={styles.OKButton}>
                            <div style={{

                                marginRight: 5,
                                height: "15px",
                                width: "1px",
                                backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                            }}>

                            </div>
                            <div style={{ flex: 1 }}>Select Image</div>
                            <div style={{

                                marginLeft: 2,
                                height: "15px",
                                width: "1px",
                                backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                            }}>

                            </div>
                        </div>
                    </div>
                    }
                </div>
              
                <div style={{ paddingTop:40, paddingBottom:15 }}>  <div style={{
                    justifyContent: "center",

                    paddingTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <div style={{ width: "130" }} className={styles.CancelButton} onClick={onCancelClick}>Cancel</div>

                    <div style={{

                        marginLeft: "20px", marginRight: "20px",
                        height: "50px",
                        width: "1px",
                        backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                    }}>

                    </div>
                    <div style={{width:"130"}} className={valid ? styles.OKButton : styles.OKDisabled} onClick={handleSubmit} >OK</div>
                </div>
                </div>
            </div>
            
        </div>
   
    )
}
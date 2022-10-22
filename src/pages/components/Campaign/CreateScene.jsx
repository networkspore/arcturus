import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'
import listStyle from '../../css/campaign.module.css'
import useZust from "../../../hooks/useZust";
import SelectBox from "../UI/SelectBox";
import produce from 'immer';
import { constants } from "../../../constants/constants";

const CreateScene = ({ onClose, onNewScene, ...props}) =>{
    
    const pageSize = useZust((state)=>state.pageSize);
    const socket = useZust((state) => state.socket);

    const sceneNameRef = useRef();
    const sceneSettingRef = useRef();
    const sizeRef = useRef();
    const textureRef = useRef();
    const textureImgRef = useRef();

    const [isCurrent, setIsCurrent] = useState(false);

    const [settingOptions, setSettingOptions] = useState([{value:-1, Label:"Not Available"}])
   // const [textureOptions, setTextureOptions] = useState([{ value: -1, Label: "Not Available" }])

   
    useEffect(()=>{
        socket.emit("getSceneAttributes", (settings,textures)=>{
            var array = [];
            settings.forEach(setting => {
                array.push(
                    { value: setting[0], label: setting[1] }
                )
            });
            sceneSettingRef.current.setOptions(array)
          //  setSettingOptions(array);

            var array2 = [];
            textures.forEach(texture => {
                array2.push(
                    { value: texture.textureID, label: texture.name, url:texture.url, imageUrl: texture.url}
                )
            });
           textureRef.current.setOptions(array2)
            
        })
    },[])


    const onCreateScene = () =>{
        const name = sceneNameRef.current.value;
        const settingID = sceneSettingRef.current.getValue;
        const settingName = sceneSettingRef.current.getLabel;
        const textureID = textureRef.current.getValue;
        const textureName = textureRef.current.getLabel;
        const size = sizeRef.current.getValue;
        const selectedOption = textureRef.current.selectedOption
       
      //  const size = sizeRef.current.getValue;
    
        if(name.length > 2){
            if(settingID != -1){
                if(size != -1){
                    if(textureID > 0){            
                        onNewScene({
                            sceneID:-1, 
                            name:name, 
                            paused:false,
                            current:isCurrent,  
                            
                            setting:{
                                settingID:settingID, 
                                name:settingName }, 
                            textureID: textureID,
                            size:size
                        });
                    }else{
                        alert("Select texture")
                    }
                }else{
                    alert("Enter Size")
                }
            }else{
                alert("Select setting.")
            }
        }else{
            alert("Name must be at least three (3) characters long.")
        }
    }

    return (
        <div style={{position:"fixed",display:"block", width:600, height:495,
            backgroundColor: "rgba(10, 12, 16, .9)", left:"50%", top:"50%", transform:"translate(-50%,-50%)"
        
        }}>
            <div style={{ width: "100%", backgroundColor: "rgba(80,80,80,.5)", height: "10px" }}></div>
            <div style={{display:"flex"}}>
                <div style={{flex:.5}}></div>
                <div style={{ flex: 1 }} className={styles.title}>Create Scene</div >
                <div className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault()
                onCreateScene();
            }}>
                <div style={{marginLeft:"50px"}}>
            <div style={{   width: "100%", display:"flex", paddingTop:"50px", alignItems:"center"}}>
    
                <div style={{ backgroundColor: "rgba(0,0,0,0)", flex:1, display:"flex"}} className={listStyle.heroSelect}>
                    Name:<div style={{width:"10px"}}></div>
                
                    <input style={{width:"200px"}} ref={sceneNameRef} type={"text"} placeholder="scene name" className={listStyle.smallBlkInput} />
                </div>
                <div style={{flex:.25}}></div>
            </div>
           
            <div style={{  width: "100%", display: "flex", paddingTop: "20px", alignItems: "center" }}>
               
                <div style={{  flex: 1, display: "flex", alignItems:"center" }} >
                        <div style={{ backgroundColor: "rgba(0,0,0,0)",}} className={listStyle.heroSelect}>Setting:</div><div style={{ width: "10px" }}></div>

                        <div><SelectBox placeholder={"setting"} ref={sceneSettingRef } /></div>
                </div>
                <div style={{ flex: .25 }}></div>
            </div>

            <div style={{ width: "100%", display: "flex", paddingTop: "20px", alignItems: "center" }}>
                
                <div style={{ flex: 1, display: "flex", alignItems: "center" }} >
                    <div style={{ backgroundColor: "rgba(0,0,0,0)", }} className={listStyle.heroSelect}>Default Texture:</div>
                        <div style={{ flex: .25, border: "1 solid gold" }} ><img style={{ width: 40, height: 40 }} ref={textureImgRef} /></div>
                    <div style={{marginLeft:"10px"}}>
                        <SelectBox onChanged={(index)=>{
                         if(index!=-1)textureImgRef.current.src = textureRef.current.selectedOption.url;
                    }} placeholder={"select texture"} ref={textureRef}  /></div>
                </div>
               
            </div>
            <div style={{ width: "100%", display: "flex", paddingTop: "20px", alignItems: "center" }}>

                <div style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1, display: "flex" }} className={listStyle.heroSelect}>
                    Scene Size:<div style={{ width: "10px" }}></div>

                    <div>
                        <SelectBox
                            ref={sizeRef}
                            placeholder={"select size"}
                            options={
                                [
                                    { value: constants.SMALL_SCENE, label: "Small" },
                                    { value: constants.MEDIUM_SCENE, label: "Medium" },
                                    { value: constants.LARGE_SCENE, label: "Large" },
                                    { value: constants.HUGE_SCENE, label: "Huge" },
                                ]
                            }
                        />
                    </div>
                </div>
                <div style={{ flex: .25 }}></div>
            </div>

         

                            
            <div  onClick={(e)=>{
              
                setIsCurrent(prev => !prev)
            
                    }} style={{ marginLeft:"20px", cursor:"pointer",  display: "flex", paddingTop: "10px", alignItems: "center" }}>
                
                <div style={{ display:"flex", flex:1, alignItems:"center"}}>
                        <div className={isCurrent ? listStyle.checked : listStyle.check} />
                    <div style={{width:"5px"}}></div>
                    <div style={{}} className={listStyle.disclaimer}>Current scene</div>
                </div>
                   

              
               
            </div>
                </div>
            <div style={{ paddingTop:10, display: "flex"}}>
                        <div style={{flex:1}}></div>
                        <div style={{flex:.1}}></div>
                        <div style={{flex:.1}}>
                        <input  value={"Create"} className={listStyle.blkSubmit2} type={"submit"}/>
                        </div>
                        <div style={{width:"15px"}}></div>
                    </div>
            </form>
        </div>
    )
}

export default CreateScene;

/*
    <div style={{ width: "100%", display: "flex", paddingTop: "20px", alignItems: "center" }}>
        
        <div style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1, display: "flex" }} className={listStyle.heroSelect}>
            Scene Size:<div style={{ width: "10px" }}></div>

            <div>
                    <SelectBox 
                        ref={sizeRef}
                        placeholder={"select size"}
                        options={
                            [
                                { value:constants.SMALL_SCENE, label:"Small"},
                                { value: constants.MEDIUM_SCENE, label: "Medium" },
                                { value: constants.LARGE_SCENE, label: "Large" },
                                { value: constants.HUGE_SCENE, label: "Huge" },
                            ]
                        }
                    />
            </div>
        </div>
        <div style={{ flex: .25 }}></div>
    </div>
*/
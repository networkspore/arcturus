import React, { useEffect, useState, useRef } from "react";

import menuStyles from '../css/hud.module.css'
import styles from '../css/campaign.module.css'
import useZust from "../../hooks/useZust";
import produce from "immer";
import SelectBox from "../components/UI/SelectBox";
import { constants } from "../../constants/constants";
import { flushSync } from "react-dom";

export const RealmEditor = (props = {}) =>{

   
    const paintInnerRef = useRef();
    const paintOuterRef = useRef();
    const paintLayerRef = useRef();
    const paintLayerImgRef = useRef();
    const paintOpacityRef = useRef();

    const alterOuterRef = useRef();
    const alterAmountRef = useRef();
    const alterInnerRef = useRef();

    //level Refs
    const levelAmountRef = useRef();
    const levelInnerRef = useRef();
    const levelOuterRef = useRef();

    //smooth Refs
    const smoothSizeRef = useRef();

    const realmScene = useZust((state) => state.realmScene)
    
    const reader = new FileReader();
    const imgArrayReader = new FileReader();

    const [imgFile, setImgFile] = useState()
    const [imgUintFile, setImgUintFile] = useState();
    const [editMode, setEditMode] = useState("");
    const [currentRealm, setCurrentRealm] = useState(null)
    const [imgRev, setImgRev] = useState(null);
    const [campImgName, setCampImgName] = useState("");


    const [paintSettings, setPaintSettings] = useState({
        inner: 2,
        outer: 2,
        opacity: 1,
        value: null,
    })

    const [baseSettings, setBaseSettings] = useState({
        tileMode: true, stretch: true
    })

    const [currentLayer, setCurrentLayer] = useState(null)

    const [layers, setLayers] = useState(null);

 
 
    const pageSize = useZust((state) => state.pageSize)
    const mode = useZust((state) => state.mode);

    const setMode = (value) => useZust.setState(produce((state) => {
        state.mode = value;
    }))
    const setSubMode = (value) => useZust.setState(produce((state) => {
        state.mode.sub = value;
    }))
    const setModeID = (value) => useZust.setState(produce((state) => {
        state.mode.id = value;
    }))
    const [updating, setUpdating] = useState(false);



  



    const addTerrainLayer = (layer) => useZust.setState(produce((state) => {
        //realmScene.terrain.layers
        if(realmScene.terrain.layers != null){
            state.realmScene.terrain.layers.push(layer)
        }else{
            state.realmScene.terrain.layers = [layer];
        }
    }));
    
    const removeTerrainLayer = (terrainLayerID) => useZust.setState(produce((state) => {
        //realmScene.terrain.layers
        if (realmScene.terrain.layers != null) {
            if(realmScene.terrain.layers.length == 1)
            {
                state.realmScene.terrain.layers = [];    
            } else if (realmScene.terrain.layers.length > 1){
                realmScene.terrain.layers.forEach((layer,i) => {
                    if(layer.terrainLayerID == terrainLayerID){
                        state.realmScene.terrain.layers.splice(i,1);
                    }
                });
            }

            
        } 
    }));


    //MAIN
   // const CAMPAIGN_MODE = "CAMPAIGN";
   // const SCENE_MODE = "terrain";
    //SUB 
    //const INFORMATION_MODE = 'information';
  //  const SETTING_MODE = 'setting'
 
  
   // const TEXTURE_MODE = "teture"

  //  const socket = useZust((state) => state.socket)
   

    //CAMPAIGN Buttons
   

  //  const CAMPAIGN_NAME = "campaign_name";
    //const CAMPAIGN_ICON = "campaign_icon";



    useEffect(()=>{
        if("currentRealm" in props){
            setCurrentRealm(props.currentRealm)
        }
    },[props])


   
    //SCENE BUTTONS

   // const SCENE_NAME = "scene_name"

    //Texture BUTTONS


   // const PAINT_TEXTURE = "paint_texture";
   // const BASE_TEXTURE = "base_texture";

  //  const SAVE_TEXTURE = "save_texture";
  //  const UNDO_TEXTURE = "undo_texture";


    const onPaintChange = (e) => {
   
        let inner = paintInnerRef.current.value == "" ? "0" : paintInnerRef.current.value;
        let outer = paintOuterRef.current.value == "" ? "0" : paintOuterRef.current.value;
        let opacity = paintOpacityRef.current.value == "" ? 1 : paintOpacityRef.current.value > 1 ? 1 : paintOpacityRef.current.value;
        //  alert(paintLayerRef.current.selectedOption)
        let value = paintLayerRef.current.selectedOption == null ? null : paintLayerRef.current.selectedOption;
     //   const layer = paintLayerRef.current.selectedOption;
        
        if(value != null){
           // if (paintLayerImgRef.current.src != value){
                paintLayerImgRef.current.src = value.imageUrl;
        //}
        }
        
        setPaintSettings({inner:inner, outer:outer, value:value, opacity:opacity})
    
    }
  //  const [currentTextureID, setCurrentTextureID] = useState(-1)
    const [showAddLayer, setShowAddLayer] = useState(null);

    const setCurrentTexture = (texture) =>{
        
      //  const index = paintLayerRef.current.getOptions == null ? 0 : paintLayerRef.current.getOptions.length;

        const option = { value: texture.textureID, label: texture.name, imageUrl: texture.url}
            
        

        //if (textureNameRef.current.getOptions == null){
        flushSync(()=>{
            paintLayerRef.current.setOptions([option])
        })

            

        //paintLayerImgRef.current.src = texture.url;
        //paintLayerRef.current.setValue(autoID)
        paintLayerRef.current.setSelectedIndex(0);
        setPaintSettings(produce((state) => {
            state.value = option;
        }))

         /*   addTerrainLayer(
                terrainLayer
            )*/

        setShowAddLayer(null)
        onPaintChange(null)
        
    }
/*
    const onRemoveLayer = () => {
        const layerID = paintLayerRef.current.getValue;

        socket.emit("removeTerrainLayer", layerID, (onRemoved) =>{
           if(onRemoved){ 
                if (paintLayerRef.current.getOptions.length > 1){
                    paintLayerRef.current.getOptions.forEach((option,i) => {
                        if(option.value == layerID){
                            paintLayerRef.current.setOptions(produce((state)=>{
                                state.splice(i,1)
                            }))
                        }
                    });

                    

                } else if (paintLayerRef.current.getOptions.length == 1){
                    paintLayerRef.current.setOptions([])
                }

                removeTerrainLayer(layerID);
            }
        })
        
    }
*/



    const onSelectTexture  = (e) =>{
        e.prevent = true;
      /*  socket.emit("getTextures", 1, (textures)=>{
            if(textures != null)
            {
                if(textures.length > 0)
                {
                    var textureList = [];

                    textures.forEach(texture => {
                        
                   
                        textureList.push(
                            <div  onClick={(e)=>{
                                setCurrentTexture(texture);
                            }} className={menuStyles.result} >
                                <div  style={{width:"50px", height:"50px"}} className={menuStyles.resultImg}>
                                    <img  style={{width:"100%", height:"100%"}} src={texture.url} />
                                </div>
                                <div style={{paddingLeft:"15px"}} className={menuStyles.resultText}>
                                    {texture.name} 
                                </div>
                            </div>
                        )
                    });

                    setShowAddLayer(textureList);
                }
            }
            
        })*/
    }


    const onBaseImage = () =>{
        setBaseSettings(produce((state) => {
            state.tileMode = false;
        }))
    }

    const onBaseTile = () =>{
        setBaseSettings(produce((state)=>{
            state.tileMode = true;
        }))
    }

    const onBaseStretch = () => {
        setBaseSettings(produce((state) => {
            state.stretch = !baseSettings.stretch;
        }))
    }

    //geometry


    const editRealm= useZust((state) => state.editRealm);

    const setEditRealm = (value) => useZust.setState(produce((state) => {
        state.editRealm.mode = value.mode
        state.editRealm.settings = value.settings;
    }));

    //const ALTER_GEOMETRY = "alter_geometry";
    //const SMOOTH_GEOMETRY = "smooth_geometry";
    //const LEVEL_GEOMETRY = "level_geometry";
    //const SAVE_GEOMETRY = "save_geometry";
    //const UNDO_GEOMETRY = "undo_geometry";

    //alter Refs

    //
    

    const [alterSettings, setAlterSettings] = useState({
        inner: 2,
        outer: 2,
        value: 1
    })
    
    const [smoothSettings, setSmoothSettings] = useState({
        inner: 5,
        outer: 0,
        value: .5
    })

    const [levelSettings, setLevelSettings] = useState({
        inner: 2,
        outer: 2,
        value: 0
    })

    useEffect(()=>{
        return () =>{
            setMode({ main: "", sub: "", id: "" })
        }
    },[])

    useEffect(() => {
        if(mode.main == constants.SCENE_MODE)
        {
            if(mode.id != realmScene.sceneID){
                setModeID(realmScene.sceneID)
            }
        }else{
            setMode({main:"", sub:"", id:""})
        }
    },[realmScene])
   
    useEffect(() => {
        if(realmScene != null){
        if (mode.main == constants.TERRAIN_MODE && mode.sub == constants.GEOMETRY_MODE) {    
            if (editMode == constants.ALTER_GEOMETRY) {
  
                setEditRealm({ mode: constants.ALTER_GEOMETRY, settings: alterSettings })
                
                alterInnerRef.current.value = alterSettings.inner;
                alterOuterRef.current.value = alterSettings.outer;
                alterAmountRef.current.value = alterSettings.value;

            } else if (editMode == constants.SMOOTH_GEOMETRY) {
            
                setEditRealm({ mode: constants.SMOOTH_GEOMETRY, settings: smoothSettings })
                smoothSizeRef.current.value = smoothSettings.inner;
            } else if (editMode == constants.LEVEL_GEOMETRY) {

                setEditRealm({ mode: constants.LEVEL_GEOMETRY, settings: levelSettings })
               levelInnerRef.current.value = levelSettings.inner;
               levelOuterRef.current.value = levelSettings.outer;
               levelAmountRef.current.value = levelSettings.value;
            
            } else if(editMode == constants.SAVE_GEOMETRY){

                setEditRealm({ mode: constants.SAVE_GEOMETRY, settings: {} })
            
            } else if (editMode == constants.UNDO_GEOMETRY) {
            
                setEditRealm({ mode: constants.UNDO_GEOMETRY, settings: {} })
            
            } else{
            
                setEditRealm({ mode: "", settings: {  } })
            
            }
        } else if(mode.main == constants.TERRAIN_MODE && mode.sub == constants.TEXTURE_MODE ){
            if(editMode == constants.PAINT_TEXTURE){
                paintInnerRef.current.value = paintSettings.inner;
                paintOuterRef.current.value = paintSettings.outer;
                paintOpacityRef.current.value = paintSettings.opacity;

                if(paintSettings.value != null){
                    paintLayerRef.current.setOptions([paintSettings.value])
                    paintLayerRef.current.setSelectedIndex(0);
                }
               // const layers = realmScene.terrain.layers;

            //   const prevID = paintLayerRef.current.getValue; 

             //   if(layers != null){
                  /*  var options = [];
                    for(let i = 0; i< layers.length ; i++){
                        options.push(
                            { value: layers[i].terrainLayerID, label:layers[i].texture.name, imageUrl:layers[i].texture.url,  }
                        )
                    }*/

              /*      paintLayerRef.current.setOptions(options);
                    var value = null;

                    if(prevID != -1)
                    { 
                        paintLayerRef.current.setValue(prevID);
                        value = prevID;
                    }else{*/
                        
                   //  const option = //paintLayerRef.current.getSelectedOption
                    //}

               // const url = option == null ? null : option.imageUrl;
                    
               //     setPaintSettings(produce((state)=>{
                 //       state.value = option;
                //    }))
                    
                   // const selectedOption = paintLayerRef.current.selectedOption;
                 //   paintLayerImgRef.current.src = url; //selectedOption != null ? selectedOption.imageUrl : null;
                    
                setEditRealm({ mode: constants.PAINT_TEXTURE, settings: { inner: paintSettings.inner, outer: paintSettings.outer, value: paintSettings.value, opacity: paintSettings.opacity}})
                    
               // }

            }else if(editMode == constants.BASE_TEXTURE){

            }
        }else{
            if(editRealm.mode == constants.ALTER_GEOMETRY ||
                editRealm.mode == constants.SMOOTH_GEOMETRY ||
                editRealm.mode == constants.LEVEL_GEOMETRY){
                  
                setEditRealm({ mode: "", settings: {} })
            }
        }
        }else{
            setEditMode("")
            setEditRealm({ mode: "", settings: {} })
        }
        return () =>{
            setEditRealm({ mode: "", settings: {} })
        }
    }, [editMode, mode, alterSettings, smoothSettings, levelSettings, paintSettings])

    useEffect(()=>{
       if (editRealm != null && editRealm.updated == false && (editRealm.mode == constants.SAVE_GEOMETRY || editRealm.mode == constants.UNDO_GEOMETRY)){
           setEditMode("")
       }
    },[editRealm])

  

    const onAlterChange = (e) =>{
        let inner = alterInnerRef.current.value == "" ? "0" :  alterInnerRef.current.value;
        let outer = alterOuterRef.current.value == "" ? "0" : alterOuterRef.current.value;
        let value = alterAmountRef.current.value == "" ? "0" : alterAmountRef.current.value;

        setAlterSettings({ inner:inner, outer: outer, value: value })
        
    }

    const onLevelChange =(e) =>{
        let inner = levelInnerRef.current.value == "" ? "0" : levelInnerRef.current.value;
        let outer = levelOuterRef.current.value == "" ? "0" : levelOuterRef.current.value;
        let value = levelAmountRef.current.value == "" ? "0" : levelAmountRef.current.value;
        setLevelSettings({ inner: inner, outer: outer, value: value })
    }

    const onSmoothChange = (e) =>{
        let inner = smoothSizeRef.current.value == "" ? "0" : smoothSizeRef.current.value;
 

        setSmoothSettings(produce((state)=>{
            state.inner = inner; 
        }))
    }

    return (
        <>
        <div style={{height: "90px", display:"flex"}}>
            <div style={{flex:.5, display:"flex"}}>
            <div style={{ flex: .03 }}>&nbsp;</div>
            <div style={{ display:"flex", padding: "10px",width:"150px", alignItems:"center", justifyContent:"center" }}>
               
                <div style={{ backgroundColor:"rgba(14,16,19,.8)", border: "1px solid #776a05",
                width:"95%", height:"63px", padding:"5px", display:"flex", alignItems:"center" }}>
                        <div style={{ display: "block" }}>
                            <div style={{ display: "flex" }}>
                    
                    <div onClick={(e)=>{
                            setEditMode("")
                            if (mode.main == constants.SCENE_MODE) {
                                setMode({ main: "", sub: "", id: -1 })
                            } else {
                                setMode({main: constants.SCENE_MODE, sub:"", id:realmScene.sceneID })
                            }
                    }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                        <div className={mode.main == constants.SCENE_MODE ? menuStyles.menuActive: menuStyles.menu__item} about="Scene">
                            <img className={mode.main == constants.SCENE_MODE ? menuStyles.menuImgActive: menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/location-outline.svg" />
                        </div>
                    </div>
                    <div onClick={(e) => {
                        setEditMode("")
                        if (mode.main == constants.TERRAIN_MODE) {
                            setMode({ main: "", sub: "", id: -1 })
                        } else {
                            setMode({ main: constants.TERRAIN_MODE, sub: "", id: -1 })
                        }
                    }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                        <div className={mode.main == constants.TERRAIN_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Terrain">
                            <img className={mode.main == constants.STERRAIN_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/earth-outline.svg" />
                        </div>
                    </div>

                       
                        </div>
                        <div style={{display:"flex"}}>
                            <div onClick={(e) => {
                                setEditMode("")
                                if (mode.main == constants.MONSTER_MODE) {
                                    setMode({ main: "", sub: "", id: -1 })
                                } else {
                                    setMode({ main: constants.MONSTER_MODE, sub: "", id: -1 })
                                }
                            }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                                <div className={mode.main == constants.MONSTER_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Monsters">
                                    <img className={mode.main == constants.MONSTER_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/skull-outline.svg" />
                                </div>
                            </div>
                            <div onClick={(e) => {
                                setEditMode("")
                                if (mode.main == constants.PLACEABLE_MODE) {
                                    setMode({ main: "", sub: "", id: -1 })
                                } else {
                                    setMode({ main: constants.PLACEABLE_MODE, sub: "", id: -1 })
                                }
                            }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                                <div className={mode.main == constants.PLACEABLE_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Placeables">
                                    <img className={mode.main == constants.PLACEABLE_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/storefront-outline.svg" />
                                </div>
                            </div>
                            <div onClick={(e) => {
                                setEditMode("")
                                if (mode.main == constants.PARTY_MODE) {
                                    setMode({ main: "", sub: "", id: -1 })
                                } else {
                                    setMode({ main: constants.PARTY_MODE, sub: "", id: -1 })
                                }
                            }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                                <div className={mode.main == constants.PARTY_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Party">
                                    <img className={mode.main == constants.PARTY_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/people-outline.svg" />
                                </div>
                            </div>        
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ flex: .01 }}>&nbsp;</div>
            <div style={{ padding: "10px", flex: 1, alignItems: "center", justifyContent: "center" }}>
                <div style={{
                    backgroundColor: "rgba(14,16,19,.8)", border: "1px solid #776a05",
                    width: "95%", height: "90%", padding: "5px", display: "flex"
                }}>
                    {mode.main == constants.CAMPAIGN_MODE &&
                        <>
                            <div onClick={(e) =>{
                                setEditMode("")
                                if (mode.sub == constants.INFORMATION_MODE){
                                    setSubMode("")
                                }else{
                                    setSubMode(constants.INFORMATION_MODE)
                                }
                            }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                                <div className={mode.sub == constants.INFORMATION_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Information">
                                    <img className={mode.sub == constants.INFORMATION_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/information-circle-outline.svg" />
                                </div>
                            </div>
                         
                        </>
                    }
                  {mode.main == constants.SCENE_MODE &&
                  <>
                    <div onClick={(e)=>{
                        setEditMode("")
                        if (mode.sub == constants.INFORMATION_MODE) {
                            setSubMode("")
                        } else {
                            setSubMode(constants.INFORMATION_MODE)
                        }
                    }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                        <div className={mode.sub == constants.INFORMATION_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Information">
                            <img className={mode.sub == constants.INFORMATION_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/information-circle-outline.svg" />
                        </div>
                    </div>
                    <div onClick={(e) => {
                        setEditMode("")
                                if (mode.sub == constants.SETTING_MODE) {
                                    setSubMode("")
                                } else {
                                    setSubMode(constants.SETTING_MODE)
                                }
                    }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                        <div className={mode.sub == constants.SETTING_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Setting">
                            <img className={mode.sub == constants.SETTING_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/alarm-outline.svg" />
                        </div>
                    </div>
                   
                    </>
                }
    {mode.main == constants.TERRAIN_MODE &&
        <>
            <div onClick={(e) => {
                setEditMode("")
                if (mode.sub == constants.GEOMETRY_MODE) {
                    setSubMode("")
                } else {
                    setSubMode(constants.GEOMETRY_MODE)
                }
            }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                <div className={mode.sub == constants.GEOMETRY_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Geometry">
                    <img className={mode.sub == constants.GEOMETRY_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/globe-outline.svg" />
                </div>
            </div>
            <div onClick={(e) => {
                setEditMode("")
                if (mode.sub == constants.TEXTURE_MODE) {
                    setSubMode("")
                } else {
                    setSubMode(constants.TEXTURE_MODE)
                }
            }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                <div className={mode.sub == constants.TEXTURE_MODE ? menuStyles.menuActive : menuStyles.menu__item} about="Textures">
                    <img className={mode.sub == constants.TEXTURE_MODE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/images-outline.svg" />
                </div>
            </div>
        </>
    }
                            {mode.main == constants.MONSTER_MODE &&
                                <>
                                    <div onClick={(e) => {
                                        setEditMode("")
                                        if (mode.sub == constants.LOCATE_ITEM) {
                                            setSubMode("")
                                        } else {
                                            setSubMode(constants.LOCATE_ITEM)
                                        }
                                    }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                                        <div className={mode.sub == constants.LOCATE_ITEM ? menuStyles.menuActive : menuStyles.menu__item} about="Select Monster">
                                            <img className={mode.sub == constants.LOCATE_ITEM ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/locate-outline.svg" />
                                        </div>
                                    </div>
                                    { mode.id != null &&
                                        mode.id > 0 &&
                               <div onClick={(e) => {
                                    setEditMode("")
                                    if (mode.sub == constants.MOVE_ITEM) {
                                        setSubMode("")
                                    } else {
                                        setSubMode(constants.MOVE_ITEM)
                                    }
                                }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                                    <div className={mode.sub == constants.MOVE_ITEM ? menuStyles.menuActive : menuStyles.menu__item} about="Move Monster">
                                        <img className={mode.sub == constants.MOVE_ITEM ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/move-outline.svg" />
                                    </div>
                                </div>
                                }
                                </>
                            }
                </div>
              
            </div>
                    <div style={{ flex: .1 }}>&nbsp;</div>      
                </div>
            <div style={{ flex: .1 }}>&nbsp;</div>
            <div style={{ paddingTop:"10px", paddingBottom:"10px", flex: .45, alignItems: "center", justifyContent: "center" }}>
                
                <div style={{
                    backgroundColor: "rgba(14,16,19,.8)", border: "1px solid #776a05",
                    width: "95%", height: "90%", padding: "5px", display: "flex",
                }}>
                    
                    {/* SCENE mode Buttons */}
                    {mode.main == constants.SCENE_MODE &&
                        mode.sub == constants.INFORMATION_MODE &&
                        <>
                       
                            <div onClick={(e) => {
                                if (editMode == constants.SCENE_NAME) {
                                    setEditMode("")
                                } else {
                                    setEditMode(constants.SCENE_NAME)
                                }
                            }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                                <div className={editMode == constants.SCENE_NAME ? menuStyles.menuActive : menuStyles.menu__item} about="Scene Name">
                                    <img className={editMode == constants.SCENE_NAME ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/text-outline.svg" />
                                </div>
                            </div>
                        </>
                    }
                    {mode.main == constants.TERRAIN_MODE &&
                        mode.sub == constants.TEXTURE_MODE &&
                        <>
                            <div onClick={(e) => {
                                if (editMode == constants.PAINT_TEXTURE) {
                                    setEditMode("")
                                } else {
                                    setEditMode(constants.PAINT_TEXTURE);

                                }
                            }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                                <div className={ editMode == constants.PAINT_TEXTURE  ? menuStyles.menuActive : menuStyles.menu__item} about="Paint Texture">
                                    <img className={editMode == constants.PAINT_TEXTURE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/brush-outline.svg" />
                                </div>
                            </div>

                            <div onClick={(e) => {
                                if (editMode == constants.BASE_TEXTURE) {
                                    setEditMode("")
                                } else {
                                    setEditMode(constants.BASE_TEXTURE);

                                }
                            }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                                <div className={editMode == constants.BASE_TEXTURE ? menuStyles.menuActive : menuStyles.menu__item} about="Base Texture">
                                    <img className={editMode == constants.BASE_TEXTURE ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/image-outline.svg" />
                                </div>
                            </div>
                        </>
                    }

                    {mode.main == constants.TERRAIN_MODE &&
                        mode.sub == constants.GEOMETRY_MODE &&
                        <>
                        <div onClick={(e) => {
                            if (editMode == constants.ALTER_GEOMETRY) {
                                setEditMode("")
                            } else {
                                setEditMode(constants.ALTER_GEOMETRY);
                          
                            }
                        }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                            <div className={editMode == constants.ALTER_GEOMETRY ? menuStyles.menuActive : menuStyles.menu__item} about="Terraform">
                                <img className={editMode == constants.ALTER_GEOMETRY ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/hammer-outline.svg" />
                            </div>
                        </div>

                        
                        <div onClick={(e) => {
                            if (editMode == constants.SMOOTH_GEOMETRY) {
                                setEditMode("")
                            } else {
                                setEditMode(constants.SMOOTH_GEOMETRY);
                            }
                        }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                            <div className={editMode == constants.SMOOTH_GEOMETRY ? menuStyles.menuActive : menuStyles.menu__item} about="Smooth">
                                <img className={editMode == constants.SMOOTH_GEOMETRY ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/magnet-outline.svg" />
                            </div>
                        </div>
                        <div onClick={(e) => {
                            if(editMode == constants.LEVEL_GEOMETRY){
                                setEditMode("")
                            }else{
                                setEditMode(constants.LEVEL_GEOMETRY)
                            }
                        }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                            <div className={editMode == constants.LEVEL_GEOMETRY ? menuStyles.menuActive : menuStyles.menu__item} about="Level">
                                <img className={editMode == constants.LEVEL_GEOMETRY ? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/remove-outline.svg" />
                            </div>
                        </div>
                        {editRealm.updated == true &&
                            <>
                            <div onClick={(e) => {
                                
                                    setEditMode(constants.SAVE_GEOMETRY)
                                
                            }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                                <div className={editMode == constants.SAVE_GEOMETRY? menuStyles.menuActive : menuStyles.menu__item} about="Save">
                                    <img className={editMode == constants.SAVE_GEOMETRY? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/save-outline.svg" />
                                </div>
                            </div>

                            <div onClick={(e) => {
                                
                                    setEditMode(constants.UNDO_GEOMETRY)
                                
                            }} style={{ margin: "3px", width: "60px", height: "60px", borderRadius: "10px" }}>
                                <div className={editMode == constants.UNDO_GEOMETRY? menuStyles.menuActive : menuStyles.menu__item} about="Undo">
                                    <img className={editMode == constants.UNDO_GEOMETRY? menuStyles.menuImgActive : menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/reload.svg" />
                                </div>
                            </div>
                            </>
                        }
                        </>
                    }

                </div>
               
            </div>
            <div style={{ border: "1px solid #776a05", borderRadius: "50px", backgroundColor:"rgba(14,16,19,.8)", position:"absolute", left:"50%", top: 0, transform:"translate(-50%,-50%)"}}>
                <div  about={"Start Scene"} className={menuStyles.menu__item} >
                <img style={{width:"50px", height:"50px"}}className={menuStyles.menuImg} src="Images/icons/play-circle-outline.svg" />
                </div>
            </div>
         
            {/*/////////////////SCENE INFORMATION SETTINGS */}
            {editMode == constants.SCENE_NAME  &&
            <div style={{  padding: "10px", display:"flex", alignItems:"center",  border: "1px solid #776a05",  backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "53%", top: 0, transform: "translate(0%,-100%)" }}>
                    
                  
                <input style={{ width: "300px"}} type={"text"} placeholder="Scene Name" className={styles.smallBlkInput}/>
                 
                   
            </div>
            }
            {/*//////////////GEOMETRY Settings////////////*/}
            {editMode == constants.ALTER_GEOMETRY &&
                <div style={{ padding: "10px", display: "flex", alignItems: "center", border: "1px solid #776a05", backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "55%", top: 0, transform: "translate(0%,-100%)" }}>
                    <div className={styles.disclaimer}>Size:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onAlterChange} ref={alterInnerRef} style={{ width:"50px", textAlign:"center" }} type={"text"} placeholder="Inner" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Outer:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onAlterChange} ref={alterOuterRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Outer" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Amount:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".") &&
                                !(e.key == "-")
                            ) e.preventDefault();
                        }} onChange={onAlterChange} ref={alterAmountRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Amount" className={styles.smallBlkInput} />
                    </div>
                </div>
            }
            {editMode == constants.LEVEL_GEOMETRY &&
                <div style={{ padding: "10px", display: "flex", alignItems: "center", border: "1px solid #776a05", backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "55%", top: 0, transform: "translate(0%,-100%)" }}>
                    <div className={styles.disclaimer}>Size:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onLevelChange} ref={levelInnerRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Inner" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Outer:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onLevelChange} ref={levelOuterRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Outer" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Height:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".") &&
                                !(e.key == "-")
                            ) e.preventDefault();
                        }} onChange={onLevelChange} ref={levelAmountRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Amount" className={styles.smallBlkInput} />
                    </div>
                </div>
            }
                {editMode == constants.SMOOTH_GEOMETRY &&
                    <div style={{ padding: "10px", display: "flex", alignItems: "center", border: "1px solid #776a05", backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "55%", top: 0, transform: "translate(0%,-100%)" }}>
                        <div className={styles.disclaimer}>Size:</div>
                        <div>
                            <input onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} onChange={onSmoothChange} ref={smoothSizeRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Inner" className={styles.smallBlkInput} />
                        </div>
                      
                     
            
                    </div>
                }
        </div>
        {/* /////////////////////TEXTURE SETTINGS ////////////// */}
            {editMode == constants.PAINT_TEXTURE &&
                <div style={{ padding: "10px", display: "flex", alignItems: "center", border: "1px solid #776a05", backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "55%", top: 0, transform: "translate(0%,-100%)" }}>
                    <div className={styles.disclaimer}>Size:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onPaintChange} ref={ paintInnerRef } style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Inner" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Outer:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onPaintChange} ref={ paintOuterRef } style={{ width: "60px", textAlign: "center" }} type={"text"} placeholder="Outer" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Opacity:</div>
                    <div>
                        <input onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} onChange={onPaintChange} ref={paintOpacityRef} style={{ width: "50px", textAlign: "center" }} type={"text"} placeholder="Opacity" className={styles.smallBlkInput} />
                    </div>
                    <div className={styles.disclaimer}>Texture:</div>
                    <div>
                        <img style={{ margin: "3px", border:"1px solid #776a05", width:"30px", height:"30px", borderRadius:"5px" }} ref={paintLayerImgRef} />
                    </div>
                    <div>
                        <SelectBox onClick={onSelectTexture} textStyle={{width:"150px"}} onChanged={onPaintChange} ref={paintLayerRef} />
                    </div>

                    
                    
               
                </div>
            }
            {/* <div onClick={(e) => {
                        onAddLayer();
                    }} style={{ width: "30px", height: "30px" }}>
                        <div className={menuStyles.menu__item} about="Select Texture">
                            <img className={menuStyles.menuImgActive} style={{ height: "25px", width: "25px" }} src="Images/icons/add-circle-outline.svg" />
                        </div>
                    </div>
                    //////////////////BASE TEXTURE SETTINGS /////*/}
            {editMode == constants.BASE_TEXTURE &&
                <div style={{ padding: "10px", display: "flex", alignItems: "center", border: "1px solid #776a05", backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "55%", top: 0, transform: "translate(0%,-100%)" }}>
                   

                    <div style={{ width: "100px" }} className={styles.disclaimer}>Image...</div>
                    <div>
                        <SelectBox textStyle={{ width: "100px" }}  />
                    </div>

                    <div onClick={(e) => {

                    }} style={{ width: "30px", height: "30px" }}>
                        <div className={menuStyles.menu__item} about="Swap">
                            <img className={menuStyles.menuImgActive} style={{ height: "25px", width: "25px" }} src="Images/icons/swap-horizontal-outline.svg" />
                        </div>
                    </div>

                </div>
            }
            {showAddLayer != null &&
                <div style={{width:"300px", height: "515px", padding: "10px", display: "block", alignItems: "center", border: "1px solid #776a05", backgroundColor: "rgba(14,16,19,.8)", position: "absolute", left: "70%", top: -70, transform: "translate(0%,-100%)" }}>
                    <div style={{width:"100%", display:"flex", justifyContent:"right"}}>
                        <div onClick={(e) => {
                            setShowAddLayer(null)
                        }} style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                            <div className={  menuStyles.menu__item} about="Close">
                                <img className={ menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/close-outline.svg" />
                            </div>
                        </div>
                    </div>
                    <div style={{display:"block", width:"100%", height:"470px", overflowY:"scroll"}}>
                        {showAddLayer}
                    </div>
                </div>
            }

   
            {/*///////////////LOADING SCREENS ///////////// */}
            {(editRealm.mode == constants.SAVE_GEOMETRY || editRealm.mode == constants.UNDO_GEOMETRY) &&
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", top: 0, left: 0, backgroundColor: "rgba(0,0,0,.8)", position: "fixed", width: pageSize.width, height: pageSize.height }}>


            <div style={{
                padding: "10px",
                textAlign: "center",
                fontFamily: "WebRockwell",
                fontSize: "25px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314"
                    }}>{editMode == constants.SAVE_GEOMETRY ? "Saving" : editMode == constants.UNDO_GEOMETRY ? "Updating" : ""}...</div>

        </div>
    }
            {/*///////////////LOADING SCREENS ///////////// */}
            {updating == true &&
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", top: 0, left: 0, backgroundColor: "rgba(0,0,0,.8)", position: "fixed", width: pageSize.width, height: pageSize.height }}>


                    <div style={{
                        padding: "10px",
                        textAlign: "center",
                        fontFamily: "WebRockwell",
                        fontSize: "25px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314"
                    }}>Updating...</div>

                </div>
            }
        </>
    )
}



/*
                    <div style={{ width: "35px", height: "35px", borderRadius: "10px" }}>
                        <div className={menuStyles.menu__item} about="Setting">
                            <img className={menuStyles.menuImg} style={{ height: "100%", width: "100%" }} src="Images/icons/alarm-outline.svg" />
                        </div>
                    </div>
                    */


/* const CHUNK_SIZE = 10000;
const sendCampaignImage = (name, rev, imgData) => {
    const imageDataLength = imgData.length;
    rev++;
    function loop(i, count) {
        count = i * CHUNK_SIZE;
        if (count + CHUNK_SIZE <= imageDataLength) {


            const chunk = imgData.slice(count, count + CHUNK_SIZE);

            socket.emit("sendCampaignImageData", campaignID, name, rev, chunk, i, false, count, (received) => {
                if (received) {
                    i++;
                    loop(i, count)
                } else {
                    setUpdating(false);
                    alert("Icon could not be updated.")

                }
            })
        } else {

            const chunk = imgData.slice(count, count + CHUNK_SIZE);

            socket.emit("sendCampaignImageData", campaignID, name, rev, chunk, i, true, count, (written) => {
                if (written) {
                    setCampaignRev(rev);
                    setCampaignImageUrl("Images/campaignIcons/" + campaignID + "_" + rev + "_" + name)
                    setEditMode("");
                    setUpdating(false);


                } else {
                    // socket.emit("clearCampaignImage", terrain.terrainID, rev, (cleared) => {
                    setUpdating(false);
                    alert("Icon could not be updated.")
                    // })
                }
            })
        }
    }

    loop(0, 0)
}*/
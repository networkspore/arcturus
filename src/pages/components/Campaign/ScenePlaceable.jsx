import React, { useEffect, useState, useRef, Suspense } from "react";
import styles from '../../css/home.module.css'
import loadingStyles from '../../css/loading.module.css';
import produce from 'immer';
import SelectBox from '../UI/SelectBox';
import useZust from "../../../hooks/useZust";
import { Canvas } from '@react-three/fiber';
import { PlaceableViewer } from "../PlaceableViewer";
import FindObject from "./FindObject";
import { set } from "lodash";


const Loader = (<>  <div className={loadingStyles.loading}  >
    <div >
        <div className={loadingStyles.logo}></div>
        <div className={loadingStyles.loadingText}>
            Loading

        </div>

    </div>

</div></>);

const ScenePlaceable = ({edit = false, onClose, selectedPlaceable, typeOptions, materialOptions, sizeOptions,integrityOptions, onAddPlaceable, onEditPlaceable, ...props}) => {
    const pageSize = useZust((state) => state.pageSize)
    const socket = useZust((state) => state.socket)

    const [showViewer, setShowViewer] = useState(false);

    const [objectOptions, setObjectOptions] = useState(
        [{value:selectedPlaceable.object.objectID, label:selectedPlaceable.object.name, url: selectedPlaceable.object.url}]
    );

    const [showFind, setShowFind] = useState(false);
    const [findPosition, setFindPosition] = useState({top:0,left:0})

    const tempObject = useZust((state) => state.tempObject)
    const setTempObject = useZust((state) => state.setTempObject)
    
    const placeNameRef = useRef();
    const typeRef = useRef();
    const objColorRef = useRef();
    const objImgRef = useRef();
    const newTypeNameRef = useRef();
    const placeImageUrlRef = useRef();
    const objImageUrlRef = useRef();
 

    const objectRef = useRef();

    const rotationXref = useRef();
    const rotationYref = useRef();
    const rotationZref = useRef();
    const offsetXRef = useRef();
    const offsetYRef = useRef();
    const offsetZRef = useRef();
    const scaleXRef = useRef();
    const scaleYRef = useRef();
    const scaleZRef = useRef();
    const materialRef = useRef();
    const sizeRef = useRef();
    const integrityRef = useRef();
    const hpRef = useRef();
    const acRef = useRef();
    const stealthRef = useRef();

  
    useEffect(()=>{

        if(edit){
            socket.emit("getPlaceableAttributes", (types, sizes, integrity, materials) => {
                var array = [];
                array.push({ value: "0", label: "All" });
                types.forEach(type => {
                    array.push(
                        { value: type[0], label: type[1] }
                    )
                });
          
                typeRef.current.setOptions(array)
             

                var array2 = [];
                materials.forEach(material => {
                    array2.push(
                        {
                            value: material[0],
                            label: material[1],
                            dice: {
                                diceID: material[2],
                                max: material[3]
                            },
                            AC: material[4],
                            dmgThreshold: material[5]
                        }
                    )
                })
                materialRef.current.setOptions(array2);

                var array3 = [];
                integrity.forEach(reliable => {
                    array3.push(
                        {
                            value: reliable[0],
                            label: reliable[1],
                            multiplier: reliable[2]
                        }
                    )
                })
                integrityRef.current.setOptions(array3);
                

                var array4 = [];
                sizes.forEach(size => {
                    array4.push(
                        {
                            value: size[0],
                            label: size[1],
                            HPModifier: size[2],
                            ACModifier: size[3],
                            hideModifier: size[4],
                            diameter: size[5],
                            height: {
                                min: size[6],
                                max: size[7],
                            },
                            weight: {
                                min: size[8],
                                max: size[9]
                            }
                        }
                    )
                })
                sizeRef.current.setOptions(array4);
                
                updatePlaceable();
              
            })
        }else{
         
            typeRef.current.setOptions(typeOptions);
            materialRef.current.setOptions(materialOptions);
            sizeRef.current.setOptions(sizeOptions);
            integrityRef.current.setOptions(integrityOptions)
            updatePlaceable();
        }
   
    
        return () =>{
            setTempObject(null);
        }

    },[edit,typeOptions,materialOptions,sizeOptions,integrityOptions])

    const updatePlaceable = () =>{
        const placeable = selectedPlaceable

       // alert(placeable.placeableType.placeableTypeID)
        placeNameRef.current.value = placeable.name;
       



        hpRef.current.value = selectedPlaceable.HP;
        acRef.current.value = selectedPlaceable.AC;
        stealthRef.current.value = selectedPlaceable.stealth;

        materialRef.current.setValue(selectedPlaceable.material.materialID);
        sizeRef.current.setValue(selectedPlaceable.size.sizeID);
        integrityRef.current.setValue(selectedPlaceable.integrity.integrityID);
     
        typeRef.current.setValue(placeable.placeableType.placeableTypeID)
        updateTempObject();
    }

    const onPlaceableFinalized = () => {
        updateTempObject();
            
        var placeable = {
            placeableID: selectedPlaceable.placeableID,
            name: placeNameRef.current.value,
            HP: hpRef.current.value != "" ? hpRef.current.value : 0,
            AC: acRef.current.value != "" ? acRef.current.value : 0,
            stealth: stealthRef.current.value != "" ? stealthRef.current.value : 0,
            placeableType: {
                placeableTypeID: typeRef.current.getValue > -1 ? typeRef.current.getValue : -1,
            },
            material: {
                materialID: materialRef.current.getValue
            },
            size: {
                sizeID: sizeRef.current.getValue
            },
            integrity: {
                integrityID: integrityRef.current.getValue
            },
            object: {


            }
        }
        
        if(tempObject == null){
            placeable.object ={
                url: selectedPlaceable.object.url,
                name: selectedPlaceable.object.name,
                color: selectedPlaceable.object.color,
                textureUrl: selectedPlaceable.object.textureUrl,
                rotation: selectedPlaceable.object.rotation,
                offset: selectedPlaceable.object.offset,
                scale: selectedPlaceable.object.scale
            }   
        }else{
            placeable.object = tempObject;
        }
        
        if(edit){
            placeable.object.position = selectedPlaceable.object.position;
            placeable.placeableSceneID = selectedPlaceable.placeableSceneID;
            placeable.sceneID = selectedPlaceable.sceneID;
            onEditPlaceable(
                placeable
            )
        }else{
            onAddPlaceable(
                placeable
            )
        }
            
       
        setTempObject(null)
    }
    const onView = () => {
        setShowViewer(prev=>!prev);
    }

    const updateTempObject = () => {
        if(showViewer){
        const object = objectRef.current.selectedOption;
        
        if(object!=null && object.url !== undefined){
            
            setTempObject(
                {
                    url: objectRef.current.selectedOption.url,
                    name: objectRef.current.selectedOption.label,
                    color: objColorRef.current.value,
                    textureUrl: objImageUrlRef.current.value,
                    rotation: {
                        x: rotationXref.current ? rotationXref.current.value != "" ? Number( rotationXref.current.value) : 0 : 0,
                        y: rotationYref.current ? rotationYref.current.value != "" ? Number(rotationYref.current.value ) : 0 : 0,
                        z: rotationZref.current ? rotationZref.current.value != "" ? Number(rotationZref.current.value ) : 0 : 0,
                    },
                    offset: {
                        x: offsetXRef.current ? offsetXRef.current.value != "" ? Number(offsetXRef.current.value ) : 0 : 0,
                            y: offsetYRef.current ? offsetYRef.current.value != "" ? Number(offsetYRef.current.value ) : 0 : 0,
                                z: offsetZRef.current ? offsetZRef.current.value != "" ? Number(offsetZRef.current.value ) : 0 : 0,
                    },
                    scale: {
                        x: scaleXRef.current ? scaleXRef.current.value != "" ? Number(scaleXRef.current.value ): 1 : 1,
                            y: scaleYRef.current ? scaleYRef.current.value != "" ? Number( scaleYRef.current.value ) : 1 : 1,
                                z: scaleZRef.current ? scaleZRef.current.value != "" ? Number(scaleZRef.current.value ) : 1 : 1,
                    },
                }
            )
        }
        }
    }

    useEffect(()=>{ 
        updatePlaceable()
    }, [selectedPlaceable])
  
    useEffect(() => {
        if (rotationXref.current) {
            if (tempObject) {
                rotationXref.current.value = tempObject.rotation.x;
                rotationYref.current.value = tempObject.rotation.y;
                rotationZref.current.value = tempObject.rotation.z;

                offsetXRef.current.value = tempObject.offset.x;
                offsetYRef.current.value = tempObject.offset.y;
                offsetZRef.current.value = tempObject.offset.z;

                scaleXRef.current.value = tempObject.scale.x;
                scaleYRef.current.value = tempObject.scale.y;
                scaleZRef.current.value = tempObject.scale.z;
                objColorRef.current.value = tempObject.color;
                objectRef.current.setValue(tempObject.objectID);
            } else {
                rotationXref.current.value = selectedPlaceable.object.rotation.x;
                rotationYref.current.value = selectedPlaceable.object.rotation.y;
                rotationZref.current.value = selectedPlaceable.object.rotation.z;

                offsetXRef.current.value = selectedPlaceable.object.offset.x;
                offsetYRef.current.value = selectedPlaceable.object.offset.y;
                offsetZRef.current.value = selectedPlaceable.object.offset.z;

                scaleXRef.current.value = selectedPlaceable.object.scale.x;
                scaleYRef.current.value = selectedPlaceable.object.scale.y;
                scaleZRef.current.value = selectedPlaceable.object.scale.z;
                objColorRef.current.value = selectedPlaceable.object.color;
                objectRef.current.setValue(selectedPlaceable.object.objectID);
            }
        }
    }, [showViewer, tempObject])
    return (
        <>
        <div style={{
             position: "fixed", display: "block", width: 900, height: 400,
            backgroundColor: "rgba(10, 12, 16, .99)", left: showViewer?"25%" : "50%", top: "50%", transform: "translate(-50%,-50%)"

        }}>
            <div style={{  width: "100%", backgroundColor: "rgba(80,80,80,.9)", height: "10px" }}></div>
            <div style={{ backgroundColor: "rgba(90,90,90,.15)", height: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                
                
                <div style={{marginLeft:40,display:"flex", flex: 1, alignItems:"center", justifyContent:"center" }} className={styles.title}>
                    <div style={{display:"block", textAlign:"center"}}>{selectedPlaceable.name}</div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }} className={showViewer ? styles.acceptButton : styles.titleButton} onClick={(e) => {
                            onView();
                        }}><img  style={{ backgroundColor:"rgba(90,90,90,.5)", boxShadow:"1px 1px 1px white", width: "25px", height: "25px" }} src="Images/viewer.png" /></div>
                </div >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }} className={styles.acceptButton} onClick={(e) => {
                        onPlaceableFinalized();
                    }}>√</div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }} className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>
           
                <div style={{ margin: "50px"}}>
                <div style={{  display: "flex", paddingTop: "20px", paddingBottom:"20px", position: "relative", alignItems: "center" }}>
                    <div style={{ flex:.2, marginLeft: "10px", marginRight: "10px" }} className={styles.fieldHeading} >
                    Name:
                    </div>
                        <div style={{ flex: 1 }}>
                        <input  ref={placeNameRef} type={"text"} placeholder="Placeable Name" className={styles.searchInput} />
                    </div>
                        <div style={{ flex:.2, marginLeft: "10px", marginRight: "10px" }} className={styles.fieldHeading} >
                            Type:
                        </div>
                        <div style={{flex:1}}>
                            <SelectBox textStyle={{
                                backgroundColor: "black",
                                fontSize: "22px",
                                outline: 0,
                                borderWidth: 0,
                                color: "white"
                            }} ref={typeRef} placeholder="Type"/>
                        </div>
                </div>
                <div style={{padding:"10px"}}>
                <div style={{ padding: "10px", display: "flex" }}>
                    <div style={{ marginRight: "10px" }} className={styles.fieldHeading} >
                        Attributes:
                    </div>
                    <div style={{ flex: .2 }}>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white"
                        }} ref={materialRef} placeholder="Material"  />
                    </div>
                    <div style={{ flex: .2 }}>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white"
                        }} ref={sizeRef} placeholder="Size" />
                    </div>
                    <div style={{ flex: .2 }}>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white"
                        }} ref={integrityRef} placeholder="Integrity"  />
                    </div>
                </div>
                    <div style={{ alignItems: "center", display: "flex", padding:"10px" }}>
                        <div style={{ marginRight: "10px", }} className={styles.fieldHeading}>
                            HP:
                        </div>
                        <div>
                            <input style={{ textAlign: "center" }} ref={hpRef} type={"text"} placeholder="0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight")
                                ) e.preventDefault();
                            }} />

                        </div>
                        <div style={{ marginRight: "10px", }} className={styles.fieldHeading}>
                            AC:
                        </div>
                        <div>
                            <input style={{ textAlign: "center" }} ref={acRef} type={"text"} placeholder="0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight")
                                ) e.preventDefault();
                            }} />

                        </div>
                            <div style={{ marginRight: "10px", }} className={styles.fieldHeading}>
                                Stealth:
                            </div>
                            <div>
                                <input style={{ textAlign: "center" }} ref={stealthRef} type={"text"} placeholder="0" className={styles.searchInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight")
                                    ) e.preventDefault();
                                }} />

                            </div>
                    </div>
              
             
         
                    
                    </div>
                </div>
             
              
        </div>
            {showViewer &&
                <div style={{ backgroundColor: "rgba(10, 12, 16, .99)", width: (pageSize.width / 2 - 100) + "px", position: "fixed", top: "50%", left: "75%", transform: "translate(-52%,-50%)" }}>
                    <div style={{ width: "100%", backgroundColor: "rgba(80,80,80,.9)", height: "10px" }}></div>
                    <div style={{margin:"20px"}}>
                    <div style={{ height: (pageSize.height / 2) + "px" }}>
                        <Suspense fallback={Loader}>
                            <Canvas shadows  camera={{
                                fov: 40,
                                near: 1, far: 1000.0, position:
                                    [
                                        0,
                                        sizeRef.current.getValue > 7 ? 5 : -15,
                                        sizeRef.current.getValue < 7 ? 9 : sizeRef.current.getValue > 8 ? 25 : 15
                                    ]
                            }}>
                                <PlaceableViewer />
                            </Canvas>
                        </Suspense>

                    </div>

                    <div ></div>
                    <div style={{ margin: "10px", display: "flex", paddingBottom: "20px" }}>
                        <div style={{ marginRight: "10px" }} className={styles.fieldHeading}>Rotation:</div>
                        <div style={{ flex: .2 }}>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={rotationXref} type={"text"} placeholder="x" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />
                        </div>
                        <div style={{ flex: .2 }}>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={rotationYref} type={"text"} placeholder="y" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />
                        </div>
                        <div style={{ flex: .2 }}>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={rotationZref} type={"text"} placeholder="z" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />
                        </div>
                    </div>
                    <div style={{ margin: "10px", display: "flex" }} >
                        <div style={{ marginRight: "10px" }} className={styles.fieldHeading}>
                            Offset:
                        </div>
                        <div>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={offsetXRef} type={"text"} placeholder="x = 0.0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />

                        </div>
                        <div>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={offsetYRef} type={"text"} placeholder="y = 0.0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />

                        </div>
                        <div>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={offsetZRef} type={"text"} placeholder="z = 0.0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />

                        </div>
                        <div style={{ marginRight: "10px" }} className={styles.fieldHeading}>
                            Scale:
                        </div>
                        <div>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={scaleXRef} type={"text"} placeholder="x=1.0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />

                        </div>
                        <div>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={scaleYRef} type={"text"} placeholder="y=1.0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />

                        </div>
                        <div>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={scaleZRef} type={"text"} placeholder="z=1.0" className={styles.searchInput} onKeyDown={(e) => {

                                if (!(e.key > -1) &&
                                    !(e.key == "Delete") &&
                                    !(e.key == "Backspace") &&
                                    !(e.key == "ArrowLeft") &&
                                    !(e.key == "ArrowRight") &&
                                    !(e.key == ".")
                                ) e.preventDefault();
                            }} />

                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }} className={styles.fieldHeading} >
                            3D Object:
                        </div>
                        <div style={{ padding: "10px" }}>
                            <SelectBox
                                onChanged={(index) => {
                                    const option = objectRef.current.selectedOption;
                                    if (option != null) {
                                        updateTempObject();
                                    }
                                }}
                                onClick={(e) => {
                                    e.prevent = true;
                                    setShowFind(true);
                                }}
                                ref={objectRef}
                                textStyle={{
                                    backgroundColor: "black",
                                    fontSize: "22px",
                                    outline: 0,
                                    borderWidth: 0,
                                    color: "white"
                                }}
                                options={objectOptions} />
                        </div>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }} className={styles.fieldHeading} >
                            Color:
                        </div>
                        <div style={{ padding: "10px" }}>
                            <input onBlur={(e) => {
                                updateTempObject();
                            }} ref={objColorRef} type={"text"} placeholder="3d Object Color" className={styles.searchInput} />
                        </div>

                    </div>
                    <div style={{ padding: "10px", display: "flex", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", height: "55px", marginRight: "10px" }} className={styles.fieldHeading} >
                            Texture:
                        </div>
                        <div style={{ flex: .8, padding: "10px" }}>
                            <input ref={objImageUrlRef} type={"text"} placeholder="3d Object Texture Url" className={styles.searchInput} onChange={(e) => {
                                objImgRef.current.src = objImageUrlRef.current.value;
                            }} />
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <img ref={objImgRef} src="" width="50" height="50" />
                        </div>
                    </div>
                    </div>
                    {showFind &&
                        <FindObject
                            top={"370px"}
                            left={"250px"}
                            onSelected={(object) => {

                                setObjectOptions([
                                    { value: object.objectID, label: object.object.name, url: object.object.url }
                                ])
                                objectRef.current.setValue(object.objectID);
                                //   setShowFind(false);
                            }}
                            onClose={() => {
                                setShowFind(false);
                            }}
                        />
                    }
                </div>

            }
        </>
    )
}

export default ScenePlaceable;
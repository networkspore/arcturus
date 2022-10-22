import React, { useState, useRef, useEffect } from 'react';
import useZust from '../../../hooks/useZust';
import styles from '../../css/campaign.module.css'
import produce from 'immer';
import  SelectBox  from '../UI/SelectBox';




export const EditPlaceables = ({...props}) => {

    const socket = useZust((state) => state.socket)
    const pageSize = useZust((state) => state.pageSize)
    const setPage = useZust((state) => state.setPage)

    const imageReader = new FileReader();
    const objectReader = new FileReader();
    const textureReader = new FileReader();

    const placeables = useZust((state) => state.placeables);
    const setPlaceables =  (array) => useZust.setState(produce((state) => {
        state.placeables = array;
    }));
    const updateCharacter = (i,c) => useZust.setState(produce((state) => {
        state.placeables[i] = c;
    }));

    const addPlaceable = (c) => useZust.setState(produce((state) => {
        state.placeables.push(c);
    }));
    const currentPlaceable = useZust((state) => state.currentPlaceable);

    const setCurrentPlaceable = (index) => useZust.setState(produce((state) => {
         state.currentPlaceable = index;
    }));


    const setTempObject = useZust((state) => state.setTempObject)

    const [placeableList, setPlaceableList] = useState(null);
    const [typeList, setTypeList] = useState(null);
    const [add, setAdd] = useState(false);
    const [update, setUpdate] = useState(false);

    const [materials, setMaterials] = useState([{label:"none", value:-1}])
    const [integrity, setIntegrity] = useState([{ label: "none", value: -1 }])
    const [sizes, setSizes] = useState([{ label: "none", value: -1 }])

    const placeNameRef = useRef();
    const typeRef = useRef();
    const objNameRef = useRef();
    const objUrlRef = useRef();
    const objColorRef = useRef();
    const objImgRef = useRef();
    const newTypeNameRef = useRef();
    const placeImageUrlRef = useRef();
    const objImageUrlRef = useRef();
  
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
        setPage(13);
        
        socket.emit("editPlaceables", (placeables,types, materialArray, integrityArray,sizeArray) => {
            var array = [];
            types.forEach(element => {
                array.push(
                    {value:element[0], label:element[1]}
                )
            });

            setTypeList(array);

            var array2 = [];
            materialArray.forEach(material => {
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
            setMaterials(array2)
         
            var array3 = [];
            integrityArray.forEach(reliable => {
                array3.push(
                    { 
                        value: reliable[0], 
                        label: reliable[1],
                        multiplier: reliable[2]
                    }
                )
            })
            setIntegrity(array3);
     
            var array4 = [];
            sizeArray.forEach(size=>{
                array4.push(
                    {
                        value:size[0],
                        label:size[1],
                        HPModifier: size[2],
                        ACModifier: size[3],
                        hideModifier: size[4],
                        diameter: size[5],
                        height:{
                            min:size[6],
                            max:size[7],
                        },
                        weight:{
                            min:size[8],
                            max:size[9]
                        }
                    }
                )
            })
            setSizes(array4)

            setPlaceables(placeables);
        })
        
        return () => {
            setCurrentPlaceable(-1);
            setPlaceables([]);
            setTempObject(null);
        }
    },[])

    const addToTypeOptions = (option) =>{
        setTypeList(produce((state)=>{
            state.push(option)
        }))
        setAddNewType(false);
    }
        

    useEffect(() => {
        if(placeables != null){
            let array = [];
            placeables.forEach((element,i) => {
                array.push(
                    <div id={i} style={{width:"100%"}} onClick={(e)=>{
                        setTempObject(null);
                        setCurrentPlaceable(Number(e.target.id))
                    }}>
                        <div id={i} style={{ display: "flex", }} className={currentPlaceable == i ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{element.name}</div>
                        </div>
                    </div>
                )
            });
            setPlaceableList(array);
            if (currentPlaceable > -1) {

                const placeable = placeables[currentPlaceable];

                


                placeNameRef.current.value = placeable.name;
           
                typeRef.current.setValue(placeable.placeableType.placeableTypeID);

                objNameRef.current.value = placeable.object.name;
                objUrlRef.current.value = placeable.object.url;
                objColorRef.current.value = placeable.object.color;

                objImageUrlRef.current.value = placeable.object.textureUrl;
                objImgRef.current.src = placeable.object.textureUrl;

                rotationXref.current.value = placeable.object.rotation.x;
                rotationYref.current.value = placeable.object.rotation.y;
                rotationZref.current.value = placeable.object.rotation.z;
                offsetXRef.current.value = placeable.object.offset.x;
                offsetYRef.current.value = placeable.object.offset.y;
                offsetZRef.current.value = placeable.object.offset.z;
                scaleXRef.current.value = placeable.object.scale.x;
                scaleYRef.current.value = placeable.object.scale.y;
                scaleZRef.current.value = placeable.object.scale.z;
                materialRef.current.setValue(placeable.material.materialID);
                sizeRef.current.setValue(placeable.size.sizeID);
                integrityRef.current.setValue(placeable.integrity.integrityID);
                hpRef.current.value = placeable.HP;
                acRef.current.value = placeable.AC;
            } else {
                hpRef.current.value = "";
                acRef.current.value = "";
                materialRef.current.setValue(-1);
                sizeRef.current.setValue(-1);
                integrityRef.current.setValue(-1);
                placeNameRef.current.value = "";
                typeRef.current.setValue(-1);
                objNameRef.current.value = "";
                objUrlRef.current.value = "";
                objColorRef.current.value = "";
                objImageUrlRef.current.value = "";
         
                objImgRef.current.src = "";

                rotationXref.current.value = "";
                rotationYref.current.value = "";
                rotationZref.current.value = "";
                offsetXRef.current.value = "";
                offsetYRef.current.value = "";
                offsetZRef.current.value = "";
                scaleXRef.current.value = "";
                scaleYRef.current.value = "";
                scaleZRef.current.value = "";
                hpRef.current.value = "";
                setTempObject(null);
                setAdd(false);
                setUpdate(false);
            }
        }
    },[placeables,currentPlaceable])

    const updateTempObject = () => {
    
        if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 2) {
       
            setTempObject(
                {

                    url: objUrlRef.current.value,
                    name: objNameRef.current.value,
                    color: objColorRef.current.value,
                    textureUrl: objImageUrlRef.current.value,
                    rotation: {
                        x: rotationXref.current.value != "" ? rotationXref.current.value : 0,
                        y: rotationYref.current.value != "" ? rotationYref.current.value : 0,
                        z: rotationZref.current.value != "" ? rotationZref.current.value : 0,
                    },
                    offset: {
                        x: offsetXRef.current.value != "" ? offsetXRef.current.value : 0,
                        y: offsetYRef.current.value != "" ? offsetYRef.current.value : 0,
                        z: offsetZRef.current.value != "" ? offsetZRef.current.value : 0,
                    },
                    scale:{ 
                        x: scaleXRef.current.value != "" ? scaleXRef.current.value : 1,
                        y: scaleYRef.current.value != "" ? scaleYRef.current.value : 1,
                        z: scaleZRef.current.value != "" ? scaleZRef.current.value : 1,
                    },
                }
            )
        }
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        if(addNewType){
            const typeName = newTypeNameRef.current.value;
            
            if(typeName.length > 2){
                socket.emit("addPlaceableType", typeName, (addedID)=>{
                    addToTypeOptions(
                        {value:addedID, label:typeName}
                    )
                    typeRef.current.setValue(addedID);
                })
            }else{
                alert("Type must be more than 2 characters long.")
            }
        }else{
   
    
        const place = currentPlaceable > -1 ? placeables[currentPlaceable] : null;
        const placeable = {
            placeableID: place != null ? place.placeableID : -1 ,
            name: placeNameRef.current.value,
            HP: hpRef.current.value != "" ? hpRef.current.value : 0,
            AC: acRef.current.value != "" ? acRef.current.value : 0,
            stealth: stealthRef.current.value != "" ? stealthRef.current.value : 0,
            placeableType:{
                placeableTypeID: typeRef.current.getValue,
            },
            object: {
                objectID: place != null ? place.object.objectID : -1 ,
                name: objNameRef.current.value,
                url: objUrlRef.current.value,
                color: objColorRef.current.value,
                textureUrl: objImageUrlRef.current.src,
                rotation: { 
                    x: rotationXref.current.value != "" ? rotationXref.current.value : 0,
                    y: rotationYref.current.value != "" ? rotationYref.current.value : 0,
                    z: rotationZref.current.value != "" ? rotationZref.current.value : 0,
                },
                offset:{
                    x: offsetXRef.current.value != "" ? offsetXRef.current.value : 0,
                    y: offsetXRef.current.value != "" ? offsetYRef.current.value : 0,
                    z: offsetXRef.current.value != "" ? offsetZRef.current.value : 0,
                },
                scale:{
                    x: scaleXRef.current.value != "" ? scaleXRef.current.value : 1,
                    y: scaleYRef.current.value != "" ? scaleYRef.current.value : 1,
                    z: scaleZRef.current.value != "" ? scaleZRef.current.value : 1
                }
            },
            material: {
                materialID: materialRef.current.getValue 
            },
            size: {
                sizeID: sizeRef.current.getValue 
            },
            integrity: {
                integrityID: integrityRef.current.getValue 
            }
         
        }
        
            if(placeable.name.length > 2){
                if(placeable.placeableType.placeableTypeID > -1){
                    if(placeable.object.name.length > 2){
                        if (placeable.object.url.length > 12){
                            if (placeable.object.color.length < 3){
                                placeable.object.color = "white"
                            }
                            
                            if(add){
                                socket.emit("addObject", placeable.object, (objectAutoID) => {
                                    if(objectAutoID > 0)
                                        placeable.object.objectID = objectAutoID;
                                        socket.emit("addPlaceable", placeable, (placeableAutoID)=>{
                                        if (placeableAutoID > 0){
                                            placeable.placeableID = placeableAutoID;
                                            setTempObject(prev => null)
                                            addPlaceable(placeable)
                                            setCurrentPlaceable(-1)
                                        }else{
                                            alert("could not insert placeable. (check connection)")
                                        }
                                    })
                                })
                            }else if(update){
                                
                                socket.emit("updatePlaceable", placeable,   (updated) =>{
                                    updateCharacter(currentPlaceable,placeable )
                                    setCurrentPlaceable(-1)
                                    setTempObject(null);
                                })
                            }else{
                                alert("Select a commit option.")
                            }
                            
                        }else{
                            alert("Object url too short.")
                        }
                    }else{
                        alert("Enter a 3d object name.")
                    }
                }else{
                    alert("Select a placeable type.")
                }
            }else{
                alert("Enter a placeable name.")
            }

        }
       
    }

    const [addNewType, setAddNewType] = useState(false);
    
    const calculate = () =>{
        if (materialRef.current.getValue > -1 && sizeRef.current.getValue > -1 && integrityRef.current.getValue > -1)
        {
            const currentMaterial = materialRef.current.selectedOption;
            const currentSize = sizeRef.current.selectedOption;
            const currentIntegrity = integrityRef.current.selectedOption;

            const hpMin = currentIntegrity.multiplier * currentSize.HPModifier;
            const hpMax = currentIntegrity.multiplier * currentSize.HPModifier * currentMaterial.dice.max;  
            
            hpRef.current.value = Math.round((hpMin + hpMax)/2);
            acRef.current.value = currentMaterial.AC + currentSize.ACModifier;

            stealthRef.current.value = currentSize.hideModifier;
        }
    }
 
    return (
        <>
        <div style={{position: "fixed", backgroundColor: "rgba(10,13,14,.7)", width:400, height:pageSize.height, left:200, top:"0px"}}>
            <div style={{
                padding:"10px",
                textAlign: "center",
                fontFamily: "WebRockwell",
                fontSize: "25px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314"
            }}>Edit Placeables</div>
            <div className={styles.titleHeading}>Placeables</div>
            <div style={{ paddingTop: 10,height: pageSize.height-150, width: "100%", textAlign: "left", overflowY: "scroll", display: "block" }}>
                {placeableList}
            </div>
           
        </div>
    

     <div style={{position: "fixed", backgroundColor: "rgba(10,13,14,.7)", width:550, height:pageSize.height, left:pageSize.width-550, top:"0px", alignItems:"center"}}>
                <div style={{
                    padding: "10px",
                    textAlign: "center",
                    fontFamily: "WebRockwell",
                    fontSize: "25px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314"
                }}>Placeable</div>
                <div style={{ display: "flex" }} className={styles.titleHeading}>Placeable Information
                    {currentPlaceable > -1 ? <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        setCurrentPlaceable(-1);
                    }}> (clear) </div> : <></>}
                </div>

                <div style={{ marginLeft: "10px", height: pageSize.height - 100, overflowY: "scroll" }}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div style={{ padding: "10px" }}>
                            <input ref={placeNameRef} type={"text"} placeholder="Placeable Name" className={styles.smallBlkInput} />
                        </div>
                        <div style={{ display: "flex", marginLeft: "8px", alignItems: "center" }}>
                            {addNewType == false &&
                                <>
                                    <div style={{ width: 300 }}>
                                        <SelectBox ref={typeRef} placeholder="Placeable Type" options={typeList} />
                                    </div>
                                    <div style={{ paddingLeft: 20 }} onClick={(e) => {
                                        setAddNewType(true);
                                    }} className={styles.textButton}>(new)</div>
                                </>
                            }
                            {addNewType &&
                                <>
                                    <div style={{}}>
                                        <input style={{ width: 250 }} ref={newTypeNameRef} type={"text"} placeholder="New type name" className={styles.smallBlkInput} />
                                    </div>
                                    <div style={{ paddingLeft: 10 }}>
                                        <input style={{ padding: 3 }} id='commit' type={"submit"} value="Add" className={styles.blkSubmit} />
                                    </div>
                                    <div style={{ paddingLeft: 10 }} onClick={(e) => {
                                        setAddNewType(false);
                                    }} className={styles.textButton}>(cancel)</div>

                                </>
                            }
                        </div>
                        <div style={{ padding:"10px",display:"flex"}}>
                           
                            <div style={{ flex:.33 }}>
                                <SelectBox ref={materialRef} placeholder="Material" options={materials} />
                            </div>
                            <div style={{ flex: .33 }}>
                                <SelectBox ref={sizeRef} placeholder="Size" options={sizes} />
                            </div>
                            <div style={{ flex: .33 }}>
                                <SelectBox ref={integrityRef} placeholder="Integrity" options={integrity} />
                            </div>
                        </div>
                        <div style={{alignItems:"center",display:"flex", paddingLeft: "10px", paddingRight: "10px", paddingTop: "10px" }}>
                            <div style={{ marginRight: "10px", }} className={styles.disclaimer}>
                                HP:
                            </div>
                            <div>
                                <input style={{textAlign:"center"}} ref={hpRef} type={"text"} placeholder="0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight")
                                    ) e.preventDefault();
                                }} />

                            </div>
                            <div style={{ marginRight: "10px", }} className={styles.disclaimer}>
                                AC:
                            </div>
                            <div>
                                <input style={{ textAlign: "center" }} ref={acRef} type={"text"} placeholder="0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") 
                                    ) e.preventDefault();
                                }} />

                            </div>
                            <div style={{ marginRight: "10px", }} className={styles.disclaimer}>
                                Stealth:
                            </div>
                            <div>
                                <input style={{ textAlign: "center" }} ref={stealthRef} type={"text"} placeholder="0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight")
                                    ) e.preventDefault();
                                }} />

                            </div>
                        </div>
                        <div style={{  }} onClick={(e) => {
                            calculate();
                        }} className={styles.textButton}>(  calculate  )</div>

                        <div style={{ padding: "10px" }}>
                            <input onBlur={(e) => {
                                if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 3) {

                                   updateTempObject();
                                }
                            }} ref={objNameRef} type={"text"} placeholder="3d Object Name" className={styles.smallBlkInput} />
                        </div>
                        <div style={{ padding: "10px" }}>
                            <input onBlur={(e) => {

                                if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 3) {

                                   updateTempObject();
                                }
                            }} ref={objUrlRef} type={"text"} placeholder="3d Object URL" className={styles.smallBlkInput} />
                        </div>
                        <div style={{ padding: "10px" }}>
                            <input onBlur={(e) => {
                                if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 3) {

                                   updateTempObject();
                                }
                            }} ref={objColorRef} type={"text"} placeholder="3d Object Color" className={styles.smallBlkInput} />
                        </div>
                        <div style={{ paddingBottom: "10px" }}>
                            <img ref={objImgRef} src="" width="90" height="90" />
                        </div>
                        <div style={{ padding: "10px" }}>
                            <input ref={objImageUrlRef} type={"text"} placeholder="3d Object Texture Url" className={styles.smallBlkInput} onChange={(e) => {
                                objImgRef.current.src = objImageUrlRef.current.value;
                            }} />
                        </div>
                        <div style={{ margin: "10px", display: "flex", paddingBottom: "20px" }}>
                            <div style={{ marginRight: "10px" }} className={styles.disclaimer}>Rotation:</div>
                            <div style={{ flex: .2 }}>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={rotationXref} type={"text"} placeholder="x=0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") &&
                                        !(e.key == ".") &&
                                        !(e.key == "-")
                                    ) e.preventDefault();
                                }} />
                            </div>
                            <div style={{ flex: .2 }}>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={rotationYref} type={"text"} placeholder="y=0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") &&
                                        !(e.key == ".") &&
                                        !(e.key == "-")
                                    ) e.preventDefault();
                                }} />
                            </div>
                            <div style={{ flex: .2 }}>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={rotationZref} type={"text"} placeholder="z=0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") &&
                                        !(e.key == ".") &&
                                        !(e.key == "-")
                                    ) e.preventDefault();
                                }} />
                            </div>
                        </div>
                        <div style={{ margin: "10px", display: "flex" }} >
                            <div style={{ marginRight: "10px", width:"150px" }} className={styles.disclaimer}>
                                Offset:
                            </div>
                            <div>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={offsetXRef} type={"text"} placeholder="x = 0.0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") &&
                                        !(e.key == ".") &&
                                        !(e.key == "-")
                                    ) e.preventDefault();
                                }} />

                            </div>
                            <div>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={offsetYRef} type={"text"} placeholder="y = 0.0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") &&
                                        !(e.key == ".") &&
                                        !(e.key == "-")
                                    ) e.preventDefault();
                                }} />

                            </div>
                            <div>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={offsetZRef} type={"text"} placeholder="z = 0.0" className={styles.smallBlkInput} onKeyDown={(e) => {

                                    if (!(e.key > -1) &&
                                        !(e.key == "Delete") &&
                                        !(e.key == "Backspace") &&
                                        !(e.key == "ArrowLeft") &&
                                        !(e.key == "ArrowRight") &&
                                        !(e.key == ".") &&
                                        !(e.key == "-")
                                    ) e.preventDefault();
                                }} />

                            </div>
                            <div style={{ marginRight: "10px" }} className={styles.disclaimer}>
                                Scale:
                            </div>
                            <div>
                                <input onBlur={(e) => {
                                    updateTempObject();
                                }} ref={scaleXRef} type={"text"} placeholder="x=1.0" className={styles.smallBlkInput} onKeyDown={(e) => {

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
                                }} ref={scaleYRef} type={"text"} placeholder="y=1.0" className={styles.smallBlkInput} onKeyDown={(e) => {

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
                                }} ref={scaleZRef} type={"text"} placeholder="z=1.0" className={styles.smallBlkInput} onKeyDown={(e) => {

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

                        <div style={{ padding: "10px", display: 'flex', textAlign: "left" }}>
                            <div onClick={(e) => {
                                if (update) setUpdate(false);
                                setAdd(!add)
                            }} style={{ display: 'flex', textAlign: "left", paddingRight: "10px", cursor: "pointer" }} > <div className={add ? styles.checked : styles.check} /><div className={styles.disclaimer}>Add</div></div>
                            <div onClick={(e) => {
                                if (add) setAdd(false);
                                setUpdate(!update)
                            }} style={{ display: 'flex', textAlign: "left", cursor: "pointer" }} ><div className={update ? styles.checked : styles.check} /><div className={styles.disclaimer}>Update</div></div>
                        </div>
                        <div style={{ padding: "5px" }}>
                            <input id='commit' type={"submit"} value="COMMIT" className={styles.blkSubmit} />
                        </div>
                    </form>

                </div>
                
    </div>
        </>
    )
}

/* Placeable.placeacterID, \
 Placeable.placeableName, \
 chrImg.imageString, \
 object.objectID, \
 object.objectName, \
 object.objectUrl, \
 object.objectColor, \
 objImg.imageString */

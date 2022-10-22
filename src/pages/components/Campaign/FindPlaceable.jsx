import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'
import SelectBox from "../UI/SelectBox";
import produce from 'immer';
import useZust from "../../../hooks/useZust";
import ScenePlaceable from "./ScenePlaceable";
import Quantity from "./Quantity";

const FindPlaceable = ({top, left, onClose, onAddPlaceable, onSelected, ...props }) => {
    const [typeOptions, setTypeOptions] = useState(
        [{ value: 0, label: "All" }]
        )
    const [sizeOptions, setSizeOptions] = useState(
        [{ value:-1, label:"unknown"}]
    )
    const [materialOptions, setMaterialOptions] = useState(
        [{value:-1, label:"unknown"}]
    )

    const [integrityOptions, setIntegrityOptions] = useState(
        [{value:-1, label:"unknown"}]
    )

    const [placeableList, setPlaceableList] = useState(null);
   
    const [placeables, setPlaceables] = useState(null);

    const placeableTypeRef = useRef();
    const searchInputRef = useRef();
    

    const socket = useZust((state) => state.socket);

    const [selectedPlaceable, setSelectedPlaceable] = useState(-1)



    useEffect(() => {
        socket.emit("getPlaceableAttributes", (types, sizes, integrity, materials) => {
            var array = [];
            array.push({ value: "0", label: "All" });
            types.forEach(type => {
                array.push(
                    { value: type[0], label: type[1] }
                )
            });
         
            setTypeOptions(array)
            
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
            setMaterialOptions(array2)

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
            setIntegrityOptions(array3);

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
            setSizeOptions(array4)
        })
    }, [])



    const onSearch = (...e) => {
        const searchText = searchInputRef.current.value;
        const placeableTypeID = placeableTypeRef.current.getValue;
     

        if(searchText.length > 2 || placeableTypeID > -1){
            socket.emit("findPlaceables", searchText, placeableTypeID, (placeables)=>{
                setPlaceables(placeables);
            })
        }
    }

    const onTypeChanged = (value) =>{
        onSearch("type")
    }


    useEffect(()=>{
        if(placeables != null){
            let array = [];

            placeables.forEach((placeable,i) => {
                array.push(
                    <div id={i} style={{ width: "100%" }} onClick={(e) => {
                        
                       setSelectedPlaceable(i);
                       if(onSelected){
                           onSelected(placeables[i]);
                       }
                    }}>
                        <div id={i} style={{ display: "flex", }} className={selectedPlaceable == i ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{placeable.name}</div>
                        </div>
                    </div>
                );
            });
            setPlaceableList(array)
         
        }
    },[placeables,selectedPlaceable])

   
    const [quantity, setQuantity] = useState(null);

    return (
        <>


        <div style={{
            position: "fixed",
            left: left, top: top, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width: "450px",
        }}>

            <div style={{ display: "flex", padding: "10px", alignItems:"baseline" , fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)", }}>
              
                <div style={{ width:"190px" }} >
                    <input onKeyDown={(e) => {
                        if (e.key == "Esc") {
                            onClose();
                        }
                    }} ref={searchInputRef} style={{ width: "100%", color: "white" }} 
                        onChange={
                            e => onSearch(e)
                        } className={styles.searchInput} type="text" placeholder="Search Placeables" />
                </div>
                
                <div style={{flex:1}}>
                    <SelectBox textStyle={{
                            backgroundColor:"black",
                            fontSize:"22px",
                            outline:0,
                            borderWidth:0,
                            color: "white"
                        }} onChanged={onTypeChanged} ref={placeableTypeRef} 
                        placeholder={"Types"} options={typeOptions}/>
                </div>
               
                <div style={{width:10}}></div>
                <div className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>
            {placeableList && placeableList.length > 10 &&
                <div style={{ height: 308, overflowY: "scroll" }}>
                    {placeableList}
                </div>
            }
            {placeableList && placeableList.length < 11 &&       
            placeableList
            }

        </div>

            {selectedPlaceable > -1 && !onSelected &&
                <ScenePlaceable
                    typeOptions={typeOptions}
                    materialOptions={materialOptions}
                    sizeOptions={sizeOptions}
                    integrityOptions={integrityOptions}

                    selectedPlaceable={placeables[selectedPlaceable]}
                    onAddPlaceable={(placeable) => {
                        setQuantity(placeable);
                        setSelectedPlaceable(-1);
                    }}
                    onClose={() => {
                        setSelectedPlaceable(-1);
                    }}

                />

            }
            {quantity != null && 
                <Quantity item={quantity} 
                    onSetQuantity={(placeable, quantity,random)=>{
                        onAddPlaceable(placeable, quantity,random);
                        setQuantity(null);
                    }}
                    onClose={()=>{setQuantity(null)}}
                />
            }
       
        </>
    )
}

export default FindPlaceable

//{placeableList == null ? <></> : placeableList.length > 5 ? <div style={{ height: 300, overflowY: "scroll" }}>{placeableList}</div> : { placeableList }}
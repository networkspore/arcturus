import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'
import SelectBox from "../UI/SelectBox";
import produce from 'immer';
import useZust from "../../../hooks/useZust";
import SceneMonster from "./SceneMonster";
import Quantity from "./Quantity";

const FindMonster = ({ onClose, onAddMonster, ...props }) => {
    const [typeOptions, setTypeOptions] = useState(
        [{ value: 0, label: "All" }]
        )
    const [subTypeOptions, setSubTypeOptions] = useState(
        [{ value: 0, label: "All" }]
        )

    const [sizeOptions, setSizeOptions] = useState([{ value: -1, label: "N/A" }])

    const [monsterList, setMonsterList] = useState(null);
   
    const [monsters, setMonsters] = useState(null);

    const monsterTypeRef = useRef();
    const searchInputRef = useRef();
    const monsterSubTypeRef = useRef();

    const socket = useZust((state) => state.socket);

    const [selectedMonster, setSelectedMonster] = useState(null)



    useEffect(() => {
        socket.emit("getMonsterAttributes", (types, subTypes, sizes) => {
            var array = [];
            array.push({ value: "0", label: "All" });
            types.forEach(type => {
                array.push(
                    { value: type[0], label: type[1] }
                )
            });
         
            setTypeOptions(array)
            
            const subArray = [];
            subArray.push({ value: "0", label: "All" });
            subTypes.forEach(type => {
                subArray.push(
                    { value: type[0], label: type[1] }
                )
            });

            setSubTypeOptions(subArray);

            const sizeArray = [];
            sizeArray.push({ value: "0", label: "All" });
            sizes.forEach(size => {
                sizeArray.push(
                    { value: size[0], label: size[1] }
                )
            });
            
            setSizeOptions(sizeArray)
        })
    }, [])



    const onSearch = (...e) => {
        const searchText = searchInputRef.current.value;
        const monsterTypeID = monsterTypeRef.current.getValue;
        const monsterSubTypeID = monsterSubTypeRef.current.getValue;

        if(searchText.length > 2 || monsterTypeID > -1){
            socket.emit("findMonsters", searchText, monsterTypeID, monsterSubTypeID, (monsters)=>{
                setMonsters(monsters);
            })
        }
    }

    const onTypeChanged = (value) =>{
       /* if(value > 0)
        {
            socket.emit("getMonsterSubTypes", value, (subTypes) => {
                var array = [];
                array.push({ value: "0", label: "All" });
                subTypes.forEach(type => {
                    array.push(
                        { value: type[0], label: type[1] }
                    )
                });
                setMonsterSubTypeOptions(array);
            })
        }else{*/
           
        //   if(monsterTypeRef.current.getValue == 0) monsterSubTypeRef.current.setValue(0);
        //}
        onSearch("type")
    }


    useEffect(()=>{
        if(monsters != null){
            let array = [];

            monsters.forEach((monster,i) => {
                array.push(
                    <div id={i} style={{ width: "100%" }} onClick={(e) => {

                       setSelectedMonster(monster);
                    }}>
                        <div id={i} style={{ display: "flex", }} className={selectedMonster == monster ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{monster.name}</div>
                        </div>
                    </div>
                );
            });
            setMonsterList(array)
         
        }
    },[monsters,selectedMonster])

   
    const [quantity, setQuantity] = useState(null);

    return (
        <>


        <div style={{
            position: "fixed",
            left: 100, top: 10, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width: "520px",
        }}>

            <div style={{ display: "flex", padding: "10px", alignItems:"baseline" , fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)", }}>
              
                <div style={{ flex:1.75}} >
                    <input onKeyDown={(e) => {
                        if (e.key == "Esc") {
                            onClose();
                        }
                    }} ref={searchInputRef} style={{ width: "100%", color: "white" }} 
                        onChange={
                            e => onSearch(e)
                        } className={styles.searchInput} type="text" placeholder="Search Monsters" />
                </div>
                
                <div style={{flex:1}}>
                    <SelectBox textStyle={{
                            backgroundColor:"black",
                            fontSize:"22px",
                            outline:0,
                            borderWidth:0,
                            color: "white"
                        }} onChanged={onTypeChanged} ref={monsterTypeRef} 
                        placeholder={"Types"} options={typeOptions}/>
                </div>
                <div style={{flex:1}}>
                    <SelectBox textStyle={{
                        backgroundColor: "black",
                        fontSize: "22px",
                        outline: 0,
                        borderWidth: 0,
                        color: "white"
                    }}onChanged={(e)=>{
                        if(e > 0) onSearch("subType");
                    }} ref={monsterSubTypeRef} placeholder={"Sub-Types"} 
                    options={subTypeOptions} />
                </div>
                <div style={{width:10}}></div>
                <div className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>

                {monsterList && monsterList.length > 10 &&
                    <div style={{ height: 308, overflowY: "scroll" }}>
                        {monsterList}
                    </div>
                }
                {monsterList && monsterList.length < 11 &&
                    monsterList
                }

        </div>

            {selectedMonster != null &&
                <SceneMonster
                    typeOptions={typeOptions}
                    subTypeOptions={subTypeOptions}
                    sizeOptions={sizeOptions}

                    selectedMonster={selectedMonster}
                    onAddMonster={(monster) => {
                        setQuantity(monster);
                        setSelectedMonster(null);
                    }}
                    onClose={() => {
                        setSelectedMonster(null);
                    }}

                />

            }
            {quantity != null && 
                <Quantity item={quantity} 
                    onSetQuantity={(monster, quantity,random)=>{
                        onAddMonster(monster, quantity,random);
                        setQuantity(null);
                    }}
                    onClose={()=>{setQuantity(null)}}
                />
            }
       
        </>
    )
}

export default FindMonster

//{monsterList == null ? <></> : monsterList.length > 5 ? <div style={{ height: 300, overflowY: "scroll" }}>{monsterList}</div> : { monsterList }}
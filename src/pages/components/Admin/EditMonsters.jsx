import React, { useState, useRef, useEffect } from 'react';
import useZust from '../../../hooks/useZust';
import styles from '../../css/campaign.module.css'
import produce from 'immer';
import  SelectBox  from '../UI/SelectBox';



export const EditMonsters = ({...props}) => {

    const socket = useZust((state) => state.socket)
    const pageSize = useZust((state) => state.pageSize)
    const setPage = useZust((state) => state.setPage)

    const imageReader = new FileReader();
    const objectReader = new FileReader();
    const textureReader = new FileReader();

    const characters = useZust((state) => state.characters);
    const setCharacters =  (array) => useZust.setState(produce((state) => {
        state.characters = array;
    }));
    const updateCharacter = (i,c) => useZust.setState(produce((state) => {
        state.characters[i] = c;
    }));

    const addCharacter = (c) => useZust.setState(produce((state) => {
        state.characters.push(c);
    }));
    const currentCharacter = useZust((state) => state.currentCharacter);

    const setCurrentCharacter = (index) => useZust.setState(produce((state) => {
         state.currentCharacter = index;
    }));

    const selectedCharacter = useZust((state)=> state.selectedCharacter);
    const setSelectedCharacter = useZust((state) => state.setSelectedCharacter);

    const [add, setAdd] = useState(false);
    const [update, setUpdate] = useState(false);

    const [monsterList, setMonsterList] = useState(null);

    const [sizeList,setSizeList] = useState(null);
    const [sizes, setSizes] = useState(new Array(0))

    const [types, setTypes] = useState(null);
    const [typeList, setTypeList] = useState(new Array(0));

    const [subTypes, setSubTypes] = useState(null);
    const [subTypeList, setSubTypeList] = useState(new Array(0));

    const [skills, setSkills] = useState(null);
    const [skillList, setSkillList] = useState(new Array(0));

    const [monsterSkills, setMonsterSkills] = useState (new Array(0));
    const [monsterSkillList, setMonsterSkillList] = useState(new Array(0));

    const [senses, setSenses] = useState(null);
    const [sensesList, setSensesList] = useState(new Array(0));

    const [monsterSenses, setMonsterSenses] = useState(new Array(0));
    const [monsterSensesList, setMonsterSensesList] = useState(new Array(0));

    const [languages, setLanguages] = useState(null);
    const [languagesList, setLanguagesList] = useState(new Array(0));

    const [monsterLanguages, setMonsterLanguages] = useState(new Array(0));
    const [monsterLanguagesList, setMonsterLanguagesList] = useState(new Array(0));

    const [traits, setTraits] = useState(null);
    const [traitsList, setTraitsList] = useState(new Array(0));

    const [monsterTraits, setMonsterTraits] = useState(new Array(0));
    const [monsterTraitsList, setMonsterTraitsList] = useState(new Array(0));

    const [actions, setActions] = useState(null);
    const [actionsList, setActionsList] = useState(new Array(0));

    const [monsterActions, setMonsterActions] = useState(new Array(0));
    const [monsterActionsList, setMonsterActionsList] = useState(new Array(0));



    const moralityList = [
        { value: -10, label: "Evil"},
        { value: 0, label:"Neutral"},
        { value: 10, label: "Good" },
    ];
    const lawfulList = [
        { value: -10, label: "Chaotic" },
        { value: 0, label:"Neutral"},
        { value: 10, label: "Lawful" },
    ]

    const diceList = [
        { value: 1, label: "D4" },
        { value: 2, label: "D6" },
        { value: 3, label: "D8" },
        { value: 4, label: "D10" },
        { value: 5, label: "D12" },
        { value: 6, label: "D20" },
    ]



    const sizeRef = useRef();
 

    const charImgRef = useRef();
    const charNameRef = useRef();
    const objNameRef = useRef();
    const objUrlRef = useRef();
    const objColorRef = useRef();
    const objImgRef = useRef();
    const submitRef = useRef();
    const charImageUrlRef = useRef();
    const objImageUrlRef = useRef();
    const typeRef = useRef();
    const subRef = useRef();
  
    const lawRef = useRef();
    const moralRef = useRef();

    const acRef = useRef();
    const speedRef = useRef();

    const hpRef = useRef();
    const dieRef = useRef();
    const diceRef = useRef();
    const dieModifierRef = useRef();

    const strRef = useRef();
    const dexRef = useRef();
    const conRef = useRef();
    const intRef = useRef();
    const wisRef = useRef();
    const chaRef = useRef();

    const ratingRef = useRef();
    const xpRef = useRef();

    const skillModifierRef = useRef();
    const skillRef = useRef();
  

    useEffect(()=>{
        setPage(12);
        
        socket.emit("editMonsters", (monsterArray, sizeArray, typeArray, subTypeArray, skillArray, senseArray, languageArray, traitArray, actionArray) => {
            
            
            setSizes(sizeArray);
            setTypes(typeArray);
            setSubTypes(subTypeArray);
            setSkills(skillArray);
            setSenses(senseArray);
            setLanguages(languageArray);
            setTraits(traitArray);
            setActions(actionArray);
            
           setCharacters(monsterArray);
        })
        
        return () => {
            setCurrentCharacter(-1);
            setCharacters([]);
            setSelectedCharacter(null);
        }
    },[])



    useEffect(()=>{
        if (monsterSkills != null) {
            if (monsterSkills.length > 0) {
                let array = [];
                let refArray = [];
               
              
                
                
                monsterSkills.forEach((skill,i) => {
                    
                    var skillName = "";

                    skills.forEach(element => {
                        if (element[0] == skill[1]){
                            skillName = element[1];
                        }
                    });
                   
                    array.push(
                        <div id={i} className={styles.menuName} style={{ paddingBottom: "10px", display:"flex" }}>
                            <div id={i} style={{width:"100px"}} >{skill[0]}</div>
                            <div id={i} >{skillName}</div>
                        </div>
                    )
                   
                });
                setMonsterSkillList(array);
              
            } else {
                setMonsterSkillList(new Array(0))
            }
        } else {
            setMonsterSkillList(new Array(0))
        }
    },[monsterSkills])

    useEffect(() => {
        if (monsterSenses != null) {
            if (monsterSenses.length > 0) {
                let array = [];
                monsterSenses.forEach((sense, i) => {
                    array.push(
                        <div id={"line" + i} style={{ paddingBottom: "10px", display: "flex" }}>
                            <input id={"modifier" + i} value={sense[0]} style={{ marginRight: "10px", width: 100, textAlign: "center" }} type={"text"} placeholder="modifier" className={styles.smallBlkInput} />
                            <SelectBox textStyle={{ width: "150px" }} id={"sense" + i} options={sensesList} />
                        </div>
                    )
                });
                setMonsterSensesList(array);
            } else {
                setMonsterSensesList(new Array(0))
            }
        } else {
            setMonsterSensesList(new Array(0))
        }
    }, [monsterSenses])

    useEffect(() => {
        if (monsterLanguages != null) {
            if (monsterLanguages.length > 0) {
                let array = [];
                monsterLanguages.forEach((language, i) => {
                    array.push(
                        <div id={"line" + i} style={{ paddingBottom: "10px", display: "flex" }}>
                            <SelectBox textStyle={{ width: "150px" }} id={"language" + i} options={languagesList} />
                        </div>
                    )
                });
                setMonsterLanguagesList(array);
            } else {
                setMonsterLanguagesList(new Array(0))
            }
        } else {
            setMonsterLanguagesList(new Array(0))
        }
    }, [monsterLanguages])

    useEffect(() => {
        if (monsterTraits != null) {
            if (monsterTraits.length > 0) {
                let array = [];
                monsterTraits.forEach((trait, i) => {
                    array.push(
                        <div id={"line" + i} style={{ paddingBottom: "10px", display: "flex" }}>
                            <SelectBox textStyle={{ width: "150px" }} id={"trait" + i} options={traitsList} />
                            <input id={"description" + i} value={trait[1]} style={{ marginLeft: "10px", width: 300, textAlign: "Left" }} type={"text"} placeholder="description" className={styles.smallBlkInput} />
                        </div>
                    )
                });

                setMonsterTraitsList(array);
            } else {
                setMonsterTraitsList(new Array(0))
            }
        } else {
            setMonsterTraitsList(new Array(0))
        }
    }, [monsterTraits])

    useEffect(() => {
        if (monsterActions != null) {
            if (monsterActions.length > 0) {
                let array = [];
                monsterActions.forEach((action, i) => {
                    array.push(
                        <div id={"line" + i} style={{ paddingBottom: "10px", display: "flex" }}>
                            <SelectBox textStyle={{ width: "150px" }} id={"action" + i} options={actionsList} />
                            <input id={"description" + i} value={action[1]} style={{ marginLeft: "10px", width: 300, textAlign: "Left" }} type={"text"} placeholder="description" className={styles.smallBlkInput} />
                        </div>
                    )
                });

                setMonsterActionsList(array);
            } else {
                setMonsterActionsList(new Array(0))
            }
        } else {
            setMonsterActionsList(new Array(0))
        }
    }, [monsterActions])


    useEffect(() => {
        if (skills != null) {
            if (skills.length > 0) {
                let array = [];
                skills.forEach((skill) => {
                    array.push(
                        { value: skill[0], label: skill[1] }
                    )
                });
                setSkillList(array);
            } else {
                setSkillList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setSkillList([
                { value: "-1", label: "Not Available" }
            ])
        }
    },[skills])

    useEffect(() => {
        if (senses != null) {
            if (senses.length > 0) {
                let array = [];
                senses.forEach(sense => {
                    array.push(
                        { value: sense[0], label: sense[1] }
                    )
                });
                setSensesList(array);
            } else {
                setSensesList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setSensesList([
                { value: "-1", label: "Not Available" }
            ])
        }
    }, [senses])

  
 
    useEffect(() => {
        if (languages != null) {
            if (languages.length > 0) {
                let array = [];
                languages.forEach(language => {
                    array.push(
                        { value: language[0], label: language[1] }
                    )
                });
                setLanguagesList(array);
            } else {
                setLanguagesList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setLanguagesList([
                { value: "-1", label: "Not Available" }
            ])
        }
    }, [languages])

    useEffect(() => {
        if (traits != null) {
            if (traits.length > 0) {
                let array = [];
                traits.forEach(trait => {
                    array.push(
                        { value: trait[0], label: trait[1] }
                    )
                });
                setTraitsList(array);
            } else {
                setTraitsList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setTraitsList([
                { value: "-1", label: "Not Available" }
            ])
        }
    }, [traits])

    useEffect(() => {
        if (actions != null) {
            if (actions.length > 0) {
                let array = [];
                actions.forEach(action => {
                    array.push(
                        { value: action[0], label: action[1] }
                    )
                });
                setActionsList(array);
            } else {
                setActionsList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setActionsList([
                { value: "-1", label: "Not Available" }
            ])
        }
    }, [actions])

    useEffect(() => {
        if(characters != null){
            let array = [];
            characters.forEach((element,i) => {
                array.push(
                    <div id={i} style={{width:"100%"}} onClick={(e)=>{
                       
                        setCurrentCharacter(Number(e.target.id))
                    }}>
                        <div id={i} style={{ display: "flex", }} className={currentCharacter == i ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{element.name}</div>
                        </div>
                    </div>
                )
            });
            setMonsterList(array);
            if (currentCharacter > -1) {
                setSelectedCharacter(null);
                const monster = characters[currentCharacter];



                hpRef.current.value = monster.HP;
                acRef.current.value = monster.AC;
                speedRef.current.value = monster.speed;
                xpRef.current.value = monster.XP;
                strRef.current.value = monster.STR;
                dexRef.current.value = monster.DEX
                conRef.current.value = monster.CON
                intRef.current.value = monster.INT
                wisRef.current.value = monster.WIS
                chaRef.current.value = monster.CHA


                charNameRef.current.value = monster.name;
                charImageUrlRef.current.value = monster.imageUrl;
                charImgRef.current.src = monster.imageUrl;
           
                sizeRef.current.setValue(monster.size.sizeID);

                
                objNameRef.current.value = monster.object.name;
                objUrlRef.current.value = monster.object.url;
                objColorRef.current.value = monster.object.color;

                objImageUrlRef.current.value = monster.object.textureUrl;
                objImgRef.current.src = monster.object.textureUrl;

                typeRef.current.setValue(monster.monsterType.monsterTypeID)

                subRef.current.setValue(monster.monsterSubType.monsterSubTypeID)

                lawRef.current.setValue(monster.lawful);
                moralRef.current.setValue(monster.morality);
                dieModifierRef.current.value = monster.diceModifier;
                dieRef.current.value = monster.diceMultiplier;
                diceRef.current.setValue(monster.diceID);
                ratingRef.current.value = monster.challenge;
             

            } else {
     
   
                charNameRef.current.value = "";
                charImageUrlRef.current.value = "";
                objNameRef.current.value = "";
                objUrlRef.current.value = "";
                objColorRef.current.value = "";
                objImageUrlRef.current.value = "";
                charImgRef.current.src = "";
                objImgRef.current.src = "";
                sizeRef.current.setValue(-1);
                typeRef.current.setValue(-1);
                subRef.current.setValue(-1);
                moralRef.current.setValue(-1);
                lawRef.current.setValue(-1);
                diceRef.current.setValue(-1);
                dieModifierRef.current.value = "";
                dieRef.current.value = "";
                ratingRef.current.value ="";
                xpRef.current.value = "";

                hpRef.current.value = "";
                acRef.current.value = "";
                speedRef.current.value = "";
                xpRef.current.value = "";
                strRef.current.value = "";
                dexRef.current.value = "";
                conRef.current.value = "";
                intRef.current.value = "";
                wisRef.current.value = "";
                chaRef.current.value = "";
                setSelectedCharacter(null);

                setMonsterSkills(new Array(0));
                setMonsterSenses(new Array(0));
                setMonsterLanguages(new Array(0));
                setMonsterTraits(new Array(0));
                setMonsterActions(new Array(0));
             
                setAdd(false);
                setUpdate(false);
            }
        }
    },[characters,currentCharacter])

    useEffect(()=> {
        if(sizes != null){
            if (sizes.length > 0){
                let array = [];
                sizes.forEach((race, i) => {
                    array.push(
                        {value:race[0], label:race[1]}
                    )
                });
                setSizeList(array);
            }else{
                setSizeList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        }else{
            setSizeList  ([
                {value: "-1", label:"Not Available"}
            ])
        }
    }, [sizes])

    useEffect(() => {
        if (types != null) {
            if (types.length > 0){
                let array = [];
                types.forEach((type, i) => {
                    array.push(
                        { value: type[0], label: type[1] }
                    )
                });
                setTypeList(array);
            }else{
                setTypeList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setTypeList([
                { value: "-1", label: "Not Available" }
            ])
        }
    }, [types])

    useEffect(() => {
        if (subTypes != null) {
            if (subTypes.length > 0){

            
                let array = [];
                subTypes.forEach((subType, i) => {
                    array.push(
                        { value: subType[0], label: subType[1] }
                    )
                });
                setSubTypeList(array);
            }else{
                setSubTypeList([
                    { value: "-1", label: "Not Available" }
                ])
            }
        } else {
            setSubTypeList([
                { value: "-1", label: "Not Available" }
            ])
        }
    }, [subTypes])


    const onSubmit = (e) =>{
        e.preventDefault();
        const mon = currentCharacter > -1 ? characters[currentCharacter] : null;
        const monster = {
            monsterID: mon != null ? mon.monsterID : -1 ,
            name: charNameRef.current.value,
            HP: hpRef.current.value,
            AC: acRef.current.value,
            XP: xpRef.current.value,
            speed: speedRef.current.value,
            challenge: ratingRef.current.value,
            lawful: lawRef.current.getValue,
            morality: moralRef.current.getValue,
            diceMultiplier: dieRef.current.value,
            diceID: diceRef.current.getValue,
            diceModifier: dieModifierRef.current.value,
            imageUrl: charImageUrlRef.current.value,
            
            STR: strRef.current.value,
            DEX: dexRef.current.value,
            CON: conRef.current.value,
            INT: intRef.current.value,
            WIS: wisRef.current.value,
            CHA: chaRef.current.value,

            monsterType:{
                monsterTypeID:typeRef.current.getValue
            },
            monsterSubType:{
                monsterSubTypeID: subRef.current.getValue
            },
           
            size: {
                sizeID: sizeRef.current.getValue
            },
            object: {
                objectID: mon != null ? mon.object.objectID : -1 ,
                name: objNameRef.current.value,
                url: objUrlRef.current.value,
                color: objColorRef.current.value,
                textureUrl: objImageUrlRef.current.src
            },
          
         
        }
        
            if(monster.name.length > 2){
                if(monster.object.name.length > 2){
                    if (monster.object.url.length > 12){
                        if (monster.object.color.length < 3){
                            monster.object.color = "white"
                        }
                       
                        if(add){
                            socket.emit("addObject", monster.object, (objectAutoID) => {
                                if(objectAutoID > 0)
                                    monster.object.objectID = objectAutoID;
                                    socket.emit("addMonster", monster, (monsterAutoID)=>{
                                    if (monsterAutoID){
                                        monster.monsterID = monsterAutoID;
                                        
                                        addCharacter(monster)
                                        setCurrentCharacter(-1)
                                    }
                                })
                            })
                        }else if(update){
                            
                            socket.emit("updateMonster", monster,   (updated) =>{
                                updateCharacter(currentCharacter,monster )
                                setCurrentCharacter(-1)
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
                alert("Enter a monster name.")
            }
       
    }

    const addMonsterSkill = () => {
        if(skillRef.current.getValue != -1)
        {
            setMonsterSkills( produce( (state) =>{
                state.push(
                    [skillModifierRef.current.value,skillRef.current.getValue]
                )
            }))
            skillModifierRef.current.value = "";
            skillRef.current.setSelectedIndex(-1);
        }
    }

    const addMonsterSense = () => {
        setMonsterSenses(produce((state) => {
            state.push(
                [0, 0]
            )
        }))
    }

    const addMonsterLanguage = () => {
        setMonsterLanguages(produce((state) => {
            state.push(
                [0]
            )
        }))
    }
    const addMonsterTrait = () => {
        setMonsterTraits(produce((state) => {
            state.push(
                [0,""]
            )
        }))
    }
    const addMonsterAction = () => {
        setMonsterActions(produce((state) => {
            state.push(
                [0, ""]
            )
        }))
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
            }}>Edit Monsters</div>
            <div className={styles.titleHeading}>Monsters</div>
            <div style={{ height: "130px", width: "100%", textAlign: "left", overflowY: "scroll", display: "block" }}>
                {monsterList}
            </div>
            <div style={{display:"flex"}} className={styles.titleHeading}>Monster Information 
              {currentCharacter > -1 ?   <div style={{marginLeft:"10px"}} className={styles.clickText} onClick={(e) => {
                    setCurrentCharacter(-1);
                }}> (clear) </div> : <></>}
           </div>
         
            <div style={{marginLeft:"10px", height:pageSize.height - 300, overflowY:"scroll"}}>
            <form onSubmit={(e) => onSubmit(e)}>
           
            
                <div style={{paddingBottom:"10px"}}>
                    <img ref={charImgRef} src="" width="90" height="90" />
                </div>
                <div style={{padding:"10px"}}>
                        <input ref={charImageUrlRef} type={"text"} placeholder="Monster Image Url" className={styles.smallBlkInput} onChange={ (e) => {
                        charImgRef.current.src = charImageUrlRef.current.value;
                    }}/>
                </div>
                <div style={{ padding: "10px" }}>
                    <input onBlur={(e) => {
                        if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 3) {

                            setSelectedCharacter({ temp: true, object: { url: objUrlRef.current.value, name: objNameRef.current.value, color: objColorRef.current.value } })
                        }
                    }} ref={objNameRef} type={"text"} placeholder="3d Object Name" className={styles.smallBlkInput} />
                </div>
                <div style={{ padding: "10px" }}>
                    <input onBlur={(e) => {
                        if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 3) {

                            setSelectedCharacter({ temp: true, object: { url: objUrlRef.current.value, name: objNameRef.current.value, color: objColorRef.current.value } })
                        }
                    }} ref={objUrlRef} type={"text"} placeholder="3d Object URL" className={styles.smallBlkInput} />
                </div>
                <div style={{ padding: "10px" }}>
                    <input onBlur={(e) => {
                        if (objUrlRef.current.value.length > 23 && objNameRef.current.value.length > 3) {

                            setSelectedCharacter({ temp: true, object: { url: objUrlRef.current.value, name: objNameRef.current.value, color: objColorRef.current.value } })
                        }
                    }} ref={objColorRef} type={"text"} placeholder="3d Object Color" className={styles.smallBlkInput} />
                </div>
                <div style={{ paddingBottom: "10px" }}>
                    <img ref={objImgRef} src="" width="90" height="90" />
                </div>
                <div style={{ padding: "10px" }}>
                    <input ref={objImageUrlRef} type={"text"} placeholder="3d Object Texture Url" className={styles.smallBlkInput} onChange={ (e) => {
                        objImgRef.current.src = objImageUrlRef.current.value;
                    }} />
                </div>

                <div style={{ padding: "10px", display:'flex', textAlign:"left"}}>
                        <div onClick={(e) => {
                            if(update) setUpdate(false);
                            setAdd(!add)
                        }} style={{ display: 'flex', textAlign: "left", paddingRight:"10px", cursor: "pointer" }} > <div className={add ? styles.checked : styles.check} /><div className={styles.disclaimer}>Add</div></div> 
                        <div onClick={(e) => {
                            if(add) setAdd(false);
                            setUpdate(!update)
                        }} style={{ display: 'flex', textAlign: "left", cursor: "pointer" }} ><div className={update ? styles.checked : styles.check} /><div className={styles.disclaimer}>Update</div></div>
                </div>
                <div style={{ padding: "5px" }}>
                    <input id='commit' type={"submit"} value="COMMIT" className={styles.blkSubmit} />
                    </div>
                </form>
                      
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
                }}>Monster Stats</div>
                <div style={{ padding: "10px" }}>
                    <input style={{width:200, textAlign:"center"}} ref={charNameRef} type={"text"} placeholder="Monster Name" className={styles.smallBlkInput} />
                </div>
                <div style={{ padding: "10px", display: "flex", position: "relative", alignItems: "center" }}>
                    <div>
                        <SelectBox ref={sizeRef} placeholder="Size" options={sizeList} />
                    </div>
                    <div style={{marginLeft:"8px"}}>
                        <SelectBox ref={typeRef} placeholder="Type" options={typeList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox ref={subRef} placeholder="Sub-Type" options={subTypeList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox ref={lawRef} placeholder="Lawfulness" options={lawfulList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox textStyle={{width:"80px"}} ref={moralRef} placeholder="Morality" options={moralityList} />
                    </div>
                </div>
                <div style={{ display: "flex", paddingLeft: "10px", paddingTop:"30px", position:"relative", alignItems:"center"}}>
                    <div style={{marginRight:"5px"}} className={styles.disclaimer}>AC:</div>
                    <div>
                        <input style={{ width: 30, marginRight: "5px" }} ref={acRef} type={"text"} placeholder="AC" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }}/>
                    </div>
                    <div style={{ marginLeft: "5px" }} className={styles.disclaimer}>Speed:</div>
                    <div>
                        <input style={{ width: 50, textAlign: "center" }} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={speedRef} type={"text"} placeholder="Feet" className={styles.smallBlkInput} />
                    </div>
                    <div style={{ marginLeft:"15px", marginRight: "5px" }} className={styles.disclaimer}>HP:</div>
                    <div>
                        <input style={{ width: 50, marginRight: "5px", textAlign:"center" }} ref={hpRef} type={"text"} placeholder="Avg." className={styles.smallBlkInput} />
                    </div>
                    <div style={{marginLeft:"10px", marginRight: "5px" }} className={styles.disclaimer}>Hit Dice:</div>
                    <div>
                        <input style={{ width: 40, textAlign: "center" }} onKeyDown={(e)=>{
                            
                            if (!(e.key > -1) && 
                            !(e.key == "Delete") && 
                            !(e.key =="Backspace") &&
                            !(e.key == "ArrowLeft") &&
                            !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={dieRef} type={"text"} placeholder="x" className={styles.smallBlkInput} />
                    </div>
                    <div>
                        <SelectBox textStyle={{width:"60px"}} ref={diceRef} placeholder="Dice" options={diceList} />
                    </div>
                    <div>
                        <input style={{width:"40px"} } onKeyDown={(e) => {
                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={dieModifierRef} type={"text"} placeholder="mod." className={styles.smallBlkInput} />
                    </div>
                </div>
                <div style={{paddingLeft: "10px", paddingTop: "30px", paddingBottom:"20px"}} className={styles.titleHeading}>Abilities</div>
                <div style={{ display:"flex",position: "relative", alignItems: "center" }}>
                    
                    <div style={{  flex: 1  }} className={styles.disclaimer}>STR</div>
                    <div style={{ flex: 1}} className={styles.disclaimer}>DEX</div>
                    <div style={{  flex: 1}} className={styles.disclaimer}>CON</div>
                    <div style={{  flex: 1}} className={styles.disclaimer}>INT</div>
                    <div style={{  flex: 1}} className={styles.disclaimer}>WIS</div>
                    <div style={{ flex: 1 }} className={styles.disclaimer}>CHA</div>
                </div>
                <div style={{ display: "flex", paddingLeft: "10px", paddingTop: "10px", position: "relative", alignItems: "center" }}>

                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign:"center"  }} ref={strRef} type={"text"} placeholder="str" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center"}} ref={dexRef} type={"text"} placeholder="dex" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center"}} ref={conRef} type={"text"} placeholder="con" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center"}} ref={intRef} type={"text"} placeholder="int" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={wisRef} type={"text"} placeholder="wis" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center"  }} ref={chaRef} type={"text"} placeholder="cha" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                </div>
                <div style={{paddingTop: "20px"}} ></div>
                <div style={{  overflowY: "scroll", height: pageSize.height - 450}}>
                <div style={{ display: "flex" }} className={styles.titleHeading}>Skills</div>
                <div style={{  paddingLeft: "10px", paddingTop: "10px" }}>
                       
                    {monsterSkillList}
                        <div style={{ paddingBottom: "10px", display: "flex" }}>
                            <input
                                ref={skillModifierRef}
                                style={{
                                    marginRight: "10px",
                                    width: 100,
                                    textAlign: "center"
                                }}
                                type={"text"} placeholder="modifier" className={styles.smallBlkInput} />
                            <SelectBox ref={skillRef} placeholder={"skill"} textStyle={{ width: "150px" }} options={skillList} />
                            <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                                addMonsterSkill();
                            }}> (add skill) </div>
                        </div>
                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.titleHeading}>Senses
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterSense();
                    }}> (add sense) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterSensesList}

                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.titleHeading}>Languages
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterLanguage();
                    }}> (add language) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterLanguagesList}

                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.titleHeading}>Challenge</div>
                <div style={{ display: "flex", paddingLeft: "10px", paddingTop: "10px", position: "relative", alignItems: "center" }}>
                    <div style={{ marginLeft: "10px", marginRight: "5px" }} className={styles.disclaimer}>Challenge:</div>
                    <div style={{  }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={ratingRef} type={"text"} placeholder="rating" className={styles.smallBlkInput} onKeyDown={(e) => {
                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") &&
                                !(e.key == ".")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ marginLeft: "10px", marginRight: "5px" }} className={styles.disclaimer}>XP:</div>
                    <div style={{  }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={xpRef} type={"text"} placeholder="xp" className={styles.smallBlkInput} onKeyDown={(e) => {
                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight") 
                            ) e.preventDefault();
                        }} />
                    </div>
                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.titleHeading}>Traits
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterTrait();
                    }}> (add trait) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterTraitsList}

                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.titleHeading}>Actions
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterAction();
                    }}> (add action) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterActionsList}

                </div>
                </div>
        </div>
        </>
    )
}

/* Monster.characterID, \
 Monster.monsterName, \
 chrImg.imageString, \
 object.objectID, \
 object.objectName, \
 object.objectUrl, \
 object.objectColor, \
 objImg.imageString */

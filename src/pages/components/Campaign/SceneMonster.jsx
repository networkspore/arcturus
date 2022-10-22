import React, { useEffect, useRef, useState, Suspense } from "react";
import styles from '../../css/home.module.css'
import listStyle from '../../css/campaign.module.css'
import useZust from "../../../hooks/useZust";
import SelectBox from "../UI/SelectBox";
import produce from 'immer';
import { CharacterSelection } from "../CharacterSelection";
import loadingStyles from '../../css/loading.module.css';
import FindObject from "./FindObject";
import { Canvas } from '@react-three/fiber';
import { MonsterViewer } from "../MonsterViewer";

const Loader = (<>  <div className={loadingStyles.loading}  >
    <div >
        <div className={loadingStyles.logo}></div>
        <div className={loadingStyles.loadingText}>
            Loading

        </div>

    </div>

</div></>);

const SceneMonster = ({ onClose, sizeOptions, typeOptions,subTypeOptions, selectedMonster, onAddMonster, onEditMonster, ...props}) =>{
    
    const pageSize = useZust((state)=> state.pageSize)

    const [showViewer, setShowViewer] = useState(false);
    const tempObject = useZust((state) => state.tempObject)
    const setTempObject = useZust((state) => state.setTempObject)

    const [objectOptions, setObjectOptions] = useState(
        [{ value: selectedMonster.object.objectID, label: selectedMonster.object.name, url: selectedMonster.object.url }]
    );
    
    const objectRef = useRef();

    const [showFind, setShowFind] = useState(false);

    const [skills, setSkills] = useState(null);
    const [skillList, setSkillList] = useState(new Array(0));

    const [monsterSkills, setMonsterSkills] = useState(new Array(0));
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
        { value: -10, label: "Evil" },
        { value: 0, label: "Neutral" },
        { value: 10, label: "Good" },
    ];
    const lawfulList = [
        { value: -10, label: "Chaotic" },
        { value: 0, label: "Neutral" },
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


    const monsterImgRef = useRef();
    const monsterNameRef = useRef();
    const objNameRef = useRef();
    const objUrlRef = useRef();
    const objColorRef = useRef();
    const objImgRef = useRef();
    const submitRef = useRef();
    const monsterImageUrlRef = useRef();
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

    const rotationXref = useRef();
    const rotationYref = useRef();
    const rotationZref = useRef();
    const offsetXRef = useRef();
    const offsetYRef = useRef();
    const offsetZRef = useRef();
    const scaleXRef = useRef();
    const scaleYRef = useRef();
    const scaleZRef = useRef();

    const ratingRef = useRef();
    const xpRef = useRef();

    const skillModifierRef = useRef();
    const skillRef = useRef();

    const [monsterTypeOptions, setMonsterTypeOptions] = useState([{value:-1, Label:"Not Available"}])

    

    useEffect(()=>{
        
        updateMonster();
      
        return ()=>{
            setTempObject(null);
        }
    },[])

    const updateMonster = () =>{
        monsterNameRef.current.value = selectedMonster.name;
        hpRef.current.value = selectedMonster.HP;
        acRef.current.value = selectedMonster.AC;
        speedRef.current.value = selectedMonster.speed;
        xpRef.current.value = selectedMonster.XP;
        strRef.current.value = selectedMonster.STR;
        dexRef.current.value = selectedMonster.DEX
        conRef.current.value = selectedMonster.CON
        intRef.current.value = selectedMonster.INT
        wisRef.current.value = selectedMonster.WIS
        chaRef.current.value = selectedMonster.CHA



        sizeRef.current.setValue(selectedMonster.size.sizeID);
        typeRef.current.setValue(selectedMonster.monsterType.monsterTypeID)
        subRef.current.setValue(selectedMonster.monsterSubType.monsterSubTypeID)
        

        diceRef.current.setValue(selectedMonster.diceID);
        lawRef.current.setValue(selectedMonster.lawful);
        moralRef.current.setValue(selectedMonster.morality);

        dieModifierRef.current.value = selectedMonster.diceModifier;
        dieRef.current.value = selectedMonster.diceMultiplier;
        ratingRef.current.value = selectedMonster.challenge;

    
    }


    const onMonsterFinalized = () =>{
        

        var monster = {
            monsterSceneID: -1,
            monsterID: selectedMonster.monsterID,
            sceneID: -1,
            userID: -1,
            imageUrl: selectedMonster.imageUrl,

            name: monsterNameRef.current.value,
            HP: hpRef.current.value,
            AC: acRef.current.value,
            XP: xpRef.current.value,
            speed: speedRef.current.value,
            challenge: ratingRef.current.value,
            lawful: lawRef.current.getValue,
            morality: moralRef.current.getValue,
            dice:{
                diceMultiplier: dieRef.current.value,
                diceID: diceRef.current.getValue,
                diceModifier: dieModifierRef.current.value,
            },
            monsterType:{
                monsterTypeID:typeRef.current.getValue
            },
            monsterSubType:{
                monsterSubTypeID:subRef.current.getValue,
            },

            STR: strRef.current.value,
            DEX: dexRef.current.value,
            CON: conRef.current.value,
            INT: intRef.current.value,
            WIS: wisRef.current.value,
            CHA: chaRef.current.value,
            
            size: {
                sizeID: sizeRef.current.getValue
            },
            object: null,
        }
        
        if(tempObject){
            monster.object = tempObject;
        }else{
            monster.object = selectedMonster.object;
        }
    
     
      
        if(onAddMonster){
            onAddMonster(monster);
        }else if(onEditMonster) onEditMonster(monster);
            
    }

    const updateTempObject = () => {
        if(showViewer){
        const object = objectRef.current.selectedOption;

        if (object != null && object.url !== undefined) {

            setTempObject(
                {
                    objectID: objectRef.current.getValue,
                    url: objectRef.current.selectedOption.url,
                    name: objectRef.current.selectedOption.label,
                    color: objColorRef.current.value,
                    textureUrl: objImageUrlRef.current.value,
                    rotation: {
                        x: rotationXref.current ? rotationXref.current.value != "" ? rotationXref.current.value : 0 : 0,
                        y: rotationYref.current ? rotationYref.current.value != "" ? rotationYref.current.value : 0 : 0,
                        z: rotationZref.current ? rotationZref.current.value != "" ? rotationZref.current.value : 0 : 0,
                    },
                    offset: {
                        x: offsetXRef.current ? offsetXRef.current.value != "" ? offsetXRef.current.value : 0 : 0,
                        y: offsetYRef.current ? offsetYRef.current.value != "" ? offsetYRef.current.value : 0 : 0,
                        z: offsetZRef.current ? offsetZRef.current.value != "" ? offsetZRef.current.value : 0 : 0,
                    },
                    scale: {
                        x: scaleXRef.current ? scaleXRef.current.value != "" ? scaleXRef.current.value : 1 : 1,
                        y: scaleYRef.current ? scaleYRef.current.value != "" ? scaleYRef.current.value : 1 : 1,
                        z: scaleZRef.current ? scaleZRef.current.value != "" ? scaleZRef.current.value : 1 : 1,
                    },
                }
            )
        }}
    }
    const addMonsterSkill = () =>{

    }

    const addMonsterTrait = () =>{

    }
    
    const addMonsterLanguage = () =>{

    }

    const addMonsterAction = () =>{

    }

    const addMonsterSense = () =>{
        
    }

    const onView = () => {

        setShowViewer(prev => !prev);

     
    }
    useEffect(()=>{
        if (rotationXref.current) {
            if(tempObject)
            {
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
            }else{
                rotationXref.current.value = selectedMonster.object.rotation.x;
                rotationYref.current.value = selectedMonster.object.rotation.y;
                rotationZref.current.value = selectedMonster.object.rotation.z;

                offsetXRef.current.value = selectedMonster.object.offset.x;
                offsetYRef.current.value = selectedMonster.object.offset.y;
                offsetZRef.current.value = selectedMonster.object.offset.z;

                scaleXRef.current.value = selectedMonster.object.scale.x;
                scaleYRef.current.value = selectedMonster.object.scale.y;
                scaleZRef.current.value = selectedMonster.object.scale.z;
                objColorRef.current.value = selectedMonster.object.color;
                objectRef.current.setValue(selectedMonster.object.objectID);
            }
        }
    },[showViewer,tempObject])

    return (
        <>
        <div style={{
            position: "fixed", display: "block", width: 875, height: 700,
            backgroundColor: "rgba(10, 12, 16, .99)", left: showViewer ? "25%" : "50%", top: "50%", transform: "translate(-48%,-50%)"

        }}>
            <div style={{ width: "100%", backgroundColor: "rgba(80,80,80,.9)", height: "10px" }}></div>
            <div style={{ backgroundColor: "rgba(90,90,90,.15)", height: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>


                <div style={{ marginLeft: 40, display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }} className={styles.title}>
                    <div style={{ display: "block", textAlign: "center" }}>{selectedMonster.name}</div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }} className={showViewer ? styles.acceptButton : styles.titleButton} onClick={(e) => {
                        onView();
                    }}><img style={{ backgroundColor: "rgba(90,90,90,.5)", boxShadow: "1px 1px 1px white", width: "25px", height: "25px" }} src="Images/viewer.png" /></div>
                </div >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }} className={styles.acceptButton} onClick={(e) => {
                    onMonsterFinalized();
                }}>√</div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }} className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>

            <div style={{ justifyContent: "center", paddingTop: "20px", display: "flex", alignItems: "center" }}>
                <div className={styles.fieldHeading}>Name:</div>
                <input style={{ width: 200, textAlign: "center" }} ref={monsterNameRef} type={"text"} placeholder="Monster Name" className={styles.searchInput} />
                <div style={{ marginLeft: "20px" }} className={styles.fieldHeading}>Creature Type:</div>
                <div style={{ marginLeft: "10px" }}>
                    <SelectBox textStyle={{
                        backgroundColor: "black",
                        fontSize: "22px",
                        outline: 0,
                        borderWidth: 0,
                        color: "white",
                        width: "150px"
                    }} ref={typeRef} placeholder="Type" options={typeOptions} />
                </div>
                <div style={{ marginLeft: "8px" }}>
                    <SelectBox textStyle={{
                        backgroundColor: "black",
                        fontSize: "22px",
                        outline: 0,
                        borderWidth: 0,
                        color: "white"
                    }} ref={subRef} placeholder="Sub-Type" options={subTypeOptions} />
                </div>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault()
                onMonsterFinalized();
            }}>
                <div style={{ justifyContent:"center", display: "flex",paddingTop: "10px", position: "relative", alignItems: "center" }}>
                    <div style={{ marginLeft: "10px", marginRight: "10px" }} className={styles.fieldHeading}>HP:</div>
                    <div>
                        <input style={{ width: 60, marginRight: "10px", textAlign: "center" }} ref={hpRef} type={"text"} placeholder="avg." className={styles.searchInput} />
                    </div>
                    
                    <div style={{ marginRight: "5px" }} className={styles.fieldHeading}>AC:</div>
                    <div>
                        <input style={{ width: 50, marginRight: "5px" }} ref={acRef} type={"text"} placeholder="ac" className={styles.searchInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                  
                    <div style={{ marginLeft: "10px", marginRight: "10px" }} className={styles.fieldHeading}>Hit Dice:</div>
                    <div>
                        <input style={{ width: 40, textAlign: "center" }} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={dieRef} type={"text"} placeholder="x" className={styles.searchInput} />
                    </div>
                    <div>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white",
                            width: "60px"
                        }} ref={diceRef} placeholder="Dice" options={diceList} />
                    </div>
                    <div>
                        <input style={{ width: "50px" }} onKeyDown={(e) => {
                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={dieModifierRef} type={"text"} placeholder="mod." className={styles.searchInput} />
                    </div>
                    
                    <div style={{ marginLeft: "20px", marginRight: "5px" }} className={styles.fieldHeading}>XP:</div>
                    <div style={{}}>
                        <input style={{ width: 70, textAlign: "center" }} ref={xpRef} type={"text"} placeholder="xp" className={styles.searchInput} onKeyDown={(e) => {
                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                   
                    <div style={{ marginLeft: "10px", marginRight: "5px" }} className={styles.fieldHeading}>Challenge:</div>
                    <div style={{}}>
                        <input style={{ width: 70, textAlign: "center" }} ref={ratingRef} type={"text"} placeholder="rating" className={styles.searchInput} onKeyDown={(e) => {
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

                <div style={{ justifyContent:"center",  paddingTop: "20px", display: "flex", position: "relative", alignItems: "center" }}>
                    <div style={{ marginLeft: "20px" }} className={styles.fieldHeading}>Speed:</div>
                    <div>
                        <input style={{ width: 60, textAlign: "center" }} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={speedRef} type={"text"} placeholder="feet" className={styles.searchInput} />
                    </div>
                    <div style={{ marginLeft: "20px" }} className={styles.fieldHeading}>Size:</div>
                    <div style={{ marginLeft: "20px" }}>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white",
                            width:"150px"
                        }} ref={sizeRef} placeholder="Size" options={sizeOptions} />
                    </div>
                    <div style={{ marginLeft: "10px", marginRight: "5px" }} className={styles.fieldHeading}>Alignment:</div>
                    <div style={{ marginLeft: "10px" }}>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white",
                            width: "150px"
                        }} ref={lawRef} placeholder="Lawfulness" options={lawfulList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox textStyle={{
                            backgroundColor: "black",
                            fontSize: "22px",
                            outline: 0,
                            borderWidth: 0,
                            color: "white",
                            width: "150px"
                        }} ref={moralRef} placeholder="Morality" options={moralityList} />
                    </div>
                </div>
               
             
                <div style={{ paddingTop:"30px", justifyContent:"center", display:"flex",position: "relative", alignItems: "center" }}>
                    
                    <div style={{ textAlign: "center", width:"140px"}} className={styles.fieldHeading}>STR</div>
                    <div style={{ textAlign: "center", width: "140px" }}  className={styles.fieldHeading}>DEX</div>
                    <div style={{ textAlign: "center", width:"140px"}}  className={styles.fieldHeading}>CON</div>
                    <div style={{ textAlign: "center", width: "140px" }}  className={styles.fieldHeading}>INT</div>
                    <div style={{ textAlign: "center", width: "140px" }}   className={styles.fieldHeading}>WIS</div>
                    <div style={{ textAlign: "center", width: "140px" }}   className={styles.fieldHeading}>CHA</div>
                </div>
                <div style={{ justifyContent:"center", display: "flex",  paddingTop: "10px", position: "relative", alignItems: "center" }}>

                    <div style={{ textAlign: "center", width:"140px"}}>
                        <input style={{ width: 80, textAlign:"center"  }} ref={strRef} type={"text"} placeholder="str" className={styles.searchInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ textAlign: "center", width:"140px"}}>
                        <input style={{ width: 80, textAlign: "center"}} ref={dexRef} type={"text"} placeholder="dex" className={styles.searchInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ textAlign: "center", width:"140px"}}>
                        <input style={{ width: 80, textAlign: "center"}} ref={conRef} type={"text"} placeholder="con" className={styles.searchInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ textAlign: "center", width:"140px"}}>
                        <input style={{ width: 80, textAlign: "center"}} ref={intRef} type={"text"} placeholder="int" className={styles.searchInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ textAlign: "center", width:"140px"}}>
                        <input style={{ width: 80, textAlign: "center" }} ref={wisRef} type={"text"} placeholder="wis" className={styles.searchInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ textAlign: "center", width:"140px"}}>
                        <input style={{ width: 80, textAlign: "center"  }} ref={chaRef} type={"text"} placeholder="cha" className={styles.searchInput} onKeyDown={(e) => {

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
                <div style={{  overflowY: "scroll", height:"330px" }}>
                <div style={{ display: "flex" }} className={styles.rowHeading}>Skills</div>
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
                                type={"text"} placeholder="modifier" className={styles.searchInput} />
                            <SelectBox ref={skillRef} placeholder={"skill"} textStyle={{
                                backgroundColor: "black",
                                fontSize: "22px",
                                outline: 0,
                                borderWidth: 0,
                                color: "white",
                                width: "150px",
                            }} options={skillList} />
                            <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                                addMonsterSkill();
                            }}> (add skill) </div>
                        </div>
                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.rowHeading}>Senses
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterSense();
                    }}> (add sense) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterSensesList}

                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.rowHeading}>Languages
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterLanguage();
                    }}> (add language) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterLanguagesList}

                </div>
               
           
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.rowHeading}>Traits
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterTrait();
                    }}> (add trait) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterTraitsList}

                </div>
                <div style={{ display: "flex", paddingTop: "20px" }} className={styles.rowHeading}>Actions
                    <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        addMonsterAction();
                    }}> (add action) </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

                    {monsterActionsList}

                </div>
                </div>
    
            </form>
        </div>
        {showViewer &&
                <div style={{ backgroundColor: "rgba(10, 12, 16, .99)", width: (pageSize.width / 2 - 100) + "px", position: "fixed", top: "50%", left: "75%", transform: "translate(-52%,-50%)" }}>
                    <div style={{ width: "100%", backgroundColor: "rgba(80,80,80,.9)", height: "10px" }}></div>

            <div style={{height:(pageSize.height / 2 ) + "px"}}>
                <Suspense fallback={Loader}>
                    <Canvas shadows camera={{ fov: 40, 
                        near: 1, far: 1000.0, position: 
                            [
                                0, 
                                sizeRef.current.getValue > 7 ? 5 : -30, 
                                sizeRef.current.getValue < 7 ?  9 : sizeRef.current.getValue > 8 ? 25 : 15
                            ] }}>
                        <MonsterViewer />
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

        }
        </>
    )
}

export default SceneMonster;
import React, {useEffect, useRef, useState} from "react";
import styles from '../../css/campaign.module.css'
import useZust from "../../../hooks/useZust";
import SelectBox from "../UI/SelectBox";
import produce from 'immer';


const CharacterSelectionPage = ({...props}) => {

    const onSelected = props.onSelected;

    const moralityList = [
        { value: -10, label: "Evil" },
        { value: 0, label: "Neutral" },
        { value: 10, label: "Good" },
    ];
    const lawfullnessList = [
        { value: -10, label: "Chaotic" },
        { value: 0, label: "Neutral" },
        { value: 10, label: "Lawfull" },
    ]

    const diceList = [
        { value: 1, label: "D4" },
        { value: 2, label: "D6" },
        { value: 3, label: "D8" },
        { value: 4, label: "D10" },
        { value: 5, label: "D12" },
        { value: 6, label: "D20" },
    ]



    const [character, setCharacter] = useState([-1,"",null])


    const socket = useZust((state) => state.socket);
    const setCharacters = useZust((state) => state.setCharacters)
    const characters = useZust((state) => state.characters);

    const sizeRef = useRef();
    const subRef = useRef();
    const typeRef = useRef();

    const pageSize = useZust((state) => state.pageSize)

    const currentCharacter = useZust((state) => state.currentCharacter);


    const setCurrentCharacter = (index) => useZust.setState(produce((state) => {
        state.currentCharacter = index;
    }));
    const races = useZust((state) => state.races);
    const setRaces = (array) => useZust.setState(produce((state) => {
        state.races = array;
    }));

    const classes = useZust((state) => state.classes);
    const setClasses = (array) => useZust.setState(produce((state) => {
        state.classes = array;
    }));

    const [sizeList, setSizeList] = useState(null);
    const [sizes, setSizes] = useState(new Array(0))

    const [types, setTypes] = useState(null);
    const [typeList, setTypeList] = useState(new Array(0));

    const [subTypes, setSubTypes] = useState(null);
    const [subTypeList, setSubTypeList] = useState(new Array(0));

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




    const charNameRef = useRef();
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
    
    useEffect(() => {
        
        socket.emit("getCharacters",true, (raceArray, classArray, characterArray) => {

            setRaces(raceArray);
            setClasses(classArray);
            setCharacters(characterArray);
            
            setCurrentCharacter(0)
        })

        return () => {
            setCurrentCharacter(-1);
            setCharacters([]);
            setClasses([]);
            setRaces([]);
        }
    }, [])

    useEffect(() => {
        if (characters[currentCharacter] !== undefined)
        {
        if (characters[currentCharacter].characterID > 0)
        {
            setCharacter(characters[currentCharacter]);
            }
        }
      
     }, [currentCharacter])

    const onCharacterSelected = () => {
          
        if(character != null)
        {
            if("characterID" in character){
                if(character.characterID > -1){
                    const PC = {
                        PCID: -2,
                        name: character.name,
                        imageUrl: character.imageUrl,
                        size: character.race.size,
                        race: character.race,
                        speed: character.race.speed,
                        dice: character.class.dice,
                        background:{
                            backgroundID:-1
                        },
                        class: character.class,
                        object: character.object,
                        character: {
                            characterID:character.characterID
                        },
                    }
                   
                    
                    onSelected(PC)

                }
            }
        }
    }

    const prev = () => {
        if(characters. length > 0)
        {
            if(currentCharacter < 1){
                setCurrentCharacter(characters.length -1);
            }else{
                setCurrentCharacter(currentCharacter - 1);
            }
        }
    }

    const next = () => {
        if (characters.length > 0) {
            if (currentCharacter == characters.length - 1) {
                setCurrentCharacter(0);
            } else {
                setCurrentCharacter(currentCharacter + 1);
            }
        }
    }

    return (
        <>
            <div className={styles.heroText}>{character.name}</div>
            <div style={{
                position: "fixed",
                bottom: "90px",
                left: "50%",
                display: "flex",
                transform: "translate(-50%)", alignItems: "center"}}>

                <div
                    style={{ flex: .8, position: "relative", display: "flex", alignItems: "center" }}
                    onClick={(e) => {
                        prev();
                    }}
                ><img style={{ transform: "rotate(180deg)" }} className={styles.arrow} width="150" height="75" /></div>
                <div style={{ width: "100px" }}>{'\u00A0'}</div>
                <div style={{ width: "200px" }}>{'\u00A0'}</div>
            
            <div style={{ width: "100px" }}>{'\u00A0'}</div>
            <div style={{ flex: .8, position: "relative", display: "flex", alignItems: "center" }}
                onClick={(e) => {
                    next();
                }}
            ><img width="150" height="75" className={styles.arrow} /></div>
        </div>
            <div className={styles.boxHighlight} onClick={(e)=>{
                onCharacterSelected();
            }} style={{transform: "translate(-50%)",  position:"fixed", left:(pageSize.width/2), bottom: "30px" }}>
                
                <div style={{  flex:1,position: "relative", display: "flex", alignItems: "center" }}><img src={character.imageUrl} width="200" height="200" /></div> 
               
            </div>
       




            <div style={{ display:"none", position: "fixed", backgroundColor: "rgba(10,13,14,.7)", width: 550, height: pageSize.height, left: pageSize.width - 550, top: "0px", alignItems: "center" }}>
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
                    <input style={{ width: 200, textAlign: "center" }} type={"text"} placeholder="Monster Name" className={styles.smallBlkInput} />
                </div>
                <div style={{ padding: "10px", display: "flex", position: "relative", alignItems: "center" }}>
                    <div>
                        <SelectBox ref={sizeRef} placeholder="Size" options={sizeList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox ref={typeRef} placeholder="Type" options={typeList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox ref={subRef} placeholder="Sub-Type" options={subTypeList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox ref={lawRef} placeholder="Lawfulness" options={lawfullnessList} />
                    </div>
                    <div style={{ marginLeft: "8px" }}>
                        <SelectBox textStyle={{ width: "80px" }} ref={moralRef} placeholder="Morality" options={moralityList} />
                    </div>
                </div>
                <div style={{ display: "flex", paddingLeft: "10px", paddingTop: "30px", position: "relative", alignItems: "center" }}>
                    <div style={{ marginRight: "5px" }} className={styles.disclaimer}>AC:</div>
                    <div>
                        <input style={{ width: 30, marginRight: "5px" }} ref={acRef} type={"text"} placeholder="AC" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
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
                    <div style={{ marginLeft: "15px", marginRight: "5px" }} className={styles.disclaimer}>HP:</div>
                    <div>
                        <input style={{ width: 50, marginRight: "5px", textAlign: "center" }} ref={hpRef} type={"text"} placeholder="Avg." className={styles.smallBlkInput} />
                    </div>
                    <div style={{ marginLeft: "10px", marginRight: "5px" }} className={styles.disclaimer}>Hit Dice:</div>
                    <div>
                        <input style={{ width: 40, textAlign: "center" }} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={dieRef} type={"text"} placeholder="x" className={styles.smallBlkInput} />
                    </div>
                    <div>
                        <SelectBox textStyle={{ width: "60px" }} ref={diceRef} placeholder="Dice" options={diceList} />
                    </div>
                    <div>
                        <input style={{ width: "40px" }} onKeyDown={(e) => {
                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} ref={dieModifierRef} type={"text"} placeholder="mod." className={styles.smallBlkInput} />
                    </div>
                </div>
                <div style={{ paddingLeft: "10px", paddingTop: "30px", paddingBottom: "20px" }} className={styles.titleHeading}>Abilities</div>
                <div style={{ display: "flex", position: "relative", alignItems: "center" }}>

                    <div style={{ flex: 1 }} className={styles.disclaimer}>STR</div>
                    <div style={{ flex: 1 }} className={styles.disclaimer}>DEX</div>
                    <div style={{ flex: 1 }} className={styles.disclaimer}>CON</div>
                    <div style={{ flex: 1 }} className={styles.disclaimer}>INT</div>
                    <div style={{ flex: 1 }} className={styles.disclaimer}>WIS</div>
                    <div style={{ flex: 1 }} className={styles.disclaimer}>CHA</div>
                </div>
                <div style={{ display: "flex", paddingLeft: "10px", paddingTop: "10px", position: "relative", alignItems: "center" }}>

                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={strRef} type={"text"} placeholder="str" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={dexRef} type={"text"} placeholder="dex" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={conRef} type={"text"} placeholder="con" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input style={{ width: 70, textAlign: "center" }} ref={intRef} type={"text"} placeholder="int" className={styles.smallBlkInput} onKeyDown={(e) => {

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
                        <input style={{ width: 70, textAlign: "center" }} ref={chaRef} type={"text"} placeholder="cha" className={styles.smallBlkInput} onKeyDown={(e) => {

                            if (!(e.key > -1) &&
                                !(e.key == "Delete") &&
                                !(e.key == "Backspace") &&
                                !(e.key == "ArrowLeft") &&
                                !(e.key == "ArrowRight")
                            ) e.preventDefault();
                        }} />
                    </div>
                </div>
                <div style={{ paddingTop: "20px" }} ></div>
                <div style={{ overflowY: "scroll", height: pageSize.height - 450 }}>
                    <div style={{ display: "flex" }} className={styles.titleHeading}>Skills</div>
                    <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>

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
                        <div style={{}}>
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
                        <div style={{}}>
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

export default CharacterSelectionPage;
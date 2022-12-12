import React, { useState, useRef, useEffect } from 'react';
import useZust from '../../hooks/useZust';
import styles from "../css/home.module.css"
import produce from 'immer';

import SelectBox from '../components/UI/SelectBox';
import { ImageDiv } from '../components/UI/ImageDiv';

export const EditRealmCharacters = (props = {}) => {
    const socket = useZust((state) => state.socket)
    const pageSize = useZust((state) => state.pageSize)
    const setPage = useZust((state) => state.setPage)

    const [classes, setClasses] = useState([])

    const [races, setRaces] = useState([])


    const [characters, setCharacters] = useState([])

    const updateCharacter = (i,c) => setCharacters(produce((state) => {
        state[i] = c;
    }));

    const addCharacter = (c) => setCharacters(produce((state) => {
        state.push(c);
    }));

    const currentCharacter = useZust((state) => state.currentCharacter);

    const setCurrentCharacter = (value) => useZust.setState(produce((state) => {
         state.currentCharacter = value;
    }));



    const [add, setAdd] = useState(false);
    const [update, setUpdate] = useState(false);

    const [playable, setPlayable] = useState(false);

    const [characterList, setCharacterList] = useState(null);
    const [raceList, setRaceList] = useState(null);
    const [classList, setClassList] = useState(null);

    const raceRef = useRef();
    const classRef = useRef();

    const charImgRef = useRef();
    const charNameRef = useRef();
    const objNameRef = useRef();
    const objUrlRef = useRef();
    const objColorRef = useRef();
    const objImgRef = useRef();
    const submitRef = useRef();
    const charImageUrlRef = useRef();
    const objImageUrlRef = useRef();




    useEffect(()=>{
        setPage(12);
        

        console.log(props.currentRealm)
        
        return () => {
            setCurrentCharacter(null);
        }
    },[props.currentRealm])

 


    useEffect(() => {
        if(characters.length > 0){
            let array = [];
            characters.forEach((character,i) => {
                array.push(
                    <div id={i} style={{width:"100%"}} onClick={(e)=>{
                       
                        setCurrentCharacter(Number(e.target.id))
                    }}>
                        <div id={i} style={{ display: "flex", }} className={currentCharacter == i ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{character.name}</div>
                        </div>
                    </div>
                )
            });
            setCharacterList(array);
            if (currentCharacter > -1) {
                const character = characters[currentCharacter];

                if(character.PCID > 0){

                    charNameRef.current.value = character.name;
                    charImageUrlRef.current.value = character.imageUrl;
                    charImgRef.current.src = character.imageUrl;
                    setPlayable(character.playable);

            
                    objNameRef.current.value = character.object.name;
                    objUrlRef.current.value = character.object.url;
                    objColorRef.current.value = character.object.color;

                    objImageUrlRef.current.value = character.object.textureUrl;
                    objImgRef.current.src = character.object.textureUrl;

                    classRef.current.setValue(character.class.classID)
                    raceRef.current.setValue(character.race.raceID);
                }
            } else {
            
                charNameRef.current.value = "";
                charImageUrlRef.current.value = "";
                objNameRef.current.value = "";
                objUrlRef.current.value = "";
                objColorRef.current.value = "";
                objImageUrlRef.current.value = "";
                charImgRef.current.src = "";
                objImgRef.current.src = "";
                classRef.current.setValue(-1)
                raceRef.current.setValue(-1)
                setPlayable(false);
                setAdd(false);
            }
        }
    },[characters,currentCharacter])

    useEffect(()=> {
        if(races.length > 0){
            let array = [];
            races.forEach((race, i) => {
                array.push(
                    {value:race.raceID, label:race.name}
                )
            });
            setRaceList(array);
        }else{
            setRaceList  ([
                {value: "-1", label:"Not Available"}
            ])
        }
    }, [races])

    useEffect(() => {
        if (classes.length > 0){
            let array = [];
            classes.forEach((pClass, i) => {
                array.push(
                    { value: pClass.classID, label: pClass.name }
                )
            });
            setClassList(array);
        }else{
            setClassList([
                {value: "-1", label:"Not Available"}
            ])
        }
    }, [classes])

    function formattedCharacter(characterAutoID, characterName, characterImageUrl, playable, objectAutoID, objectName, objectUrl, objectColor, objectTextureUrl, raceID, classID)
    {
        return {
            characterID: characterAutoID,
            name: characterName,
            imageUrl: characterImageUrl,
            playable: playable,
            object: {
                objectID: objectAutoID,
                name: objectName,
                url: objectUrl,
                color: objectColor,
                textureUrl: objectTextureUrl
            },
            race:{
                raceID:raceID
            },
            class:{
                classID:classID
            }
        }
    }

    const onSubmit = (e) =>{
        e.preventDefault();

        const character = formattedCharacter(
            -1,
            charNameRef.current.value,
            charImageUrlRef.current.value,
            playable,
            -1,
            objNameRef.current.value,
            objUrlRef.current.value,
            objColorRef.current.value,
            objImageUrlRef.current.value,
            raceRef.current.getValue,
            classRef.current.getValue
        )
      
        
            if(character.name.length > 2){
                if(character.object.name.length > 2){
                    if(character.object.url.length > 12){
                        if(objectColor.length < 3){
                            objectColor = "white"
                        }
                       
                        if(add){
                            /*
                            socket.emit("addObject", character.object, (objectAutoID) => {
                                character.object.objectID = objectAutoID;
                                if (objectAutoID > 0 ) {
                                socket.emit("addCharacter", character, (characterAutoID)=>{
                               
                                    addCharacter(formattedCharacter(characterAutoID, characterName, characterImageUrl, playable, objectAutoID, objectName, objectUrl, objectColor, objectTextureUrl, raceID, classID))
                                        setCurrentCharacter(-1)
                                        
                                    })
                                }else{
                                    alert("object not inserted, database error")
                                }
                            })*/
                        }else if(update){
                            /*
                            socket.emit("updateCharacter", characters[currentCharacter][0], characterName, raceID, classID, playable, characterImageUrl, characters[currentCharacter][4], objectName, objectUrl, objectColor, objectTextureUrl, (updated) =>{
                                updateCharacter(currentCharacter, [characters[currentCharacter][0], characterName, characterImageUrl,playable, characters[currentCharacter][4], objectName, objectUrl, objectColor, objectTextureUrl, raceID, classID])
                                setCurrentCharacter(-1)
                            })*/
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
                alert("Enter a character name.")
            }
       
    }

    return (
        <div id='EditRealmCharacters' style={{
            backgroundColor: "rgba(0,3,4,.9)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
           
        }}>
            <div style={{
                paddingBottom: 10,
                textAlign: "center",
                width: "100%",
                paddingTop: "10px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",
            }}>
                Playable Characters
            </div>
            <div style={{ marginLeft: 30, marginRight: 30 }}>
                <div style={{ display: "flex", height: 150, }}>
                    <ImageDiv
                        width={100}
                        height={100}
                        about={"Select Image"}
                        style={{ textShadow: "2px 2px 2px black", }}
                        className={styles.bubble__item}
                        netImage={{
                            opacity: .3,
                            scale: .3,
                            backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
                            borderRadius: 40,
                            backgroundColor: "",
                            image: "/Images/icons/add-circle-outline.svg",
                            filter: "invert(60%)",
                        }}
                    />
                </div>
                <div style={{ paddingTop: 3, height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>
                <div style={{ height: "100%", paddingTop: 5, width: "100%", backgroundColor: "#33333330" }}>

            <div className={styles.titleHeading}>Characters</div>
            <div style={{ height: "130px", width: "100%", textAlign: "left", overflowY: "scroll", display: "block" }}>
                {characterList}
            </div>
            <div style={{display:"flex"}} className={styles.titleHeading}>Character Information 
              {currentCharacter != null ?   <div style={{marginLeft:"10px"}} className={styles.clickText} onClick={(e) => {
                    setCurrentCharacter(null);
                }}> (clear) </div> : <></>}
           </div>
         
            <div style={{marginLeft:"10px", height:pageSize.height - 300, overflowY:"scroll"}}>
            <form onSubmit={(e) => onSubmit(e)}>
                <div style={{ padding: "10px" }}>
                        <div onClick={(e) => {
                            setPlayable(!playable)
                        }} style={{ display: 'flex', textAlign: "left", paddingRight: "10px", cursor: "pointer" }} > <div className={playable ? styles.checked : styles.check} /><div className={styles.disclaimer}>Playable</div></div> 
                </div>
                <div style={{ padding: "10px", display:"flex", position:"relative", alignItems:"center" }}>
                        <div style={{paddingRight:"5px"}} className={styles.disclaimer}>Class:</div>
                        <div>
                            <SelectBox ref={classRef} placeholder="Class" options={classList} />
                        </div>
                        <div style={{ paddingLeft: "5px",paddingRight: "5px" }} className={styles.disclaimer}>Race:</div>
                        <div>
                            <SelectBox ref={raceRef} placeholder="Race" options={raceList} />    
                        </div>
                </div>
                <div style={{paddingBottom:"10px"}}>
                    <img ref={charImgRef} src="" width="90" height="90" />
                </div>
                <div style={{padding:"10px"}}>
                        <input ref={charImageUrlRef} type={"text"} placeholder="Character Image Url" className={styles.smallBlkInput} onChange={ (e) => {
                        charImgRef.current.src = charImageUrlRef.current.value;
                    }}/>
                </div>
                <div style={{padding:"10px"}}>
                        <input ref={charNameRef} type={"text"} placeholder="Character Name" className={styles.smallBlkInput} />
                </div>
               
                <div style={{ padding: "10px" }}>
                    <input ref={objNameRef} type={"text"} placeholder="3d Object Name" className={styles.smallBlkInput} />
                </div>
                <div style={{ padding: "10px" }}>
                    <input ref={objUrlRef} type={"text"} placeholder="3d Object URL" className={styles.smallBlkInput} />
                </div>
                <div style={{ padding: "10px" }}>
                    <input ref={objColorRef} type={"text"} placeholder="3d Object Color" className={styles.smallBlkInput} />
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
                    <input id='commit' ref={submitRef} type={"submit"} value="COMMIT" className={styles.blkSubmit} />
                    </div>
                </form>
                      
            </div>
        </div>
        </div>
    </div>
    )
}

/* character.characterID, \
 character.characterName, \
 chrImg.imageString, \
 object.objectID, \
 object.objectName, \
 object.objectUrl, \
 object.objectColor, \
 objImg.imageString */

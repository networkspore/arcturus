import React, { useEffect, useState } from "react";
import useZust from "../../../hooks/useZust";
import FindPlayer from "./FindPlayer";

const PCListControl = ({styles,party, campaignID, campaignScene, clearSelection, onAdd, onCancel,  ...props}) =>{

    const [showPClist, setShowPClist] = useState(false);

    const [editPC, setEditPC] = useState(null);

    const [showFindPlayer, setShowFindPlayer] = useState(false);

    const [PClist, setPClist] = useState(null);

    const currentCharacter = useZust((state) => state.currentCharacter);
    const setCurrentCharacter = useZust((state) => state.setCurrentCharacter);
    const socket = useZust((state) => state.socket);
    
    
    const removePC = (PC) =>{
        
    }

    useEffect(()=>{
        
            
            if (party != null && campaignScene != null) {
                var array = [];
                party.forEach((PC, i) => {
                    
                    const inScene = PC.sceneID == campaignScene.sceneID;
                    const current = currentCharacter != null ? currentCharacter.PCID == PC.PCID : false;
                    array.push(
                        <div style={{ alignItems: "center" }} id={PC.PCID} className={current ? styles.currentResult : styles.result} onClick={(e) => {
                            //var index = e.target.id
                            clearSelection();
                            setCurrentCharacter(PC);

                        }}>
                            {!inScene &&
                                <div style={{ padding:"3px", color: "white", backgroundColor:"rgba(255,40,40,.8)"}}>
                                    X
                                </div>
                            }
                            <div id={PC.PCID} className={styles.resultTxt}>
                               {PC.user.name + " : " + PC.name}
                            </div>
                            {current &&
                            <div style={{marginRight:"10px"}} onClick={(e) => {
                                //  editMonster();
                            }} className={styles.textButton}>(view)</div>
                            }
                            {current && inScene &&
                                <div style={{ marginRight: "10px" }} onClick={(e) => {
                                        socket.emit("leaveScene",campaignScene.roomID, PC.PCID, PC.sceneID)
                                        
                                    }} className={styles.textButton}>(remove)</div>
                            }
                            
                        </div>
                    )
                    
                });

                setPClist(array);
            }
        return()=>{
            setPClist([])
        }
    },[party, currentCharacter])

    const checkList = (player) =>{
        const tempParty = party;
        let inList = false;
        for(let i = 0 ; i < tempParty.length ; i++){
            if(tempParty[i].PCID == player.PCID){
                inList = true;

                break;
            }
        }
        if(!inList)
        {
  
            onAdd(player)
        }
    }

    return (
        <>
        {!showPClist &&
         <div onClick={(e) =>{
            setShowPClist(true)
        }} style={{position:"fixed", color: "white", backgroundColor:"rgba(10,12,16,.7)", border: "2px solid rgba(80,82,86,.8)",
            right: 0, top: 335, transform:"rotate(-90deg) translate(-145px,145px)",
            width:"300px", padding:"10px", fontFamily:"WebRockwell", textShadow:"2px 1px,1px black",
            textAlign:"left", paddingLeft:"20px", cursor:"pointer", letterSpacing: "1px"
            }}>
            Player Characters
        </div>
        }
        {showPClist &&
        <div style={{position:"fixed", 
            right: 0, top: 335, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width:"300px", 
        }}>
                <div style={{display:"flex", padding: "10px", alignItems:"center", fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)",}}>
                    <div onClick={() => {
                        
                        setShowPClist(false)

                    }} style={{ width: "15px" }} className={styles.textButton}>▼</div>
                    <div style={{paddingLeft:"10px"}}>Player Characters</div>
                
                    <div style={{marginLeft:"10px"}} onClick={(e) => {
                        setShowFindPlayer(true);
                    }} className={styles.textButton}>(find)</div>

                    {currentCharacter != null &&
                    <div style={{marginLeft:"10px"}} onClick={(e) =>{
                        setCurrentCharacter(null)
                    }} className={styles.textButton}>(deselect)</div>
                    }
                </div>
             
          {PClist == null ? <></>:PClist.length > 5 ? <div style={{ height: 300 , overflowY: "scroll" }}>{PClist}</div> : PClist}
        </div>
        }
        {showFindPlayer &&
            <FindPlayer
                sceneID={campaignScene.sceneID}
                campaignID={campaignID}
                top={"305px"}
                onClose={()=>{
                    setShowFindPlayer(false);
                }}
                onSelected={(player)=>{
                   
                   
                }}
                onAdd={(player)=>{
                    checkList(player)
                }}
            />
        }
        </>
    )
}

export default PCListControl;
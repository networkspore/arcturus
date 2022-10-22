import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'
import SelectBox from "../UI/SelectBox";
import produce from 'immer';
import useZust from "../../../hooks/useZust";
import PC from "./PC";


const FindPlayer = ({top, left, onClose, campaignID, sceneID, onSelected, onAdd, ...props }) => {
 
    const [playerList, setPlayerList] = useState(null);
   
    const [players, setPlayers] = useState(null);

    const searchTypeRef = useRef();
    const searchInputRef = useRef();
    

    const socket = useZust((state) => state.socket);

    const [selectedPlayer, setSelectedPlayer] = useState(-1)
    const [currentPC, setCurrentPC] = useState(null);

    const playerOptions = [
        { value: 0, label: "All"},
        { value: 1, label: "Online" },
        { value: 2, label: "Offline" },
    ]

    useEffect(() => {
        searchTypeRef.current.setValue(0);
     
      /*  socket.emit("getPlayerAttributes", (types, sizes, integrity, materials) => {
            var array = [];
            array.push({ value: "0", label: "All" });
            types.forEach(type => {
                array.push(
                    { value: type[0], label: type[1] }
                )
            });
         
            setTypeOptions(array)
            
        })*/
    }, [])

    const [searchOptions, setSearchOptions] = useState(0)

    const onSearch = () => {
        const searchText = searchInputRef.current.value;
        

        socket.emit("findPlayers", searchText, searchOptions, campaignID, sceneID, (players)=>{
            setPlayers(players);
        })
        
    }

    useEffect(()=>{
        onSearch();
    },[searchOptions])

    const onTypeChanged = (value) =>{
        if(value != searchOptions) setSearchOptions(value)
    }



    useEffect(()=>{
        if(players != null){
            let array = [];

            players.forEach((player,i) => {
                array.push(
                    <div id={i} style={{ width: "100%" }} onClick={(e) => {
                        
                       setSelectedPlayer(i);
                       if(onSelected){
                           onSelected(player);
                       }
                    }}>
                        <div id={i} style={{ display: "flex", }} className={selectedPlayer == i ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >
                                {player.name} { ": " + player.user.name + " - " + player.user.email}
                            </div>
                            <div style={{flex:1, display:"flex", justifyContent:"right"}}>
                            {selectedPlayer == i &&
                                onAdd &&
                                <div style={{ marginLeft: "10px" }} onClick={(e) => {
                                  onAdd(player)
                                }} className={styles.textButton}>(add)</div>
                                
                            }
                            {selectedPlayer == i &&
                                <div style={{ marginLeft: "10px" }} onClick={(e) => {
                                    setCurrentPC(player)
                                }} className={styles.textButton}>(view)</div>
                            }
                            </div>
                        </div>
                    </div>
                );
            });
            setPlayerList(array)
         
        }
    },[players,selectedPlayer])

   

    return (
        <>


        <div style={{
            position: "fixed",
            right:"170px", top: top, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width: "500px",
        }}>

            <div style={{ display: "flex", padding: "10px", alignItems:"baseline" , fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)", }}>
              
                <div style={{ width:"190px" }} >
                    <input onKeyDown={(e) => {
                        if (e.key == "Esc") {
                            onClose();
                        }
                    }} ref={searchInputRef} style={{ width: "100%", color: "white" }} 
                        onChange={
                            (e) => {onSearch()}
                        } className={styles.searchInput} type="text" placeholder="Search Players" />
                </div>
                
                <div style={{flex:1}}>
                    <SelectBox textStyle={{
                            backgroundColor:"black",
                            fontSize:"22px",
                            outline:0,
                            borderWidth:0,
                            color: "white"
                        }} onChanged={onTypeChanged} ref={searchTypeRef} 
                        placeholder={""} options={playerOptions}/>
                </div>
               
                <div style={{width:10}}></div>
                <div className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>
            {playerList && playerList.length > 10 &&
                <div style={{ height: 308, overflowY: "scroll" }}>
                    {playerList}
                </div>
            }
            {playerList && playerList.length < 11 &&       
                playerList
            }
            {!playerList &&
                <div className={styles.noResults}>
                    No Players Found
                </div>
            }

        </div>

            {currentPC &&
                <PC
                    roll={"admin"}
                    onClose={() => {
                        setSelectedPlayer(-1);
                    }}
                    player={currentPC}
                />

            }
 
       
        </>
    )
}

export default FindPlayer;

//{playerList == null ? <></> : playerList.length > 5 ? <div style={{ height: 300, overflowY: "scroll" }}>{playerList}</div> : { playerList }}
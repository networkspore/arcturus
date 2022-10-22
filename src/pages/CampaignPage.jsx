
import produce from "immer";
import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import {flushSync} from 'react-dom';

import { useNavigate, useLocation } from 'react-router-dom';



import useZust from "../hooks/useZust";
import CampUsers from "./components/UI/campUsers";


import loadingStyles from './css/loading.module.css';
import styles from './css/campaign.module.css';


import Peer from 'peerjs'
import CharacterSelectionPage from "./components/Campaign/CharacterSelectionPage";
//import { useCallback } from "react";
import CreateScene from "./components/Campaign/CreateScene"
import FindMonster from "./components/Campaign/FindMonster";

import SceneMonster from "./components/Campaign/SceneMonster";
import EditMonster from "./components/Campaign/EditMonster";
import FindPlaceable from "./components/Campaign/FindPlaceable";
import ScenePlaceable from "./components/Campaign/ScenePlaceable";
import PCListControl from "./components/Campaign/PCListControl";
import TableTop from "./components/TableTop";
import { Canvas } from "@react-three/fiber";
import CampaignEditor from "./components/Campaign/CampaignEditor";

import { constants } from "../constants/constants";
import { isNumber } from "lodash";

const Loader = (<>  <div className={loadingStyles.loading}  >
    <div >
        <div className={loadingStyles.logo}></div>
        <div className={loadingStyles.loadingText}>
            Loading

        </div>

    </div>

</div></>);




const CampaignPage = (props = {}) => {

    const showLoadingScreen = useZust((state) => state.showLoadingScreen)
    const setShowLoadingScreen = ( show = true )=> useZust.setState(produce((state) => {
        state.showLoadingScreen = show;
    }))

        const page = useZust((state) => state.page)

    const setPage = (page) => {
        useZust.setState(produce((state)=>{
            state.page = page;
        }))
    }


    const [showChat, setShowChat] = useState(false);
    const [showEditScene, setShowEditScene] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showScenes, setShowScenes] = useState(false);
    const [showCreateScene, setShowCreateScene] = useState(false);
    const [showMonsters, setShowMonsters] = useState(false);
    const [showFindMonsters, setShowFindMonsters] = useState(false);
    const [showEditMonster, setShowEditMonster] = useState(false);
    const [showPlaceables, setShowPlaceables] = useState(false);
    const [showFindPlaceables, setShowFindPlaceables] = useState(false);
    const [showEditPlaceable, setShowEditPlaceable] = useState(null)

    const pageSize = useZust((state) => state.pageSize);


    
   
    const socket = useZust((state) => state.socket);

    const [isAdmin, setIsAdmin] = useState(false)

    const [selectedCharacter, setSelectedCharacter] = useState(null)
    
    const editCampaign = useZust((state) => state.editCampaign);
    //const setEditCampaign = useZust((state) => state.setEditCampaign);

    const setEditCampaign = (value) => useZust.setState(produce((state) => {
        state.editCampaign.mode = value.mode;
        state.editCampaign.settings = value.settings;
    }))

    const mode = useZust((state) => state.mode)
    const setMode = (value) => useZust.setState(produce((state) => {
        state.mode = value;
    }))
    const currentCampaign = useZust((state) => state.currentCampaign);
    const setCurrentCampaign = useZust((state) => state.setCurrentCampaign);

    const user = useZust((state) => state.user)

 
    const [chat,setChat] = useState([]);


    const campaignScene = useZust((state) => state.campaignScene)
    const setCampaignScene = (scene) => useZust.setState(produce((state) => {
        state.campaignScene = scene;
    }));

    const campaignUsers = useZust((state) => state.campaignUsers)
    const setCampaignUsers = useZust((state) => state.setCampaignUsers)
    const addCampaignUsers = (c) => useZust.setState(produce((state) => {
        state.campaignUsers.push(c);
    }));
    const updateCampaignUser = (i,c) => useZust.setState(produce((state) => {
        state.campaignUsers[i] = c;
    }));

    const [party, setParty] = useState([])

    const addPartyMember = (c) => {
        setParty(produce((state) => {
            state.push(c);
        }));
    }
    const cancelPartyMember = (p) => {
        
        party.forEach((member, i) => {
            if (member.PCID == p.PCID) {
                setParty(produce((state) => {
                    state.splice(i, 1);
                }))
            }
        })
    }
    const updateParty = (i, c) => {
        setParty(produce((state) => {
        state[i] = c;
        }))
    }
    const updatePartyPCscenePosition = (PCID, sceneID, position) => {
        
        for (let i = 0; i < party.length; i++) {
            if (party[i].PCID == PCID) {
                setParty(produce((state) => {
                    state[i].sceneID = sceneID;
                    state[i].object.position = position;
                }))
            }
        }
        
    }
    const hidePartyCharacter = (PCID) => {
        party.forEach((member, i) => {
            if (member.PCID == PCID) {
                setParty(produce((state) => {
                    state[i].object.position = null;
                    state[i].sceneID = null;
                }))
            }
        })
    }

    const hideSceneParty = () => {
        
        for (let i = 0; i < party.length; i++) {
            if (party[i].sceneID == campaignScene.sceneID) {
                setParty(produce((state) => {
                    state[i].object.position = null;
                    state[i].sceneID = null;
                }));
            }
        }
        
    }

    const monsters = useZust((state) => state.monsters);
    const setMonsters = (m) => useZust.setState(produce((state) => {
       
            state.monsters = m
     
            state.editCampaign.mode = constants.SET_MONSTERS
            state.editCampaign.settings = {value:m}

    }))

    const hideMonster = (i) => useZust.setState(produce((state) => {
        state.monsters[i].object.position = null;
    }));

    const updateMonster = (i , m) => useZust.setState(produce((state) => {
        state.monsters[i] = m;
    }));
   
   

    const [monsterList, setMonsterList] = useState(null);

    const [currentPlaceable, setCurrentPlaceable] = useState(null)

    const placeables = useZust((state) => state.placeables)
    const setPlaceables = useZust((state) => state.setPlaceables)

    const addPlaceables = (pArray) => {
        
            
            if(placeables == null)
            {
                setPlaceables(produce((state) => {
                    state = pArray
                }))
            }else{
                
                setPlaceables(
                    
                   placeables.concat(pArray)
               )        
            }
            
           
    }



    const updatePlaceablePosition = (placeableSceneID, position) => useZust.setState(produce((state) => {
        if (placeables != null && placeables.length > 0) {
            for(let i = 0; i < placeables.length ; i++){
                if (placeables[i].placeableSceneID == placeableSceneID) {
                    
                    state.placeables[i].object.position = position
                    
                }
            }
            
        }
    }))

    const updatePlaceable = (placeableUpdate) => useZust.setState(produce((state) => {

        if (placeables != null && placeables.length > 0) {
            placeables.forEach((placeable, i) => {
                if (placeable.placeableSceneID == placeableUpdate.placeableSceneID) {
                    setPlaceables(produce((state) => { 
                        state.placeables[i] = placeableUpdate
                    }))
                }
            })
        }
    }))

    const onRemoveScenePlaceable = (placeableSceneID) => useZust.setState(produce((state) => {
        if (placeables != null && placeables.length > 0) {
            if (placeables.length == 1) {
                if (placeables[0].placeableSceneID == placeableSceneID) {

                    
                        setPlaceables([])
                    
                }
            } else {
                placeables.forEach((placeable, i) => {
                    if (placeable.placeableSceneID == placeableSceneID) {
                        
                            state.placeables.splice(i, 1)
                        
                    }
                });
            }
        }

    }))

    ////////////////////Monsters

    const updateMonsterScenePosition = (monsterSceneID, position) => useZust.setState(produce((state) => {
        if (monsters != null) {
            monsters.forEach((monster, i) => {
                if (monster.monsterSceneID == monsterSceneID) {
                   
                        state.monsters[i].object.position = position
                

                }
            });
        }
    }))
   

    const addMonsters = (m) => useZust.setState(produce((state) => {
        if (monsters == null) {
            state.monsters = m;
            state.editCampaign.mode = constants.SET_MONSTERS;
            state.editCampaign.settings.value = m;
        } else {
            
            state.monsters = state.monsters.concat(m)
            state.editCampaign.mode = constants.ADD_MONSTERS;
            state.editCampaign.settings.value = m;
        }
        
    }))
    
    const onRemoveMonsterScene = (monsterSceneID) => useZust.setState(produce((state) => {
        if (monsters != null) {
            if (monsters.length == 1) {
                if (monsters[0].monsterSceneID == monsterSceneID) {
                    
                    state.monsters =  []
                    
                }
            } else {
                monsters.forEach((monster, i) => {
                    if (monster.monsterSceneID == monsterSceneID) {

                        state.monsters.splice(i, 1)
                        
                    }
                });
            }
        }

    }))

    const onUpdateMonsterScene = (monsterScene) => useZust.setState(produce((state) => {
        if (monsters != null) {
            
            monsters.forEach((monster, i) => {
                if (monster.monsterSceneID == monsterScene.monsterSceneID) {
                    
                        state.monsters[i] = monsterScene
                  
                }
            });
            
        }

    }))
    
    const [placeableList, setPlaceableList] = useState(null);

    const [joinedRoom, setJoinedRoom] = useState(false);
    const [useMic, setUseMic] = useState(false);

    const msgText = useRef();

    const audioRef = useRef();

  

    const chatDiv = useRef();
    
    const { state } = useLocation();

    const localAudio = useZust((state) => state.localAudio)
    const setLocalAudio = useZust((state) => state.setLocalAudio)

    const updateLocalAudioSrcObj = (stream) => useZust.setState(produce((zState) => {
        zState.localAudio.srcObject = stream;
    }));
    const updateLocalAudioAutoPlay = (bool = true) => useZust.setState(produce((zState) => {
        zState.localAudio.autoplay = bool;
    }));
    const updateLocalAudioMuted = (muted = true) => useZust.setState(produce((zState) => {
        zState.localAudio.muted = muted;
    }));


    const [isCall, setIsCall] = useState(false);

    const userCharacter = useZust((state) => state.userCharacter);
    const setUserCharacter = (playerCharacter) => useZust.setState(produce((state) => {
        state.userCharacter = playerCharacter;
    }));
    
    const hideUserCharacter = () => useZust.setState(produce((state) => {
        state.userCharacter.object.position = null;
        state.userCharacter.sceneID = null;
        setMonsters([])
        setPlaceables([])
        setParty([])
        setCampaignScene(null)

    }));

    const updatePCscenePosition = (sceneID, position) => useZust.setState(produce((state) => {
        
        if(userCharacter != null){
            if(userCharacter.sceneID != sceneID)
            {
                joinCampaign();
        
            }else{
                state.userCharacter.object.position = position;
            }
        }
        
    }));  
     
    
    const [scenes, setScenes] = useState(new Array(0));
    const [sceneList, setSceneList] = useState(null);

    const addScene = (scene) =>{
       
        if(scenes === undefined || scenes == null || !("length" in scenes)){
          
            setScenes([scene]);
           
        }else{
            setScenes(
                produce((state)=>{
                    state.push(scene);
                })
            )
        }

       
    }


   // const campaignScene = useZust((state) => state.campaignScene)
    /*const setCampaignScene = (scene) => useZust.setState(produce((state) => {
        state.campaignScene = scene;
    }));*/

 
    const currentCharacter = useZust((state) => state.currentCharacter);
    const setCurrentCharacter = useZust((state) => state.setCurrentCharacter)
 

    useEffect(() => {
        
        

        socket.on("campMsg", (userName, type, msg) => {
            displayMessage(userName, type, msg)
        });

        socket.on("userStatus", (userID, userName, status) => {
            updateUserStatus(userID, userName, status)
        })

        socket.on("userRoomStatus", (userID, userName, status) => {
            updateUserRoomStatus(userID, userName, status);
        })

        socket.on("newCampaignUser", (campaignUser) => {
            onAddCampaignUser(campaignUser);
        })
        socket.on("newStream", (userID, userName, options) => {
            updateStreamOptions(userID, userName, options);
            
        })
        socket.on("campaignSceneChanged", (scene) =>{
            
           if(scene.prevID == campaignScene.sceneID){
                setCampaignScene(scene);
                joinCampaign();
            }
        })
        socket.on("newPC", (PC) =>{
            if (PC.userID != user.userID)
            {
                addPartyMember(PC);
            }        
        })

        socket.on("PCscenePosition", (PCID, sceneID, position) =>{
         
            if (userCharacter.PCID != PCID) {
               
                updatePartyPCscenePosition(PCID,sceneID, position);
            } 
            else if(userCharacter.PCID == PCID)
            {
                
                updatePCscenePosition(sceneID, position)
            }
        })

        socket.on("leaveScene", (PCID, sceneID) => {
            if(userCharacter.PCID != PCID && campaignScene != null)
            {
                if(campaignScene.sceneID ==sceneID){
                    hidePartyCharacter(PCID);       
                    if (isAdmin) {
                        if(currentCharacter != null && currentCharacter.PCID == PCID)setCurrentCharacter(null)
                    }
                }
                
            }else if(userCharacter.PCID == PCID){
               if(userCharacter.sceneID == sceneID) hideUserCharacter();
            }
        })
        socket.on("endScene", (sceneID)=>{
            if(userCharacter.sceneID == sceneID)hideUserCharacter();
            hideSceneParty();
        })

        socket.on("monsterScenePosition", (monsterSceneID, position)=>{
            updateMonsterScenePosition(monsterSceneID,position);
        })


        socket.on("removeMonsterScene", (monsterSceneID)=>{
            setSelectedCharacter(null)
            onRemoveMonsterScene(monsterSceneID)
        })

        socket.on("updateMonsterScene", (monsterScene)=>{
            onUpdateMonsterScene(monsterScene);
        })

        socket.on("placeableScenePosition", (placeableSceneID, position)=>{
            updatePlaceablePosition(placeableSceneID, position) 
        })


        socket.on("updatePlaceableScene", (placeable)=>{
            updatePlaceable(placeable);
        })

        socket.on("removeScenePlaceable", (placeableSceneID)=>{
            onRemoveScenePlaceable(placeableSceneID)
        })

        socket.on("addPlaceableScene", (sceneID, placeableArray)=>{
            if(campaignScene.sceneID == sceneID){
                
                addPlaceables(placeableArray);
            }
        })
        window.onkeydown = onKeyDown;
        window.onkeyup = onKeyUp;
        return () => {
            socket.off("addPlaceableScene");
            socket.off("updatePlaceableScene")
            socket.off("removeScenePlaceable");
            socket.off("placeableScenePosition");


            socket.off("removeMonsterScene");
            socket.off("monsterScenePosition");

            socket.off("campMsg");

            socket.off("userStatus");


            socket.off("userRoomStatus");

            socket.off("newCampaignUser");

            socket.off("newStream");
           
            socket.off("campaignSceneChanged");
            
            socket.off("newPC");
            socket.off("leaveScene");
            socket.off("endScene");
            socket.off("PCscenePosition");   
            window.onkeydown = null;
            window.onkeyup = null;
        }
    })

    const onKeyDown = (e) =>{
        if(tableTopRef.current){
            tableTopRef.current.onKeyDown(e);
        }
    }

    const onKeyUp = (e) =>{
        if(tableTopRef.current){
            tableTopRef.current.onKeyUp(e);
        }
    }
    const tableTopRef = useRef();
    const canvasRef = useRef();

    const joinCampaign = () =>{
        if (user.userID > 0) {
            setShowLoadingScreen(true);
            if (state.adminID == user.userID) setIsAdmin(true);
            if (currentCampaign != state.campaignID) setCurrentCampaign(state.campaignID)

            socket.emit("joinCampaignRoom", state.roomID, state.campaignID, user.userID, state.adminID == user.userID, user.userName, (joined, users, msgs, campaignScene) => {
           
                setJoinedRoom(prev => joined);
                setCampaignUsers(users);
                displayStoredMessages(msgs);

               
                if (campaignScene.sceneID > -1) {
                    
                    setCampaignScene(campaignScene);
            
                   
                } else {
                    setCampaignScene(null);
                }
              
              
                if (state.adminID == user.userID) {

                    socket.emit("getScenes", state.campaignID, (scenes) => {

                        setScenes(scenes)
                    })
                }


            });


        } else {
            window.location.replace("/")
        }
    }


    useEffect(() => {
      
        
 
        joinCampaign();
       
    //    setMainOverlaySize({ width: pageSize.width - leftOverlaySize.width, height: 200 });
      //  setMainOverlayPos({ top: pageSize.height, left: leftOverlaySize.width })
       


        return () => {
           setIsAdmin(false);
            setCurrentCampaign(-1);
            setUserCharacter({PCID:-2})
            setCurrentPlaceable(null)
            setCurrentCharacter(null)
            setMonsterList([]);
            setParty([]);
            setPlaceableList([]);
            setScenes([]);
            
          //  endCall();
            if (isCall) {
                closeAudio();
            }
       
            setJoinedRoom(prev => false);
            //  setCampaignUsers([]);
    
            setUseMic(prev => false);
            setChat(prev => []);
            if (msgText.current != null) {
                msgText.current.value = "";
                msgText.current.disabled = false;
            }
            socket.emit("leaveRoom", state.roomID, user.userID, user.userName, (leave) => {

            });
            //   socket.off("campMsg");
            //    socket.off("userStatus");
            //     socket.off("userRoomStatus");
        }
    }, [state])

   

    useEffect(() => {
        if (canvasRef.current != null) {
        
            socket.emit("getSceneAssets", campaignScene.sceneID, user.userID, state.campaignID, (PC, partyArray, monsterArray, placeableArray) => {

                if (state.adminID == user.userID) {

                    setUserCharacter({ PCID: -2 })
                    //  setSelectedCharacter(null)
                } else {

                    setUserCharacter(PC);


                    //   setSelectedCharacter(null)
                }

                setParty(partyArray);
                setMonsters(monsterArray)
                setPlaceables(placeableArray)

            })
        }
    }, [campaignScene, canvasRef.current])

    const onSetCurrentScene = (scene) => {
       
       socket.emit("setCampaignScene",state.campaignID, scene.sceneID,(set) =>{
            if(set == true)joinCampaign();
            if(set == false) alert("Could not change scene.")
       })
    }

   
    const removeScene = () =>{
        const sceneID = campaignScene.sceneID;
        
  
       
        socket.emit("removeScene", state.campaignID, state.roomID, sceneID, (removed)=>{
            if(removed){
                if(scenes.length == 1)
                {
                    setScenes(null)
                }else{
                    setScenes(produce((state) => {
                        let i = 0;
                        while (i < state.length) {
                            if (state[i].sceneID == sceneID) {

                                state.splice(i, 1);

                                break;
                            }
                            i++;
                        }
                    }))
                }
             
            }
            joinCampaign();
        })
    }

    const noScene = () => {
      //  socket.emit("noScene", state.campaignID, state.roomID)
    }

    useEffect(()=>{

      
        if(userCharacter != null){
            
            if (joinedRoom && userCharacter.userID != -2 && userCharacter.PCID < 1 && !isAdmin ) {
                //character selection
                if (page != 12) setPage(12)

            } else {

                if (!isAdmin && (campaignScene != undefined || campaignScene != null )) {
                    
                    if (campaignScene.sceneID > 0 && userCharacter.sceneID) {
                        
                        //table top = scene page

                       if (page) setPage(null)
                    
                    } else {

                        //waiting page
                        if (page != 3) setPage(3);
                    }

                }else if(isAdmin){
                    if(campaignScene){
                        if (page) setPage(null)
                    }else{
                        if (page != 3) setPage(3);
                    }
                } else {
                    //Waiting page
                    if (page != 3) setPage(3);
                }

            }
            
            if(scenes != null && user.userID == state.adminID){
                
                const sceneID = campaignScene == null ? -1 : campaignScene.sceneID;

                if(scenes.length > 0)
                {
                    var array = [];
                    
                  
                    scenes.forEach((scene, i) => {
               
                
                    if (scene.sceneID == sceneID) {
                        array.push(

                            <div id={i} className={styles.currentResult}>
                                <div id={i} className={styles.resultTxt}>
                                    {scene.name}
                                </div>
                                <div onClick={(e) => {
                                    
                                    setShowEditScene(true)
                                }} className={styles.textButton}>(edit)</div>
                                <div style={{ width: "10px" }}></div>
                                <div onClick={(e) => {
                                    removeScene();
                                }} className={styles.textButton}>(remove)</div>
                            </div>

                        )
                    }else{
                        array.push(
                            
                            <div onClick={(e) => {
                            onSetCurrentScene(scene) 
                            }} id={i} className={ styles.result}>
                                <div id={i} className={styles.resultTxt}>
                                    {scene.name}
                                </div>
                            </div>
                            
                        )
                    }
                });
                setSceneList(array)
                
                }
            }else{
                setSceneList([])
            }
        }
     
        return ()=>{
            setSceneList([])
        }
    },[scenes,campaignScene, userCharacter, isAdmin])
   

    useEffect(()=>{
        if (isAdmin && campaignScene != null) {
         //   alert(selectedCharacter + " " + currentPlaceable + " " + currentCharacter)
            if ((selectedCharacter == null)  && (currentPlaceable == null)&& (currentCharacter == null)) {
                setShowEditScene(true);
            }else{
           
                setShowEditScene(false);
            }

        }else{
            setShowEditScene(false)
        }
    },[selectedCharacter,currentCharacter,campaignScene,currentPlaceable])



     const onMessageSend = () =>
     {
        // displayMessage(user.userName, msgText.current.value);
        if (socket.connected) {
            if(joinedRoom && msgText.current.value != ""){
            
                msgText.current.disabled = true;
                socket.emit("sendCampMsg", state.roomID, user.userName, user.userID, 1, msgText.current.value, (sent, stored)=>{
                    msgText.current.disabled = false;
                    msgText.current.value = "";
                });
            }else{
               
            }
        }else{
            displayMessage("ArcturusRPG", 0, "Not Connected.")
        }
     }


  

     /*
     const displayUsers = (usrs = []) => {
        for (let i = 0; i < usrs.length; i++) {
            //displayUser(usrs[i][0], usrs[i][1], usrs[i][2]);
        }
     }*/

    const displayStoredMessages = (msgs = []) =>
    {
        for(let i=0;i<msgs.length;i++){
            displayMessage(msgs[i][0],msgs[i][1],msgs[i][2]);
        }
    }

     const displayMessage = (name = "", type = 0, msg ="") =>
     {
         
       
        const arr =[];
        if(type == 1)
        {
          
        }
        switch(type){
            case 0:
                arr.push(
                    <p className={styles.paragraph}> <b className={styles.systemHeading}>{"--" + name}</b>{":"}<i className={styles.systemtMessage}>{" " + msg + "--"}</i>
                    </p>

                )
                break;
            case 1:
                arr.push(
                    <p className={styles.paragraph}> <b className={styles.chatHeading}>{name}</b>{":"}<i className={styles.chatMessage}>{" "+msg}</i>
                    </p>
            
                )
                break;
        }
        setChat(prev => [...prev, arr]);

        
     }
   

   

    const toggleUseMic = (e) =>
    {
        if(joinedRoom) setUseMic(!useMic);
    }


   

    const peerConnection = useZust((state) => state.peerConnection);
    const setPeerConnection = useZust((state) => state.setPeerConnection)

    const peerConnectionOnOpen = (callback) => useZust.setState(produce((state) => {
        if(state.peerConnection == null){
            state.peerConnection = null;
            callback(null)
        } else { state.peerConnection.on("open", callback) }
    }));

    const peerConnectionOnCall = (callback) => useZust.setState(produce((state) => {
        if (state.peerConnection == null) {
            state.peerConnection = null;
            callback(null)
        } else { state.peerConnection.on("call", callback) }
    }));

    const closeAudio = () => {
       
     
       
        if(peerConnection != null){
            campaignUsers.forEach((cUser,i) => {
                const audio = cUser[8];
                const call = cUser[9];

                if(audio != null){
                

                    const updateUser = [
                        cUser[0],
                        cUser[1],
                        cUser[2],
                        cUser[3],
                        cUser[4],
                        cUser[5],
                        cUser[6],
                        cUser[7],
                        null,
                        null,
                    ]

                    updateCampaignUser(i,updateUser)
                } 

            });

            peerConnection.destroy();
            setPeerConnection(null);
            

        }
        if(localAudio != null)
        {
            if(localAudio.srcObject != null){
                var stream = localAudio.srcObject;
                var audioTracks = stream.getTracks();

                displayMessage(state.campaignName,0, "Call ended.");
                audioTracks[0].stop();
                updateLocalAudioSrcObj(null);
                setLocalAudio(null);
            }
        }
        setIsCall(false);
    }
    




    const updateUserStream = (uUserID, uStream) => {
        
        campaignUsers.forEach((cUser, i) => {
            const userID = cUser[0];
            const call = cUser[9];
            if(userID == uUserID)
            {
                const peerAudio = document.createElement("audio");
                peerAudio.autoplay = true;
                peerAudio.srcObject = uStream;
                

                const item = [
                    cUser[0],
                    cUser[1],
                    cUser[2],
                    cUser[3],
                    cUser[4],
                    cUser[5],
                    cUser[6],
                    cUser[7],
                    peerAudio,
                    call
                ]
                updateCampaignUser(i, item)
            }
        })
    }
    const answerCall = (call) => {
        const callID = call.peer;
        
        campaignUsers.forEach((cUser, i) => {
            const peerID = cUser[4];
            const userID = cUser[0];
            const userName = cUser[1];

            
            if (callID == "Arcturus_" + userName + userID) {
                
                call.answer(localAudio.srcObject);
                const item = [
                    cUser[0],
                    cUser[1],
                    cUser[2],
                    cUser[3],
                    cUser[4],
                    cUser[5],
                    cUser[6],
                    cUser[7],
                    null,
                    call
                ]
              //  displayMessage(state.campaignName, 0, "Call received from: " + cUser[1])
                updateCampaignUser(i, item)
                
                call.on("stream", peerStream => {
                    updateUserStream(userID, peerStream)
                })
            }
        })
    }
    const callUsers = () => {
        campaignUsers.forEach((cUser, i) => {
            const userID = cUser[0];
            const userName = cUser[1];
            const online = cUser[2];
            const inRoom = cUser[3];
            const peerID = cUser[4];
            const isAudio = cUser[5];
            const isVideo = cUser[6];
            const isMedia = cUser[7];
            
           

            if(isAudio && peerID != "" && peerConnection != null &&localAudio != null)
            {
                if(!peerConnection.disconnected &&localAudio.srcObject != null)
                {
                    const call = peerConnection.call(peerID, localAudio.srcObject);
                
                    const item = [
                        cUser[0],
                        cUser[1],
                        cUser[2],
                        cUser[3],
                        cUser[4],
                        cUser[5],
                        cUser[6],
                        cUser[7],
                        null,
                        call
                    ]
                    updateCampaignUser(i, item)
                    call.on('stream', (stream) => {
                        updateUserStream(userID, stream)
                    })
                }
            }

        })
    }

    
   

    useEffect(() => {


        if (useMic) {
            navigator.mediaDevices.getUserMedia({audio:true, video:false}).then((stream) => {
                
                setLocalAudio(document.createElement("audio"))
                updateLocalAudioAutoPlay(true);
                updateLocalAudioSrcObj(stream);
                updateLocalAudioMuted(true);
                setIsCall(state => true);
                setPeerConnection(new Peer("Arcturus_"+user.userName + user.userID))
              //  displayMessage("peerServer",0,peerConnection.id)
            })

        } else if (isCall) {
            socket.emit("roomStream", user.userID, user.userName, state.roomID, { peerID: "", audio: false, video: false, media: false }, (callback) => {
            });
               
            closeAudio();
        }
        return () => {
            setIsCall(state => false)

        }
    }, [useMic])


    useEffect(()=>{
        if (localAudio != null && peerConnection != null) {
            peerConnectionOnOpen((id) => {
                    if (id != "") {
                       
                        displayMessage(state.campaignName, 0, "Call started.")
                        
                        peerConnectionOnCall((call) => {
                            answerCall(call)
                        })
                        socket.emit("roomStream", user.userID, user.userName, state.roomID, { peerID: id, audio: true, video: false, media: false }, (callback) => {
                            callUsers();
                        });
                       
                    }
                })
        }
    },[peerConnection,localAudio])
    
        
    

 

     useEffect(()=>{
         chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
     },[chat,showChat])

    const componentWillUnmount = useRef(false)

    // This is componentWillUnmount
    useEffect(() => {
        return () => {
            componentWillUnmount.current = true
        }
    }, [])

    useEffect(() => {
        return () => {
            // This line only evaluates to true after the componentWillUnmount happens 
            if (componentWillUnmount.current) {
                var once = props;
                if(isCall){
                    closeAudio();
                }
            }
        }

    }, [props, isCall])



    const onAddCampaignUser = (campaignUser) => {
        addCampaignUsers(campaignUser);
        displayMessage(state.campaignName, 0, campaignUser[1] + " joined the campaign.");
    }

    const updateUserStatus = (userID, userName, statusName) => {



        campaignUsers.forEach((element, i) => {
            if (element[0] == userID) {
                const item = [element[0], element[1], statusName, "Offline", "", 0, 0, 0, null, null];
                updateCampaignUser(i, item)
                displayMessage("ArcturusRPG", 0, userName + " is " + statusName);
            }

           
        });
    }

    const updateUserRoomStatus = (userID, userName, statusName) => {
        if (userID > 0) {

            campaignUsers.forEach((cUser, i) => {


                if (cUser[0] == userID) {
                    const item = [cUser[0], cUser[1], cUser[2], statusName, "", 0, 0, 0, null, null];
                    updateCampaignUser(i, item)
                    userName = cUser[1];
                    if (statusName == "Online") {
                        displayMessage(state.campaignName, 0, userName + " entered.");
                    } else if (statusName == "Offline") {
                        displayMessage(state.campaignName, 0, userName + " left.");
                    }
                }

                
            });
        }
    }

    const updateStreamOptions = (userID, userName, options) => {
        //peerID: id, audio:true, video:false, media:false
        const peerID = "peerID" in options ? options.peerID : "";
        const isAudio = "audio" in options ? options.audio : false;
        const isVideo = "video" in options ? options.video : false;
        const isMedia = "media" in options ? options.media : false;

        if (userID > 0) {
            campaignUsers.forEach((cUser, i) => {
                if (cUser[0] == userID) {
                    let uAudio = cUser[8];
                    let uCall = cUser[9];
                    if (peerID ==""){
                        if(uAudio != null) uAudio.pause();
                        uAudio = null;
                        uCall = null;
                    } 

                    const item = [
                        cUser[0],
                        cUser[1],
                        cUser[2],
                        cUser[3],
                        peerID,
                        isAudio,
                        isVideo,
                        isMedia,
                        uAudio,
                        uCall
                    ];
                    //state.campaignName
                    const message = isAudio && !isVideo ? "In voice call" : isVideo ? "In video call" : "Ended call."
                    displayMessage(state.campaignName, 0, userName + ": " + message)
                    updateCampaignUser(i, item)
                   
                }
            })



        
        }

    }
    
    const editMonster = () =>{
        setShowEditMonster(true);
    }

    const removeMonster = () =>{
        const monster = selectedCharacter
        if("monsterSceneID" in monster && isAdmin){
            socket.emit("removeSceneMonster", state.roomID,monster.monsterSceneID )
        }
    }



    useEffect(()=>{
       
      // const monsterSceneID = selectedCharacter > -1 ? monsters[selectedCharacter].monsterSceneID : -1; 
        if(isAdmin){
            var array = [];
            if("forEach" in monsters && monsters != null && campaignScene != null){
                monsters.forEach((monster,i) => {
                    if(monster.sceneID == campaignScene.sceneID){
                       // alert(editCampaign.settings.value)
                        const current = (mode.main == constants.MONSTER_MODE)? isNumber(mode.id) ? mode.id == monster.monsterSceneID : false : false; //selectedCharacter == null ? false : selectedCharacter.monsterSceneID == monster.monsterSceneID;
                        
                      array.push(
                            <div style={{ alignItems:"center" }} id={monster.monsterSceneID} className={current ? styles.currentResult : styles.result } 
                                onClick={(e) => {
                                    //var index = e.target.id
                                //  setCurrentPlaceable(null);
                                    //setSelectedCharacter(monster);
                                   
                                    setMode({
                                        main: constants.MONSTER_MODE,
                                        sub: "",
                                        id: monster.monsterSceneID
                                    })

                                // setCurrentCharacter(null)
                            }}>
                                <div id={monster.monsterSceneID} className={styles.resultTxt}>
                                    {monster.name }
                                </div>
                                {current &&
                                <>
                                  
                                    <div onClick={(e) => {
                                        editMonster();
                                    }} className={styles.textButton}>(edit)</div>
                                    <div style={{width:"10px"}}></div>
                                    <div onClick={(e) => {
                                        removeMonster();
                                    }} className={styles.textButton}>(remove)</div>
                                </>
                                }
                            </div>
                        )
                    }
                });
                
                setMonsterList(array);
            }
        }
        return ()=>{
            setMonsterList([])
        }
    }, [monsters, campaignScene, editCampaign])
/*const editPlaceable = () => {
    setShowEditPlaceable(true)
}*/   
const removePlaceable = () => {
    socket.emit("removeScenePlaceable", state.roomID, currentPlaceable)
}


useEffect(() => {

        
        if (isAdmin) {
            var array = [];
            if (placeables != null && campaignScene != null && placeables.length > 0) {
               
                placeables.forEach((placeable, i) => {
                    if (placeable.sceneID == campaignScene.sceneID) {
                        const current = currentPlaceable == null ? false : currentPlaceable.placeableSceneID == placeable.placeableSceneID;
                        
                        array.push(
                            <div style={{ alignItems: "center" }} id={placeable.placeableSceneID} className={current ? styles.currentResult : styles.result} 
                            onClick={(e) => {
                                //var index = e.target.id
                                setCurrentCharacter(null)
                                setCurrentPlaceable(placeable);
                                setSelectedCharacter(null);
                               
                                
                            }}>
                                <div id={placeable.placeableSceneID} className={styles.resultTxt}>
                                    {placeable.name}
                                </div>
                                {current &&
                                    <>
                                
                                        <div onClick={(e) => {
                                            setShowEditPlaceable(placeable)
                                        }} className={styles.textButton}>(edit)</div>
                                        <div style={{ width: "10px" }}></div>
                                        <div onClick={(e) => {
                                            removePlaceable();
                                        }} className={styles.textButton}>(remove)</div>
                                    </>
                                }
                            </div>
                        )
                    }
                });
               setPlaceableList(array)
            }
        }
      
}, [currentPlaceable, placeables, campaignScene, ])
   
    
    const clearSelected = () =>{
        setMode({main:"", sub:"", id:-1})
    }
    
    return (
    <>
            <div style={{ flex: 1, display: page == null && campaignScene != null ? "block" : "none" }}>
            {page == null && campaignScene != null &&
                
                    <Suspense fallback={Loader}>
                        
                    <Canvas ref={canvasRef}
                        linear
                        flat
                        
                        onPointerDown={(e)=>{
                            if(tableTopRef.current != null){
                                tableTopRef.current.onPointerDown(e)
                            }
                        }}
                    
                        performance={{ min: 0.8, debounce:200 }} mode="concurrent" shadows  camera={{
                        fov: 90,
                        near: 1, far: 1000.0, position:
                            [
                                0,
                                15,
                                0
                            ]
                    }}>
                     <TableTop
                        ref={tableTopRef}
                        party={party}
                        
                        isAdmin={isAdmin} 
                        currentPlaceable={currentPlaceable}
                        selectedCharacter={selectedCharacter} 
                        
                      
                /> 
                   </Canvas>
                   </Suspense>
              
                }
            </div>
            {isAdmin && campaignScene &&
                <>
          
           
        <div onClick={(e) => {
            setShowMonsters(true)
        }} style={{
            position: "fixed", display: (isAdmin) && showMonsters == false ? "block" : "none",
            color: "white", backgroundColor: "rgba(10,12,16,.7)", border: "2px solid rgba(80,82,86,.8)",
            left: 0, top: 0, transform: "rotate(-90deg) translate(-145px,-145px)",
            width: "300px", padding: "10px", fontFamily: "WebRockwell", textShadow: "2px 1px,1px black",
            textAlign: "left", paddingLeft: "20px", cursor:"pointer", letterSpacing:"2px"
        }}>
            Monsters
            </div>

        <div style={{
            position: "fixed", display: (isAdmin) && showMonsters == true ? "block" : "none",
            left: 0, top: 0, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width: "400px",
        }}>
            
                <div style={{ display: "flex", padding: "10px", alignItems: "center", fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)", }}>
                    <div onClick={() => {
                        var x = 1;
                        setShowMonsters(false)

                    }} style={{ width: "15px" }} className={styles.textButton}>▼</div>
                    <div style={{ paddingLeft: "10px" }}>Monsters</div>
                    <div style={{ width: "10px" }}></div>
                    <div onClick={(e) => {
                        clearSelected();
                        setShowFindMonsters(true);
                    }} className={styles.textButton}>(add monster)</div>
                    {mode.main == constants.MONSTER_MODE &&
                            < div onClick={(e) => {
                               clearSelected()
                            }} className={styles.textButton}>(deselect)</div>
                    }

                </div>
                
                {monsterList != null ? monsterList.length < 5 ? monsterList : <div style={{ height: 300, overflowY: "scroll" }}>{monsterList}</div>:<></>}

        </div>

        {showFindMonsters &&
             <FindMonster 
                 onClose={()=>{
                setShowFindMonsters(false);
                }}
                onAddMonster={(monster, count,random)=>{
                    monster.sceneID = campaignScene.sceneID;
                    monster.userID = user.userID;
                   
                    socket.emit("addMonsterScene", monster,count,random, (monsterArray) => {
                       
                        addMonsters(monsterArray);
                         
                       
                        
                    })
                   
                  
                }} 
            />
        }

        {showEditMonster &&
            <EditMonster
                monsters={monsters}
                selectedMonster={selectedCharacter}
                onEditMonster={(monster)=>{
                    socket.emit("updateMonsterScene", state.roomID, monster);
                    setShowEditMonster(false)
                }}
                onClose={()=>{
                    setShowEditMonster(false);
                }}
            />
        }
                </>
            }
        {isAdmin &&
        <>
        <div onClick={(e) =>{
            setShowScenes(true)
        }} style={{position:"fixed", display: !showScenes ? "block":"none", 
            color: "white", backgroundColor:"rgba(10,12,16,.7)", border: "2px solid rgba(80,82,86,.8)",
            right:0,top:0, transform:"rotate(-90deg) translate(-145px,145px)",
            width:"300px", padding:"10px", fontFamily:"WebRockwell", textShadow:"2px 1px,1px black",
            textAlign:"left", paddingLeft:"20px", cursor:"pointer", letterSpacing:"2px"
            }}>
            Scenes
        </div>
        
        <div style={{position:"fixed", display: (isAdmin) && showScenes == true ? "block" : "none",
            right: 0, top: 0, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width:"300px", 
        }}>
                <div style={{display:"flex", padding: "10px", alignItems:"center", fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)",}}>
                
                    <div onClick={() => {
                        
                        setShowScenes(false)

                    }} style={{ width: "15px" }} className={styles.textButton}>▼</div>
                    <div style={{paddingLeft:"10px"}}>Scenes</div>
                        <div style={{flex:1, display: "flex", justifyContent: "right"}}>
                        <div onClick={(e) =>{
                                clearSelected();
                            setShowCreateScene(true)
                        }} className={styles.textButton}>(add scene)</div>
                        {campaignScene &&
                            <div style={{marginLeft:"10px"}} onClick={(e) => {
                                noScene();
                            }} className={styles.textButton}>(none)</div>
                        }
                        </div>
                </div>
             
          {sceneList == null ? <></>:sceneList.length > 5 ? <div style={{ height: 300 , overflowY: "scroll" }}>{sceneList}</div> : sceneList}
        </div>
        {showCreateScene ? <CreateScene onClose={()=>{
            setShowCreateScene(false);
        }} onNewScene={(newScene)=>{
            socket.emit("addCampaignScene", state.campaignID, state.roomID, newScene, (sceneID)=>{
                if(sceneID > 0){
                    newScene.sceneID = sceneID;
                    newScene.roomID = state.roomID;
                    addScene(newScene);
                    setShowCreateScene(false);
                    
                    if(newScene.current) setCampaignScene(newScene);
                }else{
                    alert("could not create scene")
                }
            })
            
        }}/> : <></>}
            {campaignScene &&
                scenes != null &&
                scenes.length > 0 &&
                <>
                <PCListControl
                    party={party}
                    campaignID={state.campaignID}
                    campaignScene={campaignScene}
                    clearSelection={()=>{
                        clearSelected();
                    }}
                    styles={styles} 
                 
                    removePC={(PC)=>{
                        removePC(PC);
                    }}
                    onAdd={(PC)=>{
                        addPartyMember(PC);
                    }}
                    onCancel={(PC)=>{
                        cancelPartyMember(PC);
                    }}
                />

                <div onClick={(e) => {
                    setShowPlaceables(true)
                }} style={{
                    position: "fixed", display: (isAdmin) && showPlaceables == false ? "block" : "none",
                    color: "white", backgroundColor: "rgba(10,12,16,.7)", border: "2px solid rgba(80,82,86,.8)",
                    left: 0, top: 334, transform: "rotate(-90deg) translate(-145px,-145px)",
                    width: "300px", padding: "10px", fontFamily: "WebRockwell", textShadow: "2px 1px,1px black",
                    textAlign: "left", paddingLeft: "20px", cursor: "pointer",letterSpacing: "2px"
                }}>
                    Placeables
                </div>

                <div style={{
                    position: "fixed", display: (isAdmin) && showPlaceables == true ? "block" : "none",
                    left: 0, top: 335, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
                    width: "400px",
                }}>

                    <div style={{ display: "flex", padding: "10px", alignItems: "center", fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)", }}>
                        <div onClick={() => {
                            var x = 1;
                            setShowPlaceables(false)

                        }} style={{ width: "15px" }} className={styles.textButton}>▼</div>
                        <div style={{ paddingLeft: "10px" }}>Placeables</div>
                        <div style={{ width: "10px" }}></div>
                        <div onClick={(e) => {
                                clearSelected();
                            setShowFindPlaceables(true);


                        }} className={styles.textButton}>(add placeable)</div>
                        {currentPlaceable != null &&
                            < div style={{ marginLeft: "10px" }} onClick={(e) => {
                                clearSelected()
                            }} className={styles.textButton}>(deselect)</div>
                        }

                    </div>

                    {placeableList != null ? placeableList.length < 5 ? placeableList : <div style={{ height: 300, overflowY: "scroll" }}>{placeableList}</div> : <></>}

                </div>

                {showFindPlaceables &&

                    <FindPlaceable left={"100px"} top={"350px"}
                        onClose={() => {
                            setShowFindPlaceables(false);
                        }}
                        onAddPlaceable={(placeable, count,random) => {
                            placeable.sceneID = campaignScene.sceneID;
                            placeable.userID = user.userID;

                            socket.emit("addPlaceableScene",state.roomID, campaignScene.sceneID, placeable, count, random)


                        }}
                    />
                }
                {showEditPlaceable &&
                    <ScenePlaceable
                        edit={true}
                        selectedPlaceable={showEditPlaceable}
                        onEditPlaceable={(placeable)=>{
                           
                            socket.emit("updateScenePlaceable", state.roomID, placeable)

                            setShowEditPlaceable(null)
                        }}
                        onClose={()=>{
                            setShowEditPlaceable(null);
                        }}
                    />
                }
                </>
            }
        </>
        }
        <div onMouseLeave={(e) => {
            setShowChat(false);
        }} onClick={(e) => {
            setShowChat(true);
        }} style={{ position: "fixed", display: "block",
            left:0, bottom: 0, 
            width: pageSize.width * .25, backgroundColor: "rgba(10,12,16,.7)", border:"2px solid rgba(80,82,86,.6)"         }}>
            <div style={{ height:"50px", display: showChat ? "none" : "flex",   width:"100%" }} className={styles.disclaimer}>
                <div style={{overflow:"hidden", marginLeft:"5%", width:"90%"}}>
                    
                <div style={{width:"10px"}}></div>
                    {chat != null ? chat.length > 0 ? chat[chat.length - 1] : <></> : <></>}

                </div>
            </div>
            <div style={{ display: showChat ? "block" : "none" }}>
                <div style={{margin:"10px"}}>
                <div ref={chatDiv} style={{ textAlign: "left", color: "white", overflowY: "scroll", backgroundColor: "black", width: "100%", height: "165px" }}>
                    {chat}
                </div>
                <div>

                    <input onKeyDown={(e) => {
                        if (e.key == "Enter") onMessageSend()
                    }} type="text" ref={msgText} style={{ color: "white", border: "1px solid grey", backgroundColor: "black", paddingRight: 20, textAlign: "right", width: "95%", fontSize: "28px" }} />

                </div>
                </div>
            </div>
        </div>


            <div  style={{
                position: "fixed", display: "block",
                left: pageSize.width * .25, bottom: 0,
                width: pageSize.width * .5,  backgroundColor: "rgba(10,12,16,.5)"
            }}>
               
                {showEditScene &&
                <>
         
                    <CampaignEditor campaignID={state.campaignID} />
                </>
                }

            </div>


        <div onMouseLeave={(e) => {
            setShowUsers(false);
        }}  onClick={(e) =>{
                setShowUsers(true);
            }} style={{
            position: "fixed", display:"flex",
            left: pageSize.width * .75, bottom: 0, 
            width: (pageSize.width * .25)-5,  backgroundColor: "rgba(10,12,16,.7)",
            border:"2px solid rgba(80,82,86,.6)"
        }}>
            <div style={{  width:"100%", height: "50px", display: showUsers ? "none" : "flex", alignItems: "center"}} className={styles.disclaimer}>
                <div style={{display:"block", width:"100%", textAlign:"right", marginRight:"10px"}}>
                    {user.userName}
                </div>
                
                <div onClick={(e) => {
                    toggleUseMic(e)
                    e.bubbles = false;
                }}  className={styles.menuIcon}>

                    <img style={{ opacity: .7 }} src={useMic ? "Images/endCall.png" : "Images/call.png"} width={20} height={20} />
                    <div style={{width:"20px"}}></div>
                </div>
                
            </div>

            <div style={{ width:"100%",  marginBottom:"70px", display: showUsers ? "block" : "none"}}>
                <div style={{width:"100%", backgroundColor:"rgba(80,80,80,.7)", height: "10px"}}></div>
                <div style={{ marginTop: "5px",marginLeft:"20px",width:"100%"}}>
                    <div style={{ flex: .1,  display: "flex", flexDirection: "row", height: "30px", width: "100%" }}>
                        <div style={{ flex: .1, marginRight: "20px" }}>
                            <div onClick={e => toggleUseMic(e)} className={styles.menuIcon}>

                                <img style={{ opacity: .7 }} src={useMic ? "Images/endCall.png" : "Images/call.png"} width={20} height={20} />
                            </div>
                        </div>
                        <div style={{ flex: 1 }} className={styles.chatHeading}>
                            {user.userName}</div>
                        
                    </div>


                
                <div style={{ marginTop:"10px"}}>
                <CampUsers />
                </div>
                </div>
            </div>
        </div>

        {userCharacter != null && userCharacter.PCID == -1 && !isAdmin ? 
            <CharacterSelectionPage campaignID={state.campaignID}
            onSelected={(PC)=>{
                PC.userID = user.userID;

                socket.emit("setPC", user.userID, state.campaignID, state.roomID, PC, (PCID) => {
                    if (PCID > 0) {
                        PC.PCID = PCID;
                        
                        
                        setUserCharacter(PC);
                        
                    }else{
                        alert("character selection error.")
                    }
                })
            }} />
        : <></>}
           
            {/*///////////////LOADING SCREENS ///////////// */}
            
            {showLoadingScreen &&
                Loader
            }
            {/*loadingScreen == true &&
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", top: 0, left: 0, backgroundColor: "rgba(0,0,0,.8)", position: "fixed", width: pageSize.width, height: pageSize.height }}>


                    <div style={{
                        padding: "10px",
                        textAlign: "center",
                        fontFamily: "WebRockwell",
                        fontSize: "25px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "2px 2px 2px #101314"
                    }}>Loading...</div>

                </div>
                */}
        </>
        );
    

};

  

export default CampaignPage;

/*   
{useMic &&
                <div>
                <audio autoPlay ref={audioRef} id="player" controls></audio>
                <div className={styles.icon} onClick={(e) =>{
                     setUseMic(prev => false);
                }}>close</div>
                </div>
                }
                {!useMic &&
                    <div onClick={(e)=>{
                        setUseMic(prev => true);
                    }} className={styles.icon} style={{width:"100px", height:"100px"}}>
                        <img src="Images/micSymbol.png" width={100} height={100} />   
                    </div>
                }
     const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

     useEffect(() => {
         function handleResize() {
             setWindowDimensions(prevDimensions => 
                 getWindowDimensions()
             );
             //    setWindowDimensions();
         }

         window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
     }, []);*/
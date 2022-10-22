import { useFrame, useThree } from "@react-three/fiber";
import produce from "immer";
import React, {useMemo, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";



import { constants } from "../../../constants/constants";
import useZust from "../../../hooks/useZust";
import Monster from "../../../placeables/Monster";
import { Layers, Scene, Skeleton, Vector2 } from "three";

const MonsterManager = (props ={}, ref) => {

  

    const loadGltf = props.loadGltf;
    const mapScale = props.mapScale;

    const monster3D = useZust((state) => state.monster3D)
    
    const mode = useZust((state) => state.mode)

    const setMode = (value) => useZust.setState(produce((state) => {
        state.mode = value;
    }))

    const editCampaign = useZust((state) => state.editCampaign)

    const setMonsterHovered = (monsterSceneID) => useZust.setState(produce((state) => {
        state.editCampaign.mode = constants.HOVER_MONSTER
        state.editCampaign.settings = {value:monsterSceneID}
    }))
    const setMonster3D = (m) => useZust.setState(produce((state) => {

        state.monster3D = m;

    }))

    const addMonster3D = (m) => useZust.setState(produce((state) => {

        state.monster3D = state.monster3D.concat(m);

    }))


    const effect = useRef({composer:null});
    
    const sceneRef = useRef();
   
    const hoveredRef = useRef({monsterSceneID:null})
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false);
    const gl = useThree((state)=>state.gl)
    /*const aspect = useMemo(() => new Vector2(size.width, size.height), [
        size
    ]);*/

    useEffect(() => {
        if (editCampaign.mode == constants.SET_MONSTERS && editCampaign.settings != null) {
         
            const monsters = editCampaign.settings.value;
            if (monsters.length > 0) {
                const array = []
                //objectRef.current.monsters = [];

                monsters.forEach(monster => {

                    if (monster.object !== undefined) {
                        if (monster.object.url !== undefined) {
                       
                          loadGltf(monster.object.url)
                            array.push(
                                
                                  <Monster
                                    monsterSceneID={monster.monsterSceneID}
                                    scale={mapScale}
                                    object={monster.object}
                                />
                            )
                        }
                    }
                });
                setMonster3D(array);
            } else {
                setMonster3D([]);
            }
        }
    }, [editCampaign])

    useEffect(() => {
        if (mode.main == constants.MONSTER_MODE) {
            if (mode.sub == constants.LOCATE_ITEM) {
              //  gl.domElement.onpointerdown = onpointerdown;
         
               
               
            } else {
             //   gl.domElement.onpointerdown= null;
            }
        } else {

        }
    }, [mode])

    useEffect(() => { 
        if (hovered && hoveredRef.current.monsterSceneID != null){
          
            setMonsterHovered(hoveredRef.current.monsterSceneID)
   
        }else{
           
            setMonsterHovered(null);
         //   hoveredRef.current.monsterSceneID = null;
            
        }
    }, [hovered])

    const onPointerDown = (e) =>{
        if (mode.main == constants.MONSTER_MODE ) {
        switch (e.nativeEvent.button) {
            case 0:
                //Left
             
                if (mode.sub == constants.LOCATE_ITEM){
                   if (hoveredRef.current.monsterSceneID != null)
                    {
                      
                       setMode({
                           main: constants.MONSTER_MODE,
                           sub: "",
                           id: hoveredRef.current.monsterSceneID
                       })
                    }
                }
                break;
            case 1:
                //Middle

                break;
            case 2:
                //Right

                break;
        }
        }
        
    }
    useImperativeHandle(ref, () => ({
        onPointerDown: onPointerDown,
    //    onKeyDown: onKeyDown,
     //   onKeyUp: onKeyUp
    }), [])
    const timeOut = useRef({count:0})
    useFrame(({ raycaster, mouse, clock,scene, camera }) => {

      
        if (mode.main == constants.MONSTER_MODE) {
            if (mode.sub == constants.LOCATE_ITEM) {
                raycaster.setFromCamera(mouse, camera);

                const intersects = raycaster.intersectObjects(scene.children)
                if (intersects.length > 0) {
                    const userData = intersects[0].object.userData
                    if (userData.main == constants.MONSTER_MODE) {
                        if (hoveredRef.current.monsterSceneID  == null)
                        {
                                   
                            hoveredRef.current.monsterSceneID = userData.id;
                            timeOut.current.count = 0;
                            
                            setHovered(true)
                        }
                    } else {
                        if(timeOut.current.count < 5){
                            timeOut.current.count++
                        }else{
                            if (hoveredRef.current.monsterSceneID != null){
                                hoveredRef.current.monsterSceneID = null
                                setHovered(false)
                                timeOut.current.count =0;
                            }
                        
                        }
                    }
                }else{
                   
                }
             
            }
        }
         
    })
  
    return (
        <>
            {monster3D}
        
        </>
    )
}


export default forwardRef( MonsterManager);

/*  


    //const raycaster = useThree((state) => state.raycaster)

*/
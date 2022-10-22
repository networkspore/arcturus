import {  OrbitControls,  useTexture, Sky, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

import useZust from '../../hooks/useZust';
import Placeable from './placeables/Placeable';


import produce from "immer";
import CameraControls from 'camera-controls';


import { TextureLoader } from 'three';
import { PointLight } from 'three';

import { DRACOLoader, GLTFLoader } from 'three-stdlib';
import { constants } from '../../constants/constants';
import MonsterManager from './Campaign/MonsterManager';
import TerrainManager from './Campaign/TerrainManager';



//import { FogEffect } from './effects/FogEffect';
CameraControls.install({ THREE: THREE });





const TableTop = (props ={}, ref) => {

    const mode = useZust((state) => state.mode)
    const party = [];
    const isAdmin = props.isAdmin;
    const [currentPlaceable, setCurrentPlaceable] = useState(null)
    const [selectedCharacter, setSelectedCharacter] = useState(null)
    const monsterManagerRef = useRef();
    const terrainManagerRef = useRef();
    const campaignScene = useZust((state) => state.campaignScene)
  //  const usePlanet = useRef();
    const placeables = useZust((state) => state.placeables)
    const [partyList, setPartyList] = useState(null);
 //   const [monsterList, setMonsterList] = useState(null);
    const [placeableList, setPlaceableList] = useState(null);



    const assets = useZust((state) => state.assets)

  

    const addGltf = (url, gltf) => useZust.setState(produce((state) => {
        state.assets.gltfs[url] = gltf;
   
    }))


    const socket = useZust((state)=>state.socket)
    
    const orbitRef = useRef();
    const characterRef = useRef();


    const userCharacter = useZust((state) => state.userCharacter);
    const showUserCharacter =  () => useZust.setState(produce((state) => {
        state.userCharacter.show = true;
    }));
    const setUserCharacterPosition = (pos) => useZust.setState(produce((state) => {
     
        state.userCharacter.object.position = pos; 
        //orbitRef.current.maxDistance = 100;
      
    }));


/*
    const setMonsterPosition = (i,pos) => useZust.setState(produce((state) => {

       
        state.monsters[i].object.position = pos;

    }));*/

   
   // const party = useZust((state) => state.party);

   // const monsters = useZust((state) => state.monsters)
  
    const currentCharacter = useZust((state) => state.currentCharacter)
    //const selectedCharacter = useZust((state) => state.selectedCharacter)

   // const placeables = useZust((state) => state.placeables);
    //const currentPlaceable = useZust((state) => state.currentPlaceable)
    //const setCurrentPlaceable = useZust((state) => state.setCurrentPlaceable)

    const count = 200;

  //  const  gl  = useThree((state) => state.gl);

    const editCampaign = useZust((state) =>  state.editCampaign )
 
       // const time = clock.getElapsedTime();
    let i =0;

    const mapScale = 1;

   
    //tempMatrix.setUvTransform()
    const scene = useThree((state) => state.scene)
    const gl = useThree((state) => state.gl);
    const camera = useThree((state) => state.camera)
    const regress = useThree((state) => state.performance.regress)
    const current = useThree((state) => state.performance.current)
  
    const controls = new CameraControls(camera, gl.domElement);


    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/")
    gltfLoader.dracoLoader = dracoLoader;


    useEffect(() => {
        
        gl.autoClear = false;
        gl.setPixelRatio(window.devicePixelRatio);
       // gl.autoClear = false;
     
        if ( campaignScene != null) {
            //     scene.fog = new THREE.Fog("white", 500, 500);
            if (campaignScene.setting.name == "Day") {
                  //scene.fog = new THREE.Fog(0xFFFFFFFF, 15, 20);
                scene.fog =  new THREE.Fog(0xEEEEEE, 18, 28)
            } else {
                  scene.fog = new THREE.Fog(0x000000,18, 28)
            }
            

        } else {
               scene.fog = null; 
             //  scene.fog = new THREE.Fog("black", 10, 500);
        }
       
      
        return () => {
            scene.fog = null;
        }

    }, [])

    const frameLimiter = useRef({ delta: 0, interval: (1 / 30) * 1000});
    
  //  useEffect(()=>{
      //  gl.setPixelRatio(window.devicePixelRatio * current)


 //   },[current])
 

    useFrame(({clock}) => {

        frameLimiter.current.delta += clock.getDelta();

        if (frameLimiter.current.delta > (frameLimiter.current.interval * current)){
            gl.clear();

            gl.clearDepth();

            gl.render(scene, camera);
            frameLimiter.current.delta = frameLimiter.current.delta % frameLimiter.current.interval * current;
        }
    })

    const raycaster = new THREE.Raycaster();
    


    

    const raycastObjectName =(e, objName = "", callback) =>{
        const clickMouse = new THREE.Vector2();

        clickMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = (e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(clickMouse, camera);

        const found = raycaster.intersectObjects(scene.children);
       
        if (found.length > 0 ){
            found.forEach((element,i) => {
                if (element.object.name == objName){
                    callback(found[i], i);
                   
                }
            });
        }
    }

    const onPointerDown = (e) => {
        switch (e.nativeEvent.button) {
            case 0:
                //Left
                
                    
                break;
            case 1:
                //Middle

                break;
            case 2:
                //Right

                break;
        }
        if(mode.main == constants.MONSTER_MODE){
            if(monsterManagerRef.current != null){


                monsterManagerRef.current.onPointerDown(e);
            }
        }    
}




/*
    function resolveGrid(x, y, z, terrain){
        var xNeg = x < 0 ? -1 : 1;
        var zNeg = z < 0 ? -1 : 1;
        var tempX = 0;
        var tempZ= 0;
        x = Math.abs(x);
        z = Math.abs(z);
        let i = 0;
        
        const scaler =.5;

        if (x < scaler) { x = scaler; } else {
            i = scaler;
            while (i < x + scaler && i < terrain.width * scaler) {
                tempX = i;
                i += scaler * 2;
            }

            x = tempX;
        }
        if (z < scaler) { z = scaler; } else {
            i = scaler;
            while (i < z + scaler && i < terrain.length * scaler) {
                tempZ= i;
                i += scaler * 2;
            }

            z = tempZ;
        }
        return [x * xNeg, y + (terrain.height / 2), z * zNeg];
    }
    */

    const setPCposition = (PC, position) => {
        if(campaignScene != null){
           
            socket.emit("PCscenePosition",campaignScene.roomID, PC.PCID,campaignScene.sceneID, [position.x,position.y, position.z])
            
        }        
    }


    

    const setSelectedPosition = (position) =>
    {
/*     
        if(selectedCharacter != null ){
                const monster = selectedCharacter;

                const monsterSceneID = monster.monsterSceneID;
               
            socket.emit("monsterScenePosition", campaignScene.roomID, monsterSceneID, [position.x, position.y, position.z] )
                
             //   setMonsterPosition(selectedCharacter,  position);
                
            
        }*/
    }







    const setPlaceablePosition = (position) =>{

          if(currentPlaceable != null && placeables != null){
            placeables.forEach(placeable => {
                if(placeable.placeableSceneID == currentPlaceable.placeableSceneID){
                    socket.emit("placeableScenePosition", campaignScene.roomID, currentPlaceable.placeableSceneID, [position.x,position.y, position.z])
                }
            });
          
            

           // setSelectedPlaceablePosition(currentPlaceable, position)
        }
    }

    const moveTo = (pos, inBounds)=>{
            alert("move")
        
            if(selectedCharacter != null && inBounds){
            
                setSelectedPosition(pos)
            } else if (userCharacter != null && userCharacter.PCID > 0 && inBounds){
              
                setPCposition(userCharacter, pos)
               
            } else if (currentPlaceable != null ){
             
                setPlaceablePosition(pos)
            } else if (currentCharacter != null && inBounds){
                
               setPCposition(currentCharacter, pos);
              
            }
          
    }

 
   
  


    
  

    useEffect(() => {
        if(party != null && party !== undefined && campaignScene != null){
            var array = [];
            if(party.length > 0)
            {
                party.forEach((member, index) => {
                    if("object" in member){
                        if("position" in member.object){
                            if (member.sceneID == campaignScene.sceneID){
                                array.push(
                                  /* <Placeable 
                                        key={index}
                                        scale={.08*mapScale}  
                                        position={member.object.position} 
                                        rotation={member.object.rotation} 
                                        name={member.object.name} 
                                        src={member.object.url} 
                                        color={member.object.color} 
                                    />*/
                                )
                        
                            }
                        }
                    }
                });
                setPartyList(array);
            }else{
                setPartyList(null)
            }
        }
        return () =>{
            setPartyList(null)
        }
    }, [party,campaignScene])

 
   

    /*
  
            

    useEffect(() => {
        if (monsters != null && monsters !== undefined ) {
            var array = [];
            if (monsters.length > 0) {
                monsters.forEach((monster, index) => {
                    if ("object" in monster) {
                        if ("position" in monster.object) {
                           
                            if( monster.object.position != null){
                                loadGltf(monster.object.url)
                                array.push(
                                    <Character
                                        scene={scene} 
                                        scale={.08*mapScale}
                                        object={monster.object}
                                    />
                                )
                            }
                        }
                    }
                });
                
                setMonsterList(array);
            } else {
                setMonsterList(null)
            }
        }
        return ()=>{
            setMonsterList(null)
        }
    }, [monsters])*/

    useEffect(() => {
        if (placeables != null && placeables !== undefined) {
            var array = [];
            if (placeables.length > 0) {
                regress();
                placeables.forEach((placeable, index) => {
                    if ("object" in placeable) {
                        if ("position" in placeable.object) {

                            if ( placeable.object.position != null && placeable.object.position[0] != null) {
                                
                                array.push(
                                 {/*   <Placeable
                                       
                                        position-x={placeable.object.position[0] + placeable.object.offset.y}
                                        position-y={placeable.object.position[1] + placeable.object.offset.y}
                                        position-z={placeable.object.position[2] + placeable.object.offset.z}

                                        rotation-x={placeable.object.rotation.x * (2 * Math.PI / 360) }
                                        rotation-y={placeable.object.rotation.y * (2 * Math.PI / 360) }
                                        rotation-z={placeable.object.rotation.z * (2 * Math.PI / 360) }

                                        scale={[
                                            (.1 * mapScale) * placeable.object.scale.x,
                                            (.1 * mapScale) * placeable.object.scale.y,
                                            (.1 * mapScale) * placeable.object.scale.z]}

                                        name={placeable.object.name}
                                        src={placeable.object.url}
                                        metalness={0.5}
                                        color={placeable.object.color} 
                                        />*/}
                                )
                            }
                        }
                    }
                });

                setPlaceableList(array);
            } else {
                setPlaceableList(null)
            }
        }
        return () =>{
            setPlaceableList(null)
        }
    }, [placeables])



   /* useFrame(({ delta, clock }) => {

    })*/
    /*
    useEffect(() => {
        
        window.onkeydown = onDocumentKeyDown;
        window.onkeyup = onDocumentKeyUp;
        return ()=>{
            window.onkeydown = null;
            window.onkeyup = null;
        }
    });*/

    
   
   

    const [distance, setDistance] = useState(5);
    const [polarAngle, setPolarAngle] = useState(0.3 * Math.PI);
    const [updateCharacterPosition, setUpdateCharacterPosition] = useState(true)
    
    const [ctrlDown, setCtrlDown] = useState(false);
    const [gDown, setgdown] = useState(false);
    const onKeyDown = (e) =>{
        
        if(e.keyCode == 32){
           
            if(!isAdmin){
                    if(orbitRef.current){
                        
                        const target = orbitRef.current.target.clone()
                        
                        const dist = camera.position.distanceTo(target);
                        
                        

                        // var angleRadians = Math.atan2(orbitRef.current.target.y - camera.position.y, or)

                        setDistance( prev=>  dist)
                    }
                    setUpdateCharacterPosition(prev=>!prev);    
            }
          
        }
        if (e.keyCode == 17) {
           setCtrlDown(true); 
        }
        if (e.keyCode == 71 && ctrlDown) setgdown(prev => !prev)
    }
    const onKeyUp = (e) =>{
        if (e.keyCode == 32) {
           
        }
        if (e.keyCode == 17) {
            setCtrlDown(false);
        }
        
    }
    const [panPoint, setPanPoint] = useState(false)
    useEffect(()=>{
        orbitRef.current?.addEventListener('change', regress)
        if (selectedCharacter == null && isAdmin){
            setPanPoint(true)
        }else{
            setPanPoint(false)
        }
        return ()=>{
            orbitRef.current?.removeEventListener('change', regress)
        }
    },[isAdmin,selectedCharacter,userCharacter,campaignScene])
 



 
    const measureFromCharacter = (position) => {
        if(selectedCharacter != null && userCharacter.sceneID > 0 ){
            let objPos = null;

            if(isAdmin)
            {
                objPos = selectedCharacter != null ? selectedCharacter.object.position : null;
            }else{
                objPos = selectedCharacter != null ? selectedCharacter.object.position : userCharacter.object.position;
            }

            
            
            if(objPos == null){
                setCtrlDown(false);
            } else{
                const target = new THREE.Vector3(objPos[0],objPos[1],objPos[2]);
                setCtrlDown(false);
                alert("Distance is: " + Math.round(target.distanceTo(position)*2))
            }
        }
    }

   
    

    const loadGltf = (url) =>{
    
        if(!(url in assets.gltfs) && url != null && url != ""){
            addGltf(url, null)
            gltfLoader.loadAsync(url).then((gltf) => {
                addGltf(url, gltf)
                
            }, (error) => {
                alert(error)
            }) 
        }
    }

  

    useImperativeHandle(ref,() => ({
        onPointerDown: onPointerDown,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp
    }), [])



    const pointLightRef = useRef();
    const ambientLightRef = useRef();

    return(

                    
        <group>
        {isAdmin &&
            <>
                {selectedCharacter != null &&
                    !selectedCharacter.object ? <OrbitControls       ref={orbitRef} mouseButtons={{ MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }} /> : selectedCharacter != null && < OrbitControls        ref={orbitRef} target={selectedCharacter.object.position} mouseButtons={{ MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }} />
                }
                {selectedCharacter == null && 
                    <OrbitControls  ref={orbitRef}        mouseButtons={{ MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }} />
                }

              
                    
            

            </>
        }
           
            
          
        
            {userCharacter.PCID > 0  && campaignScene &&
                userCharacter.sceneID == campaignScene.sceneID  && 
                    userCharacter.object.position  &&
                    <>
                    {updateCharacterPosition  &&
                    < OrbitControls ref={orbitRef}  target={ userCharacter.object.position} minDistance={distance} maxDistance={distance} minPolarAngle={polarAngle} maxPolarAngle={polarAngle} mouseButtons={{ RIGHT: THREE.MOUSE.ROTATE }} /> 
                    }
                    {!updateCharacterPosition &&
                    < OrbitControls ref={orbitRef} target={userCharacter.object.position} minDistance={3} maxDistance={10} minPolarAngle={0} maxPolarAngle={0.35 * Math.PI} mouseButtons={{ MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }} />
                    }

                    <Placeable scale={.08*mapScale} ref={characterRef} position={userCharacter.object.position} rotation={userCharacter.object.rotation}   name={userCharacter.object.name} src={userCharacter.object.url} color={userCharacter.object.color} />
                </>
            
            }
    
           <pointLight
            position={[20,400,10]}
            ref={pointLightRef}
            
            intensity={1}
                castShadow={true}
            shadow-mapSize-height={128}
            shadow-mapSize-width={128}

            />
            <hemisphereLight
                ref={ambientLightRef}
                args={[0x9999ff, 0x000000, 1]}
            />
     
           <TerrainManager ref={terrainManagerRef} regress={regress} />
            
            
            {campaignScene.sceneID > 0 &&
            <>
                <MonsterManager
                    ref={monsterManagerRef}
                    pointLight={pointLightRef.current}
                    ambientLight={ambientLightRef.current}
                    loadGltf={loadGltf}
                    mapScale={.08 * mapScale}
                />

          
                {campaignScene.setting.name == "Day" && 
                    <>
                                        <Sky />
                    </> 
                }
                { campaignScene.setting.name == "Night" &&
                    <>
                    <Stars /> 
                    </> 
                }
                
                </>
            }
        </group>
     
    )
}

export default forwardRef( TableTop);
//
/*   

  <SimpleTerrain

                regress={regress}

                grid={gDown}

        
                onLeftClick={(point, inBounds) => {
                   
                   // moveTo(point, inBounds);
                }}

                onMiddleClick={(point)=>{
                    
                }}
                onRightClick={(point, inBounds) => {
                    
                  // if(ctrlDown) measureFromCharacter(new THREE.Vector3(x,y,z))
                    
                }}
         
                mapScale={mapScale} terrain={campaignScene.terrain}/>

                    mapScale={mapScale} terrain={campaignScene.terrain}

<hemisphereLight
                groundColor={0x0000ff}
                color={0xff0000}
                castShadow={true}
              
                intensity={1}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}

            />

  
                            
<group ref={center} position={[5,-18,0]}>
                <group position={[0, -1, 0]} > 
                */
//   //   <OrbitControls enableRotate={false} maxDistance={80} minDistance={10} />
//
//   <instancedBufferAttribute attachObject={['attributes', 'uv']} args={[uvArray, 2]} />
// <shaderMaterial ref={shaderRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /> 
//<meshBasicMaterial map={worldMap} />
// 
//<MapShader />

/* 
<Placeable position={[-10, 0, -10]} name={"KoboldRanger"} src={"objects/KuboldRanger.glb"} metalness={0.9} color={new THREE.Color("grey")} />
<Placeable position={[-30, 0, -10]} src={"objects/halflingRogue.glb"} metalness={0.1} color={new THREE.Color("red")} />
<Placeable position={[-50, 0, -10]} src={"objects/dragonbornSorcerer2.glb"} metalness={.7} color={new THREE.Color("blue")} />
<Placeable position={[10, -2, -10]} src={"objects/dragonbornPaladin1.glb"} metalness={0.1} color={new THREE.Color("purple")} />
*/
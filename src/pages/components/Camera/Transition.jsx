import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import produce from "immer";
import * as THREE from 'three';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });


import useZust from '../../../hooks/useZust';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';


export function Transition(props ={}) {
    
    const page = useZust((state) => state.page);
    const usePosition = useRef();

    const orthoCam = useRef();

    //const pageSize = useZust((state) => state.pageSize);
    const campaignScene = useZust((state) => state.campaignScene)
   // const userCharacter = useZust((state) => state.userCharacter)
   
    const set = useThree((state) => state.set);
    const size = useThree((state) => state.size);

    const gl = useThree((state) => state.gl);
    const camera = useThree((state) => state.camera)

    
    
  

    useEffect(() => { usePosition.current = { position: { x: 2000, y: 500, z:2000 } } }, [])
    
 

    const controls = new CameraControls(camera, gl.domElement);
   
  //  gl.shadowMap.type = THREE.PCFSoftShadowMap;

    let offset = 0;
    let orbitF = useRef( [30, .2, 30]);
    
    let speed = .005;

    let x = 0;
    let y = 0;
    let z = 0
    let z1 = 0;
    let x1 = 0;
    let y1 = 0;

    
    const increase = .05;
    const fastIncrease = 1;
    const slow = .001;

    let i = 0;

    let setCamera = 0;

    let difference = 0;
    
    function diff(a = 0, b = 0){
        if(a > b ){
            return a - b;
        }else{
            return b - a;
        } 
    }

    let useFast = useRef( {x:1, y:1, z:1}) ;

    
    

    const faster = .1;

    let tableCamera = {x:0,y:0,z:80};

//    const socket = useZust((state)=> state.socket)

    let setScene = -1;

/*    let positionChanged = false;

    useEffect(()=>{
        socket.on("PartyScenePosition", (PCID, sceneID, position) => {
            if(userCharacter!= null){
            if (userCharacter.PCID == PCID) {
                positionChanged = true;
            }
            }
        })
    },[socket,userCharacter])*/
    const loadingComplete = useZust((state) => state.loadingComplete)
    const loadingRef = useRef({value:true})
    useEffect(() => { 

        if(loadingRef.current.value != loadingComplete){ 
            loadingRef.current.value = loadingComplete
    
        }
       
    }, [loadingComplete])

    const dM = 2;
    const dM3 = 2;

    useFrame(({ delta, clock, camera }) => {

       
        if (typeof usePosition.current !== undefined ){
            if (loadingRef.current.value){
            switch (page) {
                case null:
                    break;
                case 1:
                    if(setCamera != page)
                    {
                        setCamera = page;
                        useFast.current = {x:true, y:true, z:true}
                    }                

                    x = -((Math.cos((clock.getElapsedTime() + offset) * speed*.05) * (orbitF.current[0]*20 )) );
                    y = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1])  ;
                    z = (Math.sin((clock.getElapsedTime() + offset) * speed*.05) * (orbitF.current[2] *20)) ;

                    x1 = -((Math.cos((clock.getElapsedTime() + offset) * speed*10) * (orbitF.current[0])));
                    y1 = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                    z1 = (Math.sin((clock.getElapsedTime() + offset) * speed*10) * (orbitF.current[2]));

                    difference = diff(x, usePosition.current.position.x);
                   
                    if (difference > (fastIncrease*dM) && useFast.current.x) {
                        if (usePosition.current.position.x < x + fastIncrease) {
                            usePosition.current.position.x += fastIncrease;
                        } else if (usePosition.current.position.x > x - fastIncrease) {
                            usePosition.current.position.x -= fastIncrease;
                        }
                        x = usePosition.current.position.x;
                    } else {
                        
                        if (difference > increase  ) {
                            if (useFast.current.x) useFast.current.x = false;
                            x = usePosition.current.position.x;
                            if (usePosition.current.position.x < x + slow) {
                                usePosition.current.position.x += slow;
                            } else if (usePosition.current.position.x > x - slow) {
                                usePosition.current.position.x -= slow;
                            }
                            x = usePosition.current.position.x;
                        }
                    }
                    if (difference > 1000) useFast.current.x = true

                    difference = diff(y, usePosition.current.position.y);

                    if (difference > (fastIncrease * dM) && useFast.current.y) {
                        if (usePosition.current.position.y < y + fastIncrease) {
                            usePosition.current.position.y += fastIncrease;
                        } else if (usePosition.current.position.y > y - fastIncrease) {
                            usePosition.current.position.y -= fastIncrease;
                        }
                        y = usePosition.current.position.y;
                    } else {
                        if (useFast.current.y) useFast.current.y = false;
                        if (difference > increase) {
                            y = usePosition.current.position.y;
                            if (usePosition.current.position.y < y + increase) {
                                usePosition.current.position.y += increase;
                            } else if (usePosition.current.position.y > y - increase) {
                                usePosition.current.position.y -= increase;
                            }
                            y = usePosition.current.position.y;
                        }
                    }

                    if (difference > 1000) useFast.current.y = true

                    difference = diff(z, usePosition.current.position.z);

                    if (difference > (fastIncrease * dM) && useFast.current.z) {
                        if (usePosition.current.position.z < z + fastIncrease) {
                            usePosition.current.position.z += fastIncrease;
                        } else if (usePosition.current.position.z > z - fastIncrease) {
                            usePosition.current.position.z -= fastIncrease;
                        }
                        z = usePosition.current.position.z;
                    } else {
                        if (useFast.current.z) useFast.current.z = false;
                        if (difference > increase) {
                            z = usePosition.current.position.z;
                            if (usePosition.current.position.z < z + increase) {
                                usePosition.current.position.z += increase;
                            } else if (usePosition.current.position.z > z - increase) {
                                usePosition.current.position.z -= increase;
                            }
                            z = usePosition.current.position.z;
                        }
                    }

                    if(difference > 1000) useFast.current.z = true
                
                   controls.setLookAt(x, y , z, x1, y1, z1);
                    controls.update(delta);
                    
                    

                
                    break;
                case 2:
                    if (setCamera != page) {
                        setCamera = page;
                        useFast.current = { x: true, y: true, z: true }
                    }

                    x = ((Math.cos((clock.getElapsedTime() + offset) * speed) * (orbitF.current[0]*10)));
                    y =0 //(Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                    z = (Math.sin((clock.getElapsedTime() + offset) * speed ) * (orbitF.current[2]*10));

                    x1 = -((Math.cos((clock.getElapsedTime() + offset) * speed) * (orbitF.current[0])));
                    y1 = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                    z1 = (Math.sin((clock.getElapsedTime() + offset) * speed) * (orbitF.current[2]));

                    difference = diff(x, usePosition.current.position.x);

                    if (difference > (fastIncrease * dM) && useFast.current.x) {
                        if (usePosition.current.position.x < x + fastIncrease) {
                            usePosition.current.position.x += fastIncrease;
                        } else if (usePosition.current.position.x > x - fastIncrease) {
                            usePosition.current.position.x -= fastIncrease;
                        }
                        x = usePosition.current.position.x;
                    } else {
                        if (useFast.current.x) useFast.current.x = false;
                        if (difference > increase * 10) {
                            x = usePosition.current.position.x;
                            if (usePosition.current.position.x < x + increase ) {
                                usePosition.current.position.x += increase ;
                            } else if (usePosition.current.position.x > x - increase) {
                                usePosition.current.position.x -= increase ;
                            }
                            x = usePosition.current.position.x;
                        }
                    }

                    difference = diff(y, usePosition.current.position.y);

                    if (difference > (fastIncrease * dM) && useFast.current.y) {
                        if (usePosition.current.position.y < y + fastIncrease) {
                            usePosition.current.position.y += fastIncrease;
                        } else if (usePosition.current.position.y > y - fastIncrease) {
                            usePosition.current.position.y -= fastIncrease;
                        }
                        y = usePosition.current.position.y;
                    } else {
                        if (useFast.current.y) useFast.current.y = false;
                        if (difference > increase * 10) {
                            y = usePosition.current.position.y;
                            if (usePosition.current.position.y < y + increase ) {
                                usePosition.current.position.y += increase;
                            } else if (usePosition.current.position.y > y - increase ) {
                                usePosition.current.position.y -= increase ;
                            }
                            y = usePosition.current.position.y;
                        }
                    }

                    difference = diff(z, usePosition.current.position.z);

                    if (difference > (fastIncrease * dM) && useFast.current.z) {
                        if (usePosition.current.position.z < z + fastIncrease) {
                            usePosition.current.position.z += fastIncrease;
                        } else if (usePosition.current.position.z > z - fastIncrease) {
                            usePosition.current.position.z -= fastIncrease;
                        }
                        z = usePosition.current.position.z;
                    } else {
                        if (useFast.current.z) useFast.current.z = false;
                        if (difference > increase * 10) {
                            z = usePosition.current.position.z;
                            if (usePosition.current.position.z < z + increase * 2) {
                                usePosition.current.position.z += increase * 2;
                            } else if (usePosition.current.position.z > z - increase * 2) {
                                usePosition.current.position.z -= increase * 2;
                            }
                            z = usePosition.current.position.z;
                        }
                    }

                    controls.setLookAt(x, y, z, x1, y1, z1);
                    controls.update(delta);
                    break;
                

                    case 3 :
                    
                    if (setCamera != page) {
                        setCamera = page;
                        useFast.current = { x: true, y: true, z: true }
                    }

                    x = -((Math.cos((clock.getElapsedTime() + offset) * speed * .5) * (orbitF.current[0]*20 )));
                    y = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                    z = (Math.sin((clock.getElapsedTime() + offset) * speed *.5) * (orbitF.current[2]*20 ));

                    x1 = -((Math.cos((clock.getElapsedTime() + offset) * speed * 5) * (orbitF.current[0]*5)));
                    y1 = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                    z1 = (Math.sin((clock.getElapsedTime() + offset) * speed * 4) * (orbitF.current[2]*5));

                    difference = diff(x, usePosition.current.position.x);

                    if (difference > ((fastIncrease /2) * dM3) && useFast.current.x) {
                        if (usePosition.current.position.x < x + (fastIncrease /2)) {
                            usePosition.current.position.x += (fastIncrease /2);
                        } else if (usePosition.current.position.x > x - (fastIncrease /2)) {
                            usePosition.current.position.x -= (fastIncrease /2);
                        }
                        x = usePosition.current.position.x;
                    } else {
                        if (useFast.current.x) useFast.current.x = false;
                        if (difference > increase *2 ) {
                            x = usePosition.current.position.x;
                            if (usePosition.current.position.x < x + increase*2) {
                                usePosition.current.position.x += increase*2;
                            } else if (usePosition.current.position.x > x - increase*2) {
                                usePosition.current.position.x -= increase*2;
                            }
                            x = usePosition.current.position.x;
                        }
                    }

                    difference = diff(y, usePosition.current.position.y);

                    if (difference > ((fastIncrease /2) * dM3) && useFast.current.y) {
                        if (usePosition.current.position.y < y + (fastIncrease /2)) {
                            usePosition.current.position.y += (fastIncrease /2);
                        } else if (usePosition.current.position.y > y - (fastIncrease /2)) {
                            usePosition.current.position.y -= (fastIncrease /2);
                        }
                        y = usePosition.current.position.y;
                    } else {
                        if (useFast.current.y) useFast.current.y = false;
                        if (difference > increase ) {
                            y = usePosition.current.position.y;
                            if (usePosition.current.position.y < y + increase) {
                                usePosition.current.position.y += increase;
                            } else if (usePosition.current.position.y > y - increase) {
                                usePosition.current.position.y -= increase;
                            }
                            y = usePosition.current.position.y;
                        }
                    }

                    difference = diff(z, usePosition.current.position.z);

                    if (difference > ((fastIncrease /2) * dM3) && useFast.current.z) {
                        if (usePosition.current.position.z < z + (fastIncrease /2)) {
                            usePosition.current.position.z += (fastIncrease /2);
                        } else if (usePosition.current.position.z > z - (fastIncrease /2)) {
                            usePosition.current.position.z -= (fastIncrease /2);
                        }
                        z = usePosition.current.position.z;
                    } else {
                        if (useFast.current.z) useFast.current.z = false;
                        if (difference > increase *2 ) {
                            z = usePosition.current.position.z;
                            if (usePosition.current.position.z < z + increase * 2) {
                                usePosition.current.position.z += increase * 2;
                            } else if (usePosition.current.position.z > z - increase * 2) {
                                usePosition.current.position.z -= increase * 2;
                            }
                            z = usePosition.current.position.z;
                        }
                    }

                    controls.setLookAt(x, y, z, x1, y1, z1);
                    controls.update(delta);



                        
                    break;
         
                    case 10:
                        if(setCamera != page){
                            setCamera = page;
                            usePosition.current.position.x = 0;
                            usePosition.current.position.y = 0;
                            usePosition.current.position.z = 80;
                              controls.setLookAt(0,0,80,0,0,0);
                         //   controls.enabled = false;
                             controls.update(delta);
                             
                        }
                  //  
                        break;
                    case 11:
                        if (setCamera != page) {
                            setCamera = page;
                            controls.setLookAt(0, 10, 0, 0, 0, 0);
                            // controls.enabled = false;
                            controls.update(delta);
                        }

                     /*   if(positionChanged)
                        {
                            positionChanged = false;
                            var position = userCharacter.object.position;
                            controls.setLookAt(position[0], position[1] + 15, position[2]+30, position[0], position[1], position[2])
                            controls.update(delta);
                        }*/
                        break;
                    case 12:
                        if (setCamera != page) {
                            setCamera = page;
                            controls.setLookAt(0, 0, 80, 0, 0, 0);
                           // controls.enabled = false;
                            controls.update(delta);

                        }
                        break;
                case 13:
                    if (setCamera != page) {
                        setCamera = page;
                        controls.setLookAt(0, 50, 400, 0, 0, 0);
                        // controls.enabled = false;
                        controls.update(delta);

                    }
                    break;
            }
            } else {
                
                x = -((Math.cos((clock.getElapsedTime() + offset) * speed * .5) * (orbitF.current[0] * 20)));
                y = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                z = (Math.sin((clock.getElapsedTime() + offset) * speed * .5) * (orbitF.current[2] * 20));

                x1 = -((Math.cos((clock.getElapsedTime() + offset) * speed * 5) * (orbitF.current[0] * 5)));
                y1 = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF.current[1]);
                z1 = (Math.sin((clock.getElapsedTime() + offset) * speed * 4) * (orbitF.current[2] * 5));

                difference = diff(x, usePosition.current.position.x);

              
                    if (difference > increase * 2) {
                        x = usePosition.current.position.x;
                        if (usePosition.current.position.x < x + increase * 2) {
                            usePosition.current.position.x += increase * 2;
                        } else if (usePosition.current.position.x > x - increase * 2) {
                            usePosition.current.position.x -= increase * 2;
                        }
                        x = usePosition.current.position.x;
                    }
             
                difference = diff(y, usePosition.current.position.y);

                
                    if (useFast.current.y) useFast.current.y = false;
                    if (difference > increase) {
                        y = usePosition.current.position.y;
                        if (usePosition.current.position.y < y + increase) {
                            usePosition.current.position.y += increase;
                        } else if (usePosition.current.position.y > y - increase) {
                            usePosition.current.position.y -= increase;
                        }
                        y = usePosition.current.position.y;
                    }
                

                difference = diff(z, usePosition.current.position.z);

         
                    if (useFast.current.z) useFast.current.z = false;
                    if (difference > increase * 2) {
                        z = usePosition.current.position.z;
                        if (usePosition.current.position.z < z + increase * 2) {
                            usePosition.current.position.z += increase * 2;
                        } else if (usePosition.current.position.z > z - increase * 2) {
                            usePosition.current.position.z -= increase * 2;
                        }
                        z = usePosition.current.position.z;
                    }
                

                controls.setLookAt(x, y, z, x1, y1, z1);
                controls.update(delta);
            }
       }
        
    })

    return (
        <group>
            <mesh ref={usePosition} >
                <sphereGeometry attach='geometry' args={[.1,32,32]} />
                <meshBasicMaterial attach='material' opacity={0} transparent  />
            </mesh>

          

   

        </group>
    );
}



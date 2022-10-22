
import React, {useEffect, useState} from "react";
import Placeable from './placeables/Placeable';
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useZust from "../../hooks/useZust";
import produce from "immer";


export const MonsterViewer = ({ ...props }) =>{
    const gl = useThree((state) => state.gl);
    const camera = useThree((state) => state.camera);

    const monsters = useZust((state) => state.monsters);
    const selectedCharacter =useZust((state) => state.selectedCharacter)
    const tempObject= useZust((state)=>state.tempObject);

    const [previewMonster, setPreviewMonster] = useState(null)


    useEffect(()=>{
       
        if(tempObject != null && "url" in tempObject && "name" in tempObject)
        {
            if(tempObject.url != "" && tempObject.name != ""){
              
                setPreviewMonster(
                    <Placeable 
                        scale={[.1 * tempObject.scale.x, .1 * tempObject.scale.y, .1 * tempObject.scale.z]}
                        rotation-x={tempObject.rotation.x}
                        rotation-y={tempObject.rotation.y}
                        rotation-z={tempObject.rotation.z}

                        position-x={tempObject.offset.x}
                        position-y={tempObject.offset.y}
                        position-z={tempObject.offset.z}
                        
                        name={tempObject.name}
                        src={tempObject.url}
                        color={tempObject.color}
                        metalness={0.9}
                    />
                )
            }
           
        }else if(previewMonster != null){
            setPreviewMonster(null);
        }
    }, [tempObject])

    return(
        <>
         
              <pointLight intensity={.4} 
                position={[0,300,-300]}
            />
            <pointLight intensity={.2}
                position={[300, 0, 300]}
            />
            <pointLight

                castShadow={true}
                position={[0, 200, 50]}
                intensity={1}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
            />
           <Sky />
            <group position={[0, -20, 0]} >
            {previewMonster &&
                previewMonster
            }
            {!previewMonster &&
                <>
             
                    {monsters != null && monsters !== undefined &&
                        monsters.length > 0 && selectedCharacter >= 0 && 
                            <Placeable
                                position-x={monsters[selectedCharacter].object.offset.y}
                                position-y={monsters[selectedCharacter].object.offset.y}
                                position-z={monsters[selectedCharacter].object.offset.z}

                                rotation-x={monsters[selectedCharacter].object.rotation.x} 
                                rotation-y={monsters[selectedCharacter].object.rotation.y} 
                                rotation-z={monsters[selectedCharacter].object.rotation.z}

                                scale={[
                                    .1 * monsters[selectedCharacter].object.scale.x, 
                                    .1 * monsters[selectedCharacter].object.scale.y, 
                                    .1 * monsters[selectedCharacter].object.scale.z]} 
                                    
                                name={monsters[selectedCharacter].object.name} 
                                src={monsters[selectedCharacter].object.url} 
                                metalness={0.9} 
                                color={monsters[selectedCharacter].object.color} 
                            />
                    }
               
                </>
            }
             </group>
            < OrbitControls target={[0, -15, 0]} maxDistance={600} minDistance={0} minPolarAngle={.1 * Math.PI} maxPolarAngle={0.5 * Math.PI} mouseButtons={{ MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }} />

            <mesh receiveShadow={true} position={[0, -220, 0]}>
                <boxGeometry args={[10, 400, 10]} />
                <meshStandardMaterial color={"grey"} metalness={1} />
            </mesh>
           
        </>
    )
}



//  <Placeable position={[0,0,0]} />

//
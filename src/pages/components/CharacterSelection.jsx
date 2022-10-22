
import React, {useEffect, useState} from "react";
import Placeable from './placeables/Placeable';
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useZust from "../../hooks/useZust";
import produce from "immer";

export const CharacterSelection = ({ ...props }) =>{
    const gl = useThree((state) => state.gl);
    const characters = useZust((state) => state.characters);
    const currentCharacter =useZust((state) => state.currentCharacter)
    const selectedCharacter = useZust((state) => state.selectedCharacter)
  const [previewPlaceable, setPreviewPlaceable] = useState(null)


    useEffect(()=>{
        if(currentCharacter > -1 && characters != null)
        {
            if(characters.length > 0){
            setPreviewPlaceable(
                <Placeable 
                    position={[0, -20, 0]} 
                    name={characters[currentCharacter].object.name} 
                    src={characters[currentCharacter].object.url}
                    color={characters[currentCharacter].object.color} 
                    metalness={0.9} 
                />
            )}
        }else if(previewPlaceable != null){
            setPreviewPlaceable(null);
        }
    }, [currentCharacter,characters])

    return(
        <>
         
              <pointLight intensity={.4} 
                position={[100,300,-100]}
            />
            <pointLight intensity={.2}
                position={[100, 0, 100]}
            />
            <pointLight

                castShadow={true}
                position={[0, 50, 50]}
                intensity={1}
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
            />
            <Stars />
            {previewPlaceable &&
                previewPlaceable
            }
            {!previewPlaceable &&
                <>
            {characters !=null && characters !== undefined ? characters.length > 0 && currentCharacter >= 0 ? <Placeable position={[0, -20, 0]} name={characters[currentCharacter].object.name} src={characters[currentCharacter].object.url} metalness={0.9} color={characters[currentCharacter].object.color} />
              :<></>  : <></> }
              </>
            }
            <mesh receiveShadow={true} position={[0, -220, 0]}>
                <boxGeometry args={[20, 400, 20]} />
                <meshStandardMaterial color={"grey"} metalness={1} />
            </mesh>
            < OrbitControls maxDistance={200} minDistance={40} minPolarAngle={0.2*Math.PI} maxPolarAngle={0.5*Math.PI} mouseButtons={{RIGHT: THREE.MOUSE.ROTATE }} />
        </>
    )
}



//  <Placeable position={[0,0,0]} />

//
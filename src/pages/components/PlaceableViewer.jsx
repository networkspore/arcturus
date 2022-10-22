
import React, {useEffect, useState} from "react";
import Placeable from './placeables/Placeable';
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useZust from "../../hooks/useZust";
import produce from "immer";


export const PlaceableViewer = ({ ...props }) =>{
    const gl = useThree((state) => state.gl);
    const camera = useThree((state) => state.camera);

    const placeables = useZust((state) => state.placeables);
    const currentPlaceable =useZust((state) => state.currentPlaceable)
    const tempObject= useZust((state)=>state.tempObject);

    const [previewPlaceable, setPreviewPlaceable] = useState(null)


    useEffect(()=>{
        if ((tempObject != null && "url" in tempObject && "name" in tempObject) && (tempObject.url != "" && tempObject.name != ""))
        {
              
                setPreviewPlaceable(
                    <Placeable 
                        scale={[.1 * tempObject.scale.x, .1 * tempObject.scale.y, .1 * tempObject.scale.z]}
                        rotation-x={tempObject.rotation.x * (2 * Math.PI / 360) }
                        rotation-y={tempObject.rotation.y * (2 * Math.PI / 360) }
                        rotation-z={tempObject.rotation.z * (2 * Math.PI / 360) }

                        position-x={tempObject.offset.x}
                        position-y={tempObject.offset.y}
                        position-z={tempObject.offset.z}
                        
                        name={tempObject.name}
                        src={tempObject.url}
                        color={tempObject.color}
                        metalness={0.9}
                    />
                )
            
           
        }else{
            if ( (placeables != null && placeables !== undefined) && (placeables.length > 0 && currentPlaceable >= 0)){
               placeables.forEach(placeable => {
                   if(placeable.placeableSceneID = currentPlaceable.placeableSceneID){
                        setPreviewPlaceable(
                            <Placeable
                                position-x={placeables[currentPlaceable].object.offset.y}
                                position-y={placeables[currentPlaceable].object.offset.y}
                                position-z={placeables[currentPlaceable].object.offset.z}

                                rotation-x={placeables[currentPlaceable].object.rotation.x * (2 * Math.PI / 360) }
                                rotation-y={placeables[currentPlaceable].object.rotation.y * (2 * Math.PI / 360) }
                                rotation-z={placeables[currentPlaceable].object.rotation.z * (2 * Math.PI / 360) }

                                scale={[
                                    .1 * placeables[currentPlaceable].object.scale.x,
                                    .1 * placeables[currentPlaceable].object.scale.y,
                                    .1 * placeables[currentPlaceable].object.scale.z]}

                                name={placeables[currentPlaceable].object.name}
                                src={placeables[currentPlaceable].object.url}
                                metalness={0.9}
                                color={placeables[currentPlaceable].object.color}
                            />
                        )
                    }
               });
            }else{
                setPreviewPlaceable(null)
            }
            


        }
    }, [tempObject, currentPlaceable])

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
            {previewPlaceable &&
                previewPlaceable
            }
            
             </group>
            < OrbitControls target={[0, -20, 0]} maxDistance={600} minDistance={0} minPolarAngle={0 * Math.PI} maxPolarAngle={0.5 * Math.PI} mouseButtons={{ MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }} />

            <mesh receiveShadow={true} position={[0, -220, 0]}>
                <boxGeometry args={[50, 400, 50]} />
                <meshStandardMaterial color={"grey"} metalness={1} />
            </mesh>
           
        </>
    )
}



//  <Placeable position={[0,0,0]} />

//
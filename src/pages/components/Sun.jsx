import React, { useRef, useState } from 'react';
import {  useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';



export function Sun() {

    const sunMap = useTexture("Images/sun-small.png");
    //  strength, radius, threshold 
    let str = 1.7;
    let rad = .7;
    let thresh = .1;
    let brighter = false;
    const swing = .2;

    const spin = .004;

    const useSun = useRef();
  
  /*  const composer = useRef();
    const bloomer = useRef();

    const { scene, gl, camera, size } = useThree();

    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
        size
    ]);*/
    

    

  //  gl.autoClear = false;



    useFrame(() => {
        /*
        if (brighter) {
            bloomer.current.strength += .008;
            if (bloomer.current.strength > strength + swing) {
                brighter = !brighter;
            }
        } else {
            bloomer.current.strength -= .008;
            if (bloomer.current.strength < strength) {
                brighter = !brighter;
            }
        }
        */




        useSun.current.rotation.y += spin;
    });

    return (
        <group>
            <mesh ref={useSun}  >

                <sphereGeometry attach="geometry" args={[.37, 32, 32]} />
                <meshStandardMaterial opacity={1} attach="material" transparent color={"white"} map={sunMap} />

            </mesh>
          <mesh  >

                <sphereGeometry attach="geometry" args={[.4, 32, 32]} />
                <meshStandardMaterial opacity={.5} attach="material" transparent color={"#faa014"} />

            </mesh>
            
          
          
        </group>
    )
}

//map={sunTexture} spin={.005} color="#d6af00"  position={[0, 0, 0]} args={[.5, 32, 32]} 

    // const { gl, camera, size } = useThree()
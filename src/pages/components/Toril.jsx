import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import  SunBloom  from './effects/SunBloom';
import { Planet } from './Planet';
import { useProgress, useTexture } from '@react-three/drei';
import useZust from '../../hooks/useZust';

import * as THREE from 'three';


export function Toril() {
    

    const worldTexture = useTexture("Images/toril-small.png");
    const moonTexture = useTexture("Images/moon-small.png");
    const cloudTexture = useTexture("Images/clouds-small.png");
  
    const active = useZust((state) => state.torilActive);
    const setActive = useZust((state) => state.setTorilActive);



 //   const defaultZoom = [0, 0, 10];
    const initialZoom = [0,0, 1500]
   
  //  let currentPos = initialZoom;
   
   
    const page = useZust((state) => state.page);
    
 

    const goToEditor = (e = new Event("click")) => {
        if(page>=3){
           setActive(true);
        }
    }

    const usePlanet = useRef();
    const useMoon = useRef();
    const useClouds = useRef();


    let speed = .005;
    let z1 = 0;
    let x1 = 0;
    let y1 = 0;

    const offset = 0;
    const orbitF = [30, .2, 30];
    const spin =  0.005;
    const cloudSpin = 0.01;
    

    const moonOf = [3,.2,3];
    const moonOffset = 0;
    const moonSpeed = .2;

  /*  useLayoutEffect(()=>{
    
       usePlanet && camera.lookAt([0,0,0]);
    });*/
    

    useFrame(({ clock}) => {
    
       const x= -((Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF[0]) + x1);
       const y= (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF[1]) + y1;
       const z=  (Math.sin((clock.getElapsedTime() + offset) * speed) * orbitF[2]) + z1;    
            usePlanet.current.position.x = x;
            usePlanet.current.position.y = y;
            usePlanet.current.position.z = z;
            usePlanet.current.rotation.y += spin;

      

            useMoon.current.position.x = -((Math.cos((clock.getElapsedTime() + moonOffset) * moonSpeed) * moonOf[0]) - usePlanet.current.position.x);
            useMoon.current.position.y = (Math.cos((clock.getElapsedTime() + moonOffset) * moonSpeed) * moonOf[1]) + usePlanet.current.position.y;
            useMoon.current.position.z = (Math.sin((clock.getElapsedTime() + moonOffset) * moonSpeed) * moonOf[2]) + usePlanet.current.position.z;
           
        useClouds.current.position.copy(usePlanet.current.position);
        useClouds.current.rotation.y += cloudSpin;
       // useClouds.current.rotation.x -= cloudSpin;
    });
    // onClick={() => setActive(!active)}
    return (
        <group>
     
            <mesh  ref={useClouds}  >

                <sphereGeometry args={[.52, 32, 32]} />
                <meshStandardMaterial opacity={.6} map={cloudTexture} transparent />
            </mesh>
          
            <mesh   ref={usePlanet}  >
               
                <sphereGeometry args={[.5,32,32]} />
                <meshStandardMaterial  map={worldTexture} />
            </mesh>

            <mesh   ref={useMoon}>
                <sphereGeometry args={[.1,32,32]} />
                <meshStandardMaterial color={"grey"} map={moonTexture} />
            </mesh>

        </group>
    )
}
/*if(follow){
            usePlanet.current.position.x = -((Math.cos((clock.getElapsedTime() + offset) * speed) * (orbitF[0]*1.2)) + x1);
            usePlanet.current.position.y = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF[1]) + y1;
            usePlanet.current.position.z = (Math.sin((clock.getElapsedTime() + offset) * speed) * (orbitF[2]*1.2)) + z1;
            doneFollow = false;
        }else{
            
        }*/
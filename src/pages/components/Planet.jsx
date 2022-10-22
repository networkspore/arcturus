import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
export function Planet(props = {}) {

    

    const usePlanet = useRef();
    let speed = ("speed" in props ? props.speed : 1);
    let z1 = 0;
    let x1 = 0;
    let y1 = 0;

    const offset = ("offset" in props ? props.offset : 0);
    const orbitF = ("orbitFactor" in props ? props.orbitFactor : [2,2,2]);
    const spin = ("spin" in props ? props.spin : 0);
    if(props.position !== undefined)
    {
        z1 = props.position[2];
        x1 = props.position[0];
        y1 = props.position[1];
    }

    useFrame(({ clock }) => {
        if(props.orbit)
        {
            usePlanet.current.position.x = -((Math.cos((clock.getElapsedTime()+ offset) * speed) * orbitF[0]) + x1);
            usePlanet.current.position.y = (Math.cos((clock.getElapsedTime() + offset) * speed) * orbitF[1]) + y1;
            usePlanet.current.position.z = (Math.sin((clock.getElapsedTime() + offset) * speed) * orbitF[2]) + z1;

            
        }
        if(spin != 0){
            usePlanet.current.rotation.y += spin;
        }
    });

    return (
        <>
           
            <mesh   ref={usePlanet} {...props} >
           
                    <sphereGeometry args={props.args} />
                    <meshStandardMaterial color={props.color} alphaMap={props.alphaMap} map={props.map}/>
                </mesh>
          
        </>
    )
}
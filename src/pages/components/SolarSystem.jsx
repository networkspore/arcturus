import React, { useState } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import {  Stars, useTexture } from '@react-three/drei';
import { Asteroids } from './Asteroids';
import { Toril } from './Toril';
import { useRef } from 'react';
import  SunBloom  from './effects/SunBloom';
import { Transition } from './Camera/Transition';



const SolarSystem = ({props}) => {
    //  strength, radius, threshold 
    let str = 9;
    let rad = .3;
    let thresh = .00001;
   // const sunAlpha = useTexture("Images/sun-small-alpha.png");
        
        const venusText = useTexture("Images/venus_small.jpg");
    const marsText = useTexture("Images/mars-small.png");
    //const neptuneTexture = useTexture("Images/neptune-small.png");

    // const { gl, camera, size } = useThree()

    const scene1 = useRef();


        

    return (
           
            <group > 
                    <scene ref={scene1}>
                            <pointLight intensity={.9}
                                    
  />
                        <ambientLight intensity={.5} />
                        <Sun />
                         <Toril />
                            <Planet offset={40} args={[.08, 32, 32]} spin={.006} map={venusText} color={"#888888"} receiveShadow orbit={true} orbitFactor={[15, .4, 15]} speed={.0003} position={[0, 0, 0]} />
                            
                    <Planet map={marsText} spin={.005}  orbitFactor={[800, 0, 800]} args={[2, 32, 32]} speed={.0005} orbit={true} />
                    
                
                    </scene>
                   
                  
                
              
                    
                   
                    
                
                    <SunBloom bloomScene={scene1} strength={str} radius={rad} threshold={thresh} />
            </group>
              
            
        )
}
export default SolarSystem;

//  <Asteroids objScale={.2} xOffset={-650} count={2000} zOffset={5000} xSpread={800} ySpread={1} yOffset={0} zSpread={500} />
//  <Planet alphaMap={sunAlpha} spin={.005}  color="#ffffea" args={[.5, 32, 32]} position={[0, 0, 0]} />

/*var ReactWithAddons = require ('react/addons');
var React = require ('react');
React.addons = ReactWithAddons.addons;*/
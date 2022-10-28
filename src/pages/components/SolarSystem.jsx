import React, { useState } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import {  useTexture } from '@react-three/drei';
import { Asteroids } from './Asteroids';
import { World } from './World';

import { useRef } from 'react';
import  SunBloom  from './effects/SunBloom';




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
                        <ambientLight intensity={.3} />
                        <Sun />
                        <World />
                        
                        <Planet offset={40} args={[1, 32, 32]} spin={.0006} map={venusText} color={"#888888"} receiveShadow orbit={true} orbitFactor={[800, 10, 100]} speed={.01} position={[0, 0, 0]} />
                            
                        <Planet offset={-100} map={marsText} spin={.005}  orbitFactor={[700, 0, 900]} args={[1, 10, 10]} speed={.01} orbit={true} />
                    
                
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
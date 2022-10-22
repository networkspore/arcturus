import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import { Planet } from '../Planet';
import { Asteroids } from '../Asteroids';
import  SolarSystem  from '../SolarSystem';


export function ZoomIn({zoomZ = 10, zoom = [0,0,10],  bloomZ = 200, initialZ = 500}) {
    let zpos = initialZ;
    let acceleration = 150;
    let started = true;
    const [clicked,setClicked] = useState(false);
    
    const {handlers} = useThree((state)=> state.events);
    

    
    
  //  state.events.
  
    useEffect(() => {
        handlers.onPointerDown = () => onClicked;
        
    });

   // const interaction = new Interaction(gl,scene,camera);

    


    const [finished, useFinished] = useState(false);


    const onClicked = (event) => {
        setClicked(prev => true);
      //  console.log("clicked")
        
    }





    useFrame(({ clock, camera }) => {
      //  if(!clicked)
      //  {
     
            if (zpos > zoom[2]) {
                zpos = initialZ - (clock.getElapsedTime() *acceleration) ;
              
            }
            
            acceleration -= .005;
            camera.position.z = zpos;
           
            

        if (camera.position.z < zoom[2])
        {
            camera.position.z = zoom[2];
        }
        if (camera.position.x != zoom[0]){
            camera.position.x = zoom[0];
        }
        if (camera.position.y !=zoom[1]){
            camera.position.y = zoom[1];
        }
       // }else{
        //    camera.position.z = zoomZ;
          //  useFinished(prevValue => true);
      //  }
    })
 
    return (
      
            <></>
        
            );
}
   
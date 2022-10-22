import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import { Planet } from '../Planet';
import { Asteroids } from '../Asteroids';
import  SolarSystem  from '../SolarSystem';


export function ZoomIn({zoomZ = 5, bloomZ = 200, initialZ = 500}) {
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
         
            if (zpos > zoomZ) {
                zpos = initialZ - (clock.getElapsedTime() *acceleration) ;
                //zpos--;
                if (zpos < bloomZ) {
                    if (started) {

                        started = false;
                       // useFinished(prevValue => true);
                        
                    }
                }

            }
            
            acceleration -= .005;
            camera.position.z = zpos;
           
            

        if (camera.position.z < zoomZ)
        {
            camera.position.z = zoomZ;
        }
        if (camera.position.x != 0){
            camera.position.x = 0;
        }
        if (camera.position.y != 0){
            camera.position.y = 0;
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
   
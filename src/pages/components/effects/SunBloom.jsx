import React, {useRef, useState, useMemo, useEffect} from 'react';

import * as THREE from 'three';



import { EffectComposer, RenderPass, UnrealBloomPass, SAOPass, SSAOPass, ShaderPass, BlendShader, BlurShaderUtils, DepthLimitedBlurShader, TriangleBlurShader, ToonShader1, HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';
import {extend, useThree, useFrame } from '@react-three/fiber';
import useForceUpdate from '../../../hooks/useForceUpdate';
import useZust from '../../../hooks/useZust';

extend({EffectComposer, RenderPass, UnrealBloomPass})


const SunBloom = ({ bloomScene, strength = 0, radius = 0, threshold = 0 }) => {
    //strength, radius, threshold 
    const { scene, gl, camera, size } = useThree()
    const blurshaderRef = useRef({ shader: null});
    //const [scene, setScene] = useState();
    const page = useZust((state) => state.page)
    
    const effect = useRef();

    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
        size
    ]);
    useEffect(()=> {
        if(bloomScene.current !== undefined){
            gl.autoClear = false;
            gl.setPixelRatio(window.devicePixelRatio);
            const renderPass = new RenderPass(bloomScene.current, camera)
            const bloomPass = new UnrealBloomPass(aspect, strength, radius, threshold);
            
            
            const shader = HorizontalBlurShader
            const shader2 = VerticalBlurShader
            
            const shaderPass = new ShaderPass(shader)
            const shaderPass2 = new ShaderPass(shader2)
            effect.current = {composer:new EffectComposer(gl)}
           // effect.current.composer.renderToScreen = true;
          //  
            effect.current.composer.setSize = (aspect.width /2, aspect.height/2 );
            effect.current.composer.addPass(renderPass);
           
           
            effect.current.composer.addPass(bloomPass);
            effect.current.composer.addPass(shaderPass);
 effect.current.composer.addPass(shaderPass2);
            
            
           
             }
    },[aspect,bloomScene])
    


  
    
    let brighter = false;

    let swing = .5;

    let swingI = .01;




    

  //  useEffect(() => void scene && composer.current.setSize(size.width / 20, size.height / 20), [size])
    useFrame(({clock}) => {
      /*  
        if(brighter){
            bloomer.current.strength += swingI;
            if(bloomer.current.strength > strength + swing){
                brighter = !brighter;
            }
        }else{
            bloomer.current.strength -= swingI;
            if (bloomer.current.strength < strength) {
                brighter = !brighter;
            }
        }
    */
        if(effect.current != undefined){
        if(effect.current.composer !== undefined){

        gl.clear();
        effect.current.composer.render(clock.getDelta())
}}      //  composer.current.render();
      gl.clearDepth();
      
        gl.render(scene,camera);
        
    }, 1)
    return (
        <>
            
          
         

        </>
    )
}
export default SunBloom;
//<scene ref={setScene1}>{children}</scene>

/*  <effectComposer setSize={} ref={composer} args={[gl]}>
                <renderPass attachArray="passes" scene={bloomScene.current} camera={camera} />
                </effectComposer>    

<renderPass attachArray="passes" scene={bloomScene.current} camera={camera} />
                <unrealBloomPass ref={bloomer} attachArray="passes" args={[aspect, strength, radius, threshold]} />
        */
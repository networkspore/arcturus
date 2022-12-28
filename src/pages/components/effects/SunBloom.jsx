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
    const loadingStatus = useZust((state) => state.loadingStatus)

    //const setPixelRatio = useThree((state) => state.setPixelRatio)
    const regress = useThree((state) => state.performance.regress)
    const current = useThree((state) => state.performance.current)
 
    const frameLimiter = useRef({ delta: 0, interval: (1 / 30)  });

    useEffect(() => {
        const isComplete = loadingStatus != null ? loadingStatus.complete && loadingStatus.index == loadingStatus.length : true

        if (loadingStatus != null && !isComplete) {
            regress()
        }
    }, [loadingStatus])


    const effect = useRef();

    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
        size
    ]);

    useEffect(()=> {
        if(bloomScene.current !== undefined){
            gl.autoClear = false;
           
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
    },[aspect,bloomScene,current])
    

  //  useEffect(() => void scene && composer.current.setSize(size.width / 20, size.height / 20), [size])
    useFrame(({clock}) => {
    

            if (effect.current != undefined && effect.current.composer !== undefined) {

                gl.clear();
                effect.current.composer.render(clock.getDelta())
           }    

          
            gl.clearDepth();

            gl.render(scene, camera);

        
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
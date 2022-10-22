import React, {useRef, useState, useMemo, useEffect} from 'react';




import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import * as THREE from 'three';
import {extend, useThree, useFrame } from '@react-three/fiber';
import useForceUpdate from '../../../hooks/useForceUpdate';
import { _fog_fragment, _fog_pars_fragment, _fog_pars_vertex, _fog_vertex } from './shaders/FogGLSL';
import { _NOISE_GLSL } from './shaders/NoiseGLSL';

extend({ EffectComposer, RenderPass, UnrealBloomPass })







export function FogEffect({}) {
    //strength, radius, threshold 
    const { scene, gl, camera, size } = useThree()
    const bloomer = useRef();
    //const [scene, setScene] = useState();
    let setOnce = true;
    useEffect(()=> {
       
     //   gl.autoClear = false;
        gl.setPixelRatio(window.devicePixelRatio);
    
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
    },[])

    const composer = useRef();
    let brighter = false;

    let swing = .5;

    let swingI = .01;


    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
        size
    ]);

    const bloomScene = scene;
    const strength = .5
    const radius = .3
    const threshold = .1

  //  useEffect(() => void scene && composer.current.setSize(size.width / 20, size.height / 20), [size])
   
    return (
        <>
            
       
         

        </>
    )
}

//<scene ref={setScene1}>{children}</scene>
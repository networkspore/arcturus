import { MapControls, OrbitControls, OrthographicCamera, PerspectiveCamera, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { BoxBufferGeometry, BoxGeometry, InstancedBufferAttribute, Matrix4 } from 'three';
import useZust from '../../hooks/useZust';
import { uniforms, vertexShader, fragmentShader } from './Shaders/MapShader';
//import { MapShader } from './Shaders/MapShader';




export function MapSelector() {
    const { scene, gl, camera, size } = useThree();
 

  //  gl.getPixelRatio = window.devicePixelRatio;
    const c = camera;
  //  const usePlanet = useRef();


    const worldMap = useTexture("Images/toril-medium.png");
    const shaderRef = useRef();
    const center = useRef();
    const [hovered, setHovered] = useState(undefined);


    let runOnce = true;
    
    const meshRef = useRef();
    const prevRef = useRef();

    const count = 200;



    useEffect(()=>{
       // gl.autoClear = true;
     //   camera.position.x = 0;
    //    camera.position.y = 0;
  //      camera.position.z = 100;
       
        if(runOnce)
        {
            runOnce = false;

            
        }
        return ()=> {
            
        }
    },[])

 
       // const time = clock.getElapsedTime();
    let i =0;

 

    const tempObject = useMemo(() => new THREE.Object3D(), []);

  //  const uvOffsets = new Float32Array (Offsets);
  //  const uUvScale = 1 / textureWidthHeight; 
    const tempVector = new THREE.Vector3(0,0,1);
  
    //tempMatrix.setUvTransform()
    const [tile, data, matrices] = useMemo(() => {
        const temp  = [];
        const colors = [];
        const m = [];

        let i = 0;
        for (let x = -100; x < 100 ; x+=10)
        {
            for (let y = -50; y < 50 ; y+=10)
            {
                
                const xPos = x;
                const yPos = y;
              
           
               
                    
                    
                colors.push(new THREE.Vector3(0, xPos, yPos));

                tempObject.position.set(xPos,yPos,0);
                tempObject.updateMatrix();
                m.push(tempObject.matrix.clone());
                
                temp.push(tempObject.clone());

              //  console.log(" x: " + xPos + " y: " + yPos + " i: " + i);
              //  console.log(offsets[i]);
                i++;
            }
        }
       
        return [temp, colors, m];
    }, [count]);

     let tempVec4 = new THREE.Vector4(0,0,0,1);
    
    const colorArray = useMemo(() => Float32Array.from(new Array(count).fill().flatMap((_, i) => data[i].toArray()   )), []);

    const matrixArray = useMemo(() => Float32Array.from(new Array(count).fill().flatMap((_, i) => matrices[i].toArray()   )), [])
    


    useEffect(() => {
        shaderRef.current.uniforms.uMap.value = worldMap;
    },[shaderRef.current]);
   
  

    const [MatrixOnce,setMatrixOnce] = useState(false);
    useFrame(() => {
        
            tile.forEach((t, i) => {
              //  let { xPos, yPos } = tile;
            //   tempObject.position.set(xPos,yPos,0);
            //   tempObject.matrixAutoUpdate =false;
                if (hovered !== undefined) {
                    (i === hovered ? new THREE.Vector3(1,data[i].y, data[i].z) :  data[i] ).toArray(colorArray, i * 3)
                    meshRef.current.geometry.attributes.color.needsUpdate = true;
                 //   setCenter(previous => new THREE.Vector3(data[i].y, data[i].z))
                }
              //  tile.position.set(tile.position.x,tile.position.y);
              
                t.updateMatrix();
                meshRef.current.setMatrixAt(i, t.matrix);
                meshRef.current.instanceMatrix.needsUpdate = true;
            })

      //  var m = new THREE.Material
   
     //   gl.clear();
     //   gl.render(scene,camera);
    })
      //   <ambientLight intensity={0.1}/>
/*
    useEffect(() => {
        prevRef.current = hovered;
        if (hovered != undefined) {
            console.log(tile[hovered].position);
        }
    }, [hovered])*/

    return(
        <>
            <ambientLight intensity={.1} />
            <pointLight position={[0,0,150]} />
          
           <group ref={center} position={[5,5,0]}>
            <instancedMesh  castShadow ref={meshRef} args={[null, null, count]} 
                onPointerMove={(e) => { setHovered(prev => e.instanceId); }}
                onPointerOut={(e) => { setHovered(prev => undefined) }} 
           
            >
                <boxGeometry args={[10, 10]} attach='geometry'>
                    <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3,false]} />
                    <instancedBufferAttribute attachObject={['attributes', 'uvMatrix']} args={[matrixArray, 16, false]} />
                </boxGeometry>
                <shaderMaterial precision='mediump' attach='material' vertexColors={true} ref={shaderRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /> 
            </instancedMesh>
            </group>
            < OrbitControls mouseButtons={{LEFT:THREE.MOUSE.PAN}} />
          
         
        </>
    )
} 
//   //   <OrbitControls enableRotate={false} maxDistance={80} minDistance={10} />
//
//   <instancedBufferAttribute attachObject={['attributes', 'uv']} args={[uvArray, 2]} />
// <shaderMaterial ref={shaderRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /> 
//<meshBasicMaterial map={worldMap} />
// 
//<MapShader />
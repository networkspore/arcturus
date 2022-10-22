import { MapControls, OrbitControls, OrthographicCamera, PerspectiveCamera, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect, useState, forwardRef } from 'react';
import * as THREE from 'three';
import { BoxBufferGeometry, BoxGeometry, InstancedBufferAttribute, Matrix4 } from 'three';
import useZust from '../../hooks/useZust';
import { uniforms, vertexShader, fragmentShader } from './Shaders/TerrainShader';
//import { MapShader } from './Shaders/MapShader';




const InstancedTerrain = (props = {}, ref) => {
    const { scene, gl, camera, size } = useThree();
 

  //  gl.getPixelRatio = window.devicePixelRatio;
    const c = camera;
  //  const usePlanet = useRef();

    const map = "map" in props ? props.map : "";
    const length = "length" in props ? props.length : 1;
    const width = "width" in props ? props.width : 1;
    const height = "height" in props ? props.height : 1;
    const scale = "scale" in props ? props.scale : 1;

    const pointerDown = "onPointerDown" in props? props.onPointerDown : (e)=>{};

    const worldMap = useTexture(map);
    const shaderRef = useRef();
    const center = useRef();
    const [hovered, setHovered] = useState(undefined);


    let runOnce = true;
    
    const meshRef = useRef();
    const prevRef = useRef();

    const count = length * width;



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

  //  const uvOffsets = new Float32Array (Offsets);
  //  const uUvScale = 1 / textureWidthHeight; 
    const tempVector = new THREE.Vector3(0,0,1);

    const tempObject = useMemo(() => new THREE.Object3D(), []);

 
  
    //tempMatrix.setUvTransform()
    const [tile, data, matrices] = useMemo(() => {
        const temp  = [];
        const colors = [];
        const m = [];

        let i = 0;
        let x = 0;
        let z = 0;
        let y = 0;

        const xStart = (width / 2) * -1;
        const yStart = (height /2) * -1;
        const zStart = (length /2) * -1;

        while(x < width){
            while(i< count && z < length){
                const xPos = xStart + (x*scale);
                const zPos = zStart + (z*scale);
                colors.push(new THREE.Vector3(0, xPos, zPos));

                tempObject.position.set(xPos, 0, zPos);
                tempObject.updateMatrix();
                m.push(tempObject.matrix.clone());
                temp.push(tempObject.clone());

                i++;
                z++;
            }
            z = 0;
            x++;
        }

        /*for (let x = -100; x < 100 ; x+=10)
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
        }*/
       
        return [temp, colors, m];
    }, [count]);

     let tempVec4 = new THREE.Vector4(0,0,0,1);
    
    const colorArray = useMemo(() => Float32Array.from(new Array(count).fill().flatMap((_, i) => data[i].toArray()   )), []);

    const matrixArray = useMemo(() => Float32Array.from(new Array(count).fill().flatMap((_, i) => matrices[i].toArray()   )), [])
    


    useEffect(() => {
        shaderRef.current.uniforms.uMap.value = worldMap;
        shaderRef.current.uniforms.uSize.value = new THREE.Vector2(width,length)
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
          
           <group ref={center} >
                <instancedMesh receiveShadow={true}  castShadow ref={meshRef} args={[null, null, count]} 
                onPointerMove={(e) => { setHovered(prev => e.instanceId); }}
                onPointerOut={(e) => { setHovered(prev => undefined) }} 
                onPointerDown={pointerDown}
            >
                <boxGeometry args={[1, 1]} attach='geometry'>
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

export default InstancedTerrain;

//   //   <OrbitControls enableRotate={false} maxDistance={80} minDistance={10} />
//
//   <instancedBufferAttribute attachObject={['attributes', 'uv']} args={[uvArray, 2]} />
// <shaderMaterial ref={shaderRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /> 
//<meshBasicMaterial map={worldMap} />
// 
//<MapShader />
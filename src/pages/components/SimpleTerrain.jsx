import { Environment, Loader, useCubeTexture, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import useZust from "../../hooks/useZust";
import produce from "immer";
import { CanvasTexture, Vector3 } from "three";
import { constants } from "../../constants/constants";


export function SimpleTerrain ({grid, regress, terrain, onLeftClick,  onRightClick, onMiddleClick, mapScale, ...props}) {
    
    const socket = useZust((state) => state.socket);

    const canvasRef = useRef(
        {
            canvas: null,
            context: null,
            terrainLayerID: null,
            currentMask: null,
            imageData: null,
            baseCanvas: null,
            baseCanvasCtx: null,
            currentLayerTile: null,
            currentLayerTileData: null,
            baseCanvasData: null
        }
    )
    const terrainRef = useRef();

    if(grid === undefined) grid = true;
//terrain.texture.url
  //  const [canvasTexture, setCanvasTexture] = useState(null); 

    const assets = useZust((state) => state.assets)

    const editCampaign = useZust((state) => state.editCampaign);
    const setEditTerrainUpdated = (value) => useZust.setState(produce((state) => {
        state.editCampaign.updated = value;
    }));

    const saveGeometry = () =>{
        
        const geometry = terrainRef.current.geometry;
        var array = [];
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            array.push(
                [
                    geometry.attributes.position.getX(i),
                    geometry.attributes.position.getY(i),
                    geometry.attributes.position.getZ(i),
                ]
            )
        }
        setGeometryBackup(array)

        const geometryString = JSON.stringify(array);
        socket.emit("getTerrainRev", terrain.terrainID, (rev)=>{
            rev++;
            sendTerrainData(geometryString, rev);
        })
          
    }

    const CHUNK_SIZE = 10000;

    const sendTerrainData = (geometryString = "",rev) =>{
        const stringLength = geometryString.length;

        function loop(i, count) {
            count = i * CHUNK_SIZE;
            if (count + CHUNK_SIZE <= stringLength) {

                
                const chunk = geometryString.substring(count, count + CHUNK_SIZE);

                socket.emit("sendTerrainData", terrain.terrainID, rev, chunk, i, false, count, (received) => {
                    if (received) {
                        i++;
                        loop(i, count)
                    } else {

                        socket.emit("clearTerrainGeometry", terrain.terrainID, rev, (cleared) => {
                            setEditTerrainUpdated(false);
                            alert("Geometry could not be saved.")
                        })
                    }
                })
            } else {
                
                const chunk = geometryString.substring(count, count + CHUNK_SIZE);

                socket.emit("sendTerrainData", terrain.terrainID,rev, chunk, i, true, count, (written) => {
                    if (written) {
                       
                       
                        setEditTerrainUpdated(false);
                        
                    } else {
                        socket.emit("clearTerrainGeometry", terrain.terrainID,rev, (cleared) => {
                            setEditTerrainUpdated(false);
                            alert("Geometry could not be saved.")
                        })
                    }
                })
            }
        }

        loop(0, 0)
    }


    const [geometryBackup, setGeometryBackup] = useState(null);

    const undoGeometry = () => {
        if(geometryBackup != null){
            const geometry = terrainRef.current.geometry;

           
                const array = geometryBackup;

                for (let i = 0; i < array.length; i++) {

                    geometry.attributes.position.setX(i, array[i][0])
                    geometry.attributes.position.setY(i, array[i][1])
                    geometry.attributes.position.setZ(i, array[i][2])

                }
                geometry.computeVertexNormals();
                geometry.attributes.position.needsUpdate = true;
          
        }
    }

    const updateGeometryBackup =() =>{
        
        const geometry = terrainRef.current.geometry;
        var array = [];
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            array.push(
                [
                    geometry.attributes.position.getX(i),
                    geometry.attributes.position.getY(i),
                    geometry.attributes.position.getZ(i),
                ]
            )
        }
        setGeometryBackup(array);
    }
    
    useEffect(()=>{
        if(editCampaign.mode == constants.SAVE_GEOMETRY){
            if(editCampaign.updated == true){
                saveGeometry();
            } 
        }else if(editCampaign.mode == constants.UNDO_GEOMETRY){
           
                undoGeometry();
                setEditTerrainUpdated(false);
            
        }else if(editCampaign.mode == constants.PAINT_TEXTURE){
            prepareCanvas();
        } else if (editCampaign.mode == constants.ALTER_GEOMETRY || editCampaign.mode == constants.SMOOTH_GEOMETRY || editCampaign.mode == constants.LEVEL_GEOMETRY){
            if(geometryBackup == null){
                updateGeometryBackup();
            }
        }
        return ()=>{
          //  setEditTerrainUpdated(false);
        }
    },[editCampaign,assets])

    useEffect(() =>{
        if (terrain.geometryUrl != null){
            if (terrain.geometryUrl.length > 10){
               updateGeometry(terrain.geometryUrl);
               
            }
        }
    },[])

    const updateGeometry =(geoUrl) =>{
        const geometry = terrainRef.current.geometry;

        fetch(geoUrl).then(response => response.text().then(text =>{
            const array = JSON.parse(text)
           
            for(let i = 0; i < array.length; i++){
                
                geometry.attributes.position.setX(i, array[i][0])
                geometry.attributes.position.setY(i, array[i][1])
                geometry.attributes.position.setZ(i, array[i][2])
                
            }
            geometry.computeVertexNormals();
            geometry.attributes.position.needsUpdate = true;
        })).catch(error =>{
            
        })
          
 
    }
        
        /*
         './resources/posx.jpg',
        './resources/negx.jpg',
        './resources/posy.jpg',
        './resources/negy.jpg',
        './resources/posz.jpg',
        './resources/negz.jpg',*/
   
    //Geometry



    const vector3 = new THREE.Vector3();
    const mouseTracker = useRef({point: new THREE.Vector3(), isDown:false});

    const onAlterGeometry = (point) => {
      
        const outer = Number(editCampaign.settings.outer) + Number(editCampaign.settings.inner);
        const inner = Number(editCampaign.settings.inner)
        const amount = Number(editCampaign.settings.value);

        const mesh = terrainRef.current;
        const geometry = terrainRef.current.geometry;
        regress()        

        for (let i = 0; i < geometry.attributes.position.count; i++) {
            vector3.setX(geometry.attributes.position.getX(i));
            vector3.setY(geometry.attributes.position.getY(i));
            vector3.setZ(geometry.attributes.position.getZ(i));

            const toWorld = mesh.localToWorld(vector3);
            const distance = point.distanceTo(toWorld);
            //(MAX_CLICK_DISTANCE = radius)
            if (distance < outer) { //MAX_CLICK_DISTANCE = Amount to add

                if (distance < inner) {
                    if (editCampaign.mode == constants.ALTER_GEOMETRY){
                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + amount)
                    }else if(editCampaign.mode == constants.LEVEL_GEOMETRY){
                       
                        geometry.attributes.position.setZ(i,  amount)
                    }else if (editCampaign.mode == constants.SMOOTH_GEOMETRY){
                       
                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + ((point.y - geometry.attributes.position.getZ(i)) * ((inner - distance) / (inner))))
                    }
                } else if (distance < outer){
                    if (editCampaign.mode == constants.ALTER_GEOMETRY){
            
                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + (amount * ((outer - distance) / (outer - inner))))
                    
                    } else if (editCampaign.mode == constants.LEVEL_GEOMETRY) {
                        //Greater than
                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + ((amount - geometry.attributes.position.getZ(i))  * ((outer - distance) / (outer - inner))))
                    }
                }
            }
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
       
    }

    const ratioW = terrain.width * (mapScale);
    const ratioH = terrain.length * (mapScale);

    function drawPixel(x, y,width, imageData, r, g, b, a) {
        var i = (x + y * width) * 4;

        imageData.data[i + 0] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
    }
    function getPixelAlpha(x,y, width, imageData){
        var i = (x + y * width) * 4;

        return imageData.data[i + 3]
    }
    function getPixel(x,y, width, imageData){
        var i = (x + y * width) * 4;

        return new THREE.Vector4(
            imageData.data[i + 0],
            imageData.data[i + 1],
            imageData.data[i + 2],
            imageData.data[i + 3]
        )
    }

    function blendRGBA(rA, gA, bA, aA, rB,gB,bB,aB){
       const rOut = (rA * aA / 255) + (rB * aB * (255 - aA) / (255 * 255))
       const gOut = (gA * aA / 255) + (gB * aB * (255 - aA) / (255 * 255))
       const bOut = (bA * aA / 255) + (bB * aB * (255 - aA) / (255 * 255))
       const aOut = aA + (aB * (255 - aA) / 255)
        
        return new THREE.Vector4(
            rOut,
            gOut,
            bOut,
            aOut
        )
    }

    const onAlterTexture = (point = new Vector3()) =>{

      
       
        const outer = Number(editCampaign.settings.outer) + Number(editCampaign.settings.inner);
        const inner = Number(editCampaign.settings.inner)
        const value = Number(editCampaign.settings.value);

        if(canvasRef.current.terrainLayerID != value){
            prepareCanvas();
        }
       // alert(ratioW +" "+ ratioH)
        
        const pointX = point.x + (ratioW / 2);
        const pointY = point.z + (ratioH / 2);

        const width = canvasRef.current.canvas.width;
        const height = canvasRef.current.canvas.height;

        const canvasX = width * (pointX / ratioW);
        const canvasY = height * (pointY / ratioH);
        
        var array = [];
        
        const canvasPoint = new THREE.Vector2(canvasX, canvasY);
        
        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                const drawPoint = new THREE.Vector2(x, y);
                const distance = canvasPoint.distanceTo(drawPoint);
                
                

                if(distance < outer)
                { 
                
                    if (distance < inner) {
                       canvasRef.current.currentMask[y][x] = 255;
                       const pixel = getPixel(x,y, width, canvasRef.current.currentLayerTileData)
                        drawPixel(x, y, width, canvasRef.current.imageData, pixel.x, pixel.y, pixel.z, pixel.w);
                    } else if (distance < outer) {
                        if (canvasRef.current.currentMask[y][x] != 255)
                        {
                        const alpha = (255 * ((outer - distance) / (outer - inner)));
                        canvasRef.current.currentMask[y][x] = alpha;
                            const pixelB = getPixel(x, y, width, canvasRef.current.imageData)
                        const pixelA = getPixel(x, y, width, canvasRef.current.currentLayerTileData)

                        const blendPixel = blendRGBA(pixelA.x, pixelA.y, pixelA.z, alpha, pixelB.x, pixelB.y, pixelB.z, pixelA.w)

                        drawPixel(x, y, width, canvasRef.current.imageData, blendPixel.x, blendPixel.y, blendPixel.z, blendPixel.w);
                        }
                      
                        
                      
                    }
                } 

            }
        }
        canvasRef.current.context.putImageData(canvasRef.current.imageData,0,0)
        

     /*   canvasRef.current.baseCanvasCtx.drawImage(
            canvasRef.current.canvas, 
            0, 
            0, 
            canvasRef.current.baseCanvas.width, 
            canvasRef.current.baseCanvas.height
        )*/


       const texture = new THREE.Texture(canvasRef.current.canvas);
       texture.needsUpdate = true;
       terrainRef.current.material.map = texture;
           }
    

    const updateTerrain = () =>{
      //  onEditGeometry(mouseTracker.current.point);
      
        if (mouseTracker.current.isDown == true && terrainRef.current != null) {
         
            setTimeout(() => {
                regress();

                if (

                    editCampaign.mode == constants.ALTER_GEOMETRY ||
                    editCampaign.mode == constants.LEVEL_GEOMETRY ||
                    editCampaign.mode == constants.SMOOTH_GEOMETRY

                ) {
                    if (terrainRef.current != null) {
                        onAlterGeometry(mouseTracker.current.point);
                    }
                    if (mouseTracker.current.isDown == true && terrainRef.current != null) updateTerrain();
                }
                if (editCampaign.mode == constants.PAINT_TEXTURE) {
                    if (canvasRef.current.canvas != null) {
                        onAlterTexture(mouseTracker.current.point);
                    }else{
                        alert("Null")
                    }
                    if (mouseTracker.current.isDown == true && canvasRef.current.canvas != null) updateTerrain();
                }


            }, (1 / 10) * 1000)
        }
    }
  const terrainMap = useTexture(terrain.texture.url);
   
  function createTextureTile(image){

   
   
      const width = ratioW * 10;
      const height = ratioH * 10;

     // alert(height /ratioH)

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d")
      var ptrn = ctx.createPattern(image, 'repeat');
      ctx.fillStyle = ptrn;

      ctx.fillRect(0, 0, canvas.width, canvas.height)
     
      return canvas;
      
      
  }
    
    useEffect(()=>{
        updateTextureMap();
    },[assets])

    const updateTextureMap = () => {  
        const baseCanvas = createTextureTile(terrainMap.image);

     //   canvasRef.current.baseCanvas = baseCanvas;
    //    canvasRef.current.baseCanvasCtx = baseCanvas.getContext("2d");
//        canvasRef.current.baseCanvasData = canvasRef.current.baseCanvasCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height)


  //  canvasRef.current.canvas = canvas;
        
       /* if (terrain.layers != null){

            for(let layer of terrain.layers){
                if(assets != null){
                  
                    if (layer.alphaUrl != null && layer.texture.url in assets){
                        

                        const tileCanvas = createTextureTile(layer.texture.url)
                        
                    }
                }
            }
        }*/

        const texture = new THREE.Texture(baseCanvas);
        terrainRef.current.material.map = texture;
        terrainRef.current.material.map.needsUpdate = true;
    }

  
    const prepareCanvas = () =>{
        if (terrain.layers.length > 0 && editCampaign.settings.value != null && editCampaign.settings.value != -1 && canvasRef.current.canvas == null)  {
            const width = ratioW * 10;
            const height = ratioH * 10;
            const terrainLayerID = Number(editCampaign.settings.value);
            // alert(height /ratioH)

            var mask = new Array(height);
            for(let y=0;y<height;y++){
                const wArray = new Array(width);
                for (let x = 0; x < width;x++){
                    wArray[x] = 0;
                }
                mask[y] = wArray;
            }

            canvasRef.current.currentMask = mask;

            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d")
            canvasRef.current.canvas = canvas;
            canvasRef.current.context = ctx;
        
            if(canvasRef.current.imageData == null){    
                const baseCanvas = createTextureTile(terrainMap.image);         
                const baseCtx = baseCanvas.getContext("2d");
                canvasRef.current.imageData = baseCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height)
            }
           
            
          //  canvasRef.current.imageData = canvasRef.current.baseCanvasData;
            
            canvasRef.current.terrainLayerID = terrainLayerID;
          
            terrain.layers.forEach((layer) => {
                if(layer.terrainLayerID == terrainLayerID){
                    const layerImageUrl = layer.texture.url;
                   
                    if (layerImageUrl in assets.images) {
                        
                        canvasRef.current.currentLayerTile = createTextureTile(
                            assets.images[
                            layerImageUrl
                            ]
                        )
                        canvasRef.current.currentLayerTileData = canvasRef.current.currentLayerTile.getContext("2d").getImageData(0, 0, width, height);
                    }
                }
            });

            

            

        } else if (canvasRef.current.terrainLayerID != Number(editCampaign.settings.value)){

        }
        
    }


    return (
        <>
        {grid &&
            <group position={[0,.01,0]}>
                    <gridHelper args={[terrain.width * (mapScale),terrain.width,"black","black"]} color1={"black"} color2={"black"} />
            </group>
        }
        <mesh userData={{main:constants.TERRAIN_MODE, sub:"", id:terrain.terrainID}}  ref={terrainRef} receiveShadow 
            onPointerMove={(e)=>{
                if(mouseTracker.current.isDown == true) mouseTracker.current.point = e.point;
               
            }}
          

            onPointerDown={(e) => {
                const x = e.point.x;
                const z = e.point.z;
               // e.index
                const y = e.eventObject.position.y;
                const inBounds = ((Math.abs(x) / mapScale) * 2 < terrain.width && (Math.abs(z) / mapScale) * 2 < terrain.length)
            
              
                if (e.nativeEvent.button == 0) {
                    //if (e.faceIndex == 4 || e.faceIndex == 5) {4
                   
                   // alert(x + " : " + z)
                    if (editCampaign != null && (editCampaign.mode == constants.ALTER_GEOMETRY ||
                        editCampaign.mode == constants.SMOOTH_GEOMETRY ||
                        editCampaign.mode == constants.LEVEL_GEOMETRY ||
                        editCampaign.mode == constants.PAINT_TEXTURE) 
                        ) {
                    
                        window.onpointerup = () => { 
                            window.onpointerup = null;
                            mouseTracker.current.isDown = false;
                            setEditTerrainUpdated(true);
                        }
                        mouseTracker.current.isDown = true;
                        mouseTracker.current.point = e.point;
                     //   onEditGeometry(e.point)
                        updateTerrain();
                    }else{
                        onLeftClick(e.point, inBounds)
                    }
                }
                if(e.nativeEvent.button == 1) {
                    if (typeof onMiddleClick === 'function')  onMiddleClick(e.point)
                }
                if (e.nativeEvent.button == 2) {
                    if(typeof onRightClick === 'function'){
                        const x = e.point.x;
                        const z = e.point.z;
                   //     alert(x + " : " + z)
                        onRightClick(e.point, inBounds);
                       
                    }
                }
            }} 
            rotation-x={ -Math.PI / 2}  position={[0,0,0]} >
                <planeBufferGeometry args={[terrain.width * (mapScale), terrain.length * (mapScale), terrain.width * (mapScale), terrain.length * (mapScale)]} />
            <meshStandardMaterial transparent={true}  color={"#555555"} attach="material" />
        </mesh>
        </>
    )
}

/*
onPointerDown={(e) => {
            onLeftClick(e.point.x, e.eventObject.position.y + terrain.height / 2, e.point.z)
        }} receiveShadow={true} castShadow position={[0, 0, 0]}
   <mesh onPointerDown={(e) => {
            onLeftClick(e.point.x, e.eventObject.position.y + terrain.height / 2, e.point.z)
        }} receiveShadow={true} castShadow position={[0, 0, 0]}>
            <boxGeometry args={[terrain.width * (mapScale * 2), terrain.height, terrain.length * (mapScale * 2)]} />
            <meshStandardMaterial color={terrain.color} attach="material"  />
        </mesh>
        */
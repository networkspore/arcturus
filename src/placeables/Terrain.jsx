import { events, useFrame, useThree } from "@react-three/fiber";
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from "react";
import { CanvasTexture, Color, MeshStandardMaterial, Texture, Vector2, Vector3, Vector4 } from "three";
import { constants } from "../constants/constants";
import useZust from "../hooks/useZust";



const Terrain = (props = {}, ref) => {
    const meshRef = useRef();
    const {camera} = useThree();
    const assets = useZust((state) => state.assets)
    const editCampaign = useZust((state) => state.editCampaign)
    const mode = useZust((state) => state.mode)
    const vec4 = useMemo(() => new Vector4(), [])
    const vec2 = useMemo(() => new Vector2(), [])
    const vec2b = useMemo(() => new Vector2(), [])
    const texture = useMemo(()=> new Texture(),[])
    const canvasRef = useRef(
        {
            canvas: null,
            context: null,
            mask: null,
            imageData: null,
            textureUrl: null,
        }
    )

    const textureRef = useRef({textureUrl:""})

    useEffect(()=>{
        
       if(textureRef.current.textureUrl != props.texture.url && props.texture.url in assets.images)
       {
            textureRef.current.textureUrl = props.texture.url;
           //const tex = new CanvasTexture(assets.images[props.texture.url]);
           texture.image = assets.images[props.texture.url];
            meshRef.current.material.map = texture;
            meshRef.current.material.map.needsUpdate = true;
           
       }
    }, [assets])

    
    
    useImperativeHandle(ref, () => ({
        mesh:meshRef,
        alterTexture:alterTexture,
        prepareCanvas:prepareCanvas
       // onPointerDown: onPointerDown,
        //    onKeyDown: onKeyDown,
        //   onKeyUp: onKeyUp
    }), [])

    
    
   useFrame(()=>{
        if(meshRef.current !=null){
            if(camera.position.distanceTo( meshRef.current.position) > 25){
                meshRef.current.visible = false;
            }else{
                if (!meshRef.current.visible){
                    meshRef.current.visible = true;
                }
            }
        }


   })
   
   

    const onPointerDown = (e) => {

        if (mode.main == constants.TERRAIN_MODE) {

            switch (e.nativeEvent.button) {
                case 0:


                    if (editCampaign.mode == constants.ALTER_GEOMETRY ||
                        editCampaign.mode == constants.SMOOTH_GEOMETRY ||
                        editCampaign.mode == constants.LEVEL_GEOMETRY ||
                        editCampaign.mode == constants.PAINT_TEXTURE){
                         //alert("down")

                        window.onpointerup = (e) => {
                            if (e.button == 0) {
                                window.onpointerup = null;
                                // mouseTracker.current.isDown = false;
                                // setMouseDown(false);
                                props.onPointerUp(e)
                               
                            }
                            //   alert("up")
                        }
                        const mode = editCampaign.mode;
                        let settings = {
                            inner: Number( editCampaign.settings.inner) *.5 ,
                            outer: (Number(editCampaign.settings.outer) + Number(editCampaign.settings.inner)) *.5,
                            value: Number( editCampaign.settings.value) *.5,
                            opacity: "opacity" in editCampaign.settings ? Number(editCampaign.settings.opacity) : null
                        }
                        
                     //   alert(e.point.x + " " + e.point.y + " " +e.point.z)
                        props.onPointerDown(e,mode,settings)
                       // mouseTracker.current.isDown = true
                        //  setMouseDown(true);
                        //   onEditGeometry(e.point)
                        // updateTerrain();
                    }
                       
                    break;
            }
        }
    }
    const onPointerMove = (e) =>{
        if (mode.main == constants.TERRAIN_MODE) {

            if (editCampaign.mode == constants.ALTER_GEOMETRY ||
                editCampaign.mode == constants.SMOOTH_GEOMETRY ||
                editCampaign.mode == constants.LEVEL_GEOMETRY ||
                editCampaign.mode == constants.PAINT_TEXTURE) {
                props.onPointerMove(e);
            }
        }
    }
    /*
    (
            canvasRef.current.canvas != null &&
            canvasRef.current.textureUrl != props.texture.url
        )*/

   
    const prepareCanvas = () =>{
        /* canvas: null,
            context: null,
            currentMask: null,
            imageData: null,
            textureUrl: null*/
        if(canvasRef.current.canvas == null ){
           canvasRef.current.textureUrl = props.texture.url;
            const oldCanvas = assets.images[props.texture.url];
            
            const width = oldCanvas.width;
            const height = oldCanvas.height;

            var canvas = document.createElement('canvas');
            var context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;
            context.drawImage(oldCanvas,0,0);
            
            canvasRef.current.canvas = canvas;
            canvasRef.current.context = context;
            canvasRef.current.imageData = context.getImageData(0, 0, width, height)
            
          //  const height = canvas.height;
          //  const width = canvas.width;

            var mask = new Array(height);
            for (let y = 0; y < height; y++) {
                const wArray = new Array(width);
                for (let x = 0; x < width; x++) {
                    wArray[x] = 0;
                }
                mask[y] = wArray;
            }
            canvasRef.current.mask = mask;

            
            
        } else if (canvasRef.current.canvas != null){
         //   const canvas = canvasRef.current.canvas;
            const width = canvasRef.current.canvas.width;
            const height = canvasRef.current.canvas.height;

            var mask = new Array(height);
            for (let y = 0; y < height; y++) {
                const wArray = new Array(width);
                for (let x = 0; x < width; x++) {
                    wArray[x] = 0;
                }
                mask[y] = wArray;
            }
            canvasRef.current.mask = mask;
        }
            
    }

    const blendVec4a = useMemo(() => new Vector4(), []);
    const blendVec4b = useMemo(() => new Vector4(), []);
    const blendVec4c = useMemo(() => new Vector4(), []);

    const alterTexture = (inner, outer, opacity, point, tileData) => {
       
        if (canvasRef.current.textureUrl == props.texture.url) {
            
      
        const pointX = (point.x - props.position.x) + (props.width / 2); 
        const pointY = (point.z - props.position.z) + (props.length / 2); 

        const width = canvasRef.current.canvas.width;
        const height = canvasRef.current.canvas.height;

        outer = (outer / props.width) * width;
        inner = (inner / props.width) * width;
       // opacity = Number(opacity);
       // const ratioW = width / props.width;
      //  const ratioH = height / props.height;

      //  const canvasX = width * (pointX / props.width); // / ratioW);
       // const canvasY = height * (pointY / props.height); /// ratioH);
       
       vec2.set( 
            width * (pointX / props.width), // canvasX, 
            height * (pointY / props.length) //canvasY
            ); //canvasPoint2
        var array = [];
     //   alert(vec2.x)
        //const canvasPoint = new THREE.Vector2(canvasX, canvasY);
  
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                vec2b.set(x, y); //drawPoint
                const distance = vec2.distanceTo(vec2b);

           //    alert(vec2.x + ":" + vec2.y + " " + vec2b.x + ":" + vec2b.y + " " + distance + " " + outer)

                if (distance < outer) {
                  //  alert(canvasRef.current.imageData.data.length + " " + tileData.data.length)
                    if (distance < inner) {
                      //  alert("drawing")
                       canvasRef.current.mask[y][x] = 255;
                        if (opacity < 1) {
                            const alpha = 255 * opacity;
                            // canvasRef.current.mask[y][x] = alpha;
                            const pixelB = _getPixel(x, y, width, canvasRef.current.imageData, blendVec4b)
                            const pixelA = _getPixel(x, y, width, tileData, blendVec4a)

                            const blendPixel = _blendRGBA(pixelA.x, pixelA.y, pixelA.z, alpha, pixelB.x, pixelB.y, pixelB.z, pixelA.w, blendVec4c)

                            _drawPixel(x, y, width, canvasRef.current.imageData, blendPixel.x, blendPixel.y, blendPixel.z, blendPixel.w);

                        }else{
                            const pixel = _getPixel(x, y, width, tileData, vec4);
                      //  alert(pixel.x)
                            _drawPixel(x, y, width, canvasRef.current.imageData, pixel.x, pixel.y, pixel.z, pixel.w);
                        }
                    } else {
                        //if (canvasRef.current.mask[y][x] != 255) {
                            
                            const alpha = (255 * ((outer - distance) / (outer - inner))) * opacity;
                           // canvasRef.current.mask[y][x] = alpha;
                            const pixelB = _getPixel(x, y, width, canvasRef.current.imageData, blendVec4b)
                            const pixelA = _getPixel(x, y, width, tileData, blendVec4a)

                            const blendPixel = _blendRGBA(pixelA.x, pixelA.y, pixelA.z, alpha, pixelB.x, pixelB.y, pixelB.z, pixelA.w, blendVec4c)

                            _drawPixel(x, y, width, canvasRef.current.imageData, blendPixel.x, blendPixel.y, blendPixel.z, blendPixel.w);
                      //  }



                    }
                }

            }
        }
        canvasRef.current.context.putImageData(canvasRef.current.imageData, 0, 0)

       

       // const texture = new THREE.Texture(canvasRef.current.canvas);
        texture.image = canvasRef.current.canvas;

        //texture.needsUpdate = true;
        //terrainRef.current.material.map = texture;
        //    meshRef.current.material.map = texture;
       //     meshRef.current.material.color = new Color("red");
            meshRef.current.material.map.needsUpdate = true;
       }
    }

    function _drawPixel(x, y, width, imageData, r, g, b, a) {
        var i = (x + y * width) * 4;

        imageData.data[i + 0] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
    }


    
    function _blendRGBA(rA, gA, bA, aA, rB, gB, bB, aB,blendVec4) {
        const rOut = (rA * aA / 255) + (rB * aB * (255 - aA) / (255 * 255))
        const gOut = (gA * aA / 255) + (gB * aB * (255 - aA) / (255 * 255))
        const bOut = (bA * aA / 255) + (bB * aB * (255 - aA) / (255 * 255))
        const aOut = aA + (aB * (255 - aA) / 255)
        blendVec4.set(
            rOut,
            gOut,
            bOut,
            aOut
        )
        return blendVec4;
    }
    
    function _getPixel(x, y, width, imageData, pixelVec4) {
        var i = (x + y * width) * 4;

        pixelVec4.set(
            imageData.data[i + 0],
            imageData.data[i + 1],
            imageData.data[i + 2],
            imageData.data[i + 3]
        )
        return pixelVec4;
    }

    return (
        <mesh 
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
            ref={meshRef}
            receiveShadow={true}
            userData={{ 
                main:constants.TERRAIN_MODE, 
                sub: "", 
                id: props.terrainID 
            }}
            rotation-x={-Math.PI / 2}
            position={props.position}
            
        >
            <planeBufferGeometry args={[props.width, props.length, props.width * 5, props.length * 5]}/>
            <meshStandardMaterial attach="material" color={0xe0e0e0} />
        </mesh>
    )
}

export default forwardRef( Terrain);

/*
     
                   castShadow receiveShadow
            
      
*/
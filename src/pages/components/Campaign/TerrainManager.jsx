
import React, { useImperativeHandle, forwardRef, useEffect, useRef, useMemo, useState } from "react";
import { useFrame, useThree } from '@react-three/fiber'; 
import useZust from "../../../hooks/useZust";
import produce from "immer";
import Terrain from "../../../placeables/Terrain";
import useDynamicRefs from 'use-dynamic-refs';
import { ImageBitmapLoader, Vector3, Vector4 } from "three";
import { constants } from "../../../constants/constants";
import { flushSync } from "react-dom";

const TerrainManager = (props = {}, ref) => {
    const campaignScene = useZust((state) => state.campaignScene);
    const editCampaign = useZust((state) => state.editCampaign)
    const mode = useZust((state) => state.mode)
    const setEditTerrainUpdated = (value) => useZust.setState(produce((state) => {
        state.editCampaign.updated = value;
    }));
    const socket = useZust((state) => state.socket)
    const [getRef, setRef] = useDynamicRefs();
    const tracker = useRef({ point: new Vector3(), isDown: false, mode: "", settings: { inner: 1, outer: 1, value: 1, opacity:1 }, frameRate: 1 / 13 });
  //  const [mouseDown, setMouseDown] = useState(false);
    //const terrainRef = useRef({terrain:[]});
    
    //const { gl, camera, size, scene } = useThree();
    const showLoadingScreen = useZust((state) => state.showLoadingScreen)
    const setShowLoadingScreen = (show = true) => useZust.setState(produce((state) => {
        state.showLoadingScreen = show;
    }))
    
    const textureLoader = new ImageBitmapLoader();

    const assets = useZust((state) => state.assets);

    const [terrainArray, setTerrainArray] = useState({ terrain: [], textures: {} })

    const addTexture = (url, texture) => useZust.setState(produce((state) => {

        state.assets.images[url] = texture;

    }))
    const updateTextures = (texturesObj) => useZust.setState(produce((state) => {

        for (let url in texturesObj) {

            state.assets.images[url] = texturesObj[url]

        }
        state.showLoadingScreen = false;
    }));

    const terrainList = useZust((state) => state.terrainList)

    const setTerrainList = (array) => useZust.setState(produce((state) => {
        state.terrainList = array;
    }))
  // useEffect(()=>{},[])
/*
    const loadTexture = (url) => {


        if (!(url in assets.images)) {


            textureLoader.loadAsync(url).then((tex) => {
                
                _createTextureTile(tex, (tile)=>{
                    addTexture(url, tile)
                })
            })
        }

    }*/
    const tempVector3 = useMemo(() => new Vector3(), [])
    

    useEffect(() => {
        if (campaignScene != null) {
            const sceneID = campaignScene.sceneID;
           
            socket.emit("getSceneTerrain", sceneID, (terrainArray)=>{
               // let array = [];
                let textures = {};
                for(let i =0 ; i < terrainArray.length ; i++){
                    if (!(terrainArray[i].texture.url in textures) &&
                        !(terrainArray[i].texture.url in assets.images)
                    ){
                        textures[terrainArray[i].texture.url] = terrainArray[i].texture.url;
                    }
                    if (terrainArray[i].layers != null){
                        for (j = 0; j < terrainArray[i].layers.length ; j++){
                            if (!(terrainArray[i].layers[j].texture.url in textures) &&
                                !(terrainArray[i].texture.url in assets.images)){
                                textures[terrainArray[i].layers[j].texture.url] = terrainArray[i].layers[j].texture.url;
                            }
                        }
                    }
                    const terrainPosition = terrainArray[i].position;
                    delete terrainArray[i]["position"];
                    terrainArray[i].position = new Vector3(terrainPosition.x, terrainPosition.y, terrainPosition.z)
                    
                }
                let texArray = [];
                for(let url in textures){
                    texArray.push(url);
                }
                
                setTerrainArray({terrain:terrainArray, textures:textures})
                loadTerrainTextures(texArray);
                /*for(let textureUrl in textures){
                    loadTexture(textureUrl)
                }*/
             //  setTerrainList(array)
            
            })
/*
            loadBaseTexture(campaignScene.terrain.texture.url)

            if (campaignScene.terrain.layers != null) {

                loadTerrainTextures(campaignScene.terrain.layers);

            }
            */
        }
    }, [campaignScene])
    
    const drawRef = useRef(
        {
            textureUrl: "empty",
            textureCanvas: null,
            textureCtx: null,
            textureData: null,
        }
    )

    const terrainSet = useRef({set:false})
    
    useEffect(()=>{
        if(terrainArray.terrain.length > 0 && terrainSet.current.set == false){
            let loaded = true;
            for(let url in terrainArray.textures){
                if(!(url in assets.images)){
                    loaded = false
                    break;
                }
            }
            if(loaded){
               
                terrainSet.current.set = true;
                let array = [];
                for (let i = 0; i < terrainArray.terrain.length ; i++){
                    array.push(
                        <Terrain
                            terrainID={terrainArray.terrain[i].terrainID}
                            position={terrainArray.terrain[i].position}
                            width={terrainArray.terrain[i].width}
                            length={terrainArray.terrain[i].length}
                            color={terrainArray.terrain[i].length}
                            texture={terrainArray.terrain[i].texture}
                            layers={terrainArray.terrain[i].layers}
                            onPointerUp={onPointerUp}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                         
                            ref={setRef(String(terrainArray.terrain[i].terrainID))}
                          

                        />
                    )
                }
                flushSync(() => {
                setTerrainList(array)
                })
             
            }
        }

        if(drawRef.current.textureUrl in assets.images && drawRef.current.textureCanvas == null){
            prepareCanvas();
        }
       // setShowLoadingScreen(false)
    },[assets])

    useEffect(() => {
        if (editCampaign.mode == constants.PAINT_TEXTURE) {
            if (editCampaign.settings.value != null) {
                if (drawRef.current.textureUrl != editCampaign.settings.value.imageUrl)
                {
                    
                //    setShowLoadingScreen(true)    
                    for (let i = 0; i < terrainArray.terrain.length; i++) {
                        const id = terrainArray.terrain[i].terrainID;

                        const ref = getRef(String(id)).current;

                        ref.prepareCanvas();
                    }
                    //  props.onPrepareCanvas(editCampaign.settings.value);
                    
                    onPrepareCanvas(editCampaign.settings.value);
                }
            }
        }
    }, [editCampaign])

    //  
    const loadTerrainTextures = (textureUrls) => {

        let texturesObj = {};

       

        function loopTextures(i) {

            if (i < textureUrls.length) {
                var textureUrl = textureUrls[i];
               
                if (textureUrl != null && textureUrl != "" && !(textureUrl in assets.images) && !(textureUrl in texturesObj)) {

                    textureLoader.load(textureUrl, (image) => {
                       
                     //   _createTextureTile(tex,(tile)=>{
                        var canvas = document.createElement('canvas'),
                            ctx = canvas.getContext("2d");

                        canvas.width = image.width;
                        canvas.height = image.height;
                        ctx.drawImage(image, 0, 0)
                            
                            texturesObj[textureUrl] = canvas;
                     //   })
                       

                        i++;
                        loopTextures(i);
                    })
                } else {
                    i++;
                    loopTextures(i);
                }
            } else {
                updateTextures(texturesObj);
              //  loadTerrainAlphas(layers, texturesObj)
            }
        }

        loopTextures(0);
    }
    /*
 
    
    
    const updateTextures = (texturesObj, alphasObj) => useZust.setState(produce((state) => {

        for (let url in texturesObj) {

            state.assets.images[url] = texturesObj[url]

        }

        for (let url in alphasObj) {
            state.assets.alphas[url] = alphasObj[url]
        }

    }));
   
    const loadTerrainAlphas = (layers, texturesObj) => {

        let alphasObj = {};
        let textureLoader = new THREE.ImageBitmapLoader();


        function loopTextures(i) {

            if (i < layers.length) {
                var alphaUrl = layers[i].alphaUrl;
                if (!(alphaUrl in assets.alphas) && alphaUrl != null && alphaUrl != "") {

                    textureLoader.load(alphaUrl, (tex) => {
                        alphasObj[alphaUrl] = tex;
                        i++;
                        loopTextures(i);
                    })
                } else {
                    i++;
                    loopTextures(i);
                }
            } else {

                updateTextures(texturesObj, alphasObj)

            }
        }
        loopTextures(0);
    }

*/
    
    function getTerrainIDsFromPoint(){
        let ids = [];

        const effect = tracker.current.settings.outer;
        
      //  const totalDistance = effect + maxSize;

        for(let i = 0 ; i < terrainArray.terrain.length ; i++){
            if(tracker.current.point.distanceTo(terrainArray.terrain[i].position) - 7.5 < effect){
                ids.push(
                    terrainArray.terrain[i].terrainID
                )
            }
        }
      
        return ids;
    }
    const updateTerrain = () =>{
        
        if (tracker.current.isDown == true)
        {
          
            setTimeout(()=>{
                if (

                    tracker.current.mode == constants.ALTER_GEOMETRY ||
                    tracker.current.mode == constants.LEVEL_GEOMETRY ||
                    tracker.current.mode == constants.SMOOTH_GEOMETRY

                ) {
                  
                    const IDs = getTerrainIDsFromPoint()
                    //IDs[i]
                    for(let i = 0 ; i < IDs.length ; i ++){
                    
                    onAlterGeometry(tracker.current.point,IDs[i]);//terrainArray.terrain[i].terrainID
                    
                    }
                    if (tracker.current.isDown == true)
                    {
                        updateTerrain();
                    }
                } else if (tracker.current.mode == constants.PAINT_TEXTURE){
                   
                    if (drawRef.current.textureData != null){
                        const IDs = getTerrainIDsFromPoint()
                         
                        for (let i = 0; i < IDs.length; i++) {
                            onAlterTexture(tracker.current.point, IDs[i]);
                        }

                        if (tracker.current.isDown == true) {
                            updateTerrain();
                        }
                    }
                }
            }, ((1 / 15) * 1000))
        }
    }
    
   


    const onPrepareCanvas = (value) =>{
    
        if (drawRef.current.textureUrl != value.imageUrl){
                 
            drawRef.current.textureUrl = value.imageUrl;
            drawRef.current.textureCanvas = null;
            drawRef.current.textureData = null;
            drawRef.current.textureCtx = null;
            
            if(value.imageUrl in assets.images)
            {
                
                prepareCanvas();
            }else{
                loadTerrainTextures([value.imageUrl]);
            }
        }
    }

    const prepareCanvas = ()=>{
       
        const canvas =  assets.images[drawRef.current.textureUrl];
        const context = canvas.getContext("2d");
        
        drawRef.current.textureData = context.getImageData(0,0,canvas.width, canvas.height) 
      
        drawRef.current.textureCanvas = canvas;
        drawRef.current.textureCtx = context;
        
      
    }

    const onPointerDown = (e, mode, settings)=>{
        tracker.current.point = e.point;
        tracker.current.isDown = true;
        tracker.current.mode = mode;
        tracker.current.settings = settings;
       
        
       /* if (mode ==  constants.ALTER_GEOMETRY ||
            mode == constants.LEVEL_GEOMETRY
        ){
                tracker.current.frameRate = (1/15);
        }else if(mode == constants.SMOOTH_GEOMETRY){
            tracker.current.frameRate = (1 / 8);
        }else if( mode == constants.PAINT_TEXTURE){
            tracker.current.frameRate = (1 / 15);
            
        }else{
            tracker.current.frameRate = (1 / 15);
        }*/
      //  alert(tracker.current.point)
       updateTerrain();
        
       // if (drawRef.current.textureUrl == settings.value.imageUrl){
            
      //  }
    }

    const onPointerUp = (e) =>{
        tracker.current.isDown = false;
        tracker.current.mode = "";
        /*setEditTerrainUpdated(true);
        tracker.current.isDown = false;
        */
    }

    const onPointerMove = (e)=> {
      
        if (tracker.current.isDown == true){ 
            props.
            regress();
            tracker.current.point = e.point
           // alert(e.point.x + " "  + e.point.y + e.point.z)
          //  tracker.current.isDown = false;
        }
    }

    const onAlterTexture = (point, id) =>{
        const ref = getRef(String(id)).current;

        ref.alterTexture(
            tracker.current.settings.inner,
            tracker.current.settings.outer,
            tracker.current.settings.opacity,
            point,
            drawRef.current.textureData
        )
    }
 
    const onAlterGeometry = (point, id) => {

        const outer =tracker.current.settings.outer;
        const inner = tracker.current.settings.inner;
        const amount = tracker.current.settings.value;
        const ref = getRef(String(id)).current;
        const mesh = ref.mesh.current;
        const geometry = mesh.geometry;

        //regress()
        
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            tempVector3.setX(geometry.attributes.position.getX(i));
            tempVector3.setY(geometry.attributes.position.getY(i));
            tempVector3.setZ(geometry.attributes.position.getZ(i));

            const toWorld = mesh.localToWorld(tempVector3);
            const distance = point.distanceTo(toWorld);
            //(MAX_CLICK_DISTANCE = radius)
            if (distance < outer) { //MAX_CLICK_DISTANCE = Amount to add

                if (distance < inner) {
                    if (tracker.current.mode == constants.ALTER_GEOMETRY) {
                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + amount)
                    } else if (tracker.current.mode == constants.LEVEL_GEOMETRY) {

                        geometry.attributes.position.setZ(i, amount)
                    } else if (tracker.current.mode == constants.SMOOTH_GEOMETRY) {

                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + ((point.y - geometry.attributes.position.getZ(i)) * ((inner - distance) / (inner))))
                    }
                } else if (distance < outer) {
                    if (tracker.current.mode == constants.ALTER_GEOMETRY) {

                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + (amount * ((outer - distance) / (outer - inner))))

                    } else if (tracker.current.mode == constants.LEVEL_GEOMETRY) {
                        //Greater than
                        geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + ((amount - geometry.attributes.position.getZ(i)) * ((outer - distance) / (outer - inner))))
                    }
                }
            }
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;

    }


    const _createTextureTile = (image, callback) => {


        const imgScale = 8

        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        canvas.width = image.width ;
        canvas.height = image.height ;
        ctx.drawImage(image, 0, 0)
        const size = { width: 2048, height: 2048 }

        

        //_downScaleCanvas
        _repeatImage(canvas, size, (repeated) => {
        _resample(repeated, (1 / imgScale), (scaledImage) => {
            
                callback(scaledImage);
            })
        })

    }

    const _repeatImage = (image, size, callback) => {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        canvas.width = size.width;
        canvas.height = size.height;
       
        for (let w = 0; w < canvas.width; w += image.width) {
            for (let h = 0; h < canvas.height; h += image.height) {
                ctx.drawImage(image, w, h);
            }
        }
        /*
        var ptrn = ctx.createPattern(image, 'repeat');
        ctx.fillStyle = ptrn;

        ctx.fillRect(0, 0, canvas.width, canvas.height)
         */
        callback(canvas)
    }


    const _downScaleCanvas = (cv, scale, callback) => {
        if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
        var sqScale = scale * scale; // square scale = area of source pixel within target
        var sw = cv.width; // source image width
        var sh = cv.height; // source image height
        var tw = Math.floor(sw * scale); // target image width
        var th = Math.floor(sh * scale); // target image height
        var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
        var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
        var tX = 0, tY = 0; // rounded tx, ty
        var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
        // weight is weight of current source point within target.
        // next weight is weight of current source point within next target's point.
        var crossX = false; // does scaled px cross its current px right border ?
        var crossY = false; // does scaled px cross its current px bottom border ?
        var sBuffer = cv.getContext('2d').
            getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
        var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
        var sR = 0, sG = 0, sB = 0; // source's current point r,g,b
        /* untested !
        var sA = 0;  //source alpha  */

        for (sy = 0; sy < sh; sy++) {
            ty = sy * scale; // y src position within target
            tY = 0 | ty;     // rounded : target pixel's y
            yIndex = 3 * tY * tw;  // line index within target array
            crossY = (tY != (0 | ty + scale));
            if (crossY) { // if pixel is crossing botton target pixel
                wy = (tY + 1 - ty); // weight of point within target pixel
                nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
            }
            for (sx = 0; sx < sw; sx++, sIndex += 4) {
                tx = sx * scale; // x src position within target
                tX = 0 | tx;    // rounded : target pixel's x
                tIndex = yIndex + tX * 3; // target pixel index within target array
                crossX = (tX != (0 | tx + scale));
                if (crossX) { // if pixel is crossing target pixel's right
                    wx = (tX + 1 - tx); // weight of point within target pixel
                    nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
                }
                sR = sBuffer[sIndex];   // retrieving r,g,b for curr src px.
                sG = sBuffer[sIndex + 1];
                sB = sBuffer[sIndex + 2];

                /* !! untested : handling alpha !!
                   sA = sBuffer[sIndex + 3];
                   if (!sA) continue;
                   if (sA != 0xFF) {
                       sR = (sR * sA) >> 8;  // or use /256 instead ??
                       sG = (sG * sA) >> 8;
                       sB = (sB * sA) >> 8;
                   }
                */
                if (!crossX && !crossY) { // pixel does not cross
                    // just add components weighted by squared scale.
                    tBuffer[tIndex] += sR * sqScale;
                    tBuffer[tIndex + 1] += sG * sqScale;
                    tBuffer[tIndex + 2] += sB * sqScale;
                } else if (crossX && !crossY) { // cross on X only
                    w = wx * scale;
                    // add weighted component for current px
                    tBuffer[tIndex] += sR * w;
                    tBuffer[tIndex + 1] += sG * w;
                    tBuffer[tIndex + 2] += sB * w;
                    // add weighted component for next (tX+1) px                
                    nw = nwx * scale
                    tBuffer[tIndex + 3] += sR * nw;
                    tBuffer[tIndex + 4] += sG * nw;
                    tBuffer[tIndex + 5] += sB * nw;
                } else if (crossY && !crossX) { // cross on Y only
                    w = wy * scale;
                    // add weighted component for current px
                    tBuffer[tIndex] += sR * w;
                    tBuffer[tIndex + 1] += sG * w;
                    tBuffer[tIndex + 2] += sB * w;
                    // add weighted component for next (tY+1) px                
                    nw = nwy * scale
                    tBuffer[tIndex + 3 * tw] += sR * nw;
                    tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                    tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                } else { // crosses both x and y : four target points involved
                    // add weighted component for current px
                    w = wx * wy;
                    tBuffer[tIndex] += sR * w;
                    tBuffer[tIndex + 1] += sG * w;
                    tBuffer[tIndex + 2] += sB * w;
                    // for tX + 1; tY px
                    nw = nwx * wy;
                    tBuffer[tIndex + 3] += sR * nw;
                    tBuffer[tIndex + 4] += sG * nw;
                    tBuffer[tIndex + 5] += sB * nw;
                    // for tX ; tY + 1 px
                    nw = wx * nwy;
                    tBuffer[tIndex + 3 * tw] += sR * nw;
                    tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                    tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                    // for tX + 1 ; tY +1 px
                    nw = nwx * nwy;
                    tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                    tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                    tBuffer[tIndex + 3 * tw + 5] += sB * nw;
                }
            } // end for sx 
        } // end for sy

        // create result canvas
        var resCV = document.createElement('canvas');
        resCV.width = tw;
        resCV.height = th;
        var resCtx = resCV.getContext('2d');
        var imgRes = resCtx.getImageData(0, 0, tw, th);
        var tByteBuffer = imgRes.data;
        // convert float32 array into a UInt8Clamped Array
        var pxIndex = 0; //  
        for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
            tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
            tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
            tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
            tByteBuffer[tIndex + 3] = 255;
        }
        // writing result to canvas.
        resCtx.putImageData(imgRes, 0, 0);
        callback(resCV)
    }
    const _resample = (canvas, scale, callback) => {
        
            var width_source = canvas.width;
            var height_source = canvas.height;

            var width = Math.round(width_source * scale);
            var height = Math.round(height_source * scale);

            var ratio_w = width_source / width;
            var ratio_h = height_source / height;
            var ratio_w_half = Math.ceil(ratio_w / 2);
            var ratio_h_half = Math.ceil(ratio_h / 2);

            var ctx = canvas.getContext("2d");
            var img = ctx.getImageData(0, 0, width_source, height_source);
            var img2 = ctx.createImageData(width, height);
            var data = img.data;
            var data2 = img2.data;

            for (var j = 0; j < height; j++) {
                for (var i = 0; i < width; i++) {
                    var x2 = (i + j * width) * 4;
                    var weight = 0;
                    var weights = 0;
                    var weights_alpha = 0;
                    var gx_r = 0;
                    var gx_g = 0;
                    var gx_b = 0;
                    var gx_a = 0;
                    var center_y = (j + 0.5) * ratio_h;
                    var yy_start = Math.floor(j * ratio_h);
                    var yy_stop = Math.ceil((j + 1) * ratio_h);
                    for (var yy = yy_start; yy < yy_stop; yy++) {
                        var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                        var center_x = (i + 0.5) * ratio_w;
                        var w0 = dy * dy; //pre-calc part of w
                        var xx_start = Math.floor(i * ratio_w);
                        var xx_stop = Math.ceil((i + 1) * ratio_w);
                        for (var xx = xx_start; xx < xx_stop; xx++) {
                            var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                            var w = Math.sqrt(w0 + dx * dx);
                            if (w >= 1) {
                                //pixel too far
                                continue;
                            }
                            //hermite filter
                            weight = 2 * w * w * w - 3 * w * w + 1;
                            var pos_x = 4 * (xx + yy * width_source);
                            //alpha
                            gx_a += weight * data[pos_x + 3];
                            weights_alpha += weight;
                            //colors
                            if (data[pos_x + 3] < 255)
                                weight = weight * data[pos_x + 3] / 250;
                            gx_r += weight * data[pos_x];
                            gx_g += weight * data[pos_x + 1];
                            gx_b += weight * data[pos_x + 2];
                            weights += weight;
                        }
                    }
                    data2[x2] = gx_r / weights;
                    data2[x2 + 1] = gx_g / weights;
                    data2[x2 + 2] = gx_b / weights;
                    data2[x2 + 3] = gx_a / weights_alpha;
                }
            }
            //clear and resize canvas
            
            canvas.width = width;
            canvas.height = height;
           
            //draw
            ctx.putImageData(img2, 0, 0);

            callback(canvas)
    }

    return (
        <>
        {terrainList}
       </>
    )
}

export default forwardRef(TerrainManager)
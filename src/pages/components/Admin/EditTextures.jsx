import React, { useState, useRef, useEffect } from 'react';
import useZust from '../../../hooks/useZust';
import styles from '../../css/campaign.module.css'
import produce from 'immer';
import  SelectBox  from '../UI/SelectBox';

import loadingStyles from '../../css/loading.module.css';
import { flushSync } from 'react-dom';


const EditTextures = ({...props}) => {

    const socket = useZust((state) => state.socket)
    const pageSize = useZust((state) => state.pageSize)
    const setPage = useZust((state) => state.setPage)

    const reader = new FileReader();
    const imgArrayReader = new FileReader();

    const showLoadingScreen = useZust((state) => state.showLoadingScreen)

    const [textureName, setTextureName] = useState("")

    const [textureUrl, setTextureURL] = useState("Images/texture/")


    const setShowLoadingScreen = (show = true) => useZust.setState(produce((state) => {
        state.showLoadingScreen = show;
    }))

    const [imgFile, setImgFile] = useState(null)
    const [imgArrayFile, setImgArrayFile] = useState(null);


    const [imageSelected, setImageSelected] = useState(false); 
    const [tileData, setTileData] = useState(null)


    const [textures, setTextures] = useState ([])
    
    const updateTexture = (texture, i) =>{
        setTextures(
            produce((state)=>{
                state[i] = texture;
            })
        )
    }
    const addTexture = (texture) => {
        setTextures(
            produce((state)=>{
                state.push(
                    texture
                )
            })
        )
    }
    
    const [textureList, setTextureList] = useState(null);
    const [currentTexture, setCurrentTexture] = useState(-1)
    const [showEffectEditor, setShowEffectEditor] = useState(false)

    const [typeList, setTypeList] = useState(null);
    const [add, setAdd] = useState(false);
    const [update, setUpdate] = useState(false);

    const [previewImage, setPreviewImage] = useState(null)

    const textureNameRef = useRef();
    const typeRef = useRef();
 
    const tileWidth = useRef();
    const tileHeight = useRef();
    const tileGamma = useRef();
    const tileRatio = useRef();

    const newTypeNameRef = useRef();
    
    useEffect(()=>{
        setPage(13);
        
        socket.emit("editTextures", (textures,types) => {
            var array = [];
            types.forEach(element => {
                array.push(
                    {value:element.textureTypeID, label:element.name, path:element.path}
                )
            });

            setTypeList(array);


            setTextures(textures);
        })
        
        return () => {
            setCurrentTexture(-1);
            setTextures([]);
           
        }
    },[])

    const addToTypeOptions = (option) =>{
        setTypeList(produce((state)=>{
            state.push(option)
        }))
        setAddNewType(false);
    }
        

    useEffect(() => {
        if(textures != null){
            let array = [];
            textures.forEach((element,i) => {
                array.push(
                    <div id={element.textureID} style={{width:"100%"}} onClick={(e)=>{
                        setCurrentTexture(element.textureID)
                    }}>
                        <div id={element.textureID} style={{ display: "flex", }} className={currentTexture == element.texureID ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{element.name}</div>
                        </div>
                    </div>
                )
            });
            setTextureList(array);
            if (currentTexture > -1) {

                textures.forEach(texture => {
                    if(texture.textureID == currentTexture){

                        setPreviewImage(null)
                        textureNameRef.current.value = texture.name;

                        typeRef.current.setValue(texture.textureType.textureTypeID);
                        setImageSelected(true)
                        setImgFile(texture.originalUrl)
                        setTextureName(texture.originalUrl)

                        
                    }
                });


       


            } else {
            
                textureNameRef.current.value = "";
                typeRef.current.setValue(-1);
              
                setShowEffectEditor(false)
                

                setTextureName("")
                setImageSelected(false);
                setImgArrayFile(null);
                setImgFile(null);
             
                setPreviewImage(null)
                setAdd(false);
                setUpdate(false);
            }
        }
    },[textures,currentTexture])
     

    const cancelInsert = (textureID) =>{
        const directory = typeRef.current.selectedOption.path;
        
        socket.emit("deleteTexture", 
            textureID, 
            true, 
            textureUrl + directory + textureID + "_" + textureName
        )
        setShowLoadingScreen(false);
     
        alert("Upload of texture failed. Rolled back.")
        

    }   

    const finishInsert = (textureID) =>{
        
            const directory = typeRef.current.selectedOption.path;
            const texture ={
                textureID: textureID,
                name: textureNameRef.current.value,
                originalUrl: textureUrl + directory + textureID + "_" + textureName,
                url: textureUrl + directory + textureID + "_" + textureName,
                textureType: {
                    textureTypeID: typeRef.current.getValue
                }
            }
            socket.emit("updateTextureURL", texture, (updated) =>{
                
                setShowLoadingScreen(false);
                addTexture(texture);
              
            })
        
    }
   
    const chunkSize = 10000;

    

    const onSubmit = (e) =>{
        e.preventDefault();

       // if(!sending){
           
        
            
            /*
            if(addNewType){
                const typeName = newTypeNameRef.current.value;
                const typePath = newTypePathRef.current.value;
                if(typeName.length > 2){
                    socket.emit("addTextureType", typeName, path, (addedID)=>{
                        addToTypeOptions(
                            {value:addedID, label:typeName, path: path}
                        )
                        typeRef.current.setValue(addedID);
                    })
                }else{
                    alert("Type must be more than 2 characters long.")
                }
            }else{*/


        const name = textureNameRef.current.value;
        const typeID = typeRef.current.getValue;

            if (typeRef.current.selectedOption == null){
                alert("select texture type")
            }else{
            

           
            let texture;
          
                if ( name.length > 2){
                    if (typeID > -1){
                    
                            
                                if(add){
                                    if(imageSelected){
                                       texture = {
                                            textureID: null,
                                            name: name,
                                            url: null,
                                            textureType: {
                                                textureTypeID: typeID
                                            }
                                        }
                                        
                                  

                                    socket.emit("addTexture", texture, (textureAutoID) => {
                                        if (textureAutoID > 0) {
                                           
                                            let image =
                                            {
                                                id: textureAutoID,
                                                name: textureAutoID + "_" + textureName,
                                                directory: typeRef.current.selectedOption.path,
                                                imgData: imgArrayFile,
                                            }

                                           
                                            setShowLoadingScreen(true)

                                           

                                            function loop(i, count) {
                                                const imgLength = image.imgData.length;
                                                if (count < imgLength) {

                                                    count = i * chunkSize;
                                                    const chunk = image.imgData.slice(count, count + chunkSize);

                                                    socket.emit("sendTextureData", image.name, image.directory, chunk, i, false, count, (received) => {
                                                        if (received) {
                                                            i++;
                                                            loop(i, count)
                                                        } else {

                                                         
                                                            cancelInsert(image.id);
                                                        }
                                                    })
                                                } else {
                                                    socket.emit("sendTextureData", image.name, image.directory, new Uint8Array(), i, true, count, (written) => {
                                                        if (written) {
                                                           // uploadIndex++;
                                                            
                                                             finishInsert(image.id);

                                                        } else {
                                                            
                                                            cancelInsert(image.id);
                                                        }
                                                    })
                                                }
                                            }

                                            loop(0, 0)
                                       
                                          //  addTexture(texture)
                                          //  
                                        } else {
                                            alert("could not insert texture.")
                                        }
                                    })
                                    }else{
                                        alert("Choose an image for the texture.")
                                    }

                                }else if(update){
                                    
                                    socket.emit("updateTexture", texture,   (updated) =>{
                                        if(update){
                                            updateTexture(currentTexture, texture );
                                            setCurrentTexture(-1);
                                        }
                                    })
                                }else{
                                    alert("Select a commit option.")
                                }
                                
                          
                        } else {
                            alert("Select a texture type.")
                        }
                }else{
                    alert("Enter a name.")
                }
                
            
            }
        //    }
            /*
        }else{
            alert("uploading texture...")
        }*/
       
    }

    const [addNewType, setAddNewType] = useState(false);
    
    const calculate = () =>{
        if (materialRef.current.getValue > -1 && sizeRef.current.getValue > -1 && integrityRef.current.getValue > -1)
        {
            const currentMaterial = materialRef.current.selectedOption;
            const currentSize = sizeRef.current.selectedOption;
            const currentIntegrity = integrityRef.current.selectedOption;

            const hpMin = currentIntegrity.multiplier * currentSize.HPModifier;
            const hpMax = currentIntegrity.multiplier * currentSize.HPModifier * currentMaterial.dice.max;  
            
            hpRef.current.value = Math.round((hpMin + hpMax)/2);
            acRef.current.value = currentMaterial.AC + currentSize.ACModifier;

            stealthRef.current.value = currentSize.hideModifier;
        }
    }

    const uploadTexture = (image,callback) => {

        function loop(i, count) {
            const imgLength = image.imgData.length;
            if (count < imgLength) {

                count = i * chunkSize;
                const chunk = image.imgData.slice(count, count + chunkSize);

                socket.emit("sendTextureData", image.name, image.directory, chunk, i, false, count, (received) => {
                    if (received) {
                        i++;
                        loop(i, count)
                    } else {


                        callback(false)
                    }
                })
            } else {
                socket.emit("sendTextureData", image.name, image.directory, new Uint8Array(), i, true, count, (written) => {
                    if (written) {
                        // uploadIndex++;

                        callback(true)

                    } else {

                        callback(false)
                    }
                })
            }
        }

        loop(0, 0)
    }

    const uploadEffect = () =>{
        
        //const index = textureName.lastIndexOf("_");
        let name = (textureNameRef.current.value);
        name = name.replace(/ /g, "_")
        name = name + ".png"
       
        socket.emit("getTextureEffectRev", currentTexture, (resultRev)=>{
           
            const rev = resultRev +1;
            const image =
            {
                id: currentTexture,
                name: currentTexture + "_effect_" +rev + "_" + name,
                directory: typeRef.current.selectedOption.path,
                imgData: tileData,
            }

            uploadTexture(image,(uploaded)=>{
                setShowLoadingScreen(false)
            
                if(uploaded){
                
                    socket.emit("updateTextureEffect",
                        {
                            id: image.id,
                            url: textureUrl + image.directory + image.name,
                            rev: rev
                        },
                        (complete)=>{
                            alert("uploaded " + complete ? " success" : " failed")
                        } 
                    )
                }
            });
        })

    }
    
    const applyEffects = () => {
        const g = Number( tileGamma.current.value);
        const w = Number(tileWidth.current.value);
        const h = Number( tileHeight.current.value);
        const s = Number( tileRatio.current.value);

        
        if(imgFile != null){
            const img = new Image();
            img.onload = () =>{
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext("2d");

                canvas.width = img.width-2;
                canvas.height = img.height-2;
                ctx.drawImage(img, 0, 0);
            
                _adjustGamma(canvas,g,(gammaImg)=>{

                    _createTextureTile(gammaImg,w,h,s, (resultImg) => {
                        
                        setPreviewImage(resultImg.toDataURL())

                        resultImg.toBlob((blob)=>{
                            imgArrayReader.onload = () => {

                                
                                const uint = new Uint8Array(imgArrayReader.result)

                                setTileData(uint)
                            }
                            imgArrayReader.readAsArrayBuffer(blob);
                        }, 'image/png')
                        //imgArrayFile(new Uint8Array())
                    })
                })
            }
            img.src = imgFile;
           // 
        }
    }
    const _adjustGamma = (canvas, gamma, callback) => {
        const gammaCorrection = 1 / gamma;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0.0, 0.0, canvas.width, canvas.height);
        const data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 * Math.pow((data[i] / 255), gammaCorrection);
            data[i + 1] = 255 * Math.pow((data[i + 1] / 255), gammaCorrection);
            data[i + 2] = 255 * Math.pow((data[i + 2] / 255), gammaCorrection);
        }
        var outCanvas = document.createElement('canvas');
        outCanvas.width = canvas.width;
        outCanvas.height = canvas.height;

        var octx = outCanvas.getContext("2d")
        octx.putImageData(imageData, 0, 0);
        
        callback(outCanvas)
    }

    const _createTextureTile = (canvas,w, h,s, callback) => {


        const imgScale = s;

        const size = { width: w, height: h }



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
        

        <div style={{position: "fixed", backgroundColor: "rgba(10,13,14,.7)", width:400, height:pageSize.height, left:200, top:"0px"}}>
            <div style={{
                padding:"10px",
                textAlign: "center",
                fontFamily: "WebRockwell",
                fontSize: "25px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314"
            }}>Edit Textures</div>
            <div className={styles.titleHeading}>Textures</div>
            <div style={{ paddingTop: 10,height: pageSize.height-150, width: "100%", textAlign: "left", overflowY: "scroll", display: "block" }}>
                {textureList}
            </div>
           
        </div>
    

     <div style={{position: "fixed", backgroundColor: "rgba(10,13,14,.7)", width:550, height:pageSize.height, left:pageSize.width-550, top:"0px", alignItems:"center"}}>
                <div style={{
                    padding: "10px",
                    textAlign: "center",
                    fontFamily: "WebRockwell",
                    fontSize: "25px",
                    fontWeight: "bolder",
                    color: "#cdd4da",
                    textShadow: "2px 2px 2px #101314"
                }}>Texture</div>
                <div style={{ display: "flex" }} className={styles.titleHeading}>Texture Information
                    {currentTexture > -1 ? <div style={{ marginLeft: "10px" }} className={styles.clickText} onClick={(e) => {
                        setCurrentTexture(-1);
                    }}> (clear) </div> : <></>}
                </div>

                <div style={{ marginLeft: "10px", height: pageSize.height - 100, overflowY: "scroll" }}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div style={{ padding: "10px" }}>
                            <input ref={textureNameRef} type={"text"} placeholder="Texture Name" className={styles.smallBlkInput} />
                        </div>
                        <div style={{ display: "flex", marginLeft: "8px", alignItems: "center" }}>
                            {addNewType == false &&
                                <>
                                    <div style={{ width: 300 }}>
                                        <SelectBox ref={typeRef} placeholder="Texture Type" options={typeList} />
                                    </div>
                               
                                </>
                            }
                            {addNewType &&
                                <>
                                    <div style={{}}>
                                        <input style={{ width: 250 }} ref={newTypeNameRef} type={"text"} placeholder="New type name" className={styles.smallBlkInput} />
                                    </div>
                                    <div style={{ paddingLeft: 10 }}>
                                        <input style={{ padding: 3 }} id='commit' type={"submit"} value="Add" className={styles.blkSubmit} />
                                    </div>
                                    <div style={{ paddingLeft: 10 }} onClick={(e) => {
                                        setAddNewType(false);
                                    }} className={styles.textButton}>(cancel)</div>

                                </>
                            }
                        </div>
                     
                        
                      <div style={{ alignItems:"center", padding:"10px", display:"flex"}}>
                            <div className={styles.disclaimer}>
                                Texture Url:
                            </div>
                            <div style={{paddingLeft:"10px"}}>
                                <input type={"text"} value={textureUrl } className={styles.smallBlkInput} />
                            </div>
                      </div>
                    <div style={{display: "flex", padding:"10px"}}>
                        <div style={{flex:1}}>
                        <input id="imageUpload" style={{ display: "none" }} type="file" accept="image/*" onChange={(e) => {

                            reader.onload = () => {

                                setImgFile(reader.result);

                            }
                            imgArrayReader.onload = () => {
                            
                               
                                const uint = new Uint8Array(imgArrayReader.result)
                                
                                setImgArrayFile(uint)
                            }
                            let file = e.target.files[0];

                            setTextureName(file.name)

                            imgArrayReader.readAsArrayBuffer(file);
                            reader.readAsDataURL(file);
                            setImageSelected(prev => true);
                        }} />
                        {!imageSelected &&
                            <div style={{ paddingTop: "70px", paddingBottom: "50px" }}>
                                <label style={{ padding: "6px 12px" }} for="imageUpload" className={styles.imageButton} >Select an image...</label>
                            </div>
                        }
                        {imageSelected &&
                            <div style={{ paddingTop: "50px", paddingBottom: "3px" }}>
                                <label style={{ padding: "8px 8px 0px 8px" }} for="imageUpload" className={styles.imageButton} >
                                    {/*img*/}
                                    <img src={imgFile} width="200" height="200" />
                                </label>
                                
                                    <div>
                                        <input style={{width:"480px"}} type={"text"} value={textureName} className={styles.smallBlkInput} />
                                    </div>
                                    <div style={{paddingTop:"20px"}}>
                                            {previewImage == null && currentTexture > -1 &&
                                    <div onClick={(e)=>{
                                        flushSync(()=>{
                                            setShowEffectEditor(true);
                                        })
                                        tileGamma.current.value = 1;
                                        tileWidth.current.value = 2048;
                                        tileHeight.current.value = 2048;
                                        tileRatio.current.value = 8;
                                        
                                    }} style={{ width:"150px", height:"40px", alignItems:"center", justifyContent:"center", display:"flex" }} className={styles.imageButton}>
                                        Add Effects
                                    </div>
                                    }
                                    </div>
                                    
                            </div>
                        }
                        </div>
                            
                </div>
                        

                        <div style={{ padding: "10px", display: 'flex', textAlign: "left" }}>
                            <div onClick={(e) => {
                                if (update) setUpdate(false);
                                setAdd(!add)
                            }} style={{ display: 'flex', textAlign: "left", paddingRight: "10px", cursor: "pointer" }} > <div className={add ? styles.checked : styles.check} /><div className={styles.disclaimer}>Add</div></div>
                            <div onClick={(e) => {
                                if (add) setAdd(false);
                                setUpdate(!update)
                            }} style={{ display: 'flex', textAlign: "left", cursor: "pointer" }} ><div className={update ? styles.checked : styles.check} /><div className={styles.disclaimer}>Update</div></div>
                        </div>
                        <div style={{ padding: "5px" }}>
                            <input disabled={showLoadingScreen} id='commit' type={"submit"} value="COMMIT" className={styles.blkSubmit} />
                        </div>
                    </form>

                </div>
                

            </div>
            {showEffectEditor == true &&
                <div style={{ padding:"20px", backgroundColor: "rgba(10,13,14,.75)", 
                textAlign: "center", width: "700px", height: "600px", position: "fixed", right:  550, top:"50%", transform:"translate(0,-50%)"}}>
               
                <div>
                        <img src={previewImage == null? imgFile : previewImage} width="450" height="450" />
                </div>
                
                <div style={{ display: "flex", padding: "10px" }}>
                    <div >
                        <input ref={tileWidth} type={"text"} placeholder="width" className={styles.smallBlkInput} />
                    </div>
                    <div >
                        <input ref={tileHeight} type={"text"} placeholder="width" className={styles.smallBlkInput} />
                    </div>
                    <div >
                        <input ref={tileRatio} type={"text"} placeholder="width" className={styles.smallBlkInput} />
                    </div>
                    <div >
                        <input ref={tileGamma} type={"text"} placeholder="width" className={styles.smallBlkInput} />
                    </div>
                </div>
                <div style={{ display: "flex", padding: "10px" }}>
                    <div onClick={applyEffects} style={{ width: "150px", height: "40px", alignItems: "center", justifyContent: "center", display: "flex" }} className={styles.imageButton}>
                        Apply Effects
                    </div>
                    {previewImage != null &&
                    <div onClick={uploadEffect} style={{ width: "150px", height: "40px", alignItems: "center", justifyContent: "center", display: "flex" }} className={styles.imageButton}>
                        Upload
                    </div>
                    }
                </div>
            </div>
            }
        </>
    )
}

export default EditTextures;

/* Texture.placeacterID, \
 Texture.textureName, \
 chrImg.imageString, \
 object.objectID, \
 object.objectName, \
 object.objectUrl, \
 object.objectColor, \
 objImg.imageString */

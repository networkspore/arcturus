import React, {useEffect, useRef} from 'react';


export const FileCanvas = (props = {}) => {

    const canvasRef = useRef(); 
    
    useEffect(() => {
        
        if(canvasRef.current){
            updateLocalFileCanvas(props.localFIle)
        }
    },[canvasRef.current, props.localFile, props.fullSize]); 
    


    async function updateLocalFileCanvas(localFile) {


        const file = await localFile.handle.getFile()
       
        const image = await createImageBitmap(file)

        
        ctx = canvasRef.current.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

  

    }


    async function getLocalFileThumnailCanvas(localFile) {
        const file = await localFile.handle.getFile()

        return getThumnailFile(file)
    }


    async function getThumnailFile(file, size = { width: 100, height: 100 }, onSize = null) {



        const image = await createImageBitmap(file)
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;
        if (onSize != null) onSize({ width: image.width, height: image.height })
        ctx.drawImage(image, 0, 0);

        let scale = 1;


        if (image.width > image.height) {
            scale = size.width / image.width;
        } else {
            scale = size.height / image.height;
        }

        const resampledCanvas = resample(canvas, scale);


        return resampledCanvas

    }



    return (
        <canvas ref={canvasRef} style={props.style} {...props} />
    );

}; 

import React, { useEffect, useRef } from "react"


export const CanvasDiv = (props ={}) =>{
    const canvasRef = useRef()
    
    useEffect(()=>{
        if(props.file != undefined && props.file != null)
        {
            updateCanvas(props.file)
        }
    },[props.file])

    async function updateCanvas(localFile) {

        const file = await localFile.handle.getFile()
        const bmp = await createImageBitmap(file)


        const ctx = canvasRef.current.getContext("2d");

        ctx.drawImage(bmp, 0, 0,props.width, props.height)



            /*
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);*/



    }

    return (
        <canvas  width={props.width} height={props.height} ref={canvasRef} />
    )
}
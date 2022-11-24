import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useZust from "../../hooks/useZust";
import FileList from "../components/UI/FileList";
import { ImageDiv } from "../components/UI/ImageDiv";

export const RealmAssets = (props ={}) =>{
    const navigate = useNavigate()
    const pageSize = useZust((state) => state.pageSize)

    useEffect(()=>{
        console.log("loaded")
    })

    return (
        <div id='RealmAssets' style={{
            position: "fixed",
            backgroundColor: "rgba(0,3,4,.95)",
            width: 700,

            left: ((pageSize.width + 360) / 2),
            top: (pageSize.height / 2),
            transform: "translate(-50%,-50%)",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
        }}>
            <div style={{
                paddingBottom: 10,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                width: "100%",
                paddingTop: "10px",
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",
            }}>
                <div style={{width:50}}>&nbsp;</div>
                <div style={{
                    
                    display:"flex",
                    flex:1,
                    alignItems: "center",
                    justifyContent: "center",
                    }}>Assets</div>
                <div onClick={(e)=>{
                    navigate("/realm/gateway")
                }} style={{cursor:"pointer", width:50, textAlign:"right" }}>
                    <ImageDiv width={30} height={30} netImage={{scale:.9, image: "/Images/icons/close-outline.svg", filter:"invert(60%)"}}/>
                </div>
            </div>
            <div style={{padding:70}}>
            <FileList fileView={{ 
                    type: "icons", 
                    direction: "row", 
                    iconSize: { width: 100, height: 100 } }} 
                tableStyle={{ height: 600 }} 
            files={[
                { 
                    to: "/realm/gateway/assets/pcs", 
                    name: "Playable Characters", 
                    type: "folder", 
                    crc: "", 
                    lastModified: null, 
                    size: null, 
                    netImage: { 
                        backgroundColor: "", 
                        image: "/Images/icons/man-outline.svg", filter: "invert(80%)" } },
                
                { to: "/realm/gateway/assets/npcs", name: "Non-Playable Characters", type: "folder", crc: "", lastModified: null, size: null, netImage: { backgroundColor: "", 
                    image: "/Images/icons/paw-outline.svg", filter: "invert(80%)" } },
                
                { to: "/realm/gateway/assets/placeables", name: "Placeable Models", type: "folder", crc: "", lastModified: null, size: null, netImage: { backgroundColor: "", 
                    image: "/Images/icons/cube-outline.svg",  filter: "invert(80%)" } },
                {
                    to: "/realm/gateway/assets/textures", name: "Textures", type: "folder", crc: "", lastModified: null, size: null, netImage: {
                        backgroundColor: "",  image: "/Images/icons/images-outline.svg", filter: "invert(80%)"
                    }
                },
            
            
            ]} />
            </div>
        </div>
    )
}
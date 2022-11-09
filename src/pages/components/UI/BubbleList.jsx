import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { ImageDiv } from "./ImageDiv";
import styles from "../../css/home.module.css"
import { useNavigate } from "react-router-dom";
import produce from "immer";




const BubbleList = (props = {}, ref) => {
    if (props == null) props = {};
    const onChange = "onChange" in props ? props.onChange : null;
  
    const divRef = useRef()
    const navigate = useNavigate()
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    
    const className = ("className" in props) ? props.className : styles.bubble__item;
    const activeClassName = ("activeClassName" in props) ? props.activeClassName : styles.bubbleActive__item;
 
    const [index, setIndex] = useState(0)
    const [displayImage, setDisplayImage] = useState([
        "",
        "",
        "",
        "",
        "",
    ])


    const rowStyle = {display:"flex", flex: 1, height:"20%"}
    const itemStyle = { 
        borderRadius:40,
        margin: "2%",
        boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
        textShadow: "2px 2px 2px black", 
    }
    const imageStyle = {
        scale: 1.3, backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", 
        backgroundColor: ""
    }

    return (
        <div ref={divRef} style={{display:"flex", flexDirection:"column", overflow:"hidden", minWidth:800, minHeight:800, width:"100%", height:"100%"}} >
           
            <div style={rowStyle}>
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 1] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 2] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 3] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 4] }} />
            </div>
            <div style={rowStyle}>
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 5] }} />
              
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 6] }} />
   
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 7]  }} />
    
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 8]  }} />
             
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 9]  }} />
                
            </div>
            <div style={rowStyle}>
                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 10] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 11] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 12] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 13] }} />

                <ImageDiv style={itemStyle} width={"18%"} height={"80%"} netImage={{ backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)", backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale, image: displayImage[index + 14] }} />
            </div>
        
        </div>
      
    )
}

export default forwardRef(BubbleList);
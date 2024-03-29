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
    const [currentItem, setCurrentItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    
    const className = ("className" in props) ? props.className : styles.bubble__item;
    const activeClassName = ("activeClassName" in props) ? props.activeClassName : styles.bubbleActive__item;


    const rowStyle = {display: "flex", flex: 1, height: "20%", width:"100%", alignItems:"center", justifyContent:"center" }
    const itemStyle = {
        borderRadius: 40,
        overflow:"hidden",
        textShadow: "2px 2px 2px black",
        cursor: "pointer"
    }

    const [displayItem, setDisplayItem] = useState([
        { index: -1,  id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },
        { index: -1, id: null, name: "", netImage: {} },

       
    ])

    useImperativeHandle(
        ref,
        () => ({
            clear:()=>{
                setCurrentItem(null)
            }
        }),[])


    useEffect(()=>{
        const imageStyle = "imageStyle" in props ? props.imageStyle : {
            scale: 1.3, backgroundImage: "linear-gradient(to bottom,  #00030450,#13161780)",
            backgroundColor: ""
        }
        const items = ("items" in props) ? props.items : null;
        const defaultItem = "defaultItem" in props ? props.defaultItem : {}

        const defaultItemName = "name" in defaultItem ? defaultItem.name : "( Empty )";
        let defaultItemNetImage = { backgroundImage: imageStyle.backgroundImage, backgroundColor: imageStyle.backgroundColor, scale: imageStyle.scale };


        if(Array.isArray(items))
        {
            const currentPageItems = {};

            items.forEach(element => {
                if("page" in element && "index" in element)
                {
                    if(element.page == currentPage)
                    {
                        let newElement = element; 
                        if("netImage" in newElement)
                        {
                            newElement.netImage.backgroundImage = ("backgroundImage" in element.netImage) ? element.netImage.backgroundImage : imageStyle.backgroundImage;
                            newElement.netImage.backgroundColor = ("backgroundColor" in element.netImage) ? element.netImage.backgroundColor : imageStyle.backgroundColor;
                            newElement.netImage.scale = ("scale" in element.netImage) ? element.netImage.scale : imageStyle.scale;
                        
                        }else{
                            newElement.netImage = defaultItemNetImage;
                        }
                        currentPageItems[element.index] = newElement
                    }
                }
            });

            const tmpItems = []
            for (let i = 0; i < 12; i++) {
                const itm = (i in currentPageItems) ? currentPageItems[i] : { index: i, id: null, netImage: defaultItemNetImage, name: defaultItemName }
               
                tmpItems.push(
                    itm
                )
            }
            setDisplayItem(tmpItems)
        }else{
            

                const tmpItems = []
                for(let i = 0; i < 12 ; i++)
                {
                    tmpItems.push(
                        {index: i, id:null, netImage:defaultItemNetImage, name:defaultItemName }
                    )
                }
            
                setDisplayItem(tmpItems)
            
        }
    },[props])

   
    const onClick = (e, index) => {
        e.stopPropagation();
        let dItem = displayItem[index]
       
        const currentItemIndex = currentItem != null ? currentItem.index : null
       
        if (currentItemIndex  == dItem.index)
        {
            dItem = null
       }else{
            dItem.page = currentPage;
            dItem.index = index;
            dItem.bounds = e.target.getBoundingClientRect()

       }

        setCurrentItem(dItem);
        
        e.index = index;
        e.page = currentPage;
        if("onClick" in props) props.onClick(e)
    }

    useEffect(()=>{
       
        onChange(currentItem)
       
    },[currentItem])

  
    return (
        
        <div onClick={(e) => { setCurrentItem(null) }} ref={divRef} style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 800, minHeight: 800, width: "100%", height: "100%",  }} >
            {divRef.current &&
            <div onClick={(e) => { setCurrentItem(null) }} style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 800, minHeight: 800, width: "100%", height: "100%", }} >
            
                <div style={rowStyle}>
                <div style={{ width: "5%" }}>&nbsp;</div>
         
                <ImageDiv about={displayItem[0].name} className={currentItem != null && currentItem.index == 0 ? activeClassName : className} onClick={(e) => { onClick(e, 0) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[0].netImage} />
                <div style={{width:"5%"}}>&nbsp;</div>
                <ImageDiv about={displayItem[1].name} className={currentItem != null && currentItem.index == 1 ? activeClassName : className} onClick={(e) => { onClick(e, 1) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 1].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                <ImageDiv about={displayItem[2].name} className={currentItem != null && currentItem.index == 2 ? activeClassName : className} onClick={(e) => { onClick(e, 2) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 2].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                <ImageDiv about={displayItem[3].name} className={currentItem != null && currentItem.index == 3 ? activeClassName : className} onClick={(e) => { onClick(e, 3) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 3].netImage} />
                <div style={{width: "5%"}}></div>
                
                </div>
                <div style={rowStyle}>
                    <ImageDiv about={displayItem[4].name} className={currentItem != null && currentItem.index == 4 ? activeClassName : className} onClick={(e) => { onClick(e, 4) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 4].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                    <ImageDiv about={displayItem[5].name} className={currentItem != null && currentItem.index == 5 ? activeClassName : className} onClick={(e) => { onClick(e, 5) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 5].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                <ImageDiv about={displayItem[6].name} className={currentItem != null && currentItem.index == 6 ? activeClassName : className} onClick={(e) => { onClick(e, 6) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[6].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                <ImageDiv about={displayItem[7].name} className={currentItem != null && currentItem.index == 7 ? activeClassName : className} onClick={(e) => { onClick(e, 7) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[7].netImage} />
                
              
                    
                </div>
                <div style={rowStyle}>
                    <ImageDiv about={displayItem[8].name} className={currentItem != null && currentItem.index == 8 ? activeClassName : className} onClick={(e) => { onClick(e, 8) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[8].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                    <ImageDiv about={displayItem[9].name} className={currentItem != null && currentItem.index == 9 ? activeClassName : className} onClick={(e) => { onClick(e, 9) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 9].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                    <ImageDiv about={displayItem[10].name} className={currentItem != null && currentItem.index == 10 ? activeClassName : className} onClick={(e) => { onClick(e, 10) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 10].netImage} />
                <div style={{ width: "5%" }}>&nbsp;</div>
                    <ImageDiv about={displayItem[11].name} className={currentItem != null && currentItem.index == 11 ? activeClassName : className} onClick={(e) => { onClick(e, 11) }} style={itemStyle} width={"19%"} height={"80%"} netImage={displayItem[ 11].netImage} />

                
                </div>
           
            
            </div>
            }
        </div>
      
    )
}

export default forwardRef(BubbleList);
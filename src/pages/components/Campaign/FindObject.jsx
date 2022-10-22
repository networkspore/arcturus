import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'
import SelectBox from "../UI/SelectBox";
import produce from 'immer';
import useZust from "../../../hooks/useZust";


const FindObject = ({top= 0, left= 0, onClose, onSelected = null, defaultTypeOption=0, ...props }) => {
    const typeOptions =
        [
            { value: 0, label: "Placeables"},
            { value: 1, label: "Monsters"},
            { value: 2, label: "Characters"},
            { value: 3, label: "All" },
        ]
        
 

    const [objectList, setObjectList] = useState(null);
   
    const [objects, setObjects] = useState(null);

    const objectTypeRef = useRef();
    const searchInputRef = useRef();
    

    const socket = useZust((state) => state.socket);

    const [selectedObject, setSelectedObject] = useState(-1)



    useEffect(() => {
        objectTypeRef.current.setValue(defaultTypeOption)
    }, [])



    const onSearch = (...e) => {
        const searchText = searchInputRef.current.value;
        const objectTypeID = objectTypeRef.current.getValue;
     

        if(objectTypeID > -1){
            socket.emit("findObjects", searchText, objectTypeID, (objects)=>{
                setObjects(objects);
            })
        }
    }



    useEffect(()=>{
        if(objects != null){
            let array = [];

            objects.forEach((object,i) => {
                array.push(
                    <div id={i} style={{ width: "100%" }} onClick={(e) => {
                        
                       setSelectedObject(i);
                       if(onSelected != null){
                        
                           onSelected(object);
                       }
                    }}>
                        <div id={i} style={{ display: "flex", }} className={selectedObject == i ? styles.menuNameActive : styles.menuName}>
                            <div style={{ marginLeft: "20px" }} id={i} >{object.object.name}</div>
                        </div>
                    </div>
                );
            });
            setObjectList(array)
         
        }
    },[objects,selectedObject])

   
   

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSearch("submit");
            }}>

        <div style={{
            position: "fixed",
            left: left, top: top, backgroundColor: "rgba(10,12,16,.9)", border: "2px solid rgba(80,82,86,.8)",
            width: "450px",
        }}>
            <div style={{ display: "flex", padding: "10px", alignItems:"baseline" , fontFamily: "WebRockwell", textShadow: "2px 1px,1px black", color: "white", borderBottom: "2px solid rgba(80,82,86,.8)", }}>
              
              
                <div style={{ width:"190px" }} >
                    <input onKeyDown={(e) => {
                        if (e.key == "Esc") {
                            onClose();
                        }
                    }} ref={searchInputRef} style={{ width: "100%", color: "white" }} 
                        className={styles.searchInput} type="text" placeholder="Search Objects" />
                </div>
                
                <div style={{flex:1}}>
                    <SelectBox textStyle={{
                            backgroundColor:"black",
                            fontSize:"22px",
                            outline:0,
                            borderWidth:0,
                            color: "white"
                        }} ref={objectTypeRef} 
                        placeholder={"Types"} options={typeOptions}/>
                </div>
                <div style={{ width: 10 }}></div>
                <div>
                    
                        <input style={{
                            padding: 6,
                            backgroundColor: "black",
                            fontFamily:"WebRockwell",
                            fontSize: "14px",
                            outline: 0,
                            borderWidth: 1,
                            color: "white" }} id='commit' type={"submit"} value="Search"  />
                       
                </div>
                <div style={{width:10}}></div>
                <div className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
          
            </div>
            {objectList && objectList.length > 10 &&
                <div style={{ height: 308, overflowY: "scroll" }}>
                    {objectList}
                </div>
            }
            {objectList && objectList.length < 11 &&       
            objectList
            }

        </div>
            </form>
         
         
       
        </>
    )
}

export default FindObject

//{placeableList == null ? <></> : placeableList.length > 5 ? <div style={{ height: 300, overflowY: "scroll" }}>{placeableList}</div> : { placeableList }}
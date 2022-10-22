import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'


const Quantity = ({ item, onSetQuantity, onClose, ...props }) => {

    const [random, setRandom] = useState(false);

    const quantityRef = useRef();

    const onOK = () =>{
        onSetQuantity(item, quantityRef.current.value, random)
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        
        onOK();
    }

    useEffect(()=>{
        quantityRef.current.value = "1";
    },[])

    return (
        <div
            style={{
                left: "50%",
                top: "50%",
                position: "fixed",
                width:"300px",
                transform:"translate(-50%,-50%)",
                backgroundColor: "rgba(10,12,16,.9)",
                paddingLeft: "5px",
                paddingRight: "5px",
                paddingBottom: "5px"
            }}
        >

            <div style={{ width: "100%", backgroundColor: "rgba(80,80,80,.9)", height: "5px" }}></div>
            <div>
                <div style={{paddingTop:"10px", paddingBottom:"10px",
                    display:"flex", 
                    justifyContent:"center",
                    alignItems:"center" 
                }}>
                <div style={{ marginRight: "5px" }} className={styles.fieldHeading}>
                    Quantity:
                </div>
                <div>
                    <form onSubmit={onSubmit}>
                    <input  style={{ textAlign:"center", width: 150, marginRight: "5px" }} ref={quantityRef} type={"text"} placeholder="quantity" className={styles.searchInput} onKeyDown={(e) => {
                        
                        if (!(e.key > -1) &&
                            !(e.key == "Delete") &&
                            !(e.key == "Backspace") &&
                            !(e.key == "ArrowLeft") &&
                            !(e.key == "ArrowRight")
                        ) e.preventDefault();
                    }} />
                    </form>
                </div>
                </div>
                {"monsterID" in item &&
                <div style={{
                    paddingTop: "10px", paddingBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                
              
                        <div onClick={(e) => {
                            setRandom(!random)
                        }} style={
                            { 
                                alignItems:"center",
                                display: 'flex', 
                                justifyContent: "center", 
                                paddingRight: "10px", 
                                cursor: "pointer", 
                                
                            }} > 
                        <div style={{ marginRight: "20px"}} className={random ? styles.checked : styles.check} />
                                <div className={styles.fieldHeading}>Randomize HP
                            </div>
                        </div> 
                  
                </div>
                }
                <div style={
                    { 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        height: "50px" 
                    }} 
                    className={styles.acceptButton} 
                    
                    onClick={(e) => {
                    onOK();
                    }}>√</div>
                <div style={
                    {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50px"
                    }}
                    className={styles.closeButton} 
                    
                    onClick={(e) => {
                        onClose();
                    }}>x</div>
            </div>
        </div>
    )
}

export default Quantity
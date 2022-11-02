import React, { useState, useRef, useEffect } from "react"


import styles from '../../css/home.module.css';

export const OptionsMenu = (props = {}) =>{
    const divRef = useRef()
    const contact = props.user; 
    const options = props.options;
    useEffect(()=>{
        if (divRef.current){
      
                divRef.current.focus();
            
        }
    
        
    },[divRef.current])




    return (
        
        <div key={"menu"} className={styles.result} style={{ flex: 1, marginLeft:15, fontFamily:"webpapyrus", fontSize:14, outline:0 }} tabIndex={-1} ref={divRef} >
            <div>Profile</div>
        </div>
      
    )
}
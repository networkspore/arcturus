import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';

import { useNavigate } from 'react-router-dom';







export const ContactsPage = () => {
    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)
    const contacts = useZust((state) => state.contacts)
    
    const [contactMenu, setContactMenu] = useState([])

    const [currentContact, setCurrentContact] = useState([]);
    const nav = useNavigate();

    useEffect(()=>{

    },[contacts])
   
    

    return (
        
       <>
            <div style={{ position: "fixed", backgroundColor: "rgba(0,3,4,.7)", width: 170, height: pageSize.height, left: 285, top: "0px" }}>
                <div style={{
                    padding: "10px",

                    width: "150px",
                    paddingTop: "20px",
                    backgroundImage: "linear-gradient(black, #030507AA)"

                }}>
                    &nbsp;
                </div>
                <div style={{ height:"55px", backgroundColor:"rgba(0,3,4,.95)"}}>

                </div>
                <div style={{height:"100%", width:"150px", border:"solid 10px #000304"}}>
                    {contacts}
                    </div>

             </div>
           
           
        </>
    )
}
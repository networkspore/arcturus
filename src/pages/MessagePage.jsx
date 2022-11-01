import React, { useState, useRef, useEffect } from 'react';
import useZust from '../hooks/useZust';

import { NavLink, useNavigate } from 'react-router-dom';
import styles from './css/home.module.css';
import produce from 'immer';
import SelectBox from './components/UI/SelectBox';
import { AddImagePage } from './AddImagePage';
import { ImageDiv } from './components/UI/ImageDiv';





export const MessagePage = (props = {}) => {
    const pageSize = useZust((state) => state.pageSize)
    const user = useZust((state) => state.user)

    const [showIndex, setShowIndex] = useState(); 

    const configFile = useZust((state) => state.configFile)


    function onAddImage(e) {
       setShowIndex(2)
    }

    function onAdd3DObject(e) {
       setShowIndex(0)
    }

    function newMenuOnClick(e) {
        if(showIndex == 1)
        {
            setShowIndex(0)
        }else{
            setShowIndex(1)
        }
    }

    function addImageObject(imgObj) {

    }

    const [recipientList, setRecipientList] = useState([])

    useEffect(()=>{
        const r = props.recipients;

        let list = []

        if(Array.isArray(r)){
            if(r.length > 0)
            {
                r.forEach(recipient => {
                    list.push(
                        <div key={recipient.userID} style={{ display: "flex", backgroundColor: "black", borderRadius: 12, fontFamily: "Webpapyrus", color: "white", transform: "translate(0,-3px)" }}>
                            <div style={{display:"flex"}}>
                            <div style={{ paddingLeft:15, marginBottom:2, paddingTop:2  }}>
                                {recipient.userName}
                            </div>
                            <div style={{paddingLeft:5, paddingRight:5, display:"flex", alignItems:"center" }}>
                                <ImageDiv width={16} height={16} netImage={{ width:15, height:15, image:"/Images/icons/close-circle-outline.svg", filter:"invert(100%)"}} />
                            </div>
                            </div>
                        </div>
                    )
                });
            }
        }

        const horizontalList = <div style={{display:"flex"}}>{list}</div>;

        setRecipientList(horizontalList)
        
    },[props.recipients])

   
    

    return (
        
       <>
<div id='MediaAssetsPage' style={{ position: "fixed", backgroundColor: "rgba(0,3,4,.95)", width: pageSize.width - 385 -10, height: pageSize.height, left: 405, top: "0px" }}>
    <div style={{
        padding: "10px",
        textAlign: "center",
        width: "100%",
        paddingTop: "20px",
        fontFamily: "WebRockwell",
        fontSize: "18px",
        fontWeight: "bolder",
        color: "#cdd4da",
        textShadow: "2px 2px 2px #101314",
        backgroundImage: "linear-gradient(black, #030507AA)"

    }}>
                    Message
    </div>
                <div style={{
                    display: "flex",
                    height: "50px",
                    backgroundColor: "#66666650",

                    alignItems: "center",
                    marginLeft: "10px",
                    marginRight: "10px",
                    paddingLeft: "10px"
                }}>


                    <div onClick={(e) => {
                      
                    }} about={"Menu"} style={{ paddingLeft: 10, paddingRight: 10, display: "flex", alignItems: "center" }} className={styles.tooltip__item} >

                        <img src='/Images/icons/menu-outline.svg' width={25} height={25} style={{ filter: configFile.value == null ? "Invert(25%)" : "Invert(100%)" }} />

                    </div>
                  


                    <div onClick={(e) => { }} style={{
                        display: "flex",
                        flex: 1,
                        cursor: "pointer",
                        fontFamily: "Webrockwell",
                        fontSize: "14px",
                    }}>
                        <div style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "30px",
                            backgroundImage: "linear-gradient(to right, #00000050,#11111150,#00000050)",
                            marginLeft: "10px",


                        }}>
                            <div style={{
                                paddingLeft: "15px",
                                paddingTop: "3px",
                                paddingRight: "5px"
                            }}>
                                <img src='/Images/icons/people-circle-outline.svg' style={{
                                    width: "25px",
                                    height: "25px",
                                    filter: configFile.value == null ? "Invert(25%)" : "invert(100%)"
                                }} />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    paddingLeft: "2px",
                                    width: "100%",
                                    height: "18px",
                                    textAlign: "left",
                                    border: "0px",
                                    color: configFile.value == null ? "#777777" : "#cdd4da",
                                    backgroundColor: "#00000000",


                                }}>
                                    {recipientList}
                                </div>

                            </div>
                        </div>
                        <div style={{ width: 30 }}>



                        </div>
                    </div>

                </div>
</div>

{showIndex == 2 &&
    <AddImagePage 
        cancel={()=>{setShowIndex(0)}}
        result={(imgObj)=>{addImageObject(imgObj)}}
    />
}
</>
    )
        }
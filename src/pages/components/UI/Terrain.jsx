import React, { useEffect, useRef, useState } from "react";
import styles from '../../css/home.module.css'
import style2 from '../../css/campaign.module.css'
import useZust from "../../../hooks/useZust";
import SelectBox from "./SelectBox";
import produce from 'immer';

const Terrain = ({ onClose, onNewScene, ...props}) =>{
    
    const pageSize = useZust((state)=>state.pageSize);

    const sceneNameRef = useRef();
    const sceneLengthRef = useRef();
    const sceneWidthRef = useRef();

    const [isDefault, setIsDefault] = useState("false");


    const onCreateScene = () =>{

    }

    return (
        <div style={{position:"fixed",display:"block", width:600, height:300,
            backgroundColor: "rgba(10, 12, 16, .9)", left:"50%", top:"50%", transform:"translate(-50%,-50%)"
        
        }}>
            <div style={{ width: "100%", backgroundColor: "rgba(80,80,80,.5)", height: "10px" }}></div>
            <div style={{display:"flex"}}>
                <div style={{flex:.5}}></div>
                <div style={{ flex: 1 }} className={styles.title}>Grid</div >
                <div className={styles.closeButton} onClick={(e) => {
                    onClose();
                }}>X</div>
            </div>
            <div style={{paddingTop:"20px"}}></div>
            <div style={{  width: "100%", display:"flex", paddingTop:"20px", alignItems:"center"}}>
                <div style={{flex:.25}}></div>
                <div style={{ backgroundColor: "rgba(0,0,0,0)", flex:1, display:"flex"}} className={style2.heroSelect}>
                    Scene Name:<div style={{width:"10px"}}></div>
                
                    <input style={{width:"200px"}} ref={sceneNameRef} type={"text"} placeholder="scene name" className={style2.smallBlkInput} />
                </div>
                <div style={{flex:.25}}></div>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault()
                onCreateScene();
            }}>
           
         

           
            <div onClick={(e)=>{
                setIsDefault(!isDefault)
            }} style={{ cursor:"pointer", width: "100%", display: "flex", paddingTop: "10px", alignItems: "center" }}>
                <div style={{ flex: .2 }}></div>
                <div style={{ display:"flex", flex:1, alignItems:"center"}}>
                    <div className={isDefault ? style2.check : style2.checked} />
                    <div style={{width:"5px"}}></div>
                    <div style={{}} className={style2.disclaimer}>make default</div>
                </div>
                   

              
               
            </div>

            <div style={{ display: "flex"}}>
                        <div style={{flex:1}}></div>
                        <div style={{flex:.1}}></div>
                        <div style={{flex:.1}}>
                        <input  value={"Create"} className={style2.blkSubmit2} type={"submit"}/>
                        </div>
                        <div style={{width:"15px"}}></div>
                    </div>
            </form>
        </div>
    )
}

export default Terrain;
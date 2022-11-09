import { useEffect } from "react";
import styles from "./css/home.module.css"
import FileList from "./components/UI/FileList";
import { ImageDiv } from "./components/UI/ImageDiv";

export const PeerNetworkMenu = (props ={}) =>{
    return (
        <div style={{display:"flex"}}>
            <div style={{width:300}}>
                <div style={{display:"flex"}} className={styles.result}>
                    <ImageDiv width={30} height={30} netImage={{ backgroundColor: "", image: "/Images/icons/library-outline.svg", filter: "invert(100%)" }} />
                    <div>Library</div>
                </div>
                <div style={{ display: "flex" }} className={styles.result}>
                    <ImageDiv width={30} height={30} netImage={{ backgroundColor: "", image: "/Images/icons/storefront-outline.svg", filter: "invert(100%)" }} />
                    <div>Market</div>
                </div>
                <div style={{ display: "flex" }} className={styles.result}>
                    <ImageDiv width={30} height={30} netImage={{ backgroundColor: "", image: "/Images/icons/newspaper-outline.svg", filter: "invert(100%)" }} />
                    <div>Forum</div>
                </div>
               
            </div>
            <div style={{flex:1, backgroundColor:"#333333"}}>

            </div>
        </div>
    )
}
import React from "react"

import styles from "../../css/home.module.css"
import { ImageDiv } from "./ImageDiv"
import { useInView } from 'react-intersection-observer';

const IconFile = (props ={}) =>{
  //  const [onScreen, setOnScreen] = useState(false)
  //  const [isVisible, setIsVisible] = useState(true)
    const { ref, inView, entry } = useInView({
 
        threshold: 0,
    });
  


    return (
        <div
            tabIndex={0}
            id={props.idHeader+props.hash}
            ref={ref}
            onDoubleClick={props.onDoubleClick}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            style={{ 
                overflow: "clip", 
                maxWidth: 120, 
                overflowClipMargin: props.selected ? 500 : 0, 
                zIndex: props.selected ? 9999 : 0, 
                display: "flex", flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center" 
                }}>
                    { inView ?<>
                <ImageDiv 
                    style={{ margin: 10, overflow: "hidden" }}

                    className={props.className}
                    height={props.height}
                    width={props.width}
                    netImage={props.netImage}

                />
            <div style={{
                boxShadow: props.selected ? "0 0 10px #ffffff80" : "",
                textShadow: props.selected ? "1px 1px 3px black" : "", display: "flex", alignItems: "center", fontFamily: "webpapyrus", fontSize: "12", whiteSpace: "nowrap", padding: 5, 
                backgroundColor: props.selected ? "#777777" : "", 
                color: props.selected ? "black" : "white", borderRadius: 10
            }}>
                {props.selected ? props.name : props.name.length > 12 ? props.name.slice(0, 12) + ".." : props.name}
            </div></> : <><div
        style={{
            margin: 10,
            overflow: "hidden",
            height: props.height,
            width: props.width,
        }}>&nbsp;</div>
        <div style={{
              
                display: "flex", alignItems: "center", fontFamily: "webpapyrus", fontSize: "12", whiteSpace: "nowrap", padding: 5,
                    backgroundColor: props.selected ? "#777777" : "",
                color: props.selected ? "black" : "white", borderRadius: 10
            }}>
                &nbsp;
            </div>
                    <div style={{ position: "absolute", top: 0, right: 0 }}>  <ImageDiv about={"Uninstall"} className={styles.tooltipCenter__item}
                        width={20}
                        height={20}
                        style={{ borderRadius: 0 }}
                        netImage={{
                            backgroundColor: "",
                            image: "/Images/icons/trash.svg",
                            filter: "drop-shadow(0px 0px 3px #cdd4daCC)"
                        }}
                    /></div>
            </>
            }

        </div>
    )
}

export default IconFile
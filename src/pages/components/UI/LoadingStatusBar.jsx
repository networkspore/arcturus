import { useState, useRef, useEffect } from "react"
import useZust from "../../../hooks/useZust"

export const LoadingStatusBar = (props = {}) =>{

    const [isLoading, setIsLoading] = useState(false)
    const [complete, setComplete] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("")

    const loadingStatus = useZust((state) => state.loadingStatus)

    const loadingComplete = useZust((state) => state.loadingComplete)


    const completeChanged = useRef({value:true})

   


    return (
        <>
        { !loadingComplete && loadingStatus != null &&
        <div style={{
            display: "flex", padding: 2, alignItems: "center", justifyContent: "center",
            overflow:"hidden",
            width: 240,
                    mixBlendMode: "difference",
        }}>
           
            <div  style={{
                display: "flex",
                flex: 1,
                width: "100%",
                alignItems:  "center" ,
                        justifyContent: loadingStatus.name.length < 40 ? "center" : "start",
                cursor: "pointer",
                backgroundImage: `linear-gradient(to right, #ffffffEE ${(loadingStatus.index / loadingStatus.length * 100) + "%"}, #00000030 ${(loadingStatus.index / loadingStatus.length * 100) + "%"})`,
             
                boxShadow: "inset 0 0 15px #cccccc50",
                height:12
            }}>

                        <div style={{
                            color: "#eeeeee",
                            fontFamily: "webpapyrus",
                            fontSize: 14, paddingTop: 3,
                            paddingBottom: 3,
                            mixBlendMode: "difference",
                            textShadow: "1px 1px 3px #ffffffAA",
                            whiteSpace:"nowrap"
                        }}>

                            {loadingStatus.name}
                        </div>
            </div>
        </div>
                        }</>
    )
}
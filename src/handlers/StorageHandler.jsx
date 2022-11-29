import { useNavigate } from "react-router-dom"
import useZust from "../hooks/useZust"
import { ImageDiv } from "../pages/components/UI/ImageDiv"

export const StorageHandler = (props = {}) =>{
    const configFile = useZust((state) => state.configFile)
    const navigate = useNavigate()
    return (
        <>
        {configFile.value == null &&
            <ImageDiv 
                onClick={(e)=>{
                    navigate("/home/localstorage/init")
                }}
                 width={30} height={30} netImage={{scale:.7, image:"/Images/icons/server-outline.svg", filter:"invert(100%)"}}/>
        }
        </>
    )
}
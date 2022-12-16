import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useZust from "../hooks/useZust";
import FileList from "./components/UI/FileList";
import { ImageDiv } from "./components/UI/ImageDiv";
import styles from "./css/home.module.css"
import SelectBox from "./components/UI/SelectBox";

export const LibraryPage = (props ={}) =>{
    const navigate = useNavigate()
    const location = useLocation()

    const pageSize = useZust((state) => state.pageSize)
    const localDirectory = useZust((state) => state.localDirectory)

    const imagesDirectory = useZust((state) => state.imagesDirectory)
    const mediaDirectory = useZust((state) => state.mediaDirectory)
    const modelsDirectory = useZust((state) => state.modelsDirectory)

    const setSocketCmd = useZust((state) => state.setSocketCmd)

    const userFiles = useZust((state) => state.userFiles)

 
    
   
    const [directoryOptions, setDirectoryOptions] = useState([])

    const [currentDirectories, setCurrentDirectories] = useState([])
    const [currentFiles, setCurrentFiles] = useState([])
    const [allFiles, setAllFiles] = useState([]) 
 
    const [subDirectory, setSubDirectory] = useState("")

   // const [showIndex, setShowIndex] = useState(null)

    const [searchText, setSearchText] = useState("")
    const [currentMimeType, setCurrentMimeType] = useState("")
    const [currentType, setCurrentType] = useState("")
    
    const typeOptions = [
        {value:"/all", label:"All"},
        {
            value: "/images", label: "Images"
        },
        {
            value: "/media", label: "Media"
        },
        {
            value: "/media/video", label: "Video"
        },
        {
            value: "/media/audio", label: "Audio"
        },
        {
            value: "/models", label: "Models"
        },
        {
            value: "/assets", label: "Assets"
        },
        {
            value: "/assets/pcs", label: "PCs"
        },
        {
            value: "/assets/npcs", label: "NPCs"
        },
        {
            value: "/assets/placeables", label: "Placeables"
        },
        {
            value: "/assets/textures", label:"Textures"},
        {
            value: "/assets/terrain", label: "Terrain"
        },
        {
            value: "/assets/types", label: "Types"
        },
       
    ]
    
    const directory = "/home/peernetwork/library"

    useEffect(()=>{
        props.setSearchOptions(typeOptions)
        return () =>{
            props.setSearchOptions([])
        }
    },[])

    useEffect(()=>{
        if(props.admin)
        {
            setAllFiles(userFiles)
        }
        
    }, [props.admin, props.currentPeer])

    useEffect(() => {

        props.setSearchText("")

        const currentLocation = location.pathname
  
     

      
        const thirdSlash = currentLocation.indexOf("/", directory.length)

      //  const fourthSlash = currentLocation.indexOf("/", directory.length + 2)

        const l = thirdSlash != -1 ? currentLocation.slice(thirdSlash, currentLocation.length) : "";
        
        setSubDirectory(l)
        
        

        switch (l) {
            case "/all":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentMimeType("")
                setCurrentType("")
            break;
            case "/images":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentMimeType("image")
                setCurrentType("")
                break;
            case "/assets":
                
                setCurrentFiles([
                    { to: directory + "/assets/pcs", name: "pcs", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/assets/npcs", name: "npcs", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/assets/placeables", name: "placeables", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/assets/textures", name: "textures", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/assets/terrain", name: "terrain", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/assets/types", name: "types", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                ])
                props.setSearchValue(null)
                setCurrentMimeType("")
                setCurrentType("")
                break;
            case "/assets/pcs":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("arcpc")
                break;
            case "/assets/npcs":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("arcnpc")
                break;
            case "/assets/placeables":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("arcpl")
                break;
            case "/assets/textures":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("arctext")
                break;
            case "/assets/terrain":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("arcterr")
                break; 
            case "/assets/types":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("arctype")
                break;
            case "/models":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("")
                setCurrentMimeType("model")
                break;
            case "/media":

                setCurrentFiles([
                    { to: directory + "/media/audio-video", name: "audio-video", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/media/audio", name: "audio", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/media/video", name: "video", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                ])
                props.setSearchValue(null)
                setCurrentType("")
                setCurrentMimeType("")
                break;
            case "/media/audio-video":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentMimeType("media")
                setCurrentType("")
                break;
            case "/media/audio":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("audio")
                setCurrentMimeType("media")
                break;
            case "/media/video":
                setCurrentFiles(allFiles)
                props.setSearchValue(l)
                setCurrentType("video")
                setCurrentMimeType("media")
                break;
            default:
             
                setCurrentFiles([
                    { to: directory + "/all", name: "All", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/assets", name: "Assets", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/images", name: "Images", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/models", name: "Models", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                    { to: directory + "/media", name: "Media", mimeType: "folder", type: "folder", hash: "", lastModified: null, size: null, netImage: { opacity: .7, backgroundColor: "", image: "/Images/icons/folder-outline.svg", width: 15, height: 15, filter: "invert(100%)" } },
                ])
                setCurrentMimeType("")
                props.setSearchValue(null)
                setCurrentType("")
                break;

        }
           

    }, [location, allFiles])

    useEffect(()=>{
        if(props.optionChanged != undefined)
        {
            const index = props.optionChanged

            if (index != null && typeOptions.length > 0) {
                const value = typeOptions[index].value
                const to = directory + value

                if (location.pathname != to) navigate(to)
            } 
        }
    },[props.optionChanged])
   
    useEffect(()=>{
        if(props.onChange != undefined)
        {
            const { name, value } = props.onChange;

            if (name == "searchText") {
                setSearchText(value)
            }
        }
    },[props.onChange])
    



    const fileSelected = (file) =>{

    }

    return ( 
       
       
            <div style={{ marginTop:15, display: "flex", flex: 1, height: (pageSize.height - 100), minWidth: "600", overflowX: "scroll", padding: "15px" }}>

                <FileList fileView={{ type: "icons", direction: "row", iconSize: { width: 100, height: 100 } }}
                    onChange={fileSelected}
                    filter={{ name: searchText, mimeType: currentMimeType, type: currentType }}
                    files={currentFiles}
                />
            </div>

    )
}
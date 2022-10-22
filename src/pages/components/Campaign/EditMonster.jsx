import React, { useEffect, useState } from "react";
import useZust from "../../../hooks/useZust";
import SceneMonster from "./SceneMonster";

const EditMonster = ({selectedMonster,onEditMonster,onClose, monsters, ...props}) =>{

    const socket = useZust((state) => state.socket)
    const [typeOptions, setTypeOptions] = useState(
        [{ value: 0, label: "All" }]
    )
    const [subTypeOptions, setSubTypeOptions] = useState(
        [{ value: 0, label: "All" }]
    )

    const [sizeOptions, setSizeOptions] = useState(
        [{ value: -1, label: "N/A" }]
    )
    
    const [showSceneMonster, setShowSceneMonster] = useState(false);

    useEffect(()=>{
        socket.emit("getMonsterAttributes", (types, subTypes, sizes) => {
            var array = [];
            array.push({ value: "0", label: "All" });
            types.forEach(type => {
                array.push(
                    { value: type[0], label: type[1] }
                )
            });

            setTypeOptions(array)

            const subArray = [];
            subArray.push({ value: "0", label: "All" });
            subTypes.forEach(type => {
                subArray.push(
                    { value: type[0], label: type[1] }
                )
            });

            setSubTypeOptions(subArray);

            const sizeArray = [];
            sizeArray.push({ value: "0", label: "All" });
            sizes.forEach(size => {
                sizeArray.push(
                    { value: size[0], label: size[1] }
                )
            });

            setSizeOptions(sizeArray)

            setShowSceneMonster(true);
        })
    },[])

    return (
        <>
        {showSceneMonster &&

            <SceneMonster
                typeOptions={typeOptions}
                subTypeOptions={subTypeOptions}
                sizeOptions={sizeOptions}

                selectedMonster={selectedMonster}
                onAddMonster={(monster) => {
                  
                    onEditMonster(monster);
                }}
                onClose={() => {
                    onClose();
                }}

            />
         
        }
        </>
    )
}

export default EditMonster;
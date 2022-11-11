import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RealmGateway } from "./RealmGateway";


export const Realm = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [showIndex, setShowIndex] = useState(0)
    const [navState, setNavState] = useState(null)

    useEffect(() => {
        const currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

        setSubDirectory(sD)

        switch (sD) {
            case "/gateway":
                setShowIndex(0);
                break;
            default:
                navigate("/realms")
                break;
        }
    }, [location])


    return (
        <>
        
        {
            showIndex == 0 &&
            <RealmGateway />
        }</>
    )
}
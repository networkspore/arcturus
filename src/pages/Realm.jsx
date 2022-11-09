import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateRealmPage } from "./CreateRealmPage";
import { RealmConfig } from "./RealmConfig";

export const Realm = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [showIndex, setShowIndex] = useState(0)

    useEffect(() => {
        const currentLocation = location.pathname;

        const secondSlash = currentLocation.indexOf("/", 1)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

        setSubDirectory(sD)

        switch (sD) {
            case "/config":
                setShowIndex(1)
                break;
            default:
                setShowIndex(0)
                break;
        }
    }, [location])
    return (
        <>
        
        {
            showIndex == 1 &&
            <RealmConfig />
        }</>
    )
}
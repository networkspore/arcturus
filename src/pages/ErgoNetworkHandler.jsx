import React, { useEffect } from "react";

import produce from "immer";
import useZust from "../hooks/useZust";
import { ImageDiv } from "./components/UI/ImageDiv";
import { useNavigate } from "react-router-dom";

import { status } from "../constants/constants";

import { ErgoDappConnector } from "ergo-dapp-connector";

export const ErgoNetworkHandler = (props ={}) => {
    const navigate = useNavigate()
    const connected = useZust((state) => state.connected)

    const configFile = useZust((state) => state.configFile)


 
    return (
        <>
          {
            connected &&
                <ImageDiv onClick={(e)=>{
                    navigate("/home/ergo")
                }} width={30} height={30} netImage={{ image: "/Images/icons/unlink-outline.svg", width:20, height:20, filter:"invert(100%)" }} /> 
          }
        </>
    )
}
import React, { useState, useEffect, useRef } from "react";
import useZust from "../../../hooks/useZust";
import styles from "../../css/home.module.css"

export const ContactsBox = (props = {}) => {

    const contactsDivRef = useRef()
    const parentDivRef = useRef();

    const activeBorder = "5px ridge #ffffff20";
    const inactiveBorder = "5px solid #ffffff08"

    const [showContacts, setShowContacts] = useState(false)
    const [hideContacts, setHideContacts] = useState(false)
    const [contacts, setContacts] = useState([])
    const [bounds, setBounds] = useState({ width: 300 })
    const [boxHeight, setBoxHeight] = useState(200)
    const [textAlign, setTextAlign] = useState("left")
    const [border, setBorder] = useState(inactiveBorder)
    const pageSize = useZust((state) => state.pageSize)

    useEffect(() => {
        if (parentDivRef.current) {
            const bounds = parentDivRef.current.getBoundingClientRect()
            setBounds(bounds)
        }
        setBoxHeight("boxHeight" in props ? props.boxHeight : 300)
        setHideContacts("hideContacts" in props ? props.hideContacts : false)
        setTextAlign("inputTextAlign" in props ? props.inputTextAlign : "left")
    }, [props, parentDivRef.current, pageSize])

    async function onMessageSend(e) {

      

    }

    return (
        <div ref={parentDivRef} style={{ flex: 1, display: "flex", flexDirection: "column", }}>
            <div ref={contactsDivRef} style={{
                position: hideContacts ? "fixed" : "block",
                textAlign: "left",
                color: "white",
                overflowY: "scroll",

                width: hideContacts ? bounds.width : "100%",
                height: boxHeight
            }}>
                {contacts}
            </div>
        </div>
    )
}
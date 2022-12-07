import React, { useState, useEffect, useRef } from "react";
import useZust from "../../../hooks/useZust";
import styles from "../../css/home.module.css"
import { ImageDiv } from "./ImageDiv";

export const ContactsBox = (props = {}) => {

    const contactsDivRef = useRef()
    const parentDivRef = useRef();

    const activeBorder = "5px ridge #ffffff20";
    const inactiveBorder = "5px solid #ffffff08"

    const [showContacts, setShowContacts] = useState(false)
    const [hideContacts, setHideContacts] = useState(false)
    const [contacts, setContacts] = useState([])
    const [bounds, setBounds] = useState({ width: 300 })

    const defaultListStyle = {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        color: "white",
        overflowY: "scroll",
        width: "100%",
        height: "100%",
        maxHeight: 300
    }

    const [listStyle, setListStyle] = useState(defaultListStyle)

    const [border, setBorder] = useState(inactiveBorder)
    const pageSize = useZust((state) => state.pageSize)

    useEffect(() => {
        if (parentDivRef.current) {
            const bounds = parentDivRef.current.getBoundingClientRect()
            setBounds(bounds)
        }
    
    }, [parentDivRef.current, pageSize])

   
    const [contactsList, setContactsList] = useState([])

    useEffect(()=>{
        if(props.listStyle != null)
        {
            let tmpStyle = []

            const dlsNames = Object.getOwnPropertyNames(defaultListStyle)

            dlsNames.forEach(name => {
                tmpStyle[name] = defaultListStyle[name]
            });

            const listStyleNames = Object.getOwnPropertyNames(props.listStyle)

            listStyleNames.forEach(name => {
                dlsNames[name] = props.listStyle[name]
            });
        }
    },[props.listStyle])

    useEffect(() => {
        if(Array.isArray(props.contacts)){
            const contacts = props.contacts
            const contactRows = []
            
            contacts.forEach((contact) => {
                const contactUserID = contact.user.userID
                const contactImage = contact.user.image ;
                const contactUserName = contact.user.userName
                console.log(contact)
                contactRows.push(
                    <div key={contactUserID} className={styles.result} style={{
                        paddingBottom: 5, display: "flex", alignItems: "center", fontSize: "15px", fontFamily: "WebPapyrus"
                    }}  >  
                        <div style={{display:"flex", paddingTop:3}}>
                        <ImageDiv width={30} height={30} netImage={contact.user.image.fileID != null && contact.user.image.fileID > 0 ? {
                            scale: 1,
                            update: {
                                command: "getIcon",
                                file: contactImage,
                                waiting: { url: "/Images/spinning.gif" },
                                error: { url: "/Images/icons/person.svg", style: { filter: "invert(100%)" } },

                            },
                            backgroundColor: "#44444450",
                            backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                        } : {
                            image: "/Images/icons/person.svg",
                            filter: "invert(100%)",
                            backgroundColor: "#44444450",
                            backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
                        }} />

                        <div style={{width:10}}> &nbsp;</div>
                        
                        <div style={{fontFamily:"WebPapyrus", fontSize:16, display:"flex", alignItems:"center"}}>
                            {contactUserName}
                        </div>
                        </div>
                    </div>
                )
                    
            });
        
            setContactsList(contactRows)
        }
    }, [props.contacts])

  /*
    const user = {
        userID: one[0],
        userName: one[1],
        userHandle: one[2],
        userSocket: one[3],
        statusID: one[4],
        image: {
            fileID: -1,
            fileName: null,
            fileType: null,
            fileCRC: null,
            fileMimeType: null,
            fileSize: null,
            fileLastModified: null
        }
    }
*/
    return (
        <div ref={parentDivRef} style={{ flex: 1, display: "flex", flexDirection: "column", }}>
            <div ref={contactsDivRef} style={listStyle}>
                {contactsList}
            </div>
        </div>
    )
}
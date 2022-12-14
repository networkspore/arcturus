import React, { useState, useRef, useEffect } from "react"
import produce from "immer"
import useZust from "../hooks/useZust"


export const ContactsHandler = (props = {}) => {

    const contactsCmd = useZust((state) => state.contactsCmd)
    const contacts = useZust((state) => state.contacts)
    
    const addSystemMessage = useZust((state) => state.addSystemMessage)

    const [newMessages, setNewMessages] = useState([])

    const updateContact = (contact) => useZust.setState(produce((state)=>{
        const index = state.contacts.findIndex(c => c.userID == contact.userID)

        if(index != -1)
        {
            state.contacts[index] = contact
        }
    }))

    const updateNewMessagesList = () => {
        for(let i = newMessages.length -1; i > -1 ; i--)
        {
            
            const userID = newMessages[i].userID
            const subject = newMessages[i].subject

            
            const textSnip = subject.slice(0, 15) + subject.length > 15 ? "..." : ""
            
            const sysMessage = {
                id: "c" + userID,
                text: textSnip,
                cancelable: true,
                navigate: null,
                deleteOn: "",
                netImage: { image: "/Images/icons/mail-outline.svg", width: 20, height: 20, filter: "invert(100%)" },
                callback: onPrivateMessage
            }

          
            addSystemMessage(sysMessage)

        }
        setNewMessages([])
    }

    useEffect(()=>{
        
       
        
        const cmd = contactsCmd.cmd

        switch (cmd) {
            case "userStatus":
                updateUserStatus(contactsCmd.params)
                break;
            case null:
            case undefined:
            default:
                break;
        }
    },[contactsCmd])

    const updateUserStatus = (params) => {
        const userID = params.userID
        const statusID = params.statusID
        const userSocket = params.userSocket
        const accessID = params.accessID

        const contactIndex = contacts.findIndex(c => c.userID == userID)

        if(contactIndex != -1){
            
             
            let newContact = {
                userID: contacts[contactIndex].userID,
                userName: contacts[contactIndex].userName,
                userHandle: contacts[contactIndex].userHandle,
                image: contacts[contactIndex].image,
                userSocket: userSocket,
                statusID: statusID,
                accessID: accessID,
                
            }
            updateContact(newContact)
        }
       

    }

    const onPrivateMessage = (msg) =>{

    }

    return (
        <>
            {newMessages.length > 0 &&
                <ImageDiv
                    onClick={(e) => {
                        updateNewMessagesList()
                    }}
                    width={30} height={30} netImage={{ scale: .7, image: "/Images/icons/mail-unread-outline.svg", filter: "invert(100%)" }} />
            }
        </>
    )
}

import React, { useState, useEffect, useRef } from "react";

import { useLocation, useNavigate } from 'react-router-dom';
import useZust from "../hooks/useZust";

import produce from "immer";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";

import { MessagePage } from "./MessagePage";

import { OptionsMenu } from "./components/UI/OptionsMenu";
import { access, status } from "../constants/constants";
import { ContactPage } from "./ContactPage";





export const ContactsPage = () => {

    const navigate = useNavigate()
   
   
    const setPage = useZust((state) => state.setPage)

    
    const pageSize = useZust((state) => state.pageSize);

  
    const [peopleFound, setPeopleFound] = useState([]);
    const [foundList, setFoundList] = useState([])


    const [contactsList, setContactsList] = useState([])
    const [requestedList, setRequestedList] = useState([])
    const [confirmingList, setConfirmingList] = useState([])

    const [showListIndex, setShowListIndex] = useState(1)

    const [showIndex, setShowIndex] = useState(0)



    const searchInputRef = useRef();

    const [requestContact, setRequestContact] = useState(null)
    const [acknowledgeContact, setAcknowledgeContact] = useState(null)


    const setSocketCmd = useZust((state) => state.setSocketCmd)
    const contacts = useZust((state) => state.contacts)

    const currentContact = useZust((state) => state.currentContact)
    const setCurrentContact = useZust((state) => state.setCurrentContact)

    const setContacts = (c) => useZust.setState(produce((state)=>{
        state.contacts = c;
    }))

    const addContact = (c) => useZust.setState(produce((state) => {
            state.contacts.push(c);
        }))

    const messageRef = useRef();
  

    const onSearch = (e = new Event("search")) => {
        const {value} = e.target;
        
        if(value == "")
        {
            setPeopleFound([])
            setShowListIndex(1)
        }else{
            if(value.length > 2){
                setShowListIndex(2)
            }else{
                setPeopleFound([])
                setShowListIndex(1)
            }
        }
        
        if(value.length > 2)
        {

            setSocketCmd({
                cmd: 'searchPeople', params: { text: value + ""  }, callback: (response) => {
            
                setPeopleFound(response);
           
            }})
       
        }else{
            setPeopleFound(produce((state) => {state = []}))
            //setCampaignsFound(produce((state) => { state = [] }))
        }
    }

    
    const removePerson = (userID) => {
        setPeopleFound(produce((state)=>{
            
            let i = 0;
            while(i < state.length)
            {
                if(state[i].userID == userID){
                    state.splice(i, 1)
                }
                i++;
            }
        }))
    }

    const onRequestContact = () => {
        if(requestContact != null)
        {
            let contact = requestContact;
            let msg = messageRef.current.value;
            setSocketCmd({
                cmd: "requestContact", params: { contactUserID: contact.userID, msg:msg }, callback: (complete) => {

                const msg = complete.msg;
                if (complete.requested == true){
                    contact["statusID"] = status.confirming
                    addContact(contact)
                    removePerson(contact.userID)
                    setRequestContact(null)
                    
                }else{
              
                    setRequestContact(null)
                }
                messageRef.current.value = "";

            }})
            
        }
    }

    useEffect(()=>{
        setPage(3)
    },[])

    const location = useLocation();
    const [subDirectory, setSubDirectory] = useState("")

    useEffect(() => {
        const currentLocation = location.pathname;
        const directory = "/contacts"
        const secondSlash = currentLocation.indexOf("/", directory.length)

        const subLocation = secondSlash == -1 ? "" : currentLocation.slice(secondSlash)


        const thirdSlash = subLocation.indexOf("/", 1)

        const sD = subLocation.slice(0, thirdSlash == -1 ? subLocation.length : thirdSlash)

        setSubDirectory(sD)

        
    },[location])

    const [recipients, setRecipients] = useState([])

    const addMessageRecipient = (r) => setRecipients(produce((state) =>{
      
  
        const length = state.length
            if (0 == length )
            {   
               state.push(r)
            }else{

                let found = false;
                for(let i =0 ; i < state.length ; i++){
              
                 
                    if(state[i].userID == r.userID){
                     
                        found = true;
                    }
                }
                if(found != true){
              
                    
                        state.push(r)
                    
                }
            }
            
    }))

    const onMailContact = (contact) => {

    } 

    /*  addMessageRecipient(contact);
        if(subDirectory != "/message")
        {
            navigate("/network/message")
        }*/

    const onConfirmingContact = (contact) => {
        console.log(contact)
    }
    
    const prevUserID = useRef({value: null})
    

    const onContactClick = (contact) => {
     
        setCurrentContact(contact)
        const navString = "/contacts/" + contact.userName
        navigate(navString )
    }

    useEffect(()=>{
        if(contacts.length > 0)
        {
            let tmpList = [];
            let requestList = [];
            let confirmList = []
  
            contacts.forEach((contact, i) => {
                const name = contact.user.userName;
              
                const accepted = contact.accepted
                const requested = contact.requested;
                const contactImage = contact.user.image;

                const userContact = contact
            
                
                if(requested){
               
                        requestList.push(
                            <div key={i} >
                                <div style={{ fontSize: "14px", display: "flex", justifyContent: "left", alignItems: "center", fontFamily: "WebPapyrus" }}
                                    className={styles.result} onClick={(e) => {
                                        e.stopPropagation()
                                        onContactClick(userContact)
                                    }}>
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
                                    <div style={{ paddingLeft: 10, textShadow: "2px 2px 2px black" }}>

                                        {name}

                                    </div>
                                    <div style={{ flex: 1 }} />

                                </div>
                               
                            </div>
                        
                        )
                }else if(accepted){
                        tmpList.push(
                            <div key={i} >
                            <div style={{ fontSize: "14px", display: "flex", justifyContent: "left", alignItems: "center", fontFamily: "WebPapyrus" }} 
                            className={styles.result} onClick={(e) =>{
                                e.stopPropagation()
                                onContactClick(userContact)
                            }}>
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
                                        image:"/Images/icons/person.svg",
                                        filter:"invert(100%)",
                                        backgroundColor: "#44444450",
                                        backgroundImage: "radial-gradient(#cccccc 5%, #0000005 100%)",
}}/>
                                <div style={{ paddingLeft:10, textShadow: "2px 2px 2px black" }}>
                                   
                                    {name}
                                    
                                </div>
                                <div style={{ flex: 1 }} />

                            </div>
                               
                            </div>
                        )
                    
                } else {
                    confirmList.push(
                        <div key={i} >
                            <div style={{ fontSize: "14px", display: "flex", justifyContent: "left", alignItems: "center", fontFamily: "WebPapyrus" }}
                                className={styles.result} onClick={(e) => {
                                    e.stopPropagation()
                                    onContactClick(userContact)
                                }}>
                                <ImageDiv width={30} height={30} netImage={contact.image.fileID != null && contact.image.fileID > 0 ? {
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
                                <div style={{ paddingLeft: 10, textShadow: "2px 2px 2px black" }}>

                                    {name}

                                </div>
                                <div style={{ flex: 1 }} />

                            </div>
                            
                        </div>
                    )
                }

            });
            setConfirmingList(confirmList)
            setRequestedList(requestList)
            setContactsList(tmpList)
        }
    },[contacts])

    const onRequestAcknowledge = (contact) =>{
        if(acknowledgeContact == contact){
            setAcknowledgeContact(null)
        }else{
            setAcknowledgeContact(contact)
        }
    }

    const onAcknowledgeContact = (response) => {
        const contactID = acknowledgeContact.userID;
        setSocketCmd({
            cmd: "acknowledgeContact", params: { response: response, contactID: contactID }, callback: (result) => {
            if(result.success){
             
            }else{
        
                alert("Unable to acknowledge contact. Try again later.")
            }
            
        }})
        setAcknowledgeContact(null)
    } 




    useEffect(()=>{
        if (showListIndex == 2 && peopleFound.length > 0){
        let tmpArray = [];

        for(let i = 0; i < peopleFound.length ; i++){
           // const userID = peopleFound[i].userID;
                const contact = peopleFound[i]

                const name =  contact.userName;
                const contactImage = contact.image

                tmpArray.push(
                    <div key={i} onClick={(e) => {onContactClick(contact)}} style={{ fontSize: "14px", display: "flex", fontFamily:"WebPapyrus", alignItems:"center" }} className={styles.result}>
                        <div>
                            <ImageDiv width={30} height={30} netImage={contactImage.fileID != null && contactImage.fileID > 0 ? {
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
                        </div>
                        <div style={{ flex: 1, paddingLeft:10}}>{name}</div>
                    </div>
                )
        }
        
            setFoundList(tmpArray)
        }
        if(peopleFound.length < 1)
        {
            if(foundList.length != 0)
            {
                setFoundList([])
            }
        }
    },[peopleFound])

    
    const endSearch = () => {
        searchInputRef.current.value = "";
        setShowListIndex(1);
    }


 //"inset 10px #boxShadow:"inset -5px 0 0 #776a05DD, inset 0 -5px 0 #776a05DD, inset 0px 0 0 #776a05, inset 0 0px 0 #776a05"776a05"
 //boxShadow:"inset -5px 0 0 #776a05DD, inset 0 -5px 0 #776a05DD, inset 0px 0 0 #776a05, inset 0 0px 0 #776a05"
    return (
        <>
        {currentContact != null && 
            <ContactPage />
        }

            {currentContact == null &&
            <div  style={{
                width: 300, height: pageSize.height, 
                    backgroundImage: "linear-gradient(to bottom, #000000,#20232570)" ,
                position: "fixed", 
                padding: 0,  left:95, top: 0 ,
                boxShadow: "0 0 10px #ffffff05, 0 0 20px #ffffff05", 
                }}>
                 
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center",  padding: "10px" }}>
                    <ImageDiv width={130} height={130} netImage={{
                        image: "/Images/logo.png",
                        
                    }} />
                    <div style={{ width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)", display:"flex", justifyContent:"center" }}>
                        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}} >
                        <div style={{

                            textAlign: "center",
                            fontFamily: "Webpapyrus",
                            fontSize: "16px",
                            fontWeight: "bolder",
                            color: "#cdd4da",
                            textShadow: "2px 2px 2px #101314",
                            display:"flex",
                              justifyContent: "center",
                              alignItems:"center",
                        }} >Arcturus Network</div>
                            <div style={{ fontSize: 12, color: "#cdd4da", fontFamily: "Webrockwell" }}>.io</div>
                        </div>
                        
                    </div>

                    <div style={{ height: 2, width: "100%", backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)", }}>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div style={{

                        display: "flex",
                        width: 300,
                        justifyContent: "center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom:3,
                        paddingTop: 3,

                    }}>
                        <input onKeyDown={(e) => {
                            if (e.key == "Esc") {
                                endSearch();
                            }
                        }}

                            ref={searchInputRef}
                            style={{
                                fontSize:"14px",
                                backgroundColor: "#000000", width: 200, textAlign: "center",
                                color: showListIndex == 2 ? "white" : "#cdd4da", textShadow: "1px 1px 1px"
                            }}
                            onChange={e => onSearch(e)}
                            className={styles.searchInput}
                            type="text"
                            placeholder="Search..." />
                    </div>
                   
                </div>
                <div style={{ display:"flex", justifyContent:"center"}}>
                  
                <div style={{width:280}}>
                        <div style={{
                            fontWeight: "bolder",
                        textAlign: "center",
                        width: "100%",
                        fontSize: "16px",
                        fontFamily: "WebPapyrus",
                        color: "#888888",
                        textShadow: "3px 3px 4px black",
                        paddingTop: "10px",
                        paddingBottom: "6px",
                                     }}>
                                    
                                    &nbsp;</div>
                        
                        <div style={{}}>
                  
                               

                              
                               
                               
                           
                        
                         <div style={{display:"flex"}}>
                            <div style={{width:5, height:pageSize.height-90}}>&nbsp;</div>
                            <div style={{ 
                            
                            height: "100%", 
                                    flex: 1
                            
                            }}>
                                {showListIndex == 1 && contactsList.length > 0 &&
                                < div style={{
                                  
                                    
                                    
                                }}>
                                    
                                    
                                    <div 
                                        onClick={()=>{
                                            if (showListIndex == 1) {
                                                setShowListIndex(0)
                                            } else {
                                                endSearch()
                                                setShowListIndex(1);
                                            }
                                        }}
                                    style={{
                                        
                                      
                                        fontWeight:"bold",
                                        width: "100%",
                                        fontSize: "14px",
                                        fontFamily: "WebPapyrus",
                                        color: "#888888",
                                        textShadow: "3px 3px 4px black",
                                        paddingTop: "10px",
                                        paddingBottom: "6px",
                                     
                                    }}>
                                                <div> &nbsp; Contacts</div>

                                            {showListIndex != 1 &&
                                                <>
                                                    <div style={{ flex: 1 }} />
                                                    <div style={{  }}> {requestedList.length} </div>
                                                </>
                                            }
                                    </div>
                                            <div style={{
                                                marginBottom: '2px',

                                                height: "1px",
                                                width: "100%",
                                                backgroundImage: "linear-gradient(to right,  #77777730,#77777755, #000304DD, #000304DD)",
                                            }}>&nbsp;</div>

                                    <div style={{}}>
                                        <div style={{
                                            
                                            marginBottom: '2px',

                                            height: "1px",
                                            width: "100%",
                                            backgroundColor:  "#000304DD",

                                        }}></div>
                                        <div style={{marginTop:"5px", marginLeft:0, marginRight:10}}>
                                        {contactsList}
                                        </div>
                                    </div>
                                </div>
                                }
                                {showListIndex == 2 &&
                                    <>
                                   

                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                
                                                width: "100%",
                                                fontSize: "16px",
                                                fontFamily: "WebPapyrus",
                                                color: "#888888",
                                                textShadow: "3px 3px 4px black",
                                                paddingTop: "10px",
                                                paddingBottom: "6px",
                                                display: "flex",
                                                
                                        }}>
                                                <div style={{display:"flex", flex:1, alignItems:"end", cursor:"default"}}>Search Results</div>
                                                <div className={styles.glow} onClick={(e)=>{endSearch()}} style={{cursor:"pointer", paddingRight:10}}><ImageDiv width={20} height={25} netImage={{image:"/Images/icons/close-outline.svg", filter:"invert(100%)"}}/></div>
                                        </div>

                                     
                                        
                                        <div style={{
                                            marginBottom: '2px',

                                            height: "1px",
                                            width: "100%",
                                            backgroundImage: "linear-gradient(to right,  #77777730,#77777755, #000304DD, #000304DD)",
                                        }}>&nbsp;</div>


                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: pageSize.height / 3,
                                            flex: 1,

                                            overflowY: "scroll",
                                            color: "#cdd4da",
                                            padding: "10px"
                                        }}
                                        >

                                            {foundList}
                                        </div>
                                    
                                    </>
                                }
                                {requestedList.length > 0 &&
                                    < div style={{
                                      
                                        width: "100%",

                                    }}>


                                        <div 
                                            onClick={(e) => {
                                                if (showListIndex == 3) {
                                                    setShowListIndex(1)
                                                } else {
                                                    endSearch()
                                                    setShowListIndex(3);
                                                }

                                            }}
                                            className={styles.glowText} 
                                        style={{
                                           
                                            fontWeight:"bold",
                                            width: "100%",
                                            fontSize: "14px",
                                            fontFamily: "WebPapyrus",
                                            color: "#888888",
                                            textShadow: "3px 3px 4px black",
                                            paddingTop: "10px",
                                            paddingBottom: "6px",
                                            display:"flex"
                                        }}>
                                                <div>&nbsp; Requests</div>

                                            {showListIndex != 3 &&
                                                <>
                                                    <div style={{ flex: 1 }} />
                                                    <div style={{ }}> {requestedList.length} </div>
                                                </>
                                            }
                                        </div>
                                        {showListIndex == 3 &&
                                            <>
                                                <div style={{
                                                    marginBottom: '2px',

                                                    height: "1px",
                                                    width: "100%",
                                                    backgroundImage: "linear-gradient(to right,  #77777730,#77777755, #000304DD, #000304DD)",
                                                }}>&nbsp;</div>

                                        <div style={{}}>
                                            <div style={{

                                                marginBottom: '2px',

                                                height: "1px",
                                                width: "100%",
                                              

                                            }}></div>
                                            <div style={{ margin: "15px" }}>
                                                {requestedList}
                                            </div>
                                        </div>
                                        </>
                                        }
                                    </div>
                                }
                                {confirmingList.length > 0 &&
                                    < div style={{

                                        width: "100%",

                                    }}>


                                        <div onClick={(e)=>{
                                            if(showListIndex == 4)
                                            {
                                                setShowListIndex(1)
                                            }else{
                                                endSearch()
                                                setShowListIndex(4);
                                            }
                                        }}
                                        className={styles.glowText} 
                                        style={{
                                           
                                        
                                            width: "100%",
                                            fontSize: "14px",
                                            fontFamily: "WebPapyrus",
                                            fontWeight:"bold",
                                            textShadow: "3px 3px 4px black",
                                            paddingTop: "10px",
                                            paddingBottom: "6px",
                                          
                                            display:"flex"
                                        }}>
                                                <div>&nbsp; Pending &nbsp;</div>
                                           
                                            {showListIndex != 4 && 
                                            <>
                                                <div style={{flex:1}} />
                                                <div style={{}}> {confirmingList.length} </div>
                                            </>
                                            } 
                                        </div>
                                        {showListIndex == 4 &&
                                        <>
                                                <div style={{
                                                    marginBottom: '2px',

                                                    height: "1px",
                                                    width: "100%",
                                                    backgroundImage: "linear-gradient(to right,  #77777730,#77777755, #000304DD, #000304DD)",
                                                }}>&nbsp;</div>
                                       
                                       
                                        <div style={{}}>
                                            <div style={{

                                                marginBottom: '2px',

                                                height: "1px",
                                                width: "100%",
                                                backgroundColor: "#000304DD",

                                            }}></div>
                                            <div style={{ margin: "15px" }}>
                                                {confirmingList}
                                            </div>
                                        </div>
                                        </>
                                        }
                                    </div>
                                }

                        </div>
                                <div style={{width:5}}></div>
                            </div>
                    </div>
                </div>  
        
            </div>
        </div>
        }

            {
                showIndex == 1 &&
                <MessagePage recipients={recipients} />
            }
            
            { requestContact != null &&
                
                < div style={{
                    position: "fixed",
                    backgroundImage: "linear-gradient(to bottom, #00000088,#10131488)",
                    width: 300,
                    left: 395,
                    top: 300,
                    height: 220,
                    boxShadow: "inset 0px 0px 1px #7F7F7F",
                }}>
                
                    <div style={{
                        fontWeight: "bolder",
                        textAlign: "center",
                        width: "100%",
                        fontSize: "20px",
                        fontFamily: "Papyrus",
                        color: "#cdd4da",
                        textShadow: "3px 3px 4px black",
                        paddingTop: "15px",
                        paddingBottom: "10px",
                        
                    }}>
                       Request &nbsp; Contact
                    </div>
                    <div style={{   }}>
                        <div style={{
                            marginBottom: '2px',
                           
                            height: "1px",
                            width: "100%",
                            backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                            
                        }}></div>
                        <div style={{
                            fontFamily:"WebPapyrus",
                            color:"#cdd4da",
                             textAlign: "center",
                            width: "100%",
                            paddingTop:"15px",
                            textShadow: "3px 3px 4px black"
                            
                        }}>
                        {requestContact.userName}
                        </div>
                        <div style={{
                            marginTop:"10px",
                            marginLeft:"10px",
                            marginRight:"10px",
                            display:"flex", 
                            flex:1, 
                            alignItems: "center",
                            justifyContent: "center", 
                           
                            
                            }}>
                            <textarea  placeholder="Write a message..." style={{resize:"none", fontSize:"13px",outline:0,  width:"80%",border:0, backgroundColor:"#00000060", color:"white", fontFamily:"Webrockwell"}} ref={messageRef}  />
                        </div>
                        <div style={{
                            marginBottom: '2px',

                            height: "1px",
                            width: "100%",
                            backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",

                        }}></div>
                            <div style={{
                              
                                paddingLeft:"40px",
                                display: "flex",
                                }}>
                                    <div style={{display:"flex"}}>
                                    <div style={{
                                        justifyContent: "center",
                                    

                                        display: "flex",
                                        alignItems: "center"
                                    }}>

                                        <div style={{ 
                                            paddingLeft: "10px", 
                                            paddingRight: "10px", 
                                            fontFamily:"WebPapyrus" 
                                            }} 
                                            className={styles.CancelButton} 
                                            onClick={(e)=>{setRequestContact(null)}} >
                                                Cancel
                                        </div>

                                    </div>
                                <div style={{
                                  
                                    marginLeft: "10px", marginRight: "10px",
                                    height: "80px",
                                    width: "1px",
                                    backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                }}></div>
                                    <div style={{
                                    justifyContent: "center",


                                    display: "flex",
                                    alignItems: "center"
                                }}>

                                    <div style={{ 
                                        paddingLeft: "10px", 
                                        paddingRight: "10px", 
                                        fontFamily:"WebPapyrus",
                                        width:"80px"
                                    }} 
                                    className={styles.OKButton} 
                                    onClick={(e)=>{onRequestContact()}} >
                                        Request
                                    </div>

                                </div>
                            </div>
                            </div>
                    </div>
                </div>
            }
            {acknowledgeContact != null &&
        
                < div style={{
                    position: "fixed",
                    backgroundImage: "linear-gradient(to bottom, #00000088,#10131488)",
                    width: 300,
                    left: 395,
                    top: 300,
                    height: 220,
                }}>
                    <div style={{


                        height: "1px",
                        width: "100%",
                        backgroundImage: "linear-gradient(to right, #000304DD, #77777755, #000304DD)",
                        fontFamily: "Webrockwell",
                        color: "white"
                    }}>&nbsp;</div>

                    <div style={{
                        fontWeight:"bolder",
                        textAlign: "center",
                        width: "100%",
                        fontSize: "14px",
                        fontFamily: "WebPapyrus",
                        color: "#777777",
                        textShadow: "3px 3px 4px black",
                        paddingTop: "10px",
                        paddingBottom: "6px",
                        backgroundImage: "linear-gradient(to right, #00000010, #77777720, #00000010)"
                    }}>
                        Contact &nbsp; &nbsp; Request
                    </div>
                    <div style={{}}>
                        <div style={{
                            marginBottom: '2px',
                            textAlign: "center",
                            height: "1px",
                            width: "100%",
                            backgroundImage: "linear-gradient(to right, #0003010, #77777755, #00030410)",

                        }}></div>
                        <div style={{
                            fontFamily: "WebPapyrus",
                            color: "#cdd4da",
                            textAlign: "center",
                            width: "100%",
                            paddingTop: "15px",
                            textShadow: "3px 3px 4px black"

                        }}>
                            {acknowledgeContact.userName}
                        </div>
                        <div style={{
                            marginTop: "10px",
                            marginLeft: "10px",
                            marginRight: "10px",
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection:"column"

                        }}>
                            <div style={{
                                marginBottom: '2px',

                                height: "1px",
                                width: "100%",
                                backgroundImage: "linear-gradient(to right, #00030410, #77777755, #00030410)",

                            }}></div>
                            <div style={{ fontFamily: "Webrockwell", fontSize: "13px", color:"#cdd4da", textAlign: "left", width: "80%", height:40,padding:5, backgroundColor:"#33333340", overflowY:"scroll" }}>
                                {acknowledgeContact.userContactMsg}
                           </div>
                        <div style={{
                            marginBottom: '2px',

                            height: "1px",
                            width: "100%",
                            backgroundImage: "linear-gradient(to right, #0003050, #77777755, #00030450)",

                        }}></div>
                        <div style={{

                           
                            display: "flex",
                        }}>
                            <div style={{ display: "flex" }}>
                                <div style={{
                                    justifyContent: "center",


                                    display: "flex",
                                    alignItems: "center"
                                }}>

                                    <div style={{
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        fontFamily: "WebPapyrus"
                                    }}
                                        className={styles.CancelButton}
                                            onClick={(e) => { onAcknowledgeContact(false) }} >
                                        Decline
                                    </div>

                                </div>
                                <div style={{

                                    marginLeft: "10px", marginRight: "10px",
                                    height: "80px",
                                    width: "1px",
                                    backgroundImage: "linear-gradient(to bottom, #000304DD, #77777755, #000304DD)",
                                }}></div>
                                <div style={{
                                    justifyContent: "center",


                                    display: "flex",
                                    alignItems: "center"
                                }}>

                                    <div style={{
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        fontFamily: "WebPapyrus",
                                        width: "80px"
                                    }}
                                        className={styles.OKButton}
                                        onClick={(e) => { onAcknowledgeContact(true) }} >
                                        Accept
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            }
           
            
        </>
    );
    

};


/*   

     const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

     useEffect(() => {
         function handleResize() {
             setWindowDimensions(prevDimensions => 
                 getWindowDimensions()
             );
             //    setWindowDimensions();
         }

         window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
     }, []);*/
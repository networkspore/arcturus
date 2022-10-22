
import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from 'react-router-dom';
import useZust from "../hooks/useZust";
import SearchResults from "./components/UI/SearchResults";
import produce from "immer";

import styles from './css/home.module.css';
import { ImageDiv } from "./components/UI/ImageDiv";





export const SearchPage = () => {

    

  //  const setFillMainOverlay = useZust((state) => state.setFillMainOverlay);
    
   
    const setPage = useZust((state) => state.setPage)

    
    const pageSize = useZust((state) => state.pageSize);

    const scrollLeft = useZust((state) => state.scrollLeft);
    const scrollTop = useZust((state) => state.scrollTop);
  
    const [peopleFound, setPeopleFound] = useState([]);
    const [campaignsFound, setCampaignsFound] = useState([])

    const [foundList, setFoundList] = useState([])


    const [contactsList, setContactsList] = useState([])
    const [requestedList, setRequestedList] = useState([])
    const [confirmingList, setConfirmingList] = useState([])

    const [showListIndex, setShowListIndex] = useState(1)



    const socket = useZust((state) => state.socket);
    const user = useZust((state) => state.user)

    const searchInputRef = useRef();

    const [requestContact, setRequestContact] = useState(null)
    const [acknowledgeContact, setAcknowledgeContact] = useState(null)

    const contactRequests = useZust((state) => state.contactRequests)

    const contacts = useZust((state) => state.contacts)

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
            socket.emit('searchPeople', value, user.userID, (response) => {
                setPeopleFound(response);
           
            })
           /*socket.emit("searchCampaigns", value, user.userID, (response) => {
               setCampaignsFound(response);
            }) */
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
            socket.emit("requestContact", contact.userID, msg, (complete) => {
                const msg = complete.msg;
                if (complete.requested == true){
                    contact["status"] = { statusID: 3, statusName: "confirming" };
                    addContact(contact)
                    removePerson(contact.userID)
                    setRequestContact(null)
                    alert(msg)
                }else{
                    alert(msg)
                    setRequestContact(null)
                }
                messageRef.current.value = "";

            })
            
        }
    }

useEffect(()=>{
    setPage(3)
},[])



const onContact = (contact) => {
    console.log(contact)
} 

const onConfirmingContact = (contact) => {
    console.log(contact)
}

useEffect(()=>{
    if(contacts.length > 0)
    {
        let tmpList = [];
        let confirmList = [];
        contacts.forEach(contact => {
            const name = contact.userName;
            const status = contact.status;
            
            if (status.statusName != "confirming")
            {
                tmpList.push(
                    <div onClick={(e) => { onContact(contact) }} style={{ fontSize: "13px", display: "flex", justifyContent:"left", alignItems:"center", fontFamily: "WebPapyrus" }} className={styles.result}>

                        <div style={{  textShadow:"2px 2px 2px black"}}>{name}</div>
                        <div style={{ flex:1 }} />
                        
                    </div>
                )
            }else{
                confirmList.push(
                    <div onClick={(e) => { onConfirmingContact(contact) }} style={{ fontSize:"13px", display: "flex", justifyContent: "left", alignItems: "center", fontFamily: "WebPapyrus" }} className={styles.result}>

                        <div style={{ textShadow: "2px 2px 2px black" }}>{name}</div>
                    </div>
                )
            }
        });
        setConfirmingList(confirmList)
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

    socket.emit("acknowledgeContact", response, contactID, (result)=>{
        if(result.success){
            console.log(result)
        }else{
            console.log(result)
            alert("Unable to acknowledge contact. Try again later.")
        }
        
    })
    setAcknowledgeContact(null)
} 

    useEffect(() => {
        if (contactRequests.length > 0) {
            let tmpList = [];

            contactRequests.forEach(contact => {
                const name = contact.userName;
           

                tmpList.push(
                    <div onClick={(e) => { onRequestAcknowledge(contact) }} style={{ fontSize: "13px", display: "flex", justifyContent: "left", alignItems: "center", fontFamily: "WebPapyrus" }} className={styles.result}>

                        <div style={{ textShadow: "2px 2px 2px black" }}>{name}</div>
             
                    </div>
                )

            });

            setRequestedList(tmpList)
        }
    }, [contactRequests])

useEffect(()=>{
    if (showListIndex == 2 && peopleFound.length > 0){
       let tmpArray = [];

       for(let i = 0; i < peopleFound.length ; i++){

            const name =  peopleFound[i].userName;

            tmpArray.push(
                <div onClick={(e)=>{
                    setRequestContact(peopleFound[i])
                }} style={{ fontSize: "13px", display: "flex", fontFamily:"WebPapyrus" }} className={styles.result}>
                    
                    <div style={{ flex: 1}}>{name}</div>
            
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

            <div style={{
                width: 300, height: pageSize.height, 
                backgroundImage:"linear-gradient(to bottom, #00000088,#10131488)", 
                position: "fixed", 
                padding: 0,  left:95, top: 0 ,
                boxShadow: "0 0 10px #ffffff05, 0 0 20px #ffffff05", 
                }}>
                <div style={{
               
                    textAlign: "center",

                }}></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center",  padding: "10px" }}>
                    <ImageDiv netImage={{
                        image: "Images/logo.png",
                        width: 130,
                        height: 130,
                    }} />
                    <div style={{ width: 200, backgroundImage: "linear-gradient(to right, #000304DD, #77777733, #000304DD)" }}>
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
                        }} >Arcturus<div style={{fontSize:12, fontFammily:"Webrockwell"}}>RPG.io</div></div>

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
                                        <div style={{margin:"15px"}}>
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
                                                fontSize: "14px",
                                                fontFamily: "WebPapyrus",
                                                color: "#888888",
                                                textShadow: "3px 3px 4px black",
                                                paddingTop: "10px",
                                                paddingBottom: "6px",
                                                display: "flex"
                                        }}>
                                            &nbsp; &nbsp; Search Results</div>

                                     
                                        
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
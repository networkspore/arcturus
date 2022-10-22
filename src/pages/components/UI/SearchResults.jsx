import React, { useEffect, useState } from 'react';
import useZust from '../../../hooks/useZust';
import styles from '../../css/home.module.css';
import produce from 'immer';
import { useNavigate } from 'react-router-dom';


const SearchResults = ({props,onClose, people=[], campaigns=[] }) => {

 
    
    const [peopleItems, setPeopleItems] = useState([]);
    const [campaignItems, setCampaignItems] = useState([]);

    const [contextPos, setContextPos] = useState([0,0]);
    const [showContext, setShowContext] = useState(false);

    const [activeKey, setActiveKey] = useState(-1);


    const socket = useZust((state) => state.socket);

    const user = useZust((state) => state.user)

    const navigate = useNavigate();
    const addCampaign = (c) => useZust.setState(produce((state) => {
        state.campaigns.push(c);
    }));

    const sendFriendRequest = (e) => {
        
    }

    const joinCampaign = (e) => {
        const campaignIndex = e.target.id;
        const campaign = campaigns[campaignIndex];
        const roomID = campaign[3];
        const campaignID = campaign[0];

        socket.emit("joinCampaign", user.userID,user.userName, campaignID, roomID, (callback) => {
            if(callback > 0)
            {
                addCampaign(campaign);
                navigate("/realm", { replace: true, state: { campaignID: campaign[0], campaignName: campaign[1], roomID: campaign[3], adminID: campaign[4] } })
            }else{
                alert("Unable to join realm.")
            }
        })
    }

    useEffect(()=>{
        const onContextMenu = (e) => {
            e.preventDefault();
            const { pageX, pageY } = e;
           
            if(activeKey != -1){
          //  if ((pageY > yMin && pageY < 655) && (pageX > xMin) && (pageX < xMin + 500)) {

                
                setContextPos(prev => [pageX, pageY]);
                setShowContext(prev => true);

              //  }
            }

        }
        document.addEventListener("contextmenu", onContextMenu);
        return () => {
            document.removeEventListener("contextmenu", onContextMenu);
        }
    },[activeKey])

    useEffect(() => {
        const arr = [];
        arr.push(
            <div style={{paddingTop:"10px", paddingBottom: "15px"}} className={styles.searchHeading}>People</div>
        )
        if(people.length == 0){
           
            arr.push(
                <div key={0} className={styles.noResult}>
                    {"No people found"}
                </div>
            );
        }else{
          
            people.forEach((element, i) => {
                arr.push(
                    <div about="people" id={i} onMouseOver={(e)=>{
                        setActiveKey(prev => e.target.id);
                        
                    }}
                    onMouseOut={ (e) => {
                        if(!showContext){
                            setActiveKey(prev => -1)
                        }
                        }
                    }
                    key={i} className={styles.result} >
                        {element[0]}
                    </div>
                );
            });
           
        }
    
        setPeopleItems(prev => arr);
    },[people]);

    useEffect(() => {
        const arr = [];
        arr.push(
            <div style={{ paddingTop: "20px", paddingBottom: "15px" }}  className={styles.searchHeading}>Campaigns</div>
        )

        if (campaigns.length == 0) {
          
            arr.push(
                <div style={{paddingTop:"30px"}} className={styles.noResult}>
                    {"No realms found"}
                </div>
            );
        } else {
            
            campaigns.forEach((element, i) => {
                arr.push(
                    <div about="realm" id={i} onMouseOver={(e) => {
                        setActiveKey(prev => e.target.id);

                    }}
                        onMouseOut={(e) => {
                            if (!showContext) {
                                setActiveKey(prev => -1)
                            }
                        }
                        }
                        onClick={e => joinCampaign(e)}
                        key={i} className={styles.result} >
                        <div id={i} className={styles.resultImg}><img id={i} src={element[2]} width={25} height={25} /></div> 
                        <div id={i} className={styles.resultTxt}>{element[1]}</div>
                    </div>
                );
            });

        }
        setCampaignItems(prev => arr);
    }, [campaigns]);

    return (
        <>
        <div style={{ display: "flex", flexDirection:"row", paddingTop: "5px", paddingBottom: "5px",  backgroundColor: "rgba(30, 30, 30, .5)", width: "100%"}}>
                <div style={{flex: 1}} className={styles.title}>Search Results</div ><div className={styles.closeButton} onClick={(e)=>{
                    onClose();
                }}>X</div>
        </div>
        <div style={{paddingTop:"5px"}} />
        <div style={{ height:"550px",  paddingTop: "5px",  backgroundColor: "rgba(30, 30, 30, .5)", width: "100%"}}>
            
                {peopleItems}
            {campaignItems}
        </div>

        <div onMouseLeave={(e) =>
        {
                if (showContext) { setShowContext(prev => false) }
        }} style={{width:"180px", backgroundColor: "rgba(40,40,40,.5)", display: showContext ? "block" : "none" , position:"fixed", left: contextPos[0]-5, top: contextPos[1]-5 }}>
            <div className={styles.result} onClick={(e) => sendFriendRequest} >Not implemented yet</div>               
        </div>
        </>
    )


}

export default SearchResults;
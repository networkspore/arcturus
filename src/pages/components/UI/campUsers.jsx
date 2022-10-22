import React, { useEffect, useState } from 'react';
import useZust from '../../../hooks/useZust';
import styles from '../../css/campaign.module.css';



const CampUsers = ({props}) => {

    const [items, setItems] = useState([])

    const campaignUsers = useZust((state) => state.campaignUsers);

  //  const [contextPos, setContextPos] = useState([0, 0]);
 //   const [showContext, setShowContext] = useState(false);

  //  const [activeKey, setActiveKey] = useState(-1);


  //  const socket = useZust((state) => state.socket)

    const sendFriendRequest = (e) => {

    }
/*
    useEffect(() => {
        const onContextMenu = (e) => {
            e.preventDefault();
            const { pageX, pageY } = e;

            if (activeKey != -1) {
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
    }, [activeKey])*/

    useEffect(() => {
     
        const arr = [];
       
        
        if (campaignUsers.length == 0) {
            arr.push(
                <div style={{  flex: 1, display: "flex", flexDirection: "row", height: "30px", width: "100%" }}>
                    <div className={styles.noResults} key={0} >
                        {"No memebers."}
                    </div>
                </div>
            );
        } else {
            //+ "-" + element[2] + "-" + element[3]
        
            campaignUsers.forEach((element, i) => {
                if (element[2] == "Online"){
                    
                    arr.push(
                   
                        <div style={{ flex: 1, display: "flex", flexDirection: "row", height: "30px", width: "100%" }}>
                            <div style={{flex:1}} className={ styles.menuName } id={i} key={i} >
                                {element[1]}{element[3] == "Offline" ? " (Online)" : ""}
                            </div>
                           <div style={{flex:.01}}>{element[8] != null ?
                                <img style={{ opacity: .7 }} src={"Images/audio.png"} width={15} height={15} />
                                 : 
                                element[9] != null ? <img style={{ opacity: .7 }} src={"Images/spinning.gif"} width={15} height={15} />: ""}</div>
                        </div>
                      
                    );
                }
            });
            
            campaignUsers.forEach((element, i) => {
                if (element[2] == "Offline") {
                    arr.push(
                      
                        <div style={{ height:30, display: "flex", flexDirection: "row" }}   >
                            <div className={styles.offlineName} id={i} key={i} >
                            {element[1] + " (Offline)"}
                            </div>
                        </div>
                    
                    );
                }
            });
        }

        setItems(prev => arr);
        
    }, [campaignUsers]);
    return (
        <>
            
          
           
                {items}


           
        </>
    )


}

export default CampUsers;
/*


    <div onMouseLeave={(e) => {
                if (showContext) { setShowContext(prev => false) }
            }} style={{ width: "180px", backgroundColor: "rgba(40,40,40,.5)", display: showContext ? "block" : "none", position: "fixed", left: contextPos[0] - 5, top: contextPos[1] - 5 }}>
                <div onClick={(e) => sendFriendRequest} >Send friend request</div>
            </div>

  


*/
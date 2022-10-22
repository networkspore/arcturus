import useZust from "./hooks/useZust";
import React, { useEffect, useState } from "react";
import styles from './pages/css/ContentMenu.module.css';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ErgoDappConnector } from "ergo-dapp-connector";
import produce from "immer";
import LoginPage from "./pages/LoginPage"
import WelcomePage from "./pages/WelcomePage";
import { SearchPage } from "./pages/SearchPage";
import { HomePage } from "./pages/HomePage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";




const HomeMenu = ({ props}) => {
   
    const goToEditor = useZust((state) => state.torilActive);
    const setTorilActive =useZust((state) => state.setTorilActive);
    const [showMenu, setShowMenu] = useState(false) 
 
    const navigate = useNavigate();
    const pageSize = useZust((state) => state.pageSize);

    const user = useZust((state) => state.user);
    const socket = useZust((state) => state.socket);

    const campaigns = useZust((state) => state.campaigns)
    const [camps, setCamps] = useState([]);
    const toNav = useNavigate()
    const currentCampaign = useZust((state) => state.currentCampaign)


   

    const [showIndex, setShowIndex] = useState(false);

    
   

    const location = useLocation()

    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const currentLocation = location.pathname;

        const isConnected = (socket != null) ? socket.connected : false;

        if(connected != isConnected) setConnected(isConnected)
        
       if(user.userID > 0)
       {
           if (currentLocation == '/') {

                if (connected) {   
                    navigate("/search")
                } else {
                    navigate('/home')
                }
            }else{
                const firstSlash = currentLocation.indexOf("/")
                const tmp = currentLocation.slice(firstSlash)
                const locationArray = String(currentLocation).split("/").reverse()
            
                const rootDirectory = locationArray.pop();

                switch(rootDirectory)
                {
                    case "search":
                        if(connected){
                            if (!showMenu) setShowMenu(true);
                            setShowIndex(4)
                        }else{
                            navigate('/home')
                        }
                        break;
                    case "home":
                        if (!showMenu) setShowMenu(true);
                        setShowIndex(3);
                        break;
                    default:
                        if (connected) {
                            if (!showMenu) setShowMenu(true);
                            setShowIndex(3)
                        } else {
                            navigate('/home')
                        }
                }

            }
        
       }else{
            if (showMenu) setShowMenu(false)
            
            switch (currentLocation) {
                case '/':
                case '/login':
                    setShowIndex(1)
                    break;
                case '/welcome':
                    setShowIndex(2)
                    break;

                case '/recoverpassword':
                    setShowIndex(5)
                    break;
                default:
                    navigate("/")
                    break;
            }
       }
        
       
    
    }, [location,user,socket])

    useEffect(() => {
       
        setCamps(prev => []);
        campaigns.forEach((camp, i) => {
     
                    setCamps(prev => [...prev,(
                        <NavLink onClick={(e)=>{
                            
                            if (currentCampaign == camp[0]){ e.preventDefault();}else{
                                
                            }
                            
                        }} key={i} className={currentCampaign == camp[0] ? styles.menuActive : styles.menu__item} about={camp[1]} state={{ campaignID: camp[0], campaignName: camp[1], roomID: camp[3], adminID: camp[4] }} to={"/realm"}>
                            <div style={{width:"50px", height:"50px", borderRadius: "10px", overflow: "hidden" }}><img src={camp[2]} width={50} height={50} /></div>
                        </NavLink>
                    )])
         
        });
       
    },[campaigns,currentCampaign])






    /*     <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="D&D" to={'/campaign'}>
                        <img src="Images/Campaign/1/logo.png" width={50} height={50} />
                    </NavLink>
                    */
    
   

    function onProfileClick(e){
      
        if(connected){
            toNav("/home")
        }else{
            toNav("/")
        }
    }

    return (
        <>
          

            
       
        {showIndex == 1 &&
            <LoginPage />
        }
        {showIndex == 2 && user.userID < 1 &&
            <WelcomePage />
        }
        {showIndex == 3 &&
            <SearchPage />
        }
        {showIndex == 4 &&
           <HomePage />
        }
        {showIndex == 5 &&
            <RecoverPasswordPage />
        }
            {(connected && showMenu) &&
                <div style={{ position: "fixed", top: 0, left: 0, height: pageSize.height, width: 85, backgroundImage: "linear-gradient(to bottom, #00000088,#20232588)" }}>
                    <div style={{ display: "flex", flexDirection: "column", height: pageSize.height, fontFamily: "WebPapyrus" }}>
                        <div style={{ flex: 1 }}>

                            {connected  &&
                                <>
                                    <NavLink className={location.pathname == "/search" ? styles.menuActive : styles.menu__item} about="Arcturus Network" to={'/search'}>
                                        <img src="Images/logo.png" width={50} height={50} />
                                    </NavLink>

                                </>
                            }

                            {/*
                    <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="Map"
                        to={'/editor'}>
                        <img src="Images/map.png" width={50} height={45} />
                    </NavLink>*/
                            }




                        </div>
                        <div style={{ flex: 0.1 }}>

                            <NavLink className={location.pathname == "/createRealm" ? styles.menuActive : styles.menu__item} about="Create Realm"
                                to={'/createRealm'}>
                                <img src="Images/realm.png" width={60} height={60} />
                            </NavLink>



                            <NavLink className={location.pathname == "/home" ? styles.menuActive : styles.menu__item} about={user.userName}
                                to={'/home'}>
                                <img src="Images/icons/person.svg" style={{ filter: "invert(100%)" }} width={45} height={50} />
                            </NavLink>

                        </div>
                    </div>
                </div>

            }
            <div style={{
                position: "fixed", top: 0, right: 0, height: 30,
                backgroundImage: "linear-gradient(to bottom, #00000088,#10131488)"
            }}>
                <div style={{ display: "flex" }}>

                    <div style={{ paddingTop: "6px", display: "flex", cursor: "pointer", backgroundColor: "black" }} >
                        <div onClick={(e) => {
                            toNav("/")
                        }}>
                            <img src={connected ? "Images/logo.png" : "Images/logout.png"} width={30} height={30} />
                        </div>
                        <div onClick={onProfileClick} style={{
                            fontFamily: "WebPapyrus",
                            color: "#c7cfda",
                            fontSize: "16px",
                            paddingTop: "5px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        }}> {connected ? user.userName : <div style={{ display: "flex" }}><div>Log</div><div style={{ width: "6px" }}>&nbsp;</div><div>In</div> </div>}</div>
                    </div>

                </div>
            </div>
        </>
    )
    
}

export default HomeMenu;

/*
           
   <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="New Campaign" 
                to={'/home'}>
                <img src="Images/start.png" width={50} height={45} />
            </NavLink>
            <NavLink className={(navData) => navData.isActive ? styles.menuActive : styles.menu__item} about="Explore Campaigns" 
                to={'/home'}>
                <img src="Images/explore.png" width={50} height={45} />
            </NavLink>
*/
import produce from 'immer';
import React, { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import useZust from './hooks/useZust';
import loadingStyles from './pages/css/loading.module.css';

export const LoadingPage = (props ={}) => {
    const navigate = useNavigate()

    const setConfigFile = useZust((state) => state.setConfigFile)
    const loadingStatus = useZust((state) => state.loadingStatus)
    useEffect(()=>{

        if (props.state != null) {
         
       
          
            
            if(props.state.configFile != undefined){
           
                setConfigFile(props.state.configFile)
           
            
            }


        } else {
            console.log("no state in loading")
            navigate(props.onComplete)
        }
    }, [props.onComplete, props.state])


    return (
        <>  <div className={loadingStyles.loading}  >
            <div >
                <div className={loadingStyles.logo}></div>
                <div style={{
                    position: "fixed",
                    bottom: "140px",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection:"column",
                    flex: 1,
                    
                }}>
                    <div style={{
                        fontFamily: "Webpapyrus",
                        fontSize: "30px",
                        fontWeight: "bolder",
                        color: "#cdd4da",
                        textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
                    }}>Loaded: </div> 
                    <div style={{
                        paddingTop:20,
                        fontFamily: "Webpapyrus",
                        fontSize: "20px",
                        color: "#cdd4da",
                    }}>{loadingStatus}</div>
                </div>
                

            </div>

        </div>
        </>
    )
}
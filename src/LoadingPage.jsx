import produce from 'immer';
import React, { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import useZust from './hooks/useZust';
import loadingStyles from './pages/css/loading.module.css';

export const LoadingPage = (props ={}) => {
    const navigate = useNavigate()



    useEffect(()=>{

        if (props.state != null) {
         
       
          
            
            if(props.state.configFile != undefined){
           
                props.onConfigChange(props.state.configFile)
           
            
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
                <div className={loadingStyles.loadingText}>
                    Loading

                </div>

            </div>

        </div>
        </>
    )
}
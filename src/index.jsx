import loadingStyles from './pages/css/loading.module.css';

import React, { Suspense } from "react";
import {createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { Canvas} from '@react-three/fiber';


import { CookiesProvider } from 'react-cookie';



import {  Stars } from '@react-three/drei';
import  SolarSystem from './pages/components/SolarSystem';

import { Transition } from './pages/components/Camera/Transition';

import useZust from './hooks/useZust';
import Sizing from './dom/Sizing';


import HomeMenu from './HomeMenu';


import { LandingPage } from './LandingPage';


const Loader = (<>  <div className={loadingStyles.loading}  >
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
            flexDirection: "column",
            flex: 1,

        }}>
            <div style={{
                fontFamily: "Webpapyrus",
                fontSize: "30px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
            }}>Loading... </div>
     
        </div>

    </div>

</div></>);

//const socket = io("te1.tunnelin.com:54600");

const App = () => {

 

    const page = useZust((state) => state.page);
    const pageSize = useZust((state) => state.pageSize);

 
    return (
        
           <>   
            
                        
                    <div style={{width: pageSize.width, height: pageSize.height, display:'flex', flexDirection:'column' }}>
                        <div style={{ flex: 1, display: page!=null ? "block": "none" }}>
                            {page!= null  &&
                                <Suspense fallback={Loader}>

                                <Canvas  performance={{current:1, min: 0.9, debounce: 200 }} mode="concurrent" shadows  camera={{ fov: 60, near: 1.0, far: 100000.0 }}>
                                        {(page < 10 &&
                                        <>
                                            <Transition position={[1000,1000,1000]} />
                                       
                                            

                                                <SolarSystem position={[0, 0, 0]} />


                                                <Stars radius={1000} depth={3000} count={5000} factor={4}  />
                                            </>
                                        )}
                                    </Canvas>
                                </Suspense>   
                            }
                        </div>
                       
                <Routes>
                   

                
  

                    <Route path='*' element={ <LandingPage />} />
                </Routes>   
                
                <HomeMenu />
    
                        </div>
                    
                
             
                   
            <Sizing />
                   
        </>
     
    );
}

const element = (
    <Router>
        <App />
    </Router>
);
const container = document.getElementById('root');

const root = createRoot(container);

root.render(element);




        
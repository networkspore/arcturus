import React from 'react';
import loadingStyles from './pages/css/loading.module.css';

export const LoadingPage = () => {

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
import React from 'react'
import useZust from '../hooks/useZust'
import HomeMenu from './HomeMenu';




const Overlay = ({props}) => {

    const user = useZust((state) => state.user);

    const scrollLeft = useZust((state) => state.scrollLeft);
    const scrollTop = useZust((state) => state.scrollTop);

    const pageSize = useZust((state) => state.pageSize);


    const leftOverlaySize = useZust((state) => state.leftOverlaySize);
    const rightOverlaySize = useZust((state) => state.rightOverlaySize);

    const topOverlaySize = useZust((state) => state.topOverlaySize);

    const leftOverlayOpacity = useZust((state) => state.leftOverlayOpacity);
    const rightOverlayOpacity = useZust((state) => state.rightOverlayOpacity);

    const topOverlayOpacity = useZust((state) => state.topOverlayOpacity);


    const showTopOverlay = useZust((state) => state.showTopOverlay);

    const showLeftOverlay = useZust((state) => state.showLeftOverlay);
    const showRightOverlay = useZust((state) => state.showRightOverlay);



    return (
        <>
            {/*TopOverlay
            <div style={{ position:"fixed", margin: "auto auto", display: (showTopOverlay && user.LoggedIn ? "block" : "none"), left: 0 - scrollLeft, top: 0 - scrollTop }}>
                <img src='Images/home-top-overlay.png' style={{ position: "absolute", zIndex: 0, opacity: topOverlayOpacity }} height={topOverlaySize.height} width={topOverlaySize.width} />
                <div style={{ position: "absolute", zIndex: 1 }}>

                </div>
            </div>
*/}

            {/*Left Overlay
            <img src='Images/home-left-overlay.png' style={{ position: "absolute", zIndex: 0, opacity: leftOverlayOpacity }} height={leftOverlaySize.height} width={leftOverlaySize.width}  />
            */ }
            <div style={{ width: leftOverlaySize.width, height: leftOverlaySize.height, backgroundColor: "rgba(4,4,5,.5)",  position: "fixed", padding:0, display: (showLeftOverlay && user.LoggedIn ? "block" : "none"), left: 0 - scrollLeft, top: (showTopOverlay ? topOverlaySize.height : 0) - scrollTop }}>
                <div style={{ paddingTop: 5, position: "absolute", zIndex: 1 }}>
                    <HomeMenu />
                </div>
            </div>
            {/*Right Overlay 
            <div style={{ position: "fixed", margin: "auto auto", display: (showRightOverlay && user.LoggedIn ? "block" : "none"), left: (pageSize.width - rightOverlaySize.width) - scrollLeft, top: (showTopOverlay ? topOverlaySize.height : 0) - scrollTop}} >
                <img src='Images/home-left-overlay.png' style={{ position: "absolute", zIndex: 0, opacity: rightOverlayOpacity }} height={rightOverlaySize.height} width={rightOverlaySize.height} />
                <div style={{ textAlign: "center", position: "absolute", zIndex: 1 }}>


                </div>
            </div>
*/}
        
        
        </>
    )
}

export default Overlay;
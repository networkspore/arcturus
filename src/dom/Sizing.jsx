import produce from 'immer';
import React, { useEffect, useState } from 'react'
import useZust from '../hooks/useZust';
/*
fullscreenchange
resize
pageshow
*/


const Sizing = () => {


    const setScrollLeft = useZust((state) => state.setScrollLeft);
    const setScrollTop = useZust((state) => state.setScrollTop);



    let size = { width: 0, height: 0 }
    const pageSize = useZust((state) => state.pageSize);
    const setPageSize = useZust((state) => state.setPageSize);
    

    function getWidth() {
        return Math.max(
          //  document.body.scrollWidth || 0,
        //    document.documentElement.scrollWidth || 0,
         //   document.body.offsetWidth || 0,
          //  document.documentElement.offsetWidth || 0,
         //   document.documentElement.clientWidth || 0,
            window.innerWidth
        );
    }

    function getHeight() {
        return Math.max(
          
            window.innerHeight
        
        );
    }

    function getSize() {
        const width = getWidth();
        const height = getHeight();
        return {
            width,
            height
        };
    }

    const onSizeChange = (e = new Event("resize")) => {
        size = getSize();

        setPageSize(size);
    }

    const onScroll = (e = new Event("scroll")) => {
        setScrollTop(document.documentElement.scrollTop);
        setScrollLeft(document.documentElement.scrollLeft);
    }
    
 

    var setOnce = true;
    
    useEffect(() => {
         //   document.onfullscreenchange = (doc,event) => { alert("test")}
            window.addEventListener("scroll", onScroll)
            window.addEventListener("resize", onSizeChange);
            setOnce = false;
            onSizeChange();

    },[])
    

    return (
        <></>
    )
}

export default Sizing;
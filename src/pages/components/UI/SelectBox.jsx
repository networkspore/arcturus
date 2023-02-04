import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useLayoutEffect } from "react";



const SelectBox = (props = {}, ref) => {
    if (props == null) props = {};
    const onChange = "onChange" in props ? props.onChange : null;
    const placeHolderRef = useRef({ value: props.placeholder ? props.placeholder : ""})
    const optionsRef = useRef({value:[]})
    const [showList, setShowList] = useState(false);
    const [list, setList] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const id = "id" in props ? props.id : "";
    let optionsStyle = { zIndex: "9999", textAlign: "left", color: "#cdd4da", position: "absolute",  backgroundColor: "rgba(20,23,24,.7)", maxHeight: 100, overflowY: "scroll" };
    const labelStyle = { cursor: "pointer", margin: "0px 10px 10px 10px", display: "flex", alignItems: "center" }
    const textStyle = { backgroundColor: "rgba(0,0,0,0)", fontSize: "20px", fontFamily: "WebPapyrus", outline: 0, borderWidth: "0 0 2px", borderColor: "#ffe51c", color: "#D6BD00", textAlign: "left", width: "100%", cursor: "pointer" };
    const editable = "editable" in props ? props.editable : false;

    
    if ("optionsStyle" in props) {
        let optionsArray = Object.getOwnPropertyNames(props.optionsStyle);

        optionsArray.forEach(element => {
            optionsStyle[element] = props.optionsStyle[element];
        });
    }


    if ("textStyle" in props) {
        let optionsArray = Object.getOwnPropertyNames(props.textStyle);

        optionsArray.forEach(element => {
            textStyle[element] = props.textStyle[element];
        });
    }

    if (editable) {
        textStyle.caretColor = textStyle.color;
    } else {
        textStyle.caretColor = "transparent"
    }
    const [selectedValue, setSelectedValue] = useState(null);
   
    const textBoxRef = useRef();

    useEffect(()=>{
        optionsRef.current.value = Array.isArray(props.options) ? props.options : []
    },[props.options])


    useEffect(() => {
        
        var offsets = textBoxRef.current.getBoundingClientRect();
        optionsStyle.width = offsets.width;
      

        textBoxRef.current.placeholder = placeHolderRef.current.value 

        const options = optionsRef.current.value
        var array = [];
        if (options != null) {
            options.forEach((element, i) => {
                array.push(
                    <div key={i} style={labelStyle} tabIndex={i} id={"SelectBox:" + i} onClick={(e) => {
                        const index = e.target.id.split(":")[1];
                        setSelectedValue(element.value)
                        //  setSelectedIndex(Number(index))
                    }}>
                        {"imageUrl" in element &&
                            <div>
                                <img style={{ margin: "3px", border: "1px solid black", borderRadius: "5px", width: "25px", height: "25px" }} src={element.imageUrl} />
                            </div>
                        }
                        <div>
                            {element.label}
                        </div>
                    </div>
                )
            });
        }
        const box = <div style={optionsStyle}>
            {array}
        </div>

        setList(box)
   
      

    }, [showList, optionsRef.current.value])

 

    useImperativeHandle(
        ref,
        () => ({
            getValue: selectedValue,
            setValue: (value) => {
             
                setSelectedValue(value)

            },
            selectedIndex:optionsRef.current.value.findIndex(opt => opt.value == selectedValue),
            options: optionsRef.current.value,
        }), [selectedValue, optionsRef.current]);


    const lastIndex = useRef({ index: null })



    const onClicked = (e) => {

        e.prevent = false;
        if (props.onClick) {
            props.onClick(e);
        }
        if (!e.prevent) {
            setShowList(!showList)
        }
    }

    const onBlurring = (e) => {
      
        e.bubbles = false
        e.stopPropagation()
        // alert(Object.getOwnPropertyNames(e))
        if (e.relatedTarget == null) {
            setShowList(false)
        } else if (e.relatedTarget.id.split(":")[0] == "SelectBox") {
            const index = e.relatedTarget.id.split(":")[1];
            const val = optionsRef.current.value[index].value
            setSelectedValue(val)
      
            setShowList(false)
        } else if (e.relatedTarget.id == "List"){

        } else{
            setShowList(false)
        }
    }

    useLayoutEffect(() => {
     
        if (Array.isArray(optionsRef.current.value) && selectedValue != null) {
        

            const index = optionsRef.current.value.findIndex(opt => opt.value == selectedValue)

            if (index != lastIndex.current.index && index != -1) {
                lastIndex.current.index = index;

              
                if (onChange != null) onChange(index);
                
                const opt = optionsRef.current.value[index]
             
                textBoxRef.current.value = opt.label

            }else{
                textBoxRef.current.placeholder = placeHolderRef.current.value 
            }
        } else {
            if (onChange != null) onChange(null);
            lastIndex.current.index = null

            textBoxRef.current.placeholder = placeHolderRef.current.value 
        }


    }, [selectedValue, optionsRef.current.value])

    return (

        <div style={{ display: "block" }} onBlurCapture={(e) => onBlurring(e)}>
            <div about={props.about} style={props.style} className={props.className}>
            <input  onChange={(e) => {

            }} placeholder={props.placeholder} style={textStyle} ref={textBoxRef} onKeyDown={(e) => {
                if (!editable) e.preventDefault();
            }} type="text" onClick={(e) => onClicked(e)} />
            </div>
            <div id="List" tabIndex={100} style={{ display: showList ? "block" : "none" }} >
                {list}
            </div>
        </div>

    )
}

export default forwardRef(SelectBox);

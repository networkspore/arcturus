import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef} from "react";



const SelectBox = (props = {}, ref) => {
    if(props == null) props = {};
    const onChanged = "onChanged" in props ? props.onChanged : null;

    const [showList, setShowList] = useState(false);
    const [list, setList] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const id = "id" in props ? props.id : "";
    let optionsStyle = {  zIndex:"9999",textAlign:"left", color: "#cdd4da" ,position: "absolute", cursor: "pointer", backgroundColor: "rgba(20,23,24,.7)", height: 100,  overflowY: "scroll" };
    const labelStyle = {margin:"0px 10px 10px 10px", display:"flex", alignItems:"center"}
    const textStyle = { backgroundColor: "rgba(0,0,0,0)", fontSize: "20px", fontFamily: "WebPapyrus", outline: 0, borderWidth: "0 0 2px", borderColor: "#ffe51c", color: "#D6BD00", textAlign: "left", width: "100%", cursor: "pointer" };
    const editable = "editable" in props ? props.editable : false; 
    
    if ("optionsStyle" in props){
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

    if(editable){
        textStyle.caretColor = textStyle.color;
    }else{
        textStyle.caretColor = "transparent"
    }
    const [selectedValue, setSelectedValue] = useState(null);
    const [options, setOptions] = useState([]);
    const textBoxRef = useRef();

    useEffect(() => {
      
       if("options" in props){
          setOptions( props.options);
          
       } 
    }, [props])

    useEffect(() => {

        var offsets = textBoxRef.current.getBoundingClientRect();
        optionsStyle.width = offsets.width;

        var array = [];
        if (options != null) {
            options.forEach((element, i) => {
                array.push(
                    <div style={labelStyle} tabIndex={i} id={"SelectBox:" + i} onClick={(e) => {
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
    
    }, [showList, options,selectedValue])

    useEffect(()=>{
    
        const value = selectedValue;
        if(value == -1 )
        {
            setSelectedIndex(-1);
        }else if(value == null || value == undefined){
        }else{
            if(options != null || options !== undefined){
                if ("length" in options) {
                    options.forEach((element, i) => {
                        if (element.value == value) setSelectedIndex(i);
                    });
                }
            }
        }
    }, [selectedValue])

    useImperativeHandle(
        ref,
        () => ({
            getLabel: options == null ? "" : selectedIndex == -1 ? "" : options[selectedIndex] === undefined ? "" : options[selectedIndex].label,
            getValue: options == null? -1 : selectedIndex == -1 ? -1 : options[selectedIndex] === undefined ? -1 : options[selectedIndex].value,
            setValue: (value) => {
                
           
               setSelectedValue(value)
            },
            setSelectedIndex: (value) => {
                if(value == -1 || value == null || value === undefined)
                {
                    setSelectedValue(-1)
                }else if(value > -1){ 
                    if(options != null)
                    {
                        if (options.length > 0){
                           setSelectedValue(options[Number(value)].value)
                        }
                    }
                }
            },
            selectedIndex: selectedIndex,
            selectedOption: options == null ? null : selectedIndex == -1 ? null : options[selectedIndex] === undefined ? null : options[selectedIndex],
            setOptions: (value) => { 
               
                setOptions(value)},
            getOptions: options, 
        }),[selectedIndex,options]);

  
    const lastIndex = useRef({ index: -1 })

    useEffect(()=>{
       
        if(selectedIndex > -1)
        {
            
            if (options[selectedIndex] === undefined){ textBoxRef.current.value = ""}else{
            textBoxRef.current.value = options[selectedIndex].label;}
        }else{
            textBoxRef.current.value = "";
        }
        if (onChanged != null) {
            if (selectedIndex != lastIndex.current.index) {
                lastIndex.current.index = selectedIndex;
                onChanged(selectedIndex);
            }
        }

    },[selectedIndex,options,selectedValue])

    



    const onClicked = (e) => {
       
        e.prevent = false;
        if(props.onClick){
            props.onClick(e);
        }
        if(!e.prevent){
            setShowList(!showList)
        }
    }

    const onBlurring = (e) => {
       // alert(Object.getOwnPropertyNames(e))
       if(e.relatedTarget == null ){
           setShowList(false)
       }else if(e.relatedTarget.id.split(":")[0] == "SelectBox")
       {
           const index = e.relatedTarget.id.split(":")[1];
           setSelectedIndex(Number(index))
           setShowList(false)
       }else{
           setShowList(false)
       }
    } 
    return (
       
        <div style={{display:"block"}}>
        <input onChange={(e)=>{
              
        }}  placeholder={props.placeholder} style={textStyle} ref={textBoxRef}  onKeyDown={(e)=>{
            if(!editable) e.preventDefault();
        }} type="text" onClick={(e) => onClicked(e)} onBlur={(e) => onBlurring(e)}/>
           <div style={{display: showList ? "block" :"none" }}>
            {list}
            </div>
            </div>
       
    )
}

export default forwardRef(SelectBox);

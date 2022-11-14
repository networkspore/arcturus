import React from "react";
import useZust from "../hooks/useZust";

export const RealmGateway= () =>{
    const pageSize = useZust((state) => state.pageSize)

    const onHandleSubmit = (e) =>{
      
    }


    return (
        <div style={{
            position: "fixed",
            width: pageSize.width - 95,
            height: pageSize.height,
            left: 95,
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <div style={{
                textAlign: "center",
                width: "100%",
                paddingTop: "15px",
                paddingBottom: "5px",
                fontFamily: "Webpapyrus",
                fontSize: "20px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffffc0",
            }}>
                Gateway
            </div>
           

            <div style={{
                position: "fixed",
                width: pageSize.width - 95,
                height: pageSize.height,
                left: 95,
                top: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>


                <div style={{
                    backgroundImage: "linear-gradient(to bottom, #10131450,#00030480,#10131450)",
                    display: "flex",
                    boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
                    alignItems: "center",
                    justifyContent: "center",

                }}>
                    <div>"hellow</div>
                </div>
            </div>
        </div>
    )
}
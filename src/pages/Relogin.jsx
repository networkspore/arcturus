import sha256 from 'crypto-js/sha256';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useZust from '../hooks/useZust';
import styles from './css/login.module.css';

export const Relogin = (props ={}) => {
    const user = useZust((state) => state.user)
    const passRef = useRef()
    const navigate = useNavigate()
    function handleSubmit(e) {
        e.preventDefault();

        const pass = passRef.current.value;
        if (pass.length > 5 && user.userID > 0) {
            const code = sha256(pass).toString();
            login(user.userName, code);
        } else {
            window.location.replace("/")
        }
    }


    function login(name_email = "", pass = "") {
        setShowLogin(false)
        setSocketCmd({
            cmd: "login", params: { nameEmail: name_email, password: pass }, callback: (response) => {
                console.log("response")

            }
        })

    }

    return (
      
        <div style={{
            display: "flex",
            left: "50%",
            height: 375,
            top: "50%",
            position: "fixed",
            transform: "translate(-50%,-50%)",
            width: 600,
            cursor: "default",
            boxShadow: "0 0 10px #ffffff10, 0 0 20px #ffffff10, inset 0 0 30px #77777710",
            backgroundImage: "linear-gradient(to bottom,  #00030490,#13161780)",
            textShadow: "2px 2px 2px black",
            flexDirection: "column",
            alignItems: "center",

            paddingBottom: 30,
        }}
        >

            <div style={{
                paddingBottom: 10,
                display: "flex",
                justifyContent: "end",
                alignItems: "start",
                width: "100%",
                paddingTop: 10,
                fontFamily: "WebRockwell",
                fontSize: "18px",
                fontWeight: "bolder",
                color: "#cdd4da",
                textShadow: "2px 2px 2px #101314",
                backgroundImage: "linear-gradient(#131514, #000304EE )",


            }}>
                <div style={{ paddingRight: 10, paddingBottom: 5, cursor: "pointer" }}>
                    <ImageDiv width={20} height={20} onClick={(e) => { navigate("/") }} netImage={{ opacity: .7, image: "/Images/icons/close-outline.svg", filter: 'invert(70%)' }} />
                </div>
            </div>

            <div style={{ textShadow: "0 0 10px #ffffff40, 0 0 20px #ffffff60", fontWeight: "bold", fontSize: "50px", fontFamily: "WebPapyrus", color: "#cdd4da" }}>
                Log In
            </div>
            <form onSubmit={event => handleSubmit(event)}>
                <div style={{ display: "flex", paddingTop: 30, justifyContent: "center", }}>
                    <div style={{

                        display: "flex",

                        justifyContent: "center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingLeft: 5,
                        paddingRight: 5,
                        width: 400,
                    }}>
                        <div style={{
                            outline: 0,
                            border: 0,
                            width: 400, textAlign: "center", color: "#777777", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus"
                        }}  > {user.userName} </div>
                    </div>
                </div>

                <div style={{ display: "flex", paddingTop: 40, justifyContent: "center", }}>
                    <div style={{

                        display: "flex",

                        justifyContent: "center",
                        backgroundImage: "linear-gradient(to right, #00030430, #77777720, #00030430)",
                        paddingBottom: 5,
                        paddingTop: 5,
                        paddingLeft: 5,
                        paddingRight: 5
                    }}>
                        <input onKeyUp={(e) => {
                            if (e.code == "Enter") {
                                handleSubmit(e)
                            }
                        }} ref={passRef} style={{
                            outline: 0,
                            border: 0,
                            color: "white",
                            width: 500, textAlign: "center", fontSize: "25px", backgroundColor: "black", fontFamily: "WebPapyrus"
                        }} name="loginPass" placeholder="Password" type="password" />
                    </div>
                </div>



                <div style={{ width: "100%", display: "flex", justifyContent: "right" }}>
                    <div onClick={handleSubmit} style={{
                        textAlign: "center",
                        cursor: "pointer",
                        fontFamily: "WebPapyrus",
                        fontSize: "25px",
                        fontWeight: "bolder",
                        width: 100,
                        color: "#ffffffcc",

                        paddingTop: "10px",
                        paddingBottom: "10px",
                        transform: "translate(45px, 30px)"
                    }}
                        className={styles.OKButton}

                    > Enter </div>
                    <div style={{ width: 20 }}></div>

                </div>


            </form>


        </div>
        
    )
}
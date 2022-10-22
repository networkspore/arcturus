import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrthographicCamera } from "@react-three/drei";

export default function Camera() {
    const perspectiveCam = useRef();
    const orthoCam = useRef();
    const { get, set } = useThree(({ get, set }) => ({ get, set }));

    useEffect(() => {
        const changeView = () => {
            if (get().camera.name === "2d") {
                set({ camera: perspectiveCam.current });
            } else {
                set({ camera: orthoCam.current });
                orthoCam.current.lookAt(0, 0, 0);
            }
        };
        changeView();

        window.addEventListener("keyup", changeView);
        return () => window.removeEventListener("keyup", changeView);
    }, [get, set]);

    return (
        <>
            <PerspectiveCamera
                name="3d"
                ref={perspectiveCam}
                position={[0, 2, 10]}
                fov={50}
            />
            <OrthographicCamera
                name="2d"
                ref={orthoCam}
                position={[0, 2, 0]}
                zoom={100}
                near={-100}
                far={100}
                left={window.innerWidth / -2}
                right={window.innerWidth / 2}
                top={window.innerHeight / 2}
                bottom={window.innerHeight / -2}
            />
        </>
    );
}

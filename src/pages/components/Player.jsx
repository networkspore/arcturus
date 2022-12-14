import React from 'react';

import { useSphere } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';

export const Player = (props) => {
    const {camera} = useThree();

    const {ref} = useSphere(() => ({
        mass: 1,
        type: 'Dynamic',
        ... props,
    }));

    useFrame(() => {
        camera.position.copy(ref.current.position);
    });

    return (
        <>
            <mesh ref={ref} />
        </>
    );
};
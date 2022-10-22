import { useConvexPolyhedron } from '@react-three/cannon';
import { Polyhedron } from '@react-three/drei';
import * as THREE from 'three';

export const D10 = (props) => {
    const sides = 10
    const radius = 4
    const vertices = [
        [0, 0, 1],
        [0, 0, -1]
    ].flat()

    // https://github.com/byWulf/threejs-dice/blob/master/lib/dice.js#L499
    for (let i = 0; i < sides; ++i) {
        const b = (i * Math.PI * 2) / sides
        vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1))
    }

    const faces = [
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 5],
        [0, 5, 6],
        [0, 6, 7],
        [0, 7, 8],
        [0, 8, 9],
        [0, 9, 10],
        [0, 10, 11],
        [0, 11, 2],
        [1, 3, 2],
        [1, 4, 3],
        [1, 5, 4],
        [1, 6, 5],
        [1, 7, 6],
        [1, 8, 7],
        [1, 9, 8],
        [1, 10, 9],
        [1, 11, 10],
        [1, 2, 11]
    ].flat()
    const args = [vertices, faces, radius, 0]
    
    const pentagonalTrapezohedronGeometry = new THREE.PolyhedronGeometry(...args)
    const [ref, api] = useConvexPolyhedron(() => {
        return {
            args: pentagonalTrapezohedronGeometry,
            mass: 1,
            ...props
        }
    })

    //onClick={() => api.applyImpulse([0, 20, 0], [0, 0, 0])}
    return (
        <Polyhedron args={args} ref={ref} castShadow receiveShadow>
            <meshNormalMaterial attach="material" />
        </Polyhedron>
    )
}
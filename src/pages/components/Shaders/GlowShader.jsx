import React from "react"
import { Color } from "three"

export const uGlow = {
    s: { value: -1.0 },
    b: { value: 1.0 },
    p: { value: 2.0 },
    glowColor: { value: new Color(0x00ffff) }
}
export const vGlow = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() 
    {
      vNormal = normalize( normalMatrix * normal ); 
      vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`

export const fGlow = `
    uniform vec3 glowColor;
    uniform float b;
    uniform float p;
    uniform float s;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() 
    {
      float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
      gl_FragColor = vec4( glowColor, a );
    }`
import React, { useRef } from "react";

  //  const map = new THREE.ImageLoader().load("Images/toril-medium.png");

   // map.wrapS = THREE.RepeatWrapping;
  //  map.wrapT = THREE.RepeatWrapping;
 

export const uniforms = {
        uMap:{ value: null },
    }
// uMatrix = mvPosition;\
export const vertexShader = "\
attribute vec2 aTextureCoord;\
attribute mat4 uvMatrix;\
\
varying vec2 vUv;\
varying vec3 v_Normal;\
varying vec3 v_Position;\
varying vec3 v_Light;\
\
out mediump vec3 u_Color;\
out vec4 uMatrix;\
\
\
void main() {\
    vec4 lightPosition = vec4(0.0, 0.0, 150.0, 1.0);\
    \
    \
    vec4 mvPosition = instanceMatrix * vec4( position, 1.0 );\
    \
    uMatrix = uvMatrix * vec4(position, 1.0);\
    \
    vec4 modelViewPosition = modelViewMatrix * mvPosition;\
    \
    gl_Position = projectionMatrix * modelViewPosition;\
    \
    \
    u_Color = color;\
    v_Normal = (modelViewMatrix * instanceMatrix * vec4(normal, 0.0)).xyz;\
    v_Position = mvPosition.xyz;\
    v_Light = ( viewMatrix * lightPosition ).xyz;\
    \
}";
/*

*/

export const fragmentShader = "\
precision mediump float;\
\
varying vec2 vUv;\
varying vec3 v_Normal;\
varying vec3 v_Position;\
varying vec3 v_Light;\
\
uniform sampler2D uMap;\
\
in vec4 uMatrix;\
in mediump vec3 u_Color;\
\
\
void main() {\
    \
    vec3 ambient = vec3(.1);\
    vec3 n = normalize(v_Normal);\
    vec3 s = normalize(v_Light - v_Position);\
    \
    \
    \
    vec2 newUv = vec2((uMatrix.x + 105.0) / 200.0, (uMatrix.y + 55.0) / 100.0);\
    \
    \
    gl_FragColor = texture2D(uMap, newUv );\
    \
    vec3 white = vec3(1.0, 1.0, 1.0);\
    \
    if (u_Color.r == 1.0)\
    {\
        gl_FragColor = mix( gl_FragColor, vec4(white.rgb , gl_FragColor.w ), 0.3 );\
    }\
}";

# arcturus

Setup Instructions
------------------

Requires npm or yarn
-----
Requires config files (example code):
--

vite.config.js
----
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    }
})


src/constants/httpvars.jsx
-------
  const host = "localhost";
  const socketPort = 54944;
  
  const socketToken = "ANY STRING"
  
  const socketIOhttp = host + ":" + socketPort;
  export {socketIOhttp, socketToken};



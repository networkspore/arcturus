# arcturus

Setup Instructions
------------------

create files:
src/constants/httpvars.jsx
  const host = "localhost";
  const socketPort = 54944;
  
  const socketToken = "ANY STRING"
  
  const socketIOhttp = host + ":" + socketPort;
  export {socketIOhttp, socketToken};

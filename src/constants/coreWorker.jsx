import { getPermissionAsync } from "./utility";

export default () => {

    self.onmessage = (e) =>{
        const msg = e.data
   
        switch(msg.cmd)
        {
            case "removeFile":
                

                removeOriginFile(msg).then((result) => {
                    postMessage({ cmd: msg.cmd, success: result })
                })
                break;
            case "setFile":
                

               
                setOriginFile(msg).then((result)=>{
                    
                    const postMessage = { cmd: msg.cmd, success: result }
                   
                    self.postMessage(postMessage)
                })
                break;
            case "getContexts":
                getDirectory("context").then((result) =>{
                    if(Array.isArray(result)){
                        postMessage({ cmd: msg.cmd, success: true, contexts: result })
                    }else{
                        postMessage({ cmd: msg.cmd, success: false })
                    }
                })

                break;
        }

    
    }



    async function getDirectory(directory) {
        const root = await navigator.storage.getDirectory();

        const contextHandle = await root.getDirectoryHandle(directory, { "create": true });

        try {
            let all = []
            for await (const handle of contextHandle.values()) {
                if (handle.kind == "file") {
                    const ofInfo = await getOriginFile(handle, contextHandle)
                    all.push(ofInfo);
                }
            }

            return all


        } catch (err) {

            return undefined

        }

    }

    async function removeOriginFile(msg){
        const { name, type } = msg
        try{
            const root = await navigator.storage.getDirectory();

            const directoryHandle = await root.getDirectoryHandle(type, { create: true })

          //  const verified = await getPermissionAsync(directoryHandle)

           // if(verified){
            await directoryHandle.removeEntry(`${name}.${type}`)
            
            return true
        //    }else{
              //  return false
           // }
        } catch(err){
            console.log(err)
            return false
        }

    }

    async function setOriginFile(msg){
       
            
        const { name, bytes, type } = msg

        try{
           

            const root = await navigator.storage.getDirectory();
            const directoryHandle = await root.getDirectoryHandle(type, { create: true })
            
            
            const coreHandle = await directoryHandle.getFileHandle(`${name}.${type}`, { create: true });
            // Get sync access handle


            const accessHandle = await coreHandle.createSyncAccessHandle()
    
            const buffer = new DataView(new ArrayBuffer(bytes));


           accessHandle.write(buffer)

            accessHandle.flush()

            accessHandle.close()

            return true

        }catch(err){

            console.log(err)
            return false
        }
    }

    async function getOriginFile(entry, directory) {
        console.log(entry)
       /* const accessHandle = await entry.createSyncAccessHandle();
        
        const fileSize = await accessHandle.getSize()
        const buffer = new ArrayBuffer(fileSize);
        const readBuffer = accessHandle.read(buffer, { at: 0 });*/

        const file = await entry.getFile()
        const fileSize = file.size;
        const readBuffer = await file.ArrayBuffer()

        const uint = new Uint8Array(readBuffer)

        accessHandle.close()

        const lastIndex = entry.name.lastIndexOf(".");

        const ext = lastIndex != -1 ? lastIndex + 1 == entry.name.length ? "" : entry.name.slice(lastIndex + 1) : ""

        const fileType = ext

        const name = ext == "" ? entry.name : entry.name.slice(0, entry.name.length - ext.length)

        const hash = await getUintHash(uint)

        const fileInfo = { application: fileType, bytes: uint, directory: directory, mimeType: "OFS", name: name, hash: hash, size: fileSize, type: fileType, handle: entry }

        console.log(fileInfo)
        return fileInfo

    }

}
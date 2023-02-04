
import WordArray from "crypto-js/lib-typedarrays";
import blake2b from 'blake2b'
import SparkMD5 from 'spark-md5'
import { get, set, update } from "idb-keyval";
import aesjs from 'aes-js';
import { randInt } from "three/src/math/MathUtils";
import {  fileTypes, MB, svgMime, tableChunkSize } from "./constants";
import getBrowserFingerprint from 'get-browser-fingerprint';

export const browserID = getBrowserFingerprint({hardwareOnly:false, enableWebgl:true}).toString(16);

function xmur3(str){
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function sfc32(a, b, c, d) {
    return function () {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}


export function getRandomIntSync(min, max) {
    
    const now = formatedNow(new Date(),true)

    const nowSliced = now.slice(now.length - randInt(0,6) + 4, now.length)


    const hashLength = new Uint8Array(64).length

    const input = Uint8Array.from(Array.from(nowSliced).map(letter => letter.charCodeAt(0)));

    const nowHash = blake2b(hashLength).update(input).digest('hex')


    const array = new Uint8Array(randInt(0, 64) + 64);

    crypto.getRandomValues(array)

    const arrayHash = blake2b(hashLength).update(array).digest('hex')

    const array1 = new Uint8Array(randInt(0, 64) + 64);

    crypto.getRandomValues(array)

    const array1Hash = blake2b(hashLength).update(array1).digest('hex')

    const array2 = new Uint8Array(randInt(0, 64) + 64);

    crypto.getRandomValues(array2)

    const array2Hash = blake2b(hashLength).update(array2).digest('hex')
    

    var seed = xmur3(nowHash)

    var seed1 = xmur3(arrayHash)

    var seed2 = xmur3(array1Hash)

    var seed3 = xmur3(array2Hash)

    min = Math.ceil(min);
    max = Math.floor(max);
    const sfc = sfc32(seed(), seed1(), seed2(), seed3());

    for (let i = 0; i < 20; i++) {
        sfc()
    }
    const rand = sfc()

    return Math.floor(rand * (max - min + 1)) + min;
}

export function rand(seedStr) {

    
   
    var seed = xmur3( seedStr + '')

    const mix = sfc32(seed(), seed(), seed(), seed());

    for (let i = 0; i < 20; i++) {
        mix()
    }

    return mix()
}

export function randSyncTime(){
    const seedStr = formatedNow(new Date(), false)

    return rand(seedStr);
}


export async function getRandomInt(min, max, seedStr) {
  
    min = Math.ceil(min);
    max = Math.floor(max);

    const word = WordArray.random(32)
   
    const randResult = rand(seedStr + word)

    //mix up the results a lot
  

    return Math.floor(randResult * (max - min + 1)) + min;
}

function getRandomIntSFC(min, max, sfc) {

    min = Math.ceil(min);
    max = Math.floor(max);

    const randResult = sfc()

    //mix up the results a lot


    return Math.floor(randResult * (max - min + 1)) + min;
}

export function getCryptoWord(size = 32){
    const array = new Uint8Array(size);
    window.crypto.getRandomValues(array);

    return array
}

export function getCryptoWordHex(size = 32){
    return aesjs.utils.hex.fromBytes(getCryptoWord(size))
}

export async function generateCode(length = 45, readable = false) {

    const randInt1 = getRandomIntSync(0, 6)
    const randInt2 = getRandomIntSync(0, 32) + 32

    const dateString = formatedNow(new Date(), false)
    const dateSlice = dateString.slice(dateString.length - (4+ randInt1), dateString.length)

    const fingerHash = await getStringHash(browserID + "", 64)

    const word1 = getCryptoWordHex(randInt2)

    const dateHash = await getStringHash((dateSlice + word1), 64)

    let arrSeed = []
    let arrSeed2 = []
    for(let i = 0; i < 128 ; i++)
    {
        arrSeed.push(getRandomIntSync(0, 127))
        arrSeed2.push(getRandomIntSync(0, 127))
    }
    const uintSeed = Uint8Array.from(arrSeed)
    const uintSeed2 = Uint8Array.from(arrSeed2)

    const strSeed = aesjs.utils.hex.fromBytes(uintSeed)
    const strSeed2 = aesjs.utils.hex.fromBytes(uintSeed2)

    var seed = xmur3(dateHash)
    var seed1 = xmur3(fingerHash)
    var seed2 = xmur3(strSeed2)
    var seed3 = xmur3(strSeed)

    const SFC = sfc32(seed(), seed1(), seed2(), seed3());

  
    
    for (let i = 0; i < 20; i++) {
       SFC()
    }
    let code = []
    
    for (let i = 0; i <  length; i ++)
    {
        const byte = getRandomIntSFC( 0, 127, SFC)
    
        code.push(byte)
    }

   //0
     const strUintCode = aesjs.utils.utf8.fromBytes( Uint8Array.from(code))
     return strUintCode

}


export async function shuffle(array, seedStr) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(rand(seedStr) * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
export const crc32FromArrayBufferAsync = (ab) => {
    return new Promise(resolve =>{
        var table = new Uint32Array([
            0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f,
            0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
            0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2,
            0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
            0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
            0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
            0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c,
            0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
            0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423,
            0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
            0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106,
            0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
            0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d,
            0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
            0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
            0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
            0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7,
            0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
            0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa,
            0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
            0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
            0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
            0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84,
            0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
            0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
            0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
            0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e,
            0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
            0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55,
            0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
            0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
            0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
            0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f,
            0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
            0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
            0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
            0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69,
            0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
            0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc,
            0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
            0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
            0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
            0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
        ]);


        var dsArr = new Uint8Array(ab);

        var crc = 0 ^ (-1);

        // var dsArr = ds.readUint8Array();
        for (var i = 0; i < ab.byteLength; i++) {

            crc = (crc >>> 8) ^ table[(crc ^ dsArr[i]) & 0xFF];
        }
        resolve(((crc ^ (-1)) >>> 0).toString(16))
    
    })
}

export const crc32FromArrayBuffer = (ab, callback) => {

    var table = new Uint32Array([
        0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f,
        0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
        0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2,
        0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
        0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
        0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
        0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c,
        0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
        0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423,
        0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
        0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106,
        0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
        0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d,
        0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
        0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
        0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
        0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7,
        0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
        0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa,
        0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
        0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
        0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
        0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84,
        0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
        0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
        0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
        0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e,
        0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
        0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55,
        0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
        0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
        0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
        0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f,
        0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
        0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
        0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
        0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69,
        0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
        0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc,
        0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
        0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
        0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
        0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
    ]);


    var dsArr = new Uint8Array(ab);

    var crc = 0 ^ (-1);

   // var dsArr = ds.readUint8Array();
    for (var i = 0; i < ab.byteLength; i++) {

        crc = (crc >>> 8) ^ table[(crc ^ dsArr[i]) & 0xFF];
    }

    callback( ((crc ^ (-1)) >>> 0).toString(16))

}

export async function readFileJson(handle) {
    try {

        const file = handle == null || handle == undefined ? null : await handle.getFile();
        
        const txt = file == undefined || file == null ? null : await file.text();
        
        const value = txt == null || txt == undefined ? null : JSON.parse(txt);
        
        if(value == null || value == undefined)
        {
            return { success: false }
        }else{
            return { success: true, value: value }
        }
        
    } catch (error) {
        console.error(error)
        return { error: new Error("Json read error") }
    }

}

export function formatedNow(now = new Date(), small = false) {

    const year = now.getUTCFullYear();
    const month = now.getUTCMonth()
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    const miliseconds = now.getUTCMilliseconds();

    const stringYear = year.toString();
    const stringMonth = month < 10 ? "0" + month : String(month);
    const stringDay = day < 10 ? "0" + day : String(day);
    const stringHours = hours < 10 ? "0" + hours : String(hours);
    const stringMinutes = minutes < 10 ? "0" + minutes : String(minutes);
    const stringSeconds = seconds < 10 ? "0" + seconds : String(seconds);
    const stringMiliseconds = miliseconds < 100 ? (miliseconds < 10 ? "00" + miliseconds : "0" + miliseconds) : String(miliseconds);


    const stringNow = stringYear + "-" + stringMonth + "-" + stringDay + " " + stringHours + ":" + stringMinutes;



    return small ? stringNow : stringNow + ":" + stringSeconds + ":" + stringMiliseconds;
}

export async function getFirstDirectoryAllFiles(dirHandle) {
    let files = []
    let directories = []


    await getDirectoryAllFiles(dirHandle, (file) => {
        files.push(file)
    }, (d) => {
        directories.push(d)
    })

    return { files: files, directories: directories }

}
/*async function asyncFind(arr, asyncCallback) {
    const promises = arr.map(asyncCallback);
    const results = await Promise.all(promises);
    const index = results.findIndex(result => result);
    return arr[index];
}*/

export function asyncFind(array, findFunction) {
    return new Promise(resolve => {
        let i = 0;
        array.forEach(async (item, index) => {
            if (await findFunction(await item)) {
                resolve(index);
                return;
            }
            i++;
            if (array.length == i) {
                resolve(undefined);
            }
        });
    });
}
export async function findAsyncSequential(array, predicate) {
    let i = 0
    for (const t of array) {
        if (await predicate(t)) {
            return i;
        }
        i++
    }
    return undefined;
}

export async function getDirectoryAllFiles(dirHandle, pushFile, pushDirectory) {

    const push = pushFile;
    const pushDir = pushDirectory;

    for await (const entry of dirHandle.values()) {

        if (entry.kind === "file") {
            const name = entry.name + "";

            const lastIndex = name.lastIndexOf(".");

            const ext = lastIndex != -1 ? lastIndex + 1 == name.length ? "" : name.slice(lastIndex + 1) : null

            const validFileType = fileTypes.all.includes(ext)

            //const newFile = validFileType ? await getFileInfo(entry, dirHandle) : null

            if (validFileType) {
                push({ handle: entry, directory: dirHandle })
            }


        } else if (entry.kind == 'directory') {
            pushDir(entry)
            await getDirectoryAllFiles(entry, push, pushDir).then((result) => {

            })
        }

    }
    return true;

}

export async function decryptAesFileBytes(file, uintCode){

    const aB = await file.arrayBuffer()

    const uintBytes = new Uint8Array(aB)

    const key = await getUintHash(uintCode, 32)

    const aesCtr = new aesjs.ModeOfOperation.ctr(key);

    const decryptedBytes = aesCtr.decrypt(uintBytes)

    const contents = aesjs.utils.utf8.fromBytes(decryptedBytes)

    return contents
}



export const getChunkHash = (data) =>{
    
    return new Promise(resolve => {
        const hashLength = new Uint8Array(64).length

        const hex = blake2b(hashLength).update(data).digest('hex')
        resolve(hex)
    })
}


export const getStringHash = (string, size = 64) =>{
    return new Promise(resolve => {
       const hashLength = new Uint8Array(size).length
      
       const input = Uint8Array.from(Array.from(string).map(letter => letter.charCodeAt(0))); 
   
       const hex = blake2b(hashLength).update(input).digest('hex')
       
       resolve(hex)
    })
}
export const getUintHash = (input, size = 64) => {
    return new Promise(resolve => {
        const hash = new Uint8Array(size)
        const hashLength = hash.length

        blake2b(hashLength).update(input).digest(hash)

        resolve(hash)
    })
}
/*
export const getDataHash = (data) => {
    return new Promise(resolve => {


        const size = data.length
        
        const chunkSize = (5 * MB)
        const chunks = Math.ceil(size / chunkSize)

        const spark = chunks > 1 ? new SparkMD5.ArrayBuffer() : null

        let i = 0;
        let hash = ""

        async function getHashRecursive() {
            const chunkEnd = (i + 1) * chunkSize

            const arrayBuffer = data.slice(i * chunkSize, chunkEnd > size ? size : chunkEnd)


            if (i == 0) {

                const hashLength = new Uint8Array(64).length
                const input = new Uint8Array(arrayBuffer);
                hash = blake2b(hashLength).update(input).digest('hex')

            } else {
                spark.append(arrayBuffer)
            }

            i = i + 1

            if (i < chunks) {

                getHashRecursive()

            } else {
                if (chunks > 1) {
                    hash = hash + "#" + spark.end()
                }
                resolve(hash)
            }
        }

        getHashRecursive()
    })
}*/
export async function getFileHash(file, size = 64){

    const hashLength = new Uint8Array(size).length

    const arrayBuffer = await file.arrayBuffer()

    const input = new Uint8Array(arrayBuffer);
    const hash = blake2b(hashLength).update(input).digest('hex')
    return hash

}





export const getFileHashTable = (file) =>{
    

    return new Promise(resolve => {


        const size = file.size
        const chunkSize = 100000
        const chunks = Math.ceil(size / chunkSize)

        let i = 0;
        let hashTable = ""
        const hashLength = new Uint8Array(64).length
        
        async function getHashRecursive() {
            const chunkEnd = (i + 1) * chunkSize

            const blob = await file.slice(i * chunkSize, chunkEnd > size ? size : chunkEnd)

            const arrayBuffer = await blob.arrayBuffer()

           
            const input = new Uint8Array(arrayBuffer);
            const hash = blake2b(hashLength).update(input).digest('hex')
            hashTable = hashTable.concat(hash)
         
        
            i = i + 1

            if (i < chunks) {

                getHashRecursive()

            } else {
                
                
                resolve(hashTable)
            }
        }

        getHashRecursive()
    })
}

export async function getFileCRCTable(file){


    return new Promise(resolve => {

        const chunkSize = 100000
        const size = file.size
        const chunks = Math.ceil(size / chunkSize)
   
        let i = 0;
        let crcTable = ""

        async function getCRCRecursive() {
            const chunkEnd = (i + 1) * chunkSize

            const blob = await file.slice(i * chunkSize, chunkEnd > size ? size : chunkEnd)

            const arrayBuffer = await blob.arrayBuffer()

            const crc = await crc32FromArrayBufferAsync(arrayBuffer)

            crcTable += crc
            i = i + 1

            if (i < chunks) {

                getCRCRecursive()

            } else {
                
                resolve(crcTable)
            }
        }

        getCRCRecursive()
    })
}

export async function getLocalFileSvg(localFile){
    const file = await localFile.handle.getFile()
    return await getFileSvg(file)
}

export async function getFileSvg(file){
    const text = await file.text()

    var parser = new DOMParser();
    var doc = parser.parseFromString(text, "image/svg+xml");
    const svgElement = doc.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg").item(0);

    return svgElement
}
export async function getFileSvgCanvas(file, size= { width: 150, height: 150 }, onSize = null)
{
    const svg = await getFileSvg(file)

    if (onSize != null) onSize({ width: svg.clientWidth, height: svg.clientHeight })

    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

    canvas.width = size.width;
    canvas.height = size.height;

    ctx.drawImage(svg, 0, 0, size.width, size.height);

    return canvas
}

export async function getEntryInfo(entry, dirHandle){
    const file = await entry.getFile()
    return await getFileInfo(file, entry, dirHandle)
}

export async function getFileInfo(file, entry, dirHandle) {
   
   
    const hashTable = await getFileHashTable(file)

    const fileHash = await getStringHash(hashTable)

    const crcTable = await getFileCRCTable(file)

    const strHash = await getStringHash(crcTable)

    const startHash = hashTable.slice(0, 32)
    const endHash = hashTable.slice(96, 128)

    const hash = startHash + endHash + fileHash + strHash

    
    const fileSize = file.size;
    
    const firstIndex = file.type.indexOf("/")

    const type = firstIndex == -1 ? file.type : file.type.slice(0,firstIndex )

   
    const name = file.name + "";

    const lastIndex = name.lastIndexOf(".");

    const ext = lastIndex != -1 ? lastIndex + 1 == name.length ? "" : name.slice(lastIndex + 1) : null

    const isAssetType =  fileTypes.asset.includes(ext) 
    
    const isAppType = fileTypes.app.includes(ext)

  

    const isMediaType = fileTypes.media.includes(ext)

    const fileMimeType = isAssetType ? "asset" : isAppType ? "app" : isMediaType ? "media" : type
    
    const fileType = isAssetType || isAppType ? ext + "" :  file.type + ""

    const slashIndex = fileType.indexOf("/")
    const baseType = slashIndex == -1 ? fileType : fileType.slice(0, slashIndex) 

   

    await set(hash + ".hashTable", hashTable)
    await set(hash + ".crcTable", crcTable)
    
    let width = undefined
    let height = undefined
    let installed = undefined

    if (fileMimeType == "image") {
        const exists = await get(hash + ".arcicon")
      

        if(exists == undefined){

            if (file.type.slice(0, svgMime.length) != svgMime) {

                const dataUrl = await getFileThumnailDataUrl(file, { width: 100, height: 100 }, (size) => {
                    width = size.width
                    height = size.height
                })

                if (dataUrl != undefined) await set(hash + ".arcicon", dataUrl)

            } else {
                const text = await file.text()
                const doc = new DOMParser().parseFromString(text, "image/svg+xml")

                const svg = document.adoptNode(doc.documentElement)

                //  const bounds =  svg.getBoundingClientRect()
                width = svg.clientWidth
                height = svg.clientHeight

                const encoded = window.btoa(window.decodeURI(text))

                const header = 'data:image/svg+xml;base64,'
                const dataUrl = header + encoded

                await set(hash + ".arcsvg", dataUrl)

            }
        }
    } 
  
    const fileInfo = { width: width, height:height, application: baseType,  directory: dirHandle, mimeType: fileMimeType, name: file.name, hash: hash, size: fileSize, type: fileType, lastModified: file.lastModified, handle: entry }
    
   
    return fileInfo     
}

export const getIconDataUrl = async (file, fileType, hash) =>{
   console.log(hash)
    if (fileType.slice(0, svgMime.length) != svgMime) {

        const dataUrl = await getFileThumnailDataUrl(file, { width: 100, height: 100 })

        if (dataUrl != undefined) await set(hash + ".arcicon", dataUrl)

        return dataUrl
    } else {
        const text = await file.text()

        const encoded = window.btoa(window.decodeURI(text))

        const header = 'data:image/svg+xml;base64,'
        const dataUrl = header + encoded

        await set(hash + ".arcsvg", dataUrl)

        return dataUrl
    }
}
/*
export async function getFileInfo(entry, dirHandle, type) {

    return new Promise(resolve => {
        entry.getFile().then((file) => {
            file.arrayBuffer().then((arrayBuffer) => {
                
                crc32FromArrayBuffer(arrayBuffer, (crc) => {
                    
                    get(crc + ".arcicon").then((iconInIDB) => {
                        if(iconInIDB == undefined && type == "image")
                        {
                            getThumnailFile(file).then((dataUrl) =>{
                                set(crc + ".arcicon", dataUrl)
                            }).catch((err) => console.log(err))
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })

                    resolve({ directory: dirHandle, mimeType: type, name: file.name, crc: crc, size: file.size, type: file.type, lastModified: file.lastModified, handle: entry })   
                })
            })
        })
    })
}*/

export async function getJsonFile(fileHandle){

    const file = fileHandle.getFile();

    const fileTxt = await file.text()

    const json = await JSON.parse(fileTxt)

    let config = {};

    const fileInfoNames = Object.getOwnPropertyNames(file)

    fileInfoNames.forEach(name => {
        config[name] = file[name]
    });

    config.value = json;


    return config;

}

export async function moveCacheFile(locations, fileInfo, directoryName = "unsorted") {
    try {
       
        const fileType = fileInfo.type
    
        const fileName = fileInfo.name


        const firstIndex = fileType.indexOf("/")

        const type = firstIndex == -1 ? fileType : fileType.slice(0, firstIndex)


        const index = locations.findIndex(loc => loc.type == type) 

        const directoryHandle = locations[index].directory.handle

        const directory = await directoryHandle.getDirectoryHandle(directoryName, { create: true }) 

        const newFileHandle = await directory.getFileHandle(fileName, { create: true })

        const fileStream = await newFileHandle.createWritable()

        const file = await fileInfo.handle.getFile()

        if( await moveFileStream(file, fileStream))
        {
            await fileStream.close()
            const movedHandle = await directory.getFileHandle(fileName)
            await fileInfo.directory.removeEntry(fileInfo.name)
            const moveFile = await movedHandle.getFile()
            const movedFileInfo = { directory: directory, mimeType: fileInfo.mimeType, name: fileInfo.name, hash: fileInfo.hash, size: moveFile.size, type: fileInfo.type, lastModified: moveFile.lastModified, handle: movedHandle }
            
            return movedFileInfo
        }else{
            await fileStream.close()
            await directory.removeEntry(fileName)

            return undefined
        }

        


    } catch (err) {
        console.log(err)
        return undefined;
    }
}

const moveFileStream = (file, fileStream) =>{
    return new Promise(resolve => {
        try{
            
            const size = file.size
            const chunkSize = MB * 5
            const chunks = Math.ceil(size / chunkSize)
            let i = 0;
            
            async function writeRecursive()
            {
                const chunkStart = i * chunkSize
                const chunkEnd = (i + 1) * chunkSize

                const blob = await file.slice(chunkStart, chunkEnd > size ? size : chunkEnd)

                const arrayBuffer = await blob.arrayBuffer()

                await writeFileStreamPart(fileStream, arrayBuffer, chunkStart)
            
                i = i + 1;

                if (i < chunks)
                {
                    writeRecursive()
                }else{
                
                    resolve(true)
                }

                
            }

            writeRecursive()
        

        }catch(err){
            console.log(err)

            resolve(false)
        }
    })
}


export async function getNewFileStream(dirHandle, fileName, size){
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true })

    const fileStream = await fileHandle.createWritable()
    
    await fileStream.truncate(size)

    return fileStream
}

export async function writeFileStreamPart(fileStream, data, seek){

    await fileStream.ready

    await fileStream.write({ type: "write", seek, data })

    return true
}

export async function getHandleData(handle){
    const file = await handle.getFile()

    const data = await file.arrayBuffer()

    return data;
}

export async function getChunkData(file, chunkNumber, chunkSize){

    const chunkEnd = chunkNumber * chunkSize + chunkSize
    const size = file.size;

    const blob = await file.slice(chunkNumber * chunkSize, chunkEnd > size ? size : chunkEnd)

    const arrayBuffer = await blob.arrayBuffer()

    return {data: arrayBuffer}
}



export async function getLocalFileCanvas(localFile){
   

    const file = await localFile.handle.getFile()

    const image = await createImageBitmap(file)

    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  
    return canvas
    
}




export async function getFileThumnailDataUrl(file, size = { width: 100, height: 100 }, onSize = null) {


    const image = await createImageBitmap(file)
    
  
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;
   if(onSize != null) onSize({ width: image.width, height: image.height })
    ctx.drawImage(image, 0, 0);

    let scale = 1;


    if (image.width > image.height) {
        scale = size.width / image.width;
    } else {
        scale = size.height / image.height;
    }

    const resampledCanvas = resample(canvas, scale);

    const dataURL = resampledCanvas.toDataURL()
   
    return dataURL
}



export async function getPermissionAsync(handle){
    const opts = { mode: 'readwrite' };
    const verified = await handle.queryPermission(opts);

    const getVerified = verified == 'granted' ? verified : await handle.requestPermission(opts);

    return getVerified == 'granted';
}

export const getPermission = (handle, callback) => {
    const opts = { mode: 'readwrite' };

    handle.queryPermission(opts).then((verified) => {
        if (verified === 'granted') {
            callback(true);
        } else {
            handle.requestPermission(opts).then((verified) => {
                if (verified === 'granted') {
                    callback(true)
                } else {
                    callback(false)
                }
            })
        }
    })
}

export function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export const resample = (canvas, scale) => {

    var width_source = canvas.width;
    var height_source = canvas.height;

    var width = Math.round(width_source * scale);
    var height = Math.round(height_source * scale);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    //clear and resize canvas

    canvas.width = width;
    canvas.height = height;

    //draw
    ctx.putImageData(img2, 0, 0);

    return canvas;
}

export const downScaleCanvas = (cv, scale) => {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    var sqScale = scale * scale; // square scale = area of source pixel within target
    var sw = cv.width; // source image width
    var sh = cv.height; // source image height
    var tw = Math.floor(sw * scale); // target image width
    var th = Math.floor(sh * scale); // target image height
    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').
        getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
    var sR = 0, sG = 0, sB = 0; // source's current point r,g,b
    /* untested !
    var sA = 0;  //source alpha  */

    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; // y src position within target
        tY = 0 | ty;     // rounded : target pixel's y
        yIndex = 3 * tY * tw;  // line index within target array
        crossY = (tY != (0 | ty + scale));
        if (crossY) { // if pixel is crossing botton target pixel
            wy = (tY + 1 - ty); // weight of point within target pixel
            nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale; // x src position within target
            tX = 0 | tx;    // rounded : target pixel's x
            tIndex = yIndex + tX * 3; // target pixel index within target array
            crossX = (tX != (0 | tx + scale));
            if (crossX) { // if pixel is crossing target pixel's right
                wx = (tX + 1 - tx); // weight of point within target pixel
                nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
            }
            sR = sBuffer[sIndex];   // retrieving r,g,b for curr src px.
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

            /* !! untested : handling alpha !!
               sA = sBuffer[sIndex + 3];
               if (!sA) continue;
               if (sA != 0xFF) {
                   sR = (sR * sA) >> 8;  // or use /256 instead ??
                   sG = (sG * sA) >> 8;
                   sB = (sB * sA) >> 8;
               }
            */
            if (!crossX && !crossY) { // pixel does not cross
                // just add components weighted by squared scale.
                tBuffer[tIndex] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) { // cross on X only
                w = wx * scale;
                // add weighted component for current px
                tBuffer[tIndex] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tX+1) px                
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) { // cross on Y only
                w = wy * scale;
                // add weighted component for current px
                tBuffer[tIndex] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tY+1) px                
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else { // crosses both x and y : four target points involved
                // add weighted component for current px
                w = wx * wy;
                tBuffer[tIndex] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // for tX + 1; tY px
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                // for tX ; tY + 1 px
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                // for tX + 1 ; tY +1 px
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        } // end for sx 
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV
}
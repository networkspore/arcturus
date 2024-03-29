import create from 'zustand';
import React from 'react';
import produce from 'immer';
import {Color, Texture } from 'three';





//const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem.key);
//const setLocalStorage = (key, value) => window.localStorage.setItem(key,JSON.stringify(value));
const useZust = create((set) => ({
   loadingStatus:null,
   setLoadingStatus:(value) =>set({loadingStatus: value}),
   currentHash: "",
   setCurrentHash:(value) => set({currentHash: value}),
   openApp:[],
   setOpenApp:(value) => set({openApp: value}),
   openFile:null,
   setOpenFile: (value) => set({openFile: value}),
   allFiles:[],
   setAllFiles: (value) => set({allFiles:value}),
   downloadingApps: [],
   setDownloadingApps: (value) => set({downloadingApps:value}),
   addDownloadingApp: (value) => set(produce((state)=>{
      const index = state.downloadingApps.findIndex(dlApps => dlApps.hash == value.hash);

      if(index == -1){
         state.downloadingApps.push(value)
      }
   })),
   removeDownloadingApp:(value) =>set(produce((state)=>{
      const index = state.downloadingApps.findIndex(dlApps => dlApps.hash == value.hash);

      if (index != -1) {
         if(state.downloadingApps.length == 1)
         {
            state.downloadingApps.pop()
         }else{
             state.downloadingApps.splice(index, 1)
         }
      }
   })),
   currentContact: null,
   setCurrentContact: (value) => set({currentContact:value}),
   contactsCmd: {cmd:null, params:null, callback:null},
   setContactsCmd: (cmd = { cmd: null, params: null, callback: null }) => set({contactsCmd: cmd}),
   uploadRequest: { upload: null, callback:null },
   setUploadRequest: (value) => set({ uploadRequest: value }),
   downloadRequest:{download:null},
   setDownloadRequest: (value = {download:null}) => set({downloadRequest: value}),
   peerUpload:[],
   setPeerUpload: (value) => set(produce((state) =>{ 
      if (Array.isArray(value)) {
         let tmp = []
         value.forEach(pUp => {
            tmp.push(pUp)
         });

         state.peerUpload = tmp
      }
   })),

  
   peerDownload:new Array(),
   setPeerDownload: (value) => set(produce((state)=>{
      if(Array.isArray(value))
      {
         let tmp = []
         value.forEach(pDown => {
            tmp.push(pDown)
         });

         state.peerDownload = tmp
      }
   })),


   /*peerCmd: { request: null, peers: [], callback: null },
   setPeerCmd: (value = { request: null, peers: [], callback: null }) => set(produce((state) => {
      state.peerCmd = value
   })),*/
   /*
   updateRealmImage: (realmID, value) => set(produce((state) =>{
      const index = state.realms.findIndex(realm => realm.realmID == realmID)
      console.log(index)
      try{
         const realm = state.realms[index];
         const objNames = Object.getOwnPropertyNames(realm)
         let newRealm = {}
         objNames.forEach(name => {
            if(name != "image") newRealm[name] = realm[name]
         });
         newRealm.image = value
         state.realms[index] = newRealm
      }catch(err){

      }
   })),*/
   party:[],

   fileRequest: [],
  
   addFileRequest: (value) => set(produce(state => { 
      if(state.fileRequest.length == 0){
         state.fileRequest.push(value) 
      }else{
         const index = state.fileRequest.findIndex(fileRequest => fileRequest.id == value.id && fileRequest.page == value.page)

         if (index == -1) {
            state.fileRequest.push(value)
         } 
      }
   })),
   removeFileRequest: (value) => set(produce((state) => {
      const index = state.fileRequest.findIndex(item => item.page == value.page && item.id == value.id)

      if (index > -1) {
         if (state.fileRequest.length == 1) {
            state.fileRequest.pop()
         } else {
            state.fileRequest.splice(index, 1)
         }
      }
   })),
   apps: [],
   setApps: (value = []) => set({ apps:value}), 
   updateApp: (value, i) => set(produce((state) => {
      state.apps.splice(i, 1, value)
   })),

   userPeerID:"",
   setUserPeerID:(value = "") => set({userPeerID:value}),

   cacheDirectory: {name:"cache", handle:null},
   setCacheDirectory: (value = {name:null, handle:null}) => set({cacheDirectory: value}),

   imagesDirectory: {  name: "images", handle: null, directories: [] },
   setImagesDirectory: (value = {  name: null, handle: null, directories: [] }) => set({ imagesDirectory: value }),

   modelsDirectory: { name: "models", handle: null, directories: [] },
   setModelsDirectory: (value = { name: "models", handle: null, directories: [] }) => set({ modelsDirectory: value }),



   mediaDirectory: { name: "media", handle: null, },
   setMediaDirectory: (value = { lname: "media", handle: null,  }) => set({mediaDirectory: value }),
    audioDirectory: { name: "audio", handle: null, directories: [] },
    setAudioDirectory: (value = { name: null, handle: null, directories: [] }) => set({ audioDirectory: value }),
   
    videoDirectory: { name: "video", handle: null, directories: [] },
   setVideoDirectory: (value = { name: null, handle: null, directories: [] }) => set({ videoDirectory: value }),
   

   appsDirectory: { name: "apps", handle: null },
   setAppsDirectory: (value = { name: "apps", handle: null, directories: [] }) => set({ appsDirectory: value }),

   userHomeDirectory: { name: "", handle: null, directories: [] },
   setUserHomeDirectory: (value = { name: null, handle: null, directories: [] }) => set({ userHomeDirectory: value }),
   
   //assets

   assetsDirectory: { name: "", handle: null, directories: [] },
   setAssetsDirectory: (value = { name: null, handle: null, directories: [] }) => set({ assetsDirectory: value }),

   placeablesDirectory: { name: "placeables", handle: null, directories: [] },
   setPlaceablesDirectory: (value = { name: null, handle: null, directories: [] }) => set({ placeablesDirectory: value }),

   pcsDirectory: { name: "", handle: null, directories: [] },
   setPcsDirectory: (value = { name: null, handle: null, directories: [] }) => set({ pcsDirectory: value }),
   
   npcsDirectory: { name: "", handle: null, directories: [] },
   setNpcsDirectory: (value = { name: null, handle: null, directories: [] }) => set({ npcsDirectory: value }),
   
   texturesDirectory: { name: "", handle: null, directories: [] },
   setTexturesDirectory: (value = { name: null, handle: null, directories: [] }) => set({ texturesDirectory: value }),
   
   terrainDirectory: { name: "terrain", handle: null, directories: [] },
   setTerrainDirectory: (value = { name: null, handle: null, directories: [] }) => set({ terrainDirectory: value }),
   
   typesDirectory: { name: "types", handle: null, directories: [] },
   setTypesDirectory: (value = { name: null, handle: null, directories: [] }) => set({ typesDirectory: value }),

   userFiles: [],
   setUserFiles: (value = []) => set({ userFiles: value }),

   localDirectory: { name: "", handle: null},
   setLocalDirectory: (value = { name: "", handle: null }) => set({ localDirectory: value }),

 

   configFile:{name:"", handle:null},
   setConfigFile: (value = { name: "", handle: null }) => set({configFile: value}),
   systemMessages:[],
   setSystemMessages: (value = []) => set({systemMessages: value}),
   addSystemMessage:(value) => set(produce((state)=>{

         const index = state.systemMessages.findIndex(msg => msg.id == value.id)

         if (index == -1) {
            state.systemMessages.push(
               value
            )
         }
   
   })),
   connected: false,
   setConnected: (value = false) => set({connected:value}),

   editRealm: { mode: "", settings: { inner: 0, outer: 0, value: 0 }, updated: false },

   peerConnection: null,
   setPeerConnection: (conn) => set({ peerConnection: conn }),
   localAudio: null,
  
   showDirManager: false,
   setShowDirManager: (value = false) => set({showDirManager: value}),
   contacts: [],
   setContacts: (value=[]) => set({contacts: value}),
   contactRequests:[],
   autoLogin: true,
   setAutoLogin:(value = true) => set({autoLogin: value}),
   showMenu: false,
   setShowMenu: (value = false) => set({showMenu: value}),
   loadingComplete: true,
   setLoadingComplete: (value) => set({loadingComplete: value}),
   terrainList: [],
   mode: { main: "", sub: "" , id:-1},

  // setEditCampaign: (value = { mode: "", settings: { inner: 0, outer: 0, value: 0 }, updated:false }) => set({editTerrain: value}),
   tempObject: null,
   setTempObject: (value = { name: "", url: "", color: "", textureUrl: "" }) => set({tempObject: value}),
   //currentPlaceable: -1,
   //setCurrentPlaceable: (value=-1) => set({currentPlaceable:value}),
   placeables: null,
   setPlaceables:(value=[]) => set({placeables: value}),
   assets: { images: {}, alphas: {}, gltfs: {} },

   //setIsAdmin: (value = false) => set({isAdmin: value}),
   //selectedCharacter: -1,
   //setSelectedCharacter: (value = -1) => set({selectedCharacter: value}), 
   monsters: [],
   setMonsters:(value =[]) => set({monsters:value}),

   monster3D: [],
   //party: [],
   //setParty: (value =[]) => set({party:value}),
   currentPage: -1,
   realmScene: null,
   userCharacter: {PCID:-2, show:false, object:{objectName:"", objectUrl:"", objectColor:"", position: [0,0,0], rotation:0}},
   setUserCharacter: (playerCharacter = {PCID:-2}) => set({userCharacter: playerCharacter}),
   characters:[],
   setCharacters:(value=[]) => set({characters: value}),

   setLocalAudio: (audioElement = null) => set({localAudio: audioElement}),
   campaignUsers: [],
   setCampaignUsers: (cUsers = []) => set({campaignUsers: cUsers}),
   currentCharacter: null,
   setCurrentCharacter:(value = null) => set({currentCharacter: value}),
   uniform: {
      uColor: { value: new Color(0, 1, 0) },
      uMap: { value: new Texture() }
   },
   activekey: -1,
   setActiveKey: (k = -1) => set({activekey: k}),
  // changeView: 0,
 //  setChangeView: (view = 0) => set({changeView: view}),

   torilActive: false,
   setTorilActive: (active = true) => set({torilActive: active}),

   user: {
      LoggedIn: false, userID: '', userName: '', userEmail: '', userHandle: '', image: null },
   setUser: (u = {
      LoggedIn: false, userID: '', userName: '', userEmail: '', userHandle: '', image: null }) => set({user: u}),
   socketConnected: false,
   setSocketConnected: (value) => set({socketConnected: value}),
   updateUserImage: (update) => set(produce((state) => {
      state.user.image = update
   })),
   socketCmd:{cmd:null, params:{},callback:null},
   setSocketCmd: (value = { cmd: null, params: {}, callback: null }) => set(produce((state)=>{
      state.socketCmd = value
   })),
   setUserLoggedIn: (loggedIn = false) => set(produce(state => { state.user.LoggedIn = loggedIn})),
   setUserID: (userID = '') => set(produce(state => { state.user.userID = userID })),
   setUserName: (userName = '') => set(produce(state => { state.user.userName = userName})),
   setUserEmail: (userEmail = '') => set(produce(state => { state.user.userEmail = userEmail })),
   setUserSuper: (userSuper = 0) => set(produce(state => { state.user.userSuper = userSuper })),

   loading: { loadPage: "/", finished:false, msg:"" },
   setLoading: (value = { loadPage: "/", finished: false, msg: "" }) => set({loading:value}),
   setLoaded: ( value = true) => set(produce(state => {state.loading.finished = value})),
   setMsg: (msg = "") => set(produce(state => { state.loading.msg = msg })),

   page: 0,

   setPage: (newPage = 0) => set({ page: newPage }),

   setLoginPage: () => set({ page: 1 }),
   setWelcomePage: () => set({ page: 2 }),
   setHomePage: () => set({ page: 3 }),

   pageSize: { width: 0, height: 0 },
   setPageSize: (size = {width:0, height:0}) => set({ pageSize: size }),
   
   //scrollLeft: 0,
   //scrollTop: 0,

   //setScrollLeft: (scroll = 0) => set({scrollLeft: scroll}),
   //setScrollTop: (scroll = 0) => set({scrollTop: scroll}),

}));





export default useZust;
/*
 placeables: getLocalStorage('world') || [],
    addPlaceable: () => {

    },
    removePlaceable: () => {

    },
    addCube: () => {

    },
    removeCube: () => {

    },
    texture: "",
    setTexture: () => {

    },
    saveWorld: () => {

    }

  
  
*/
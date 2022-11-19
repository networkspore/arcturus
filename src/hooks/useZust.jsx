import create from 'zustand';
import React from 'react';
import produce from 'immer';
import {Color, Texture } from 'three';




//const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem.key);
//const setLocalStorage = (key, value) => window.localStorage.setItem(key,JSON.stringify(value));
const useZust = create((set) => ({
   currentRealm: {
      realmID: null,
      realmName: "",
      userID: null,
      roomID: null,
      realmPage: null,
      realmIndex: null,
      statusID: null,
      accessID: null,
      realmDescription: null,
      advisoryID: null,
      image: null,
      config: null,
      realmType: null,
},
   setCurrentRealm: (value = {
      realmType:null,
      realmID: null,
      realmName: "",
      userID: null,
      roomID: null,
      realmPage: null,
      realmIndex: null,
      statusID: null,
      accessID: null,
      realmDescription: null,
      advisoryID: null,
      image: null,
      config: null,
   }) => set({currentRealm: value}) ,
   party:[],
   quickBar:[],
   setQuickBar:(value) => set({quickBar:value}),
   addQuickBarItem:(value) => set(produce(state=>{
      const index = state.quickBar.findIndex(qBar => qBar.realmID == value.realmID)
      if(index == -1)
      {
         state.quickBar.splice(0, 0, value)
      }
   })),
   downloads:[],
   addDownload: (value = { fileCRC:"", status:"", request:null }) => set(produce(state=>{
      if (state.downloads.length > 0) {
         
         const index = state.downloads.findIndex(download => download.fileCRC == value.fileCRC)
         if (index > -1) {
            state.downloads.push(value)
         }
    
      }
   })),
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
   realms: [],
   setRealms: (value = []) => set({realms:value}), 
   publishedFiles:[],
   setPublishedFiles: (value = []) => set({publishedImages: value}),
   peerOnline:false,
   setPeerOnline:(value = false) => set({peerOnline:value}),

   imagesDirectory: {  name: "images", handle: null, directories: [] },
   setImagesDirectory: (value = {  name: "images", handle: null, directories: [] }) => set({ imagesDirectory: value }),

   objectsDirectory: {  name: "objects", handle: null },
   setObjectsDirectory: (value = {  name: "objects", handle: null }) => set({ objectsDirectory: value }),

   terrainDirectory: {  name: "terrain", handle: null },
   setTerrainDirectory: (value = {  name: "terrain", handle: null }) => set({ terrainDirectory: value }),

   mediaDirectory: {  name: "media", handle: null },
   setMediaDirectory: (value = { lname: "media", handle: null }) => set({mediaDirectory: value }),
   

   imagesFiles: [],
   setImagesFiles: (value = []) => set({imagesFiles:value}),

   objectsFiles: [],
   setObjectsFiles: (value = []) => set({ objectsFiles: value }),

   terrainFiles: [],
   setTerrainFiles: (value = []) => set({ terrainFiles: value }),


   mediaFiles: [],
   setMediaFiles: (value = []) => set({ mediaFiles: value }),

   localDirectory: { name: "", handle: null },
   setLocalDirectory: (value = { name: "", handle: null }) => set({ localDirectory: value }),

 

   configFile:{storageID: -1, fileID: -1, value:null, name:"", handle:null},
   setConfigFile: (value = { storageID:-1, fileID:-1, value: null, name: "", handle: null }) => set({configFile: value}),
   systemMessages:[],
   setSystemMessages: (value = []) => set({systemMessages: value}),
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
   showLoadingScreen: false,
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

   user: { LoggedIn: false, userID: '', userName: '', userEmail: '', userHandle: '' },
   setUser: (u = { LoggedIn: false, userID: '', userName: '', userEmail: '', userHandle: '' }) => set({user: u}),
   
   socket: null,
   setSocket: (sock = null) => set({socket: sock}),
   setUserLoggedIn: (loggedIn = false) => set(produce(state => { state.user.LoggedIn = loggedIn})),
   setUserID: (userID = '') => set(produce(state => { state.user.userID = userID })),
   setUserName: (userName = '') => set(produce(state => { state.user.userName = userName})),
   setUserEmail: (userEmail = '') => set(produce(state => { state.user.userEmail = userEmail })),
   setUserSuper: (userSuper = 0) => set(produce(state => { state.user.userSuper = userSuper })),

   loading: { loadPage: "/network", finished:false, msg:"" },
   setLoading: (value = { loadPage: "/network", finished: false, msg: "" }) => set({loading:value}),
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
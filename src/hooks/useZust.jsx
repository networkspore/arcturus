import create from 'zustand';
import React from 'react';
import produce from 'immer';
import {Color, Texture } from 'three';




//const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem.key);
//const setLocalStorage = (key, value) => window.localStorage.setItem(key,JSON.stringify(value));
const useZust = create((set) => ({

   localDirectory: "",
   setLocalDirectory: (value = "") => set({localDirectory: value}),
   localHandle:null,
   files: [],
   setFiles: (value = false) => set({files:value}),
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
   editCampaign: {mode: "", settings: { inner: 0, outer: 0, value: 0 }, updated:false },
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
   campaignScene: null,
   userCharacter: {PCID:-2, show:false, object:{objectName:"", objectUrl:"", objectColor:"", position: [0,0,0], rotation:0}},
   setUserCharacter: (playerCharacter = {PCID:-2}) => set({userCharacter: playerCharacter}),
   characters:[],
   setCharacters:(value=[]) => set({characters: value}),
   peerConnection: null,
   setPeerConnection: (conn) => set({peerConnection: conn}),
   localAudio: null,
   setLocalAudio: (audioElement = null) => set({localAudio: audioElement}),
   campaignUsers: [],
   setCampaignUsers: (cUsers = []) => set({campaignUsers: cUsers}),
   currentCampaign: -1,
   setCurrentCampaign: (number = -1) => set({currentCampaign: number}),
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

   user: { LoggedIn: false, userID: '', userName: '', userEmail: '', userSuper: 0, userDirectories: [] },
   setUser: (u = { LoggedIn: false, userID: '', userName: '', userEmail: '', userSuper: 0, userDirectories:[] }) => set({user: u}),
   
   socket: null,
   setSocket: (sock = null) => set({socket: sock}),
   setUserLoggedIn: (loggedIn = false) => set(produce(state => { state.user.LoggedIn = loggedIn})),
   setUserID: (userID = '') => set(produce(state => { state.user.userID = userID })),
   setUserName: (userName = '') => set(produce(state => { state.user.userName = userName})),
   setUserEmail: (userEmail = '') => set(produce(state => { state.user.userEmail = userEmail })),
   setUserSuper: (userSuper = 0) => set(produce(state => { state.user.userSuper = userSuper })),

   loading: { loadPage: "/login", evt: "connect", msg: "Connecting" },
   setLoading: (l = { loadPage: "/login", evt: "connect", msg: "Connecting" }) => set({loading:l}),
   setLoadPage: ( l = "/login") => set(produce(state => {state.loading.loadPage = l})),
   setEvt: (evt = "connect") => set(produce(state => { state.loading.evt = evt })),
   setMsg: (msg = "Connecting") => set(produce(state => { state.loading.msg = msg })),

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

   campaigns: [],
   setCampaigns: (c = []) => set({campaigns: c}),
   
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
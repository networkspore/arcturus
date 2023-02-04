//Monsters
import React from "react";

export const tableChunkSize = 8192
export const MB = 1065536
export const svgMime = "image/svg+xml"


export const typeOptions = [
    { value: { mimeType: "", type: "" }, label: "All" },
    { value: { mimeType: "app", type: "arcturus" }, label: "Apps" },
    {
        value: { mimeType: "image", type: "" }, label: "Images"
    },
    {
        value: { mimeType: "media", type: "" }, label: "Media"
    },
    {
        value: { mimeType: "media", type: "video" }, label: "Video"
    },
    {
        value: { mimeType: "media", type: "audio" }, label: "Audio"
    },
    {
        value: { mimeType: "model", type: "" }, label: "Models"
    },
    {
        value: { mimeType: "asset", type: "arctype" }, label: "Assets"
    },

]
export const allExtOptions = [
    {
        value: "arctype", label: "arctype"
    },
     {
        value: "arcturus", label: "arcturus"
    },
     {
         value: "webp", label: "webp"
    }, {
         value: "apng", label: "apng"
    }, {
         value: "avif", label: "avif"
    }, {
         value: "gif", label: "gif"
    }, {
         value: "jpg", label: "jpg"
    },  {
         value: "jpeg", label: "jpeg"
    }, {
         value: "jfif", label: "jfif"
    }, {
         value: "pjpeg", label: "pjpeg"
    }, {
        value: "pjp", label: "pjp"
    }, {
         value: "png", label: "png"
    }, {
         value: "svg", label: "svg"
    }, {
         value: "bmp", label: "bmp"
    },  {
         value: "ico", label: "ico"
    },  {
         value: "cur", label: "cur"
    },
     {
         value: "json", label: "json"
    },  {
         value: "obj", label: "obj"
    }, {
         value: "fbx", label: "fbx"
    }, {
         value: "gltf", label: "gltf"
    },  {
         value: "glb", label: "glb"
    }, {
         value: "dae", label: "dae"
    }, {
         value: "babylon", label: "babylon"
    }, {
         value: "stl", label: "stl"
    }, {
         value: "ply", label: "ply"
    }, {
         value: "vrml", label: "vrml"
    },
     {
         value: "pcm", label: "pcm"
    },  {
         value: "mp3", label: "mp3"
    },  {
         value: "ogg", label: "ogg"
    },  {
         value: "webm", label: "webm"
    },  {
         value: "aac", label: "aac"
    },  {
         value: "wav", label: "wav"
    },  {
         value: "3gp", label: "3gp"
    },
    {
        value: "avi", label: "avi"
    }, {
        value: "mov", label: "mov"
    }, {
        value: "mp4", label: "mp4"
    }, {
        value: "m4v", label: "m4v"
    }, {
        value: "m4a", label: "m4a"
    }, {
        value: "mkv", label: "mkv"
    }, {
        value: "ogv", label: "ogv"
    }, {
        value: "ogm", label: "ogm"
    }, {
        value: "oga", label: "oga"
    },
]

export const fileTypes = Object.freeze({
    image: ["webp", "apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "svg", "bmp", "ico", "cur"],
    model: ["json", "obj", "fbx", "gltf", "glb", "dae", "babylon", "stl", "ply", "vrml"],
    audio: ["pcm", "mp3", "ogg", "webm", "aac", "wav",],
    video: ["3gp", "avi", "mov", "mp4", "m4v", "m4a", "mkv", "ogv", "ogm", "oga",],
    media: ["3gp", "avi", "mov", "mp4", "m4v", "m4a", "mkv", "ogv", "ogm", "oga", "pcm", "mp3", "ogg", "webm", "aac", "wav",],
    asset: ["arctype"],
    app:["arcturus"],
    all: [
        "arctype", "arcturus",
        "webp", "apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "svg", "bmp", "ico", "cur",
        "json", "obj", "fbx", "gltf", "glb", "dae", "babylon", "stl", "ply", "vrml",
        "pcm", "mp3", "ogg", "webm", "aac", "wav", "3gp", 
        "avi", "mov", "mp4", "m4v", "m4a", "mkv", "ogv", "ogm", "oga",]
})



export const access = Object.freeze({
    private: 0,
    contacts: 1,
    public: 2,
})
export const status = Object.freeze({
    valid: 1,
    invalid: 2,
    confirming: 3,
    Offline: 4,
    Online: 5,
    rejected: 6,
    accepted: 7
})
export const constants = Object.freeze({
    SMALL_SCENE: 1,
    MEDIUM_SCENE: 2,
    LARGE_SCENE: 3,
    HUGE_SCENE: 4,
    
    SET_MONSTERS: "set_Monsters",
    ADD_MONSTERS: "add_Monsters",

    CAMPAIGN_MODE: "campaign_mode",
    SCENE_MODE: "scene_mode",
    INFORMATION_MODE: 'information_mode',
    SETTING_MODE: 'setting_mode',
    GEOMETRY_MODE: "geometry_mode",
    TEXTURE_MODE: "texture_mode",
    TERRAIN_MODE: "terrain_mode",
    MONSTER_MODE: "monster_mode",
    
    ALTER_GEOMETRY:  "alter_geometry",
    SMOOTH_GEOMETRY:  "smooth_geometry",
    LEVEL_GEOMETRY:  "level_geometry",
    SAVE_GEOMETRY:  "save_geometry",
    UNDO_GEOMETRY:  "undo_geometry",
    
   
    SCENE_NAME: "scene_name",

    PAINT_TEXTURE: "paint_texture",
    BASE_TEXTURE: "base_texture",
    SAVE_TEXTURE: "save_texture",
    UNDO_TEXTURE: "undo_texture",

    CAMPAIGN_NAME: "campaign_name",
    CAMPAIGN_ICON: "campaign_icon",


   
    PLACEABLE_MODE: "placeable_mode",
    PARTY_MODE: "party_mode",

    LOCATE_ITEM: "locate_item",
    MOVE_ITEM: "move_item",

    HOVER_MONSTER: "hover_monster"
})

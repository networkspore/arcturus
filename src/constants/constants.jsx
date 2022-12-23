//Monsters
import React from "react";

export const tableChunkSize = 100000;
export const MB = 1048576

export const fileTypes = Object.freeze({
    image: ["webp", "apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "svg", "bmp", "ico", "cur"],
    model: ["json", "obj", "fbx", "gltf", "glb", "dae", "babylon", "stl", "ply", "vrml"],
    audio: ["pcm", "mp3", "ogg", "webm", "aac", "wav",],
    video: ["3gp", "avi", "mov", "mp4", "m4v", "m4a", "mkv", "ogv", "ogm", "oga",],
    media: ["3gp", "avi", "mov", "mp4", "m4v", "m4a", "mkv", "ogv", "ogm", "oga", "pcm", "mp3", "ogg", "webm", "aac", "wav",],
    asset: ["arctype", "arcpc","arcnpc","arcpl","arctex", "arcterr"],
    type: ["arctype"],
    PC: ["arcpc"],
    NPC: ["arcnpc"],
    placeables: ["arcpl"],
    textures: ["arctex"],
    terrain: ["arcterr"],
    all: [
        "arctype", "arcpc", "arcnpc", "arcpl", "arctex", "arcterr", 
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

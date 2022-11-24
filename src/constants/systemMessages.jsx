
export const initDirectory = {
    id: 1,
    text: "Select local directory.",
    navigate: "/home/localstorage",
    netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const initStorage = {
    id: 2,
    text: "Start storage engine.",
    navigate: "/home/localstorage/init",
    netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const firstSetup = {
    id: 0,
    text: "Welcome! Find more options on your home page.",
    navigate: "/home",
    netImage: { image: "/Images/icons/megaphone-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const saved = {
    id: 3,
    text: "Saved...",
    navigate: null,
    deleteOn: "seconds:5",
    netImage: { image: "/Images/icons/save-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const errorSaving = {
    id: 4,
    text: "Error saving...",
    navigate: null,
    deleteOn: "seconds:5",
    netImage: { image: "/Images/icons/alert.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const noChanges = {
    id: 5,
    text: "No changes...",
    navigate: null,
    deleteOn: "seconds:5",
    netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const notConnected = {
    id: 6,
    text: "Not connected...",
    navigate: null,
    deleteOn: "seconds:2",
    netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}


export const errorRealmEnd = {
    id: 7,
    text: "Error ending realm...",
    navigate: null,
    deleteOn: "seconds:5",
    netImage: { image: "/Images/icons/alert.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const errorRealmEnter = {
    id: 8,
    text: "Error entering realm...",
    navigate:null,
    deleteOn: "seconds:5",
    netImage: { image: "/Images/icons/alert.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const noGatewayEnter = {
    id: 9,
    text: "This realm is not open at this time...",
    navigate: null,
    deleteOn: "seconds:5",
    netImage: { image: "/Images/icons/alert.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const errorSelectingImage = {
    id:10,
    text: "Error selecting this image.",
    navigate: null,
    deleteOn: "seconds:3",
    netImage: { image: "/Images/icons/alert.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const errorRealmCreate = {
    id:20,
    text: "Could not create this realm.",
    navigate: null,
    deleteOn: "seconds:3",
    netImage: { image: "/Images/icons/alert.svg", width: 20, height: 20, filter: "invert(100%)" }
}
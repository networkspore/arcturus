
export const initDirectory = {
    id: 1,
    text: "Select local directory.",
    navigate: "/home/localstorage",
    deleteOn: "localstorage",
    netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

export const initStorage = {
    id: 2,
    text: "Start storage engine.",
    navigate: "/home/localstorage/init",
    deleteOn: "configFile",
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
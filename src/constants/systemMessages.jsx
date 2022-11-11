
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
    netImage: { image: "/Images/icons/alert-outline.svg", width: 20, height: 20, filter: "invert(100%" }
}

export const firstSetup = {
    id: 0,
    text: "Welcome! Find more options on your home page.",
    navigate: "/home",
    netImage: { image: "/Images/icons/megaphone-outline.svg", width: 20, height: 20, filter: "invert(100%)" }
}

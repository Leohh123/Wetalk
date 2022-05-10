const { contextBridge, ipcRenderer } = require("electron");

// window.addEventListener("DOMContentLoaded", () => {});

// let funcMessageFromFriend = (...args) => {};
// ipcRenderer.on("message-from-friend", () => funcMessageFromFriend());

// let funcMessageFromRoom = (...args) => {};
// ipcRenderer.on("message-from-room", () => funcMessageFromRoom());

let eventTargetRefDict = new Map();

function register(eventName, callback) {
    if (eventTargetRefDict.has(eventName)) {
        eventTargetRefDict.get(eventName).removeAllListeners(eventName);
    }
    let ref = ipcRenderer.on(eventName, callback);
    eventTargetRefDict.set(eventName, ref);
}

contextBridge.exposeInMainWorld("wetalkAPI", {
    dialog: (message) => ipcRenderer.invoke("dialog", message),
    download: (url) => ipcRenderer.invoke("download", url),

    register: (uid, passwd) => ipcRenderer.invoke("register", uid, passwd),
    login: (uid, passwd) => ipcRenderer.invoke("login", uid, passwd),
    logout: () => ipcRenderer.invoke("logout"),
    addFriend: (friendId) => ipcRenderer.invoke("add-friend", friendId),
    acceptFriend: (friendId) => ipcRenderer.invoke("accept-friend", friendId),
    rejectFriend: (friendId) => ipcRenderer.invoke("reject-friend", friendId),
    deleteFriend: (friendId) => ipcRenderer.invoke("delete-friend", friendId),
    getFriendList: () => ipcRenderer.invoke("get-friend-list"),
    getFriendReqList: () => ipcRenderer.invoke("get-friend-req-list"),
    createRoom: (rid) => ipcRenderer.invoke("create-room", rid),
    joinRoom: (rid) => ipcRenderer.invoke("join-room", rid),
    acceptRoommate: (roommateId, rid) =>
        ipcRenderer.invoke("accept-roommate", roommateId, rid),
    rejectRoommate: (roommateId, rid) =>
        ipcRenderer.invoke("reject-roommate", roommateId, rid),
    leaveRoom: (rid) => ipcRenderer.invoke("leave-room", rid),
    deleteRoom: (rid) => ipcRenderer.invoke("delete-room", rid),
    getRoomList: () => ipcRenderer.invoke("get-room-list"),
    getRoomReqList: () => ipcRenderer.invoke("get-room-req-list"),
    messageToFriend: (friendId, content) =>
        ipcRenderer.invoke("message-to-friend", friendId, content),
    messageToRoom: (rid, content) =>
        ipcRenderer.invoke("message-to-room", rid, content),
    // onMessageFromFriend: (callback) => {
    //     funcMessageFromFriend = callback;
    // },
    // onMessageFromRoom: (callback) => {
    //     funcMessageFromRoom = callback;
    // },
    onMessageFromFriend: (callback) =>
        register("message-from-friend", callback),
    onMessageFromRoom: (callback) => register("message-from-room", callback),
});

const { contextBridge, ipcRenderer } = require("electron");

// window.addEventListener("DOMContentLoaded", () => {});

contextBridge.exposeInMainWorld("wetalkAPI", {
    sendMessage: (msg) => ipcRenderer.invoke("send-message", msg),
    login: (uid) => ipcRenderer.invoke("login", uid),
    onReceiveMessage: (callback) => ipcRenderer.on("receive-message", callback),
    roomJoin: (rid) => ipcRenderer.invoke("room-join", rid),
    onRefreshUserList: (callback) =>
        ipcRenderer.on("refresh-userlist", callback),
});

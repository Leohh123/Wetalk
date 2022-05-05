const { contextBridge } = require("electron");

const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

// window.addEventListener("DOMContentLoaded", () => {});

contextBridge.exposeInMainWorld("wetalkAPI", {
    send: (msg) => {
        socket.emit("chat-message", String(msg));
    },
});

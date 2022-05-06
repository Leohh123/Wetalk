const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

let userId = null;
let roomId = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    socket.on("connect", () => {
        console.log("socket.on: connect", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("socket.on: disconnect");
    });

    socket.on("message-server", (msg) => {
        console.log("socket.on: message-server", msg);
        win.webContents.send("receive-message", msg);
    });

    socket.on("update-userlist", () => {
        console.log("socket.on: update-userlist");
        socket.emit("fetch-userlist", roomId, (userList) => {
            win.webContents.send("refresh-userlist", userList);
        });
    });

    win.loadFile("index.html");
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    ipcMain.handle("send-message", (ev, msg) => {
        socket.emit("message-client", msg);
    });

    ipcMain.handle(
        "login",
        async (ev, uid) =>
            new Promise((resolve, reject) => {
                socket.emit("login", uid, (code, data) => {
                    if (code === 0) {
                        userId = uid;
                    }
                    resolve({ code, data });
                });
            })
    );

    ipcMain.handle("room-join", (ev, rid) => {
        socket.emit("room-join", rid);
        roomId = rid;
    });

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

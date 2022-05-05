const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

let userId = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    socket.on("message-server", (msg) => {
        win.webContents.send("receive-message", msg);
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

    ipcMain.handle(
        "receive-message",
        (ev, msg) => new Promise((resolve, reject) => {})
    );

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

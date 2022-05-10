const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

const { io } = require("socket.io-client");
const socket = io("http://localhost:2468");

socket.on("connect", () => {
    console.log("socket.on: connect", socket.id);
});

socket.on("disconnect", () => {
    console.log("socket.on: disconnect");
    socket.connect();
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    socket.on("message-from-friend", (msg) => {
        console.log("socket.on: message-from-friend", msg);
        win.webContents.send("message-from-friend", msg);
    });

    socket.on("message-from-room", (msg) => {
        console.log("socket.on: message-from-room", msg);
        win.webContents.send("message-from-room", msg);
    });

    // win.loadFile("./build/index.html");
    win.loadURL("http://localhost:3000/login");
    win.webContents.openDevTools();
}

function safePromise(func, timeout = 500000) {
    return new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            reject("safePromise timeout");
        }, timeout);
        func(
            (value) => {
                clearTimeout(id);
                resolve(value);
            },
            (reason) => {
                clearTimeout(id);
                reject(reason);
            }
        );
    });
}

app.whenReady().then(() => {
    ipcMain.handle("dialog", (ev, message) => {
        dialog.showMessageBoxSync({ message });
    });

    ipcMain.handle("register", (ev, uid, passwd) =>
        safePromise((resolve, reject) => {
            console.log("main.register", uid, passwd);
            socket.emit("register", uid, passwd, (code, data) => {
                resolve({ code, data });
            });
        })
    );

    ipcMain.handle("login", (ev, uid, passwd) =>
        safePromise((resolve, reject) => {
            console.log("main.login");
            socket.emit("login", uid, passwd, (code, data) => {
                resolve({ code, data });
            });
        })
    );

    // [DISCARD] App gets stuck for a while after logging out :(
    ipcMain.handle("logout", (ev) =>
        safePromise((resolve, reject) => {
            console.log("main.logout");
            socket.emit("logout", (code, data) => {
                resolve({ code, data });
            });
        })
    );

    // ipcMain.handle("logout", (ev) => {
    //     console.log("main.logout");
    //     app.relaunch();
    //     app.exit(0);
    // });
    ipcMain.handle("add-friend", (ev, friendId) =>
        safePromise((resolve, reject) => {
            console.log("main.add-friend", friendId);
            socket.emit("add-friend", friendId, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("accept-friend", (ev, friendId) =>
        safePromise((resolve, reject) => {
            console.log("main.accept-friend", friendId);
            socket.emit("accept-friend", friendId, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("reject-friend", (ev, friendId) =>
        safePromise((resolve, reject) => {
            console.log("main.reject-friend", friendId);
            socket.emit("reject-friend", friendId, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("delete-friend", (ev, friendId) =>
        safePromise((resolve, reject) => {
            console.log("main.delete-friend", friendId);
            socket.emit("delete-friend", friendId, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("get-friend-list", (ev) =>
        safePromise((resolve, reject) => {
            console.log("main.get-friend-list");
            socket.emit("get-friend-list", (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("get-friend-req-list", (ev) =>
        safePromise((resolve, reject) => {
            console.log("main.get-friend-req-list");
            socket.emit("get-friend-req-list", (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("create-room", (ev, rid) =>
        safePromise((resolve, reject) => {
            console.log("main.create-room", rid);
            socket.emit("create-room", rid, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("join-room", (ev, rid) =>
        safePromise((resolve, reject) => {
            console.log("main.join-room", rid);
            socket.emit("join-room", rid, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("accept-roommate", (ev, roommateId, rid) =>
        safePromise((resolve, reject) => {
            console.log("main.accept-roommate", roommateId, rid);
            socket.emit("accept-roommate", roommateId, rid, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("reject-roommate", (ev, roommateId, rid) =>
        safePromise((resolve, reject) => {
            console.log("main.reject-roommate", roommateId, rid);
            socket.emit("reject-roommate", roommateId, rid, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("leave-room", (ev, rid) =>
        safePromise((resolve, reject) => {
            console.log("main.leave-room", rid);
            socket.emit("leave-room", rid, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("delete-room", (ev, rid) =>
        safePromise((resolve, reject) => {
            console.log("main.delete-room", rid);
            socket.emit("delete-room", rid, (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("get-room-list", (ev) =>
        safePromise((resolve, reject) => {
            console.log("main.get-room-list");
            socket.emit("get-room-list", (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("get-room-req-list", (ev) =>
        safePromise((resolve, reject) => {
            console.log("main.get-room-req-list");
            socket.emit("get-room-req-list", (code, data) => {
                resolve({ code, data });
            });
        })
    );
    ipcMain.handle("message-to-friend", (ev, friendId, content) =>
        safePromise((resolve, reject) => {
            console.log("main.message-to-friend", friendId, content);
            socket.emit(
                "message-to-friend",
                friendId,
                content,
                (code, data) => {
                    resolve({ code, data });
                }
            );
        })
    );
    ipcMain.handle("message-to-room", (ev, rid, content) =>
        safePromise((resolve, reject) => {
            console.log("main.message-to-room", rid, content);
            socket.emit("message-to-room", rid, content, (code, data) => {
                resolve({ code, data });
            });
        })
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

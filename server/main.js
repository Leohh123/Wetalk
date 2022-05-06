const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);
// const ns = io.of("/wetalk");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let users = new Map();

io.on("connection", (socket) => {
    let user = null;

    console.log("a user connected");
    io.emit("update-userlist");

    socket.on("disconnect", () => {
        // Upon disconnection, sockets leave all the channels they were part
        // of automatically, and no special teardown is needed on your part.
        // Ref: https://socket.io/docs/v4/rooms/#disconnection
        if (user) {
            users.delete(user.uid);
        }
        console.log("user disconnected");
        io.emit("update-userlist");
    });

    socket.on("message-client", (msg) => {
        console.log("message: " + msg);
        for (const room of socket.rooms) {
            io.to(room).emit("message-server", msg);
        }
    });

    socket.on("login", (uid, callback) => {
        console.log("login", uid);
        if (user) {
            callback(2, "you have already loged in");
        } else if (users.has(uid)) {
            callback(1, "userid already exists");
        } else {
            user = { uid, socket };
            socket.user = user;
            users.set(uid, user);
            callback(0, "login successful");
        }
    });

    socket.on("room-join", (rid) => {
        for (const room of [...socket.rooms]) {
            socket.leave(room);
        }
        socket.join(rid);
        io.emit("update-userlist");
    });

    socket.on("fetch-userlist", (rid, callback) => {
        let resList = [];
        if (io.sockets.adapter.rooms.has(rid)) {
            let sids = io.sockets.adapter.rooms.get(rid);
            for (const sid of sids) {
                console.log("sid", sid);
                let u = io.sockets.sockets.get(sid).user;
                resList.push(u.uid);
            }
        }
        callback(resList);
    });
});

// Debug code
setInterval(() => {
    // console.log(users);
    for (const u of users.values()) {
        console.log(u.uid, u.socket.rooms);
    }
    // for (const [k, v] of usersById) {
    //     console.log(k, v.uid, v.socket.rooms);
    // }
    console.log(io.sockets.adapter.rooms);
    console.log("========");
}, 2000);

server.listen(3000, () => {
    console.log("listening on *:3000");
});

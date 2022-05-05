const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let users = new Map();

io.on("connection", (socket) => {
    let user = null;

    console.log("a user connected");

    socket.on("disconnect", () => {
        if (user) {
            users.delete(user.uid);
        }
        console.log("user disconnected");
    });

    socket.on("message-client", (msg) => {
        console.log("message: " + msg);
        // for (let u of users.values()) {
        //     console.log(u);
        // }
        io.emit("message-server", msg);
    });

    socket.on("login", (uid, callback) => {
        console.log("login", uid);
        if (user) {
            callback(1, "you have already loged in");
        } else if (users.has(uid)) {
            callback(2, "userid already exists");
        } else {
            user = { uid };
            users.set(uid, user);
            callback(0, "login successful");
        }
    });
});

// setInterval(() => {
//     console.log(users);
// }, 2000);

server.listen(3000, () => {
    console.log("listening on *:3000");
});

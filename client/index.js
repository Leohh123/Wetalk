const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

function submit(msg) {
    if (msg) {
        socket.emit("chat message", msg);
    }
}

setInterval(() => {
    submit("Hello world!");
}, 1000);

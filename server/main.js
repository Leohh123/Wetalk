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
let myFriends = new Map();
let myRooms = new Map();
let rooms = new Map();
let addFriendRequests = new Map();
let joinRoomRequests = new Map();

// Online info
let userToSocket = new Map();
let socketToUser = new Map();

io.on("connection", (socket) => {
    console.log("connection", socket.id);
    let currentUserId = null;

    // ======== USER ========
    socket.on("register", (uid, passwd, callback) => {
        console.log("register", uid, passwd);
        if (users.has(uid)) {
            callback(2, "用户名已存在");
        } else {
            users.set(uid, { passwd });
            myFriends.set(uid, new Set());
            myRooms.set(uid, new Set());
            addFriendRequests.set(uid, new Set());
            joinRoomRequests.set(uid, new Set());
            callback(0, "注册成功");
        }
    });

    socket.on("login", (uid, passwd, callback) => {
        console.log("login", uid, passwd);
        if (currentUserId !== null) {
            callback(2, "您已登录");
        } else if (!users.has(uid)) {
            callback(3, "用户不存在");
        } else if (users.get(uid).passwd !== passwd) {
            callback(4, "用户名或密码错误");
        } else {
            currentUserId = uid;
            userToSocket.set(uid, socket);
            socketToUser.set(socket.id, uid);
            for (const rid of myRooms.get(uid)) {
                socket.join(rid);
            }
            callback(0, "登录成功");
        }
    });

    function logout() {
        if (currentUserId === null) {
            return false;
        }
        userToSocket.delete(currentUserId);
        socketToUser.delete(socket.id);
        currentUserId = null;
        // for (const rid of [...socket.rooms]) {
        //     if (rid !== socket.id) {
        //         socket.leave(rid);
        //     }
        // }
        return true;
    }

    // [DISCARD] See /client/main.js for details
    socket.on("logout", (callback) => {
        console.log("logout", currentUserId);
        if (!logout()) {
            callback(1, "您尚未登录");
        } else {
            callback(0, "注销成功");
            socket.disconnect();
        }
    });

    socket.on("disconnect", () => {
        // Upon disconnection, sockets leave all the channels they were part
        // of automatically, and no special teardown is needed on your part.
        // Ref: https://socket.io/docs/v4/rooms/#disconnection
        console.log("disconnect");
        logout();
    });

    // ======== FRIEND ========
    socket.on("add-friend", (friendId, callback) => {
        console.log("add-friend", currentUserId, friendId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (currentUserId === friendId) {
            callback(2, "无法添加自己为好友");
        } else if (myFriends.get(currentUserId).has(friendId)) {
            callback(3, "对方已是您的好友");
        } else {
            addFriendRequests.get(friendId).add(currentUserId);
            callback(0, "好友请求已发送");
        }
    });

    socket.on("accept-friend", (friendId, callback) => {
        console.log("accept-friend", currentUserId, friendId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let friendReqSet = addFriendRequests.get(currentUserId);
            if (!friendReqSet.has(friendId)) {
                callback(2, "对方未向您发送好友申请");
            } else {
                friendReqSet.delete(friendId);
                myFriends.get(currentUserId).add(friendId);
                myFriends.get(friendId).add(currentUserId);
                callback(0, "添加好友成功");
            }
        }
    });

    socket.on("reject-friend", (friendId, callback) => {
        console.log("reject-friend", currentUserId, friendId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let friendReqSet = addFriendRequests.get(currentUserId);
            if (!friendReqSet.has(friendId)) {
                callback(2, "对方未向您发送好友申请");
            } else {
                friendReqSet.delete(friendId);
                callback(0, "已拒绝对方的好友申请");
            }
        }
    });

    socket.on("delete-friend", (friendId, callback) => {
        console.log("delete-friend", currentUserId, friendId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (!myFriends.get(currentUserId).has(friendId)) {
            callback(2, "对方不是您的好友");
        } else {
            myFriends.get(currentUserId).delete(friendId);
            myFriends.get(friendId).delete(currentUserId);
            callback(0, "好友删除成功");
        }
    });

    socket.on("get-friend-list", (callback) => {
        console.log("get-friend-list", currentUserId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let friendSet = myFriends.get(currentUserId);
            callback(0, Array.from(friendSet));
        }
    });

    socket.on("get-friend-req-list", (callback) => {
        console.log("get-friend-req-list", currentUserId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let friendReqSet = addFriendRequests.get(currentUserId);
            callback(0, Array.from(friendReqSet));
        }
    });

    // ======== ROOM ========
    socket.on("create-room", (rid, callback) => {
        console.log("create-room", currentUserId, rid);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (rooms.has(rid)) {
            callback(2, "该房间名已存在");
        } else {
            rooms.set(rid, {
                users: new Set([currentUserId]),
                ownerId: currentUserId,
            });
            myRooms.get(currentUserId).add(rid);
            socket.join(rid);
            callback(0, "房间创建成功");
        }
    });

    socket.on("join-room", (rid, callback) => {
        console.log("join-room", currentUserId, rid);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (!rooms.has(rid)) {
            callback(2, "房间不存在");
        } else {
            let room = rooms.get(rid);
            if (room.users.has(currentUserId)) {
                callback(3, "您已在该房间中");
            } else {
                let roomReqSet = joinRoomRequests.get(room.ownerId);
                roomReqSet.add([currentUserId, rid].join("|"));
                callback(0, "加入房间申请已发送");
            }
        }
    });

    socket.on("accept-roommate", (roommateId, rid, callback) => {
        console.log("accept-roommate", currentUserId, roommateId, rid);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let roomReqSet = joinRoomRequests.get(currentUserId);
            let reqStr = [roommateId, rid].join("|");
            if (!roomReqSet.has(reqStr)) {
                callback(2, "对方未申请加入该房间");
            } else {
                roomReqSet.delete(reqStr);
                rooms.get(rid).users.add(roommateId);
                myRooms.get(roommateId).add(rid);
                if (userToSocket.has(roommateId)) {
                    let roommateSocket = userToSocket.get(roommateId);
                    roommateSocket.join(rid);
                }
                callback(0, "已通过对方加入房间的申请");
            }
        }
    });

    socket.on("reject-roommate", (roommateId, rid, callback) => {
        console.log("reject-roommate", currentUserId, roommateId, rid);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let roomReqSet = joinRoomRequests.get(currentUserId);
            let reqStr = [roommateId, rid].join("|");
            if (!roomReqSet.has(reqStr)) {
                callback(2, "对方未申请加入该房间");
            } else {
                roomReqSet.delete(reqStr);
                callback(0, "已拒绝对方加入房间的申请");
            }
        }
    });

    socket.on("leave-room", (rid, callback) => {
        console.log("leave-room", currentUserId, rid);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (!rooms.has(rid)) {
            callback(2, "房间不存在");
        } else {
            let room = rooms.get(rid);
            if (!room.users.has(currentUserId)) {
                callback(3, "您不在该房间中");
            } else if (room.ownerId === currentUserId) {
                callback(4, "房主不可退出房间，但您可以选择删除房间");
            } else {
                room.users.delete(currentUserId);
                socket.leave(rid);
                callback(0, "您已退出该房间");
            }
        }
    });

    socket.on("delete-room", (rid, callback) => {
        console.log("delete-room", currentUserId, rid);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (!rooms.has(rid)) {
            callback(2, "房间不存在");
        } else {
            let room = rooms.get(rid);
            if (room.ownerId !== currentUserId) {
                callback(3, "只有房主可以删除房间");
            } else {
                for (const uid of room.users) {
                    myRooms.get(uid).delete(rid);
                }
                rooms.delete(rid);
                callback(0, "已成功删除房间");
            }
        }
    });

    socket.on("get-room-list", (callback) => {
        console.log("get-room-list", currentUserId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let roomSet = myRooms.get(currentUserId);
            let roomList = Array.from(roomSet);
            let res = roomList.map((rid) => {
                let room = rooms.get(rid);
                return {
                    rid,
                    own: currentUserId === room.ownerId,
                };
            });
            callback(0, res);
        }
    });

    socket.on("get-room-req-list", (callback) => {
        console.log("get-room-req-list", currentUserId);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else {
            let roomReqSet = joinRoomRequests.get(currentUserId);
            let roomReqList = Array.from(roomReqSet).map((reqStr) => {
                let [uid, rid] = reqStr.split("|");
                return { uid, rid };
            });
            callback(0, roomReqList);
        }
    });

    // ======== MESSAGE ========
    function tryEmitToUser(uid, eventName, ...args) {
        if (userToSocket.has(uid)) {
            let sk = userToSocket.get(uid);
            sk.emit(eventName, ...args);
        }
    }

    socket.on("message-to-friend", (friendId, content, callback) => {
        console.log("message-to-friend", currentUserId, friendId, content);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (!myFriends.get(currentUserId).has(friendId)) {
            callback(2, "对方不是您的好友");
        } else {
            let msg = {
                uid: currentUserId,
                timestamp: new Date().getTime(),
                content,
            };
            tryEmitToUser(friendId, "message-from-friend", {
                ...msg,
                id: currentUserId,
            });
            socket.emit("message-from-friend", {
                ...msg,
                id: friendId,
            });
            callback(0, "发送成功");
        }
    });

    socket.on("message-to-room", (rid, content, callback) => {
        console.log("message-to-room", currentUserId, rid, content);
        if (currentUserId === null) {
            callback(1, "您尚未登录");
        } else if (!rooms.has(rid)) {
            callback(2, "房间不存在");
        } else {
            let room = rooms.get(rid);
            if (!room.users.has(currentUserId)) {
                callback(3, "您不在该房间中");
            } else {
                io.to(rid).emit("message-from-room", {
                    uid: currentUserId,
                    id: rid,
                    timestamp: new Date().getTime(),
                    content,
                });
                callback(0, "发送成功");
            }
        }
    });
});

// Debug code
setInterval(() => {
    // console.log(users);
    for (const [uid, sk] of userToSocket) {
        console.log(uid, sk.rooms);
    }
    // let users = new Map();
    // let myFriends = new Map();
    // let myRooms = new Map();
    // let rooms = new Map();
    // let addFriendRequests = new Map();
    // let joinRoomRequests = new Map();
    console.log("USERS", users);
    console.log("ROOMS", rooms);
    console.log(io.sockets.adapter.rooms);
    console.log("========");
}, 2000);

const PORT = 2468;

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

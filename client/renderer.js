let inputUserId = document.getElementById("input-userid");
let btnLogin = document.getElementById("btn-login");
btnLogin.onclick = async () => {
    let uid = inputUserId.value;
    let { code, data } = await window.wetalkAPI.login(uid);
    console.log(code, data);
};

let inputRoom = document.getElementById("input-room");
let btnJoin = document.getElementById("btn-join");
btnJoin.onclick = () => {
    let room = inputRoom.value;
    window.wetalkAPI.roomJoin(room);
};

let inputSend = document.getElementById("input-send");
let btnSend = document.getElementById("btn-send");
btnSend.onclick = () => {
    let msg = inputSend.value;
    window.wetalkAPI.sendMessage(msg);
    console.log("send msg", msg);
};

let ulMessages = document.getElementById("ul-messages");
window.wetalkAPI.onReceiveMessage((ev, msg) => {
    console.log("receive msg", msg);
    ulMessages.innerHTML += `<li>${msg}</li>`;
});

let ulUserList = document.getElementById("ul-userlist");
window.wetalkAPI.onRefreshUserList((ev, userList) => {
    ulUserList.innerHTML = userList.map((uid) => `<li>${uid}</li>`).join("");
    console.log(userList);
});

let inputUserId = document.getElementById("input-userid");
let btnLogin = document.getElementById("btn-login");

btnLogin.onclick = async () => {
    let uid = inputUserId.value;
    let { code, data } = await window.wetalkAPI.login(uid);
    console.log(code, data);
};

let inputSend = document.getElementById("input-send");
let btnSend = document.getElementById("btn-send");

btnSend.onclick = async () => {
    let msg = inputSend.value;
    window.wetalkAPI.sendMessage(msg);
    console.log("send msg", msg);
};

window.wetalkAPI.onReceiveMessage((ev, msg) => {
    console.log("receive msg", msg);
});

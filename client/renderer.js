let inputSend = document.getElementById("input-send");
let btnSend = document.getElementById("btn-send");

btnSend.onclick = () => {
    let msg = inputSend.value;
    window.wetalkAPI.send(msg);
};

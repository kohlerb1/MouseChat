const socket = io();

var uname = document.getElementById("name").value;
console.log(uname);
socket.emit('onlineKeep', uname);

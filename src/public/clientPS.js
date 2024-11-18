const socket = io();
const receiver = window.location.pathname;
const [trash1, trash2, sndrcv] = receiver.split("/");
const [sender, rcv] = sndrcv.split("~");


console.log(sndrcv);
console.log(sender);
console.log(rcv);
console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const input = document.getElementById('input');
socket.emit('establishSocketPS', sender);
console.log('consts declared');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('privateSqueak', input.value, rcv);
        input.value = '';
    }
});

socket.on('privateSqueak', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

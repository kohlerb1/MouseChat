const socket = io();
const receiver = window.location.pathname;
const [trash1, trash2, rcv] = receiver.split("/");

console.log(rcv)
console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
console.log('consts declared');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('privateSqueak', input.value, reciever);
        input.value = '';
    }
});

console.log('event listener added');

socket.on('privateSqueak', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

console.log('end reached');
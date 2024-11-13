const socket = io();

console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
console.log('consts declared');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

console.log('event listener added');

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

console.log('end reached');
const { getChatHistory } = require("../controllers/controller");
const groupChatModel = require("../models/groupChatModel");

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

// ChatGPT Code 
//Testing code//
const userId = 'user123'
const user = await UserModel.findById(userId);

const test_group = new groupChatModel({
    name: 'Group A',
    allowedUsers: [user],
    chatHistory: [],
});


socket.emit('joinGroup', {userId: 'user123', groupName: 'Group A'});
//////////////////////////////////////////////////////////////////////

socket.on('chatHistory', chatHistory => {
    console.log('Chat History', chatHistory);
});

socket.on('newMessage', message => {
    console.log('New message:', message);
})

socket.emit('sendMessage', {userId: 'user123', groupName: 'Group A', content: 'Hello World'});
/////////////////////////////////////////////////////////////////////

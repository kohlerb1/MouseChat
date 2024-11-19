// const { getChatHistory } = require("../controllers/controller");
// const MouseHold = require("../models/mouseHold");

const socket = io();

console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const contentInput = document.getElementById('content');
const attachmentInput = document.getElementById('attachment');
const messages = document.getElementById('messages');

console.log('consts declared');
const reciever = window.location.pathname;
const [path1, path2, path3, uname] = reciever.split("/");
console.log("Uname: " + uname);


//Adapted from ChatGPT Code

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const sender = uname;
    const content = contentInput.value.trim();
    if (!content) {
        console.error('Message content cannot be empty.');
        return;
    }


    // Emit hoard message
    socket.emit('hoard message', {sender, content});

    contentInput.value = '';
});

console.log('event listener added');

socket.on('hoard message', (msg) => {
    console.log("msg: " + msg);
    const item = document.createElement('li');
    item.textContent = `${msg.senderUname}: ${msg.content}`;
    if(msg.attachment) {
        //********Currently Does Not Work ********************/
        item.textContent += ` | Attachment: ${msg.attachment}`;
    }
    messages.appendChild(item);
  
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
});

console.log('end reached');

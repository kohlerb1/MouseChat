// const { getChatHistory } = require("../controllers/controller");
// const MouseHold = require("../models/mouseHold");

const socket = io();

console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const contentInput = document.getElementById('content');
const attachmentInput = document.getElementById('attachment');
const messages = document.getElementById('messages');
console.log('consts declared');

//Adapted from ChatGPT Code
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = contentInput.value.trim();
    if (!content) {
        console.error('Message content cannot be empty.');
        return;
    }

    // Read attachment file if any
    const attachment = attachmentInput.files[0] 
        ? {
            name: attachmentInput.files[0].name,
            data: attachmentInput.files[0],
            type: attachmentInput.files[0].type,
        }
        : null;

    // Emit hoard message
    socket.emit('hoard message', { content, attachment });

    contentInput.value = '';
    attachmentInput.value = '';
});

console.log('event listener added');

socket.on('hoard message', (msg) => {
    const item = document.createElement('li');
    item.textContent = `From: ${msg.sender}\n Message: ${msg.content}`;
    if(msg.attachment) {
        //********Currently Does Not Work ********************/
        item.textContent += `| Attachment: ${msg.attachment}`;
    }
    messages.appendChild(item);
  
});

console.log('end reached');

// ChatGPT Code 
//Testing code//
//const userId = 'user123'
//const user = await UserModel.findById(userId);

// const test_group = new groupChatModel({
//     name: 'Group A',
//     allowedUsers: [user],
//     chatHistory: [],
// });


//socket.emit('joinGroup', {userId: 'user123', groupName: 'Group A'});
//////////////////////////////////////////////////////////////////////

socket.on('chatHistory', chatHistory => {
    console.log('Chat History', chatHistory);
});

socket.on('newMessage', message => {
    console.log('New message:', message);
})

socket.emit('sendMessage', {userId: 'user123', groupName: 'Group A', content: 'Hello World'});
/////////////////////////////////////////////////////////////////////

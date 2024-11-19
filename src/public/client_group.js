// const { getChatHistory } = require("../controllers/controller");
// const MouseHold = require("../models/mouseHold");

const socket = io();

console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const contentInput = document.getElementById('content');
const attachmentInput = document.getElementById('attachment');
const messages = document.getElementById('messages');
const user_element = document.getElementById('user');
const group_element = document.getElementById('group');
const url_info = window.location.pathname;
console.log(url_info);
const user_info = url_info.split("/")[3];
const user = user_info.split("~")[1];
const group = user_info.split("~")[0];


console.log(user);
console.log(group);


console.log('consts declared');

socket.emit('joinGroupChat', {user, group});

// socket.emit('joinGroup', {userId: 'user123', groupName: 'Group A'})


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
    console.log("-----------");
    console.log(user);
    console.log(group);
    console.log("-----------");

    //socket.emit('joinGroupChat', {user, group});
    console.log("Sending message ...")
    socket.emit('sendGroupMessage', { user, group, content });
    console.log("Message sent");
    contentInput.value = '';
    attachmentInput.value = '';
});

console.log('event listener added');

socket.on('groupChatMessage', (msg) => {
    console.log("####################");
    console.log("msg: " + msg);
    const item = document.createElement('li');
    item.textContent = `${msg.sender}: ${msg.content}`;
    if(msg.attachment) {
        //********Currently Does Not Work ********************/
        item.textContent += ` | Attachment: ${msg.attachment}`;
    }
    messages.appendChild(item);
  
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
});

socket.on('chatHistory', chatHistory => {
    console.log(chatHistory);
    
    for (i = 0; i < chatHistory.length; i++){
        const item = document.createElement('li');
        item.textContent = chatHistory[i];
        messages.appendChild(item);
    }
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

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


//socket.emit('sendMessage', {userId: 'user123', groupName: 'Group A', content: 'Hello World'});
/////////////////////////////////////////////////////////////////////

const socket = io();
const receiver = window.location.pathname;
const [trash1, trash2, sndrcv] = receiver.split("/");
const [sender, recipient] = sndrcv.split("~");


console.log(sndrcv);
console.log("Sender: " + sender);
console.log("Recipient: " + recipient);
console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const contentInput = document.getElementById('content');
const attachmentInput = document.getElementById('attachment');
const messages = document.getElementById('messages');
socket.emit('establishSocketPS', {sender, recipient});
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

    // Emit squeak message
    socket.emit('privateSqueak', {sender, recipient, content, attachment});

    contentInput.value = '';
    attachmentInput.value = '';
});

socket.on('privateSqueak', (msg) => {
    console.log("msg: " + msg);
    console.log("sender username: "+ msg.senderUname);
    if(msg.senderUname == recipient){
        const item = document.createElement('li');
        item.textContent = `${msg.senderUname}: ${msg.content}`;
        if(msg.attachment) {
            //********Currently Does Not Work ********************/
            item.textContent += ` | Attachment: ${msg.attachment}`;
        }
        messages.appendChild(item);
  
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
});

socket.on('privateSqueakSelf', (msg) => {
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

socket.on('chatHistoryPS', (chatHistory) => {
    console.log(chatHistory);
    
    for (i = 0; i < chatHistory.length; i++){
        const item = document.createElement('li');
        item.textContent = chatHistory[i];
        messages.appendChild(item);
    }
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

});

console.log('end reached');


const socket = io();
const receiver = window.location.pathname;
const [trash1, trash2, sndrcv] = receiver.split("/");
const [sender, recipient] = sndrcv.split("~");


console.log(sndrcv);
console.log(sender);
console.log(rcv);
console.log('CLIENT RUNNING');
const form = document.getElementById('form');
const contentInput = document.getElementById('content');
const attachmentInput = document.getElementById('attachment');
const messages = document.getElementById('messages');
socket.emit('establishSocketPS', sender);
console.log('consts declared');

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

    e.preventDefault();
    socket.emit('privateSqueak', { sender, recipient, content, attachment });

    contentInput.value = '';
    attachmentInput.value = '';
});

socket.on('privateSqueak', (msg) => {
    const item = document.createElement('li');
    item.textContent = `From: ${msg.sender}\n Message: ${msg.content}`;
    if(msg.attachment) {
        //********Currently Does Not Work ********************/
        item.textContent += ` | Attachment: ${msg.attachment}`;
    }
    messages.appendChild(item);
  
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
});

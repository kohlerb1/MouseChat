const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');



const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const upload = multer({ storage:storage });
const session = require('express-session');

const server = http.createServer(app);
const io = socketIo(server);
const db = require('./config/db');


app.set('view engine', 'pug');
app.set('views','./views');

//app.use('views', express.static('views'));
app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session( {secret: "Mellon"}));

//************************************************ */
app.get('/socket-test', (req, res) => {  
    const name = path.join(__dirname, 'views/index.html');
    res.sendFile(name);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Adapted from ChatGPT
    socket.on('joinGroupChat', async ({ userId, groupName}) => {

        // Gets the groupChat object for the specified groupChat name and populates the data for each allowed User in the allowedUsers field of the groupChat object 
        const groupChat = await groupChatModel.findOne({ name: groupName}).populate('allowedUsers');

        // If the groupChat exists 
        if (groupChat) {
            const user = await UserModel.findById(userId);
            // If there is a user in the allowed users that matches the current user
            if (groupChat.allowedUsers.some(u => u._id.equals(user._id))) {
                socket.join(groupName)
                console.log(`${user.username} joined the group ${groupName}`);
                // Get the chat history for the group chat
                const chatHistory = await getChatHistory(groupChat._id);
                socket.emit('chatHistory', chatHistory);
            } else {
                socket.emit('error', 'You are not a part of this groupChat');
            }
        } else {
            socket.emit('error', 'Groupchat does not exist');
        }
    });

    socket.on('sendGroupMessage', async ({ userId, groupName, content }) => {
        // Find group chat by name
        const groupChat = await groupChatModel.findOne({name: groupName});

        // Create the message object
        if(groupChat){
            const message = new messageModel({
                sender: userId,
                content: content,
            });

            // Save the message
            await message.save();
            // Update the chat history 
            groupChat.chatHistory.push(message._id);
            await groupChat.save();

            io.to(groupName).emit('newMessage', {
                sender: userId,
                content: message.content,
            });
        } else {
            socket.emit('error', 'Groupchat not found');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
//*********************************************** */


const router = require('./routes');
const { group } = require('console');
const { getChatHistory } = require('./controllers/controller');
app.use('/', router.Router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

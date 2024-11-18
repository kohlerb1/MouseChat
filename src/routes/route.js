const router = require("express").Router();

const Controller= require("../controllers/controller");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage:storage });

//const socketIo = require('socket.io');
//const server = require('../index');
const io = require('../index.js');
const path = require('path');

const session = require("express-session");
const mouseHoleModel = require("../models/mouseHole.js");
const UserModel = require('../models/model.js');
const messageModel = require("../models/messageModel.js");

const {getChatHistory} = require('../controllers/controller.js');
const { group } = require("console");

router.get('/signup', (req, res) => {
    res.render('signup');
});
//router.post call function to go to do signup

router.get('/login', (req, res) => {
    res.render('login');
});
//router.post call function to do login
router.post('/login', Controller.login);
// router post call function to do sign up, takes a single file upload 
router.post('/signup', upload.single('profilepicture'), Controller.createUser);

//protected page stuff here

//check for authenticated to access protected page
const checkSignIn = (req, res, next) => { // note: does not work on redirect from inital signup, but works on login
    
    if(req.session.user){
        return next() //If session exists, proceed to page
    } else{
       res.render('not_logged')
    }
};

// router call for proected page, calls checksign in for authication before accessing protected page
router.get('/protected', checkSignIn, (req, res) => {
    // Code used to unpack the buffer data from the picture and pass it to the pug file comes from ChatGPT
    const bufferData = Buffer.from(req.session.user.profilepicture.data.data);
    const profilePic = bufferData.toString('base64');
    const contentType = req.session.user.profilepicture.contentType;
    // pass the user name, cheese, and profile picture data to the pug file 
    res.render('protected_page', {id: req.session.user.username, cheese: req.session.user.cheese, pic: `data:${contentType};base64,${profilePic}`});
});

//router.delete("/:username/:password", Controller.deleteUser);
//.put("/:username/:password/cheese", Controller.updateUserCheese);
//router.put("/:username/:password/pfp", Controller.updateUserPfp);

//home page here
router.get('/', (req, res) => {
    res.render('homepage');
});
router.get("/all", Controller.getAllUsers);
router.get("/get/:username/:password", async (req, res) => {
    try {
        const uname = req.params.username;
        const pword = req.params.password;

        // Fetch user from the database
        const user = await User.findOne({ username: uname, password: pword });

        // Check if user exists
        if (!user) {
            return res.status(404).render('test', { message: 'User not found' });
        }

        // If user has a profile picture, render the Pug template
        res.render('test', { user, message: '' });
    } catch (error) {
        console.error(error);
        res.status(500).render('test', { message: 'Internal server error' });
    }
});
//

// router get call to logout 
router.get('/logout', checkSignIn, Controller.logout);

module.exports = router;
//all protected page-accessed pages, need to be signed in to reach
//post functions are accessed by PUG files, called thru buttons
router.get("/updateUserCheese", checkSignIn, (req, res) => {
    res.render("updateUserCheese", {id: req.session.user.id});
})
router.post("/updateUserCheese", Controller.updateUserCheese);

router.get("/updateUserPFP", checkSignIn, (req, res) => {
    res.render("updateUserPFP", {id: req.session.user.id});
})
router.post("/updateUserPFP", upload.single('profilepicture'), Controller.updateUserPfp);

router.get("/deleteUser", checkSignIn, (req, res) => {
    res.render("deleteUser", {id: req.session.user.id});
})
router.post("/deleteUser", Controller.deleteUser);

router.get("/updateUserName", checkSignIn, (req, res) => {
    res.render("updateUserName", {id: req.session.user.id});
})
router.post("/updateUserName", Controller.updateUserName);

router.get("/updateUserPassword", checkSignIn, (req, res) => {
    res.render("updateUserPassword", {id: req.session.user.id});
})
router.post("/updateUserPassword", Controller.updateUserPassword);

router.get('/settings', (req, res) => {
    res.render('settings');
});
//************SOCKET DIRECTS************************** */
router.get('/socket-test', (req, res) => {  
    const name = path.join(__dirname, '../views/index.html');
    res.sendFile(name);
});

router.get('/message', (req, res) => {
    res.render('groupMessage');
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    //socket.on('mousehole')

    // Adapted from ChatGPT
    socket.on('joinGroupChat', async (msg) => {
        userId = msg.user;
        groupName = msg.group;
        console.log(userId);
        console.log(groupName);
        // Gets the groupChat object for the specified groupChat name and populates the data for each allowed User in the allowedUsers field of the groupChat object 
        const groupChat = await mouseHoleModel.findOne({ name: groupName}).populate('allowedUsers');

        // If the groupChat exists 
        if (groupChat) {
            console.log("groupchat found");
            const user = await UserModel.findOne({username: userId});
            console.log(user);
            // If there is a user in the allowed users that matches the current user
            if (groupChat.allowedUsers.some(u => u._id.equals(user._id))) {
                socket.join(groupName)
                console.log(`${user.username} joined the group ${groupName}`);
                // Get the chat history for the group chat
                const chatHistory = await getChatHistory(groupChat._id);
                console.log(chatHistory);
                socket.emit('chatHistory', chatHistory);
            } else {
                console.log("you arent in this one bud");
                socket.emit('error', 'You are not a part of this groupChat');
            }
        } else {
            console.log("schizo");
            socket.emit('error', 'Groupchat does not exist');
        }
    });

    socket.on('sendGroupMessage', async (msg) => {
        const userId = msg.user;
        const groupName = msg.group;
        const content = msg.content;
        console.log(userId);
        console.log(groupName);
        console.log(content);
        // Find group chat by name
        const groupChat = await mouseHoleModel.findOne({name: groupName});
        const user_objID = await UserModel.findOne({username: userId});

        // Create the message object
        if(groupChat){
            console.log("Groupchat found");
            const message = new messageModel({
                sender: user_objID._id,
                content: content,
            });

            console.log(message);

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

    socket.on('chatHistory', chatHistory => {
        console.log('Chat History:', chatHistory);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});





//catches anything not in website to redirect to the homepage
router.get("/*", (req, res) => {
    res.render('homepage');
})




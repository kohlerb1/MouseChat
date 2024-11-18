const router = require("express").Router();
const User = require('../models/model');

const Controller= require("../controllers/controller");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage:storage });
const Message = require("../models/messageModel.js")
const Hoard = require("../models/hoard.js");
//const socketIo = require('socket.io');
//const server = require('../index');
let io = require('../index.js');
const path = require('path');

const session = require("express-session");

router.get('/signup', (req, res) => {
    res.render('signup.pug');
});
//router.post call function to go to do signup

router.get('/login', (req, res) => {
    res.render('login.pug');
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
       res.render('not_logged.pug')
    }
};

// router call for proected page, calls checksign in for authication before accessing protected page
router.get('/protected', checkSignIn, (req, res) => {
    // Code used to unpack the buffer data from the picture and pass it to the pug file comes from ChatGPT
    const bufferData = Buffer.from(req.session.user.profilepicture.data.data);
    const profilePic = bufferData.toString('base64');
    const contentType = req.session.user.profilepicture.contentType;
    // pass the user name, cheese, and profile picture data to the pug file 
    res.render('protected_page.pug', {id: req.session.user.username, cheese: req.session.user.cheese, pic: `data:${contentType};base64,${profilePic}`});
});

//router.delete("/:username/:password", Controller.deleteUser);
//.put("/:username/:password/cheese", Controller.updateUserCheese);
//router.put("/:username/:password/pfp", Controller.updateUserPfp);

//home page here
router.get('/', (req, res) => {
    res.render('homepage.pug');
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
    res.render("updateUserCheese.pug", {id: req.session.user.id});
})
router.post("/updateUserCheese", Controller.updateUserCheese);

router.get("/updateUserPFP", checkSignIn, (req, res) => {
    res.render("updateUserPFP.pug", {id: req.session.user.id});
})
router.post("/updateUserPFP", upload.single('profilepicture'), Controller.updateUserPfp);

router.get("/deleteUser", checkSignIn, (req, res) => {
    res.render("deleteUser.pug", {id: req.session.user.id});
})
router.post("/deleteUser", Controller.deleteUser);

router.get("/updateUserName", checkSignIn, (req, res) => {
    res.render("updateUserName.pug", {id: req.session.user.id});
})
router.post("/updateUserName", Controller.updateUserName);

router.get("/updateUserPassword", checkSignIn, (req, res) => {
    res.render("updateUserPassword.pug", {id: req.session.user.id});
})
router.post("/updateUserPassword", Controller.updateUserPassword);

router.get('/settings', (req, res) => {
    res.render('settings.pug');
});

// ****************************** Deugging code, will be changed when message selector is made**********************************
router.get('/message/horde', (req, res) => {
    res.render('horde_message');
})
//********************************************************************************


//************SOCKET DIRECTS************************** */
router.get('/socket-test', (req, res) => {  
    const name = path.join(__dirname, '../storage/index.html');
    res.sendFile(name);
});

router.get("/message/:sndrcv", (req,res) => { 
    const name = path.join(__dirname, '../storage/PS.html');
    res.sendFile(name);
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('establishSocketPS', (sender) => {
        console.log("#############");
        console.log(sender);
        console.log(socket.id);
        console.log("#############");
        Controller.updateUserSocket(sender, socket.id);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
        Controller.resetUserSocket(socket.id);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('privateSqueak', async(msg, rcv) => { //rcv is user name as string
        const query = {username: rcv};
        let socketid = 0;
        await User.findOne(query).then( (foundUser) => {
        if (!foundUser){ //if no user macthes session, rerender page and display error
            console.log("no such user")
            return;
        } 
        socketid = foundUser.socketID
        })
        io.to(socketid).emit("privateSqueak", msg);
        io.to(socket.id).emit("privateSqueak", msg);
    });
    
    socket.on('hoard message', async (msgData) => {
        try {
          const message = new Message({
            sender: msgData.sender,
            recipient: msgData.recipient, 
            content: msgData.content,
            attachment: msgData.attachment,
          });
    
          const savedMessage = await message.save();
          
          const hoard = await Hoard.findOne();
          if (!hoard) {
            // Create and save a new Hoard document if it doesn't exist
            const newHoard = new Hoard({ chatHistory: [] });
            await newHoard.save();
            console.log('New Hoard created');
          }
          hoard.chatHistory.push(savedMessage._id);
          await hoard.save();

          // Emit the saved message back to all connected clients
          io.emit('hoard message', savedMessage);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });
});





//catches anything not in website to redirect to the homepage
router.get("/*", (req, res) => {
    res.render('homepage.pug');
})




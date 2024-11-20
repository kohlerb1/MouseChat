const User = require('../models/model');
const PrivateSqueak = require('../models/privateSqueakModel');
const Group = require('../models/model'); //constant for group
const bcrypt = require('bcryptjs');
const path = require('path');
//const User = require('../models/temp_model');
const Horde = require("../models/hoard");
const fs = require('fs');
const UserModel = require('../models/model');
const MouseHole = require('../models/mouseHole');
const Message = require('../models/messageModel');
const mouseHoleModel = require('../models/mouseHole');
//###############################################
// UTILITY FUNCTIONS #######################
//###############################################

const userExists = async (uname) => {
    query = {username: uname};
    return await User.exists(query);
};

const mouseholeExists = async (gname) => {
    query = {name: gname};
    return await MouseHole.exists(query);
};

const findUsername = async (uname) => {
    const query = {username: uname};
    return await User.findOne(query);
};

const findUser = async (uname, pword) => {
    const query = {username: uname, password: pword};
    return await User.findOne(query);
};

const getAllUsers = async (req,res) => {
    try{
        User.find().sort('-date').then( (allUsers) => {
            console.log(allUsers);
            res.status(200).render('all',{success: true, allUsers});
        })
        .catch((error) => {
            res.status(404).json({ success:false, message: "Can't find ", error});
        })
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error", error:error.message});
    }
};

const getUserByName = async(req, res) => {
    try{
        let uname = req.body.username

        let query = {username: uname};

        await User.findOne(query).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({success: false, message: "Unable to Find User", error: "User does not Exist"});
            res.status(201).json({success: true, foundUser});
        })
        .catch( (error) => {
            res.status(404).json({success: false, error: error.message});
        });
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
};

// find groupname fucntion for getting group chat url
const findGroupname = async (req, res) => {
    const query = {groupname: group};
    return await Group.findOne(query);
};

// Takes in the username to find the user object id, then find all associated groupchat names 
const getUserGroups = async (user) => {
    console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
    console.log(user);
    const u = await UserModel.findByName(user);
    console.log(u);
    let chatList = u.groups;
    console.log(chatList);
    let mouseholes = [];

    for (let i = 0; i < chatList.length; i++){
        let gc = await mouseHoleModel.findById(chatList[i]._id);
        if(!gc){
            console.log("fake");
            continue;
        }
        let gc_members = [];
        for (let j = 0; j < gc.allowedUsers.length; j++){

            let member = await UserModel.findById(gc.allowedUsers[j]._id);
            console.log("????????????????????????");
            console.log(gc.allowedUsers[j]);
            console.log(member);
            if (member.username == user){
                continue;
            }
            gc_members.push(member);
        }
        mouseholes.push({name: gc.name, members: gc_members });
    }

    return mouseholes;
}


//###############################################
// SIGNUP / LOGIN ###############################
//###############################################

const createUser = async (req,res) => {
    try{
        const userData = await req.body;
        console.log(`This is the data: ${JSON.stringify(userData)}`);

        let uname = userData.username;
        let pword = userData.password;
        let cheeze = userData.cheese;
        let propic;

        if (!req.file) {
            img_file = fs.readFileSync('./views/images/defaultPic.jpg');
            type = 'image/jpg';
            propic = { data: img_file, contentType: type };
        } else {
            propic = { data: req.file.buffer, contentType: req.file.mimetype };
        }
        
        if (await userExists(uname)) {
            res.render("signup", {message: "User Already Exists"})
            return;
        }

        //hash and salt the password, will change the data of input of db_data
        const saltRounds = 10; // # of salt rounds

        // a couple different hashings, looks like some external error b/c these work fine as far as actually hashing
        
        const hashed_pword = await bcrypt.hash(pword, saltRounds).then( function(hash) {
            console.log('Hash:', hash)
            return hash; 
        })
        .catch(err => console.error("hash error"))
        
        //enter data into the database
        let db_data = {username: uname, password: hashed_pword, cheese: cheeze, profilepicture: propic, contacts: [], groups: [], isOnline: false, socketID: "0"}; //change pword to hashed_pword, returns 404 error User does not exist
        await User.create(db_data).then( (createdUser) => {
            if (!createdUser)
                return res.status(404).json({ success: false, message: "User creation failed", error: "Unable to get created User" });

            //res.status(201).json({ success: true, createdUser});
            const user = createdUser;
            res.redirect('/login');
        })

        .catch( (error) => {
            //res.status(404).json({ success: false, error: error.message});
            res.render("signup", {message: error.message})
        });
    } catch (error) {
        //res.status(500).json({ success: false, message: "Internal server error"});
        res.render("signup", {message: "Internal Server Error"})
    }
};


// The below function handles login requests 
const login = async(req, res) => {
    // If no username or password is submitted, redirect back to the login page 
    if (!req.body.username || !req.body.password) {
        res.render('login', {message: "Please enter both your username and password"});
        return;
    }   
    
    // Get the corresponding user from mongodb
    let user = await findUsername(req.body.username)

    console.log("<Login> Find: ", user);

    // if no user is found, send back to login with an invalid credentials message 
    if(user === undefined || user === null) {
        res.render('login', {message: "Invalid credentials!"});
        return;
    } else {
        // user found 
        //check input password with hash in database
        var hashPassword = user.password // get it from the database call from findUser
        var pword = req.body.password //login attempt entered password
        bcrypt.compare( pword, hashPassword)
        .then(function(result) {
            if (result == true){ // if true than successful login, start a session and redirect to protected page
                changeActive(true, user.username, user.password);
                user.isOnline = true
                req.session.user = user;
                res.redirect('/message');
                return;
            } else{ //return invalid credentials error
                res.render('login', {message: "Invalid Credentials, Incorrect Password"});
            }
        })
        
    }
};

// function handles logging  out 
const logout = async (req, res) => {
    let user = req.session.user.username;
    let pword = req.session.user.password;
    // destroy the current user's session 
    await req.session.destroy( () => {
        changeActive(false, user, pword)
        console.log(`${user} logged out`);
    });
    // send user back to the homepage 
    res.redirect('/');
}

// Name is the string name of the group chat you wish to create 
// users is an array of username strings 
// Method creates a groupchat given the name of the chat and an array of the users, will fail to create the chat if any of the specified users don't exist
const createMouseHole = async(name, users) => {
    console.log(users);

    if (await mouseholeExists(name)) {
        console.log("Group Chat Already Exists!!");
        return;
    }

    const groupChat = new MouseHole({
        name: name,
        allowedUsers: [], 
        chatHistory: [],
    })
    for (let i = 0; i < users.length; i++){
        u = await UserModel.findByName(users[i]);
        if(u){
            groupChat.allowedUsers.push(u._id);
        } else {
            console.log("Mousehole unable to be made!");
            console.log(`${users[i]} not found!`);
            return;
        }
    }
    console.log('i believe it worked' + groupChat.allowedUsers + groupChat.name);
    await groupChat.save();

    // This loop can only run if the groupchat is successfully made with all users
    for (let i = 0; i < users.length; i++){
        u = await UserModel.findByName(users[i]);
        u.groups.push(groupChat._id);
        await u.save();
    }

}

async function getChatHistory(chatId) {
    //const groupChat = await groupChatModel.findById(chatId).populate('chatHistory');
    const groupChat = await MouseHole.findById(chatId);
    console.log(groupChat);
    //console.log(groupChat.chatHistory);
    if(!groupChat){
        return [];
    }
    const chatHistory = groupChat.chatHistory;
    let mouseHoleHistory = [];

    for (let i = 0; i < chatHistory.length; i++){
        console.log("===========");
        console.log(chatHistory[i]);
        msg = await Message.findById(chatHistory[i]._id);
        if(!msg){
            console.log("not found");
            continue;
        }  
        sender = await UserModel.findById(msg.sender._id);
        mouseHoleHistory.push(`${sender.username}: ${msg.content}`);
    }
    console.log("----------------")
    console.log(chatHistory);
    console.log("-------------");
    console.log(mouseHoleHistory);
    return(mouseHoleHistory);
}



//###############################################
// DELETE ACCOUNT ######################
//###############################################

























//************LINE 100 *///////////////
const deleteUser = async (req, res) => {
    try{
         //login attempt entered password
        let uname = req.body.username;
        let pword = req.body.password;
        //password and username from established session
        let hashPassword = req.session.user.password;
        let unameCheck = req.session.user.username;

        bcrypt.compare( pword, hashPassword) //compare two passwords 
        .then(function(result) { //result if boolean, true if same
            if (result == true && uname == unameCheck){ //if both username and password match session info
                //make query and do delete
                let query = {username: unameCheck, password: hashPassword};
                doDelete(query, unameCheck, hashPassword, req, res); 
            } else { //otherwise throw error and display
                maintainDelete(unameCheck, hashPassword, req);
                res.render("deleteUser", {message: "Invalid user credentials!!!"});
                return;
            }})
        } catch (error) {  //if caught, reload page and load error
        maintainDelete(unameCheck, hashPassword, req);
        res.render("deleteUser", {message: "Internal server error"});
        return;   
        };
}
const doDelete = async(query, unameCheck, hashPassword, req, res) => {
    await User.findOneAndDelete(query).then( (foundUser) => { //find delete user on matching password/user
        if (!foundUser) { //if no match, throw and display user
              maintainDelete(unameCheck, hashPassword, req);
              res.render("deleteUser", {message: "Invalid user credentials!"});
                return;
            }
        //res.status(201).json({ success: true, foundUser});
        logout(req, res);  //on success logout, goes back to protected page
        return;
        })  //when findOneDelete has error, catch, 
        .catch( (error) => {
            maintainDelete(unameCheck, hashPassword, req);
            res.render("deleteUser", {message: "Invalid user credentials!!"});
            return;
        });
} //ensures user session is maintained between failed attempts, used to not happen before this
const maintainDelete = async(uname, pword, req) => {
    let user = await findUser(uname, pword);
    req.session.user = user;
    return;
};






//###############################################
// UPDATES ##################################
//###############################################

const updateUserPfp = async (req, res) => {
    try{ 
        //get username and password from the user session
        let uname = req.session.user.username
        let pword = req.session.user.password
        //if somehow no profiled picture is loaded, throw an error
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No profile picture uploaded!" });
        }
        //make pic, query, and set pic as the update value
        const propic = { data: req.file.buffer, contentType: req.file.mimetype };
        let query = {username: uname, password: pword};
        let update = {profilepicture: propic};
        //do the update on query and update
        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser) //if no matching user to session info
                res.render("updateUserPFP", {message: "Not properly logged in"})
            internalUpdate(uname, pword, req, res); //on success, update user session with updated info
        }) //on update and find catch error and redisplay/prompt
        .catch ( (error) => {
            res.render("updateUserPFP", {message: "Not properly logged in"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){ //on try catch error and redisplay/prompt
        res.render("updateUserPFP", {message: "Internal Server Error"})
        //res.status(500).json({ success: false, message: "Internal server error"});
    }
};

const internalUpdate = async(uname, pword, req, res) => {
    let user = await findUser(uname, pword); //finds matching username/password in database, updates session to it
    req.session.user = user;
    res.redirect('/protected'); //redirects to user protected page
};
//************LINE 200 */////////////// 



// const getUser = async(req, res) => {
//     try{
//         let uname = req.body.username
//         let pword = req.body.password 

//         let query = {username: uname, password: pword};

//         await User.findOne(query).then( (foundUser) => {
//             if (!foundUser)
//                 return res.status(404).json({success: false, message: "User retrieval failed", error: "Unable to find User"});
//             res.status(201).json({success: true, foundUser});
//             //do messaging stuff here, on success case, for next sprint
//         })
//         .catch( (error) => {
//             res.status(404).json({success: false, error: error.message});
//         });
//     } catch (error) {
//         res.status(500).json({success: false, message: "Internal Server Error"});
//     }
// };




















 






//************LINE 300 *///////////////
const updateUserCheese = async (req, res) => {
    try{
        //get username password from user session
        let uname = req.session.user.username
        let pword = req.session.user.password
        //get cheese from input cheese box
        let ch = req.body.cheese
        //make query and update on approproate infromation
        let query = {username: uname, password: pword};
        let update = {cheese: ch};
        //update cheese of user that matches user
        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser) //if no user macthes session, rerender page and display error
                res.render("updateUserCheese", {message: "Not properly logged in"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
        internalUpdate(uname, pword, req, res); //update session to be able to display cheese on homepage
        return;    
        })
        .catch ( (error) => { //catch find and update errors to display error to user
            res.render("updateUserCheese", {message: "Not properly logged in"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){ //catch big try block and display error
        res.render("updateUserCheese", {message: "Internal server error"})
    }
};

const updateUserPassword = async (req, res) => {
    try{
        //get username password from user session
        let uname = req.session.user.username;
        let pword = req.session.user.password;
        //get user from input username box
        const saltRounds = 10;
        let newPword = req.body.password;
        const pwordHashed = await bcrypt.hash(newPword, saltRounds).then( function(hash) {
            console.log('Hash:', hash)
            return hash; 
        })
        .catch(err => console.error("hash error"))
        //make query and update on approproate infromation
        let query = {username: uname, password: pword};
        let update = {password: pwordHashed};
        //update cheese of user that matches user
        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser) //if no user macthes session, rerender page and display error
                res.render("updateUserPassword", {message: "Not properly logged in"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
        internalUpdate(uname, pwordHashed, req, res); //update session to be able to display cheese on homepage
        return;    
        })
        .catch ( (error) => { //catch find and update errors to display error to user
            res.render("updateUserPassword", {message: "Not properly logged in"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){ //catch big try block and display error
        res.render("updateUserPassword", {message: "Internal server error"})
    }
};

const updateUserName = async (req, res) => {
    try{
        //get username password from user session
        let uname = req.session.user.username;
        let pword = req.session.user.password;
        //get user from input username box
        if (await userExists(req.body.username)){
            res.render("updateUserName", {message: "name already exists"});
            return;
        }
        let newName = req.body.username;
        //make query and update on approproate infromation
        let query = {username: uname, password: pword};
        let update = {username: newName};
        //update cheese of user that matches user
        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser) //if no user macthes session, rerender page and display error
                res.render("updateUserName", {message: "Not properly logged in"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
        internalUpdate(newName, pword, req, res); //update session to be able to display cheese on homepage
        return;    
        })
        .catch ( (error) => { //catch find and update errors to display error to user
            res.render("updateUserName", {message: "Not properly logged in"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){ //catch big try block and display error
        res.render("updateUserName", {message: "Internal server error"})
    }
};


//###############################################
// active status updaters ######################
//###############################################
const changeActive = async(active, username, password) =>{
    try{
        //get username password from call, password should be hashed variety
        let uname = username;
        let pword = password;
        //make query and update on approproate infromation
        let query = {username: uname, password: pword};
        let update = {isOnline: active};
        //update cheese of user that matches user
        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser){ //if no user macthes session, rerender page and display error
                console.log("could not find user to update active statuc")
                return;
            }
        //req.session.user = foundUser;  
        return;
        })
        .catch ( (error) => { //catch find and update errors to display error to user
            console.log("update status small catch")
            return;
        }) 
    } catch (error){ //catch big try block and display error
        console.log("update status big catch")
        return;
    }
};


//###############################################
// messaging functions ##########################
//###############################################


const createPS = async(sender, receiver) =>{
    try{
        const query = { Users: {$all: [sender, receiver]} };
        
        await PrivateSqueak.findOne(query).then( (foundPS) => {
            if (!foundPS){ //if no ps macthes session, error
                console.log("creating PS in controller");
                makePS(sender, receiver);
                return;
            }
            console.log("PS Exists do not create");
            return;
        })
    } catch (error){ //catch big try block and display error
        console.log("major error in creating PS")
        return;
    }
};

const makePS = async(sender, receiver) =>{ //sender rec are usernames
    let db_data = {Users: [sender, receiver], chatHistory:[]}; 
    await PrivateSqueak.create(db_data);
    return;
}; 

const updatePS = async (PSid, passedPS) => { //set socketid to 0 to indicate person isnt connected
    const update = {Users: passedPS.Users, chatHistory: passedPS.chatHistory};
    const query = {id: PSid};
    console.log("work");
    await PrivateSqueak.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
        if (!foundUser){ //if no user macthes session, rerender page and display error
            console.log("could PS to update");
            return;
        } 
    return;
    }
)};

async function getChatHistoryPS(sender, receiver) {
    
    const query = { Users: {$all: [sender, receiver]} };

    const PS = await PrivateSqueak.findOne(query);
   // console.log(groupChat);
    //console.log(groupChat.chatHistory);
    if(!PS){
        return [];
    }
    const chatHistory = PS.chatHistory;
    let PSHistory = [];

    for (let i = 0; i < chatHistory.length; i++){
        console.log("===========");
        console.log(chatHistory[i]);
        msg = await Message.findById(chatHistory[i]._id);
        if(!msg){
            console.log("not found");
            continue;
        }  
        sender = await UserModel.findById(msg.sender._id);
        PSHistory.push(`${sender.username}: ${msg.content}`);
    }
    console.log("----------------")
    console.log(chatHistory);
    console.log("-------------");
    console.log(PSHistory);
    return(PSHistory);
}

const updateUserSocket = async (uname, socketid) => { //set socketid to 0 to indicate person isnt connected
    const query = {username: uname};
    const update = {socketID: socketid}
    await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
        if (!foundUser){ //if no user macthes session, rerender page and display error
            console.log("could not find user to update socket")
            return;
        } 
    return;
    }
)};

const resetUserSocket = async (socketid) => { //set socketid to 0 to indicate person isnt connected
    const query = {socketID: socketid};
    const update = {socketID: "0"}
    await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
        if (!foundUser){ //if no user macthes session, rerender page and display error
            console.log("could not find user to reset socket")
            return;
        } 
    return;
    }
)};






async function getHordeHistory() {
    const horde = await Horde.findOne();
    if(horde == null) {
        return [];
    }
    const chat = horde.chatHistory;
    const messages = []
    if(chat){
        for (let i = 0; i < chat.length; i++) {
            const this_chat = await Message.findById(chat[i]._id);
            const message = {
                sender: this_chat.senderUname,
                content: this_chat.content,
            };
            messages.push(message);
        }
        return messages;
    }
    else{
        return [];
    }
}

//###############################################
// commented out functions ######################
//###############################################

// const getUser = async(req, res) => {
//     try{
//         let uname = req.body.username
//         let pword = req.body.password 

//         let query = {username: uname, password: pword};

//         await User.findOne(query).then( (foundUser) => {
//             if (!foundUser)
//                 return res.status(404).json({success: false, message: "User retrieval failed", error: "Unable to find User"});
//             res.status(201).json({success: true, foundUser});
//             //do messaging stuff here, on success case, for next sprint
//         })
//         .catch( (error) => {
//             res.status(404).json({success: false, error: error.message});
//         });
//     } catch (error) {
//         res.status(500).json({success: false, message: "Internal Server Error"});
//     }
// };


module.exports = {createUser, deleteUser, updateUserCheese, updateUserPfp, login, getAllUsers, getUserByName, logout, updateUserName, updateUserPassword, getChatHistory, createMouseHole, findUsername, updateUserSocket, resetUserSocket, createPS, findUsername, updatePS, getHordeHistory, getChatHistoryPS, getUserGroups};


const User = require('../models/model');
const bcrypt = require('bcryptjs');
//const User = require('../models/temp_model');
const userExists = async (uname) => {
    query = {username: uname};
    return await User.exists(query);
};

const createUser = async (req,res) => {
    try{
        const userData = await req.body;
        console.log(`This is the data: ${JSON.stringify(userData)}`);

        let uname = userData.username;
        let pword = userData.password;
        let cheeze = userData.cheese;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No profile picture uploaded!" });
        }
        // Set up profile picture data
        const propic = { data: req.file.buffer, contentType: req.file.mimetype };

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
        let db_data = {username: uname, password: hashed_pword, cheese: cheeze, profilepicture: propic}; //change pword to hashed_pword, returns 404 error User does not exist
        await User.create(db_data).then( (createdUser) => {
            if (!createdUser)
                return res.status(404).json({ success: false, message: "User creation failed", error: "Unable to get created User" });

            //res.status(201).json({ success: true, createdUser});
            const user = createdUser;
            res.redirect('/login');
        })

        .catch( (error) => {
            //res.status(404).json({ success: false, error: error.message});
            res.render("signup", {message: "User Does Not Exist"})
        });
    } catch (error) {
        //res.status(500).json({ success: false, message: "Internal server error"});
        res.render("signup", {message: "Internal Server Error"})
    }
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
//const session = require('express-session');
const findUser = async (uname, pword) => {
    const query = {username: uname, password: pword};
    return await User.findOne(query);
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
                req.session.user = user;
                res.redirect('/protected');
                return;
            } else{ //return invalid credentials error
                res.render('login', {message: "Invalid Credentials, Incorrect Password"});
            }
        })
        
    }
};

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

// function handles logging  out 
const logout = async (req, res) => {
    let user = req.session.user.username;
    // destroy the current user's session 
    await req.session.destroy( () => {
        console.log(`${user} logged out`);
    });
    // send user back to the homepage 
    res.redirect('/');
}

































//************LINE 300 *///////////////
//FOR USE TO FIND USERS TO MESSAGE LATER, not in use yet, just a logic outline
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





















































//************LINE 400 *///////////////

//variation of findUser that only returns username, in order to find and compare password seperately in login function

const findUsername = async (uname) => {
    const query = {username: uname};
    return await User.findOne(query);
};




























































































//************LINE 500 *///////////////

module.exports = {createUser, deleteUser, updateUserCheese, updateUserPfp, login, getAllUsers, getUserByName, logout};

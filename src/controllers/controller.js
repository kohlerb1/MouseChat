const User = require('../models/model');
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

        let db_data = {username: uname, password: pword, cheese: cheeze, profilepicture: propic};
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
        let unameCheck = req.session.user.username
        let pwordCheck = req.session.user.password
        let uname = req.body.username
        let pword = req.body.password
        let query = {username: uname, password: pword};

        await User.findOneAndDelete(query).then( (foundUser) => {
            if (!foundUser || unameCheck != uname || pword!=pwordCheck) {
                    maintainDelete(unameCheck, pwordCheck, req, res);
                    res.render("deleteUser", {message: "Invalid user credentials"});
                    return;
                }
            //res.status(201).json({ success: true, foundUser});
            //let user = req.session.user.username;
            logout(req, res);
            return;
            //res.redirect('/');
        })
        .catch( (error) => {
            maintainDelete(unameCheck, pwordCheck, req, res);
            res.render("deleteUser", {message: "Invalid user credentials"});
            return;
        });
    } catch (error) {
        maintainDelete(unameCheck, pwordCheck, req, res);
        res.render("deleteUser", {message: "Internal server error"});
        return;
    }
};
const maintainDelete = async(uname, pword, req, res) => {
    let user = await findUser(uname, pword);
    req.session.user = user;
    return;
};

const updateUserCheese = async (req, res) => {
    try{
        let uname = req.session.user.username
        let pword = req.session.user.password
        let ch = req.body.cheese
        let query = {username: uname, password: pword};
        let update = {cheese: ch};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                res.render("updateUserCheese", {message: "Not properly logged in"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
        internalUpdate(uname, pword, req, res);
        return;    
        })
        .catch ( (error) => {
            res.render("updateUserCheese", {message: "Not properly logged in"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.render("updateUserCheese", {message: "Internal server error"})
    }
};
const updateUserPfp = async (req, res) => {
    try{
        let uname = req.session.user.username
        let pword = req.session.user.password
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No profile picture uploaded!" });
        }
        const propic = { data: req.file.buffer, contentType: req.file.mimetype };
        let query = {username: uname, password: pword};
        let update = {profilepicture: propic};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                res.render("updateUserPFP", {message: "Not properly logged in"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            internalUpdate(uname, pword, req, res);
        })
        .catch ( (error) => {
            res.render("updateUserPFP", {message: "Not properly logged in"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.render("updateUserPFP", {message: "Internal Server Error"})
        //res.status(500).json({ success: false, message: "Internal server error"});
    }
};
const internalUpdate = async(uname, pword, req, res) => {
    let user = await findUser(uname, pword);
    req.session.user = user;
    res.redirect('/protected');
};







//************LINE 200 */////////////// 
//const session = require('express-session');
const findUser = async (uname, pword) => {
    const query = {username: uname, password: pword};
    return await User.findOne(query);
};

const login = async(req, res) => {
    if (!req.body.username || !req.body.password) {
        res.render('login', {message: "Please enter both your username and password"});
        return;
    }   
    
    let user = await findUser(req.body.username, req.body.password);

    console.log("<Login> Find: ", user);
    if(user === undefined || user === null) {
        res.render('login', {message: "Invalid credentials!"});
        return;
    } else {
        req.session.user = user;
        res.redirect('/protected');
        return;
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

const logout = async (req, res) => {
    let user = req.session.user.username;
    await req.session.destroy( () => {
        console.log(`${user} logged out`);
    });
    res.redirect('/');
}




























//************LINE 300 *///////////////
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

















































































//************LINE 400 *///////////////



































































































//************LINE 500 *///////////////

module.exports = {createUser, deleteUser, updateUserCheese, updateUserPfp, login, getAllUsers, getUserByName, logout};


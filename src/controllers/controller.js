//const User = require('../models/model');
const User = require('../models/temp_model');
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

        // fetch('/uploadProfilePic', {
        //     method: 'POST',
        //     body: 
        // })

        console.log("File received:", req.file); // Debugging line
        console.log("HERE");
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No profile picture uploaded!" });
        }
        console.log("############################################");
        console.log(req.file);
        console.log("############################################");
        console.log(req.buffer);
        // Set up profile picture data
        const propic = { data: req.file.buffer, contentType: req.file.mimetype };
        // console.log(typeof(propic));
        // console.log(propic);

        if (await userExists(uname)) {
            res.render("signup", {message: "User Already Exists"})
            return;
        }

        let db_data = {username: uname, password: pword, cheese: cheeze, profilepicture: propic};
        await User.create(db_data).then( (createdUser) => {
            if (!createdUser)
                return res.status(404).json({ success: false, message: "User creation failed", error: "Unable to get created User" });

            //res.status(201).json({ success: true, createdUser});
            res.redirect('/protected');
        })

        .catch( (error) => {
            //res.status(404).json({ success: false, error: error.message});
            res.render("signup", {message: "User Already Exists"})
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
        let uname = req.body.username
        let pword = req.body.password
        let query = {username: uname, password: pword};

        await User.findOneAndDelete(query).then( (foundUser) => {
            if (!foundUser) {
                res.render("deleteUser", {message: "Invalid User Credentials"})
                /*return res.status(404).json({
                    success: false,
                    message: "User deletion failed", error: "Unable to locate User" });*/
                }
            //res.status(201).json({ success: true, foundUser});
            res.redirect('/');
        })
        .catch( (error) => {
            res.render("deleteUser", {message: "Invalid User Credentials"})
            //res.status(404).json({success: false, error: error.message});
        });
    } catch (error) {
        res.render("deleteUser", {message: "Internal server error"})
        //res.status(500).json({ success: false, message: "Internal server error"});
    }
};

const updateUserCheese = async (req, res) => {
    try{
        let uname = req.body.username
        let pword = req.body.password
        let ch = req.body.cheese
        let query = {username: uname, password: pword};
        let update = {cheese: ch};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                res.render("updateUserCheese", {message: "Invalid User Credentials"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            //res.status(201).json({ success: true, foundUser});
            res.redirect('/protected');
        })
        .catch ( (error) => {
            res.render("updateUserCheese", {message: "Invalid User Credentials"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.render("updateUserCheese", {message: "Internal"})
        //res.status(500).json({ success: false, message: "Internal server error"});
    }
};
const updateUserPfp = async (req, res) => {
    try{
        let uname = req.body.username
        let pword = req.body.password
        let pfp = req.body.profilepicture
        let query = {username: uname, password: pword};
        let update = {profilepicture: pfp};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                res.render("updateUserPFP", {message: "Invalid User Credentials"})
                //return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            //res.status(201).json({ success: true, foundUser});
            res.redirect('/protected');
        })
        .catch ( (error) => {
            res.render("updateUserPFP", {message: "Invalid User Credentials"})
            //res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.render("updateUserPFP", {message: "Internal Server Error"})
        //res.status(500).json({ success: false, message: "Internal server error"});
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







//************LINE 200 *///////////////  ME
const session = require('express-session');

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
    //getUser(req, res);

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

const getUser = async(req, res) => {
    try{
        let uname = req.body.username
        let pword = req.body.password 

        let query = {username: uname, password: pword};

        await User.findOne(query).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({success: false, message: "User retrieval failed", error: "Unable to find User"});
            res.status(201).json({success: true, foundUser});
            //do messaging stuff here, on success case, for next sprint
        })
        .catch( (error) => {
            res.status(404).json({success: false, error: error.message});
        });
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
};

const showPic = async(req, res) => {
    try {
        let uname = req.params.username;
        let pword = req.params.password ;
        let query = {username: uname, password: pword};
        const user = await User.findOne(query);
        if (!user || !user.profilepicture) {
            return res.status(404).send('Profile picture not found');
        }

        res.set('Content-Type', user.profilepicture.contentType);
        res.send(user.profilepicture.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
// const uploadPic = async(req, res) => {
//     // Code from ChatGPT
//     try {
//         const user = await User.findById(req.params.userId);
    
//         user.profilepicture = {
//           data: req.file.buffer,
//           contentType: req.file.mimetype,
//         };
//         console.log("saving");
//         await user.save();
//         console.log("picture uploaded");
//         res.status(200).send('Avatar uploaded successfully!');
//       } catch (error) {
//         console.log("ERROR");
//         res.status(500).send('Error uploading avatar');
//       }
// }

const logout = async (req, res) => {
    let user = req.session.user.username;
    req.session.destroy( () => {
        console.log(`${user} logged out`);
    });
    res.redirect('/');
}











































//************LINE 300 *///////////////



































































































//************LINE 400 *///////////////



































































































//************LINE 500 *///////////////

module.exports = {createUser, deleteUser, updateUserCheese, updateUserPfp, login, getAllUsers, getUserByName, showPic, logout};


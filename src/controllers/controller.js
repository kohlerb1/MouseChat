const User = require('../models/model');

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
        let propic = userData.profilepicture

        if (await userExists(uname)) {
            res.status(400).json({success: false, message: "User already exists!"});
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
            res.status(404).json({ success: false, error: error.message});
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};




























































//************LINE 100 *///////////////
const deleteUser = async (req, res) => {
    try{
        let uname = req.params.username
        let pword = req.params.password
        let query = {username: uname, password: pword};

        await User.findOneAndDelete(query).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({
                    success: false,
                    message: "User deletion failed", error: "Unable to locate User" });
            res.status(201).json({ success: true, foundUser});
        })
        .catch( (error) => {
            res.status(404).json({success: false, error: error.message});
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};

const updateUserCheese = async (req, res) => {
    try{
        let uname = req.params.username
        let pword = req.params.password
        let ch = req.params.cheese
        let query = {username: uname, password: pword};
        let update = {cheese: ch};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            res.status(201).json({ success: true, foundUser});
        })
        .catch ( (error) => {
            res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};
const updateUserPfp = async (req, res) => {
    try{
        let uname = req.params.username
        let pword = req.params.password
        let pfp = req.params.profilepicture
        let query = {username: uname, password: pword};
        let update = {profilepicture: pfp};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            res.status(201).json({ success: true, foundUser});
        })
        .catch ( (error) => {
            res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};






































//************LINE 200 *///////////////  ME
const login = async(req, res) => {
    if (!req.body.username || !req.body.password) {
        res.render('login', {message: "Please enter both your username and password"});
        return;
    }   

    let user = User.find( (element) => {
        return element.username === req.body.username && element.password === req.body.password;
    });
    getUser(req, res);
    // let user = findUser(req.body.username, req.body.password);

    console.log("<Login> Find: ", user);
    if(user === undefined || user === null) {
        res.render('login', {message: "Invalid credentials!"});
        return;
    } else {
        req.session.user = user;
        res.redirect('/protected_page');
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
        })
        .catch( (error) => {
            res.status(404).json({success: false, error: error.message});
        });
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
};

// const findUser = async (uname, pword) => {
//     query = {username: uname, password: pword};
//     return await User.find((query));
// };




















































//************LINE 300 *///////////////



































































































//************LINE 400 *///////////////



































































































//************LINE 500 *///////////////
module.exports = {createUser};
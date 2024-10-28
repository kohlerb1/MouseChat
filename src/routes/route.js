const router = require("express").Router();
const Controller= require("../controllers/controller");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage:storage });

const session = require("express-session");

router.get('/signup', (req, res) => {
    res.render('signup');
});
//router.post call function to go to do signup

router.get('/login', (req, res) => {
    res.render('login');
});
//router.post call function to do login
router.post('/login', Controller.login);

router.post('/signup', upload.single('profilepicture'), Controller.createUser);
// router.post('/signup', upload.single('profilepicture'), Controller.createUser, (req,res) =>{  
//     console.log("<Signup> Find: ", user);
//     if (user === undefined || user === null) {
//         let newUser = {id: req.body.id, password: req.body.password};
//         Users.push(newUser);
//         req.session.user = newUser;
//         res.redirect('/protected');
//         return;
//     } else {
//     res.render('signup', { message: "User Already Exists! Login or choose another user id"});
//     return;
//     }
// });

//protected page stuff here

//check for authenticated to access protected page
const checkSignIn = (req, res, next) => { // note: does not work on redirect from inital signup, but works on login
    console.log(req.session.user);
    
    if(req.session.user){
        return next() //If session exists, proceed to page
    } else{
        const err = new Error("Not logged in!");
        err.status = 400;
        return next(err);   //Error, trying to access unauthorized page!
    }
};

// router call for proected page, calls checksign in for authication before accessing protected page
router.get('/protected', checkSignIn, (req, res) => {
    console.log(req.session.user);
    const bufferData = Buffer.from(req.session.user.profilepicture.data.data);
    const profilePic = bufferData.toString('base64');
    const contentType = req.session.user.profilepicture.contentType;
    if(!profilePic){
        console.log("pic not found");
    }
    console.log("Base64 Profile Picture:", `data:${contentType};base64,${profilePic}`);
    console.log(profilePic.data);
    console.log("Profile Picture Object:", req.session.user.profilepicture);


    // ? `data:${req.session.user.profilepicture.contentType};base64,${req.session.user.profilepicture.data.toString('base64')}`
    // : console.log("pic not found");
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
router.get('/test', (req, res) => {
    res.render('test', { user, message });
});

router.get('/logout', checkSignIn, Controller.logout);

//router.post('/uploadProfilePic', upload.single('profilepic'), Controller.uploadPic);

module.exports = router;

router.get("/updateUserCheese", checkSignIn, (req, res) => {
    res.render("updateUserCheese", {id: req.session.user.id});
})
router.post("/updateUserCheese", Controller.updateUserCheese);

router.get("/updateUserPFP", checkSignIn, (req, res) => {
    res.render("updateUserPFP", {id: req.session.user.id});
})
router.post("/updateUserPFP", Controller.updateUserPfp);

router.get("/deleteUser", checkSignIn, (req, res) => {
    res.render("deleteUser", {id: req.session.user.id});
})
router.post("/deleteUser", Controller.deleteUser);



/*
curl -X PUT http://localhost:3000/"username"/"password"/cheese -H "Content-Type: application/json" -d "{\"cheese\": \"Swiss\"}"
curl -X PUT http://localhost:3000/"username"/"password"/pfp -H "Content-Type: application/json" -d "{\"profilepicture\": 20}"

curl -X DELETE http://localhost:3000/"username"/"password"
*/

const router = require("express").Router();
const Controller= require("../controllers/controller");
const multer = require('multer');
//const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

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
    res.render('protected_page', {id: req.session.user.id});
});

router.delete("/:username/:password", Controller.deleteUser);
router.put("/:username/:password/cheese", Controller.updateUserCheese);
router.put("/:username/:password/pfp", Controller.updateUserPfp);
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

//router.post('/uploadProfilePic', upload.single('profilepic'), Controller.uploadPic);

module.exports = router;

router.get("/updateUserCheese", (req, res) => {
    res.render("updateUserCheese");
})
router.post("/updateUserCheese", Controller.updateUserCheese);

router.get("/updateUserPFP", (req, res) => {
    res.render("updateUserPFP");
})
router.post("/updateUserPFP", Controller.updateUserPfp);

router.get("/deleteUser", (req, res) => {
    res.render("deleteUser");
})
router.post("/deleteUser", Controller.deleteUser);



/*
curl -X PUT http://localhost:3000/"username"/"password"/cheese -H "Content-Type: application/json" -d "{\"cheese\": \"Swiss\"}"
curl -X PUT http://localhost:3000/"username"/"password"/pfp -H "Content-Type: application/json" -d "{\"profilepicture\": 20}"

curl -X DELETE http://localhost:3000/"username"/"password"
*/

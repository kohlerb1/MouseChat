const router = require("express").Router();
const Controller= require("../controllers/controller");
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
router.post('/signup', Controller.createUser, (req,res) =>{  
    console.log("<Signup> Find: ", user);
    if (user === undefined || user === null) {
        let newUser = {id: req.body.id, password: req.body.password};
        Users.push(newUser);
        req.session.user = newUser;
        res.redirect('/protected');
        return;
    } else {
    res.render('signup', { message: "User Already Exists! Login or choose another user id"});
    return;
    }
});

//protected page stuff here

//check for authenticated to access protected page
const checkSignIn = (req, res, next) => { // note: does not work on redirect from inital signup, but works on login
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
    res.render('protected_page', {id: req.session.user.username, cheese: req.session.user.cheese});
});

router.delete("/:username/:password", Controller.deleteUser);
router.put("/:username/:password/cheese", Controller.updateUserCheese);
router.put("/:username/:password/pfp", Controller.updateUserPfp);
//home page here
router.get('/', (req, res) => {
    res.render('homepage');
});
router.get("/all", Controller.getAllUsers);

module.exports = router;




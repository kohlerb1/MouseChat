const router = require("express").Router();
const Controller = require("../controllers/controller");



router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});
//router.post call function to go to do signup

router.get('/login', (req, res) => {
    res.render('login');
});
//router.post call function to do login


//protected page stuff here

//check for authenticated to access protected page
const checkSignIn = (req, res, next) => {
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

module.exports = router;


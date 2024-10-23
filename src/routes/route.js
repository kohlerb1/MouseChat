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


//protected page here

module.exports = router;


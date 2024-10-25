const router = require("express").Router();
const Controller= require("../controllers/controller");

router.get('/signup', (req, res) => {
    res.render('signup');
});
//router.post call function to go to do signup

router.get('/login', (req, res) => {
    res.render('login');
});
//router.post call function to do login
router.post('/login', Controller.login);
router.post('/signup', Controller.createUser);

//protected page here

router.delete("/:username/:password", Controller.deleteUser);
router.put("/:username/:password/cheese", Controller.updateUserCheese);
router.put("/:username/:password/pfp", Controller.updateUserPfp);
//home page here
router.get('/', (req, res) => {
    res.render('homepage');
});
router.get("/all", Controller.getAllUsers);

module.exports = router;




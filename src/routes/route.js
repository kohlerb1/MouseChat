const router = require("express").Router();
const Controller= require("../controllers/controller");
const multer = require('multer');
//const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });


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

//protected page here

router.delete("/:username/:password", Controller.deleteUser);
router.put("/:username/:password/cheese", Controller.updateUserCheese);
router.put("/:username/:password/pfp", Controller.updateUserPfp);
//home page here
router.get('/', (req, res) => {
    res.render('homepage');
});
router.get("/all", Controller.getAllUsers);
router.get("/get/:username/:password", Controller.showPic);
//
router.get('/test', (req, res) => {
    res.render('test', { user, message });
});

//router.post('/uploadProfilePic', upload.single('profilepic'), Controller.uploadPic);

module.exports = router;





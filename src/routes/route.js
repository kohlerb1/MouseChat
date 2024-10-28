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





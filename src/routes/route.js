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

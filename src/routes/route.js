const router = require("express").Router();
const Controller = require("../controllers/controller");



router.get('/', (req, res) => {
    res.render('homepage');
});


















router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signup', Controller.createUser);
module.exports = router;

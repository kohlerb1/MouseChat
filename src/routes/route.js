const router = require("express").Router();
const Controller = require("../controllers/controller");



router.get('/', (req, res) => {
    res.render('homepage');
});

module.exports = router;


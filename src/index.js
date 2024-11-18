const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');



const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const upload = multer({ storage:storage });
const session = require('express-session');

const server = http.createServer(app);
const io = socketIo(server);
module.exports = io;
const db = require('./config/db');


app.set('view engine', 'pug');
app.set('views','./views');

//app.use('views', express.static('views'));
app.use('/public', express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session( {secret: "Mellon"}));



//*********************************************** */

app.use(express.static('views'));

const router = require('./routes');
const { group } = require('console');
const { getChatHistory } = require('./controllers/controller');
app.use('/', router.Router);


/////////////////
const {createMouseHole} = require('./controllers/controller')
createMouseHole("TestGroup", ["LukeC", "poopoo", "JSilly"]);

////////////////

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

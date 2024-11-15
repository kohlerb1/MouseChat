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
const db = require('./config/db');


app.set('view engine', 'pug');
app.set('views','./views');

//app.use('views', express.static('views'));
app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session( {secret: "Mellon"}));


module.exports = io ;

app.use(express.static('views'));

const router = require('./routes');
app.use('/', router.Router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

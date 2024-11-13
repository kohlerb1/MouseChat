import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const upload = multer({ storage:storage });
const session = require('express-session');
const server = createServer(app);
const io = new Server(server);

const db = require('./config/db');

app.use('/static', express.static('static'));
app.use('/public', express.static('public'));

app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
//app.use(upload.array());
app.use(session( {secret: "Mellon"}));

//************************************************ */
app.get('/', (req, res) => {            
    const basename = new URL('./index.html', import.meta.url).pathname;
    const trimmedname = basename.replace('/C:', '');
    res.sendFile(trimmedname);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
//*********************************************** */


const router = require('./routes');
app.use('/', router.Router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

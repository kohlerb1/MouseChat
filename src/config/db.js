const uname = "mousechatofficial";
const pword = "p9M9f2fmKNe7Thgb";
const cluster = "messengerdb.y9swx";
const dbname = "MouseChatDB";

const bcrypt = require("bcryptjs") // adding bcrypt into the database, from sildes


const uri = `mongodb+srv://${uname}:${pword}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority&appName=MessengerDB`;

const mongoose = require('mongoose');
const mongoose_settings = {useNewUrlParser: true};

mongoose.connect(uri, mongoose_settings);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Connected successfully to MongoDB");
});

module.exports = {db};
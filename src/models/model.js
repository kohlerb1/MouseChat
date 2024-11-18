const mongoose = require('mongoose');
const privateSqueek = require('./privateSqueakModel.js');
const mouseHole = require('./mouseHole.js');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLenngth: 25
    },
    password: {
        type: String,
        required: true,
        maxLength: 60 //changed to account for bcrypt hash, so user is entered into database 
    },
    cheese: {
        type: String,
        required: true,
        maxLength: 50
    },
    profilepicture: {
        data: Buffer,
        contentType: String,

    },
    contacts:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'privateSqueak' }],
        required:true
    },
    groups:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'mouseHole' }],
        required:true
    },
    isOnline:{
        type:Boolean,
        required:true
    },
    socketID:{
        type: String,
        required:true
    }
});

UserSchema.statics.findByName = async function(query){
    return await this.findOne({username: query,});

};

UserSchema.statics.getAll = async function(){
    return await this.find({});

};


const UserModel = mongoose.model('User', UserSchema);


module.exports = UserModel;




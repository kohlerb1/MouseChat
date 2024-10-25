const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLenngth: 25
    },
    password: {
        type: String,
        required: true,
        maxLength: 25
    },
    cheese: {
        type: String,
        required: true,
        maxLength: 50
    },
    profilepicture: {
        type: Number,
        required: true,
    },
});

UserSchema.statics.findByName = async function(query){
    return await this.findOne({username: query,});
};

UserSchema.statics.getAll = async function(){
    return await this.find({});
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel




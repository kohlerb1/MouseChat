const mongoose = require('mongoose');
const User = require('./model.js');
const message = require('./messageModels.js')


const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "message"}],
})

groupChatSchema.statics.findByName = async function(query){
    return await this.findOne({username: query,});

};

groupChatSchema.statics.getAll = async function(){
    return await this.find({});

};

const groupChatModel = mongoose.model('groupChat', groupChatSchema);


module.exports = {groupChatModel};
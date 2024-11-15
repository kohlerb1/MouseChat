const mongoose = require('mongoose');
const User = require('./model.js');
const message = require('./messageModel.js')


const mouseHoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required:true}],
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "message", required:true}],
})

mouseHoleSchema.statics.findByName = async function(query){
    return await this.findOne({username: query,});

};

mouseHoleSchema.statics.getAll = async function(){
    return await this.find({});

};

const mouseHoleModel = mongoose.model('mouseHole', mouseHoleSchema);


module.exports = mouseHoleModel;
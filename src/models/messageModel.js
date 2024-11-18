const mongoose = require('mongoose');
const User = require('./model.js');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        //***************CHANGE THIS LATER*************** */
        required: true
    },
    senderUname: {
        type: String,
        required: false
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
         //***************CHANGE THIS LATER*************** */
        required: false
    },
    content: {
        type: String,
        required: true
    }, 
    attachment: {
        data: Buffer,
        contentType: String,
    }
})

messageSchema.statics.findByName = async function(query){
    return await this.findOne({sender: query,});

};

messageSchema.statics.getAll = async function(){
    return await this.find({});

};

const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel;
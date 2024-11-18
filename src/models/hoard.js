const mongoose = require('mongoose');
const message = require('./messageModel.js')


const hoardSchema = new mongoose.Schema({
    chatHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'message',
    },
});


const hoardModel = mongoose.model('hoard', hoardSchema);


module.exports = hoardModel;
const mongoose = require('mongoose');
const User = require('./model.js');
const message = require('./messageModel.js')


const psSchema = new mongoose.Schema({
    Users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "message"}],
})

psSchema.statics.findByUser = async function(query){
    return await this.find({Users: query});

};

psSchema.statics.getAll = async function(){
    return await this.find({});

};

const psModel = mongoose.model('privateSqueek', psSchema);


module.exports = psModel;
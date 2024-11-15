const mongoose = require('mongoose');
const message = require('./messageModels.js')


const hoardSchema = new mongoose.Schema({
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "message"}],
})


const psModel = mongoose.model('hoard', hoardSchema);


module.exports = hoardSchema;
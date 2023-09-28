const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    handle:Number,
})

const Mentor = mongoose.model('handleData',userSchema);

module.exports = Mentor;
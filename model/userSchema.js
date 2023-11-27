const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    date:String,
    class:String,
    sub:String,
    mentor:String,
})

const User = mongoose.model('studentdatas',userSchema);

module.exports = User;
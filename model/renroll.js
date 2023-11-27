const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    date:String,
    class:String,
    sub:String,
    mentor:String,
    renrollment:Number,
})

const Reuser = mongoose.model('renrolldatas',userSchema);

module.exports = Reuser;
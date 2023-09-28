const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    number:Number,
    college:String,
    date:String,
    handle:Number,
    on:Number,
    total:Number,
})

const Mentor = mongoose.model('mentordatas',userSchema);

module.exports = Mentor;
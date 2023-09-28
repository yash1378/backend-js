const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    guided:Number,
    reenrol:Number,
    review:String,
    on:Number,
    avail:Number,
})

const Mentor = mongoose.model('mentorDatadashboard',userSchema);

module.exports = Mentor;
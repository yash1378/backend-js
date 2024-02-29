const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
    name: String,
    college: String,
    enrollments: String,
    rating: String,
    averageTime: String,
    experience:String,
    no_of_reviews:{ type: Number, default: 1 },
    image: String,
})

const Mentor = mongoose.model('feedback',feedBackSchema);

module.exports = Mentor;
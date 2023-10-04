const mongoose= require("mongoose");

// defining the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // specifies that the field is required
    required: true,
    // specifies that the field is unique
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mentorname: {
    type: String,
    required:true,
  },
});

const Creds = mongoose.model("Creds", userSchema)
// exporting the user model
module.exports = Creds;

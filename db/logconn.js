const mongoose = require("mongoose");

const mongoURI = `mongodb+srv://${process.env.Database_Username}:${process.env.Database_Password}@nodeexpressproject.qp0arwg.mongodb.net/${process.env.Database_Name}?retryWrites=true&w=majority`; // Replace with your MongoDB URI
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(mongoURI, mongooseOptions, (err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
  } else {
    console.log("Connected to MongoDB");
  }
});

module.exports = mongoose;

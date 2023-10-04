const mongoose = require('mongoose');
require('dotenv').config()
const DB = `mongodb+srv://${process.env.Database_Username}:${process.env.Database_Password}@nodeexpressproject.qp0arwg.mongodb.net/${process.env.Database_Name}?retryWrites=true&w=majority`;

mongoose.connect(DB).then(() => {
  console.log("Connection successful...");
}).catch((err) => {
  console.log(err);
});

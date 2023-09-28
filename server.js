const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
require('dotenv').config()


require('./db/conn');
const User = require('./model/userSchema');
const Mentor = require('./model/mentorschema');


// Use the cors middleware
app.use(cors());
// app.use(express.urlencoded(extended:true))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Define a route for the root URL
app.get('/api/data', async (req, res) => {
  try {
    const conditions = req.query; // Query parameters for conditions
    // console.log(req.query);
    
    // Find data in the User model based on query parameters
    const data = await User.find(conditions);

    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});


app.post('/', async (req, res) => {
  // console.log(req.body);
  if (!req.body.name || !req.body.phone) {
      return res.status(422).json({ error: "Please fill the fields properly" });
  }

  const userExist = await User.findOne({ name: req.body.name });
  if (userExist) {
      return res.status(422).json({ error: "Name already exists" });
  }

  const userData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, // Add the email field if it's available in the request
      date: req.body.date,
      class: req.body.class, // Add the class field if it's available in the request
      sub: req.body.sub, // Add the sub field if it's available in the request
      mentor:"",
  };

  const user = new User(userData);

  try {
      const savedUser = await user.save();
      res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Failed to save user data' });
  }
});



app.get('/api/mentorData', async (req, res) => {
  try {
    const conditions = req.query; // Query parameters for conditions
    // console.log(req.query);
    
    // Find data in the User model based on query parameters
    const data = await Mentor.find(conditions);

    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.post('/mentorData', async (req, res) => {
  // console.log(req.body);
  if (!req.body.name || !req.body.phone) {
      return res.status(422).json({ error: "Please fill the fields properly" });
  }

  const userExist = await Mentor.findOne({ name: req.body.name });
  if (userExist) {
      return res.status(422).json({ error: "Name already exists" });
  }

  const userData = {
      name: req.body.name,
      number: req.body.phone,
      college: req.body.college, // Add the email field if it's available in the request
      date: req.body.date,
      handle:0,
      on:0,
      total:0,
      // Add the sub field if it's available in the request
  };

  const user = new Mentor(userData);

  try {
      const savedUser = await user.save();
      res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Failed to save user data' });
  }
});


// const Mentor = require('./models/mentor'); // Import your Mentor model

app.post('/api/update', async (req, res) => {
  const { mentorName, studentCount } = req.body;
  // console.log(req.body);

  try {
    // Find the mentor by name in your data (replace this with your database query)
    const mentorToUpdate = await Mentor.findOne({ name: mentorName });

    if (!mentorToUpdate) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Update the studentsHandled field for the mentor
    mentorToUpdate.handle = studentCount; // Corrected from "mentorToUpdate.handle"

    // Save the updated mentor to the database
    await mentorToUpdate.save();

    // Respond with a success message
    res.json({ message: 'Mentor studentsHandled updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/finalMentor', async (req, res) => {
  try {
    const { mentorName, studentIds } = req.body;
    console.log(req.body);
    console.log(mentorName);
    console.log(studentIds);

    // Update students in the user table
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $set: { mentor: mentorName } }
    );

    // Get the count of selected students
    const selectedStudentCount = studentIds.length;

    // Update the 'on' field for the mentor in the mentor table
    const mentorToUpdate = await Mentor.findOne({ name: mentorName });
    if (!mentorToUpdate) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    mentorToUpdate.on += selectedStudentCount;
    mentorToUpdate.total+=selectedStudentCount;
    await mentorToUpdate.save();

    res.json({ message: 'Mentor and students updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
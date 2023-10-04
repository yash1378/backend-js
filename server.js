const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
require('dotenv').config()

require('./db/conn');
const User = require('./model/userSchema');
const Own = require('./model/ownschema');
const Mentor = require('./model/mentorschema');
const credModel = require('./model/mlogin')
const cookieParser = require("cookie-parser");
const { hash, compare } = require("bcryptjs");
const nodemailer = require("nodemailer");


// Use the cors middleware
app.use(cors());
// app.use(express.urlencoded(extended:true))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cookieParser());


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

app.get('/api/ownerData', async (req, res) => {
  try {
    const conditions = req.query; // Query parameters for conditions
    // console.log(req.query);
    
    // Find data in the User model based on query parameters
    const data = await Own.find(conditions);

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






app.post('/login',async (req,res)=>{
  try {
      const { email, password } = req.body;
  
      // 1. check if CredModel exists
      const CredModel = await credModel.findOne({ email });
      const OwnModel = await Own.findOne({ email });
      if(CredModel){
        console.log(CredModel)
        console.log(CredModel.mentorname)
      }

  
      // if CredModel doesn't exist, return error
      if (!CredModel && !OwnModel){
          console.log('CredModel does not exist')
          return
      }
      else if(!OwnModel){

      // 2. if CredModel exists, check if password is correct
      const isMatch = await compare(password, CredModel.password);
  
      // if password is incorrect, return error
      if (!isMatch){
          console.log('password is incorrect...')
      }
      await CredModel.save();
    
      // res.cookie('username', CredModel.mentorname, { maxAge: 3600000,path:'/' }); // 'username' cookie with a 1-hour (3600000 ms) expiration

      res.status(200).json({
        message: "Logged in successfully! 🥳",
        name:CredModel.mentorname,
        type: "mentor",

      });   
      }
      else{

      // 2. if CredModel exists, check if password is correct
      const isMatch = await compare(password, OwnModel.password);
  
      // if password is incorrect, return error
      if (!isMatch){
          console.log('password is incorrect...')
      }
      await OwnModel.save();
    
      // res.cookie('username', CredModel.mentorname, { maxAge: 3600000,path:'/' }); // 'username' cookie with a 1-hour (3600000 ms) expiration

      res.status(200).json({
        message: "Logged in successfully! 🥳",
        name:OwnModel.ownername,
        type: "owner",
      });   
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({
        type: "error",
        message: "Error signing in!",
        error,
      });
    }
  });

  app.get('/set-cookies', (req, res) => {
    res.cookie('username', 'john_doe', { maxAge: 3600000 }); // 'username' cookie with a 1-hour (3600000 ms) expiration
    res.cookie('token', 'abcdef123456', { httpOnly: true }); // 'token' cookie with httpOnly flag (accessible only via HTTP)
    res.send('Cookies set successfully');
  });



app.post("/signup", async (req, res) => {
    try {
      const { email, password ,name} = req.body;
  
      // 1. check if CredModel already exists
      const CredModel = await credModel.findOne({ email });
  
      // if CredModel exists already, return error
      if (CredModel)
        return res.status(500).json({
          message: "CredModel already exists! Try logging in. 😄",
          type: "warning",
        });
  
      // 2. if CredModel doesn't exist, create a new CredModel
      // hashing the password
      const passwordHash = await hash(password, 10);
      const newCredModel = new credModel({
        email,
        password: passwordHash,
        mentorname:name,
      });
  
      // 3. save the CredModel to the database
      await newCredModel.save();
  
      // 4. send the response
      res.status(200).json({
        message: "CredModel created successfully! 🥳",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        type: "error",
        message: "Error creating CredModel!",
        error,
      });
    }
  });
  



  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `CredModel` and `pass` values from <https://forwardemail.net>
      user: process.env.sender,
      pass: process.env.smtp_password
    }
  });

  
  // send password reset email
  app.post("/send-password-reset-email", async (req, res) => {
    // try {
      // get the CredModel from the request body
  
  
    try {
  
      const { email } = req.body;
      console.log(email);
      // find the CredModel by email
      const CredModel = await credModel.findOne({ email });
      // if the CredModel doesn't exist, return error
      if (!CredModel){
        res.redirect('/send-password-reset-email')
      }
      // send mail with defined transport object
  
      const info = await transporter.sendMail({
        from: process.env.sender, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Add your custom CSS styles here */
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                @media (max-width: 600px) {
                    .container {
                        max-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome Back!</h1>
                <p>Your password has been successfully changed to <strong>abc@123</strong>.</p>
                <p>You can now log in using your new password.</p>
                <p>If you did not make this change, please <a href="#">contact us</a> immediately.</p>
                <p>Thank you!</p>
                <a class="button" href="#">Log In</a>
            </div>
        </body>
        </html>
        
        
        `, // html body
      });

      try {
        const CredModel = await credModel.findOne({ email });

        if (!CredModel) {
            return res.status(404).json({ message: 'CredModel not found' });
        }
        const passwordHash = await hash("abc@123", 10);

        CredModel.password = passwordHash;
        await CredModel.save();

        res.status(200).json({ message: 'Email Sent Successfully and Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //   res.send("Email sent successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending email.");
    }
  });









// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
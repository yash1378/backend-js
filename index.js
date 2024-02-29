const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
require("dotenv").config();
const multer = require('multer');
require("./db/conn");
const app = express();
const PORT = 4000;
const Feed = require("./model/feedback");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Enable CORS for all routes
app.use(cors());

// RabbitMQ connection
const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672/';
let channel;

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    const queue = 'mentor_queue';
    channel.assertQueue(queue, { durable: false });
    console.log('Connected to RabbitMQ');

    // Call consumeMessages once the RabbitMQ connection is established
    consumeMessages();
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

// Function to save mentor data to MongoDB
const saveMentorData = async (mentorData) => {
  try {
    const mentor = new Feed(mentorData);
    await mentor.save();
    console.log('Mentor data saved to MongoDB:');
  } catch (error) {
    console.error('Error saving mentor data to MongoDB:', error);
  }
};


// When a message is received on the queue, the consumeMessages function parses the message 
// (assuming it's in JSON format) and calls saveMentorData to save the mentor data to MongoDB.
// Consume messages from RabbitMQ and save mentor data to MongoDB
const consumeMessages = () => {
  channel.consume('mentor_queue', (msg) => {
    const mentorData = JSON.parse(msg.content.toString());
    saveMentorData(mentorData);
  }, { noAck: true });
//   noAck: true means that RabbitMQ will remove the message from the queue once it has been successfully received, ensuring that the message is processed only once.
};

// Middleware
app.use(bodyParser.json());

// API endpoint to send mentor data to RabbitMQ
app.post('/api/save-mentor',upload.single('image'), (req, res) => {
  try {
    const { name, college, enrollments, rating, averageTime } = req.body;
    const imageData = req.file;

    // Log or debug the imageData to check if it's correctly received
    // console.log('ImageData:', imageData.mimetype);

    // Send mentor data to RabbitMQ for asynchronous processing
    const mentorData = {
      name,
      college,
      enrollments,
      rating,
      averageTime,
      image: imageData ? `data:${imageData.mimetype};base64,${imageData.buffer.toString('base64')}` : null,
    };

    channel.sendToQueue('mentor_queue', Buffer.from(JSON.stringify(mentorData)));

    res.status(201).json({ message: 'Mentor data sent to RabbitMQ for processing.' });
  } catch (error) {
    console.error('Error sending mentor data to RabbitMQ:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

connectToRabbitMQ();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

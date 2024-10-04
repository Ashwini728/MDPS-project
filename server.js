// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Import User model
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import Generative AI
const path = require('path'); // Import path module
require('dotenv').config(); // This will load environment variables from the .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4002; // Set the port

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// MongoDB Connection URI
const dbURI = 'mongodb+srv://ashwinianil2003:mEWK4cdOMJTP8cB8@cluster0.eakhb.mongodb.net/disease-prediction?retryWrites=true&w=majority';



// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Database connection error: ', err));

// Initialize Generative AI instance
const apiKey = process.env.GEMINI_API_KEY; // Access the API key securely from .env
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Route for root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Multiple Disease Prediction System!');
});

// Route for predicting diseases using Gemini AI
// Route for predicting diseases using Gemini AI
// Route for predicting diseases using Gemini AI
app.post('/predict', async (req, res) => {
  const { symptoms } = req.body; // Get the symptoms from the request body

  try {
    // Start a new chat session with the AI model
    const chatSession = model.startChat({
      generationConfig,
      history: symptoms.map(symptom => ({
        role: "user",
        parts: [{ text: `Predict the disease, stage, and suggest basic medicines based on the following symptom: ${symptom}. Response in JSON.` }],
      })),
    });

    // Send the message and await the response
    const result = await chatSession.sendMessage("Please provide the diseases, stages, and suggested medications based on the symptoms.");

    // Parse the AI response
    const predictionData = parsePredictionResponse(result.response.text()); // Implement this function to format your AI response

    res.status(200).json(predictionData); // Respond with the prediction data
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ error: 'Internal server error while processing prediction' });
  }
});



// Helper function to parse the AI response
// Helper function to parse the AI response
// Helper function to parse the AI response
// Helper function to parse the AI response
function parsePredictionResponse(aiResponse) {
  try {
      const data = JSON.parse(aiResponse);

      return {
          possible_causes: data.diseases || ['N/A'], // Extract diseases
          medications: data.medications || ['Consult a doctor for accurate diagnosis.'], // Extract medications
          stage: data.stage || 'Unknown', // Extract stage
          basic_medicines: data.basic_medicines || ['Rest, fluids, and over-the-counter pain relievers'], // Extract basic medicines
          disclaimer: 'Consult a doctor for accurate diagnosis and appropriate treatment.', // Add a disclaimer
      };
  } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
          possible_causes: ['N/A'],
          medications: ['N/A'],
          stage: 'Unknown', // Default to 'Unknown' in case of errors
          basic_medicines: ['Rest, fluids, and over-the-counter pain relievers'],
          disclaimer: 'Consult a doctor for accurate diagnosis and appropriate treatment.',
      };
  }
}


// Route for fetching all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the User model
    res.status(200).json(users); // Respond with users data
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for registering a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for logging in an existing user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for fetching diet chart
app.get('/diet', (req, res) => {
  const dietChart = [
    { time: 'Morning', items: ['Idli', 'Sambar'], nutrients: ['Carbohydrates', 'Protein'] },
    { time: 'Lunch', items: ['Chapati', 'Vegetable Curry'], nutrients: ['Fiber', 'Vitamins'] },
  ];
  res.json(dietChart);
});

// Route for fetching medical centers
app.get('/medical-centers', (req, res) => {
  res.json({ message: 'Medical centers will be displayed here' });
});

// Route for fetching helpline numbers
app.get('/helpline', (req, res) => {
  const helplines = [
    { name: 'National Health Helpline', number: '1800-11-1234' },
    { name: 'COVID-19 Helpline', number: '1075' },
  ];
  res.json(helplines);
});

// Route for fetching consultation doctors
app.get('/consultation', (req, res) => {
  const doctors = [
    { name: 'Dr. A. Sharma', specialization: 'Cardiologist', contact: '555-1234' },
    { name: 'Dr. B. Verma', specialization: 'Dermatologist', contact: '555-5678' },
  ];
  res.json(doctors);
});

// Handle any unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

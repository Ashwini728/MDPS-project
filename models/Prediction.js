const mongoose = require('mongoose');

// Define the schema for disease prediction
const predictionSchema = new mongoose.Schema({
    symptoms: {
        type: [String], // An array of symptom strings
        required: true
    },
    predictedDisease: {
        type: String,
        required: true
    },
    severity: {
        type: String, // mild, moderate, severe
        required: true
    },
    basicMedicines: {
        type: [String], // Array of medicine names
        required: true
    },
    requiresPrescription: {
        type: Boolean, // Whether the medicines require a doctor's prescription
        default: false
    }
});

// Create the model from the schema
const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;

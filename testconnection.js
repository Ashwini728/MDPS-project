const mongoose = require('mongoose');

const uri = 'mongodb+srv://ashwinianil2003:mEWK4cdOMJTP8cB8@cluster0.eakhb.mongodb.net/disease-prediction?retryWrites=true&w=majority';  // Your MongoDB URI

mongoose.connect(uri)
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Connection error:', err));

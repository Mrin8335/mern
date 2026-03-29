const cors = require('cors');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors(
    {
        origin: 'https://stalwart-selkie-f536e0.netlify.app',
    }
));
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/passes', require('./routes/passes'));
app.use('/api/checklogs', require('./routes/checklogs'));
app.use('/api/dashboard', require('./routes/dashboard'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('<h1>Visitor Pass Management System</h1>');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

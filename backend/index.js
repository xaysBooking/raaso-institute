const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authController = require('./controllers/authController');
const studentRoutes = require('./routes/studentRoutes');
const resultRoutes = require('./routes/resultRoutes');
const publicRoutes = require('./routes/publicRoutes');
const bulkRoutes = require('./routes/bulkRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Exam Result System API is running...');
});

app.post('/api/auth/login', authController.login);
app.use('/api/students', studentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/bulk', bulkRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('Database connection error:', err);
});

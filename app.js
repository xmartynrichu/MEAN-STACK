// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB =require('./DB/dbconnection');
const dotenv = require('dotenv');
const user = require('./model/user');
const PORT = process.env.PORT || 3000;


connectDB();


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Health check
app.get('/api/newuser', async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

module.exports = app;

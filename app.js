const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./DB/dbconnection');
const dotenv = require('dotenv');
const user = require('./model/user');
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/api/newuser', async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

app.post('/api/savenewuser', async (req, res) => {
  try {
    const users = await user.insertOne(req.body);
    res.json(users);
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Server error while saving user' });
  }
});

app.listen(3000, () => console.log('Server running'));
module.exports = app;

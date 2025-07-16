const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  date: {
    type: Date,
    default: Date.now
  }
 
}, { collection: 'newuser' });

const user = mongoose.model('user', userschema);
module.exports = user;
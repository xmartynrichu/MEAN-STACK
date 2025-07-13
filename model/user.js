const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
  name: String,
  email: String,
  mobile:String
}, { collection: 'newuser' });

const user = mongoose.model('user', userschema);
module.exports = user;
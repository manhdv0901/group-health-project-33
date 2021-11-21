const mongoose = require('mongoose')

var USERSchema = new mongoose.Schema({
    username : String,
    password: String,
})
var USER = mongoose.model('data-logins', USERSchema);
module.exports = USERSchema
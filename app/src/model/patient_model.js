const mongoose = require('mongoose')

var PATIENTSchema = new mongoose.Schema({
    id:Number,
    name: String,
    username:String,
    password: String,
    age:Number,
    birth_day:String,
    phone:Number,
    number_room:Number,
    key_device:String,
    done:String,
    state:Number
})
var PATIENT = mongoose.model('data-patients', PATIENTSchema);
module.exports = PATIENT

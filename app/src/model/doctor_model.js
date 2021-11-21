const mongoose = require('mongoose')

var DOCTORSchema = new mongoose.Schema({
    id:Number,
    name:String,
    gender:String,
    username:String,
    password:String,
    state:Boolean,
    tokenn:String
});
var DOCTORS = mongoose.model('data-doctors', DOCTORSchema);
module.exports = DOCTORS

const mongoose = require("mongoose");


const DEVICE = require("../model/device_model");
const moment = require("moment/moment");


const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.dashboard = (req,res)=>{
    res.render('dashboard_device')
}
module.exports.adddevices = (req,res)=>{
    res.render('add_devices')
}
module.exports.postadddevices = (req,res)=>{
    console.log(req.body.namedevice)
    console.log(req.body.keydevice)
}
module.exports.listdevices = (req,res)=>{
    res.render('table_device');
}

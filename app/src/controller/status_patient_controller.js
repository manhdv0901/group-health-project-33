
const mongoose = require("mongoose");


const PATIENT = require("../model/patient_model");
const DEVICE = require("../model/device_model");

const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.status1 = (req,res)=>{
    console.log(req.params.key)
    console.log(req.params.key1)
    var newvalues = { $set: {done: "1" } };
    DEVICE.updateOne({key_device:req.params.key1},{ $set: { state:false, heart: {},spO2:{},temp:{},track_history:{},treatment_course:{} },}).exec((err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Thành công')
        }
    })
    PATIENT.updateOne({_id:req.params.key},{ $set: {key_device:''},}).exec((err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Thành công')
        }
    })
    PATIENT.findByIdAndUpdate(req.params.key , newvalues, {
            new: true
        },
        function(err, model) {
            if (!err) {
                res.redirect('/dashboard')
                console.log('Complete')
            } else {
                res.redirect('/dashboard')
                console.log('update status doctor fail')
            }
        });

}

module.exports.status2 = (req,res)=>{
    console.log(req.params.key)
    console.log(req.params.key1)
    var newvalues = { $set: {done: "2" } };
    DEVICE.updateOne({key_device:req.params.key1},{ $set: { state:false, heart: {},spO2:{},temp:{},track_history:{},treatment_course:{} },}).exec((err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Thành công')
        }
    })
    PATIENT.updateOne({_id:req.params.key},{ $set: {key_device:''},}).exec((err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Thành công')
        }
    })
    PATIENT.findByIdAndUpdate(req.params.key , newvalues, {
            new: true
        },
        function(err, model) {
            if (!err) {
                res.redirect('/dashboard')
                console.log('Complete')
            } else {
                res.redirect('/dashboard')
                console.log('update status doctor fail')
            }
        });

}
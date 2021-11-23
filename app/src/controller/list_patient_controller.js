const {body, validationResult} = require("express-validator");
var PATIENT = require('../model/patient_model');


const mongoose = require("mongoose");
const DEVICE = require("../model/device_model");
const DOCTORS = require("../model/doctor_model");


const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.listpatient =  (req, res) => {
    var model = db.model('data-patients', PATIENT.schema);
    var methodFind = model.find({});
    methodFind.exec((err,data) => {
        if (err) {throw err;
        }else{
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))
            res.render('listPatients', {
                docs: data
            })
        }
    })

}
module.exports.listpatientone= (req, res)=>{
    PATIENT.findById(req.params.na,(err, data)=>{
        if(err){
            console.log('err get data one item patient');
            res.render('listPatient');
        }else {
            var myDevice = data.key_device;
            console.log('key device', data.key_device);
            DEVICE.find({key_device: myDevice})
                .exec((er, data2) => {
                    if (er) throw er;
                    else {
                        DOCTORS.find({state: true})
                            .exec((er3,  data3) => {
                                if (er3) throw er3;
                                else{
                                    console.log(`devices:`, data2)
                                    res.render('profile', {
                                        patient: data, device:data2, doctors: data3,
                                    })
                                }
                            })
                    }
                })
        }

    })
}
module.exports.updatepatient=(req,res)=>{
    PATIENT.findById(req.params.key,(err, data)=>{
        if(!err){
            res.render('infoPatient',{
                // patient:data.toJSON(),
                patient:data
            })
        }
    })
}
module.exports.updatepatientpost=(req,res)=>{
    PATIENT.findOneAndUpdate({_id:req.body.key}, {$set:{
            "name":req.body.name,
            "age":req.body.age,
            "birth_day":req.body.birth_day,
            "phone":req.body.phone,
            "number_room":req.body.number_room,
        }},{new : true},( err, doc)=>{
        if(!err){
            res.redirect('/list-patients');
            console.log("update success");
        }else {
            // res.redirect('infoPatient');
            console.log(err);
        }
    })
}
module.exports.deletepatient= (req, res) =>{
    try{
        const patient =  PATIENT.findByIdAndDelete(req.params.key, req.body);
        if (!patient){
            // res.status(400).send('Không tìm thấy bệnh nhân');
            console.log('delete patient fail');
        }else {
            // res.status(200).send();
            console.log('delete patient success');
            res.redirect('/list-patients');
            // res.render('listPatients');
        }
    }catch (e){
        res.status(500).send(e);
    }
}
module.exports.test=(req,res)=>{
    DEVICE.find({key_device: 'device09'})
        .exec((er, data) => {
            if (er) throw er;
            else {
                res.send(data)
            }
        })
}



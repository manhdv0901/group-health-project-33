const {body, validationResult} = require("express-validator");
var PATIENT = require('../model/patient_model');


const mongoose = require("mongoose");
const DEVICE = require("../model/patient_model");
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
    var model = db.model('data-patients', DEVICE.schema);
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
                                    console.log(`doctors:`, data3)
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



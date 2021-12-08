const {body, validationResult} = require("express-validator");
var PATIENT = require('../model/patient_model');


const mongoose = require("mongoose");



const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.listpatientdone =  (req, res) => {
    var model = db.model('data-patients', PATIENT.schema);
    var methodFind = model.find({done:"1"}).sort({ state: -1});
    methodFind.exec((err,data) => {
        if (err) {throw err;
        }else{
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))
            res.render('listPatients', {
                docs: data,
            })
        }
    })
}

module.exports.listpatientdie =  (req, res) => {
    var model = db.model('data-patients', PATIENT.schema);
    var methodFind = model.find({done:"2"}).sort({ state: -1});
    methodFind.exec((err,data) => {
        if (err) {throw err;
        }else{
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))
            res.render('listPatients', {
                docs: data,
            })
        }
    })
}
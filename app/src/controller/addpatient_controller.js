const mongoose = require("mongoose");

const PATIENT = require("../model/patient_model");
const DEVICE = require("../model/device_model");
const { body, validationResult } = require("express-validator");
const USER = require("../model/user_model");

const DATABASE_URL =
  "mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db = mongoose.connection;

module.exports.getaddpatient = (req, res) => {
  var model = db.model('data-devices', DEVICE.schema);
  model.find({state:false}, (err, devices) =>{
    console.log(devices)
    res.render("addPatient", {
      success: req.session.success,
      errors: req.session.errors,
      data:devices
    });
    req.session.errors = null;
  });

};

module.exports.postaddpatient = (req, res) => {
  var errors = validationResult(req).array();
  if (errors.length > 0) {
    console.log(errors);
    req.session.errors = errors;
    req.session.success = false;
    res.redirect("/add-patient");
  } else {
    req.session.success = true;
    PATIENT.findOne({ id: req.body.id }, (err, data1) => {
      if (data1) {
        errors.push({
          value: "",
          msg: "Đã có id này",
          param: "id",
          location: "body",
        });
        console.log(errors);
        req.session.errors = errors;
        req.session.success = false;
        res.redirect("/add-patient");
      } else {
        PATIENT.findOne({ key_device: req.body.key_device }, (err, data) => {
          if (data) {
            errors.push({
              value: "",
              msg: "Đã có key device này",
              param: "key_device",
              location: "body",
            });
            console.log(errors);
            req.session.errors = errors;
            req.session.success = false;
            res.redirect("/add-patient");
          } else {
            PATIENT.findOne({username:req.body.username},(err,data)=>{
              if(data){
                errors.push({
                  value: "",
                  msg: "Đã có key username này",
                  param: "username",
                  location: "body",
                });
                console.log(errors);
                req.session.errors = errors;
                req.session.success = false;
                res.redirect("/add-patient");
              }
              else{
                DEVICE.updateOne({key_device:req.body.key_device},{$set:{state:true}}).exec((err,data)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    console.log('thành công')
                  }
                })
                DEVICE.updateOne({key_device:req.body.key_device},{$push:{historical:{id_patient:req.body.id}}}).exec((err,data)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    console.log('thành công')
                  }
                })
                PATIENT({
                  id: req.body.id,
                  name: req.body.name,
                  homie_patient: req.body.homie_patient,
                  username: req.body.username,
                  password: req.body.password,
                  age: req.body.age,
                  birth_day: req.body.birth_day,
                  date_added: req.body.date_added,
                  phone: req.body.phone,
                  homie_phone: req.body.homie_phone,
                  number_room: req.body.number_room,
                  key_device: req.body.key_device,
                  state: 0,
                  done:"0"
                }).save((err) => {
                  if (err) {
                    console.log("Thêm bệnh nhân thất bại:", err);
                  } else {
                    res.redirect("/list-patients");
                    console.log("Thành công, user: ", req.body);
                  }
                });
              }
            })

          }
        });
      }
    });
  }
};

const mongoose = require("mongoose");

const PATIENT = require("../model/patient_model");
const { body, validationResult } = require("express-validator");

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
  res.render("addPatient", {
    success: req.session.success,
    errors: req.session.errors,
  });
  req.session.errors = null;
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
            PATIENT.findOne({},(err,data)=>{
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

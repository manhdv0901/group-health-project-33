const express = require("express");
const { body, validationResult } = require("express-validator");
var expressSession = require("express-session");
const exhbs = require("express-handlebars");
const PORT = process.env.PORT || 3000;
const app = express();
var helpers = require("handlebars-helpers")();
//connect mongoose
const mongoose = require("mongoose");
const path = require("path");
const fetch = require("node-fetch");

// import device from './app/src/model/device_model';
const device = require("./app/src/model/device_model");
app.use(
  expressSession({ secret: "max", saveUninitialized: false, resave: false })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.engine(
  "hbs",
  exhbs({
    defaultLayout: "main",
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

//mang nhan data tu thiet bi
var myDataTem = [];
var myDataHea = [];
var myDataSpO2 = [];
var myDataState = [];
var myDataKey = [];

//config mongodb
const DATABASE_URL =
  "mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);

//check connect mongoose
mongoose.connection.on("connected", function () {
  console.log("connect successful");
});
mongoose.connection.on("disconnected", function () {
  console.log("connect fail");
});
//connect mongoose
var db = mongoose.connection;

const KEY_DEVICE = "device05";

//model
var DEVICE = require("./app/src/model/device_model");
var DOCTORS = require("./app/src/model/doctor_model");
var PATIENT = require("./app/src/model/patient_model");
var USER = require("./app/src/model/user_model");

const deviceRoute = require("./app/src/router/login_router");
const listPatientRouter = require("./app/src/router/list_patient_router");
const listDoctorRouter = require("./app/src/router/list_doctor_router");
const addPatientRouter = require("./app/src/router/addpatient_router");
const addDoctor = require("./app/src/router/add_doctor_router");
const statuspatient = require("./app/src/router/status_patient_router");
const page = require("./app/src/router/404_router");
const updatetoken = require("./app/src/router/update_token_doctor_router");
const device1 = require("./app/src/router/device_router");
const sendnotification = require("./app/src/router/sennotication_router");

app.use("/", deviceRoute);
app.use("/", listPatientRouter);
app.use("/", listDoctorRouter);
app.use("/", addPatientRouter);
app.use("/", addDoctor);
app.use("/", statuspatient);
app.use("/", page);
app.use("/", updatetoken);
app.use("/", device1);
app.use("/", sendnotification);

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});
app.post("/test", (req, res) => {});
//api thay đổi trạng thái bệnh nhân

app.post("/updatestatuspt", (req, res) => {
  console.log(req.body.id);
  var newvalues = { $set: { state: 3 } };
  PATIENT.findByIdAndUpdate(
    req.body.id,
    newvalues,
    {
      new: true,
    },
    function (err, model) {
      if (!err) {
        res.status(200).send("Cập nhật trạng thái khẩn cấp thành công");
      } else {
        res.status(401).send("Cập nhật trạng thái khẩn cấp không thành công");
      }
    }
  );
});
//màn hình dashboard
app.get("/dashboard", (req, res) => {
  var model = db.model("data-doctors", DOCTORS.schema);
  var model1 = db.model("data-patients", PATIENT.schema);

  var methodFind = model.find({});
  methodFind.exec((err, data) => {
    if (err) {
      throw err;
    } else {
      model1
        .find()
        .count()
        .exec((err, data1) => {
          if (err) {
            throw err;
          } else {
            model1
              .find({ done: "2" })
              .count()
              .exec((err, data2) => {
                if (err) {
                  throw err;
                } else {
                  model1
                    .find({ done: "1" })
                    .count()
                    .exec((err, data3) => {
                      if (err) {
                        throw err;
                      } else {
                        model1.find({ state: 0 }).count((err, data4) => {
                          if (err) {
                            throw err;
                          } else {
                            model1.find({ state: 1 }).count((err, data5) => {
                              if (err) {
                                throw err;
                              } else {
                                model1
                                  .find({ state: 2 })
                                  .count((err, data6) => {
                                    if (err) {
                                      throw err;
                                    } else {
                                      model1
                                        .find({ state: 3 })
                                        .count((err, data7) => {
                                          console.log("tổng bn: ", data1);
                                          console.log("tổng bn khỏi: ", data2);
                                          console.log("tổng bn die: ", data3);
                                          console.log(
                                            "tổng số bn bình thường: ",
                                            data4
                                          );
                                          console.log(
                                            "tổng bn cần theo dõi: ",
                                            data5
                                          );
                                          console.log(
                                            "tổng bn cảnh báo: ",
                                            data6
                                          );
                                          console.log(
                                            "tổng bn nguy cấp: ",
                                            data7
                                          );
                                          res.render("dashboard", {
                                            // docs: data.map(aa => aa.toJSON())
                                            docs: data,
                                            total: data1,
                                            totaldn: data2,
                                            totaldi: data3,
                                            totalbt: data4,
                                            totaltd: data5,
                                            totalcb: data6,
                                            totalnc: data7,
                                          });
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                }
              });
          }
        });
    }
  });
  // console.log("ham ham: ", data.map(aa => aa.toJSON()))
});

//chi tiết bệnh nhân
app.get("/:na", (req, res) => {
  PATIENT.findById(req.params.na, (err, data) => {
    if (err) {
      console.log("err get data one item patient");
      res.render("listPatients");
    } else {
      var myDevice = data.key_device;
      console.log("key device", data.key_device);
      DEVICE.find({ key_device: myDevice }).exec((er, data2) => {
        if (er) throw er;
        else {
          DOCTORS.find({ state: true }).exec((er3, data3) => {
            if (er3) throw er3;
            else {
              console.log(`devices:`, data2);
              res.render("profile", {
                patient: data,
                device: data2,
                doctors: data3,
                data: [10, 20, 30],
              });
            }
          });
        }
      });
    }
  });
});

//api phần thêm dư liệu và thêm dữ liệu thiết bị-----------------------------------------------------------------------
app.post("/add-device", (req, res) => {
  console.log("request data sensor to sever");
  //get data request
  console.log("heart: ", req.query.heart);

  console.log("spO2: ", req.query.spO2);

  console.log("temp:", req.query.temp);

  console.log("key: ", req.query.key_device);

  console.log("state: ", req.query.state);
  console.log("------------------------------------------- ");
  PATIENT.updateOne(
    { key_device: req.query.key_device },
    { $set: { state: Number(req.query.state) } },
    {
      new: true,
    },
    function (err, model) {
      if (!err) {
        console.log("update status doctor completr");
      } else {
        console.log("update status doctor fail");
      }
    }
  );
  DEVICE.updateOne(
    { key_device: req.query.key_device },
    {
      $push: {
        heart: { value: Number(req.query.heart), real_time: Date.now() },
        spO2: { value: Number(req.query.spO2), real_time: Date.now() },
        temp: { value: Number(req.query.temp), real_time: Date.now() },
      },
    },
    function (err) {
      if (!err) {
        // res.redirect('/list-patients');
        res.status(200).json({
          message: "ok",
        });
        console.log(res.json);
      } else {
        res.status(500).json({
          message: "err",
        });
      }
    }
  );
  // var newDEVICE = DEVICE({
  //     key_device: req.query.key,
  //     heart:
  //         {
  //             value: Number(req.query.heart),
  //             real_time: new Date(),
  //         }
  //     ,
  //     spO2:
  //         {
  //             value: Number(req.query.spO2),
  //             real_time: new Date(),
  //         }
  //     ,
  //     temp:
  //         {
  //             value: Number(req.query.temp),
  //             real_time: new Date(),
  //         }
  //     ,
  //
  // });
  // console.log("data post req: ", req.query);
  //
  // //insert data
  // // db.collection("data-devices").insertOne(newDEVICE, (err, result) => {
  // //     if (err) {
  // //         res.status(400).json(err);
  // //     }else {
  // //         console.log("Thêm thành công");
  // //         console.log(result);
  // //         res.status(200).json(result);
  // //     }
  // // });
  //
  // // update data
  //
  // var oldValue = {key_device:  req.query.key};
  // var newValue = {
  //     $push: {
  //         heart:
  //             {
  //                 value: Number(req.query.heart),
  //                 real_time: new Date(),
  //             }
  //         ,
  //         spO2:
  //             {
  //                 value: Number(req.query.spO2),
  //                 real_time: new Date(),
  //             }
  //         ,
  //         temp:
  //             {
  //                 value: Number(req.query.temp),
  //                 real_time: new Date(),
  //             }
  //         ,
  //     }
  //
  // };
  // //update
  //
  // // PATIENT.find({key_device:keydevice}
  //
  //     var model = db.collection("data-devices");
  //     model.updateOne(oldValue,newValue,(err,obj)=>{
  //         if(err) {
  //             res.status(400).json(err);
  //         }else {
  //             if(obj.length!=0){
  //                 console.log("Cập nhật thành công");
  //                 res.status(200).json({"message":"update successful"});
  //             }
  //         }
  //     });
}); //--|
app.get("/add-device", (req, res) => {
  const findDevice = DEVICE.find({});
  findDevice.exec((err, data) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}); //-----------------|
app.post("/add-device2", (req, res) => {
  // DEVICE({
  //     key_device:req.body.key_device,
  //     // name: req.body.name,
  //     // username:req.body.username,
  //     // password: req.body.password,
  //     // age:req.body.age,
  //     // birth_day:req.body.birth_day,
  //     // phone:req.body.phone,
  //     // number_room:req.body.number_room,
  //     // key_device:req.body.key_device
  // }).save((err) =>{
  //     if (err){
  //         console.log('Thêm không thành công:', err);
  //     }else{
  //
  //         console.log('Thành công, : ', req.body);
  //     }
  //
  // })
  var newDEVICE = DEVICE({
    key_device: req.query.key_device,
    heart: {
      value: Number(req.query.heart),
      real_time: new Date(),
    },
    spO2: {
      value: Number(req.query.spO2),
      real_time: new Date(),
    },
    temp: {
      value: Number(req.query.temp),
      real_time: new Date(),
    },
    state: {
      value: Number(req.query.temp),
      real_time: new Date(),
    },
  });
  console.log("data post req: ", req.query);
});
//--------------------------------------------------------------------------------------------------------------------|

app.set('view engine','hbs')
app.set('views',path.join(__dirname,'/views'))
console.log(__dirname)
app.get('/contact/to',(req,res)=>{
    res.render('contact')
})
app.post('/data/data-patient', (req, res)=>{
    const id = req.body.username;
    // var findDevice = DEVICE.findOne({key_device: device});
    var findPatient = PATIENT.findOne({username: id});
     findPatient.exec((err, data) =>{
         if (err){
             res.status(404).json(err);
         }else {
             // res.status(200).json(data);
             const device = data.key_device;
             console.log('thiết bị:', device)
             DEVICE.findOne({key_device: device})
                 .exec((err, data2) => {
                     if (err){
                         res.status(404).json(err);
                     }else {
                         res.status(200).json(data);
                     }
                 })
         }
     })
})
//update status doctor
app.get("/updateStatus/:key/:keydevice", (req, res) => {
  var key = req.params.key;
  var keydevice = req.params.keydevice;
  var newvalues = { $set: { state: "false" } };
  DOCTORS.findByIdAndUpdate(
    key,
    newvalues,
    {
      new: true,
    },
    function (err, model) {
      if (!err) {
        console.log("update status doctor completr");
      } else {
        console.log("update status doctor fail");
      }
    }
  );
  PATIENT.find({ key_device: keydevice }, (err, data) => {
    if (err) {
      console.log("err patient:", err);
    } else {
      DOCTORS.find({ _id: key }, (err2, data2) => {
        if (err) {
          console.log("err device:", err);
        } else {
          console.log("data patient:", data);
          console.log("data device:", data2);
          res.render("notification", { data1: data, data2: data2 });
        }
      });
    }
  });
});
//------------------------------------------------------------------------------------------------------------
//-----------------API------------------------------------------------------------------------------------------
app.get("/data-device", (req, res) => {
  const findDevice = DEVICE.find({});
  findDevice.exec((err, data) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get('/data/data-patient',(req, res)=>{
    var findPatient = PATIENT.find({});
    findPatient.exec((err, data)=>{
        if (err){
            res.status(400).json(err);
        }else{
            res.status(200).json(data);
        }

app.get("/data-patient", (req, res) => {
  var findPatient = PATIENT.find({});
  findPatient.exec((err, data) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});
//login doctor
app.post("/data-login-doctor", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  var findDoctor = DOCTORS.findOne({ username: username, password: password });
  findDoctor.exec((err, data) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});
//find one patient and device
app.post("/data-a-patient", (req, res) => {
  const id = req.body.id;
  const findPatient = PATIENT.findOne({ id: id });
  findPatient.exec((err, patient) => {
    if (err) {
      res.status(404).json(err);
    } else {
      const key_device = patient.key_device;
      DEVICE.findOne({ key_device: key_device }).exec((err, device) => {
        if (err) {
          res.status(404).json(err);
        } else {
          res.status(200).json({ patient, device });
        }
      });
    }
  });
});

//find one device
app.post("/data-a-device", (req, res) => {
  const key_device = req.body.key_device;
  const findDevice = DEVICE.findOne({ key_device: key_device });
  findDevice.exec((err, device) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(device);
    }
  });
});

//find one patient
app.post("/data-one-patient", (req, res) => {
  const idPatient = req.body.id;
  const findPatient = PATIENT.findOne({ id: idPatient });
  findPatient.exec((err, patient) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(patient);
    }
  });
});
//find one doctor
app.post("/data-one-doctor", (req, res) => {
  const idDoctor = req.body.id;
  const findDoctor = DOCTORS.findOne({ id: idDoctor });
  findDoctor.exec((err, doctor) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json(doctor);
    }
  });
});
// //delete 09.11
app.get("/delete/:key", async (req, res) => {
  try {
    const patient = await PATIENT.findByIdAndDelete(req.params.key, req.body);
    if (!patient) {
      // res.status(400).send('Không tìm thấy bệnh nhân');
      console.log("delete patient fail");
    } else {
      // res.status(200).send();
      console.log("delete patient success");
      res.redirect("/list-patients");
      // res.render('listPatients');
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/login`);
});

// app.listen(process.env.PORT || 3000);

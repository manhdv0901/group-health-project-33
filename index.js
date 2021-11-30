const express = require('express')
const { body, validationResult } = require('express-validator');
var expressSession=require('express-session');
const exhbs = require('express-handlebars')
const PORT = process.env.PORT || 3000
const app =express();
var helpers = require('handlebars-helpers')();
//connect mongoose
const mongoose = require("mongoose");
const path = require('path')
const fetch = require("node-fetch");
const SERVER_KEY = 'AAAAqRousOQ:APA91bGX-6Wo0hGqvr9OrzCnX-8LEPNQXZsycdQR7qnrOH1Wzi5LDpo9UPyLNMayuL7F5QWXGI9wAxpRMwi7fOWRh3BrPHj9Nsc_5Fimt9Bb6wBO_GmbT97BDqXfZJNX4v2l_OXGAPsH';

// import device from './app/src/model/device_model';
const device = require('./app/src/model/device_model');
app.use(expressSession({secret:'max',saveUninitialized:false,resave:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}));



app.use(express.json());
app.engine('hbs',exhbs({
    defaultLayout: 'main',
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }

    }))

//mang nhan data tu thiet bi
var myDataTem = [];
var myDataHea=[];
var myDataSpO2 =[];
var myDataState =[];
var myDataKey =[];

//config mongodb
const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);

//check connect mongoose
mongoose.connection.on("connected", function (){
    console.log("connect successful");
})
mongoose.connection.on("disconnected", function (){
    console.log("connect fail");
});
//connect mongoose
var db=mongoose.connection;

const KEY_DEVICE = 'device05';

//model
var DEVICE = require('./app/src/model/device_model');
var DOCTORS = require('./app/src/model/doctor_model');
var PATIENT = require('./app/src/model/patient_model');
var USER = require('./app/src/model/user_model');

const deviceRoute = require('./app/src/router/login_router')
const listPatientRouter = require('./app/src/router/list_patient_router')
const listDoctorRouter = require('./app/src/router/list_doctor_router')
const addPatientRouter = require('./app/src/router/addpatient_router')
const addDoctor = require('./app/src/router/add_doctor_router')

app.use('/', deviceRoute)
app.use('/', listPatientRouter)
app.use('/', listDoctorRouter)
app.use('/', addPatientRouter)
app.use('/', addDoctor)

app.get('/',(req,res)=>{
    res.redirect('/dashboard')
})
app.get('/dashboard',(req, res)=>{

    var model = db.model('data-doctors', DOCTORS.schema);
    var model1 = db.model('data-patients', PATIENT.schema);


    var methodFind = model.find({});
    methodFind.exec((err,data) => {
        if (err) {throw err;}
        else{
            model1.find().count().exec((err,data1)=>{
                if(err) {throw err;}
                else {
                    model1.find({done:"2"}).count().exec((err,data2)=>{
                       if(err) {throw err}
                       else{
                           model1.find({done:"1"}).count().exec((err,data3)=>{
                               console.log("tổng bn: ", data1)
                               console.log("tổng bn khỏi: ", data2)
                               console.log("tổng bn die: ", data3)
                               res.render('dashboard', {
                                   // docs: data.map(aa => aa.toJSON())
                                   docs: data,
                                   total:data1,
                                   totaldn:data2,
                                   totaldi:data3
                               })
                           })
                       }
                    })
                }

            });
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))

        }
    });

})
//
app.get('/:na',(req,res)=>{
    PATIENT.findById(req.params.na,(err, data)=>{
        if(err){
            console.log('err get data one item patient');
            res.render('listPatients');
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
                                        patient: data, device:data2, doctors: data3,data:[10,20,30]
                                    })
                                }
                            })
                    }
                })
        }

    })
})
//send notification
app.post('/sendToAll',(req,res)=>{
    var id=req.body.id;
    var title=req.body.title;
    var name=req.body.name;
    var room=req.body.room;
    var age=req.body.age;
    var status=req.body.status;
    var medicine=req.body.medicine;
    var amountAndUse=req.body.amountAndUse;
        var key_device=req.body.key_device;
        var notification={
            'id':id,
            'title':title,
            'name':name,
            'room':room,
            'age':age,
            'status':status,
            'medicine':medicine,
            'amountAndUse':amountAndUse,
            'key_device':key_device
        };

        var fcm_tokens=req.body.token;//lấy từ body mà. m ảo thế
        // var fcm_tokens=['ev8StG0CSHGv4RMdH9ndkZ:APA91bFu-TlfT-meH75l4h3CmxamvsVZrCERhvmUoBintP2cSTITYmAj7oXfWmEwTRGYCaMx3IHGjRGJRF0J-3zagt8b7O7tS37eEtkzIxLGRNeY_BrWdOBngYlmKb6sPvQKgpjQCNvR'];

        var notification_body={
            'data':notification,
            'to':fcm_tokens
        }
        //còn bắn node là bắn theo token, tại chiều bắn theo token k đ nên bắn console
        // var notification_body={
        //     'notification':notification,
        //     'registration_ids':fcm_tokens
        // } nch là api k liên quan đâu
        console.log("notify body",notification_body)

        async function fetchMovies() {
            const response = await fetch('https://fcm.googleapis.com/fcm/send',{
                'method':'POST',
                'headers':{
                    'Authorization':'key=' +SERVER_KEY,
                    'Content-Type':'application/json'
                },
                'body':JSON.stringify(notification_body)
            }).then(()=>{
                res.redirect('/dashboard')
            }).catch((err)=>{
                res.status(400).send('Something went wrong!');
                console.log(err)
            });
            return response;
            // waits until the request completes...
        }

        console.log(fetchMovies());
},
);

app.post("/add-device", (req,res) => {
    console.log("request data sensor to sever");
    //get data request
    console.log("heart: ", req.query.heart);

    console.log("spO2: ", req.query.spO2);

    console.log("temp:", req.query.temp);

    console.log("key: ", req.query.key);

    console.log("state: ", req.query.state);
    PATIENT.updateOne( {"key_device" : req.query.key } , { $set: {'state': Number(req.query.state) } }, {
            new: true
        },
        function(err, model) {
            if (!err) {
                console.log('update status doctor completr')
            } else {
                console.log('update status doctor fail')
            }
        });
    DEVICE.updateOne(
        { "key_device" : req.query.key },
        {$push: { 'heart' :
                    {'value':Number(req.query.heart),'real_time':Date.now()} ,
                'spO2' :
                    {'value':Number(req.query.spO2),'real_time':Date.now()} ,
                'temp' :
                    {'value':Number(req.query.temp),'real_time':Date.now()} ,
            },},function (err) {
            if (!err) {
                // res.redirect('/list-patients');
                res.status(200).json({
                    message: "ok"
                })
                console.log(res.json)
            } else {
                res.status(500).json({
                    message: "err"
                })
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
});
app.get('/add-device', (req, res) =>{
    const findDevice =DEVICE.find({});
        findDevice.exec((err, data) =>{
            if (err){
                res.status(400).json(err);
            }else {
                res.status(200).json(data);
            }
        })
})

app.use('/api/notification',require('./notification'));
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'/views'))
console.log(__dirname)

app.get('/contact/to',(req,res)=>{
    res.render('contact')
})
// get infomation detail patient
// app.get("/profile", (req, res) => {
//     var modelPatient = db.model('data-patients', PATIENTSchema);
//     var modelDevice = db.model('data-devices', DEVICESchema);
//
//     var dataPatient = modelPatient.find({key_device:"device01"})
//     var dataDevice=modelDevice.find({key_device:"device01"});
//
//     //set data chi tiết bệnh nhân
//     dataPatient.exec((err,data) => {
//         if (err) throw err;
//         console.log("data patient: ", data.map(aa => aa.toJSON()))
//         res.render('profile', {
//             patient: data.map(aa => aa.toJSON())
//         })
//     })
//     //set data lịch sử
//     dataDevice.exec((err,data)=>{
//         if (err) throw err;
//         console.log("data device: ", data.map(aa => aa.toJSON()))
//         res.render('profile', {
//                 device: data.map(aa => aa.toJSON())
//             })
//     })
//
// });
//thêm thiết bị
app.post('/add-device2',(req,res)=>{
    DEVICE({
        key_device:req.body.key_device,
        // name: req.body.name,
        // username:req.body.username,
        // password: req.body.password,
        // age:req.body.age,
        // birth_day:req.body.birth_day,
        // phone:req.body.phone,
        // number_room:req.body.number_room,
        // key_device:req.body.key_device
    }).save((err) =>{
        if (err){
            console.log('Thêm không thành công:', err);
        }else{

            console.log('Thành công, : ', req.body);
        }

    })
})


app.post('/data-patient', (req, res)=>{
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
app.get('/updateStatus/:key/:keydevice',(req,res)=>{
    var key=req.params.key;
    var keydevice=req.params.keydevice;
    var newvalues = { $set: {state: "false" } };
    DOCTORS.findByIdAndUpdate(key , newvalues, {
            new: true
        },
        function(err, model) {
            if (!err) {
                console.log('update status doctor completr')
            } else {
                console.log('update status doctor fail')
            }
        });
    PATIENT.find({key_device:keydevice},(err, data)=>{
        if (err){
            console.log('err patient:', err);
        }else {
            DOCTORS.find({_id:key},(err2, data2)=>{
                if (err){
                    console.log('err device:', err);
                }else{
                    console.log('data patient:',data);
                    console.log('data device:', data2);
                    res.render('notification',{data1:data, data2:data2})
                }
            })
        }
    });


})



//------------------------------------------------------------------------------------------------------------
//-----------------API------------------------------------------------------------------------------------------
app.get('/data-device',(req, res)=>{
    const findDevice = DEVICE.find({});
    findDevice.exec((err, data)=>{
        if (err){
            res.status(404).json(err);
        }else{
            res.status(200).json(data);
        }
    })
})

app.get('/data-doctor',(req, res)=>{
    var findDoctor = DOCTORS.find({});
    findDoctor.exec((err, data)=>{
        if (err){
            res.status(404).json(err);
        }else{
            res.status(200).json(data);
        }
    })
})

app.get('/data-patient',(req, res)=>{
    var findPatient = PATIENT.find({});
    findPatient.exec((err, data)=>{
        if (err){
            res.status(404).json(err);
        }else{
            res.status(200).json(data);
        }

    })
})
//login doctor
app.post('/data-login-doctor',(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    var findDoctor = DOCTORS.findOne({username: username, password:password});
    findDoctor.exec((err, data)=>{
        if (err){
            res.status(404).json(err);
        }else{
            res.status(200).json(data);
        }

    })
})
//find one patient and device
app.post('/data-a-patient',(req, res)=>{
    const id = req.body.id;
    const findPatient = PATIENT.findOne({id: id});
    findPatient.exec((err, patient)=>{
        if (err){
            res.status(404).json(err);
        }else {
            const key_device = patient.key_device;
            DEVICE.findOne({key_device: key_device})
                .exec((err, device) =>{
                    if(err){
                        res.status(404).json(err);
                    }else{
                        res.status(200).json({patient,device});
                    }
                })
        }
    })
})

//find one device
app.post('/data-a-device',(req, res) => {
    const key_device = req.body.key_device;
    const findDevice = DEVICE.findOne({key_device: key_device});
    findDevice.exec((err, device) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json(device);
        }
    })
})

//find one patient
app.post('/data-one-patient',(req, res) => {
    const idPatient = req.body.id;
    const findPatient = PATIENT.findOne({id:  idPatient});
    findPatient.exec((err, patient) => {
        if (err){
            res.status(404).json(err);
        }else {
            res.status(200).json(patient);
        }
    });
})
//find one doctor
app.post('/data-one-doctor',(req, res)=>{
    const idDoctor = req.body.id;
    const findDoctor = DOCTORS.findOne({id: idDoctor});
    findDoctor.exec((err, doctor) => {
        if(err){
            res.status(404).json(err);
        }else{
            res.status(200).json(doctor);
        }
    })
})
//update lịch sử điều trị
app.post('/update/track-history/',(req,res)=>{
    console.log(req.body.key_device)
    console.log(req.body.data)
    console.log(req.body.date)
    var key=req.body.key_device;
    var data=req.body.data;
    var date=req.body.date;
    DEVICE.updateOne(
        { "key_device" : key},
        { $push: { 'track_history' : {'value':data,'real_time':date} }, },function (err) {
            if (!err) {
                // res.redirect('/list-patients');
                res.status(200).json({
                    message: "Cập nhật lịch sử thành công"
                })
            } else {
                res.status(500).json({
                    message: "Cập nhật lịch sử thất bại"
                })
            }
        }
    );

})
//update liệu trình
app.post('/update/treatmentcourse/',(req,res)=>{
    console.log(req.body.key_device)
    console.log(req.body.data)
    console.log(req.body.date)

    var key=req.body.key_device;
    var data=req.body.data;
    var date=req.body.date;
    DEVICE.updateOne(
        { "key_device" : key },
        { $push: { 'treatment_course' : {'value':data,'real_time':date} }, },function (err) {
            if (!err) {
                // res.redirect('/list-patients');
                res.status(200).json({
                    message: "Cập nhật liệu trình thành công"
                })
            } else {
                res.status(500).json({
                    message: "Cập nhật liệu trình thất bại"
                })
            }
        }
    );

})
// get info all device
app.get("/list",(req, res) => {
    var model = db.model('data-devices', DEVICESchema);
    var methodFind = model.find({});
    methodFind.exec((err,data) => {
        if (err) {throw err;
        }else{
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))
            console.log("ham ham: ", data)
            res.render('table_2', {
                // ups: data.map(aa => aa.toJSON())
                ups: data
            })}
    })
});
//api update statuss
app.post('/updateStatus',(req,res)=>{
    console.log(req.body.id)
    var newvalues = { $set: {state: "true" } };
    DOCTORS.findByIdAndUpdate(req.body.id , newvalues, {
            new: true
        },
        function(err, model) {
            if (!err) {
                console.log('update status doctor completr')
            } else {
                console.log('update status doctor fail')
            }
        });

})
//update tình trạng bệnh nhân đã khỏi
app.get('/updateStatusPatient2/:key',(req,res)=>{
    console.log(req.params.key)
    var newvalues = { $set: {done: "2" } };
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

})
//update tình tranng benh nhan tu vong
app.get('/updateStatusPatient1/:key',(req,res)=>{
    console.log(req.params.key)
    var newvalues = { $set: {done: "1" } };
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

})
//update token doctor
app.post('/update-token',(req,res)=>{
    console.log(req.body.tokennn)
    var myquery = { _id:req.body.key};
    var newvalues = { tokenn: req.body.tokennn};
    DOCTORS.findByIdAndUpdate(req.body.key, newvalues, {
            new: true
        },
        function(err, model) {
            if (!err) {
                // res.redirect('/list-patients');
                res.status(200).json({
                    message: "update token complete"
                })
            } else {
                res.status(500).json({
                    message: "not found any relative data"
                })
            }
        });
})
//-------------------------------------------------------------------------------------------------
// //delete 09.11
app.get('/delete/:key', async (req, res) =>{
    try{
        const patient = await PATIENT.findByIdAndDelete(req.params.key, req.body);
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
})




app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}/login`);
})

// app.listen(process.env.PORT || 3000);
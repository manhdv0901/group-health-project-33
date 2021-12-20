
const mongoose = require("mongoose");


const DEVICE = require("../model/device_model");
const moment = require("moment/moment");
const {validationResult} = require("express-validator");
const DOCTOR = require("../model/doctor_model");
const PATIENT = require("../model/patient_model");


const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.dashboard = (req,res)=>{
    var model1 = db.model("data-devices", DEVICE.schema);
    model1
        .find({state:true})
        .count()
        .exec((err, data1) => {
            model1
                .find({state:false})
                .count()
                .exec((err, data2) => {
                    model1
                        .find({nameDevice:"Thiết bị đo nhịp tim"})
                        .count()
                        .exec((err, data3) => {
                            model1
                                .find({nameDevice:"Thiết bị thở"})
                                .count()
                                .exec((err, data4) => {
                                    res.render('dashboard_device',{
                                        devicetrue:data1,
                                        devicefasle:data2,
                                        nameDevices:data3,
                                        nameDevices1:data4,
                                    })
                                })
                        })

                });
        });

}
module.exports.adddevices = (req,res)=>{
    res.render('add_devices')
}
module.exports.postadddevices = (req,res)=>{
    var errors = validationResult(req).array();
    if (errors.length>0) {
        console.log(errors)
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/adds-devices');
    }
    else{
        req.session.success = true;
        DEVICE.findOne({key_device: req.body.key_device},(err,data1)=>{
            if(data1){
                errors.push(
                    {
                        value: '',
                        msg: 'Đã có key thiết bị này',
                        param: 'keydevice',
                        location: 'body'
                    },
                )
                console.log(errors)
                req.session.errors = errors;
                req.session.success = false;
                res.redirect('/adds-devices');
            }
            else{
                DEVICE({
                    key_device:req.body.key_device,
                    state:0,
                    heart:[],
                    spO2:[],
                    temp:[],
                    track_history:[],
                    treatment_course:[],
                    nameDevice:req.body.namedevice,
                }).save((err) =>{
                    if (err){
                        console.log('Thêm thiết bị fails:', err);
                    }else{
                        res.redirect('/list-devices');
                        console.log('Thành công, user: ', req.body);
                    }

                })
            }
        });

    }
}
module.exports.listdevices = (req,res)=>{
    var model = db.model('data-devices', DEVICE.schema);
    var methodFind = model.find().sort({ state: -1});
    methodFind.exec((err,data) => {
        if (err) {throw err;
        }else{
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))
            res.render('table_device', {
                docs: data,
            })
        }
    })
}

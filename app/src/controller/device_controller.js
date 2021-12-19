
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

module.exports.trackhistory = (req,res)=>{
    console.log(req.body.key_device)
    console.log(req.body.data)
    var key=req.body.key_device;
    var data=req.body.data;
    var date=moment().format("DD-MM-YYYY hh:mm:ss");
    var model = db.model('data-devices', DEVICE.schema);
    model.findOne({key_device: key}, (err, devices)=>{
       if(devices!=null){
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
       }
       else{
           res.status(400).send('Không có thiết bị này')
       }
    });


}

module.exports.treatmentcourse = (req,res)=>{
    console.log(req.body.key_device)
    console.log(req.body.data)
    console.log(req.body.date)

    var key=req.body.key_device;
    var data=req.body.data;
    var date=moment().format("DD-MM-YYYY hh:mm:ss");
    var model = db.model('data-devices', DEVICE.schema);
    model.findOne({key_device: key}, (err, devices)=>{
        if(devices!=null){
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
        }
        else{
            res.status(400).send('Không có thiết bị này')
        }
    });


}
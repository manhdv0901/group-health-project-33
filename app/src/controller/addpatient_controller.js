
const mongoose = require("mongoose");

const PATIENT = require("../model/patient_model");

const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.getaddpatient=(req, res)=>{
    res.render('addPatient');
}
module.exports.postaddpatient=(req, res)=>{
    PATIENT({
        id:req.body.id,
        name: req.body.name,
        username:req.body.username,
        password: req.body.password,
        age:req.body.age,
        birth_day:req.body.birth_day,
        phone:req.body.phone,
        number_room:req.body.number_room,
        key_device:req.body.key_device
    }).save((err) =>{
        if (err){
            console.log('Thêm bệnh nhân thất bại:', err);
        }else{
            res.redirect('/list-patients');
            console.log('Thành công, user: ', req.body);
        }

    })
}
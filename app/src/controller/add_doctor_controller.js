
const mongoose = require("mongoose");

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

module.exports.getdoc=(req, res)=>{
    res.render('add_doctor')
}
module.exports.postdoctor=(req, res)=>{
    DOCTOR({
        id:req.body.id,
        name: req.body.name,
        username:req.body.username,
        password: req.body.password,
        gender:req.body.gender,
        state:true,
        tokenn:""

    }).save((err) =>{
        if (err){
            console.log('Thêm bác sĩ thất bạt:', err);
        }else{
            res.redirect('/list');
            console.log('Thành công, user: ', req.body);
        }

    })
}
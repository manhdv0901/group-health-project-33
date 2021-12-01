
const mongoose = require("mongoose");

const DOCTORS = require("../model/doctor_model");

const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;
//API UPDATE TOKEN CỦA BÁC SĨ
module.exports.updatetoken =(req,res)=>{
    console.log(req.body.tokennn)
    console.log(req.body.key)
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
                res.status(99).json({
                    message: "not found any relative data"
                })
            }
        });
}
//API UPDATE TRẠNG THÁI BÁC SĨ -->>TRUE
module.exports.updatestatus =(req,res)=>{
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

}

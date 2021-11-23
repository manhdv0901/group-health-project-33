
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

module.exports.listdoctor =  (req, res) => {
    var model = db.model('data-doctors', DOCTORS.schema);
    var methodFind = model.find({});
    methodFind.exec((err,data) => {
        if (err) {throw err;}
        else{
            // console.log("ham ham: ", data.map(aa => aa.toJSON()))
            console.log("ham ham: ", data)
            res.render('listDoctor', {
                // docs: data.map(aa => aa.toJSON())
                docs: data
            })
        }
    })
}

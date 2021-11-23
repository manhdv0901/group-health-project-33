const {body, validationResult} = require("express-validator");
var PATIENT = require('../model/patient_model');

var USER = require('../model/user_model');
const mongoose = require("mongoose");
const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;
module.exports.login = (req, res)=> {
    res.render('login', {
        success: req.session.success,
        errors: req.session.errors
    });

    req.session.errors = null;
}

module.exports.login1 =
    (req, res)=> {
        var username =  req.body.username;
        var password = req.body.password;
        var errors = validationResult(req).array();
        if (errors.length>0) {
            console.log(errors)
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/login');
        }
        else {
            req.session.success = true;
            var model = db.model('data-logins', USER);
            model.findOne({username: username, password: password}, (err, user) =>{
                if (err){
                    return console.log("err login: ", err);
                }
                if(!user){
                    errors.push(
                        {
                            value: '',
                            msg: 'Tên đăng nhập hoặc mật khẩu không chính xác',
                            param: 'username',
                            location: 'body'
                        },
                    )
                    console.log(errors)
                    req.session.errors = errors;
                    req.session.success = false;
                    res.redirect('/login');
                    //  res.status(400).json({'errr 400':'err'});
                }
                // res.status(200).json({'mess':'success'})
                if(user!=null){
                    res.redirect('/list-patients');
                }
            })
        }


    };

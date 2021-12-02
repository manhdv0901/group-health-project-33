
const mongoose = require("mongoose");

const SERVER_KEY = 'AAAAqRousOQ:APA91bGX-6Wo0hGqvr9OrzCnX-8LEPNQXZsycdQR7qnrOH1Wzi5LDpo9UPyLNMayuL7F5QWXGI9wAxpRMwi7fOWRh3BrPHj9Nsc_5Fimt9Bb6wBO_GmbT97BDqXfZJNX4v2l_OXGAPsH';
const DEVICE = require("../model/device_model");
const fetch = require("node-fetch");

const DATABASE_URL ="mongodb+srv://sonhandsome01:sonhandsome01@test-data-datn.fwejn.mongodb.net/data-project?retryWrites=true&w=majority";
const DATABASE_CONNECT_OPTION  = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// //connect mongoose
mongoose.connect(DATABASE_URL, DATABASE_CONNECT_OPTION);
var db=mongoose.connection;

module.exports.sentoAll =(req,res)=>{
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
}



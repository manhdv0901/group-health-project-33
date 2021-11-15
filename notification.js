const express=require('express')
const fetch=require('node-fetch');

const  router=express.Router();
const SERVER_KEY = 'AAAAqRousOQ:APA91bGX-6Wo0hGqvr9OrzCnX-8LEPNQXZsycdQR7qnrOH1Wzi5LDpo9UPyLNMayuL7F5QWXGI9wAxpRMwi7fOWRh3BrPHj9Nsc_5Fimt9Bb6wBO_GmbT97BDqXfZJNX4v2l_OXGAPsH';

router.post('/sendToAll',(req,res)=>{
    var notification={
        'id':req.body.id,
        'title':req.body.title,
        'name':req.body.name,
        'room':req.body.room,
        'age':req.body.age,
        'status':req.body.status,
        'medicine':req.body.medicine,
        'amountAndUse':req.body.amountAndUse,
    };
    // var notification={
    //     'title':'hello',
    //     'text':'Subtitle'
    // };
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
            res.status(200).send('Notification succcesfully')
        }).catch((err)=>{
            res.status(400).send('Something went wrong!');
            console.log(err)
        });
        return response;
        // waits until the request completes...
    }

    console.log(fetchMovies());
});

module.exports=router

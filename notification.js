const express=require('express')
const fetch=require('node-fetch');

const  router=express.Router();

router.post('/sendToAll',(req,res)=>{
    var notification={
        'title':'Title of notification',
        'text':'Subtitle'
    };
    var fcm_tokens=[];

    var notification_body={
        'notification':notification,
        'registration_ids':fcm_tokens
    }
     fetch('https://fcm.googleapis.com/fcm/send',{
         'method':'POST',
         'headers':{
             'Authorization':'key=' +
                 'AAAATbEPNMA:APA91bH2zFbq58xlvGEUuaw6_sSqFWHkumKr5ZwkyTAu0l9EwtpydSYUbmI2SKy1eN7bybf2wsntMvq2Z4DSH1EfywE11caSjQyamqwNGuuv5ARAzkXuZSTUHimQMI-4jU9IHvPh7KRE',
             'Content-Type':'application/json'
         },
         'body':JSON.stringify(notification_body)
     }).then(()=>{
         res.status(200).send('Notification succcesfully')
     }).catch((err)=>{
         res.status(400).send('Something went wrong!');
         console.log(err)
     })
});
module.exports=router
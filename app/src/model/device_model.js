const mongoose = require('mongoose');

var DEVICESchema = new mongoose.Schema({
    id:Number,
    key_device:String,
    state:String,
    heart:[
        {value: Number,
            real_time : Date}
    ],
    spO2: [
        {value:Number,
            real_time :Date}
    ],
    temp: [
        {value:Number,
            real_time :Date}
    ],
    track_history:[
        {value:String,
            real_time :String
        }
    ],

    treatment_course:[
        {value:String,
            real_time :String
        }
    ]


})
var DEVICE = mongoose.model("data-devices", DEVICESchema);
module.exports = DEVICE
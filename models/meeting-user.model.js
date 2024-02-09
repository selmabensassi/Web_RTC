const mongoose = require("mongoose");
const { Schema } = mongoose;

const MeetingUser =mongoose .model(
    "MeetingUser",
    new Schema({
        socketId : {
            type: String,
        },
        meetingId:{
         type: Schema.Types.ObjectId,
         ref:"Meeting"
        },
        userId:{
            type: String,
            required: true
        },
        joined:{
            type: Boolean,
            required: true
        },
        name:{
            type: String,
            required: true
        },
         isAlive:{
            type: Boolean,
            required: true
        },
       
    },
   { timestaps:true})
);
module.exports={
    MeetingUser
}
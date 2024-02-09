const mongoose = require("mongoose");
// Correctly destructure Schema from mongoose
const { Schema } = mongoose;

const meetingSchema = new Schema({
    hostId: {
        type: String,
        required: true
    },
    hostName: {
        type: String,
        required: false
    },
    startTime: {
        type: Date,
        required: true
    },
    meetingUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: "MeetingUser"
        }
    ]
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true 
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = {
    Meeting 
};

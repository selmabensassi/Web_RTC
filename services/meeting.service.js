const { Meeting } = require("../models/meeting.model");
const { MeetingUser } = require("../models/meeting-user.model");

async function getAllMeetingUsers(meetingId, callback) {
    try {
        const users = await MeetingUser.find({ meetingId });
        callback(null, users);
    } catch (error) {
        callback(error);
    }
}

async function startMeeting(params, callback) {
    try {
        const meetingSchema = new Meeting(params);
        const newMeeting = await meetingSchema.save();
        callback(null, newMeeting);
    } catch (error) {
        callback(error);
    }
}

async function joinMeeting(params, callback) {
    try {
        checkMeetingExists(params.meetingId, async (error, meeting) => {
            if (error) {
                callback(error);
            } else if (meeting) {
                const meetingUserModel = new MeetingUser(params);
                const savedUser = await meetingUserModel.save();
                const updatedMeeting = await Meeting.findByIdAndUpdate(
                    params.meetingId,
                    { $addToSet: { meetingUsers: savedUser._id } },
                    { new: true }
                );
                callback(null, savedUser);
            } else {
                callback('Meeting not found');
            }
        });
    } catch (error) {
        callback(error);
    }
}


async function isMeetingPresent(meetingId, callback) {
    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            callback("Meeting not found");
        } else {
            callback(null, true);
        }
    } catch (error) {
        callback(error);
    }
}

async function getMeetingUser(params, callback) {
    try {
        const { meetingId, userId } = params;
        const user = await MeetingUser.findOne({ meetingId, userId });
        callback(null, user);
    } catch (error) {
        callback(error);
    }
}

async function updateMeetingUser(params, callback) {
    try {
        const { userId } = params;
        const updatedUser = await MeetingUser.updateOne({ userId }, { $set: params }, { new: true });
        callback(null, updatedUser);
    } catch (error) {
        callback(error);
    }
}

async function getUserBySocketId(params, callback) {
    try {
        const { meetingId, socketId } = params;
        const user = await MeetingUser.findOne({ meetingId, socketId }).limit(1);
        callback(null, user);
    } catch (error) {
        callback(error);
    }
}
async function checkMeetingExists(meetingId, callback) {
    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            callback("Meeting not found", null);
        } else {
            callback(null, meeting); // Return the meeting object if found
        }
    } catch (error) {
        callback(error, null);
    }
}


module.exports = {
    startMeeting,
    joinMeeting,
    getAllMeetingUsers,
    isMeetingPresent,
    checkMeetingExists,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser
};

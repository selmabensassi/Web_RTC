const meetingServices =require("../services/meeting.service");


exports.checkMeetingExists = (req, res, next) => {
    const { meetingId } = req.query;
    
    meetingServices.checkMeetingExists(meetingId, (error, results) => {
        if (error) {
            return next(error); // Pass the error to the error handler middleware
        }
        return res.status(200).json({
            message: "Meeting found",
            data: results
        });
    });
};


exports.startMeeting =(req,res,next)=>{
    const {hostId,hostName}=req.body;

    var model ={
        hostId:hostId,
        hostName:hostName,
        startTime:Date.now()
    };
    
    meetingServices.startMeeting(model,(error,results)=>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message:"Success",
            data:results.id,
        });
    })
}


exports.getAllMeetingUsers=(req,res,next)=>{
    const {meetingId} = req.query;
    
    meetingServices.getAllMeetingUsers(meetingId,(error,results)=>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message:"Success",
            data:results,
        });
    })
}
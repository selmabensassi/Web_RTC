const meetingServices=require("../services/meeting.service");
const {MeetingPayLoadEnum}= require("../utils/meeting-payload.enum");

async function joinMeeting(meetingId, socket, meetingServer, payload) {
    const { userId, name } = payload.data;

    try {
        const results = await meetingServices.isMeetingPresent(meetingId);
        if (!results) {
            sendMessage(socket, { type: MeetingPayLoadEnum.NOT_FOUND });
        } else {
            const userAdded = await addUser(socket, { meetingId, userId, name });
            if (userAdded) {
                sendMessage(socket, { type: MeetingPayLoadEnum.JOINED_MEETING, data: { userId } });
                broadcastUsers(meetingId, socket, meetingServer, {
                    type: MeetingPayLoadEnum.USER_JOINED,
                    data: { userId, name, ...payload.data }
                });
            }
        }
    } catch (error) {
        console.log(error);
        // Handle error appropriately
    }
}

function forwardConnectionRequest(meetingId,socket,meetingServer,payload){
    const{userId,otherUserId,name}=payload.data;

    var model={
        meetingId:meetingId,
        userId:otherUserId,
    };
    meetingServices.getMeetingUser(model,(error,results)=>{
        if(results){
            var sendPayload=JSON.stringify({
                type:MeetingPayLoadEnum.CONNECTION_REQUEST,
                data:{
                    userId,
                    name,
                    ...payload.data
                }
            });
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}

function forwardIceCandidate(meetingId,socket,meetingServer,payload){
    const{userId,otherUserId,candidate}=payload.data;

    var model={
        meetingId:meetingId,
        userId:otherUserId,
    };
    meetingServices.getMeetingUser(model,(error,results)=>{
        if(results){
            var sendPayload=JSON.stringify({
                type:MeetingPayLoadEnum.ICECANDIDATE,
                data:{
                    userId,
                  candidate
                }
            });
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}

function forwardOfferSDP(meetingId,socket,meetingServer,payload){
    const{userId,otherUserId,sdp}=payload.data;

    var model={
        meetingId:meetingId,
        userId:otherUserId,
    };
    meetingServices.getMeetingUser(model,(error,results)=>{
        if(results){
            var sendPayload=JSON.stringify({
                type:MeetingPayLoadEnum.OFFER_SDP,
                data:{
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}

function forwardAnswerSDP(meetingId,socket,meetingServer,payload){
    const{userId,otherUserId,sdp}=payload.data;

    var model={
        meetingId:meetingId,
        userId:otherUserId,
    };
    meetingServices.getMeetingUser(model,(error,results)=>{
        if(results){
            var sendPayload=JSON.stringify({
                type:MeetingPayLoadEnum.ANSWER_SDP,
                data:{
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit('message',sendPayload);
        }
    })
}

function userLeft(meetingId,socket,meetingServer,payload){
    const{userId}=payload.data;
    broadcastUsers(meetingId,socket,meetingServer,{
        type:MeetingPayLoadEnum.USER_LEFT,
        data:{
            userId:userId
        }
    });
}

function endMeeting(meetingId,socket,meetingServer,payload){
    const{userId}=payload.data;
    broadcastUsers(meetingId,socket,meetingServer,{
        type:MeetingPayLoadEnum.MEETING_ENDED,
        data:{
            userId:userId
        }
    });
    meetingServices.getAllMeetingUSers(meetingId,(error,results)=>{
        for(let i=0;1<results.length;i++){
            const meetingUser=results[i];
            meetingServer.socket.connected[meetingUser.socketId].disconnect();

        }
    })
}

function forwardEvent(meetingId,socket,meetingServer,payload){
    const{userId}=payload.data;

    broadcastUsers(meetingId,socket,meetingServer,{
        type:payload.type,
        data:{
            userId:userId,
            ...payload.data,
        }
    });
}

function addUser(socket,{meeting,userId,name}){
    let promise=new Promise(function(resolve,reject){
        meetingServices.getMeetingUser({meetingId,userId},(error,results)=>{
            if(!results){
                var model={
                    socketId:socket.id,
                    meetingId:meetingId,
                    userId:userId,
                    joined:true,
                    name:name,
                    isAlive:true
                };
                meetingServices.joinMeeting(model,(error,results)=>{
                    if(results){
                        resolve(true);
                    }
                    if(error){
                        reject(error);
                    }
                });
            }
            else{
                meetingServices.updateMeetingUser({
                    userId:userId,
                    socketId:socket.id,
                },(error,results)=>{
                    if(results){
                        resolve(true);
                    }
                    if(error){
                        reject(error);
                    }
                
                });
            }
        });
    });
    return promise;

}
function sendMessage(socket,payload){
    socket.send(JSON.stringify(payload));
}

function broadcastUsers(meet,socket,meetingServer,payload){
    socket.broadcast.emit("message",JSON.stringify(payload));
}

module.exports={
    joinMeeting,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    userLeft,
    endMeeting,
    forwardEvent,
}
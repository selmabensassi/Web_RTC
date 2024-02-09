const express = require('express');
const router = express.Router();
const meetingController = require("../controllers/meeting.controller");

router.post("/meeting/start", meetingController.startMeeting);
router.get("/meeting/start", meetingController.startMeeting);

router.get("/meeting/join", meetingController.checkMeetingExists);

router.get("/meeting/check", meetingController.checkMeetingExists);
router.get("/meeting/get", meetingController.getAllMeetingUsers);

module.exports = router;

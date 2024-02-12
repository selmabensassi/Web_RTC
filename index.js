const express =require("express");
const app=express();

const cors = require('cors');
app.use(cors());

const mongoose = require("mongoose");

const {MONGO_DB_CONFIG}=require("./config/app.config");
const http=require("http");
const { error } = require("console");
const server=http.createServer(app);
const{initMeetingServer}=require("./meeting-server");
const {Meeting}=require("./models/meeting.model");


initMeetingServer(server);

mongoose.Promise=global.Promise;
mongoose.connect(MONGO_DB_CONFIG)
.then(()=>{
    console.log("Database Connected");
},(error) =>{
    console.log(`Error in connecting to the database ${error}`);
});

app.use(express.json());
app.use("/api",require("./routes/app.routes"));
app.get('/joinMeeting', (req, res) => {
    const { id } = req.query; // Extract the meeting ID from the query parameters

    // Find the meeting by ID in the database using Mongoose
    Meeting.findOne({ id: id })
        .then(meeting => {
            if (meeting) {
                res.status(200).json({ message: "Successfully joined the meeting", meeting });
            } else {
                res.status(404).json({ message: "Meeting not found" });
            }
        })
        .catch(err => {
            console.error("Error finding meeting:", err);
            res.status(500).json({ message: "Internal server error" });
        });
});
server.listen(process.env.PORT || 52390, '0.0.0.0', function() {
    console.log("Server is running and accessible from any device in the network");
});




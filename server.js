require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        service: "MediFly Backend",
        status: "ONLINE",
        timestamp: new Date().toISOString()
    });

});


// Emergency endpoint
app.post("/api/emergencies", (req, res) => {

    const {
        patientId,
        latitude,
        longitude,
        symptoms
    } = req.body;

    if (!patientId || !symptoms) {

        return res.status(400).json({
            success: false,
            message: "Patient ID and symptoms are required."
        });

    }

    const emergency = {

        id: "MF-" + Date.now(),

        patientId,

        location: {
            latitude,
            longitude
        },

        symptoms,

        status: "RECEIVED",

        priority: "PENDING_HUMAN_REVIEW",

        createdAt: new Date().toISOString()

    };


    // Broadcast emergency to authorized dashboard clients
    io.emit("emergency.created", emergency);


    res.status(201).json({
        success: true,
        emergency
    });

});


// Get dashboard summary
app.get("/api/dashboard", (req, res) => {

    res.json({

        activeEmergencies: 12,

        critical: 4,

        high: 5,

        moderate: 2,

        low: 1,

        availableDrones: 3,

        availableAmbulances: 7,

        availableResponseTeams: 26

    });

});


// Assignment endpoint
app.post("/api/assign-response", (req, res) => {

    const {
        emergencyId,
        mode
    } = req.body;


    if (!emergencyId || !mode) {

        return res.status(400).json({
            success: false,
            message: "Emergency ID and response mode are required."
        });

    }


    const assignment = {

        emergencyId,

        mode,

        drone:
            mode === "drone" || mode === "both"
                ? "DR-04"
                : null,

        ambulance:
            mode === "ambulance" || mode === "both"
                ? "AMB-12"
                : null,

        responseTeam: "TEAM-08",

        status: "ASSIGNED",

        assignedAt: new Date().toISOString()

    };


    io.emit("response.assigned", assignment);


    res.json({
        success: true,
        assignment
    });

});


// Real-time connection
io.on("connection", socket => {

    console.log("Dashboard connected:", socket.id);

    socket.on("disconnect", () => {

        console.log("Dashboard disconnected:", socket.id);

    });

});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(
        `MediFly backend running at http://localhost:${PORT}`
    );

});


Start it:

npm run dev


You should see:

MediFly backend running at http://localhost:5000


Then open:

http://localhost:5000/api/health


You should get:

{
  "success": true,
  "service": "MediFly Backend",
  "status": "ONLINE"
}

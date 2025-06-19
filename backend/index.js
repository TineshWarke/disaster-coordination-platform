const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const disasterRoutes = require('./routes/disasters');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(express.json());

app.use('/disasters', disasterRoutes);

// WebSocket events
app.use((req, res, next) => {
    req.io = io; // Attach to every request
    next();
});

io.on('connection', (socket) => {
    console.log('WebSocket client connected');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

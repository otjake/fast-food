const app = require('./app');
require('dotenv').config();

const mongoose = require('./config/db');
//This line creates an HTTP server using Node.js's built-in http module
const server = require('http').createServer(app)
//for real time communication
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
const start = async () => {
    try {
        await mongoose()
            .then(() => {
                console.log('Connected to Database');
                io.on('connection', (socket) => {
                    console.log('user connected',socket);
                    socket.on('disconnect', function () {
                        console.log('user disconnected');
                    });
                })

                server.listen(PORT, () => {
                    console.log(`Server running on http://localhost:${PORT}`);
                });
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
                process.exit(1); // Exit process if unable to connect
            });
    } catch (error){
        console.log(error)
    }
}

start().then(r => console.log("Server started successfully")).catch(e => console.error("Error starting server:", e));
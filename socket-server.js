const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.get('/', (req, res) => {
  res.send("<h1>Server up and running on http://localhost:" + port + " </h1>");
});

app.get("/chat",(req,res)=>{
  res.sendFile(__dirname + "/app.js");
});
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send-message', (msg) => {
    console.log('Received message:', msg);
    socket.broadcast.emit('chat-message', msg); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log('Server is running on http://localhost:' + port);
});



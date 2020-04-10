var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
        // "serve": "node --require source-map-support/register server.js"
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
const players = {};
io.on('connection', (socket) => {


  //currently limited to 2 players
  if (Object.keys(players).length >= 2) {
    console.log('At max capacity.');
    socket.disconnect()
  } else {
    players[socket.id] = Object.keys(players).length === 0 ? {
      id: socket.id,
      team: 'red',
      x: 10,
      y: 290
    } : {
      id: socket.id,
      team: 'blue',
      x: 590,
      y: 290
    }
    console.log('a user connected. Total users: ', Object.keys(players).length);
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);
    socket.on('disconnect', () => {
      delete players[socket.id];
      console.log('user disconnected. Total users: ', Object.keys(players).length);
      io.emit('disconnect', socket.id)
    });
  }
});

server.listen(8081, () => {
  console.log(`Listening on ${server.address().port}`);
});
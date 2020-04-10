import express from 'express';
import http from 'http'
import sio from 'socket.io'
import cors from 'cors'

import GameServerManger from './GameServerManager';

const app = express();
const server = http.createServer(app)
const io = sio.listen(server, { origins: '*:*' });
const port = 8081

app.use(cors())
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

new GameServerManger(io)

server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
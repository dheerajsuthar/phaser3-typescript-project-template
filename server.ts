import express from 'express';
import http from 'http'
import sio from 'socket.io'
import cors from 'cors'

import { ioEventHandler, gameLoop } from './GameServerManager';
import { BulletInfo, PlayerInfo, IOStates } from './src/Contract';
import { GAME_WIDTH, GAME_HEIGHT } from './src/config';

const app = express();
const server = http.createServer(app)
const io = sio.listen(server, { origins: '*:*' });
const port = 8081

app.use(cors())
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const bullets: Array<BulletInfo> = []
const players: {
    [id: string]: PlayerInfo
} = {}

ioEventHandler(io, players, bullets)

//Game Loop
setInterval(() => gameLoop(io, bullets), 16);


server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
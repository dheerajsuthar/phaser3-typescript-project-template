import { IOStates, PlayerInfo, PlayerTypes, BulletInfo } from './src/Contract'
import { GAME_WIDTH, GAME_HEIGHT } from './src/config'

export function gameLoop(io: SocketIO.Server, bullets: Array<BulletInfo>) {

    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i]
        b.x += b.speedX
        b.y += b.speedY

        if (b.x < -10 || b.x > GAME_WIDTH + 10 || b.y < -10 || b.y > GAME_HEIGHT + 10) {
            bullets.splice(i, 1)
            i--
        }
    }

    io.emit(IOStates.BULLETS_UPDATE, bullets)
}

export function ioEventHandler(io: SocketIO.Server, players: {
    [id: string]: PlayerInfo
}, bullets: Array<BulletInfo>) {

    const { CONNECTION, DISCONNECT, NEW_PLAYER, CURRENT_PLAYERS, PLAYER_MOVEMENT, PLAYER_MOVED, PLAYER_FIRED_BULLET, BULLETS_UPDATE } = IOStates
    io.on(CONNECTION, (socket: SocketIO.Socket) => {
        const { id } = socket
        //currently limited to 2 players
        addPlayer(socket)
        socket.emit(CURRENT_PLAYERS, players);
        socket.broadcast.emit(NEW_PLAYER, players[id]);

        //handlers
        socket.on(PLAYER_MOVEMENT, (playerInfo: PlayerInfo) => {
            players[id] = { ...players[id], ...playerInfo }
            socket.broadcast.emit(PLAYER_MOVED, players[id])
        })

        socket.on(PLAYER_FIRED_BULLET, (playerInfo: PlayerInfo) => {

            // player ain't anymore
            if (players[socket.id] === undefined) return;

            let { id, team, x, y, rotation } = playerInfo
            if (team === PlayerTypes.RED) {
                rotation += Math.PI
            }
            const BULLET_SPEED = 20
            const speedX = Math.cos(rotation) * BULLET_SPEED
            const speedY = Math.sin(rotation) * BULLET_SPEED
            bullets.push({
                id,
                team,
                x,
                y,
                speedX,
                speedY
            })

        })

        socket.on(DISCONNECT, () => {
            removePlayer(socket)
            io.emit(DISCONNECT, socket.id)
        });
    });




    function addPlayer(socket: SocketIO.Socket) {
        const { id } = socket
        if (Object.keys(players).length >= 2) {
            console.log('At max capacity.');
            socket.disconnect()
        } else {
            const playerIds = Object.keys(players)
            if (playerIds.length === 0) {
                players[id] = getDefaultBluePlayer(id)
            } else {
                const { team } = players[playerIds[0]]
                players[id] = (team === PlayerTypes.BLUE) ? getDefaultRedPlayer(id) : getDefaultBluePlayer(id)
            }

            console.log('a user connected. Total users: ', Object.keys(players).length);
        }
    }

    function getDefaultRedPlayer(id: string): PlayerInfo {
        return {
            id,
            team: PlayerTypes.RED,
            x: 590,
            y: 290,
            rotation: 0
        };
    }

    function getDefaultBluePlayer(id: string): PlayerInfo {
        return {
            id,
            team: PlayerTypes.BLUE,
            x: 10,
            y: 290,
            rotation: 0
        };
    }

    function removePlayer({ id }: SocketIO.Socket) {
        delete players[id];
        console.log('user disconnected. Total users: ', Object.keys(players).length);
    }
}
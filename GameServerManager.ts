import { IOStates, PlayerInfo, PlayerTypes } from './src/Contract'
export default class GameServerManger {
    _players: {
        [id: string]: PlayerInfo
    } = {}


    constructor(io: SocketIO.Server) {
        const { CONNECTION, DISCONNECT, NEW_PLAYER, CURRENT_PLAYERS, PLAYER_MOVEMENT, PLAYER_MOVED } = IOStates
        io.on(CONNECTION, (socket: SocketIO.Socket) => {
            const { id } = socket
            //currently limited to 2 players
            this._addPlayer(socket)
            socket.emit(CURRENT_PLAYERS, this._players);
            socket.broadcast.emit(NEW_PLAYER, this._players[id]);

            //handlers
            socket.on(PLAYER_MOVEMENT, (playerInfo: PlayerInfo) => {
                this._players[id] = { ...this._players[id], ...playerInfo }
                socket.broadcast.emit(PLAYER_MOVED, this._players[id])
            })

            socket.on(DISCONNECT, () => {
                this._removePlayer(socket)
                io.emit(DISCONNECT, socket.id)
            });
        });
    }


    _addPlayer(socket: SocketIO.Socket) {
        const { id } = socket
        if (Object.keys(this._players).length >= 2) {
            console.log('At max capacity.');
            socket.disconnect()
        } else {
            const playerIds = Object.keys(this._players)
            if (playerIds.length === 0) {
                this._players[id] = {
                    id,
                    team: PlayerTypes.RED,
                    x: 10,
                    y: 290
                }
            } else {
                const { team } = this._players[playerIds[0]]
                this._players[id] = (team === PlayerTypes.BLUE) ? {
                    id,
                    team: PlayerTypes.RED,
                    x: 10,
                    y: 290
                } : {
                        id,
                        team: PlayerTypes.BLUE,
                        x: 590,
                        y: 290
                    }
            }

            console.log('a user connected. Total users: ', Object.keys(this._players).length);
        }
    }

    _removePlayer({ id }: SocketIO.Socket) {
        delete this._players[id];
        console.log('user disconnected. Total users: ', Object.keys(this._players).length);
    }
}
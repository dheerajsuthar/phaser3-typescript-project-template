import { IOStates, PlayerInfo, PlayerTypes } from './Contract'
import Main from './scenes/Main'
import Player from './scenes/entities/Player'

export default class GameClientManger {
    _socket: SocketIOClient.Socket
    _scene: Main

    constructor(scene: Main, socket: SocketIOClient.Socket) {
        this._scene = scene
        this._socket = socket
        this.socketSetup()
    }

    socketSetup() {
        const { CURRENT_PLAYERS, DISCONNECT, NEW_PLAYER, PLAYER_MOVED } = IOStates
        this._scene.otherPlayers = this._scene.physics.add.group()
        this._socket.on(CURRENT_PLAYERS, (players: Object) => {
            Object.keys(players).forEach((id) => {
                if (players[id].id === this._socket.id) {
                    this._scene.addOwnPlayer(players[id]);
                } else {
                    this._scene.addOtherPlayer(players[id]);
                }
            })
        })
        this._socket.on(NEW_PLAYER, (playerInfo: PlayerInfo) => {
            this._scene.addOtherPlayer(playerInfo)
        })
        this._socket.on(PLAYER_MOVED, ({ id, x, y }: PlayerInfo) => {
            const movedPlayer = <Player>this._scene.otherPlayers.getChildren().find((c) => (c as Player).id === id)
            movedPlayer.setPosition(x, y)
        })
        this._socket.on(DISCONNECT, (id: string) => {
            const disconnectedPlayer = this._scene.otherPlayers.getChildren().find((c) => (c as Player).id === id)
            if (disconnectedPlayer)
                disconnectedPlayer.destroy()
        })
    }

    sendToServer(command: string, playerInfo: PlayerInfo) {
        this._socket.emit(command, playerInfo)
    }
}

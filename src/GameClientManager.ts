import { IOStates, PlayerInfo, PlayerTypes, BulletInfo, KilledPlayerInfo } from './Contract'
import Main, { PLAYER_1_BULLET, PLAYER_2_BULLET } from './scenes/Main'
import Player from './scenes/entities/Player'
import Bullet from './scenes/entities/Bullet'
import { GAME_STATUS } from './config'

export default class GameClientManger {
    _socket: SocketIOClient.Socket
    _scene: Main

    constructor(scene: Main, socket: SocketIOClient.Socket) {
        this._scene = scene
        this._socket = socket
        this.socketSetup()
    }

    socketSetup() {
        const { CURRENT_PLAYERS, DISCONNECT, NEW_PLAYER, PLAYER_MOVED, BULLETS_UPDATE, PLAYER_KILLED } = IOStates
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
        this._socket.on(PLAYER_MOVED, ({ id, x, y, rotation }: PlayerInfo) => {
            const movedPlayer = <Player>this._scene.otherPlayers.getChildren().find((c) => (c as Player).id === id)
            movedPlayer.setPosition(x, y, rotation)
        })
        this._socket.on(BULLETS_UPDATE, (serverBullets: Array<BulletInfo>) => {
            const { bullets } = this._scene
            serverBullets.forEach((b, i) => {
                if (bullets[i] === undefined) {
                    const texture = b.team == PlayerTypes.BLUE ? PLAYER_1_BULLET : PLAYER_2_BULLET
                    bullets[i] = new Bullet(this._scene, b.x, b.y, texture)
                } else {
                    bullets[i].x = b.x
                    bullets[i].y = b.y
                }
            })

            for (let index = serverBullets.length; index < bullets.length; index++) {
                bullets[index].destroy()
                bullets.splice(index, 1)
                index--
            }

        })
        this._socket.on(PLAYER_KILLED, ({ id, team }: KilledPlayerInfo) => {
            console.log('received player killed', id);
            this._socket.disconnect()

            let killedPlayer: Player
            let status: GAME_STATUS
            if (id === this._scene._playerOne.id) {
                killedPlayer = this._scene._playerOne
                status = GAME_STATUS.LOST
            } else {
                killedPlayer = <Player>this._scene.otherPlayers.getChildren().find((c) => (c as Player).id === id)
                status = GAME_STATUS.WON
            }
            killedPlayer.disableInteractive()
            killedPlayer.setTint(0xff0000).setAlpha(0.5)
            setTimeout(() => {
                this.cleanup()
                this._scene.scene.start('credit', { status })
            }, 2000)
        })
        this._socket.on(DISCONNECT, (id: string) => {
            if (id === this._scene._playerOne.id) {
                this.cleanup()
                this._scene.scene.start('menu', { status: GAME_STATUS.DISCONNECTED })
            }
            const disconnectedPlayer = this._scene.otherPlayers.getChildren().find((c) => (c as Player).id === id)
            if (disconnectedPlayer)
                disconnectedPlayer.destroy()
        })
    }

    private cleanup() {
        this._scene._playerOne.destroy()
        this._scene.otherPlayers.destroy(true)
        this._scene.bullets.forEach(b => b.destroy())
        this._scene._gameClientManager = null

        this._scene._playerOne = null
        this._scene._otherPlayers = null
    }

    sendToServer(command: string, playerInfo: PlayerInfo) {
        this._socket.emit(command, playerInfo)
    }
}

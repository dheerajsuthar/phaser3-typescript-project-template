import { GAME_HEIGHT, GAME_WIDTH } from '../config'
import Player from './entities/Player'
import { PlayerInfo, PlayerTypes } from '../Contract'
import TileMap from './tilemap/TileMap'
import { IOStates } from '../Contract'


const IMAGE_PATH = 'assets/sprites/'
const TILESET_1 = 'tileset_1'
const TILEMAP_1 = 'tilemap_1'
const LAYER_1 = 'layer_1'
const PLAYER_1 = 'player_1'
const PLAYER_2 = 'player_2'
const PLAYER_1_BULLET = 'player_1_bullet'
const PLAYER_2_BULLET = 'player_2_bullet'
const TILEMAP_PATH = 'assets/tilemaps/'
export default class Main extends Phaser.Scene {
    _tileMap: TileMap
    _playerOne: Player
    _otherPlayers: Phaser.Physics.Arcade.Group
    _entities: Array<Phaser.GameObjects.GameObject>
    _socket: SocketIOClient.Socket
    constructor() {
        super('main')
    }

    debug() {
        const debugGraphics = this.add.graphics().setAlpha(0.75)
        this._tileMap.mainLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        })
    }
    preload() {
        this.load.path = IMAGE_PATH
        this.load.image(TILESET_1, 'tileset_1.png')
        this.load.image(PLAYER_1, 'player_1.png')
        this.load.image(PLAYER_2, 'player_2.png')
        this.load.image(PLAYER_1_BULLET, 'player_1_bullet.png')
        this.load.image(PLAYER_2_BULLET, 'player_2_bullet.png')

        this.load.path = TILEMAP_PATH
        this.load.tilemapTiledJSON(TILEMAP_1, 'tilemap_1.json')
    }

    addPlayer(playerInfo: PlayerInfo): Player {
        let player: Player
        const { id, team, x, y } = playerInfo
        console.log(team, PlayerTypes.BLUE)
        if (team === PlayerTypes.BLUE) {
            player = new Player(this, id, x, y, PLAYER_1, PLAYER_1_BULLET)
        } else {
            player = new Player(this, id, x, y, PLAYER_2, PLAYER_2_BULLET)
        }

        this._entities.push(player)

        this.physics.add.collider(player, this._tileMap._mainLayer)
        this.physics.add.collider(player._gun, this._tileMap.mainLayer, player.removeBullet)

        return player
    }

    addOwnPlayer(playerInfo: PlayerInfo) {
        console.log('Adding own player: ', playerInfo);

        this._playerOne = this.addPlayer(playerInfo)
    }

    addOtherPlayer(playerInfo: PlayerInfo) {
        console.log('Adding other player: ', playerInfo);

        this._otherPlayers.add(this.addPlayer(playerInfo))
    }

    socketSetup() {
        const { CURRENT_PLAYERS, DISCONNECT, NEW_PLAYER } = IOStates
        this._otherPlayers = this.physics.add.group()
        this._socket.on(CURRENT_PLAYERS, (players: Object) => {
            Object.keys(players).forEach((id) => {
                if (players[id].id === this._socket.id) {
                    this.addOwnPlayer(players[id]);
                } else {
                    this.addOtherPlayer(players[id]);
                }
            })
        })
        this._socket.on(NEW_PLAYER, (playerInfo: PlayerInfo) => {
            this.addOtherPlayer(playerInfo)
        })
        this._socket.on(DISCONNECT, (id: string) => {
            const disconnectedPlayer = this._otherPlayers.getChildren().find((c) => (c as Player).id === id)
            if (disconnectedPlayer)
                disconnectedPlayer.destroy()
        })
    }

    create() {
        this._tileMap = new TileMap(this, TILEMAP_1, TILESET_1, TILESET_1, LAYER_1)
        this._entities = new Array<Phaser.GameObjects.GameObject>()

        //socket io connection
        this._socket = io()
        this.socketSetup();


        //debug
        this.debug()

        // create entitities

    }

    update() {
        if (this._playerOne)
            this._playerOne.update()
    }
}

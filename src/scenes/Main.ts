import { GAME_HEIGHT, GAME_WIDTH } from '../config'
import Player from './entities/Player'
import TileMap from './tilemap/TileMap'
import { GameObjects } from 'phaser'


const IMAGE_PATH = 'assets/sprites/'
const TILESET_1 = 'tileset_1'
const TILEMAP_1 = 'tilemap_1'
const LAYER_1 = 'layer_1'
const PLAYER_1 = 'player_1'
const PLAYER_1_BULLET = 'bullet'
const TILEMAP_PATH = 'assets/tilemaps/'
export default class Main extends Phaser.Scene {
    _tileMap: TileMap
    _playerOne: Player
    _entities: Array<Phaser.GameObjects.GameObject>

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

        this.load.image(PLAYER_1_BULLET, 'player_1_bullet.png')

        this.load.path = TILEMAP_PATH
        this.load.tilemapTiledJSON(TILEMAP_1, 'tilemap_1.json')
    }
    create() {
        this._tileMap = new TileMap(this, TILEMAP_1, TILESET_1, TILESET_1, LAYER_1)

        this.physics
        //debug
        this.debug()

        // create entitities
        this._entities = new Array<Phaser.GameObjects.GameObject>()
        this._playerOne = new Player(this, 0, 280, PLAYER_1, PLAYER_1_BULLET)
        this._entities.push(this._playerOne)

        this.physics.add.collider(this._playerOne, this._tileMap._mainLayer)
        this.physics.add.collider(this._playerOne._gun, this._tileMap.mainLayer, this._playerOne.removeBullet)
    }

    update() {
        this._entities.forEach(e => e.update())
    }
}

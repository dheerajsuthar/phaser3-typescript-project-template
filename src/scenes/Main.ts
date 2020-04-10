import { GAME_HEIGHT, GAME_WIDTH } from '../config'
import BulletGroup from './groups/BulletGroup'


export default class Main extends Phaser.Scene {
    playerOne: Phaser.Physics.Arcade.Image
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    bgForPlayerOne: BulletGroup
    constructor() {
        super('main')
    }

    preload() {
        this.load.path = 'assets/sprites/'
        this.load.image('tileset_1', 'tileset_1.png')
        this.load.image('player_1', 'player_1.png')

        this.load.image('bullet', 'player_1_bullet.png')

        this.load.path = 'assets/tilemaps/'
        this.load.tilemapTiledJSON('tilemap_1', 'tilemap_1.json')
    }
    create() {
        const map = this.make.tilemap({ key: 'tilemap_1' })
        const tileSet = map.addTilesetImage('tileset_1', 'tileset_1')
        const mainLayer = map.createStaticLayer('layer_1', tileSet, 0, 0)
        mainLayer.setCollisionByProperty({ 'collision': true })
        const debugGraphics = this.add.graphics().setAlpha(0.75)
        mainLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        })
        // Set up the arrows to control the camera
        this.cursors = this.input.keyboard.createCursorKeys()
        this.playerOne = this.physics.add.image(0, 280, 'player_1')
        this.playerOne.setCollideWorldBounds(true)

        this.bgForPlayerOne = new BulletGroup(this)
        this.physics.add.collider(this.playerOne, mainLayer)
    }

    update() {
        let { body: playerOneBody } = this.playerOne
        playerOneBody = playerOneBody as Phaser.Physics.Arcade.Body

        // TODO: experiment with acceleration and remove diagonal movement
        const speed = 200

        if (this.cursors.space.isDown) {
            this.bgForPlayerOne.fireBullets(this.playerOne.x, this.playerOne.y)
        }
        if (this.cursors.left.isDown) {
            this.playerOne.setVelocityX(-speed)
        } else if (this.cursors.right.isDown) {
            this.playerOne.setVelocityX(speed)
        } else {
            this.playerOne.setVelocityX(0)
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.playerOne.setVelocityY(-speed)
        } else if (this.cursors.down.isDown) {
            this.playerOne.setVelocityY(speed)
        } else {
            this.playerOne.setVelocityY(0)
        }

        // update bullets
        this.bgForPlayerOne.getChildren().forEach(c => c.update())


    }
}

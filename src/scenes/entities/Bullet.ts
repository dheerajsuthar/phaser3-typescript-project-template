import { GAME_HEIGHT, GAME_WIDTH } from '../../config'

export default class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        this.register()
    }

    register() {
        this.scene.physics.add.existing(this)
        this.scene.add.existing(this)
    }
}
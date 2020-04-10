import { GAME_HEIGHT, GAME_WIDTH } from '../../config'

export default class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
    }
    fire(x: number, y: number) {
        this.body.reset(x, y)
        this.setActive(true)
        this.setVisible(true)
        this.setVelocityX(200)
    }

    update() {
        super.update()

        if (this.y < 0 || this.x < 0 || this.y > GAME_HEIGHT || this.x > GAME_WIDTH) {
            this.remove()
        }
    }

    remove() {
        this.setActive(false);
        this.setVisible(false);
    }

}
import Bullet from '../entities/Bullet'
export default class BulletGroup extends Phaser.Physics.Arcade.Group {
    nextShotAt: number
    delay: number
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene)
        this.createMultiple(
            {
                classType: Bullet,
                frameQuantity: 30,
                active: false,
                visible: false,
                key: 'bullet'
            }
        )
        this.nextShotAt = 0
        this.delay = 500
    }
    fireBullets(x: number, y: number) {
        if (this.scene.time.now > this.nextShotAt) {
            const bullet = this.getFirstDead(false)
            if (bullet) {
                bullet.fire(x, y)
            }
            this.nextShotAt = this.scene.time.now + this.delay
        }
    }

}
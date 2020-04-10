export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
    nextShotAt: number
    delay: number
    constructor(scene: Phaser.Scene,
        ammoType: Function,
        ammoTexture: string,
        ammoSize: number = 30,
        ammoDelay: number = 200) {
        super(scene.physics.world, scene)
        this.createMultiple(
            {
                classType: ammoType,
                frameQuantity: ammoSize,
                active: false,
                visible: false,
                key: ammoTexture
            }
        )
        this.nextShotAt = 0
        this.delay = ammoDelay
    }
    fire(x: number, y: number) {
        if (this.scene.time.now > this.nextShotAt) {
            const ammo = this.getFirstDead(false)
            if (ammo) {
                ammo.fire(x, y)
            }
            this.nextShotAt = this.scene.time.now + this.delay
        }
    }

}
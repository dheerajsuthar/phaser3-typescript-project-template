import WeaponGroup from '../groups/WeaponGroup'
import Bullet from './Bullet'

export default class Player extends Phaser.Physics.Arcade.Image {
    _cursor: Phaser.Types.Input.Keyboard.CursorKeys
    _gun: WeaponGroup
    _speed: number

    register(scene: Phaser.Scene) {
        scene.physics.add.existing(this)
        scene.add.existing(this)
    }

    removeBullet(bullet: Bullet, _: any) {
        bullet.remove()
    }

    constructor(scene: Phaser.Scene, x: number, y: number, playerTexture: string, bulletTexture: string) {
        super(scene, x, y, playerTexture)

        this.register(scene);

        this._cursor = scene.input.keyboard.createCursorKeys()
        this._speed = 200

        this._gun = new WeaponGroup(scene, Bullet, bulletTexture)
        this.setCollideWorldBounds(true)
    }

    get bulletGroup() {
        return this._gun
    }

    update() {
        super.update()

        if (this._cursor.space.isDown) {
            this._gun.fire(this.x, this.y)
        }
        if (this._cursor.left.isDown) {
            this.setVelocityX(-this._speed)
        } else if (this._cursor.right.isDown) {
            this.setVelocityX(this._speed)
        } else {
            this.setVelocityX(0)
        }

        // Vertical movement
        if (this._cursor.up.isDown) {
            this.setVelocityY(-this._speed)
        } else if (this._cursor.down.isDown) {
            this.setVelocityY(this._speed)
        } else {
            this.setVelocityY(0)
        }

        // update bullets
        this._gun.getChildren().forEach(c => c.update())

    }
}
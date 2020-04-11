import WeaponGroup from '../groups/WeaponGroup'
import Bullet from './Bullet'
import Main from '../Main'
import { PlayerTypes, IOStates } from '../../Contract'



export default class Player extends Phaser.Physics.Arcade.Image {
    _cursor: Phaser.Types.Input.Keyboard.CursorKeys
    _gun: WeaponGroup
    _speed: number
    _id: string
    _team: keyof typeof PlayerTypes
    _lastPosition: {
        x: number,
        y: number
    }
    _scene: Main

    get id() {
        return this._id
    }

    get bulletGroup() {
        return this._gun
    }

    register() {
        this._scene.physics.add.existing(this)
        this._scene.add.existing(this)
    }

    removeBullet(bullet: Bullet, _: any) {
        bullet.remove()
    }

    constructor(scene: Main, id: string, team: keyof typeof PlayerTypes, x: number, y: number, playerTexture: string, bulletTexture: string) {
        super(scene, x, y, playerTexture)
        this._id = id
        this._scene = scene
        this._team = team
        this._lastPosition = {
            x,
            y
        }

        this._cursor = scene.input.keyboard.createCursorKeys()
        this._speed = 200

        this._gun = new WeaponGroup(scene, Bullet, bulletTexture)

        this.register()
        this.setCollideWorldBounds(true)
    }

    updateLastPosition() {
        if (this._lastPosition.x !== this.x || this._lastPosition.y !== this.y) {
            const { gameClientManager } = this._scene
            gameClientManager.sendToServer(IOStates.PLAYER_MOVEMENT, { id: this._id, team: this._team, ...this._lastPosition })
            this._lastPosition = {
                x: this.x,
                y: this.y
            }
        }
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

        // update last position
        this.updateLastPosition()

    }
}
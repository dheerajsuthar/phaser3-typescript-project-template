import Main from '../Main'
import { PlayerTypes, IOStates } from '../../Contract'



export default class Player extends Phaser.Physics.Arcade.Image {
    _cursor: Phaser.Types.Input.Keyboard.CursorKeys
    _speed: number
    _id: string
    _team: keyof typeof PlayerTypes
    _lastPosition: {
        x: number,
        y: number
    }
    _scene: Main
    _bulletFired: boolean = false

    get id() {
        return this._id
    }

    register() {
        this._scene.physics.add.existing(this)
        this._scene.add.existing(this)
    }

    constructor(scene: Main, id: string, team: keyof typeof PlayerTypes, x: number, y: number, playerTexture: string) {
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

        this.register()
        this.setCollideWorldBounds(true)
    }

    updateLastPosition() {
        if (this._lastPosition.x !== this.x || this._lastPosition.y !== this.y) {
            const { gameClientManager } = this._scene
            gameClientManager.sendToServer(IOStates.PLAYER_MOVEMENT, {
                id: this._id, team: this._team, x: this.x, y: this.y, rotation: this.rotation
            })
            this._lastPosition = {
                x: this.x,
                y: this.y
            }
        }
    }

    updateMovement() {
        const { _team } = this
        if (this._cursor.left.isDown) {
            this.rotation = _team === "BLUE" ? Math.PI : 0
            this.setVelocityX(-this._speed)
        } else if (this._cursor.right.isDown) {
            this.rotation = _team === "BLUE" ? 0 : Math.PI
            this.setVelocityX(this._speed)
        } else if (this._cursor.up.isDown) {
            this.rotation = _team === "BLUE" ? -Math.PI / 2 : Math.PI / 2
            this.setVelocityY(-this._speed)
        } else if (this._cursor.down.isDown) {
            this.rotation = _team === "BLUE" ? Math.PI / 2 : -Math.PI / 2
            this.setVelocityY(this._speed)
        } else {
            this.setVelocity(0, 0)
        }
    }

    update() {
        super.update()

        //disallow diagonal movment
        if (
            this._cursor.up.isDown && this._cursor.left.isDown
            || this._cursor.up.isDown && this._cursor.right.isDown
            || this._cursor.down.isDown && this._cursor.left.isDown
            || this._cursor.down.isDown && this._cursor.right.isDown
        ) {
            return;
        }

        this.updateMovement()

        if (!this._bulletFired && this._cursor.space.isDown) {
            this._bulletFired = true
            const { _id, x, y, rotation, _team } = this
            this._scene._gameClientManager.sendToServer(IOStates.PLAYER_FIRED_BULLET, {
                x,
                y,
                rotation,
                id: _id,
                team: _team
            })
        } 

        if(!this._cursor.space.isDown) {
            this._bulletFired = false
        }

        this.updateLastPosition()

    }
}
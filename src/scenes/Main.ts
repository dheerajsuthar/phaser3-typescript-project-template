import { GAME_HEIGHT, GAME_WIDTH } from '../config'

export default class Main extends Phaser.Scene {
    constructor() {
        super('main')
    }

    create() {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Main')
    }
}

import { GAME_HEIGHT, GAME_WIDTH } from '../config'

export default class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }

    preload() {
        this.load.bitmapFont('mainFont', 'assets/fonts/main.png',
            'assets/fonts/main.xml')
    }

    create() {
        this.add.bitmapText(GAME_WIDTH / 2 - 4 * 48, GAME_HEIGHT / 2 - 200, 'mainFont', 'Tank War', 48, 0)
        // TODO: Add loader later
        // this.add.bitmapText(GAME_WIDTH / 2 - 6 * 16, GAME_HEIGHT / 2, 'mainFont', 'Loading ...', 16, 0)
        setTimeout(() => {
            this.scene.start('main')
        }, 3000);
    }
}
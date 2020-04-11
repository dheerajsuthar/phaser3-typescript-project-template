import { GAME_HEIGHT, GAME_WIDTH, GAME_STATUS } from '../config'

export default class Credit extends Phaser.Scene {
    _statusText = ''
    _title = 'GAME OVER'
    _startText = 'BACK TO MAIN MENU'
    init(data: { [key: string]: any }) {
        this._statusText = data.status === GAME_STATUS.WON ? 'YOU WON' : 'YOU LOST'
    }
    constructor() {
        super('credit');
    }

    preload() {
        this.load.bitmapFont('mainFont', 'assets/fonts/main.png',
            'assets/fonts/main.xml')
    }

    create() {
        const { _startText, _statusText, _title } = this
        this.add.bitmapText(GAME_WIDTH / 2 - (_title.length / 2) * 48, GAME_HEIGHT / 2 - 200, 'mainFont', _title, 48, 0)
        _statusText && this.add.bitmapText(GAME_WIDTH / 2 - (_statusText.length / 2) * 32, GAME_HEIGHT / 2 - 100, 'mainFont', this._statusText, 32, 0)
        this.add.bitmapText(GAME_WIDTH / 2 - (_startText.length / 2) * 16, GAME_HEIGHT / 2, 'mainFont', _startText, 16, 0).setInteractive()
            .on('pointerdown', () => {
                this.scene.start('menu')
            })
    }
}
import { GAME_HEIGHT, GAME_WIDTH, GAME_STATUS } from '../config'

export default class Menu extends Phaser.Scene {
    _statusText = ''
    _startText = 'START'
    _title = 'CYBER WAR'
    constructor() {
        super('menu');
    }

    init(data: { [key: string]: any }) {
        if (data.status === GAME_STATUS.DISCONNECTED) {
            this._statusText = 'You got disconnected. Click Start to join again.'
        }
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
                this.scene.start('main')
            })
    }
}
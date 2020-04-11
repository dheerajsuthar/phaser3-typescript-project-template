import 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config'
import Main from './scenes/Main'
import Menu from './scenes/Menu'
import Credit from './scenes/Credit';

export const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [Menu, Main, Credit],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    }
};

const game = new Phaser.Game(config);


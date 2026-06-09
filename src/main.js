import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1100,
    height: 700,
    backgroundColor: '#87CEEB',
    scene: [MainMenuScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1100,
        height: 700
    }
};

new Phaser.Game(config);
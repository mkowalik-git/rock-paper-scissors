import GameScene from './scenes/GameScene.js';

// Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 360,
  parent: 'game-container', // Mount to the div in index.html
  backgroundColor: '#333',
  pixelArt: true, // Ensures sharp pixel look
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Initialize the Phaser game
const game = new Phaser.Game(config); 
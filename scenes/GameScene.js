// scenes/GameScene.js
// Rock, Paper, Scissors game using pixel art hand sprites
// Sprite sheet by Pixilart user (https://www.pixilart.com/art/rock-paper-scissors-sprite-sheet-17337d5382ed384)
// Attribution: See Pixilart page for artist credit and license

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load the hand sprite sheet (3 frames: 0=rock, 1=paper, 2=scissors)
    // Each frame is 64x64 pixels
    this.load.spritesheet('hands', 'assets/hands.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#333');
    this.add.text(80, 20, 'Choose:', {
      fontFamily: 'Press Start 2P',
      fontSize: '16px',
      color: '#fff',
      align: 'center',
      resolution: 2
    });

    // Define choices and frame mapping
    // The sprite sheet is 13 columns per row (832/64)
    // Row 0: Rock, Row 1: Paper, Row 2: Scissors
    // We'll use a different column (skin tone) for each gesture
    // Rock: col=0, Paper: col=1, Scissors: col=2
    // Frame index = row * 13 + col
    const columns = 13;
    const choices = [
      { key: 'rock', frame: 0 * columns + 0, x: 100 },      // row 0, col 0
      { key: 'paper', frame: 1 * columns + 1, x: 220 },     // row 1, col 1
      { key: 'scissors', frame: 2 * columns + 2, x: 340 }   // row 2, col 2
    ];
    this.choices = choices;
    this.choiceSprites = {};
    this.computerSprites = {};

    // Create player and computer hand sprites
    choices.forEach((choice) => {
      // Player's hand (clickable)
      const hand = this.add.sprite(choice.x, 200, 'hands', choice.frame)
        .setScale(2.5) // Scale up for pixel look
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      hand.on('pointerdown', () => {
        this.handlePlayerChoice(choice.key);
      });
      this.choiceSprites[choice.key] = hand;
      this.add.text(choice.x - 28, 270, choice.key.toUpperCase(), {
        fontFamily: 'Press Start 2P',
        fontSize: '8px',
        color: '#fff',
        resolution: 2
      });

      // Computer's hand (hidden initially)
      const compHand = this.add.sprite(choice.x, 80, 'hands', choice.frame)
        .setScale(2.5)
        .setOrigin(0.5)
        .setAlpha(0.2); // Dimmed until revealed
      this.computerSprites[choice.key] = compHand;
    });

    // Result text placeholder
    this.resultText = this.add.text(120, 280, '', {
      fontFamily: 'Press Start 2P',
      fontSize: '12px',
      color: '#fff',
      align: 'center',
      resolution: 2
    });
  }

  // Handle player selection, computer logic, and animations
  handlePlayerChoice(playerChoice) {
    // Disable input during round
    Object.values(this.choiceSprites).forEach(sprite => sprite.disableInteractive());

    // Animate player's choice (bounce)
    this.tweens.add({
      targets: this.choiceSprites[playerChoice],
      scaleY: 3.0,
      yoyo: true,
      duration: 120,
      repeat: 1
    });

    // Randomly select computer's choice
    const compChoice = Phaser.Utils.Array.GetRandom(this.choices).key;

    // Animate computer's choice (bounce and reveal)
    this.computerSprites[compChoice].setAlpha(1);
    this.tweens.add({
      targets: this.computerSprites[compChoice],
      scaleY: 3.0,
      yoyo: true,
      duration: 120,
      repeat: 1
    });

    // Hide other computer choices
    Object.keys(this.computerSprites).forEach(key => {
      if (key !== compChoice) {
        this.computerSprites[key].setAlpha(0.2);
      }
    });

    // Determine winner
    const result = this.getResult(playerChoice, compChoice);
    this.resultText.setText(`You: ${playerChoice.toUpperCase()}\nCPU: ${compChoice.toUpperCase()}\n${result}`);

    // Re-enable input after short delay
    this.time.delayedCall(900, () => {
      Object.values(this.choiceSprites).forEach(sprite => sprite.setInteractive({ useHandCursor: true }));
      // Reset computer sprites
      Object.values(this.computerSprites).forEach(sprite => sprite.setAlpha(0.2));
      this.resultText.setText('');
    });
  }

  // Determine winner logic
  getResult(player, cpu) {
    if (player === cpu) return 'DRAW!';
    if (
      (player === 'rock' && cpu === 'scissors') ||
      (player === 'paper' && cpu === 'rock') ||
      (player === 'scissors' && cpu === 'paper')
    ) {
      return 'YOU WIN!';
    }
    return 'CPU WINS!';
  }
} 
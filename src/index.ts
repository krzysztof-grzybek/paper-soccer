import 'phaser';
import 'phaser/plugins/fbinstant/src/FacebookInstantGamesPlugin';

import { MainScene } from './scenes/mainScene';

const config: GameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  parent: 'game',
  scene: MainScene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  }
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

FBInstant.initializeAsync().then(function() {
  const game = new Game(config);
});

import 'phaser';
/* tslint:disable:no-submodule-imports */
import 'phaser/plugins/fbinstant/src/FacebookInstantGamesPlugin';

import { MainScene } from './scenes/mainScene';

const config: GameConfig = {
  height: window.innerHeight,
  width: window.innerWidth,
  type: Phaser.AUTO,
  parent: 'game',
  scene: MainScene,
  physics: {
    arcade: {
      gravity: { y: 200 },
    },
    default: 'arcade',
  },
};

export class Game extends Phaser.Game {
  constructor(gameConfig: GameConfig) {
    super(gameConfig);
  }
}

FBInstant.initializeAsync().then(() => {
  const game = new Game(config);
});

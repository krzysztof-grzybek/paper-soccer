import 'phaser';
/* tslint:disable:no-submodule-imports */
import 'phaser/plugins/fbinstant/src/FacebookInstantGamesPlugin';

import io from 'socket.io-client';
import { MainScene } from './scenes/mainScene';

const config: GameConfig = {
  height: window.innerHeight,
  width: window.innerWidth,
  type: Phaser.AUTO,
  scene: MainScene,
  backgroundColor: '#fff',
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
  // const socket = io('https://localhost:3001');
});

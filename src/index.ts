import 'phaser';
/* tslint:disable:no-submodule-imports */
import 'phaser/plugins/fbinstant/src/FacebookInstantGamesPlugin';

import io from 'socket.io-client';
import { bootstrap } from './platformService';
import { GameEndScene } from './scenes/gameEndScene';
import { GameplayScene } from './scenes/gameplayScene';
import { LobbyScene } from './scenes/lobbyScene';
import { PreloaderScene } from './scenes/preloaderScene';
import { UiScene } from './scenes/uiScene';

const config: GameConfig = {
  height: window.innerHeight,
  width: window.innerWidth,
  type: Phaser.AUTO,
  scene: [PreloaderScene, GameplayScene, UiScene, GameEndScene, LobbyScene],
  backgroundColor: '#00d801',
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
  bootstrap();
  const game = new Game(config);
  const socket = io('https://localhost:3001');
});

import 'phaser';
/* tslint:disable:no-submodule-imports */
import 'phaser/plugins/fbinstant/src/FacebookInstantGamesPlugin';

import { GameEndScene } from './scenes/gameEndScene';
import { GameplayScene } from './scenes/gameplayScene';
import { LobbyScene } from './scenes/lobbyScene';
import { PreloaderScene } from './scenes/preloaderScene';
import { UiScene } from './scenes/uiScene';
import { serverProvider } from './serverPlugin';

const config: GameConfig = {
  height: window.innerHeight,
  width: window.innerWidth,
  type: Phaser.AUTO,
  scene: [PreloaderScene, GameplayScene, UiScene, GameEndScene, LobbyScene],
  backgroundColor: '#00d801',
  plugins: {
    global: [serverProvider],
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

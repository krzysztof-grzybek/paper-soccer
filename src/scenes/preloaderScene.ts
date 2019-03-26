import { socketService } from '../socketService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { LOBBY_SCENE_ID } from './lobbyScene';
import { UI_SCENE_ID } from './uiScene';
import {GAME_END_SCENE_ID} from "./gameEndScene";

const PRELOADER_SCENE_ID = 'PreloaderScene';

// TODO: remove facebook plugin calls in favor to platform plugin
class PreloaderScene extends Phaser.Scene {

  constructor() {
    super(PRELOADER_SCENE_ID);
  }

  public preload() {
    this.facebook.once('startgame', this.startGame, this);
    this.facebook.showLoadProgress(this);

    this.load.image('ball', './assets/ball.png');
  }

  private startGame() {
    if (this.facebook.contextType === 'THREAD') {
      socketService.init(this.facebook.contextID, this.facebook.playerID).then(game => {
        this.scene.start(UI_SCENE_ID);
        if (game.game.state === 'progress') {
          this.scene.start(GAMEPLAY_SCENE_ID, game);
        } else if (game.game.state === 'end') {
          this.scene.start(GAME_END_SCENE_ID, game);
        }

        this.scene.stop(PRELOADER_SCENE_ID);
      });
    } else {
      this.scene.start(LOBBY_SCENE_ID);
      this.scene.stop(PRELOADER_SCENE_ID);
    }
  }
}

export { PreloaderScene };

import { gameplayService } from '../gameplayService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { LOBBY_SCENE_ID } from './lobbyScene';
import { UI_SCENE_ID } from './uiScene';

const PRELOADER_SCENE_ID = 'PreloaderScene';

// TODO: remove facebook plugin calls in favor to platform plugin
class PreloaderScene extends Phaser.Scene {

  constructor() {
    super(PRELOADER_SCENE_ID);
  }

  public preload() {
    this.facebook.once('startgame', this.startGame, this);
    this.facebook.showLoadProgress(this);

    this.load.image('zero2', '/assets/gif_soccer_ball_0100.gif');
  }

  private startGame() {
    if (this.facebook.contextType === 'THREAD') {
      gameplayService.getGame(this.facebook.contextID).then(game => {
        this.scene.start(UI_SCENE_ID);
        this.scene.start(GAMEPLAY_SCENE_ID, game);
        this.scene.stop(PRELOADER_SCENE_ID);
      });
    } else {
      this.scene.start(UI_SCENE_ID);
      this.scene.start(LOBBY_SCENE_ID);
      this.scene.stop(PRELOADER_SCENE_ID);
    }
  }
}

export { PreloaderScene };

import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { UI_SCENE_ID } from './uiScene';

class PreloaderScene extends Phaser.Scene {

  constructor() {
    super('PreloaderScene');
  }

  public preload() {
    this.facebook.once('startgame', this.startGame, this);
    this.facebook.showLoadProgress(this);

    this.load.image('zero2', '/assets/gif_soccer_ball_0100.gif');
  }

  private startGame() {
    this.scene.start(UI_SCENE_ID);
    this.scene.start(GAMEPLAY_SCENE_ID);
  }

}

export { PreloaderScene };

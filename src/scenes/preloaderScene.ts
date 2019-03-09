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
    this.scene.start('UiScene');
    this.scene.start('GameplayScene');
  }

}

export { PreloaderScene };

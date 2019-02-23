export class MainScene extends Phaser.Scene {
  private logoSprite!: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: 'MainScene'
    });
  }

  preload(): void {
    this.load.image('logo', './assets/logo.png');
  }

  create(): void {
    this.logoSprite = this.add.sprite(400, 300, 'logo');
  }
}
